import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()
ch=0

# 1. Add Door recipe to RECIPES if missing
if 'out:134' not in c:
    # Find end of RECIPES array
    ri=c.find('var RECIPES=[')
    re2=c.find('];',ri)
    # Add door recipe: 6 planks -> 1 door
    door_recipe=",{inp:[[11,6]],out:134,cnt:1,name:'Door'}"
    c=c[:re2]+door_recipe+c[re2:]
    ch+=1
    print('Added Door recipe (6 planks -> 1 door, out:134)')

# 2. Check recipe names have Hatchet not Axe
axe_in_recipes=re.findall(r"name:'[^']*Axe[^']*'",c)
if axe_in_recipes:
    print(f'WARN: Still have Axe in recipes: {axe_in_recipes}')
    for old in axe_in_recipes:
        new=old.replace('Axe','Hatchet')
        c=c.replace(old,new)
        ch+=1
        print(f'Fixed recipe: {old} -> {new}')
else:
    print('OK: No Axe in recipe names')

# 3. Check recipe names have Pickaxe not Pick
pick_in_recipes=re.findall(r"name:'[^']*Pick'",c)
dia_in_recipes=re.findall(r"name:'Dia [^']*'",c)
if pick_in_recipes:
    print(f'WARN: Still have Pick in recipes: {pick_in_recipes}')
    for old in pick_in_recipes:
        new=old.replace("Pick'","Pickaxe'")
        c=c.replace(old,new)
        ch+=1
        print(f'Fixed recipe: {old} -> {new}')
else:
    print('OK: No bare Pick in recipe names')

if dia_in_recipes:
    print(f'WARN: Still have Dia in recipes: {dia_in_recipes}')
    for old in dia_in_recipes:
        new=old.replace('Dia ','Diamond ')
        c=c.replace(old,new)
        ch+=1
        print(f'Fixed recipe: {old} -> {new}')
else:
    print('OK: No Dia prefix in recipe names')

# 4. Verify sheep wool drop
sheep_idx=c.find("'sheep'")
if sheep_idx>=0:
    sheep_area=c[sheep_idx:sheep_idx+600]
    if '129' in sheep_area or 'WOOL' in sheep_area:
        print('OK: Sheep drops wool (129/WOOL found near sheep)')
    else:
        print('WARN: Sheep may not drop wool')
        # Check death/loot logic
        loot_area=c[sheep_idx:sheep_idx+1000]
        print('Sheep loot area snippet:',repr(loot_area[:200]))

# 5. Save
open(p,'w',encoding='utf-8',newline='').write(c)
print(f'\nChanges: {ch}')

# 6. Final recipe dump
print('\n=== ALL RECIPES (after fix) ===')
ri2=c.find('var RECIPES=[')
re3=c.find('];',ri2)
rblock=c[ri2:re3+2]
for m in re.finditer(r'\{[^}]+\}',rblock):
    r=m.group()
    if any(x in r for x in ['Hatchet','Pickaxe','Sword','Bed','Door','Torch']):
        print(f'  {r}')
