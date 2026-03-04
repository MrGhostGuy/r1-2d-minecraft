import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

fixes = 0

# FIX 1: Add dead state check to keydown handler
old1 = "if(gameState=='title')return;\nif(e.key=='f'||e.key=='F')toggleFly();"
new1 = "if(gameState=='title')return;\nif(gameState=='dead'){restartGame();return;}\nif(e.key=='f'||e.key=='F')toggleFly();"
if old1 in c:
    c = c.replace(old1, new1)
    fixes += 1
    print('FIX 1: Added dead state respawn to keydown handler')
else:
    print('FIX 1 SKIP: Pattern not found')

# FIX 2: Disable hunger system
old2 = 'function updateHunger(dt){'
idx = c.find(old2)
if idx >= 0:
    # Find the closing brace of the function
    brace = 0
    end = idx + len(old2)
    brace = 1
    while end < len(c) and brace > 0:
        if c[end] == '{': brace += 1
        if c[end] == '}': brace -= 1
        end += 1
    c = c[:idx] + 'function updateHunger(dt){return;}' + c[end:]
    fixes += 1
    print('FIX 2: Disabled hunger system')
else:
    print('FIX 2 SKIP')

# FIX 3: Hide hunger bar in survival HUD
old3 = "if(hunBar){hunBar.style.display='block';hunBar.innerHTML='';"
new3 = "if(hunBar){hunBar.style.display='none';"
if old3 in c:
    c = c.replace(old3, new3)
    fixes += 1
    print('FIX 3: Hidden hunger bar')
else:
    print('FIX 3 SKIP')

# FIX 4: Update Survival mode description
old4 = 'Health, Hunger, Mobs, Crafting'
new4 = 'Health, Mobs, Crafting'
if old4 in c:
    c = c.replace(old4, new4)
    fixes += 1
    print('FIX 4: Updated Survival description')
else:
    print('FIX 4 SKIP')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print(f'Total fixes: {fixes}')
print(f'File saved: {len(c)} chars')
