import re
f = open('index.html', 'r')
c = f.read()
f.close()
fixes = 0

# FIX 1: Add touch-friendly CSS for menu buttons
old_css = '#title .menu-btn{background:#555;color:#fff;border:1px solid #888;padding:4px 12px;font-size:9px;margin:3px;cursor:pointer;font-family:monospace;}'
new_css = '#title .menu-btn{background:#555;color:#fff;border:1px solid #888;padding:8px 12px;font-size:9px;margin:4px;cursor:pointer;font-family:monospace;touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,255,255,0.3);user-select:none;-webkit-user-select:none;}'
if old_css in c:
    c = c.replace(old_css, new_css)
    fixes += 1
    print('FIX 1: Enhanced menu-btn CSS for touch')
else:
    m = re.search(r'#title \.menu-btn\{[^}]+\}', c)
    if m:
        c = c.replace(m.group(), new_css)
        fixes += 1
        print('FIX 1: Enhanced menu-btn CSS via regex')
    else:
        print('FIX 1: SKIPPED - pattern not found')

# FIX 2: Add save-slot touch CSS
old_del_css = '.save-menu-btn.delete{background:#a00;font-size:6px;padding:2px 6px;}'
new_del_css = old_del_css + '\n.save-slot{touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,255,255,0.3);user-select:none;-webkit-user-select:none;cursor:pointer;padding:6px 4px;}'
if old_del_css in c:
    c = c.replace(old_del_css, new_del_css)
    fixes += 1
    print('FIX 2: Added save-slot touch CSS')
else:
    print('FIX 2: SKIPPED - pattern not found')

# FIX 3: Add ontouchstart to Survival Mode button
sq = chr(39)
old_surv = '<div class="menu-btn" onclick="startGame(' + sq + 'survival' + sq + ')">'
new_surv = '<div class="menu-btn" onclick="startGame(' + sq + 'survival' + sq + ')" ontouchend="event.preventDefault();startGame(' + sq + 'survival' + sq + ')">'
if old_surv in c:
    c = c.replace(old_surv, new_surv)
    fixes += 1
    print('FIX 3: Added touch to Survival button')
else:
    print('FIX 3: SKIPPED - Survival button not found')

# FIX 4: Add ontouchstart to Creative Mode button
old_crea = '<div class="menu-btn" onclick="startGame(' + sq + 'creative' + sq + ')">'
new_crea = '<div class="menu-btn" onclick="startGame(' + sq + 'creative' + sq + ')" ontouchend="event.preventDefault();startGame(' + sq + 'creative' + sq + ')">'
if old_crea in c:
    c = c.replace(old_crea, new_crea)
    fixes += 1
    print('FIX 4: Added touch to Creative button')
else:
    print('FIX 4: SKIPPED - Creative button not found')

# FIX 5: Add ontouchstart to Load Game button
old_load = 'onclick="openLoadScreenFromTitle()">Load Game</div>'
new_load = 'onclick="openLoadScreenFromTitle()" ontouchend="event.preventDefault();openLoadScreenFromTitle()">Load Game</div>'
if old_load in c:
    c = c.replace(old_load, new_load)
    fixes += 1
    print('FIX 5: Added touch to Load Game button')
else:
    print('FIX 5: SKIPPED - Load Game button not found')

# FIX 6: Add ontouchend to save slot entries in renderLoadSlots
old_slot = 'div.onclick=function(){doLoadGame(k);};'
new_slot = 'div.onclick=function(){doLoadGame(k);};div.ontouchend=function(e){e.preventDefault();doLoadGame(k);};'
if old_slot in c:
    c = c.replace(old_slot, new_slot)
    fixes += 1
    print('FIX 6: Added touch to save slot entries')
else:
    print('FIX 6: SKIPPED - save slot pattern not found')

# FIX 7: Add ontouchend to Back button in load screen
old_back = 'onclick="closeLoadScreen()">Back</button>'
new_back = 'onclick="closeLoadScreen()" ontouchend="event.preventDefault();closeLoadScreen()">Back</button>'
if old_back in c:
    c = c.replace(old_back, new_back)
    fixes += 1
    print('FIX 7: Added touch to Back button')
else:
    print('FIX 7: SKIPPED - Back button not found')

# Save the file
print()
print('Total fixes applied:', fixes)
print('File size:', len(c), 'chars')
f = open('index.html', 'w')
f.write(c)
f.close()
print('File saved successfully!')
