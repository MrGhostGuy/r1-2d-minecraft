import re

# Read the current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print(f'File loaded: {len(c)} chars')

# === FIX 1: Replace showMsg calls with showGameMsg ===
c = c.replace('showMsg(', 'showGameMsg(')
print('1. Replaced showMsg -> showGameMsg')

# === FIX 2: Remove the duplicate function showMsg definition ===
# The old code added: function showMsg(msg){gameMsgTimer=120;gameMsgText=msg;}
# We need to remove this since we now use showGameMsg
c = re.sub(r'function showMsg\(msg\)\{[^}]*\}', '', c)
print('2. Removed showMsg function definition')

# === FIX 3: Remove duplicate var declarations ===
# Remove: var gameMsgText='';var gameMsgTimer=0;
c = c.replace("var gameMsgText='';var gameMsgTimer=0;", '')
c = c.replace("var gameMsgText='';", '')
print('3. Removed duplicate variable declarations')

# === FIX 4: Fix the render condition ===
# The old code changed the condition to: gameMsgTimer>0||gameMsgText
# Revert to just: gameMsgTimer>0
c = c.replace('gameMsgTimer>0||gameMsgText)', 'gameMsgTimer>0)')
print('4. Fixed render condition')

# === FIX 5: Ensure showGameMsg timer is long enough for save/load messages ===
# The existing showGameMsg sets timer to 90 frames, which is fine

# === VERIFY ===
print(f'\nVerification:')
print(f'  showMsg( count: {c.count("showMsg(")}')
print(f'  showGameMsg( count: {c.count("showGameMsg(")}')
print(f'  gameMsgText count: {c.count("gameMsgText")}')
print(f'  saveGame count: {c.count("saveGame")}')
print(f'  loadGame count: {c.count("loadGame")}')
print(f'  save-screen count: {c.count("save-screen")}')
print(f'  getSaves count: {c.count("getSaves")}')

# Write the fixed file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print(f'\nFixed file saved: {len(c)} chars')