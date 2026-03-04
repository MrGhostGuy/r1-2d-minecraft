import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# === 1. ADD CSS STYLES FOR SAVE/LOAD UI ===
save_css = """
#save-screen,#load-screen{display:none;position:absolute;top:0;left:0;width:240px;height:260px;background:rgba(0,0,0,0.85);z-index:200;overflow-y:auto;}
#save-screen h3,#load-screen h3{color:#0f0;text-align:center;margin:8px 0 4px;font-size:10px;}
.save-slot{background:#333;margin:3px 6px;padding:4px 6px;border:1px solid #555;border-radius:3px;color:#fff;font-size:7px;cursor:pointer;}
.save-slot:hover{background:#555;border-color:#0f0;}
.save-slot .slot-name{color:#0f0;font-weight:bold;}
.save-slot .slot-info{color:#aaa;font-size:6px;}
.save-slot .slot-delete{float:right;color:#f55;cursor:pointer;font-size:8px;}
#save-name-input{width:180px;margin:4px auto;display:block;background:#222;border:1px solid #0f0;color:#0f0;padding:3px;font-size:8px;text-align:center;}
.save-menu-btn{background:#0a0;color:#fff;border:none;padding:4px 12px;margin:3px auto;display:block;cursor:pointer;font-size:8px;border-radius:3px;}
.save-menu-btn:hover{background:#0c0;}
.save-menu-btn.cancel{background:#a00;}
.save-menu-btn.cancel:hover{background:#c00;}
.save-menu-btn.delete{background:#a00;font-size:6px;padding:2px 6px;}
#save-btn-hud{position:absolute;top:2px;right:2px;z-index:50;background:rgba(0,150,0,0.7);color:#fff;border:none;padding:2px 4px;font-size:6px;cursor:pointer;border-radius:2px;}
#save-btn-hud:hover{background:rgba(0,200,0,0.9);}
"""
c = c.replace('</style>', save_css + '</style>')
print('1. CSS added')


# === 2. ADD SAVE/LOAD HTML SCREENS ===
save_html = '<div id="save-screen"><h3>SAVE GAME</h3><input type="text" id="save-name-input" placeholder="Enter save name..." maxlength="20"><div id="save-slots-list"></div><button class="save-menu-btn" onclick="doSaveGame()">Save</button><button class="save-menu-btn cancel" onclick="closeSaveScreen()">Cancel</button></div>'
load_html = '<div id="load-screen"><h3>LOAD GAME</h3><div id="load-slots-list"></div><button class="save-menu-btn cancel" onclick="closeLoadScreen()">Back</button></div>'
save_hud_btn = '<button id="save-btn-hud" onclick="openSaveScreen()" style="display:none;">SAVE</button>'

c = c.replace('</body>', save_html + '\n' + load_html + '\n' + save_hud_btn + '\n</body>')
print('2. HTML elements added')

# === 3. ADD LOAD GAME BUTTON TO TITLE SCREEN ===
c = c.replace("onclick=\"startGame('creative')\">", "onclick=\"startGame('creative')\">")
title_load_btn = '<div class="menu-btn" onclick="openLoadScreenFromTitle()">Load Game</div>'
c = c.replace('</div>\n<canvas id="game"', title_load_btn + '</div>\n<canvas id="game"')
print('3. Title load button added')

# === 4. ADD SAVE/LOAD BUTTONS TO PAUSE MENU ===
pause_save = '<div class="menu-btn" onclick="openSaveScreen()">Save Game</div><div class="menu-btn" onclick="openLoadScreen()">Load Game</div>'
c = c.replace("onclick=\"resumeGame()\">Resume</div>", "onclick=\"resumeGame()\">Resume</div>" + pause_save)
print('4. Pause menu buttons added')


