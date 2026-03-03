import re
c = open('index.html','r',encoding='utf-8').read()

# === 1. Add new tool item IDs ===
# Need: STONE_AXE:117, IRON_AXE:118, DIAMOND_AXE:119, STONE_SHOVEL:120, IRON_SHOVEL:121, DIAMOND_SHOVEL:122
old_items_end = 'COOKED_PORK:116};'
new_items_end = 'COOKED_PORK:116,STONE_AXE:117,IRON_AXE:118,DIAMOND_AXE:119,STONE_SHOVEL:120,IRON_SHOVEL:121,DIAMOND_SHOVEL:122};'
c = c.replace(old_items_end, new_items_end)

# === 2. Add ICOLORS for new tools ===
old_ic = "ICOLORS[116]='#CC5533';"
new_ic = old_ic + "\nICOLORS[117]='#696969';ICOLORS[118]='#B87333';ICOLORS[119]='#00FFFF';ICOLORS[120]='#696969';ICOLORS[121]='#B87333';ICOLORS[122]='#00FFFF';"
c = c.replace(old_ic, new_ic)

# === 3. Add INAMES for new tools ===
old_in = c[c.find('var INAMES'):c.find('var INAMES')+600]
# Find end of INAMES section
inames_start = c.find('var INAMES')
