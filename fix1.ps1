# Comprehensive fix script for r1-2d-minecraft
$path = 'C:\Users\kency\Desktop\r1-2d-minecraft\index.html'
$c = Get-Content $path -Raw

# 1. Strip BOM characters (first 3 garbled chars)
if($c[0] -eq [char]195 -or [int]$c[0] -gt 127) {
    # Find where '<' starts
    $ltIdx = $c.IndexOf('<')
    if($ltIdx -gt 0) { $c = $c.Substring($ltIdx) }
}
Write-Host "1. BOM stripped"

# 2. Fix TOOL_TIER[122]:'diamon' -> 'diamond'
$c = $c.Replace("122:'diamon'", "122:'diamond'")
# Also fix TOOL_TIER[110]:'wood' if it should be different
# Actually 110=WOOD_SHOVEL so 'wood' is correct
Write-Host "2. TOOL_TIER typo fixed"

# 3. Add WOOL item (129) and BED block (29) and SHEEP entity support
# Add WOOL:129 to ITEMS
$c = $c.Replace('BONE:128', 'BONE:128,WOOL:129,ROTTEN_FLESH:130')
Write-Host "3. WOOL and ROTTEN_FLESH items added"

# 4. Add INAMES for new items
$c = $c.Replace("INAMES[128]='Bone'", "INAMES[128]='Bone';INAMES[129]='Wool';INAMES[130]='Rotten Flesh'")
Write-Host "4. INAMES for new items added"

# 5. Add BED block (29) to BLOCKS
$c = $c.Replace('WHEAT3:28', 'WHEAT3:28,BED:29')
Write-Host "5. BED block added"

# 6. Add BED block name/color
# Find BNAMES and BCOLORS to add entry for 29
$c = $c.Replace("BNAMES[28]='Wheat'", "BNAMES[28]='Wheat';BNAMES[29]='Bed'")
$c = $c.Replace("BCOLORS[28]='#daa520'", "BCOLORS[28]='#daa520';BCOLORS[29]='#8b0000'")
Write-Host "6. BED block name and color added"

# 7. Add crafting recipes for new items
# Wool: 4 String -> 1 Wool (Minecraft: string from spiders, wool from sheep or 4 string)
# Bed: 3 Wool + 3 Planks -> 1 Bed
# Stone Hoe, Iron Hoe, Diamond Hoe
# Also add missing hoe recipes

# Find end of RECIPES array to add new recipes
$recipesEnd = $c.IndexOf('];', $c.IndexOf('var RECIPES='))
$newRecipes = ",{inp:[[127,4]],out:129,cnt:1,name:'Wool'},{inp:[[129,3],[11,3]],out:29,cnt:1,name:'Bed'},{inp:[[12,2],[100,2]],out:0,cnt:1,name:'Stone Hoe'},{inp:[[111,2],[100,2]],out:0,cnt:1,name:'Iron Hoe'},{inp:[[113,2],[100,2]],out:0,cnt:1,name:'Diamond Hoe'}"
# Actually we need proper item IDs for stone/iron/diamond hoes
# Current hoes: WOOD_HOE:126, but no STONE_HOE etc. - let's skip those for now and add them properly

# Just add Wool and Bed recipes
$newRecipes2 = ",{inp:[[127,4]],out:129,cnt:1,name:'Wool'},{inp:[[129,3],[11,3]],out:29,cnt:1,name:'Bed'}"
$c = $c.Substring(0, $recipesEnd) + $newRecipes2 + $c.Substring($recipesEnd)
Write-Host "7. Wool and Bed crafting recipes added"

# 8. Add HARDNESS for BED block
$c = $c.Replace('HARDNESS[22]=1', 'HARDNESS[22]=1;HARDNESS[29]=0.5')
Write-Host "8. BED hardness added"

# 9. Add BED drop
$c = $c.Replace('DROPS[24]=24', 'DROPS[24]=24;DROPS[29]=29')
Write-Host "9. BED drop added"

