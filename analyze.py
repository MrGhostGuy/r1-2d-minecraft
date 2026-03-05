import re
c = open('index.html','r',encoding='utf-8').read()

print('=== 1. SMELTING SYSTEM ===')
si = c.find('SMELT')
if si >= 0:
    print(repr(c[si:si+400]))
else:
    print('SMELT NOT FOUND')

print('\n=== 2. AXE_IDS ===')
ai = c.find('AXE_IDS')
if ai >= 0:
    print(repr(c[ai:ai+100]))
else:
    print('AXE_IDS NOT FOUND')

print('\n=== 3. IRON AXE RECIPE (out:118) ===')
recipes = re.findall(r'\{[^}]*out\s*:\s*118[^}]*\}', c)
print(recipes if recipes else 'NOT FOUND')

print('\n=== 4. ALL AXE RECIPES ===')
for m in re.finditer(r'\{[^}]*name\s*:\s*["\x27][^"}\x27]*[Aa]xe[^"}\x27]*["\x27][^}]*\}', c):
    print(m.group())

print('\n=== 5. INAMES with Axe ===')
for m in re.finditer(r'INAMES\[(\d+)\]\s*=\s*["\x27]([^"\x27]*[Aa]xe[^"\x27]*)["\x27]', c):
    print(f'  INAMES[{m.group(1)}] = {m.group(2)}')

print('\n=== 6. ITEMS with AXE ===')
ai2 = c.find('ITEMS')
if ai2 >= 0:
    chunk = c[ai2:ai2+500]
    for m in re.finditer(r'(\w*AXE\w*)\s*:\s*(\d+)', chunk):
        print(f'  {m.group(1)}: {m.group(2)}')
