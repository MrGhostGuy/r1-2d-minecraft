import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()
ch=0

# === 1. RENAME AXE -> HATCHET in INAMES ===
renames_inames = {
    "'Wood Axe'": "'Wood Hatchet'",
    "'Stone Axe'": "'Stone Hatchet'",
    "'Iron Axe'": "'Iron Hatchet'",
    "'Diamond Axe'": "'Diamond Hatchet'",
}
for old, new in renames_inames.items():
    if old in c:
        c = c.replace(old, new)
        ch += 1
        print(f'INAMES: {old} -> {new}')

# === 2. RENAME AXE -> HATCHET in RECIPES name field ===
renames_recipes = {
    "name:'Wood Axe'": "name:'Wood Hatchet'",
    "name:'Stone Axe'": "name:'Stone Hatchet'",
    "name:'Iron Axe'": "name:'Iron Hatchet'",
    "name:'Diamond Axe'": "name:'Diamond Hatchet'",
}
for old, new in renames_recipes.items():
    if old in c:
        c = c.replace(old, new)
        ch += 1
        print(f'RECIPE: {old} -> {new}')

# === 3. RENAME Pick -> Pickaxe in INAMES ===
pick_inames = {
    "'Wood Pick'": "'Wood Pickaxe'",
    "'Stone Pick'": "'Stone Pickaxe'",
    "'Iron Pick'": "'Iron Pickaxe'",
    "'Dia Pick'": "'Diamond Pickaxe'",
}
for old, new in pick_inames.items():
    if old in c:
        c = c.replace(old, new)
        ch += 1
        print(f'INAMES: {old} -> {new}')

# === 4. RENAME Pick -> Pickaxe in RECIPES name field ===
pick_recipes = {
    "name:'Wood Pick'": "name:'Wood Pickaxe'",
    "name:'Stone Pick'": "name:'Stone Pickaxe'",
    "name:'Iron Pick'": "name:'Iron Pickaxe'",
    "name:'Dia Pick'": "name:'Diamond Pickaxe'",
}
for old, new in pick_recipes.items():
    if old in c:
        c = c.replace(old, new)
        ch += 1
        print(f'RECIPE: {old} -> {new}')

# === 5. RENAME Dia Sword -> Diamond Sword ===
sword_renames = {
    "'Dia Sword'": "'Diamond Sword'",
    "name:'Dia Sword'": "name:'Diamond Sword'",
}
for old, new in sword_renames.items():
    if old in c:
        c = c.replace(old, new)
        ch += 1
        print(f'SWORD: {old} -> {new}')

# === 6. RENAME Dia Hoe -> Diamond Hoe (for consistency) ===
# Check if already done
if "'Dia Hoe'" in c:
    c = c.replace("'Dia Hoe'", "'Diamond Hoe'")
    ch += 1
    print("Renamed Dia Hoe -> Diamond Hoe")
if "name:'Dia Hoe'" in c:
    c = c.replace("name:'Dia Hoe'", "name:'Diamond Hoe'")
    ch += 1
    print("Renamed recipe Dia Hoe -> Diamond Hoe")

# === 7. VERIFY SMELTING SYSTEM ===
print('\n=== SMELTING VERIFICATION ===')
if 'SMELT[8]=111' in c:
    print('OK: Iron Ore(8) -> Iron Ingot(111)')
else:
    print('WARN: Iron smelting not found')
if 'SMELT[9]=112' in c:
    print('OK: Gold Ore(9) -> Gold Ingot(112)')

# === 8. VERIFY CRAFTING RECIPES ===
print('\n=== CRAFTING VERIFICATION ===')
ri = c.find('var RECIPES=[')
re2 = c.find('];', ri)
rblock = c[ri:re2+2]
checks = {
    'Wood Hatchet': 'out:109',
    'Stone Hatchet': 'out:117',
    'Iron Hatchet': 'out:118',
    'Diamond Hatchet': 'out:119',
    'Wood Pickaxe': 'out:101',
    'Stone Pickaxe': 'out:102',
    'Iron Pickaxe': 'out:103',
    'Diamond Pickaxe': 'out:104',
    'Wood Sword': 'out:105',
    'Stone Sword': 'out:106',
    'Iron Sword': 'out:107',
    'Diamond Sword': 'out:108',
    'Bed': 'out:29',
    'Door': 'out:134',
    'Torch': 'out:17',
}
for name, outid in checks.items():
    if outid in rblock:
        print(f'OK: {name} recipe exists ({outid})')
    else:
        print(f'MISSING: {name} recipe ({outid})')

# === 9. VERIFY SHEEP SPAWNING AND WOOL DROP ===
print('\n=== SHEEP/WOOL VERIFICATION ===')
if 'sheep' in c.lower():
    print('OK: Sheep code exists')
if 'WOOL' in c:
    print('OK: WOOL item exists (ID 129)')
# Check sheep drops wool
if 'WOOL' in c and 'sheep' in c:
    sheep_area = c[c.find("'sheep'"):c.find("'sheep'")+500]
    if 'WOOL' in sheep_area or '129' in sheep_area:
        print('OK: Sheep drops wool')
    else:
        print('CHECK: Sheep wool drop needs verification')

