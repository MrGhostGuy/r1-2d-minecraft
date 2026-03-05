import re
p = r'C:\Users\kency\Desktop\r1-2d-minecraft\index.html'
c = open(p, 'r', encoding='utf-8').read()
print('Len:', len(c))

# Fix A: Add TOOL_POWER for hoes (individual assignment style)
# Find last TOOL_POWER assignment to append after it
tp_last = c.rfind('TOOL_POWER[')
tp_end = c.index(';', tp_last) + 1
hoe_powers = 'TOOL_POWER[126]=2;TOOL_POWER[131]=3;TOOL_POWER[132]=5;TOOL_POWER[133]=7;'
c = c[:tp_end] + hoe_powers + c[tp_end:]
print('A: Hoe TOOL_POWER added')

# Fix B: Add TOOL_TIER for hoes (individual entries in object literal)
# TOOL_TIER is object literal: {101:'wood',...,133:'diamond'}
# We already added 131:'stone',132:'iron',133:'diamond' but check
if "131:'stone'" not in c:
    c = c.replace("133:'diamond'}", "131:'stone',132:'iron',133:'diamond'}")
    print('B: Hoe TOOL_TIER added')
else:
    print('B: Hoe TOOL_TIER already present')

# Fix C: Add sheep entity rendering color
# Find entity color rendering - entities use fillStyle based on type
# Pattern: ctx.fillStyle=...zombie...skeleton...creeper...
# Find where entity rendering colors are assigned
color_match = re.search(r"ctx\.fillStyle=(e\.type[^;]+);", c)
if color_match:
    old = color_match.group(0)
    print('C: Found color:', old[:80])
    # Add sheep as white before the fallback color
    if "'sheep'" not in old:
        new = old.replace("'#555'", "e.type=='sheep'?'#fff':'#555'")
        if new == old:
            new = old.replace("'#a00'", "e.type=='sheep'?'#fff':'#a00'")
        if new != old:
            c = c.replace(old, new)
            print('C: Sheep color added')
        else:
            print('C: Could not add sheep color automatically')
            print('C: Full match:', old)
else:
    print('C: No entity color pattern found, searching manually')
    # Try to find renderEntities or entity render code
    idx = c.find("e.type=='zombie'")
    while idx != -1:
        ctx = c[max(0,idx-80):idx+120]
        if 'fillStyle' in ctx:
            print('C: Found at', idx, ':', repr(ctx))
            break
        idx = c.find("e.type=='zombie'", idx+1)


# Fix D: Add SWORD_DMG for missing swords if needed
sd_idx = c.find('SWORD_DMG')
if sd_idx > 0:
    sd_area = c[sd_idx:sd_idx+200]
    print('D: SWORD_DMG area:', sd_area[:100])

# Fix E: Make sure isSolid handles BED block (29) as non-solid walkable
# BED should be non-solid (you can walk through the top)
solid_idx = c.find('function isSolid')
if solid_idx > 0:
    solid_area = c[solid_idx:solid_idx+200]
    print('E: isSolid:', solid_area[:150])

# Fix F: Add BCOLORS for WOOL block rendering if placed
bc_idx = c.rfind('BCOLORS[')
bc_end = c.index(';', bc_idx) + 1
if 'BCOLORS[129]' not in c:
    # WOOL isn't a block, it's an item. Skip this.
    pass

# Fix G: Verify spawnSheep function exists
if 'function spawnSheep()' in c:
    print('G: spawnSheep function exists')
else:
    print('G: WARNING - spawnSheep missing!')

# Fix H: Verify BED interaction code
if 'BLOCKS.BED' in c:
    print('H: BED interaction exists')
else:
    print('H: WARNING - BED interaction missing!')

# Fix I: Add rotten flesh food effect (edible but chance of hunger)
# Find food/eating code
eat_idx = c.find('COOKED_PORK')
if eat_idx > 0:
    eat_area = c[eat_idx:eat_idx+300]
    print('I: Food area:', eat_area[:150])

# Save
open(p, 'w', encoding='utf-8', newline='').write(c)
print('File saved! Length:', len(c))
print('Fix2 complete!')
