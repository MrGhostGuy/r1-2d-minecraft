import re
c = open('index.html','r',encoding='utf-8').read()

print('=== ALL RECIPES ===')
ri = c.find('var RECIPES=[')
re2 = c.find('];', ri)
recipes_str = c[ri:re2+2]
for m in re.finditer(r'\{[^}]+\}', recipes_str):
    print(m.group())

print('\n=== PICKAXE/SWORD/BED/DOOR/TORCH in RECIPES ===')
for word in ['Pickaxe','Sword','Bed','Door','Torch','Pick','Hatchet']:
    found = word in recipes_str
    print(f'  {word}: {found}')

print('\n=== SHEEP/WOOL ===')
print('sheep in code:', 'sheep' in c.lower())
print('WOOL in ITEMS:', 'WOOL' in c[:c.find('var RECIPES')])
wool_matches = re.findall(r'WOOL\w*\s*[:=]\s*\d+', c[:20000])
print('WOOL defs:', wool_matches)

print('\n=== TORCH LIGHT ===')
print('torch light:', 'torch' in c.lower() and 'light' in c.lower())
tl = c.lower().find('torch')
print('torch context:', repr(c[max(0,tl-20):tl+80]) if tl>=0 else 'N/A')

print('\n=== ALL INAMES ===')
for m in re.finditer(r'INAMES\[(\d+)\]\s*=\s*["\x27]([^"\x27]+)["\x27]', c):
    print(f'  [{m.group(1)}] = {m.group(2)}')

print('\n=== ALL ITEMS ENUM ===')
items_start = c.find('var ITEMS={')
if items_start >= 0:
    items_end = c.find('};', items_start)
    print(c[items_start:items_end+2])
