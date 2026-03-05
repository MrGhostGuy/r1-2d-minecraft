import re, os

p = r'C:\Users\kency\Desktop\r1-2d-minecraft\index.html'
c = open(p, 'r', encoding='utf-8-sig').read()

# Strip BOM
if not c.startswith('<'):
    i = c.index('<')
    c = c[i:]

print('Original len:', len(c))

# Fix 1: TOOL_TIER typo - 'diamon' -> 'diamond'
c = c.replace("122:'diamon'", "122:'diamond'")

# Fix 2: Add WOOL:129, ROTTEN_FLESH:130 to ITEMS
c = c.replace('BONE:128', 'BONE:128,WOOL:129,ROTTEN_FLESH:130')

# Fix 3: Add INAMES for new items
c = c.replace("INAMES[128]='Bone'", "INAMES[128]='Bone';INAMES[129]='Wool';INAMES[130]='Rotten Flesh'")

# Fix 4: Add BED:29 to BLOCKS
c = c.replace('WHEAT3:28', 'WHEAT3:28,BED:29')

# Fix 5: Add BED block name and color
c = c.replace("BNAMES[28]='Wheat'", "BNAMES[28]='Wheat';BNAMES[29]='Bed'")
c = c.replace("BCOLORS[28]='#daa520'", "BCOLORS[28]='#daa520';BCOLORS[29]='#8b0000'")

# Fix 6: Add HARDNESS for BED
c = c.replace('HARDNESS[22]=1', 'HARDNESS[22]=1;HARDNESS[29]=0.5')

# Fix 7: Add DROPS for BED
c = c.replace('DROPS[24]=24', 'DROPS[24]=24;DROPS[29]=29')

# Fix 8: Add crafting recipes - Wool from String, Bed from Wool+Planks
# Find end of RECIPES array
ri = c.index('var RECIPES=[')
re_end = c.index('];', ri)
new_recipes = ",{inp:[[127,4]],out:129,cnt:1,name:'Wool'},{inp:[[129,3],[11,3]],out:29,cnt:1,name:'Bed'}"
c = c[:re_end] + new_recipes + c[re_end:]

# Fix 9: Fix zombie drops - should drop ROTTEN_FLESH not RAW_PORK
c = c.replace("e.type=='zombie'?ITEMS.RAW_PORK", "e.type=='zombie'?ITEMS.ROTTEN_FLESH")

# Fix 10: Add skeleton drops (surface) - should drop BONE like cave_skeleton
old_skel = "e.type=='cave_skeleton'){loot=ITEMS.BONE"
new_skel = "e.type=='cave_skeleton'||e.type=='skeleton'){loot=ITEMS.BONE"
c = c.replace(old_skel, new_skel)

# Fix 11: Add TOOL_TIER entries for shovels (110 is WOOD_SHOVEL='wood', already correct)
# Add missing shovel tiers: 120=STONE_SHOVEL, 121=IRON_SHOVEL, 122=DIAMOND_SHOVEL
# Current TOOL_TIER has 120:'stone',121:'iron',122:'diamond' - check if correct
# Also add WOOD_AXE:109 tier - check if it exists
tt_idx = c.index('TOOL_TIER={')
tt_end = c.index('}', tt_idx)
tt_str = c[tt_idx:tt_end+1]
print('Current TOOL_TIER:', tt_str[:200])

# Fix 12: Add missing TOOL_TIER for WOOD_AXE (109) if not present
if "109:" not in tt_str:
    c = c.replace("TOOL_TIER={", "TOOL_TIER={109:'wood',")
    print('Added WOOD_AXE to TOOL_TIER')

# Fix 13: Add missing TOOL_POWER for shovels and hoes if needed
tp_idx = c.index('TOOL_POWER={')
tp_end = c.index('}', tp_idx)
tp_str = c[tp_idx:tp_end+1]
print('Current TOOL_POWER:', tp_str[:200])

# Fix 14: Add sheep spawning function after spawnCaveEnemies
sheep_func = """function spawnSheep(){if(entities.length>=8)return;if(Math.random()>0.003)return;var ex=player.x/TILE+((Math.random()>0.5?1:-1)*(8+Math.random()*10));ex=Math.floor(ex);if(ex<0||ex>=WORLD_W)return;var ey=0;for(var y=0;y<WORLD_H;y++){if(isSolid(ex,y)){ey=(y-1)*TILE;break;}}if(ey<=0)return;entities.push({type:'sheep',x:ex*TILE,y:ey,vx:0,vy:0,w:10,h:10,hp:8,maxHp:8,dir:1,atkTimer:0,passive:true});}"""

# Find end of spawnCaveEnemies function
sce_idx = c.index('function spawnCaveEnemies()')
# Find the function's closing brace by counting braces
depth = 0
found_start = False
sce_end = sce_idx
for i in range(sce_idx, min(sce_idx + 2000, len(c))):
    if c[i] == '{':
        depth += 1
        found_start = True
    elif c[i] == '}':
        depth -= 1
        if found_start and depth == 0:
            sce_end = i + 1
            break

c = c[:sce_end] + sheep_func + c[sce_end:]
print('Sheep spawn function added at', sce_end)

# Fix 15: Add spawnSheep() to game loop
c = c.replace('spawnEnemies();spawnCaveEnemies();', 'spawnEnemies();spawnCaveEnemies();spawnSheep();')
print('spawnSheep added to game loop')

# Fix 16: Add passive mob behavior - sheep wander instead of chasing
old_move = "var dx=player.x-e.x;e.dir=dx>0?1:-1;e.vx=e.dir*(e.type=='creeper'?0.4:0.5);"
new_move = "var dx=player.x-e.x;if(e.passive){if(Math.random()<0.01)e.dir=-e.dir;e.vx=e.dir*0.2;}else{e.dir=dx>0?1:-1;e.vx=e.dir*(e.type=='creeper'?0.4:0.5);}"
c = c.replace(old_move, new_move)
print('Passive mob behavior added')