# === 5. ADD JAVASCRIPT SAVE/LOAD FUNCTIONS ===
js_code = """
// === SAVE/LOAD SYSTEM ===
function getSaves(){try{var s=localStorage.getItem('r1mc_saves');return s?JSON.parse(s):{};}catch(e){return {};}}
function putSaves(obj){localStorage.setItem('r1mc_saves',JSON.stringify(obj));}
function saveGame(name){
var saves=getSaves();
var state={player:{x:player.x,y:player.y,vx:player.vx,vy:player.vy,hp:player.hp,maxHp:player.maxHp,hunger:player.hunger,maxHunger:player.maxHunger,hungerTimer:player.hungerTimer,air:player.air,selectedSlot:player.selectedSlot,dir:player.dir,flying:player.flying,fallDist:player.fallDist,lastY:player.lastY,onGround:player.onGround},inventory:JSON.parse(JSON.stringify(inventory)),world:world.map(function(col){return col.slice();}),gameMode:gameMode,camX:camX,camY:camY,dayTime:dayTime,dayLength:dayLength,isNight:isNight,cursorX:cursorX,cursorY:cursorY,entities:JSON.parse(JSON.stringify(entities)),timestamp:Date.now()};
saves[name]=state;
putSaves(saves);
return true;
}
function loadGame(name){
var saves=getSaves();
if(!saves[name])return false;
var s=saves[name];
gameMode=s.gameMode||'survival';
world=s.world.map(function(col){return col.slice();});
player.x=s.player.x;player.y=s.player.y;player.vx=s.player.vx||0;player.vy=s.player.vy||0;
player.hp=s.player.hp;player.maxHp=s.player.maxHp;
player.hunger=s.player.hunger!==undefined?s.player.hunger:20;
player.maxHunger=s.player.maxHunger||20;
player.hungerTimer=s.player.hungerTimer||0;
player.air=s.player.air!==undefined?s.player.air:10;
player.selectedSlot=s.player.selectedSlot||0;
player.dir=s.player.dir||1;player.flying=s.player.flying||false;
player.fallDist=s.player.fallDist||0;player.lastY=s.player.lastY||0;
player.onGround=s.player.onGround||false;
player.mining=0;player.mineX=-1;player.mineY=-1;player.attacking=0;
for(var i=0;i<36;i++){inventory[i]=s.inventory[i]?{id:s.inventory[i].id,count:s.inventory[i].count}:{id:0,count:0};}
camX=s.camX||0;camY=s.camY||0;
dayTime=s.dayTime||0;dayLength=s.dayLength||12000;isNight=s.isNight||false;
cursorX=s.cursorX||15;cursorY=s.cursorY||15;
entities=s.entities?JSON.parse(JSON.stringify(s.entities)):[];
particles=[];
miningProgress=0;miningTarget={x:-1,y:-1};
return true;
}
function deleteSave(name){var saves=getSaves();delete saves[name];putSaves(saves);}
function openSaveScreen(){
if(gameState=='playing'){gameState='paused';}
document.getElementById('pause-menu').style.display='none';
var sc=document.getElementById('save-screen');sc.style.display='block';
document.getElementById('save-name-input').value='';
renderSaveSlots();
}
function closeSaveScreen(){
document.getElementById('save-screen').style.display='none';
if(gameState=='paused'){document.getElementById('pause-menu').style.display='block';}
}
function doSaveGame(){
var name=document.getElementById('save-name-input').value.trim();
if(!name){name='Save '+(Object.keys(getSaves()).length+1);}
if(saveGame(name)){closeSaveScreen();if(gameState=='paused'){resumeGame();}showMsg('Game saved: '+name);}
}
function showMsg(msg){gameMsgTimer=120;gameMsgText=msg;}
function renderSaveSlots(){
var list=document.getElementById('save-slots-list');list.innerHTML='';
var saves=getSaves();var keys=Object.keys(saves);
if(keys.length==0){list.innerHTML='<p style="color:#888;text-align:center;font-size:7px;">No saves yet</p>';return;}
keys.sort(function(a,b){return (saves[b].timestamp||0)-(saves[a].timestamp||0);});
for(var i=0;i<keys.length;i++){var k=keys[i];var s=saves[k];
var d=new Date(s.timestamp||0);var ds=d.toLocaleDateString()+' '+d.toLocaleTimeString();
var div=document.createElement('div');div.className='save-slot';
div.innerHTML='<span class="slot-name">'+k+'</span><br><span class="slot-info">'+s.gameMode+' | HP:'+Math.round(s.player.hp)+'/'+s.player.maxHp+' | '+ds+'</span>';
list.appendChild(div);}
}
function openLoadScreen(){
document.getElementById('pause-menu').style.display='none';
var sc=document.getElementById('load-screen');sc.style.display='block';
renderLoadSlots();
}
function closeLoadScreen(){
document.getElementById('load-screen').style.display='none';
if(gameState=='title'){document.getElementById('title').style.display='block';}
else if(gameState=='paused'){document.getElementById('pause-menu').style.display='block';}
}
function openLoadScreenFromTitle(){
document.getElementById('title').style.display='none';
var sc=document.getElementById('load-screen');sc.style.display='block';
renderLoadSlots();
}
function renderLoadSlots(){
var list=document.getElementById('load-slots-list');list.innerHTML='';
var saves=getSaves();var keys=Object.keys(saves);
if(keys.length==0){list.innerHTML='<p style="color:#888;text-align:center;font-size:7px;">No saved games</p>';return;}
keys.sort(function(a,b){return (saves[b].timestamp||0)-(saves[a].timestamp||0);});
for(var i=0;i<keys.length;i++){(function(k){var s=saves[k];
var d=new Date(s.timestamp||0);var ds=d.toLocaleDateString()+' '+d.toLocaleTimeString();
var div=document.createElement('div');div.className='save-slot';
div.innerHTML='<span class="slot-name">'+k+'</span><span class="slot-delete" onclick="event.stopPropagation();confirmDeleteSave(\\''+k+'\\')">X</span><br><span class="slot-info">'+s.gameMode+' | HP:'+Math.round(s.player.hp)+'/'+s.player.maxHp+' | '+ds+'</span>';
div.onclick=function(){doLoadGame(k);};
list.appendChild(div);})(keys[i]);}
}
function confirmDeleteSave(name){if(confirm('Delete save: '+name+'?')){deleteSave(name);renderLoadSlots();}}
function doLoadGame(name){
if(loadGame(name)){
document.getElementById('load-screen').style.display='none';
document.getElementById('title').style.display='none';
if(!canvas){canvas=document.getElementById('game');ctx=canvas.getContext('2d');}
gameState='playing';
document.getElementById('save-btn-hud').style.display='block';
lastTime=performance.now();
requestAnimationFrame(gameLoop);
showMsg('Loaded: '+name);
}
}
var gameMsgText='';var gameMsgTimer=0;
"""

# Insert JS before the closing </script> tag
c = c.replace('</script>', js_code + '\n</script>')
print('5. JavaScript save/load functions added')


# === 6. SHOW SAVE BUTTON WHEN GAME STARTS ===
c = c.replace("gameState='playing';document.getElementById('title').style.display='none';", "gameState='playing';document.getElementById('title').style.display='none';document.getElementById('save-btn-hud').style.display='block';")
print('6. Save HUD button shown on game start')

# === 7. INTEGRATE MESSAGE DISPLAY ===
old_msg = "if(gameMsgTimer>0){ctx.save();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(20,120,200,20);ctx.fillStyle='#ff4';ctx.font="
if old_msg in c:
    c = c.replace(old_msg, "if(gameMsgTimer>0||gameMsgText){ctx.save();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(20,120,200,20);ctx.fillStyle='#ff4';ctx.font=")
    print('7. Message display integrated')
else:
    print('7. Message display - using existing system')

# === 8. WRITE THE FILE ===
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('All changes saved to index.html!')
