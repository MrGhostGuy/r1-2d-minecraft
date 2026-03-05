import re
p='index.html'
c=open(p,'r',encoding='utf-8').read()
lines=c.split('\n')
ch=0

# Show lines around 495
print('=== LINES 490-500 ===')
for i in range(489,min(500,len(lines))):
    print(f'{i+1}: {lines[i]}')

# Find updateEntities function
ue=c.find('function updateEntities')
print(f'\nupdateEntities at char pos: {ue}')

# Show the function start
if ue>=0:
    func_area=c[ue:ue+300]
    print('Function start:')
    for i,line in enumerate(func_area.split('\n')[:10]):
        print(f'  {i}: {line}')

# Fix: replace if(!e)continue with more comprehensive check
old_check='if(!e)continue;'
new_check='if(!e||e.hp===undefined){entities.splice(i,1);continue;}'
if old_check in c:
    c=c.replace(old_check, new_check)
    ch+=1
    print(f'\nFixed: {old_check} -> {new_check}')
elif new_check in c:
    print('\nAlready has comprehensive check')
else:
    print('\nWARN: Could not find null check pattern')
    # Try to find what's there
    var_e=c.find('var e=entities[i];',ue)
    if var_e>=0:
        after=c[var_e:var_e+100]
        print(f'After var e: {repr(after)}')

# Also check if the issue is in the e.hp<=0 check specifically
# The real fix: wrap the hp check in a try-catch or add explicit check
hp_check='if(e.hp<=0||'
if hp_check in c:
    idx=c.find(hp_check)
    print(f'\ne.hp<=0 check at pos {idx}')
    # Find the line number
    line_num=c[:idx].count('\n')+1
    print(f'On line {line_num}')

open(p,'w',encoding='utf-8',newline='').write(c)
print(f'\nTotal changes: {ch}')