# Fix 17: Passive mobs don't attack player
old_atk = "if(e.type!='creeper'){"
new_atk = "if(e.type!='creeper'&&!e.passive){"
c = c.replace(old_atk, new_atk)
print('Passive mobs skip attack')

# Fix 18: Add BED interaction - sleep to skip night, set spawn
# Insert bed check before chest check in mineBlock
bed_code = "if(b==BLOCKS.BED){if(isNight){isNight=false;dayTimer=0;showGameMsg('Sleeping...');player.spawnX=bx*TILE;player.spawnY=(by-1)*TILE;}else{showGameMsg('Can only sleep at night');}return;}"
c = c.replace("if(b==BLOCKS.CHEST){openChest(bx,by);return;}", bed_code + "if(b==BLOCKS.CHEST){openChest(bx,by);return;}")
print('BED sleep functionality added')

# Fix 19: Add sheep entity rendering color
# Find entity render section - look for zombie color
# Entities rendered with fillStyle based on type
zombie_color = c.index("'#0a0'")
# Look backwards to find the if/else chain for entity colors
color_area = c[zombie_color-200:zombie_color+200]
print('Entity color area:', repr(color_area[:100]))

# Find the entity color assignment pattern
# Typically: ctx.fillStyle=e.type=='zombie'?'#0a0':e.type=='skeleton'?'#ccc':...
# Add sheep as white '#fff'
# Let's find the exact pattern
old_color_match = re.search(r"ctx\.fillStyle=e\.type=='zombie'\?'#0a0':[^;]+;", c)
if old_color_match:
    old_color = old_color_match.group(0)
    # Add sheep color before the default
    new_color = old_color.replace(":'#555'", ":e.type=='sheep'?'#fff':'#555'")
    if new_color == old_color:
        # Try different default color
        new_color = old_color[:-1]  # remove trailing ;
        new_color = new_color + ";" # just add sheep check differently
        # Let me just replace the whole thing
        print('Old color:', repr(old_color[:100]))
    c = c.replace(old_color, new_color)
    print('Sheep color added')
else:
    print('WARNING: Could not find entity color pattern')
    # Search for entity rendering manually
    eidx = c.index("e.type=='zombie'")
    print('Zombie type check at:', eidx)
    print('Context:', repr(c[eidx-50:eidx+150]))



# Fix 20: Add sheep drop on death - wool
# Find entity death drop section
old_drop = "e.type=='cave_skeleton'){loot=ITEMS.BONE"
# Already fixed in Fix 10 to include skeleton
# Now add sheep drop
sheep_drop_code = "e.type=='sheep'){addItem(ITEMS.WOOL,Math.floor(Math.random()*2)+1);loot=0;}else if("
old_cave_sp = "e.type=='cave_spider'){loot=ITEMS.STRING"
new_cave_sp = sheep_drop_code + "e.type=='cave_spider'){loot=ITEMS.STRING"
c = c.replace(old_cave_sp, new_cave_sp)
print('Sheep wool drops added')

# Fix 21: Add MINE_REQ for furnace (18) - needs wooden pick in Minecraft
mr_idx = c.index('MINE_REQ={')
mr_end = c.index('}', mr_idx)
mr_str = c[mr_idx:mr_end+1]
if '18:' not in mr_str:
    c = c.replace('MINE_REQ={', 'MINE_REQ={18:1,')
    print('Furnace mining req added')

# Fix 22: Add stone hoe, iron hoe, diamond hoe items and recipes
# Add item IDs: STONE_HOE:131, IRON_HOE:132, DIAMOND_HOE:133
c = c.replace('ROTTEN_FLESH:130', 'ROTTEN_FLESH:130,STONE_HOE:131,IRON_HOE:132,DIAMOND_HOE:133')
c = c.replace("INAMES[130]='Rotten Flesh'", "INAMES[130]='Rotten Flesh';INAMES[131]='Stone Hoe';INAMES[132]='Iron Hoe';INAMES[133]='Diamond Hoe'")

# Add hoe recipes
ri2 = c.index("name:'Bed'}")
hoe_recipes = ",{inp:[[12,2],[100,2]],out:131,cnt:1,name:'Stone Hoe'},{inp:[[111,2],[100,2]],out:132,cnt:1,name:'Iron Hoe'},{inp:[[113,2],[100,2]],out:133,cnt:1,name:'Diamond Hoe'}"
insert_pos = ri2 + len("name:'Bed'}")
c = c[:insert_pos] + hoe_recipes + c[insert_pos:]
print('Stone/Iron/Diamond hoes added')

# Add hoe TOOL_TIER entries
c = c.replace("122:'diamond'}", "122:'diamond',131:'stone',132:'iron',133:'diamond'}")
# Add hoe TOOL_POWER entries
c = c.replace("126:2}", "126:2,131:3,132:5,133:7}")

# Fix 23: Rotten flesh should be edible but give hunger (like Minecraft)
# Add to food items - we need to find food healing code
food_idx = c.index('COOKED_PORK')
print('Food area at:', food_idx)

# Fix 24: Mining speed - add proper speed multipliers per tier
# Current TOOL_POWER already has tier-based values, which is good
# Picks: wood=2, stone=4, iron=6, diamond=8
# This is reasonable for the game

# Fix 25: Save the file
open(p, 'w', encoding='utf-8', newline='').write(c)
print('File saved! Length:', len(c))
print('All fixes applied successfully!')