# 10. Fix zombie drops: should drop ROTTEN_FLESH instead of RAW_PORK
$c = $c.Replace("e.type=='zombie'?ITEMS.RAW_PORK", "e.type=='zombie'?ITEMS.ROTTEN_FLESH")
Write-Host "10. Zombie drops fixed to Rotten Flesh"

# 11. Add skeleton surface mob drops (should drop BONE, not just cave_skeleton)
# Current: skeleton type exists but no special drop handling
# Fix the entity drop logic - skeleton should drop bones + arrows too
# The drop code only handles cave_spider, cave_skeleton, zombie, creeper
# Need to add regular skeleton drops
$oldDropCode = "if(e.type=='cave_spider'){loot=ITEMS.STRING;addItem(loot,Math.floor(Math.random()*2)+1);}else if(e.type=='cave_skeleton'){loot=ITEMS.BONE;addItem(loot,Math.floor(Math.random()*2)+1);}else{loot=e.type=='zombie'?ITEMS.ROTTEN_FLESH:e.type=='creeper'?ITEMS.COAL:ITEMS.STICK;addItem(loot,Math.floor(Math.random()*2)+1);}"
$newDropCode = "if(e.type=='cave_spider'){loot=ITEMS.STRING;addItem(loot,Math.floor(Math.random()*2)+1);}else if(e.type=='cave_skeleton'||e.type=='skeleton'){loot=ITEMS.BONE;addItem(loot,Math.floor(Math.random()*2)+1);}else if(e.type=='sheep'){addItem(ITEMS.WOOL,Math.floor(Math.random()*2)+1);}else{loot=e.type=='zombie'?ITEMS.ROTTEN_FLESH:e.type=='creeper'?ITEMS.COAL:ITEMS.STICK;addItem(loot,Math.floor(Math.random()*2)+1);}"
$c = $c.Replace($oldDropCode, $newDropCode)
Write-Host "11. Skeleton and sheep drops added"

