p = 'index.html'
c = open(p, 'r', encoding='utf-8').read()
ch = 0

# Fix A: Verify DOOR is in isSolid exceptions
if 'BLOCKS.DOOR' not in c[c.find('function isSolid'):c.find('function isSolid')+300]:
    old = 'b!=BLOCKS.WHEAT2&&b!'
    if old in c:
        c = c.replace(old, 'b!=BLOCKS.WHEAT2&&b!=BLOCKS.DOOR&&b!', 1)
        ch += 1
        print('A: Added DOOR to isSolid')
    else:
        print('A: WARN - pattern not found')
else:
    print('A: DOOR already in isSolid')

# Fix B: Add null check in findCombatTarget
fct = c.find('findCombatTarget')
if fct >= 0:
    old_pat = 'var e=entities[i];if(e.hp<=0)continue'
    pos = c.find(old_pat, fct)
    if pos >= 0 and pos < fct + 500:
        new_pat = 'var e=entities[i];if(!e||typeof e.hp!="number"||e.hp<=0)continue'
        c = c[:pos] + new_pat + c[pos+len(old_pat):]
        ch += 1
        print('B: Added null check in findCombatTarget')
    else:
        # Try alternate pattern
        old2 = 'var e=entities[i];if'
        pos2 = c.find(old2, fct)
        if pos2 >= 0 and pos2 < fct + 500:
            after = c[pos2+len(old2):pos2+len(old2)+50]
            if '!e' not in c[pos2:pos2+80]:
                new2 = 'var e=entities[i];if(!e||typeof e.hp!="number")continue;if'
                c = c[:pos2] + new2 + c[pos2+len(old2):]
                ch += 1
                print('B: Added null check in findCombatTarget (alt)')
            else:
                print('B: findCombatTarget already has null check')
        else:
            print('B: findCombatTarget entity access not found')
else:
    print('B: findCombatTarget not found')

# Fix C: Safe health bar rendering
old_hp = 'e.w*(e.hp/e.maxHp)'
if old_hp in c:
    new_hp = 'e.w*((e.hp||0)/(e.maxHp||1))'
    c = c.replace(old_hp, new_hp)
    ch += 1
    print('C: Fixed health bar safety')
else:
    print('C: Health bar pattern not found or already fixed')

# Fix D: Wrap entity rendering loop with null check
# Find all entity rendering for-loops
import re
renders = list(re.finditer(r'for\(var i=0;i<entities\.length;i\+\+\)\{', c))
for m in renders:
    start = m.end()
    next_code = c[start:start+100]
    if 'var e=entities[i];' in next_code:
        e_pos = c.find('var e=entities[i];', start)
        if e_pos >= 0 and e_pos < start + 60:
            after_e = c[e_pos+18:e_pos+50]
            if '!e' not in after_e:
                insert = 'if(!e)continue;'
                c = c[:e_pos+18] + insert + c[e_pos+18:]
                ch += 1
                ln = c[:e_pos].count('\n') + 1
                print(f'D: Added null check in entity render loop at line {ln}')

# Fix E: Wrap updateEntities loop body in try-catch
ue = c.find('function updateEntities')
if ue >= 0:
    # Find the for loop opening
    loop_start = c.find('for(var i=entities.length-1;i>=0;i--){', ue)
    if loop_start >= 0:
        brace_pos = loop_start + len('for(var i=entities.length-1;i>=0;i--){')
        # Check if try already exists
        after_brace = c[brace_pos:brace_pos+10]
        if 'try' not in after_brace:
            c = c[:brace_pos] + 'try{' + c[brace_pos:]
            # Now find the closing of the for loop
            # The for loop ends with }} before function attackEntity
            ae = c.find('function attackEntity', ue)
            if ae >= 0:
                # Search backwards from attackEntity for }}
                search_area = c[ue:ae]
                # Find last }}\n in the area
                last_close = search_area.rfind('}}\n')
                if last_close >= 0:
                    abs_pos = ue + last_close
                    c = c[:abs_pos] + '}catch(err){entities.splice(i,1);}' + c[abs_pos:]
                    ch += 1
                    print('E: Added try-catch in updateEntities loop')
                else:
                    print('E: Could not find loop end for catch')
            else:
                print('E: attackEntity not found for catch insertion')
        else:
            print('E: try-catch already exists in updateEntities')

# Fix F: Door recipe in RECIPES
recipes_area = c[c.find('var RECIPES='):c.find('var RECIPES=')+3000] if 'var RECIPES=' in c else ''
if 'Door' in recipes_area:
    print('F: Door recipe already exists')
else:
    rend = c.find('];', c.find('var RECIPES='))
    if rend >= 0:
        c = c[:rend] + ",{inp:[[11,6]],out:23,cnt:1,name:'Door'}" + c[rend:]
        ch += 1
        print('F: Added Door recipe')

# Save
open(p, 'w', encoding='utf-8', newline='').write(c)
print(f'File saved! Length: {len(c)}')
print(f'Total changes: {ch}')
print('Fix2 complete!')