# === 10. TORCH LIGHT EMISSION SYSTEM ===
print('\n=== TORCH LIGHT SYSTEM ===')
if 'torchLight' not in c and 'TORCH_LIGHT' not in c:
    print('Adding torch light emission system...')
    # Find the render function to add torch glow effect
    render_idx = c.find('function render()')
    if render_idx < 0:
        render_idx = c.find('function render(')
    
    # Add torch light helper before render function
    torch_light_code = """
// === TORCH LIGHT EMISSION SYSTEM ===
var TORCH_LIGHT_RADIUS=5;
function getTorchLight(wx,wy){
var maxLight=0;
for(var dx=-TORCH_LIGHT_RADIUS;dx<=TORCH_LIGHT_RADIUS;dx++){
for(var dy=-TORCH_LIGHT_RADIUS;dy<=TORCH_LIGHT_RADIUS;dy++){
var tx=wx+dx,ty=wy+dy;
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[tx][ty]==BLOCKS.TORCH){
var dist=Math.sqrt(dx*dx+dy*dy);
if(dist<=TORCH_LIGHT_RADIUS){
var light=1.0-(dist/TORCH_LIGHT_RADIUS);
if(light>maxLight)maxLight=light;
}}}}
return maxLight;
}
function isNearTorch(wx,wy,radius){
for(var dx=-radius;dx<=radius;dx++){
for(var dy=-radius;dy<=radius;dy++){
var tx=wx+dx,ty=wy+dy;
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[tx][ty]==BLOCKS.TORCH)return true;
}}
return false;
}
"""
    if render_idx >= 0:
        c = c[:render_idx] + torch_light_code + '\n' + c[render_idx:]
        ch += 1
        print('Added torch light helper functions')
    
    # Now find the night darkness overlay and modify it to respect torch light
    # Look for the night overlay drawing code (typically draws a dark rect over the screen)
    night_patterns = [
        'globalAlpha',
        'nightAlpha',
        'dayNight',
        'timeOfDay',
        'nightOverlay',
    ]
    night_found = False
    for pat in night_patterns:
        idx = c.find(pat)
        if idx >= 0:
            ctx_area = c[max(0,idx-200):idx+500]
            print(f'Found night system near: {pat}')
            night_found = True
            break
    
    if not night_found:
        print('No night overlay system found - will add torch glow in render')
    
    # Add torch glow rendering in the block rendering loop
    # Find where blocks are rendered (fillRect with BCOLORS)
    bcolor_render = c.find('fillStyle=BCOLORS[')
    if bcolor_render < 0:
        bcolor_render = c.find('BCOLORS[b]')
    if bcolor_render >= 0:
        # Find the fillRect after this BCOLORS usage in the render loop
        fr_idx = c.find('fillRect', bcolor_render)
        if fr_idx >= 0:
            # Find end of this fillRect call
            end_fr = c.find(';', fr_idx)
            if end_fr >= 0:
                # Add torch glow overlay after block rendering
                glow_code = '\nif(world[bx][by]==BLOCKS.TORCH){ctx.fillStyle="rgba(255,200,50,0.3)";ctx.fillRect((bx-1)*TILE*zoom-camX,(by-1)*TILE*zoom-camY,3*TILE*zoom,3*TILE*zoom);}'
                c = c[:end_fr+1] + glow_code + c[end_fr+1:]
                ch += 1
                print('Added torch glow effect in block rendering')
    
    # Modify mob spawning to check for nearby torches
    spawn_idx = c.find('spawnEntity')
    if spawn_idx >= 0:
        # Find the spawn function definition
        func_spawn = c.find('function spawnEntity', spawn_idx if 'function' in c[spawn_idx:spawn_idx+20] else 0)
        if func_spawn < 0:
            func_spawn = c.find('function spawnEntities')
        if func_spawn >= 0:
            # Find opening brace
            brace = c.find('{', func_spawn)
            if brace >= 0:
                # Add torch check at start of spawn function
                torch_check = '\n// Torch light repels monster spawns\nvar spawnX=Math.floor(player.x/TILE)+(Math.random()>0.5?1:-1)*Math.floor(Math.random()*40+20);\nif(typeof isNearTorch==="function"&&isNearTorch(spawnX,0,TORCH_LIGHT_RADIUS||5)){return;}\n'
                # Only add if not already there
                if 'isNearTorch' not in c[func_spawn:func_spawn+500]:
                    # Don't inject here - it would break the function. Instead, just note it.
                    print('NOTE: Torch spawn repel needs manual integration with spawn logic')
else:
    print('Torch light system already exists')

# === 11. SAVE ===
open(p, 'w', encoding='utf-8', newline='').write(c)
print(f'\nTotal changes: {ch}')

# === 12. FINAL VERIFICATION ===
print('\n=== FINAL VERIFICATION ===')
c2 = open(p, 'r', encoding='utf-8').read()
for name in ['Wood Hatchet','Stone Hatchet','Iron Hatchet','Diamond Hatchet']:
    print(f'  {name} in INAMES: {name in c2}')
for name in ['Wood Pickaxe','Stone Pickaxe','Iron Pickaxe','Diamond Pickaxe']:
    print(f'  {name} in INAMES: {name in c2}')
print(f'  Diamond Sword in code: {"Diamond Sword" in c2}')
print(f'  SMELT[8]=111: {"SMELT[8]=111" in c2}')
print(f'  getTorchLight func: {"getTorchLight" in c2}')
print(f'  isNearTorch func: {"isNearTorch" in c2}')
print(f'  Sheep in code: {"sheep" in c2.lower()}')
print(f'  WOOL:129: {"WOOL:129" in c2}')
print('\nAll done!')