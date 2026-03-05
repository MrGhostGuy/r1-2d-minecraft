import re

f = open('index.html', 'r', encoding='utf-8')
content = f.read()
f.close()

# The new placeBlock function with ground-lock + vertical auto-stacking
new_placeBlock = '''function placeBlock(){
var bx=Math.floor(player.x/TILE);
// Check if player moved to a different column - reset stacking
var currentPlayerCol=Math.floor(player.x/TILE);
if(typeof window._lastPlaceCol==='undefined'){window._lastPlaceCol=-1;window._lastPlaceRow=-1;window._lastPlayerCol=-1;}
if(currentPlayerCol!==window._lastPlayerCol){window._lastPlaceCol=-1;window._lastPlaceRow=-1;}
window._lastPlayerCol=currentPlayerCol;
// Find ground level: scan from bottom up to find first AIR/WATER slot above solid ground
var by=-1;
for(var sy=WORLD_H-1;sy>=0;sy--){
if(world[bx][sy]!=BLOCKS.AIR&&world[bx][sy]!=BLOCKS.WATER){by=sy-1;break;}
}
if(by<0)by=0;
// Make sure by points to an air/water block (the lowest available spot)
while(by>=0&&world[bx][by]!=BLOCKS.AIR&&world[bx][by]!=BLOCKS.WATER){by--;}
if(by<0)return;
// Auto-stack: if same column as last placement, target the row above last placed block
if(bx===window._lastPlaceCol&&window._lastPlaceRow>=0){
var stackY=window._lastPlaceRow-1;
if(stackY>=0&&(world[bx][stackY]===BLOCKS.AIR||world[bx][stackY]===BLOCKS.WATER)){by=stackY;}
}
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)return;
if(world[bx][by]!=BLOCKS.AIR&&world[bx][by]!=BLOCKS.WATER)return;
var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);
var dist=Math.abs(bx-px)+Math.abs(by-py);if(dist>6)return;
// Don't place on player
if(bx>=Math.floor(player.x/TILE)&&bx<=Math.floor((player.x+player.w)/TILE)&&by>=Math.floor(player.y/TILE)&&by<=Math.floor((player.y+player.h)/TILE))return;
var held=getHeldItem();
if(held.id>0&&held.id<100){
world[bx][by]=held.id;
window._lastPlaceCol=bx;
window._lastPlaceRow=by;
if(gameMode!="creative"){held.count--;if(held.count<=0){held.id=0;held.count=0;}}
}
}'''

# Find and replace the old placeBlock function
m = re.search(r'function placeBlock\(\)\{', content)
if m:
    start = m.start()
    depth = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == '{': depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    old_func = content[start:end]
    content = content[:start] + new_placeBlock + content[end:]
    f = open('index.html', 'w', encoding='utf-8')
    f.write(content)
    f.close()
    print('SUCCESS: placeBlock replaced with auto-stacking version')
    print(f'Old function length: {len(old_func)}')
    print(f'New function length: {len(new_placeBlock)}')
else:
    print('ERROR: placeBlock function not found')
