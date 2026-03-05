import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()
ch=0

# 1. Remove duplicate door recipe (out:134) since out:23 already works
if 'out:134' in c and 'out:23' in c:
    old=",{inp:[[11,6]],out:134,cnt:1,name:'Door'}"
    if old in c:
        c=c.replace(old,'')
        ch+=1
        print('Removed duplicate door recipe (out:134), keeping out:23')

# 2. Check sheep wool drop in death/loot logic
print('\n=== SHEEP WOOL DROP CHECK ===')
# Find where entity death drops loot
death_idx=c.find('e.hp<=0')
if death_idx>=0:
    loot_area=c[death_idx:death_idx+800]
    print('Death loot area:')
    print(repr(loot_area[:500]))
    if 'sheep' in loot_area and ('WOOL' in loot_area or '129' in loot_area):
        print('\nOK: Sheep drops wool on death')
    elif 'sheep' in loot_area:
        print('\nSheep found in death logic but no wool drop')
    else:
        print('\nSheep NOT in this death loot section, checking further...')
        # Search all occurrences
        for m in re.finditer(r'e\.hp\s*<=?\s*0',c):
            area=c[m.start():m.start()+600]
            if 'sheep' in area:
                print(f'Found sheep in death logic at pos {m.start()}:')
                print(repr(area[:300]))
                if 'WOOL' in area or '129' in area:
                    print('OK: Wool drop found!')
                else:
                    print('MISSING: No wool drop for sheep here')
                break

# 3. Check if addItem WOOL is called on sheep death
wool_add=c.find('ITEMS.WOOL')
if wool_add>=0:
    print(f'\nITEMS.WOOL found at pos {wool_add}')
    print(repr(c[max(0,wool_add-100):wool_add+100]))
elif '129' in c[death_idx:death_idx+2000] if death_idx>=0 else False:
    print('Item 129 found in death area')

# 4. Save
open(p,'w',encoding='utf-8',newline='').write(c)
print(f'\nChanges: {ch}')
