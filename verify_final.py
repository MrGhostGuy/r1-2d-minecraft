import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()

print('='*50)
print('FINAL COMPREHENSIVE VERIFICATION')
print('='*50)

# 1. Smelting
print('\n[1] SMELTING SYSTEM')
print(f"  Iron Ore->Iron Ingot: {'PASS' if 'SMELT[8]=111' in c else 'FAIL'}")
print(f"  Gold Ore->Gold Ingot: {'PASS' if 'SMELT[9]=112' in c else 'FAIL'}")

# 2. Hatchet names
print('\n[2] HATCHET NAMING (Axe->Hatchet)')
for n in ['Wood Hatchet','Stone Hatchet','Iron Hatchet','Diamond Hatchet']:
    print(f"  {n}: {'PASS' if n in c else 'FAIL'}")
print(f"  No Axe remains: {'PASS' if 'Wood Axe' not in c and 'Stone Axe' not in c and 'Iron Axe' not in c and 'Diamond Axe' not in c else 'FAIL'}")

# 3. Pickaxe names  
print('\n[3] PICKAXE NAMING')
for n in ['Wood Pickaxe','Stone Pickaxe','Iron Pickaxe','Diamond Pickaxe']:
    print(f"  {n}: {'PASS' if n in c else 'FAIL'}")

# 4. Sword names
print('\n[4] SWORD NAMING')
for n in ['Wood Sword','Stone Sword','Iron Sword','Diamond Sword']:
    print(f"  {n}: {'PASS' if n in c else 'FAIL'}")

# 5. Key recipes
print('\n[5] KEY RECIPES')
ri=c.find('var RECIPES=[')
re2=c.find('];',ri)
rb=c[ri:re2+2]
checks={'Bed':'out:29','Door(23)':'out:23','Torch':'out:17',
    'Iron Hatchet(118)':'out:118','Iron Pickaxe(103)':'out:103',
    'Iron Sword(107)':'out:107'}
for name,pat in checks.items():
    print(f"  {name}: {'PASS' if pat in rb else 'FAIL'}")

# 6. Sheep/Wool
print('\n[6] SHEEP & WOOL')
print(f"  Sheep spawning: {'PASS' if 'sheep' in c else 'FAIL'}")
print(f"  WOOL item: {'PASS' if 'WOOL:129' in c else 'FAIL'}")
print(f"  Sheep drops wool: {'PASS' if 'ITEMS.WOOL' in c else 'FAIL'}")

# 7. Torch light
print('\n[7] TORCH LIGHT SYSTEM')
print(f"  getTorchLight func: {'PASS' if 'getTorchLight' in c else 'FAIL'}")
print(f"  isNearTorch func: {'PASS' if 'isNearTorch' in c else 'FAIL'}")
print(f"  TORCH_LIGHT_RADIUS: {'PASS' if 'TORCH_LIGHT_RADIUS' in c else 'FAIL'}")
print(f"  Torch glow render: {'PASS' if 'rgba(255,200,50' in c else 'FAIL'}")

# 8. Iron Hatchet specific
print('\n[8] IRON HATCHET END-TO-END')
print(f"  IRON_AXE:118 in ITEMS: {'PASS' if 'IRON_AXE:118' in c else 'FAIL'}")
print(f"  AXE_IDS has 118: {'PASS' if '118' in c[c.find('AXE_IDS'):c.find('AXE_IDS')+50] else 'FAIL'}")
hatchet_recipe=re.search(r"\{inp:\[\[111,3\],\[100,2\]\],out:118,cnt:1,name:'Iron Hatchet'\}",c)
print(f"  Recipe 3 iron+2 sticks=Iron Hatchet: {'PASS' if hatchet_recipe else 'FAIL'}")

print('\n' + '='*50)
print('VERIFICATION COMPLETE')
print('='*50)
