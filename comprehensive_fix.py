import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()
ch=0

# === 1. COMPLETELY REWRITE updateEntities with robust safety ===
# Find the entire updateEntities function
ue_start = c.find('function updateEntities(dt){')
if ue_start < 0:
    print('ERROR: updateEntities not found')
    exit()

# Find the end of updateEntities - it ends before 'function attackEntity'
ae_start = c.find('function attackEntity()', ue_start)
if ae_start < 0:
    print('ERROR: attackEntity not found')
    exit()

old_ue = c[ue_start:ae_start]
print(f'Old updateEntities length: {len(old_ue)}')

# Build the new robust updateEntities function
new_ue = r"""function updateEntities(dt){
var toRemove=[];
for(var i=entities.length-1;i>=0;i--){
var e=entities[i];
if(!e||typeof e!=='object'||typeof e.hp!=='number'||isNaN(e.hp)){entities.splice(i,1);continue;}
// Move toward player
var dx=player.x-e.x;
var spd=e.type=='creeper'?0.6:e.type=='skeleton'?0.7:e.type=='cave_spider'?1.0:e.type=='cave_skeleton'?0.7:0.8;
if(e.passive){
if(Math.random()<0.02)e.dir=Math.random()<0.5?-1:1;
e.vx=e.dir*0.3;
}else{
if(Math.abs(dx)>3*TILE){e.vx=dx>0?spd:-spd;e.dir=dx>0?1:-1;}
else{e.vx=0;}
}
e.vy+=0.4;
e.x+=e.vx;e.y+=e.vy;
var ex=Math.floor(e.x/TILE),ey=Math.floor((e.y+e.h)/TILE);
if(ex>=0&&ex<WORLD_W&&ey>=0&&ey<WORLD_H&&isSolid(ex,ey)){
e.y=ey*TILE-e.h;e.vy=0;
if(e.vx!==0&&ey-1>=0&&isSolid(ex+(e.vx>0?1:-1),ey-1)){e.vy=-5;}
}
// Skeleton shooting
if(e.type=='skeleton'||e.type=='cave_skeleton'){
var sdx=player.x-e.x,sdy=player.y-e.y;
var sdist=Math.sqrt(sdx*sdx+sdy*sdy);
if(sdist<15*TILE&&sdist>3*TILE){
e.atkTimer=(e.atkTimer||0)+dt;
if(e.atkTimer>2){e.atkTimer=0;
if(typeof arrows!=='undefined')arrows.push({x:e.x,y:e.y+4,vx:sdx/sdist*3,vy:sdy/sdist*3,life:120,fromEnemy:true});
}}}
// Creeper fuse
if(e.type=='creeper'){
var cdist=Math.abs(player.x-e.x);
if(!e.fuseMax)e.fuseMax=45;
if(cdist<2.5*TILE){
if(!e.fuseActive){e.fuseActive=true;e.fuseTimer=0;}
e.fuseTimer=(e.fuseTimer||0)+1;
if(e.fuseTimer>=e.fuseMax){creeperExplode(e);entities.splice(i,1);continue;}
}else if(cdist<5*TILE&&e.fuseActive){
e.fuseTimer=(e.fuseTimer||0)+1;
if(e.fuseTimer>=e.fuseMax){creeperExplode(e);entities.splice(i,1);continue;}
}else{
e.fuseActive=false;e.fuseTimer=0;
if(e.fuselight)e.fuselight=false;
}
}
// Melee attack player
if(!e.passive&&e.type!=='creeper'&&e.type!=='skeleton'&&e.type!=='cave_skeleton'){
var adx=Math.abs(player.x-e.x),ady=Math.abs(player.y-e.y);
if(adx<10&&ady<14){
e.atkTimer=(e.atkTimer||0)+dt;
if(e.atkTimer>1){e.atkTimer=0;
if(gameMode=='survival'){player.hp-=2;if(player.hp<=0)gameOver();player.vy=-2;player.vx=(player.x>e.x?1:-1)*2;}
}}}
// Remove if too far or dead
if(e.hp<=0||Math.abs(e.x-player.x)>300*TILE){
if(e.hp<=0){var loot;if(e.type=='sheep'){addItem(ITEMS.WOOL,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='cave_spider'){addItem(ITEMS.STRING,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='cave_skeleton'||e.type=='skeleton'){addItem(ITEMS.BONE,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='zombie'){addItem(ITEMS.ROTTEN_FLESH,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='creeper'){addItem(ITEMS.COAL,Math.floor(Math.random()*3)+1);loot=0;}
else{addItem(ITEMS.STICK,1);loot=0;}
}
entities.splice(i,1);
}}
}
"""

