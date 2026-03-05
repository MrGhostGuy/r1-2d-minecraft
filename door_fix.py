p = 'index.html'
f = open(p, 'r', encoding='utf-8')
c = f.read()
f.close()
changes = 0

# 1) Fix updateEntities null check
ue = c.find('function updateEntities')
if ue >= 0:
    nc = c.find('if(!e)continue;', ue, ue+200)
    if nc < 0:
        old = 'var e=entities[i];'
        idx = c.find(old, ue)
        if idx >= 0:
            c = c[:idx+len(old)] + '\nif(!e)continue;' + c[idx+len(old):]
            changes += 1
            print('Fixed updateEntities null check')
    else:
        print('OK: null check exists')

# 2) Add DOOR_ITEM to ITEMS
if 'DOOR_ITEM' not in c:
    c = c.replace('DIAMOND_HOE:133}', 'DIAMOND_HOE:133,DOOR_ITEM:134}')
    changes += 1
    print('Added DOOR_ITEM:134')
else:
    print('OK: DOOR_ITEM exists')

# 3) Make DOOR solid in isSolid (remove exception)
if 'b!=BLOCKS.DOOR&&' in c:
    c = c.replace('b!=BLOCKS.DOOR&&', '')
    changes += 1
    print('Made DOOR solid in isSolid')
else:
    print('OK: DOOR already solid or not found')

# 4) Add door helper functions before isSolid
door_code = """var doorStates={};
function isDoorBlock(x,y){if(x<0||x>=WORLD_W||y<0||y>=WORLD_H)return false;return world[x][y]===BLOCKS.DOOR;}
function openDoor(x,y){var k=x+','+y;doorStates[k]={open:true,timer:0.6};}
function isDoorOpen(x,y){var k=x+','+y;return doorStates[k]&&doorStates[k].open;}
function updateDoors(dt){for(var k in doorStates){if(doorStates[k].open){doorStates[k].timer-=dt;if(doorStates[k].timer<=0){doorStates[k].open=false;delete doorStates[k];}}}}
function isSolidForPlayer(x,y){if(isDoorBlock(x,y))return false;return isSolid(x,y);}
function isSolidForEnemy(x,y){return isSolid(x,y);}
"""
if 'doorStates' not in c:
    idx = c.find('\nisSolid')
    if idx < 0:
        idx = c.find('isSolid(x,y)')
        idx = c.rfind('\n', 0, idx)
    c = c[:idx] + '\n' + door_code + c[idx:]
    changes += 1
    print('Added door helper functions')
else:
    print('OK: door helpers exist')

# 5) Add door auto-open in updatePlayer
up = c.find('function updatePlayer')
if up >= 0 and 'isDoorBlock' not in c[up:up+3000]:
    brace = c.find('{', up)
    door_logic = """
// Door auto-open for player
var ptx1=Math.floor(player.x/TILE),ptx2=Math.floor((player.x+player.w)/TILE);
var pty1=Math.floor(player.y/TILE),pty2=Math.floor((player.y+player.h)/TILE);
for(var ddx=ptx1;ddx<=ptx2;ddx++){for(var ddy=pty1;ddy<=pty2;ddy++){if(isDoorBlock(ddx,ddy)){openDoor(ddx,ddy);}}}
// Also check 1 tile ahead based on movement direction
var aheadX=Math.floor((player.x+(player.vx>0?player.w+2:-2))/TILE);
for(var ddy2=pty1;ddy2<=pty2;ddy2++){if(isDoorBlock(aheadX,ddy2)){openDoor(aheadX,ddy2);}}
"""
    c = c[:brace+1] + door_logic + c[brace+1:]
    changes += 1
    print('Added door auto-open in updatePlayer')

# 6) Replace isSolid with isSolidForPlayer in updatePlayer
up2 = c.find('function updatePlayer')
if up2 >= 0:
    nf = c.find('\nfunction ', up2 + 20)
    if nf < 0:
        nf = len(c)
    chunk = c[up2:nf]
    new_chunk = chunk.replace('isSolid(', 'isSolidForPlayer(')
    if new_chunk != chunk:
        c = c[:up2] + new_chunk + c[nf:]
        changes += 1
        print('Replaced isSolid with isSolidForPlayer in updatePlayer')