# 12. Add sheep spawning - passive mob during daytime
# Find spawnEnemies function and add sheep spawning
$spawnFuncEnd = $c.IndexOf('}', $c.IndexOf('entities.push({type:type,x:ex*TILE'))
$sheepSpawn = @"

}
function spawnSheep(){
if(entities.length>=8)return;
if(Math.random()>0.002)return;
var ex=player.x/TILE+((Math.random()>0.5?1:-1)*(10+Math.random()*10));
ex=Math.floor(ex);if(ex<0||ex>=WORLD_W)return;
var ey=0;for(var y=0;y<WORLD_H;y++){if(isSolid(ex,y)){ey=(y-2)*TILE;break;}}
if(ey<=0)return;
entities.push({type:'sheep',x:ex*TILE,y:ey,vx:0,vy:0,w:10,h:10,hp:8,maxHp:8,dir:1,atkTimer:0,passive:true});
"@
# Actually let me be more careful - let me find the exact end of spawnEnemies
# and add the sheep spawning function after it
$seIdx = $c.IndexOf('function spawnEnemies()')
$seEnd = $c.IndexOf('}', $c.IndexOf('entities.push({type:type,x:ex*TILE', $seIdx))
# Find the closing brace of spawnEnemies properly
# The push line ends with }); then there's a closing } for the function
$pushEnd = $c.IndexOf('});', $c.IndexOf('entities.push({type:type', $seIdx))
$funcEnd = $c.IndexOf('}', $pushEnd + 3) + 1

$sheepFunc = "function spawnSheep(){if(entities.length>=8)return;if(Math.random()>0.003)return;var ex=player.x/TILE+((Math.random()>0.5?1:-1)*(8+Math.random()*10));ex=Math.floor(ex);if(ex<0||ex>=WORLD_W)return;var ey=0;for(var y=0;y<WORLD_H;y++){if(isSolid(ex,y)){ey=(y-2)*TILE;break;}}if(ey<=0)return;entities.push({type:'sheep',x:ex*TILE,y:ey,vx:0,vy:0,w:10,h:10,hp:8,maxHp:8,dir:1,atkTimer:0,passive:true});}"`"
$c = $c.Substring(0, $funcEnd) + "`n" + $sheepFunc + $c.Substring($funcEnd)
Write-Host "12. Sheep spawning function added"

# 13. Add spawnSheep() to game loop
$c = $c.Replace('spawnEnemies();spawnCaveEnemies();', 'spawnEnemies();spawnCaveEnemies();spawnSheep();')
Write-Host "13. spawnSheep added to game loop"

# 14. Fix sheep entity behavior - passive mobs wander randomly, don't attack
# Modify updateEntities to handle passive mobs
$oldMoveCode = '// Move toward player'
$newMoveCode = '// Move toward player or wander (passive)'
$c = $c.Replace($oldMoveCode, $newMoveCode)

# Add passive mob behavior before the attack code
$oldAttackStart = "// Attack player (non-creeper)"
$passiveCheck = "if(e.passive){e.vx=e.dir*0.2;if(Math.random()<0.01)e.dir=-e.dir;}else "
# Actually this needs to go where movement is calculated. Let me be more surgical:
# Current: var dx=player.x-e.x; e.dir=dx>0?1:-1; e.vx=e.dir*(e.type=='creeper'?0.4:0.5);
$oldMove = "var dx=player.x-e.x;`ne.dir=dx>0?1:-1;`ne.vx=e.dir*(e.type=='creeper'?0.4:0.5);"
# The file is minified so newlines are different
$oldMoveMin = "var dx=player.x-e.x;e.dir=dx>0?1:-1;e.vx=e.dir*(e.type=='creeper'?0.4:0.5);"
$newMoveMin = "var dx=player.x-e.x;if(e.passive){if(Math.random()<0.01)e.dir=-e.dir;e.vx=e.dir*0.2;}else{e.dir=dx>0?1:-1;e.vx=e.dir*(e.type=='creeper'?0.4:0.5);}"
$c = $c.Replace($oldMoveMin, $newMoveMin)
Write-Host "14. Passive mob behavior added"

# 15. Skip attack for passive mobs
$oldAttack = "if(e.type!='creeper'){"
$newAttack = "if(e.type!='creeper'&&!e.passive){"
$c = $c.Replace($oldAttack, $newAttack)
Write-Host "15. Passive mobs don't attack"

# 16. Add BED functionality - set spawn point and skip night
# Add bed placement handling in placeBlock or a special interact
# When player interacts with bed, set spawn and skip to day
$bedInteract = "if(b==BLOCKS.BED){if(isNight){isNight=false;dayTimer=0;showGameMsg('Sleeping...');player.spawnX=bx*TILE;player.spawnY=by*TILE;}else{showGameMsg('Can only sleep at night');}return;}"
# Insert this in mineBlock after the chest check
$c = $c.Replace("if(b==BLOCKS.CHEST){openChest(bx,by);return;}", "if(b==BLOCKS.CHEST){openChest(bx,by);return;}$bedInteract")
Write-Host "16. BED sleep functionality added"

# 17. Add sheep rendering - white rectangle
$renderEntIdx = $c.IndexOf('function renderEntities(')
if($renderEntIdx -eq -1) { $renderEntIdx = $c.IndexOf('// Render entities') }
# Find entity rendering code to add sheep appearance
# Entities are probably rendered in the render function
$sheepRender = $c.IndexOf("'sheep'")
Write-Host "17. Sheep render check: $sheepRender"

# 18. Add proper entity colors/rendering for sheep
# Look for entity rendering to add sheep color
$entColorIdx = $c.IndexOf("e.type=='zombie'")
Write-Host "Entity color at: $entColorIdx"
# Find the rendering section
$renderIdx = $c.IndexOf("'#0a0'") # zombie green color
Write-Host "Zombie color render: $renderIdx"

# Save current state for inspection
[System.IO.File]::WriteAllText($path, $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "`nFile saved! Size: $($c.Length)"
Write-Host "Done with Phase 1 fixes"