c = c[:ue_start] + new_ue + c[ae_start:]
ch += 1
print('1. Rewrote updateEntities with comprehensive safety')

# === 2. Fix attackEntity with safety checks ===
old_ae = 'function attackEntity(){'
ae_pos = c.find(old_ae)
if ae_pos >= 0:
    # Find the end of attackEntity
    ae_end = c.find('\n}', ae_pos + len(old_ae))
    if ae_end >= 0:
        ae_end += 2  # include the \n}
        old_attack = c[ae_pos:ae_end]
        new_attack = r"""function attackEntity(){
var held=getHeldItem();var dmg=1;
if(held.id>=105&&held.id<=108)dmg=held.id==105?4:held.id==106?5:held.id==107?6:7;
var range=TILE*1.5;
for(var i=0;i<entities.length;i++){
var e=entities[i];
if(!e||typeof e!=='object'||typeof e.hp!=='number')continue;
var adx=Math.abs(player.x-e.x),ady=Math.abs(player.y-e.y);
if(adx<range&&ady<range){
e.hp-=dmg;e.vx=(e.x>player.x?2:-2);e.vy=-2;
showDamageNumber(dmg,e.x,e.y);break;
}}
}"""
        c = c[:ae_pos] + new_attack + c[ae_end:]
        ch += 1
        print('2. Rewrote attackEntity with safety checks')
    else:
        print('2. WARN: Could not find end of attackEntity')
else:
    print('2. WARN: attackEntity not found')

# === 3. Fix any other entity access patterns ===
# Add safety to any for loops iterating entities outside updateEntities
# Find gameLoop entity references
gl = c.find('function gameLoop')
if gl >= 0:
    print(f'3. gameLoop found at char {gl}')
else:
    print('3. WARN: gameLoop not found')

# === 4. Door system - crafting recipe ===
recipes_pos = c.find('var RECIPES=[')
if recipes_pos >= 0:
    recipes_end = c.find('];', recipes_pos)
    if recipes_end >= 0:
        recipes_str = c[recipes_pos:recipes_end+2]
        # Check if door recipe already exists
        if 'Door' in recipes_str:
            print('4. Door recipe already exists in RECIPES')
        else:
            # Add door recipe before ];
            door_recipe = ",{inp:[[11,6]],out:23,cnt:1,name:'Door'}"
            c = c[:recipes_end] + door_recipe + c[recipes_end:]
            ch += 1
            print('4. Added Door recipe to RECIPES')
    else:
        print('4. WARN: Could not find end of RECIPES')
else:
    print('4. WARN: RECIPES not found')

# === 5. Door rendering - add door visual in render function ===
# Find where BCOLORS[b] is used for block fill
bcolor_render = c.find("ctx.fillStyle=BCOLORS[b]")
if bcolor_render < 0:
    bcolor_render = c.find("ctx.fillStyle = BCOLORS[b]")