# 7) Replace isSolid with isSolidForEnemy in updateEntities
ue2 = c.find('function updateEntities')
if ue2 >= 0:
    nf2 = c.find('\nfunction ', ue2 + 20)
    if nf2 < 0:
        nf2 = len(c)
    chunk2 = c[ue2:nf2]
    new_chunk2 = chunk2.replace('isSolid(', 'isSolidForEnemy(')
    if new_chunk2 != chunk2:
        c = c[:ue2] + new_chunk2 + c[nf2:]
        changes += 1
        print('Replaced isSolid with isSolidForEnemy in updateEntities')

# 8) Add updateDoors(dt) in gameLoop
if 'updateDoors(dt)' not in c:
    gl = c.find('updateEntities(dt)')
    if gl >= 0:
        c = c[:gl] + 'updateDoors(dt);' + c[gl:]
        changes += 1
        print('Added updateDoors in gameLoop')

# 9) Add door rendering in drawBlock
db = c.find('function drawBlock')
if db >= 0 and 'BLOCKS.DOOR' not in c[db:db+500]:
    brace2 = c.find('{', db)
    render = """
if(b===BLOCKS.DOOR){var dk=wx+','+wy;var dOpen=window.doorStates&&window.doorStates[dk]&&window.doorStates[dk].open;if(dOpen){ctx.fillStyle='rgba(139,69,19,0.3)';ctx.fillRect(sx,sy,TILE*zoom,TILE*zoom);ctx.strokeStyle='#8B4513';ctx.lineWidth=1;ctx.strokeRect(sx+1,sy+1,TILE*zoom-2,TILE*zoom-2);}else{ctx.fillStyle='#8B4513';ctx.fillRect(sx,sy,TILE*zoom,TILE*zoom);ctx.fillStyle='#A0522D';ctx.fillRect(sx+2,sy+2,TILE*zoom-4,TILE*zoom-4);ctx.fillStyle='#654321';ctx.fillRect(sx+TILE*zoom*0.7,sy+TILE*zoom*0.45,3,3);}return;}
"""
    c = c[:brace2+1] + render + c[brace2+1:]
    changes += 1
    print('Added door rendering')

# 10) Add door placement in placeBlock
pb = c.find('function placeBlock')
if pb >= 0 and 'DOOR_ITEM' not in c[pb:pb+2000]:
    pl = c.find('if(held.id>0&&held.id<100){', pb)
    if pl >= 0:
        dp = 'if(held.id===134){world[bx][by]=BLOCKS.DOOR;if(gameMode!=="creative"){held.count--;if(held.count<=0){held.id=0;held.count=0;}}return;}\n'
        c = c[:pl] + dp + c[pl:]
        changes += 1
        print('Added door placement in placeBlock')

# 11) Add door crafting recipe
rec = c.find('recipes=[')
if rec >= 0 and 'DOOR_ITEM' not in c[rec:rec+3000]:
    rend = c.find('];', rec)
    if rend >= 0:
        recipe = ',{result:{id:134,count:1},ingredients:[{id:11,count:6}]}'
        c = c[:rend] + recipe + c[rend:]
        changes += 1
        print('Added door recipe (6 planks)')

# 12) Add enemy bounce off doors
ue3 = c.find('function updateEntities')
if ue3 >= 0 and 'doorBounce' not in c:
    mv = c.find('e.x+=', ue3)
    if mv >= 0:
        eol = c.find(';', mv)
        bounce = '\nvar etx=Math.floor(e.x/TILE),ety=Math.floor(e.y/TILE);var etx2=Math.floor((e.x+e.w)/TILE);if(isDoorBlock(etx,ety)||isDoorBlock(etx2,ety)){e.x-=e.vx*dt*2;e.vx=-e.vx;/*doorBounce*/}'
        c = c[:eol+1] + bounce + c[eol+1:]
        changes += 1
        print('Added enemy door bounce')

# 13) Add BNAMES for door
if "BNAMES[23]" not in c:
    bn = c.find("BNAMES[22]=")
    if bn >= 0:
        eol2 = c.find(';', bn)
        c = c[:eol2+1] + "BNAMES[23]='Door';" + c[eol2+1:]
        changes += 1
        print('Added BNAMES[23]=Door')

# 14) Add door item name in getItemName or similar
if "'Door'" not in c[c.find('getItemName'):c.find('getItemName')+500] if c.find('getItemName') >= 0 else True:
    gin = c.find('function getItemName')
    if gin >= 0:
        gbrace = c.find('{', gin)
        c = c[:gbrace+1] + "if(id===134)return'Door';" + c[gbrace+1:]
        changes += 1
        print('Added Door name in getItemName')

# Save
open(p, 'w', encoding='utf-8', newline='').write(c)
print(f'\nTotal changes: {changes}')
print('Door mechanics complete!')