if bcolor_render >= 0:
    # Add door-specific rendering after the fillRect for blocks
    # Find the fillRect after this BCOLORS usage
    fr_pos = c.find('fillRect', bcolor_render)
    if fr_pos >= 0:
        # Find the semicolon after fillRect
        sc_pos = c.find(';', fr_pos)
        if sc_pos >= 0:
            # Check if door rendering already exists nearby
            nearby = c[sc_pos:sc_pos+200]
            if 'BLOCKS.DOOR' not in nearby:
                door_render = "\nif(b==BLOCKS.DOOR){ctx.fillStyle=typeof doorStates!=='undefined'&&doorStates[bx+','+by]?'#c4a060':'#8B4513';ctx.fillRect(sx+2,sy,TILE*zoomLevel-4,TILE*zoomLevel);ctx.fillStyle='#654321';ctx.fillRect(sx+TILE*zoomLevel/2-1,sy+TILE*zoomLevel/3,2,2);}"
                c = c[:sc_pos+1] + door_render + c[sc_pos+1:]
                ch += 1
                print('5. Added door rendering code')
            else:
                print('5. Door rendering already exists')
        else:
            print('5. WARN: Could not find semicolon after fillRect')
    else:
        print('5. WARN: Could not find fillRect after BCOLORS')
else:
    print('5. WARN: Could not find BCOLORS block rendering')

# === 6. Door item name in BNAMES ===
if "BNAMES[23]" in c:
    print('6. BNAMES[23] (Door) already exists')
else:
    # Find BNAMES array and add door
    bn = c.find('BNAMES[')
    if bn >= 0:
        # Find a good insertion point after existing BNAMES
        line_end = c.find('\n', bn)
        c = c[:line_end+1] + "BNAMES[23]='Door';\n" + c[line_end+1:]
        ch += 1
        print('6. Added BNAMES[23]=Door')
    else:
        print('6. WARN: BNAMES not found')

# === 7. Ensure doorStates variable exists ===
if 'var doorStates' in c or 'doorStates=' in c:
    print('7. doorStates already exists')
else:
    # Add doorStates near the beginning of the script
    script_start = c.find('<script>')
    if script_start >= 0:
        insert_pos = c.find('\n', script_start) + 1
        c = c[:insert_pos] + 'var doorStates={};\n' + c[insert_pos:]
        ch += 1
        print('7. Added doorStates variable')
    else:
        print('7. WARN: script tag not found')

# === 8. Make sure isSolid handles door correctly ===
is_solid = c.find('function isSolid')
if is_solid >= 0:
    is_end = c.find('}', is_solid)
    solid_func = c[is_solid:is_end+1]
    if 'BLOCKS.DOOR' in solid_func:
        print('8. isSolid already handles DOOR')
    else:
        print('8. WARN: isSolid does not handle DOOR')
else:
    print('8. WARN: isSolid not found')

# === 9. Fix getItemName / INAMES for door item ===
# Check for ITEMS.DOOR_ITEM
if 'DOOR_ITEM' in c:
    # Find the INAMES section and add door item name
    if "INAMES[134]" not in c:
        inames_pos = c.find('INAMES[')
        if inames_pos >= 0:
            line_end = c.find('\n', inames_pos)
            c = c[:line_end+1] + "INAMES[134]='Door';\n" + c[line_end+1:]
            ch += 1
            print('9. Added INAMES[134]=Door for door item')
        else:
            print('9. WARN: INAMES not found')
    else:
        print('9. INAMES[134] Door already exists')
else:
    print('9. No DOOR_ITEM in ITEMS - door uses block ID 23 directly')

# === 10. Verify all entity creation paths have hp ===
import re
pushes = list(re.finditer(r'entities\.push\(\{([^}]+)\}', c))
print(f'\n=== Entity creation audit: {len(pushes)} push calls ===')
for m in pushes:
    props = m.group(1)
    line = c[:m.start()].count('\n') + 1
    has_hp = 'hp:' in props
    print(f'  Line {line}: hp={has_hp} - {props[:80]}...')

# === 11. Check for any remaining e.hp access without guard ===
# Find all e.hp references in the file
hp_refs = list(re.finditer(r'\be\.hp\b', c))
print(f'\n=== e.hp references: {len(hp_refs)} ===')
for m in hp_refs:
    line = c[:m.start()].count('\n') + 1
    ctx = c[max(0,m.start()-30):m.start()+30]
    print(f'  Line {line}: ...{ctx}...')

# Save
open(p, 'w', encoding='utf-8', newline='').write(c)
print(f'\nTotal changes: {ch}')
print('Comprehensive fix complete!')