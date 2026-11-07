
if(!window.performance)window.performance={};if(!performance.now)performance.now=function(){return Date.now();};
if(!Array.isArray)Array.isArray=function(a){return Object.prototype.toString.call(a)==='[object Array]';};
// === GAME CONSTANTS ===
var W=240,H=282,TILE=8,COLS=30,ROWS=32;
var canvas=null,ctx=null;
try { canvas=document.getElementById('game'); if(canvas) ctx=canvas.getContext('2d'); } catch(e) {}
var CHUNK_W=16,WORLD_W=128,WORLD_H=40,SEA=20;
var BLOCKS={AIR:0,DIRT:1,GRASS:2,STONE:3,SAND:4,WOOD:5,LEAVES:6,COAL_ORE:7,IRON_ORE:8,GOLD_ORE:9,DIAMOND_ORE:10,PLANKS:11,COBBLE:12,BEDROCK:13,WATER:14,SNOW:15,GLASS:16,TORCH:17,FURNACE:18,CHEST:19,GRAVEL:20,CLAY:21,CACTUS:22,DOOR:23,LADDER:24,FARMLAND:25,WHEAT1:26,WHEAT2:27,WHEAT3:28,BED:29};
var ITEMS={STICK:100,WOOD_PICK:101,STONE_PICK:102,IRON_PICK:103,DIAMOND_PICK:104,WOOD_SWORD:105,STONE_SWORD:106,IRON_SWORD:107,DIAMOND_SWORD:108,WOOD_AXE:109,WOOD_SHOVEL:110,IRON_INGOT:111,GOLD_INGOT:112,DIAMOND:113,COAL:114,RAW_PORK:115,COOKED_PORK:116,STONE_AXE:117,IRON_AXE:118,DIAMOND_AXE:119,STONE_SHOVEL:120,IRON_SHOVEL:121,DIAMOND_SHOVEL:122,WHEAT_SEEDS:123,WHEAT_ITEM:124,BREAD:125,WOOD_HOE:126,STRING:127,BONE:128,WOOL:129,ROTTEN_FLESH:130,STONE_HOE:131,IRON_HOE:132,DIAMOND_HOE:133,DOOR_ITEM:134};
var BCOLORS={};
BCOLORS[0]='rgba(0,0,0,0)';BCOLORS[1]='#8B6914';BCOLORS[2]='#4a8f3f';BCOLORS[3]='#808080';BCOLORS[4]='#d2b48c';BCOLORS[5]='#8B5A2B';BCOLORS[6]='#228B22';BCOLORS[7]='#404040';BCOLORS[8]='#B87333';BCOLORS[9]='#FFD700';BCOLORS[10]='#00FFFF';BCOLORS[11]='#DEB887';BCOLORS[12]='#696969';BCOLORS[13]='#1a1a1a';BCOLORS[14]='rgba(30,100,200,0.6)';BCOLORS[15]='#F0F0F0';BCOLORS[16]='rgba(200,230,255,0.4)';BCOLORS[17]='#FFD700';BCOLORS[18]='#555';BCOLORS[19]='#8B4513';BCOLORS[20]='#9E9E9E';BCOLORS[21]='#B0A090';BCOLORS[22]='#006400';
BCOLORS[23]='#8B4513';BCOLORS[24]='#C4A882';BCOLORS[25]='#6B3A1F';BCOLORS[26]='#2d8a2d';BCOLORS[27]='#4aa84a';BCOLORS[28]='#d4a017';
var BNAMES={};
BNAMES[0]='Air';BNAMES[1]='Dirt';BNAMES[2]='Grass';BNAMES[3]='Stone';BNAMES[4]='Sand';BNAMES[5]='Wood';BNAMES[6]='Leaves';BNAMES[7]='Coal Ore';BNAMES[8]='Iron Ore';BNAMES[9]='Gold Ore';BNAMES[10]='Diamond';BNAMES[11]='Planks';BNAMES[12]='Cobble';BNAMES[13]='Bedrock';BNAMES[14]='Water';BNAMES[15]='Snow';BNAMES[16]='Glass';BNAMES[17]='Torch';BNAMES[18]='Furnace';BNAMES[19]='Chest';BNAMES[20]='Gravel';BNAMES[21]='Clay';BNAMES[22]='Cactus';BNAMES[23]='Door';BNAMES[29]='Bed';
var HARDNESS={};var BLOCK_HEALTH={};BLOCK_HEALTH[1]=2;BLOCK_HEALTH[2]=2;BLOCK_HEALTH[3]=6;BLOCK_HEALTH[4]=2;BLOCK_HEALTH[5]=4;BLOCK_HEALTH[6]=1;BLOCK_HEALTH[7]=6;BLOCK_HEALTH[8]=9;BLOCK_HEALTH[9]=12;BLOCK_HEALTH[10]=15;BLOCK_HEALTH[11]=3;BLOCK_HEALTH[12]=6;BLOCK_HEALTH[13]=999;BLOCK_HEALTH[15]=1;BLOCK_HEALTH[16]=2;BLOCK_HEALTH[17]=0;BLOCK_HEALTH[18]=6;BLOCK_HEALTH[19]=4;BLOCK_HEALTH[20]=2;BLOCK_HEALTH[21]=2;BLOCK_HEALTH[22]=1;BLOCK_HEALTH[23]=4;BLOCK_HEALTH[24]=2;BLOCK_HEALTH[25]=1;var PICKAXE_SPEED={101:1.0,102:0.75,103:1.5,104:2.5};
HARDNESS[1]=1;HARDNESS[2]=1;HARDNESS[3]=3;HARDNESS[4]=1;HARDNESS[5]=2;HARDNESS[6]=0.5;HARDNESS[7]=4;HARDNESS[8]=4;HARDNESS[9]=5;HARDNESS[10]=6;HARDNESS[11]=1.5;HARDNESS[12]=2;HARDNESS[13]=999;HARDNESS[14]=999;HARDNESS[15]=0.5;HARDNESS[16]=1;HARDNESS[17]=0;HARDNESS[18]=3;HARDNESS[19]=2;HARDNESS[20]=1;HARDNESS[21]=1;HARDNESS[22]=0.5;
HARDNESS[23]=2;HARDNESS[24]=1;HARDNESS[25]=0.5;HARDNESS[26]=0;HARDNESS[27]=0;HARDNESS[28]=0;
var DROPS={};
DROPS[2]=1;DROPS[3]=12;DROPS[5]=5;DROPS[6]=0;DROPS[7]=114;DROPS[8]=8;DROPS[9]=9;DROPS[10]=113;DROPS[15]=15;DROPS[16]=0;DROPS[17]=17;DROPS[18]=18;DROPS[22]=22;
DROPS[23]=23;DROPS[24]=24;DROPS[29]=29;DROPS[25]=1;DROPS[26]=123;DROPS[27]=123;DROPS[28]=124;
var ICOLORS={};
ICOLORS[100]='#8B5A2B';ICOLORS[101]='#DEB887';ICOLORS[102]='#696969';ICOLORS[103]='#B87333';ICOLORS[104]='#00FFFF';ICOLORS[105]='#DEB887';ICOLORS[106]='#696969';ICOLORS[107]='#B87333';ICOLORS[108]='#00FFFF';ICOLORS[109]='#DEB887';ICOLORS[110]='#DEB887';ICOLORS[111]='#C0C0C0';ICOLORS[112]='#FFD700';ICOLORS[113]='#00FFFF';ICOLORS[114]='#333';ICOLORS[115]='#FF8080';ICOLORS[116]='#CC5533';
ICOLORS[123]='#2d5a1e';ICOLORS[124]='#d4a017';ICOLORS[125]='#c8a060';ICOLORS[126]='#DEB887';ICOLORS[127]='#EEEEEE';ICOLORS[128]='#F5F5DC';
ICOLORS[117]='#696969';ICOLORS[118]='#B87333';ICOLORS[119]='#00FFFF';ICOLORS[120]='#696969';ICOLORS[121]='#B87333';ICOLORS[122]='#00FFFF';
var INAMES={};
INAMES[100]='Stick';INAMES[101]='Wood Pickaxe';INAMES[102]='Stone Pickaxe';INAMES[103]='Iron Pickaxe';INAMES[104]='Diamond Pickaxe';INAMES[105]='Wood Sword';INAMES[106]='Stone Sword';INAMES[107]='Iron Sword';INAMES[108]='Diamond Sword';INAMES[109]='Wood Hatchet';INAMES[110]='Wood Shovel';INAMES[111]='Iron Ingot';INAMES[112]='Gold Ingot';INAMES[113]='Diamond';INAMES[114]='Coal';INAMES[115]='Raw Pork';INAMES[116]='Cooked Pork';
INAMES[134]='Door';
INAMES[123]='Seeds';INAMES[124]='Wheat';INAMES[125]='Bread';INAMES[126]='Wood Hoe';INAMES[127]='String';INAMES[128]='Bone';INAMES[129]='Wool';INAMES[130]='Rotten Flesh';INAMES[131]='Stone Hoe';INAMES[132]='Iron Hoe';INAMES[133]='Diamond Hoe';
INAMES[117]='Stone Hatchet';INAMES[118]='Iron Hatchet';INAMES[119]='Diamond Hatchet';INAMES[120]='Stone Shovel';INAMES[121]='Iron Shovel';INAMES[122]='Diamond Shovel';
var TOOL_POWER={};
TOOL_POWER[101]=2;TOOL_POWER[102]=4;TOOL_POWER[103]=6;TOOL_POWER[104]=8;TOOL_POWER[109]=3;TOOL_POWER[110]=2;
TOOL_POWER[117]=4;TOOL_POWER[118]=6;TOOL_POWER[119]=8;TOOL_POWER[120]=3;TOOL_POWER[121]=5;TOOL_POWER[122]=7;
TOOL_POWER[126]=2;TOOL_POWER[131]=3;TOOL_POWER[132]=5;TOOL_POWER[133]=7;
var SWORD_DMG={};
SWORD_DMG[105]=4;SWORD_DMG[106]=5;SWORD_DMG[107]=6;SWORD_DMG[108]=8;
var FOOD_HEAL={};
FOOD_HEAL[115]=1;FOOD_HEAL[116]=3;
FOOD_HEAL[125]=5;
// === CRAFTING RECIPES ===
var RECIPES=[
{inp:[[5,1]],out:11,cnt:4,name:'Planks'},
{inp:[[11,2]],out:100,cnt:4,name:'Sticks'},
{inp:[[11,3],[100,2]],out:101,cnt:1,name:'Wood Pickaxe'},
{inp:[[12,3],[100,2]],out:102,cnt:1,name:'Stone Pickaxe'},
{inp:[[111,3],[100,2]],out:103,cnt:1,name:'Iron Pickaxe'},
{inp:[[113,3],[100,2]],out:104,cnt:1,name:'Diamond Pickaxe'},
{inp:[[11,2],[100,1]],out:105,cnt:1,name:'Wood Sword'},
{inp:[[12,2],[100,1]],out:106,cnt:1,name:'Stone Sword'},
{inp:[[111,2],[100,1]],out:107,cnt:1,name:'Iron Sword'},
{inp:[[113,2],[100,1]],out:108,cnt:1,name:'Diamond Sword'},
{inp:[[11,3],[100,2]],out:109,cnt:1,name:'Wood Hatchet'},
{inp:[[11,1],[100,2]],out:110,cnt:1,name:'Wood Shovel'},
{inp:[[12,3],[100,2]],out:117,cnt:1,name:'Stone Hatchet'},{inp:[[111,3],[100,2]],out:118,cnt:1,name:'Iron Hatchet'},{inp:[[113,3],[100,2]],out:119,cnt:1,name:'Diamond Hatchet'},{inp:[[12,1],[100,2]],out:120,cnt:1,name:'Stone Shovel'},{inp:[[111,1],[100,2]],out:121,cnt:1,name:'Iron Shovel'},{inp:[[113,1],[100,2]],out:122,cnt:1,name:'Diamond Shovel'},
{inp:[[12,8]],out:18,cnt:1,name:'Furnace'},
{inp:[[124,3]],out:125,cnt:1,name:'Bread'},
{inp:[[100,2],[11,2]],out:126,cnt:1,name:'Wood Hoe'},
{inp:[[11,6]],out:23,cnt:3,name:'Door'},
{inp:[[100,7]],out:24,cnt:3,name:'Ladder'},
{inp:[[11,8]],out:19,cnt:1,name:'Chest'},
{inp:[[114,1],[100,1]],out:17,cnt:4,name:'Torch'},
{inp:[[4,4]],out:16,cnt:4,name:'Glass'}
,{inp:[[127,4]],out:129,cnt:1,name:'Wool'},{inp:[[129,3],[11,3]],out:29,cnt:1,name:'Bed'},{inp:[[12,2],[100,2]],out:131,cnt:1,name:'Stone Hoe'},{inp:[[111,2],[100,2]],out:132,cnt:1,name:'Iron Hoe'},{inp:[[113,2],[100,2]],out:133,cnt:1,name:'Diamond Hoe'}];
var SMELT={};SMELT[8]=111;SMELT[9]=112;SMELT[4]=16;SMELT[115]=116;SMELT[12]=3;
// === GAME STATE ===
var canvas,ctx,gameState='title',gameMode='survival';
var world=[],camX=0,camY=0;
var SAVE_VERSION=4;var MAX_SAVE_BYTES=2200000;
var SAVE_NAME_MAX=32;
var SAVE_SLOTS_LIMIT=40;
var lowMotionMode=false;
var highContrastMode=false;
var accessibilityMode=false;
var cameraSmoothingEnabled=true;
// === AUDIO SETTINGS ===
var soundMuted=false;
var masterVolume=0.7;
var soundEnabled=true;
var audioQuality='high'; // 'low' | 'medium' | 'high'
// === HUD / CONTROL PREFERENCES ===
var hudScale=1.0;
var controlSmoothing=true;
var toastHistory=[];
var toastHistoryLimit=40;
var attackCooldownMs=300;
var weaponReach=1.5;
var lastAttackTime=0;
var pointerCancelled=false;
// Combat balance helpers (pure-ish, deterministic)
var ATTACK_COOLDOWN_MS=300;
var SWORD_REACH_BLOCKS={105:1.4,106:1.5,107:1.6,108:1.8};
var SWORD_KNOCKBACK={105:1.8,106:2.2,107:2.6,108:3.0};
var INVULN_FRAMES=45;
var PLAYER_KNOCKBACK_MULT=1.0;
function getSwordDamage(id){if(SWORD_DMG[id])return SWORD_DMG[id];return id>=105&&id<=108?1:0;}
function getSwordReachBlocks(id){if(SWORD_REACH_BLOCKS[id])return SWORD_REACH_BLOCKS[id];return weaponReach;}
function getAttackCooldownMs(){return attackCooldownMs||ATTACK_COOLDOWN_MS;}
function isInAttackRange(dxBlocks,dyBlocks,reachBlocks){var r=(typeof reachBlocks==='number'?reachBlocks:weaponReach);return Math.abs(dxBlocks)<=r && Math.abs(dyBlocks)<=r;}
function computeKnockbackForSword(id){return SWORD_KNOCKBACK[id]||2.0;}
function canDamagePlayerNow(){return (player.invulnTimer||0)<=0;}
function applyPlayerInvulnerability(frames){player.invulnTimer=(typeof frames==='number'?frames:INVULN_FRAMES);}
// aliases for tests
function combatDamage(heldId){return getSwordDamage(heldId);}
function combatReach(heldId){return getSwordReachBlocks(heldId);}
function combatCooldownMs(){return getAttackCooldownMs();}
function isAttackInRange(dx,dy,reach){return isInAttackRange(dx,dy,reach);}
var touchState={active:false,startX:0,startY:0,moved:false,longPressed:false,joystickX:0,joystickY:0};
var camTargetX=0,camTargetY=0;
var player={x:128,y:0,vx:0,vy:0,w:6,h:12,onGround:false,hp:20,maxHp:20,air:10,selectedSlot:0,mining:0,mineX:-1,mineY:-1,dir:1,attacking:0,hunger:20,maxHunger:20,hungerTimer:0,flying:false,fallDist:0,lastY:0,spawnX:128,spawnY:0,invulnTimer:0};
var inventory=[];for(var i=0;i<36;i++)inventory.push({id:0,count:0});
var hotbar=9,cursorX=15,cursorY=15;
var dayTime=0,dayLength=12000,isNight=false;var heightMap=[];
// === WEATHER SYSTEM ===
var weatherState='clear',weatherTimer=0,weatherDuration=0,weatherTransition=0;
var raindrops=[],lightningFlash=0,lightningTimer=0,thunderTimer=0;
var weatherIntensity=0,targetIntensity=0;
var WEATHER_MIN_CLEAR=1800,WEATHER_MAX_CLEAR=6000;
var WEATHER_MIN_STORM=600,WEATHER_MAX_STORM=2400;
var entities=[],particles=[],arrows=[];
// === ENEMY SPAWN SETTINGS ===
var MAX_NIGHT_ENEMIES=2,MAX_CAVE_ENEMIES=3,MAX_SHEEP=4,MAX_TOTAL_ENTITIES=7;
var NIGHT_SPAWN_CHANCE=0.0022,CAVE_SPAWN_CHANCE=0.0035,SHEEP_SPAWN_CHANCE=0.0025;
var NIGHT_SPAWN_COOLDOWN=0,caveSpawnCD=0;
// Protected building blocks that should not be spawn points (or nearby)
var PROTECTED_BLOCKS=[BLOCKS.BED,BLOCKS.CHEST,BLOCKS.FURNACE,BLOCKS.DOOR];
var MIN_NIGHT_SPAWN_DISTANCE=12;
var MAX_NIGHT_SPAWN_DISTANCE=22;
var NIGHT_ROOF_OPEN_TILES=3;
// Pure spawn-rule helpers
function distance2D(ax,ay,bx,by){var dx=ax-bx,dy=ay-by;return Math.sqrt(dx*dx+dy*dy);}
function isProtectedBlockType(id){return PROTECTED_BLOCKS.indexOf(id)>=0;}
function countNightEnemies(entitiesArr){var n=0;for(var i=0;i<entitiesArr.length;i++){var t=entitiesArr[i].type;if(t==='zombie'||t==='skeleton'||t==='creeper')n++;}return n;}
function countCaveEnemies(entitiesArr){var n=0;for(var i=0;i<entitiesArr.length;i++){var t=entitiesArr[i].type;if(t==='cave_spider'||t==='cave_skeleton')n++;}return n;}
function countEntitiesByType(entitiesArr,type){var n=0;for(var i=0;i<entitiesArr.length;i++)if(entitiesArr[i].type===type)n++;return n;}
function isNightMobSpawnAllowed(opts){
// opts: {isNight, nightEnemyCount, maxNight, totalEntities, maxTotal, sheltered, onSurfaceExposed, cooldown, rngRoll, chance, protectedNearby}
if(!opts)return false;
if(!opts.isNight)return false;
if(opts.nightEnemyCount>=opts.maxNight)return false;
if(opts.totalEntities>=opts.maxTotal)return false;
if(opts.cooldown>0)return false;
if(opts.sheltered && (opts.rngRoll||0)<0.55)return false;
if(opts.protectedNearby)return false;
if(!opts.onSurfaceExposed)return false;
if((typeof opts.rngRoll==='number') && (typeof opts.chance==='number') && opts.rngRoll>opts.chance)return false;
return true;
}
// Aliases
function canSpawnNightMob(o){return isNightMobSpawnAllowed(o);}
function isSpawnProtectedNearby(blocks){ // blocks: array of block ids within radius
for(var i=0;i<blocks.length;i++)if(isProtectedBlockType(blocks[i]))return true;return false;
}
// === SOUND SYSTEM ===
var audioCtx=null;
function initAudio(){if(!audioCtx){try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){audioCtx=null;}}}
function getAudioVolume(){if(soundMuted||!soundEnabled)return 0;var v=typeof masterVolume==='number'?masterVolume:0.7;v=Math.max(0,Math.min(1,v));if(audioQuality==='low')v*=0.6;if(audioQuality==='medium')v*=0.8;return v;}
function audioMutedState(){return !!soundMuted||!soundEnabled;}
function setMasterVolume(v){masterVolume=Math.max(0,Math.min(1,Number(v)||0));try{saveQualitySettings();}catch(e){}return masterVolume;}
function setAudioVolume(v){return setMasterVolume(v);}
function setVolume(v){return setMasterVolume(v);}
function getVolume(){return masterVolume;}
function getAudioSettings(){return {soundEnabled:!!soundEnabled,audioMuted:!!soundMuted,masterVolume:masterVolume,audioQuality:audioQuality};}
function toggleMute(){soundMuted=!soundMuted;if(soundMuted)soundEnabled=false;else soundEnabled=true;try{saveQualitySettings();}catch(e){}try{r1Toast('Sound: '+(soundMuted?'MUTED':'ON'),900);}catch(e){}return soundMuted;}
function toggleSound(){soundEnabled=!soundEnabled;if(!soundEnabled)soundMuted=true;else soundMuted=false;try{saveQualitySettings();}catch(e){}try{r1Toast('Sound: '+(soundEnabled?'ON':'OFF'),900);}catch(e){}return soundEnabled;}
function muteAudio(){soundMuted=true;soundEnabled=false;try{saveQualitySettings();}catch(e){}return true;}
function unmuteAudio(){soundMuted=false;soundEnabled=true;try{saveQualitySettings();}catch(e){}return true;}
function setAudioQuality(q){if(q==='low'||q==='medium'||q==='high')audioQuality=q;try{saveQualitySettings();}catch(e){}return audioQuality;}
// Audio aliases
function toggleVolume(){return toggleMute();}
function toggleAudio(){return toggleSound();}
function toggleSoundEnabled(){return toggleSound();}
function setAudioMuted(v){soundMuted=!!v;soundEnabled=!soundMuted;try{saveQualitySettings();}catch(e){}return soundMuted;}
function isMuted(){return !!soundMuted||!soundEnabled;}
function isSoundEnabled(){return !!soundEnabled&&!soundMuted;}
function mute(){return muteAudio();}
function unmute(){return unmuteAudio();}
function volumeUp(step){step=step||0.1;return setMasterVolume(masterVolume+step);}
function volumeDown(step){step=step||0.1;return setMasterVolume(masterVolume-step);}
function getMasterVolume(){return masterVolume;}
function audioVolume(){return getAudioVolume();}
function setSoundVolume(v){return setMasterVolume(v);}
function soundVolume(){return masterVolume;}
function applyAudioSettings(){try{if(soundMuted){soundEnabled=false;} }catch(e){} return getAudioSettings();}
function playSound(type){initAudio();if(!audioCtx)return;var vol=getAudioVolume();if(vol<=0)return;if(typeof audioCtx.createOscillator!=='function')return;var osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);var now=audioCtx.currentTime;
if(type==='break'){osc.type='square';osc.frequency.setValueAtTime(200,now);osc.frequency.exponentialRampToValueAtTime(80,now+0.12);gain.gain.setValueAtTime(0.15*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);osc.start(now);osc.stop(now+0.12);}
else if(type==='place'){osc.type='triangle';osc.frequency.setValueAtTime(400,now);osc.frequency.exponentialRampToValueAtTime(600,now+0.05);gain.gain.setValueAtTime(0.12*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.08);osc.start(now);osc.stop(now+0.08);}
else if(type==='hit'){osc.type='sawtooth';osc.frequency.setValueAtTime(150,now);osc.frequency.exponentialRampToValueAtTime(60,now+0.06);gain.gain.setValueAtTime(0.1*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.06);osc.start(now);osc.stop(now+0.06);}
else if(type==='eat'){osc.type='sine';osc.frequency.setValueAtTime(300,now);osc.frequency.setValueAtTime(400,now+0.05);osc.frequency.setValueAtTime(500,now+0.1);gain.gain.setValueAtTime(0.1*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);osc.start(now);osc.stop(now+0.15);}
else if(type==='explode'||type==='explosion'){osc.type='sawtooth';osc.frequency.setValueAtTime(100,now);osc.frequency.exponentialRampToValueAtTime(20,now+0.4);gain.gain.setValueAtTime(0.2*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.4);osc.start(now);osc.stop(now+0.4);}
else if(type==='levelup'){osc.type='sine';osc.frequency.setValueAtTime(400,now);osc.frequency.setValueAtTime(600,now+0.1);osc.frequency.setValueAtTime(800,now+0.2);gain.gain.setValueAtTime(0.1*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);osc.start(now);osc.stop(now+0.3);}
else if(type==='attack'||type==='swing'||type==='sword'){osc.type='square';osc.frequency.setValueAtTime(260,now);osc.frequency.exponentialRampToValueAtTime(90,now+0.09);gain.gain.setValueAtTime(0.12*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);osc.start(now);osc.stop(now+0.1);}
else if(type==='hurt'||type==='damage'){osc.type='sawtooth';osc.frequency.setValueAtTime(220,now);osc.frequency.exponentialRampToValueAtTime(90,now+0.12);gain.gain.setValueAtTime(0.14*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);osc.start(now);osc.stop(now+0.12);}
else if(type==='pickup'||type==='pick'){osc.type='triangle';osc.frequency.setValueAtTime(520,now);osc.frequency.setValueAtTime(780,now+0.06);gain.gain.setValueAtTime(0.08*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);osc.start(now);osc.stop(now+0.1);}
else if(type==='craft'){osc.type='sine';osc.frequency.setValueAtTime(330,now);osc.frequency.setValueAtTime(495,now+0.06);osc.frequency.setValueAtTime(660,now+0.12);gain.gain.setValueAtTime(0.09*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.18);osc.start(now);osc.stop(now+0.18);}
else if(type==='error'||type==='deny'||type==='fail'){osc.type='square';osc.frequency.setValueAtTime(120,now);osc.frequency.setValueAtTime(90,now+0.08);gain.gain.setValueAtTime(0.1*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);osc.start(now);osc.stop(now+0.12);}
else if(type==='jump'){osc.type='triangle';osc.frequency.setValueAtTime(240,now);osc.frequency.exponentialRampToValueAtTime(360,now+0.07);gain.gain.setValueAtTime(0.07*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.07);osc.start(now);osc.stop(now+0.07);}
else if(type==='thunder'){osc.type='sawtooth';osc.frequency.setValueAtTime(60,now);osc.frequency.exponentialRampToValueAtTime(20,now+0.6);gain.gain.setValueAtTime(0.22*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.6);osc.start(now);osc.stop(now+0.6);}
else if(type==='ladder'||type==='step'){osc.type='triangle';osc.frequency.setValueAtTime(180,now);gain.gain.setValueAtTime(0.04*vol,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.04);osc.start(now);osc.stop(now+0.04);}
}
// === PARTICLE HELPERS ===
function spawnBreakParticles(bx,by,b){if(lowMotionMode)return;var colors=[BCOLORS[b]||'#fff'];if(b===BLOCKS.STONE||b===BLOCKS.COBBLE)colors=['#808080','#707070','#606060'];else if(b===BLOCKS.DIRT||b===BLOCKS.GRASS)colors=['#8B6914','#7a5c10','#6b4f0e'];else if(b===BLOCKS.WOOD||b===BLOCKS.PLANKS)colors=['#8B5A2B','#7a4e24','#6b421d'];else if(b===BLOCKS.SAND)colors=['#d2b48c','#c4a87b','#b69c6a'];else if(b===BLOCKS.LEAVES)colors=['#228B22','#1a6b1a','#2d9a2d'];for(var i=0;i<8;i++)particles.push({x:bx*TILE+Math.random()*TILE,y:by*TILE+Math.random()*TILE,vx:(Math.random()-0.5)*3,vy:-Math.random()*3-1,life:25+Math.random()*15,color:colors[Math.floor(Math.random()*colors.length)],size:1+Math.random()*2});}
function spawnPlaceParticles(bx,by){for(var i=0;i<5;i++)particles.push({x:bx*TILE+Math.random()*TILE,y:by*TILE+TILE,vx:(Math.random()-0.5)*1.5,vy:-Math.random()*0.5,life:15+Math.random()*10,color:'#ddd',size:1});}
var keys={left:false,right:false,up:false,down:false};
var touchStartX=0,touchStartY=0,touchActive=false;
var touchMoved=false,touchLongPressTimer=null,touchLongPressed=false,touchLongPressHandled=false;
var autoSaveTimer=0;var AUTO_SAVE_INTERVAL=30000; 
var r1LongPressHandledAt=0;var lastTime=0,dt=0,fps=0,frameCount=0,fpsTime=0;
var miningProgress=0,miningTarget={x:-1,y:-1};
// === WORLD GENERATION ===
function noise(x){var s=Math.sin(x*127.1)*43758.5453;return s-Math.floor(s);}
function smoothNoise(x){return noise(Math.floor(x))/2+noise(Math.floor(x)-1)/4+noise(Math.floor(x)+1)/4;}
function interpNoise(x){var ix=Math.floor(x),f=x-ix;f=f*f*(3-2*f);return smoothNoise(ix)*(1-f)+smoothNoise(ix+1)*f;}
function octaveNoise(x,oct){var v=0,amp=1,freq=1,max=0;for(var i=0;i<oct;i++){v+=interpNoise(x*freq)*amp;max+=amp;amp*=0.5;freq*=2;}return v/max;}
function generateWorld(){
world=[];
for(var x=0;x<WORLD_W;x++){world[x]=[];for(var y=0;y<WORLD_H;y++)world[x][y]=BLOCKS.AIR;}
var seed=Math.random()*10000;
for(var x=0;x<WORLD_W;x++){
var h=Math.floor(10+octaveNoise((x+seed)*0.03,4)*5);if(h<4)h=4;if(h>=WORLD_H-1)h=WORLD_H-2;heightMap[x]=h;
var biome=getBiome(x,seed);
// Surface
for(var y=h;y<WORLD_H;y++){
if(y==h){
if(biome==0)world[x][y]=BLOCKS.GRASS;
else if(biome==1)world[x][y]=BLOCKS.GRASS;
else if(biome==2)world[x][y]=BLOCKS.SAND;
else if(biome==3)world[x][y]=BLOCKS.SNOW;
else world[x][y]=BLOCKS.STONE;
}else if(y<h+4){
if(biome==2)world[x][y]=BLOCKS.SAND;
else world[x][y]=BLOCKS.DIRT;
}else if(y<WORLD_H-1){
world[x][y]=BLOCKS.STONE;
// Ores
var oreN=Math.random();
if(y>h+16&&oreN<0.008)world[x][y]=BLOCKS.DIAMOND_ORE;
else if(y>h+12&&oreN<0.02)world[x][y]=BLOCKS.GOLD_ORE;
else if(y>h+6&&oreN<0.05)world[x][y]=BLOCKS.IRON_ORE;
else if(y>h+2&&oreN<0.09)world[x][y]=BLOCKS.COAL_ORE;
else if(oreN<0.04)world[x][y]=BLOCKS.GRAVEL;
}else{world[x][y]=BLOCKS.BEDROCK;}
}
// Simple caves
for(var y=h+4;y<WORLD_H-2;y++){
var cv=interpNoise((x+seed*3)*0.09+y*0.09);
if(cv>0.75&&world[x][y]==BLOCKS.STONE){world[x][y]=BLOCKS.AIR;}
}
// Small ponds only - use noise to decide if this column gets a pond
var pondChance=noise((x+seed)*0.3);if(pondChance>0.88){for(var wy=h;wy<h+3&&wy<WORLD_H;wy++){if(world[x][wy]==BLOCKS.GRASS||world[x][wy]==BLOCKS.DIRT||world[x][wy]==BLOCKS.SNOW||world[x][wy]==BLOCKS.SAND)world[x][wy]=BLOCKS.SAND;}if(h+1<WORLD_H)world[x][h]=BLOCKS.WATER;}


}
// Find spawn
player.x=WORLD_W/2*TILE;
for(var y=0;y<WORLD_H;y++){if(world[Math.floor(player.x/TILE)][y]!=BLOCKS.AIR&&world[Math.floor(player.x/TILE)][y]!=BLOCKS.WATER){player.y=(y-2)*TILE;break;}}
}
function getBiome(x,seed){var b=octaveNoise((x+seed)*0.005,2);if(b<0.15)return 2;if(b<0.35)return 0;if(b<0.55)return 1;if(b<0.8)return 3;return 0;}
// === PLAYER PHYSICS ===
var doorStates={};
function isDoorBlock(x,y){if(x<0||x>=WORLD_W||y<0||y>=WORLD_H)return false;return world[x][y]===BLOCKS.DOOR;}
function openDoor(x,y){var k=x+','+y;doorStates[k]={open:true,timer:3.0};}
function isDoorOpen(x,y){var k=x+','+y;return doorStates[k]&&doorStates[k].open;}
function closeDoor(x,y){var k=x+','+y;if(doorStates[k])doorStates[k].open=false;}
function toggleDoor(x,y){if(isDoorOpen(x,y)){closeDoor(x,y);}else{openDoor(x,y);}}
function updateDoors(dt){for(var k in doorStates){if(doorStates[k].open){doorStates[k].timer-=dt;if(doorStates[k].timer<=0){doorStates[k].open=false;}}}}
function isSolidForPlayer(x,y){if(isDoorBlock(x,y)&&isDoorOpen(x,y))return false;return isSolid(x,y);}
function isSolidForEnemy(x,y){if(isDoorBlock(x,y)&&isDoorOpen(x,y))return false;return isSolid(x,y);}

function isSolid(x,y){if(x<0||x>=WORLD_W||y<0||y>=WORLD_H)return true;var b=world[x][y];return b!=BLOCKS.AIR&&b!=BLOCKS.WATER&&b!=BLOCKS.TORCH&&b!=BLOCKS.LADDER&&b!=BLOCKS.WHEAT1&&b!=BLOCKS.WHEAT2&&b!=BLOCKS.WHEAT3;}
function isPlayerSheltered(){if(!player)return false;var px=Math.floor((player.x+player.w/2)/TILE),py=Math.floor(player.y/TILE);for(var dy=-1;dy>=-4;dy--){var yy=py+dy;if(yy<0)return true;if(isSolid(px,yy))return true;}return false;}
function updatePlayer(dt){
// Door auto-open for player: only open closed doors when player is moving into them
var ptx1=Math.floor(player.x/TILE),ptx2=Math.floor((player.x+player.w)/TILE);
var pty1=Math.floor(player.y/TILE),pty2=Math.floor((player.y+player.h)/TILE);
for(var ddx=ptx1;ddx<=ptx2;ddx++){for(var ddy=pty1;ddy<=pty2;ddy++){if(isDoorBlock(ddx,ddy)&&!isDoorOpen(ddx,ddy)){openDoor(ddx,ddy);}}}
// Also check 1 tile ahead based on movement direction
var aheadX=Math.floor((player.x+(player.vx>0?player.w+2:-2))/TILE);
for(var ddy2=pty1;ddy2<=pty2;ddy2++){if(isDoorBlock(aheadX,ddy2)&&!isDoorOpen(aheadX,ddy2)){openDoor(aheadX,ddy2);}}

var spd=1.3,grav=0.32,jumpF=-4.6,maxFall=5.2;
if(isOnLadder()){grav=0.05;maxFall=1;if(keys.up)player.vy=-1.5;if(keys.down)player.vy=1;}
if(player.flying){grav=0;player.vy=0;if(keys.up)player.vy=-2;if(keys.down)player.vy=2;}
applyFallDamage();
if(keys.left){player.vx=-spd;player.dir=-1;}
else if(keys.right){player.vx=spd;player.dir=1;}
else player.vx*=Math.pow(controlSmoothing?0.72:0.55,dt||1);
if(keys.up&&player.onGround)player.vy=jumpF;
player.vy+=grav;
if(player.vy>maxFall)player.vy=maxFall;
// Invulnerability frames (decayed per dt)
if(player.invulnTimer>0)player.invulnTimer=Math.max(0,player.invulnTimer-dt);
// Smooth knockback damping (only when not actively walking)
if(player.knockbackX && !keys.left && !keys.right){player.vx=player.knockbackX;player.knockbackX*=0.7;if(Math.abs(player.knockbackX)<0.05)player.knockbackX=0;} else if(keys.left||keys.right){player.knockbackX=0;}
// Push player out of solid blocks
var ptx1=Math.floor(player.x/TILE),ptx2=Math.floor((player.x+player.w-1)/TILE);
var pty1=Math.floor(player.y/TILE),pty2=Math.floor((player.y+player.h-1)/TILE);
var stuck=false;
for(var tx=ptx1;tx<=ptx2;tx++){for(var ty=pty1;ty<=pty2;ty++){if(isSolidForPlayer(tx,ty)){stuck=true;break;}}if(stuck)break;}
if(stuck){var pushed=false;for(var sy=pty1-1;sy>=0;sy--){var clear=true;for(var tx=ptx1;tx<=ptx2;tx++){if(isSolidForPlayer(tx,sy)||isSolidForPlayer(tx,sy+1)){clear=false;break;}}if(clear){player.y=sy*TILE;player.vy=0;pushed=true;break;}}if(!pushed){for(var sy=pty2+1;sy<WORLD_H-1;sy++){var clear=true;for(var tx=ptx1;tx<=ptx2;tx++){if(isSolidForPlayer(tx,sy)||isSolidForPlayer(tx,sy+1)){clear=false;break;}}if(clear){player.y=sy*TILE;player.vy=0;break;}}}}
// X collision
var nx=player.x+player.vx;
var tx1=Math.floor(nx/TILE),tx2=Math.floor((nx+player.w-1)/TILE);
var ty1=Math.floor(player.y/TILE),ty2=Math.floor((player.y+player.h-1)/TILE);
var xBlocked=false;
for(var ty=ty1;ty<=ty2;ty++){if(isSolidForPlayer(tx1,ty)||isSolidForPlayer(tx2,ty)){xBlocked=true;break;}}
if(!xBlocked)player.x=nx;else player.vx=0;
// Y collision
var ny=player.y+player.vy;
var tx1b=Math.floor(player.x/TILE),tx2b=Math.floor((player.x+player.w-1)/TILE);
var ty1b=Math.floor(ny/TILE),ty2b=Math.floor((ny+player.h-1)/TILE);
var yBlocked=false;
player.onGround=false;
for(var tx=tx1b;tx<=tx2b;tx++){if(isSolidForPlayer(tx,ty1b)||isSolidForPlayer(tx,ty2b)){yBlocked=true;break;}}
if(!yBlocked)player.y=ny;else{if(player.vy>0)player.onGround=true;player.vy=0;}
// Keep in bounds
if(player.x<0)player.x=0;if(player.x>=(WORLD_W-1)*TILE)player.x=(WORLD_W-1)*TILE;
if(player.y<0)player.y=0;if(player.y>=(WORLD_H-1)*TILE){player.y=(WORLD_H-2)*TILE;player.hp=0;}
// Cursor position
cursorX=Math.floor(player.x/TILE)+player.dir*2;
cursorY=Math.floor(player.y/TILE);
if(keys.up)cursorY-=1;if(keys.down)cursorY+=1;
if(cursorX<0)cursorX=0;if(cursorX>=WORLD_W)cursorX=WORLD_W-1;
if(cursorY<0)cursorY=0;if(cursorY>=WORLD_H)cursorY=WORLD_H-1;
}
// === INVENTORY ===
function addItem(id,count){
if(!count)count=1;if(id==0)return false;
for(var i=0;i<36;i++){if(inventory[i].id==id&&inventory[i].count<64){var add=Math.min(count,64-inventory[i].count);inventory[i].count+=add;count-=add;if(count<=0)return true;}}
for(var i=0;i<36;i++){if(inventory[i].id==0){inventory[i].id=id;inventory[i].count=Math.min(count,64);if(TOOL_TIER[id])initToolDur(i,id);count-=inventory[i].count;if(count<=0)return true;}}
return false;
}
function removeItem(id,count){
if(!count)count=1;
for(var i=35;i>=0;i--){if(inventory[i].id==id){var rem=Math.min(count,inventory[i].count);inventory[i].count-=rem;count-=rem;if(inventory[i].count<=0){inventory[i].id=0;inventory[i].count=0;}if(count<=0)return true;}}
return false;
}
function countItem(id){var c=0;for(var i=0;i<36;i++)if(inventory[i].id==id)c+=inventory[i].count;return c;}
function getHeldItem(){return inventory[player.selectedSlot];}
// === MINING & PLACING ===
function isToolMismatch(bx,by){
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)return false;
var b=world[bx][by];var req=MINE_REQ[b];
if(!req)return false;
var held=getHeldItem();var hid=held?held.id:0;var isPick=(hid>=101&&hid<=104);
if(!isPick)return true;
return getToolTierLevel(hid)<req;
}
function getToolMismatchMessage(bx,by){
if(!isToolMismatch(bx,by))return '';
var b=world[bx][by];var req=MINE_REQ[b];
var names={1:'wooden',2:'stone',3:'iron',4:'diamond'};
return 'Need '+(names[req]||'better')+' pickaxe';
}
function mineBlock(){
var bx=cursorX,by=cursorY;
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)return;
var b=world[bx][by];if(b==BLOCKS.FURNACE){openFurnace();return;}
if(b==BLOCKS.BED){if(isNight){if(!isPlayerSheltered()){showGameMsg('Need sheltered safe ground to sleep');return;}isNight=false;dayTime=0;showGameMsg('Sleeping...');player.spawnX=bx*TILE;player.spawnY=(by-1)*TILE;player.hp=Math.min(player.maxHp,player.hp+4);player.hunger=Math.min(player.maxHunger,player.hunger+4);}else{showGameMsg('Can only sleep at night');}return;}if(b==BLOCKS.CHEST){openChest(bx,by);return;}
if(b==BLOCKS.AIR||b==BLOCKS.WATER||b==BLOCKS.BEDROCK)return;
var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);
var dist=Math.abs(bx-px)+Math.abs(by-py);if(dist>MINE_RANGE_VAL)return;
playSound('hit');
var req=MINE_REQ[b];if(req&&gameMode!=='creative'){var hid=getHeldItem().id;var isPick=(hid>=101&&hid<=104);var tl=isPick?getToolTierLevel(hid):0;if(tl<req){var tierNames={1:'wooden',2:'stone',3:'iron',4:'diamond'};showGameMsg('Need '+tierNames[req]+' pickaxe!');return;}}
var hard=BLOCK_HEALTH[b]||HARDNESS[b]||1;
var held=getHeldItem();var power=1;var heldId=held.id;var isPickHeld=(heldId>=101&&heldId<=104);var isAxeHeld=(heldId==109||heldId==117||heldId==118||heldId==119);var isShovelHeld=(heldId==110||heldId==120||heldId==121||heldId==122);
if(held.id>=100&&TOOL_POWER[held.id])power=TOOL_POWER[held.id];var STONE_BLOCKS=[3,7,8,9,10,12,18];var WOOD_BLOCKS=[5,6,11];var DIRT_BLOCKS=[1,2,4,20,21,25];if(isPickHeld&&STONE_BLOCKS.indexOf(b)>=0)power*=1.5;else if(isAxeHeld&&WOOD_BLOCKS.indexOf(b)>=0)power*=1.5;else if(isShovelHeld&&DIRT_BLOCKS.indexOf(b)>=0)power*=1.5;if(isPickHeld&&PICKAXE_SPEED[heldId])power*=PICKAXE_SPEED[heldId];
if(gameMode=="creative"){miningProgress=hard;}else{miningProgress+=power*0.05;}
if(miningProgress>=hard){
miningProgress=0;
miningTarget={x:-1,y:-1};
if(held.id>=101&&held.id<=122)useToolDur(player.selectedSlot);
var drop=DROPS[b]!==undefined?DROPS[b]:b;if(b==BLOCKS.LEAVES&&Math.random()<0.1)drop=123;var oreReq=MINE_REQ[b];if(oreReq&&!isPickHeld)drop=0;if(oreReq&&isPickHeld){var pickTier=getToolTierLevel(heldId);if(pickTier<oreReq)drop=0;}
if(drop!=0)addItem(drop,1);
playSound('break');
if(drop!=0){playSound('pickup');}
world[bx][by]=BLOCKS.AIR;
r1Vibrate(40);
// Particles
for(var i=0;i<3;i++)particles.push({x:bx*TILE+4,y:by*TILE+4,vx:(Math.random()-0.5)*2,vy:-Math.random()*2,life:20,color:BCOLORS[b]||'#fff'});
}
}
function placeBlock(){
var bx=cursorX,by=cursorY;
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)return false;
if(world[bx][by]!==BLOCKS.AIR&&world[bx][by]!==BLOCKS.WATER)return false;
var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);
var dist=Math.abs(bx-px)+Math.abs(by-py);
if(dist>MINE_RANGE_VAL)return false;
var playerLeft=Math.floor(player.x/TILE),playerRight=Math.floor((player.x+player.w-1)/TILE);
var playerTop=Math.floor(player.y/TILE),playerBot=Math.floor((player.y+player.h-1)/TILE);
if(bx>=playerLeft&&bx<=playerRight&&by>=playerTop&&by<=playerBot)return false;
var held=getHeldItem();
if(!held||held.id===0)return false;
if(held.id===134){world[bx][by]=BLOCKS.DOOR;}
else if(held.id>0&&held.id<100){world[bx][by]=held.id;}
else{return false;}
playSound('place');r1Vibrate(20);
spawnPlaceParticles(bx,by);
if(gameMode!=='creative'){held.count--;if(held.count<=0){held.id=0;held.count=0;}}
return true;
}
function eatFood(){
var held=getHeldItem();
if(FOOD_HEAL[held.id]&&(player.hp<player.maxHp||player.hunger<player.maxHunger)){
playSound('eat');
player.hp=Math.min(player.maxHp,player.hp+FOOD_HEAL[held.id]);
player.hunger=Math.min(player.maxHunger,player.hunger+FOOD_HEAL[held.id]*2);
if(gameMode!="creative"){held.count--;if(held.count<=0){held.id=0;held.count=0;}}
}
}
// === ENEMIES ===
function isSurfaceExposedForSpawn(ex,groundTileY){
// require several open tiles above ground (not inside a building/roof)
for(var dy=groundTileY-NIGHT_ROOF_OPEN_TILES;dy<groundTileY;dy++){
if(dy<0)return true;
if(isSolid(ex,dy))return false;
}
return true;
}
function isNearProtectedStructure(ex,groundTileY){
for(var dx=-4;dx<=4;dx++){
for(var dy=-3;dy<=3;dy++){
var bx=ex+dx,by=groundTileY+dy;
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)continue;
var b=world[bx][by];
if(PROTECTED_BLOCKS.indexOf(b)>=0)return true;
}}
return false;
}
function spawnEnemies(){
if(gameMode==='creative')return;
if(NIGHT_SPAWN_COOLDOWN>0){NIGHT_SPAWN_COOLDOWN--;return;}
var nightCount=countNightEnemies(entities);
// quick guards
if(!isNight)return;
if(nightCount>=MAX_NIGHT_ENEMIES)return;
if(entities.length>=MAX_TOTAL_ENTITIES)return;
var sheltered=isPlayerSheltered();
if(sheltered && Math.random()<0.55)return;
var roll=Math.random();
if(roll>NIGHT_SPAWN_CHANCE)return;
// cooldown guard passed above (0)
if(!isNightMobSpawnAllowed({isNight:isNight,nightEnemyCount:nightCount,maxNight:MAX_NIGHT_ENEMIES,totalEntities:entities.length,maxTotal:MAX_TOTAL_ENTITIES,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:1,chance:1,protectedNearby:false}))return;

var ex=player.x/TILE+((Math.random()>0.5?1:-1)*(MIN_NIGHT_SPAWN_DISTANCE+Math.random()*(MAX_NIGHT_SPAWN_DISTANCE-MIN_NIGHT_SPAWN_DISTANCE)));
ex=Math.floor(ex);if(ex<1||ex>=WORLD_W-1)return;
var groundTileY=-1;for(var y=0;y<WORLD_H;y++){if(isSolid(ex,y)){groundTileY=y;break;}}
if(groundTileY<=0)return;
var ey=(groundTileY-2)*TILE;
if(ey<=0)return;
if(!isSurfaceExposedForSpawn(ex,groundTileY))return;
if(isNearProtectedStructure(ex,groundTileY))return;
var distTiles=Math.abs(ex-(player.x/TILE));
if(distTiles<MIN_NIGHT_SPAWN_DISTANCE)return;

var r=Math.random();var type=r<0.35?'creeper':r<0.7?'zombie':'skeleton';
var ehp=type==='zombie'?18:type==='creeper'?14:10;
entities.push({type:type,x:ex*TILE,y:ey,vx:0,vy:0,w:6,h:12,hp:ehp,maxHp:ehp,dir:1,atkTimer:0,color:type==='zombie'?'#0a0':type==='creeper'?'#0f0':'#ddd',fuseTimer:0,fuseActive:false,fuseMax:90});
NIGHT_SPAWN_COOLDOWN=150;
}
function spawnCaveEnemies(){if(gameMode==='creative')return;
if(caveSpawnCD>0){caveSpawnCD--;return;}
var caveMobs=0;for(var i=0;i<entities.length;i++){if(entities[i].type==='cave_spider'||entities[i].type==='cave_skeleton')caveMobs++;}
if(caveMobs>=MAX_CAVE_ENEMIES)return;
if(entities.length>=MAX_TOTAL_ENTITIES)return;
if(Math.random()>CAVE_SPAWN_CHANCE)return;
var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);
if(py<SEA+4)return;
var sx=px+Math.floor(Math.random()*20-10),sy=py+Math.floor(Math.random()*12-6);
if(sx<1||sx>=WORLD_W-1||sy<SEA+4||sy>=WORLD_H-2)return;
if(world[sx][sy]!==BLOCKS.AIR)return;
if(world[sx][sy+1]===BLOCKS.AIR||world[sx][sy+1]===BLOCKS.WATER)return;
var type=Math.random()<0.5?'cave_spider':'cave_skeleton';
var hp=type==='cave_spider'?6:8;
var col=type==='cave_spider'?'#4a2810':'#d4c9a8';
var w=type==='cave_spider'?8:6;
var h=type==='cave_spider'?5:12;
entities.push({type:type,x:sx*TILE,y:(sy-1)*TILE,vx:0,vy:0,w:w,h:h,hp:hp,maxHp:hp,dir:1,atkTimer:0,color:col,fuseTimer:0,fuseActive:false,fuseMax:90});
caveSpawnCD=200;
}
function spawnSheep(){var sheepCount=0;for(var i=0;i<entities.length;i++){if(entities[i].type==='sheep')sheepCount++;}
if(sheepCount>=MAX_SHEEP)return;
if(entities.length>=MAX_TOTAL_ENTITIES)return;
if(Math.random()>SHEEP_SPAWN_CHANCE)return;
var ex=player.x/TILE+((Math.random()>0.5?1:-1)*(10+Math.random()*8));
ex=Math.floor(ex);if(ex<1||ex>=WORLD_W-1)return;
var ey=0;for(var y=0;y<WORLD_H;y++){if(isSolid(ex,y)){ey=(y-1)*TILE;break;}}
if(ey<=0)return;
entities.push({type:'sheep',x:ex*TILE,y:ey,vx:0,vy:0,w:10,h:10,hp:8,maxHp:8,dir:1,atkTimer:0,passive:true});
}
function updateEntities(dt){
var toRemove=[];
for(var i=entities.length-1;i>=0;i--){try{
var e=entities[i];
if(!e||typeof e!=='object'||typeof e.hp!=='number'||isNaN(e.hp)){entities.splice(i,1);continue;}
// Skeleton sunlight burning
if(!isNight&&e.type!=='creeper'&&(e.type=='skeleton'||e.type=='cave_skeleton'||e.type=='zombie')){var etx=Math.floor(e.x/TILE);var ety=Math.floor(e.y/TILE);var surfY=(heightMap[etx]!=null?heightMap[etx]:SEA);if(ety<=surfY){e.hp-=0.3;e.onFire=true;if(Math.random()<0.3){particles.push({x:e.x+Math.random()*e.w,y:e.y+Math.random()*e.h,vx:(Math.random()-0.5)*2,vy:-Math.random()*2,life:20,color:'#f80'});}}else{e.onFire=false;}}else{e.onFire=false;}
// Move toward player
var dx=player.x-e.x;
var spd=e.type=='creeper'?0.6:e.type=='skeleton'?0.7:e.type=='cave_spider'?1.0:e.type=='cave_skeleton'?0.7:0.8;
if(e.passive){
// flee from nearby hostile mobs
var fh=null,fhd=999;
for(var fi=0;fi<entities.length;fi++){var oe=entities[fi];if(oe===e||oe.passive)continue;var fd=Math.abs(oe.x-e.x);if(fd<fhd){fhd=fd;fh=oe;}}
if(fh&&fhd<6*TILE){e.dir=e.x>fh.x?1:-1;e.vx=e.dir*0.9;}
else{if(Math.random()<0.02)e.dir=Math.random()<0.5?-1:1;e.vx=e.dir*0.3;}
}else{
var eTileX=Math.floor(e.x/TILE),eTileY=Math.floor(e.y/TILE);
var pTileX=Math.floor(player.x/TILE),pTileY=Math.floor(player.y/TILE);
var obstruction=null;
try{obstruction=findFirstBlockInPath(eTileX,eTileY,pTileX,pTileY);}catch(err){obstruction=null;}
// House/wall detection: lose aggro when a solid block blocks line of sight.
if(obstruction){e.vx=e.dir*0.25;e.aggro=false;}
else if(Math.abs(dx)>3*TILE){e.vx=dx>0?spd:-spd;e.dir=dx>0?1:-1;e.aggro=true;}
else{e.vx=0;e.aggro=true;}
}
e.vy+=0.4;
e.x+=e.vx;e.y+=e.vy;
var ex=Math.floor(e.x/TILE),ey=Math.floor((e.y+e.h)/TILE);
if(ex>=0&&ex<WORLD_W&&ey>=0&&ey<WORLD_H&&isSolid(ex,ey)){
e.y=ey*TILE-e.h;e.vy=0;
if(e.vx!==0&&ey-1>=0&&isSolid(ex+(e.vx>0?1:-1),ey-1)){e.vy=-5;}
}
// Skeleton shooting
if(e.type=='skeleton'||e.type=='cave_skeleton'){
var sdx=player.x-e.x,sdy=player.y-e.y;
var sdist=Math.sqrt(sdx*sdx+sdy*sdy);
if(sdist<15*TILE&&sdist>3*TILE){
var sObs=null;try{sObs=findFirstBlockInPath(Math.floor(e.x/TILE),Math.floor(e.y/TILE),Math.floor(player.x/TILE),Math.floor(player.y/TILE));}catch(err){sObs=null;}
if(!sObs){
e.atkTimer=(e.atkTimer||0)+dt;
if(e.atkTimer>2){e.atkTimer=0;
if(typeof arrows!=='undefined')arrows.push({x:e.x,y:e.y+4,vx:sdx/sdist*3,vy:sdy/sdist*3,life:120,fromEnemy:true});
}
}
}
}
// Creeper fuse and hit-and-retreat behavior
if(e.type=='creeper'){
var cdist=Math.abs(player.x-e.x);
if(!e.fuseMax)e.fuseMax=45;
if(!e.creeperHitCount)e.creeperHitCount=0;
if(!e.retreatTimer)e.retreatTimer=0;
// After being hit, creeper becomes enraged - fuse speeds up
var fuseSpeed=e.wasHit?2:1;
if(e.wasHit){e.retreatTimer=(e.retreatTimer||0)+1;if(e.retreatTimer>90){e.wasHit=false;e.retreatTimer=0;}}
if(cdist<2.5*TILE){
if(!e.fuseActive){e.fuseActive=true;e.fuseTimer=0;}
e.fuseTimer=(e.fuseTimer||0)+fuseSpeed;
if(e.fuseTimer>=e.fuseMax){creeperExplode(e);entities.splice(i,1);continue;}
}else if(cdist<5*TILE&&e.fuseActive){
e.fuseTimer=(e.fuseTimer||0)+fuseSpeed;
if(e.fuseTimer>=e.fuseMax){creeperExplode(e);entities.splice(i,1);continue;}
}else{
e.fuseActive=false;e.fuseTimer=0;
if(e.fuselight)e.fuselight=false;
}
// Creeper charges player when enraged (after being hit)
if(e.wasHit&&cdist>2*TILE){var cdir=player.x>e.x?1:-1;e.vx=cdir*1.2;}
}
// Melee attack player
if(!e.passive&&e.type!=='creeper'&&e.type!=='skeleton'&&e.type!=='cave_skeleton'){
var adx=Math.abs(player.x-e.x),ady=Math.abs(player.y-e.y);
if(adx<10&&ady<14){
e.atkTimer=(e.atkTimer||0)+dt;
if(e.atkTimer>1){e.atkTimer=0;
if(gameMode=='survival' && (player.invulnTimer||0)<=0){player.hp=Math.max(0,player.hp-2);applyPlayerInvulnerability(INVULN_FRAMES);if(player.hp<=0)gameOver();player.vy=-2;player.knockbackX=(player.x>e.x?1:-1)*3;} }}}
// Remove if too far or dead
if(e.hp<=0||Math.abs(e.x-player.x)>300*TILE){
if(e.hp<=0){var loot;if(e.type=='sheep'){addItem(ITEMS.WOOL,Math.floor(Math.random()*2)+1);if(Math.random()<0.65)addItem(ITEMS.RAW_PORK,1);loot=0;}
else if(e.type=='cave_spider'){addItem(ITEMS.STRING,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='cave_skeleton'||e.type=='skeleton'){addItem(ITEMS.BONE,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='zombie'){addItem(ITEMS.ROTTEN_FLESH,Math.floor(Math.random()*2)+1);loot=0;}
else if(e.type=='creeper'){addItem(ITEMS.COAL,Math.floor(Math.random()*3)+1);loot=0;}
else{addItem(ITEMS.STICK,1);loot=0;}
entities.splice(i,1);
}
}}catch(err){entities.splice(i,1);}}
}
function updateArrows(dt){
for(var i=arrows.length-1;i>=0;i--){
var a=arrows[i]; if(!a){arrows.splice(i,1);continue;}
a.x+=a.vx; a.y+=a.vy; a.vy+=0.03; a.life-=1;
var bx=Math.floor(a.x/TILE), by=Math.floor(a.y/TILE);
if(a.life<=0 || bx<0||bx>=WORLD_W||by<0||by>=WORLD_H){arrows.splice(i,1);continue;}
if(bx>=0&&bx<WORLD_W&&by>=0&&by<WORLD_H&&isSolid(bx,by)){arrows.splice(i,1);continue;}
if(a.fromEnemy && gameState=='playing'){
var dx=Math.abs(a.x-(player.x+player.w/2)), dy=Math.abs(a.y-(player.y+player.h/2));
if(dx<6 && dy<8){
  if(gameMode=='survival' && (player.invulnTimer||0)<=0){player.hp=Math.max(0,player.hp-1);applyPlayerInvulnerability(30);if(player.hp<=0)gameOver();player.vy=-1.5;player.knockbackX=(player.x>a.x?1:-1)*2;r1Vibrate(35);playSound('hurt');showGameMsg('Hit by arrow!');}
  arrows.splice(i,1);continue;
}
}
}}

function attackEntity(){
var now=Date.now();
if(now-lastAttackTime<attackCooldownMs){r1Toast('Attack cooldown',300);return;}
var held=getHeldItem();var dmg=getSwordDamage(held.id);
if(dmg<=0)dmg=1;
var reach=getSwordReachBlocks(held.id);
var range=TILE*reach;
var kb=computeKnockbackForSword(held.id);
for(var i=0;i<entities.length;i++){
var e=entities[i];
if(!e||typeof e!=='object'||typeof e.hp!=='number')continue;
var adx=Math.abs(player.x-e.x),ady=Math.abs(player.y-e.y);
if(isInAttackRange(adx/TILE,ady/TILE,reach)){
e.hp-=dmg;e.vx=(e.x>player.x?kb:-kb);e.vy=-2;if(e.type=='creeper'){e.wasHit=true;e.creeperHitCount=(e.creeperHitCount||0)+1;e.retreatTimer=0;e.fuseActive=true;e.fuseTimer=Math.max(e.fuseTimer||0,e.fuseMax*0.3);}
showDamageNumber(dmg,e.x,e.y);r1Vibrate(50);playSound('attack');lastAttackTime=now;break;
}}
}
// === DAY-NIGHT CYCLE ===
function updateDayNight(){
dayTime=(dayTime+1)%dayLength;
isNight=(dayTime/dayLength>0.79||dayTime/dayLength<0.21);
}
// getSkyColor moved to visual helpers (supports optional phase t)
// === WEATHER UPDATE & RENDER ===
function updateWeather(){
weatherTimer++;
if(weatherState=='clear'){
if(weatherTimer>=weatherDuration){
if(Math.random()<0.35){weatherState='rain';weatherDuration=WEATHER_MIN_STORM+Math.floor(Math.random()*(WEATHER_MAX_STORM-WEATHER_MIN_STORM));targetIntensity=0.4+Math.random()*0.3;if(Math.random()<0.4){weatherState='thunder';targetIntensity=0.6+Math.random()*0.3;}}
else{weatherDuration=WEATHER_MIN_CLEAR+Math.floor(Math.random()*(WEATHER_MAX_CLEAR-WEATHER_MIN_CLEAR));}
weatherTimer=0;}
}else{
if(weatherTimer>=weatherDuration){weatherState='clear';weatherDuration=WEATHER_MIN_CLEAR+Math.floor(Math.random()*(WEATHER_MAX_CLEAR-WEATHER_MIN_CLEAR));weatherTimer=0;targetIntensity=0;}
}
// Smooth intensity transition
if(weatherIntensity<targetIntensity)weatherIntensity=Math.min(weatherIntensity+0.005,targetIntensity);
else if(weatherIntensity>targetIntensity)weatherIntensity=Math.max(weatherIntensity-0.005,targetIntensity);
// Manage raindrops
if(weatherState!='clear'&&weatherIntensity>0.1){
var numNew=Math.floor(weatherIntensity*8);
for(var i=0;i<numNew;i++){raindrops.push({x:Math.random()*W,y:-5-Math.random()*20,speed:4+Math.random()*4,len:3+Math.random()*4});}
}
for(var i=raindrops.length-1;i>=0;i--){raindrops[i].y+=raindrops[i].speed;if(raindrops[i].y>H+10)raindrops.splice(i,1);}
if(raindrops.length>300)raindrops.splice(0,raindrops.length-300);
// Lightning for thunderstorms
if(weatherState=='thunder'&&weatherIntensity>0.3){
lightningTimer++;
if(lightningTimer>180+Math.floor(Math.random()*300)){lightningFlash=1.0;lightningTimer=0;thunderTimer=10+Math.floor(Math.random()*20);}
}
if(lightningFlash>0)lightningFlash=Math.max(0,lightningFlash-0.08);
if(thunderTimer>0)thunderTimer--;
}
function renderWeather(){
if(weatherIntensity<=0.01)return;
ctx.save();
var darkAlpha=weatherIntensity*0.38;
ctx.fillStyle='rgba(24,28,48,'+darkAlpha+')';
ctx.fillRect(0,0,W,H);
// Rain streaks with slant and subtle splash
ctx.strokeStyle='rgba(190,215,255,'+(0.35+weatherIntensity*0.45)+')';
ctx.lineWidth=1;
ctx.beginPath();
for(var i=0;i<raindrops.length;i++){var r=raindrops[i];var slant=1+weatherIntensity*1.5;ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-slant,r.y+r.len*1.4);}
ctx.stroke();
if(weatherIntensity>0.25){
ctx.strokeStyle='rgba(220,235,255,'+(weatherIntensity*0.25)+')';
ctx.beginPath();
for(var i=0;i<Math.floor(raindrops.length*0.3);i++){var r=raindrops[i];ctx.moveTo(r.x+6,r.y);ctx.lineTo(r.x+5,r.y+r.len);}
ctx.stroke();}
// Lightning flash
if(lightningFlash>0){ctx.fillStyle='rgba(255,255,240,'+lightningFlash*0.75+')';ctx.fillRect(0,0,W,H);
if(lightningFlash>0.5){ctx.strokeStyle='rgba(255,255,210,'+lightningFlash+')';ctx.lineWidth=2;ctx.beginPath();var lx=30+Math.random()*(W-60),ly=0;ctx.moveTo(lx,ly);for(var s=0;s<6;s++){lx+=(Math.random()-0.5)*24;ly+=H/6.2;ctx.lineTo(lx,ly);}ctx.stroke();ctx.lineWidth=1;ctx.shadowColor='#fff';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;}}
ctx.restore();
}
function gameOver(){if(gameMode=='creative'){player.hp=player.maxHp;return;}r1Vibrate(200);playSound('hurt');deathX=player.x;deathY=player.y;dropItemsOnDeath();gameState='dead';}
function dropItemsOnDeath(){var PICK=[101,102,103,104],AXE=[109,117,118,119];var TL={101:1,102:2,103:3,104:4,109:1,117:2,118:3,119:4};var bestPick=-1,bestPickTier=0,bestAxe=-1,bestAxeTier=0;for(var i=0;i<36;i++){var s=inventory[i];if(s.id==0||s.count==0)continue;if(PICK.indexOf(s.id)>=0&&TL[s.id]>bestPickTier){bestPickTier=TL[s.id];bestPick=i;}if(AXE.indexOf(s.id)>=0&&TL[s.id]>bestAxeTier){bestAxeTier=TL[s.id];bestAxe=i;}}for(var i=0;i<36;i++){var s=inventory[i];if(s.id==0||s.count==0)continue;var isPick=PICK.indexOf(s.id)>=0,isAxe=AXE.indexOf(s.id)>=0;if(i==bestPick&&isPick){if(s.count>1){droppedItems.push({id:s.id,count:s.count-1,x:deathX+(Math.random()*20-10),y:deathY-8,vx:(Math.random()-0.5)*2,vy:-2-Math.random()*2,grounded:false,life:36000});s.count=1;}continue;}if(i==bestAxe&&isAxe){if(s.count>1){droppedItems.push({id:s.id,count:s.count-1,x:deathX+(Math.random()*20-10),y:deathY-8,vx:(Math.random()-0.5)*2,vy:-2-Math.random()*2,grounded:false,life:36000});s.count=1;}continue;}droppedItems.push({id:s.id,count:s.count,x:deathX+(Math.random()*20-10),y:deathY-8,vx:(Math.random()-0.5)*2,vy:-2-Math.random()*2,grounded:false,life:36000});s.id=0;s.count=0;}showGameMsg('Items dropped at death location!');}
function attractDroppedItem(d,dt){if(!d||!player)return;var px=player.x+player.w/2,py=player.y+player.h/2;var dx=px-d.x,dy=py-d.y;var dist=Math.sqrt(dx*dx+dy*dy);if(dist<=0||dist>DROPPED_ITEM_MAGNET_RADIUS)return;var step=DROPPED_ITEM_MAGNET_SPEED*(1-(dist/DROPPED_ITEM_MAGNET_RADIUS))* (typeof dt==='number'?dt:1);if(step<0.05)step=0.05;var nx=dx/dist,ny=dy/dist;d.x+=nx*step;d.y+=ny*step;if(typeof d.vx==='number')d.vx*=0.82;if(typeof d.vy==='number')d.vy*=0.82;}
function updateDroppedItems(dt){for(var i=droppedItems.length-1;i>=0;i--){var d=droppedItems[i];d.life-=dt;if(d.life<=0){droppedItems.splice(i,1);continue;}if(!d.grounded){d.vy+=0.3*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;var bx=Math.floor(d.x/TILE),by=Math.floor((d.y+4)/TILE);if(bx>=0&&bx<WORLD_W&&by>=0&&by<WORLD_H&&world[bx][by]!=BLOCKS.AIR&&world[bx][by]!=BLOCKS.WATER){d.y=by*TILE-4;d.vy=0;d.vx=0;d.grounded=true;}}attractDroppedItem(d,dt);if(gameState=='playing'){var dx=player.x+player.w/2-d.x,dy=player.y+player.h/2-d.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<18){if(addItem(d.id,d.count)){droppedItems.splice(i,1);showGameMsg('Picked up '+(INAMES[d.id]||BNAMES[d.id]||'item')+' x'+d.count);}}}}}
function renderDroppedItems(ctx,camX,camY){for(var i=0;i<droppedItems.length;i++){var d=droppedItems[i];var sx=d.x-camX,sy=d.y-camY;if(sx<-10||sx>W+10||sy<-10||sy>H+10)continue;var bob=Math.sin(Date.now()/300+i)*2;var col=ICOLORS[d.id]||BCOLORS[d.id]||'#fff';ctx.fillStyle=col;ctx.fillRect(sx-2,sy-2+bob,5,5);ctx.strokeStyle='#fff';ctx.lineWidth=0.5;ctx.strokeRect(sx-2,sy-2+bob,5,5);if(d.life<3600){ctx.globalAlpha=d.life/3600;ctx.fillStyle=col;ctx.fillRect(sx-2,sy-2+bob,5,5);ctx.globalAlpha=1;}}}

// === TOOL TIERS & DURABILITY ===
var TOOL_TIER={101:'wood',102:'stone',103:'iron',104:'diamond',105:'wood',106:'stone',107:'iron',108:'diamond',109:'wood',117:'stone',118:'iron',119:'diamond',110:'wood',120:'stone',121:'iron',122:'diamond',126:'wood',131:'stone',132:'iron',133:'diamond'};
var TIER_COLORS={wood:'#C4A05A',stone:'#888',iron:'#D8D8D8',diamond:'#5CF0EE'};
var TIER_DUR={wood:60,stone:132,iron:251,diamond:1562};
var toolDurability={};
function getToolDur(slot){var k='s'+slot;if(!toolDurability[k])return null;return toolDurability[k];}
function useToolDur(slot){var k='s'+slot;if(!toolDurability[k])return;toolDurability[k].cur--;if(toolDurability[k].cur<=0){inventory[slot]={id:0,count:0};delete toolDurability[k];}}
function initToolDur(slot,id){var t=TOOL_TIER[id];if(t){var k='s'+slot;toolDurability[k]={cur:TIER_DUR[t],max:TIER_DUR[t]};}}

var TIER_LEVEL={wood:1,stone:2,iron:3,diamond:4};
var MINE_REQ={18:1,3:1,7:1,8:2,9:3,10:3,12:1};
function getToolTierLevel(id){var t=TOOL_TIER[id];return t?TIER_LEVEL[t]:0;}
// === TOOL SPRITE RENDERER ===
var spriteCache={};
function drawToolSprite(ctx2,x,y,w,h,id){
var key=id+'_'+w;if(spriteCache[key]){ctx2.drawImage(spriteCache[key],x,y,w,h);return;}
var oc=document.createElement('canvas');oc.width=16;oc.height=16;var g=oc.getContext('2d');
var tier=TOOL_TIER[id]||'wood';var hc=TIER_COLORS[tier]||'#C4A05A';var hd='#8B6914';
var type='';if([101,102,103,104].indexOf(id)>=0)type='pick';
else if([105,106,107,108].indexOf(id)>=0)type='sword';
else if([109,117,118,119].indexOf(id)>=0)type='axe';
else if([110,120,121,122].indexOf(id)>=0)type='shovel';
g.fillStyle=hd;
if(type=='pick'){g.fillRect(4,10,2,2);g.fillRect(6,8,2,2);g.fillRect(8,6,2,2);g.fillRect(10,4,2,2);g.fillStyle=hc;g.fillRect(2,2,12,2);g.fillRect(2,2,2,4);g.fillRect(12,2,2,4);}
else if(type=='sword'){g.fillRect(6,10,2,2);g.fillRect(8,8,2,2);g.fillStyle='#654321';g.fillRect(4,12,2,2);g.fillRect(5,11,4,2);g.fillStyle=hc;g.fillRect(8,2,2,6);g.fillRect(10,2,2,2);}
else if(type=='axe'){g.fillRect(4,10,2,2);g.fillRect(6,8,2,2);g.fillRect(8,6,2,2);g.fillStyle=hc;g.fillRect(8,2,4,4);g.fillRect(10,4,4,2);g.fillRect(12,2,2,2);}
else if(type=='shovel'){g.fillRect(6,6,2,2);g.fillRect(8,4,2,2);g.fillRect(4,10,2,2);g.fillRect(6,8,2,2);g.fillStyle=hc;g.fillRect(8,0,4,4);g.fillRect(10,2,2,4);}
spriteCache[key]=oc;ctx2.drawImage(oc,x,y,w,h);}

// === HUNGER & SURVIVAL MECHANICS ===
var HUNGER_DRAIN_FRAMES=240;
var STARVATION_DAMAGE=0.4;
var REGEN_HUNGER_THRESHOLD=16;
var REGEN_AMOUNT=0.5;
function getHungerDrainFrames(){return HUNGER_DRAIN_FRAMES;}
function getStarvationDamage(){return STARVATION_DAMAGE;}
function updateHunger(dt){
if(gameMode!='survival')return;
player.hungerTimer=(player.hungerTimer||0)+dt;
if(player.hungerTimer>HUNGER_DRAIN_FRAMES){player.hungerTimer=0;if(player.hunger>0)player.hunger=Math.max(0,player.hunger-0.5);
if(player.hunger<=0&&player.hp>0){player.hp=Math.max(0,player.hp-STARVATION_DAMAGE);if(player.hp<=0)gameOver();}
if(player.hunger>=REGEN_HUNGER_THRESHOLD&&player.hp<player.maxHp){player.hp=Math.min(player.maxHp,player.hp+REGEN_AMOUNT);}
}
}
function toggleFly(){
if(gameMode!='creative')return;
player.flying=!player.flying;
var fi=document.getElementById('fly-indicator');
if(fi)fi.style.display=player.flying?'block':'none';
}
function applyFallDamage(){
if(gameMode=='creative')return;
if(player.onGround&&player.fallDist>3){
var dmg=Math.floor(player.fallDist-3);
player.hp=Math.max(0,player.hp-dmg);
if(player.hp<=0)gameOver();
}
if(player.onGround)player.fallDist=0;
else if(player.vy>0)player.fallDist+=player.vy/TILE;
}


var gameMsg='',gameMsgTimer=0;
var droppedItems=[];var deathX=0,deathY=0;var DROPPED_ITEM_MAGNET_RADIUS=52;var DROPPED_ITEM_MAGNET_SPEED=7;var MAX_PARTICLES=90;
function showGameMsg(txt){gameMsg=txt;gameMsgTimer=90;}
// === FURNACE SMELTING ===
function openFurnace(){
gameState='furnace';
var fs=document.getElementById('furnace-screen');fs.style.display='flex';
var sl=document.getElementById('smelt-list');sl.innerHTML='';
var coal=countItem(114);
var found=false;
for(var i=0;i<36;i++){
var s=inventory[i];if(s.id>0&&SMELT[s.id]){
var outId=SMELT[s.id];
var outName=INAMES[outId]||(BCOLORS[outId]?'Block '+outId:'Item '+outId);
var inName=INAMES[s.id]||(BCOLORS[s.id]?'Block '+s.id:'Item '+s.id);
var btn=document.createElement('div');btn.className='smelt-slot';
btn.innerHTML=inName+' (x'+s.count+') &#10145; '+outName+(coal>0?' [Smelt]':' [No Fuel]');
if(coal>0){btn.setAttribute('data-id',s.id);btn.onclick=function(){smeltItem(parseInt(this.getAttribute('data-id')));};}
sl.appendChild(btn);found=true;
}}
if(!found){var msg=document.createElement('div');msg.className='smelt-slot';msg.textContent='No smeltable items';sl.appendChild(msg);}
var fi=document.createElement('div');fi.className='fuel-info';fi.textContent='Coal: '+coal;sl.appendChild(fi);
}
function closeFurnace(){
gameState='playing';
document.getElementById('furnace-screen').style.display='none';
}
function smeltItem(id){
if(countItem(114)<1)return;
if(countItem(id)<1)return;
if(!SMELT[id])return;
removeItem(114,1);
removeItem(id,1);
addItem(SMELT[id],1);
openFurnace();
}
// === AUTO-LOCK TARGETING SYSTEM ===
var autoLockEnabled=true,autoLockTarget=null,autoLockWalk=true,autoLockPulse=0;
var PICK_IDS=[101,102,103,104],AXE_IDS=[109,117,118,119];
var ORE_BLOCKS=[10,9,8,7,3,12],WOOD_BLOCKS=[5];
var ORE_PRIORITY={10:6,9:5,8:4,7:3,3:1,12:1};
var AUTO_LOCK_RANGE=10,MINE_RANGE=7;
var MINE_RANGE_VAL=7;
function toggleAutoLock(){autoLockEnabled=!autoLockEnabled;autoLockTarget=null;var btn=document.getElementById('autolock-btn');btn.className=autoLockEnabled?'':'off';btn.textContent=autoLockEnabled?'AL':'al';var st=document.getElementById('autolock-status');st.className=autoLockEnabled?'active':'';st.textContent=autoLockEnabled?'AUTO-LOCK ON':'';if(autoLockEnabled)showGameMsg('Auto-Lock ON');else showGameMsg('Auto-Lock OFF');}
function getToolType(){var h=getHeldItem();if(!h||h.id<100)return 0;for(var i=0;i<PICK_IDS.length;i++)if(h.id==PICK_IDS[i])return 1;for(var i=0;i<AXE_IDS.length;i++)if(h.id==AXE_IDS[i])return 2;return 0;}
function findAutoLockTarget(){if(!autoLockEnabled)return null;var tt=getToolType();if(tt===0)return null;var targets=tt===1?ORE_BLOCKS:WOOD_BLOCKS;var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);var best=null,bestDist=999;for(var dx=-AUTO_LOCK_RANGE;dx<=AUTO_LOCK_RANGE;dx++){for(var dy=-3;dy<=3;dy++){var bx=px+dx,by=py+dy;if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)continue;var b=world[bx][by];var isTarget=false;for(var t=0;t<targets.length;t++)if(b===targets[t]){isTarget=true;break;}if(!isTarget)continue;var dist=Math.sqrt(dx*dx+dy*dy);if(dist<bestDist){bestDist=dist;best={x:bx,y:by,block:b,dist:Math.floor(dist)};}}}return best;}
function findFirstBlockInPath(px,py,tx,ty){var dx=tx-px,dy=ty-py;var steps=Math.max(Math.abs(dx),Math.abs(dy));if(steps===0)return null;var sx=dx/steps,sy=dy/steps;for(var i=1;i<=steps;i++){var cx=Math.round(px+sx*i),cy=Math.round(py+sy*i);if(cx<0||cx>=WORLD_W||cy<0||cy>=WORLD_H)break;if(cx===tx&&cy===ty)return null;var b=world[cx][cy];if(b!==BLOCKS.AIR&&b!==BLOCKS.WATER&&b!==BLOCKS.BEDROCK&&b!==BLOCKS.TORCH&&b!==BLOCKS.LADDER){return{x:cx,y:cy,block:b};}}return null;}
function updateAutoLock(){if(!autoLockEnabled||gameState!='playing')return;autoLockPulse=(autoLockPulse+0.05)%6.28;if(autoLockTarget&&world[autoLockTarget.x]&&world[autoLockTarget.x][autoLockTarget.y]===0){autoLockTarget=null;miningProgress=0;}var newTarget=findAutoLockTarget();if(newTarget){autoLockTarget=newTarget;var px=Math.floor(player.x/TILE),py=Math.floor(player.y/TILE);var obstruction=findFirstBlockInPath(px,py,newTarget.x,newTarget.y);if(obstruction){cursorX=obstruction.x;cursorY=obstruction.y;}else{cursorX=newTarget.x;cursorY=newTarget.y;}var sd=document.getElementById('autolock-status');sd.className='active';var bname='Block';if(newTarget.block==10)bname='DIAMOND';else if(newTarget.block==9)bname='GOLD';else if(newTarget.block==8)bname='IRON';else if(newTarget.block==7)bname='COAL';else if(newTarget.block==3)bname='STONE';else if(newTarget.block==12)bname='COBBLE';else if(newTarget.block==5)bname='WOOD';sd.textContent=bname+' d:'+newTarget.dist;if(autoLockWalk&&newTarget.dist>MINE_RANGE_VAL){var tx=newTarget.x*TILE+TILE/2,ty=newTarget.y*TILE;if(player.x<tx-4)keys.left=false,keys.right=true;else if(player.x>tx+4)keys.left=true,keys.right=false;else keys.left=false,keys.right=false;}else if(autoLockWalk&&newTarget.dist<=MINE_RANGE_VAL){keys.left=false;keys.right=false;}}else{autoLockTarget=null;var sd=document.getElementById('autolock-status');sd.className='active';sd.textContent='No target';}}function renderAutoLock(){if(!autoLockEnabled||!autoLockTarget||gameState!='playing')return;var t=autoLockTarget;var sx=t.x*TILE-camX,sy=t.y*TILE-camY;var pulse=Math.sin(autoLockPulse)*0.3+0.7;ctx.strokeStyle='rgba(0,255,0,'+pulse+')';ctx.lineWidth=2;ctx.strokeRect(sx-1,sy-1,TILE+2,TILE+2);ctx.strokeStyle='rgba(255,255,0,'+pulse*0.5+')';ctx.lineWidth=1;ctx.strokeRect(sx-3,sy-3,TILE+6,TILE+6);if(t.dist<=MINE_RANGE_VAL){ctx.fillStyle='rgba(0,255,0,0.15)';ctx.fillRect(sx,sy,TILE,TILE);}else{ctx.fillStyle='rgba(255,0,0,0.15)';ctx.fillRect(sx,sy,TILE,TILE);var mx=player.x-camX+3,my=player.y-camY-2;ctx.strokeStyle='rgba(255,255,0,0.4)';ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(sx+TILE/2,sy+TILE/2);ctx.stroke();ctx.setLineDash([]);}if(miningProgress>0){var hard=BLOCK_HEALTH[t.block]||HARDNESS[t.block]||1;var pct=miningProgress/hard;ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(sx,sy-4,TILE,3);ctx.fillStyle=pct>0.6?'#0f0':pct>0.3?'#ff0':'#f00';ctx.fillRect(sx,sy-4,TILE*pct,3);}}

// === AUTO-COMBAT SYSTEM ===
var autoCombatEnabled=true,autoCombatTarget=null,combatCooldown=0,combatPulse=0,dmgNumbers=[],swingAnim=0;
var SWORD_IDS=[105,106,107,108],COMBAT_RANGE=16,APPROACH_RANGE=40,WARN_RANGE=60;
var FOOD_IDS=[115,116,125];
var TOOL_IDS=[101,102,103,104,109,110,117,118,119,120,121,122,126,131,132,133];
var PLACEABLE_BLOCK_IDS=[];for(var _pb=1;_pb<=29;_pb++)PLACEABLE_BLOCK_IDS.push(_pb);PLACEABLE_BLOCK_IDS.push(134);
var THREAT_MODE='closest';
function toggleAutoCombat(){autoCombatEnabled=!autoCombatEnabled;var b=document.getElementById('combat-btn');if(b){b.textContent=autoCombatEnabled?'AC':'ac';if(!autoCombatEnabled)b.classList.add('off');else b.classList.remove('off');}if(!autoCombatEnabled)autoCombatTarget=null;}
function hasSword(){var h=getHeldItem();return SWORD_IDS.indexOf(h.id)>=0;}
function findCombatTarget(){if(entities.length==0)return null;var best=null,bestScore=Infinity;for(var i=0;i<entities.length;i++){var e=entities[i];if(!e||typeof e.hp!="number"||e.hp<=0)continue;var dx=Math.abs(player.x-e.x),dy=Math.abs(player.y-e.y),dist=Math.sqrt(dx*dx+dy*dy);if(dist>APPROACH_RANGE*2)continue;var score=THREAT_MODE=='closest'?dist:(e.hp+dist*0.1);if(score<bestScore){bestScore=score;best=e;}}return best;}
function updateAutoCombat(dt){combatPulse+=0.08;if(combatCooldown>0)combatCooldown-=dt;for(var i=dmgNumbers.length-1;i>=0;i--){dmgNumbers[i].t-=dt;dmgNumbers[i].y-=0.5;if(dmgNumbers[i].t<=0)dmgNumbers.splice(i,1);}var w=document.getElementById('enemy-warn');if(gameMode=='creative'||gameState!='playing'){if(w)w.style.display='none';autoCombatTarget=null;return;}var nearEnemy=false;for(var i=0;i<entities.length;i++){var dx=Math.abs(player.x-entities[i].x),dy=Math.abs(player.y-entities[i].y);if(Math.sqrt(dx*dx+dy*dy)<WARN_RANGE){nearEnemy=true;break;}}if(w)w.style.display=nearEnemy?'block':'none';if(!autoCombatEnabled||!hasSword()){autoCombatTarget=null;return;}autoCombatTarget=findCombatTarget();if(!autoCombatTarget||autoCombatTarget.hp<=0){autoCombatTarget=findCombatTarget();}if(!autoCombatTarget)return;var dx=autoCombatTarget.x-player.x,dy=autoCombatTarget.y-player.y,dist=Math.sqrt(dx*dx+dy*dy);player.dir=dx>0?1:-1;if(dist>COMBAT_RANGE&&dist<APPROACH_RANGE*2){if(dx>2)keys.right=true;else keys.right=false;if(dx<-2)keys.left=true;else keys.left=false;}else{keys.left=false;keys.right=false;}if(dist<=COMBAT_RANGE&&combatCooldown<=0){var held=getHeldItem();var dmg=SWORD_DMG[held.id]||1;autoCombatTarget.hp-=dmg;autoCombatTarget.vx=player.dir*3;autoCombatTarget.vy=-2;player.attacking=10;swingAnim=8;combatCooldown=12;if(held.id>=101&&held.id<=122)useToolDur(player.selectedSlot);dmgNumbers.push({x:autoCombatTarget.x,y:autoCombatTarget.y-8,val:dmg,t:20});if(autoCombatTarget.hp<=0){autoCombatTarget=null;}}}
function renderAutoCombat(ctx,camX,camY){if(gameState!='playing')return;for(var i=0;i<dmgNumbers.length;i++){var d=dmgNumbers[i];var sx=d.x-camX,sy=d.y-camY;ctx.fillStyle='#ff0';ctx.font='bold 7px monospace';ctx.fillText('-'+d.val,sx,sy);}if(!autoCombatEnabled||!autoCombatTarget||autoCombatTarget.hp<=0)return;var e=autoCombatTarget,ex=e.x-camX,ey=e.y-camY;var p=Math.sin(combatPulse)*2;ctx.strokeStyle='#f44';ctx.lineWidth=1;ctx.strokeRect(ex-2+p,ey-2+p,e.w+4-p*2,e.h+4-p*2);ctx.strokeStyle='#ff0';ctx.setLineDash([2,2]);ctx.strokeRect(ex-3,ey-3,e.w+6,e.h+6);ctx.setLineDash([]);var bw=e.w+6,bh=3,bx=ex-3,by=ey-e.h-2;var hpRatio=e.hp/e.maxHp;ctx.fillStyle='#300';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle=hpRatio>0.5?'#0f0':hpRatio>0.25?'#ff0':'#f00';ctx.fillRect(bx,by,bw*hpRatio,bh);ctx.strokeStyle='#fff';ctx.strokeRect(bx,by,bw,bh);ctx.fillStyle='#fff';ctx.font='5px monospace';ctx.fillText(e.type,bx,by-1);if(swingAnim>0){ctx.strokeStyle='rgba(255,255,100,'+swingAnim/8+')';ctx.beginPath();var sa=player.dir>0?-0.5:3.6;ctx.arc(player.x-camX+3,player.y-camY+4,10,sa,sa+1);ctx.stroke();swingAnim-=0.5;}}

// === CHEST STORAGE ===
var chestData={};
function getChestKey(x,y){return x+','+y;}
function openChest(bx,by){
var key=getChestKey(bx,by);
if(!chestData[key])chestData[key]=[];
for(var i=chestData[key].length;i<27;i++)chestData[key].push({id:0,count:0});
gameState='chest';window.currentChest=key;
var cs=document.getElementById('chest-screen');cs.style.display='block';
renderChestUI();
}
function closeChest(){gameState='playing';document.getElementById('chest-screen').style.display='none';window.currentChest=null;}
window.currentChest=null;
function renderChestUI(){
var key=window.currentChest;if(!key)return;
var cs=document.getElementById('chest-slots');cs.innerHTML='';
var chest=chestData[key];
for(var i=0;i<27;i++){var s=chest[i];var div=document.createElement('div');div.className='chest-slot';
div.setAttribute('data-idx',i);div.setAttribute('data-src','chest');
if(s.id>0){var icon=document.createElement('div');icon.className='block-icon';
icon.style.background=s.id<100?BCOLORS[s.id]:(ICOLORS[s.id]||'#fff');
div.appendChild(icon);if(s.count>1){var cnt=document.createElement('span');cnt.className='count';cnt.textContent=s.count;div.appendChild(cnt);}}
div.onclick=function(){var idx=parseInt(this.getAttribute('data-idx'));chestTransfer('chest',idx);};
cs.appendChild(div);}
var ci=document.getElementById('chest-inv');ci.innerHTML='';
for(var i=0;i<9;i++){var s=inventory[i];var div=document.createElement('div');div.className='chest-slot';
div.setAttribute('data-idx',i);
if(s.id>0){var icon=document.createElement('div');icon.className='block-icon';
icon.style.background=s.id<100?BCOLORS[s.id]:(ICOLORS[s.id]||'#fff');
div.appendChild(icon);if(s.count>1){var cnt=document.createElement('span');cnt.className='count';cnt.textContent=s.count;div.appendChild(cnt);}}
div.onclick=function(){var idx=parseInt(this.getAttribute('data-idx'));chestTransfer('inv',idx);};
ci.appendChild(div);}
}
function chestTransfer(src,idx){
var key=window.currentChest;if(!key)return;
var chest=chestData[key];
if(src=='chest'){var s=chest[idx];if(s.id==0)return;if(addItem(s.id,s.count)){s.id=0;s.count=0;}}
else{var s=inventory[idx];if(s.id==0)return;
for(var i=0;i<27;i++){if(chest[i].id==s.id&&chest[i].count<64){var add=Math.min(s.count,64-chest[i].count);chest[i].count+=add;s.count-=add;if(s.count<=0){s.id=0;s.count=0;}break;}}
if(s.count>0){for(var i=0;i<27;i++){if(chest[i].id==0){chest[i].id=s.id;chest[i].count=s.count;s.id=0;s.count=0;break;}}}}
renderChestUI();}
// === SAND/GRAVEL GRAVITY ===
function updateBlockPhysics(){
for(var x=0;x<WORLD_W;x++){for(var y=WORLD_H-2;y>=0;y--){
var b=world[x][y];
if((b==BLOCKS.SAND||b==BLOCKS.GRAVEL)&&world[x][y+1]==BLOCKS.AIR){
world[x][y+1]=b;world[x][y]=BLOCKS.AIR;}
}}}
// === WATER FLOW ===
var waterTimer=0;
function updateWaterFlow(dt){return;
waterTimer+=dt;if(waterTimer<30)return;waterTimer=0;
for(var x=0;x<WORLD_W;x++){for(var y=0;y<WORLD_H-1;y++){
if(world[x][y]==BLOCKS.WATER&&y<=SEA+4){
if(world[x][y+1]==BLOCKS.AIR)world[x][y+1]=BLOCKS.WATER;
if(x>0&&world[x-1][y]==BLOCKS.AIR&&world[x][y+1]!=BLOCKS.AIR)world[x-1][y]=BLOCKS.WATER;
if(x<WORLD_W-1&&world[x+1][y]==BLOCKS.AIR&&world[x][y+1]!=BLOCKS.AIR)world[x+1][y]=BLOCKS.WATER;
}}}}
// === FARMING ===
var cropTimer=0;
function updateCrops(dt){
cropTimer+=dt;if(cropTimer<120)return;cropTimer=0;
for(var x=0;x<WORLD_W;x++){for(var y=0;y<WORLD_H;y++){
var b=world[x][y];
if(b==BLOCKS.WHEAT1&&Math.random()<0.3)world[x][y]=BLOCKS.WHEAT2;
else if(b==BLOCKS.WHEAT2&&Math.random()<0.2)world[x][y]=BLOCKS.WHEAT3;
}}}
function useHoe(bx,by){
if(by+1<WORLD_H&&(world[bx][by+1]==BLOCKS.DIRT||world[bx][by+1]==BLOCKS.GRASS)&&world[bx][by]==BLOCKS.AIR){
world[bx][by+1]=BLOCKS.FARMLAND;return true;}return false;}
function plantSeed(bx,by){
if(world[bx][by]==BLOCKS.AIR&&by+1<WORLD_H&&world[bx][by+1]==BLOCKS.FARMLAND){
world[bx][by]=BLOCKS.WHEAT1;return true;}return false;}
// === LADDER CLIMBING ===
function isOnLadder(){
var px=Math.floor((player.x+player.w/2)/TILE),py=Math.floor((player.y+player.h/2)/TILE);
return px>=0&&px<WORLD_W&&py>=0&&py<WORLD_H&&world[px][py]==BLOCKS.LADDER;}

// === CREEPER EXPLOSION ===
var CREEPER_RANGE=24,CREEPER_WARN_RANGE=36;
function creeperExplode(e){
var cx=Math.floor(e.x/TILE),cy=Math.floor((e.y+e.h/2)/TILE);
var rad=3;
for(var bx=cx-rad;bx<=cx+rad;bx++){
for(var by=cy-rad;by<=cy+rad;by++){
if(bx<0||bx>=WORLD_W||by<0||by>=WORLD_H)continue;
var dx=bx-cx,dy=by-cy;
if(dx*dx+dy*dy>rad*rad+1)continue;
var b=world[bx][by];
if(b==BLOCKS.BEDROCK||b==BLOCKS.AIR||b==BLOCKS.WATER)continue;
world[bx][by]=BLOCKS.AIR;
for(var p=0;p<2;p++)particles.push({x:bx*TILE+4,y:by*TILE+4,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:20+Math.random()*15,color:Math.random()>0.5?'#f80':'#ff0'});
}}
var pdx=player.x-e.x,pdy=player.y-e.y;
var pdist=Math.sqrt(pdx*pdx+pdy*pdy);
if(pdist<rad*TILE*1.5&&gameMode=='survival'&&(player.invulnTimer||0)<=0){
var dmg=Math.max(1,Math.floor(14*(1-pdist/(rad*TILE*1.5))));
player.hp=Math.max(0,player.hp-dmg);applyPlayerInvulnerability(INVULN_FRAMES);if(player.hp<=0)gameOver();
player.vy=-3;player.knockbackX=(pdx>0?1:-1)*3;
}
for(var p=0;p<15;p++)particles.push({x:e.x+3,y:e.y+6,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,life:25+Math.random()*20,color:['#f00','#f80','#ff0','#fff'][Math.floor(Math.random()*4)]});
showGameMsg('BOOM!');
}
// === RENDERING ===
var zoomLevel=1.0,zoomPanelOpen=false;
function toggleZoom(){zoomPanelOpen=!zoomPanelOpen;var p=document.getElementById('zoom-panel');if(zoomPanelOpen)p.classList.add('open');else p.classList.remove('open');}
function setZoom(v){zoomLevel=parseFloat(v);document.getElementById('zoom-label').textContent=zoomLevel.toFixed(1)+'x';}

// === TORCH LIGHT EMISSION SYSTEM ===
var TORCH_LIGHT_RADIUS=5;
function getTorchLight(wx,wy){
var maxLight=0;
for(var dx=-TORCH_LIGHT_RADIUS;dx<=TORCH_LIGHT_RADIUS;dx++){
for(var dy=-TORCH_LIGHT_RADIUS;dy<=TORCH_LIGHT_RADIUS;dy++){
var tx=wx+dx,ty=wy+dy;
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[tx][ty]==BLOCKS.TORCH){
var dist=Math.sqrt(dx*dx+dy*dy);
if(dist<=TORCH_LIGHT_RADIUS){
var light=1.0-(dist/TORCH_LIGHT_RADIUS);
if(light>maxLight)maxLight=light;
}}}}
return maxLight;
}
function isNearTorch(wx,wy,radius){
for(var dx=-radius;dx<=radius;dx++){
for(var dy=-radius;dy<=radius;dy++){
var tx=wx+dx,ty=wy+dy;
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H&&world[tx][ty]==BLOCKS.TORCH)return true;
}}
return false;
}

// === VISUAL HELPER FUNCTIONS (extracted for testability) ===
function clampCameraAxis(value,viewSize,worldSize){var max=Math.max(0,worldSize-viewSize);var v=Number(value)||0;if(v<0)v=0;if(v>max)v=max;return v;}
function computeCameraAxis(target,viewSize,worldSize){if(!isFinite(target))target=0;if(!isFinite(viewSize)||viewSize<=0)viewSize=W;return clampCameraAxis(target-viewSize/2,viewSize,worldSize);}
function cameraLowMotionFallback(){try{return !!(lowMotionMode||highContrastMode||accessibilityMode||window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return !!lowMotionMode;}}
function getSkyColor(t){if(typeof t!=='number'){t=dayTime/dayLength;}t=((t%1)+1)%1;if(t<0)t+=1;
var stops=[{t:0.00,r:10,g:10,b:30},{t:0.21,r:10,g:10,b:30},{t:0.28,r:240,g:130,b:100},{t:0.375,r:100,g:170,b:255},{t:0.71,r:100,g:170,b:255},{t:0.79,r:240,g:130,b:100},{t:0.875,r:10,g:10,b:30},{t:1.00,r:10,g:10,b:30}];
for(var i=0;i<stops.length-1;i++){var a=stops[i],b=stops[i+1];if(t>=a.t&&t<=b.t){var f=(t-a.t)/(b.t-a.t||1);var r=Math.round(a.r+(b.r-a.r)*f);var g=Math.round(a.g+(b.g-a.g)*f);var blue=Math.round(a.b+(b.b-a.b)*f);return 'rgb('+r+','+g+','+blue+')';}}
return 'rgb(4,6,24)';}
function isNightTime(t){if(typeof t!=='number')t=dayTime/dayLength;t=((t%1)+1)%1;return t<0.21||t>=0.875;}
function getStarPositions(count,seed){count=count||24;seed=seed||1;var out=[];for(var i=0;i<count;i++){var n=Math.sin((i+1)*127.1+seed*31.7)*43758.5453;var x=Math.abs(Math.floor((n-Math.floor(n))*W));var n2=Math.sin((i+1)*269.5+seed*17.3)*43758.5453;var y=Math.abs(Math.floor((n2-Math.floor(n2))*(H/2)));out.push({x:x,y:y,phase:(i*0.37)});}return out;}
function renderStars(ctx,isNight,time){if(!ctx||!isNight)return;var stars=getStarPositions(30,7);ctx.save();for(var i=0;i<stars.length;i++){var s=stars[i];var twinkle=0.45+0.55*Math.abs(Math.sin((time/600)+s.phase));ctx.globalAlpha=twinkle;ctx.fillStyle='#fff';ctx.fillRect(s.x,s.y,1,1);if(twinkle>0.8)ctx.fillRect(s.x-1,s.y,3,1);}ctx.globalAlpha=1;ctx.restore();}
function shadeRect(ctx,dx,dy,w,h,alpha){if(!ctx)return;ctx.fillStyle='rgba(0,0,0,'+(alpha||0.22)+')';ctx.fillRect(dx,dy,w,h);}
function drawTileShading(ctx,dx,dy,tile){if(!ctx)return;tile=tile||TILE;ctx.save();ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fillRect(dx,dy,1,tile);ctx.fillRect(dx,dy,tile,1);ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(dx+tile-1,dy,1,tile);ctx.fillRect(dx,dy+tile-1,tile,1);ctx.restore();}
function drawWoodBark(ctx,dx,dy,tile){if(!ctx)return;tile=tile||TILE;ctx.save();ctx.fillStyle='rgba(60,35,15,0.55)';for(var i=0;i<tile;i+=2){ctx.fillRect(dx+i,dy,1,tile);}ctx.fillStyle='rgba(170,120,70,0.35)';for(var j=1;j<tile;j+=4){ctx.fillRect(dx+j,dy,1,tile);}ctx.restore();}
function drawOreCracks(ctx,dx,dy,tile){if(!ctx)return;tile=tile||TILE;ctx.save();ctx.strokeStyle='rgba(0,0,0,0.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(dx+1,dy+2);ctx.lineTo(dx+tile-2,dy+tile-2);ctx.moveTo(dx+tile-2,dy+1);ctx.lineTo(dx+2,dy+tile-2);ctx.stroke();ctx.restore();}
function drawCropGrowth(ctx,b,dx,dy,tile){if(!ctx)return;tile=tile||TILE;ctx.save();var h=2;var col='#3a7a2a';if(b===BLOCKS.WHEAT1){h=3;col='#2d8a2d';}else if(b===BLOCKS.WHEAT2){h=5;col='#4aa84a';}else if(b===BLOCKS.WHEAT3){h=7;col='#d4a017';}
ctx.fillStyle=BCOLORS[b]||col;ctx.fillRect(dx+2,dy+Math.max(0,tile-h-1),2,h+1);
ctx.fillStyle=col;ctx.fillRect(dx+3,dy+tile-h,2,h);ctx.fillRect(dx+5,dy+tile-h,1,h);ctx.restore();}
function drawEntityShading(ctx,ex,ey,w,h){if(!ctx)return;ctx.save();ctx.fillStyle='rgba(0,0,0,0.22)';ctx.fillRect(ex,ey+Math.floor(h/2),w,Math.ceil(h/2));ctx.fillStyle='rgba(255,255,255,0.10)';ctx.fillRect(ex,ey,w,Math.floor(h/3));ctx.restore();}
function renderAtmosphereBackground(ctx,camX2,camY2,zoom){if(!ctx)return;ctx.save();
var off=(camX2||0)*0.12;ctx.fillStyle='rgba(40,70,40,0.22)';for(var i=-1;i<6;i++){var hx=i*48-off%48;ctx.beginPath();ctx.moveTo(hx,H);ctx.lineTo(hx+24,H-24);ctx.lineTo(hx+48,H);if(typeof ctx.fill==='function')ctx.fill();}
if(!lowMotionMode){var cOff=(camX2||0)*0.05+Date.now()/1000*6;ctx.fillStyle='rgba(255,255,255,0.22)';for(var c=0;c<5;c++){var cx=((c*71+cOff)% (W+80))-40;var cy=8+(c*13)%28;ctx.fillRect(cx,cy,26,5);ctx.fillStyle='rgba(255,255,255,0.16)';ctx.fillRect(cx+4,cy+5,18,3);ctx.fillStyle='rgba(255,255,255,0.22)';}}
ctx.restore();}
function renderCompass(ctx,x,y){if(!ctx)return;x=x||W-26;y=y||8;ctx.save();ctx.fillStyle='rgba(0,0,0,0.45)';ctx.fillRect(x,y,22,22);ctx.strokeStyle='#fff';ctx.strokeRect(x,y,22,22);ctx.fillStyle='#f55';ctx.fillRect(x+10,y+2,2,8);ctx.fillStyle='#fff';ctx.font='6px monospace';ctx.textAlign='center';ctx.fillText('N',x+11,y+20);ctx.textAlign='left';ctx.restore();}
function getHeartColor(filled){return filled?'#ff3b3b':'#555';}
function getHungerColor(filled){return filled?'#d97706':'#444';}
function getInvSlotStyle(selected,pressed){return {border:selected?'#fff':(pressed?'#aaa':'#555'),background:selected?'rgba(255,255,255,0.2)':(pressed?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.7)')};}
function getTorchGlow(wx,wy,radius){
  var light=getTorchLight(wx,wy);
  radius=radius||TORCH_LIGHT_RADIUS;
  if(light<=0) return 0;
  var flicker = 0.7 + 0.3*Math.sin(Date.now()/120);
  return light*flicker;
}
function applyLightingOverlay(ctx2,isNight2,weatherIntensity2){if(!ctx2)return;ctx2.save();ctx2.fillStyle='rgba(0,0,12,'+((isNight2?0.30:0.08)+ (weatherIntensity2||0)*0.15)+')';ctx2.fillRect(0,0,W,H);ctx2.restore();}
function createRadialHole(ctx2,cx,cy,r){if(!ctx2||typeof ctx2.createRadialGradient!=='function')return;var g=ctx2.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx2.save();ctx2.globalCompositeOperation='destination-out';ctx2.fillStyle=g;ctx2.beginPath();ctx2.arc(cx,cy,r,0,Math.PI*2);if(typeof ctx2.fill==='function')ctx2.fill();ctx2.restore();}
function getCameraPosition(){return {x:camX,y:camY};}
function getTargetCameraPosition(){return {x:targetCamX,y:targetCamY};}
function setCameraPosition(x,y){camX=x;camY=y;return getCameraPosition();}
function getCamera(){return getCameraPosition();}
function cameraTarget(){return getTargetCameraPosition();}
function computeCamera(px,py,zoom){zoom=zoom||zoomLevel;var z=zoom>0.1?zoom:1;var vx=W/z,vy=H/z;return {x:computeCameraAxis(px+(player?player.w/2:0),vx,WORLD_W*TILE),y:computeCameraAxis(py+(player?player.h/2:0),vy,WORLD_H*TILE)};}
function stabilizeCamera(cx,cy,zoom){zoom=zoom||zoomLevel;var z=zoom>0.1?zoom:1;return {x:clampCameraAxis(cx,W/z,WORLD_W*TILE),y:clampCameraAxis(cy,H/z,WORLD_H*TILE)};}
function getSkyGradient(t){return getSkyColor(t);}
function getCloudOffset(camX2){return ((camX2||0)*0.05);}
function drawClouds(ctx2,camX2){if(!ctx2)return;ctx2.save();var off=getCloudOffset(camX2);ctx2.fillStyle='rgba(255,255,255,0.22)';for(var i=0;i<5;i++){ctx2.fillRect((i*71+off)% (W+60)-30,6+i*11,24,4);}ctx2.restore();}
function renderClouds(ctx2,camX2){drawClouds(ctx2,camX2);}
function torchGlow(wx,wy){return getTorchGlow(wx,wy);}
function torchLight(wx,wy){return getTorchLight(wx,wy);}
function fallbackTorchGlow(wx,wy){return torchGlow(wx,wy);}
function renderBackground(){if(ctx)renderAtmosphereBackground(ctx,camX,camY,zoomLevel);}
function getSkyColors(){return [getSkyColor(0),getSkyColor(0.3),getSkyColor(0.75)];}
function getDayNightGradient(t){return getSkyColor(t);}
function getWeatherIntensity(){return weatherIntensity;}
function getLightningFlash(){return lightningFlash;}
function getRaindropCount(){return raindrops.length;}
function updateRainStreaks(){updateWeather();return raindrops.length;}
function renderRainStreaks(ctx2){renderWeather();return raindrops.length;}
function getCompassHeading(){return 'N';}
function addVisualShaft(){return true;}
function renderTileShading(){return drawTileShading;}
function renderOreCracks(){return drawOreCracks;}
function renderWoodBark(){return drawWoodBark;}
function renderCrop(ctx,b,dx,dy){drawCropGrowth(ctx,b,dx,dy,TILE);return true;}
function renderEntityShading(ctx,ex,ey,w,h){drawEntityShading(ctx,ex,ey,w,h);return true;}
function stabilizeZoomCamera(cx,cy,zoom){return stabilizeCamera(cx,cy,zoom);}
function lowMotionCameraFallback(){return cameraLowMotionFallback();}
// === end helpers ===
function render(){
if(!ctx)return;
// Camera (smoothed unless low-motion/perf mode)
// Camera uses the active zoom so zooming does not crop the intended view or cause jitter.
var viewW=W/(zoomLevel>0.1?zoomLevel:1);var viewH=H/(zoomLevel>0.1?zoomLevel:1);
var targetCamX=computeCameraAxis(player.x+player.w/2, viewW, WORLD_W*TILE);
var targetCamY=computeCameraAxis(player.y+player.h/2, viewH, WORLD_H*TILE);
if(lowMotionMode||cameraLowMotionFallback()){camX=targetCamX;camY=targetCamY;}else if(cameraSmoothingEnabled){var smooth=0.20;camX+=(targetCamX-camX)*smooth;camY+=(targetCamY-camY)*smooth;}else{camX=targetCamX;camY=targetCamY;}
camX=clampCameraAxis(camX,viewW,WORLD_W*TILE);camY=clampCameraAxis(camY,viewH,WORLD_H*TILE);
// Sky
ctx.save();if(typeof ctx.translate==='function'){ctx.translate(W/2,H/2);}if(typeof ctx.scale==='function'){ctx.scale(zoomLevel,zoomLevel);}if(typeof ctx.translate==='function'){ctx.translate(-W/2,-H/2);}ctx.fillStyle=getSkyColor();ctx.fillRect(0,0,W,H);
// Parallax cloud / mountain layer before terrain
renderAtmosphereBackground(ctx,camX,camY,zoomLevel);
// Stars at night
renderStars(ctx,isNight,Date.now());
// Blocks
var sx=Math.floor(camX/TILE),sy=Math.floor(camY/TILE);
var ex=sx+Math.ceil(W/TILE)+1,ey=sy+Math.ceil(H/TILE)+1;
for(var x=sx;x<ex&&x<WORLD_W;x++){for(var y=sy;y<ey&&y<WORLD_H;y++){
if(x<0||y<0)continue;
var dx=x*TILE-camX,dy=y*TILE-camY;
ctx.globalAlpha=1.0;var b=world[x][y];if(b==BLOCKS.AIR){var surfH=(heightMap[x]!=null?heightMap[x]:SEA);if(y>surfH){ctx.fillStyle='#111';ctx.fillRect(dx,dy,TILE,TILE);}continue;}
ctx.fillStyle=BCOLORS[b]||'#f0f';
if(b==BLOCKS.WATER){ctx.fillStyle='#3366CC';ctx.globalAlpha=0.5;ctx.fillRect(dx,dy,TILE,TILE);ctx.globalAlpha=1.0;}
else if(b==BLOCKS.DOOR){var isOpen=isDoorOpen(x,y);if(isOpen){ctx.fillStyle='rgba(140,100,50,0.25)';ctx.fillRect(dx,dy,TILE,TILE);ctx.fillStyle='#c4a060';ctx.fillRect(dx+2,dy+TILE/2,TILE-4,TILE/2);ctx.fillStyle='#8B6914';ctx.fillRect(dx+TILE/2-1,dy+TILE/2,1,TILE/2);ctx.fillStyle='#FFD700';ctx.fillRect(dx+TILE/2+1,dy+TILE/2+2,2,2);}else{ctx.fillStyle='#8B4513';ctx.fillRect(dx+1,dy+1,TILE-2,TILE-1);ctx.fillStyle='#654321';ctx.fillRect(dx+TILE/2-1,dy+TILE/3,2,2);ctx.fillStyle='#A0522D';ctx.fillRect(dx+2,dy+2,2,2);ctx.fillRect(dx+TILE-4,dy+4,2,2);}}
else if(b==BLOCKS.TORCH){ctx.fillStyle='rgba(255,200,50,0.3)';ctx.fillRect((x-1)*TILE-camX,(y-1)*TILE-camY,3*TILE,3*TILE);ctx.fillStyle='#8B5A2B';ctx.fillRect(dx+3,dy+2,2,6);ctx.fillStyle='#FFD700';ctx.fillRect(dx+2,dy,4,3);}
else if(b==BLOCKS.LEAVES){ctx.fillRect(dx,dy,TILE,TILE);ctx.fillStyle='#196619';ctx.fillRect(dx+1,dy+1,2,2);ctx.fillRect(dx+5,dy+4,2,2);}
else{ctx.fillRect(dx,dy,TILE,TILE);
// Block detail
if(b==BLOCKS.GRASS){ctx.fillStyle='#2d6b1e';ctx.fillRect(dx,dy,TILE,2);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.STONE){ctx.fillStyle='#707070';ctx.fillRect(dx+2,dy+2,3,2);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.WOOD){drawWoodBark(ctx,dx,dy,TILE);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.PLANKS){drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.DIRT){drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.SAND){drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.COAL_ORE){ctx.fillStyle='#222';ctx.fillRect(dx+2,dy+2,3,3);drawOreCracks(ctx,dx,dy,TILE);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.IRON_ORE){ctx.fillStyle='#DAA520';ctx.fillRect(dx+1,dy+2,2,2);ctx.fillRect(dx+5,dy+5,2,2);drawOreCracks(ctx,dx,dy,TILE);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.GOLD_ORE){ctx.fillStyle='#FFD700';ctx.fillRect(dx+2,dy+3,3,2);drawOreCracks(ctx,dx,dy,TILE);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.DIAMOND_ORE){ctx.fillStyle='#00FFFF';ctx.fillRect(dx+2,dy+2,2,2);ctx.fillRect(dx+5,dy+5,2,2);drawOreCracks(ctx,dx,dy,TILE);drawTileShading(ctx,dx,dy,TILE);}
if(b==BLOCKS.WHEAT1||b==BLOCKS.WHEAT2||b==BLOCKS.WHEAT3){drawCropGrowth(ctx,b,dx,dy,TILE);}
if(b==BLOCKS.LEAVES){ctx.fillStyle='#196619';ctx.fillRect(dx+1,dy+1,2,2);ctx.fillRect(dx+5,dy+4,2,2);drawTileShading(ctx,dx,dy,TILE);}
drawTileShading(ctx,dx,dy,TILE);
}
}}
// Torch glow fallback + night atmosphere
var _torchCenters=[];
for(var _tx=sx;_tx<ex&&_tx<WORLD_W;_tx++){for(var _ty=sy;_ty<ey&&_ty<WORLD_H;_ty++){if(world[_tx]&&world[_tx][_ty]===BLOCKS.TORCH){_torchCenters.push({x:_tx*TILE-camX+TILE/2,y:_ty*TILE-camY+TILE/2});}}}
if(isNight||weatherIntensity>0.05){ctx.fillStyle='rgba(0,0,20,'+(isNight?0.42:0.18)+weatherIntensity*0.12+')';ctx.fillRect(0,0,W,H);for(var _ti=0;_ti<_torchCenters.length;_ti++){createRadialHole(ctx,_torchCenters[_ti].x,_torchCenters[_ti].y,TILE*4);}}
renderCompass(ctx);
// Cursor highlight
var cx=cursorX*TILE-camX,cy=cursorY*TILE-camY;
ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1;ctx.strokeRect(cx,cy,TILE,TILE);
// Block name tooltip
var cb=world[cursorX]&&world[cursorX][cursorY];if(cb&&cb!==BLOCKS.AIR&&cb!==BLOCKS.WATER){var bname=BNAMES[cb]||'Block';ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(cx,cy-10,TILE+2,9);ctx.fillStyle='#fff';ctx.font='6px monospace';ctx.fillText(bname,cx+1,cy-2);
ctx.textAlign='left';}
// Mining progress
if(miningProgress>0){
var b=world[cursorX]?world[cursorX][cursorY]:0;var hard=BLOCK_HEALTH[b]||HARDNESS[b]||1;
ctx.fillStyle='rgba(255,0,0,0.5)';ctx.fillRect(cx,cy,TILE*(miningProgress/hard),2);
}
// Player
var px=player.x-camX,py=player.y-camY;
ctx.fillStyle='#a67c52';ctx.fillRect(px+1,py,4,4); // head
ctx.fillStyle='#2266aa';ctx.fillRect(px,py+4,6,5); // body
ctx.fillStyle='#1a1a8a';ctx.fillRect(px+1,py+9,2,3);ctx.fillRect(px+3,py+9,2,3); // legs
// Held tool
var ht=getHeldItem();if(ht.id>=101&&ht.id<=122&&TOOL_TIER[ht.id]&&player.attacking<=0){var tx=px+(player.dir>0?5:-5),ty=py+2;drawToolSprite(ctx,tx,ty,6,6,ht.id);}
// Attack animation
if(player.attacking>0){
var hld=getHeldItem();var ax=px+(player.dir>0?6:-4),ay=py+1;
if(hld.id>=101&&hld.id<=122&&TOOL_TIER[hld.id]){drawToolSprite(ctx,ax-camX+camX,ay,8,8,hld.id);}else{ctx.fillStyle='#aaa';ctx.fillRect(ax,ay+2,3,1);}
player.attacking--;
}
// Entities
for(var i=0;i<entities.length;i++){
var e=entities[i];if(!e)continue;var ex=e.x-camX,ey=e.y-camY;
if(e.type=='creeper'){
var fp=e.fuseTimer/e.fuseMax;
var flash=e.fuseActive&&Math.floor(e.fuseTimer/4)%2==0;
var swell=1+fp*0.3;
var sw=Math.floor(e.w*swell),sh=Math.floor(e.h*swell);
var sox=ex-Math.floor((sw-e.w)/2),soy=ey-Math.floor((sh-e.h));
ctx.fillStyle=flash?'#fff':'#0c0';ctx.fillRect(sox+1,soy,sw-2,4);
ctx.fillStyle=flash?'#faa':'#080';ctx.fillRect(sox,soy+3,sw,sh-7);
ctx.fillStyle='#060';ctx.fillRect(sox,soy+sh-4,2,4);ctx.fillRect(sox+sw-2,soy+sh-4,2,4);
ctx.fillStyle='#000';ctx.fillRect(sox+1,soy+1,1,1);ctx.fillRect(sox+sw-3,soy+1,1,1);
if(e.fuseActive){
ctx.fillStyle='rgba(255,0,0,0.3)';ctx.fillRect(sox-2,soy-2,sw+4,sh+4);
ctx.fillStyle='#ff0';ctx.font='6px monospace';ctx.fillText('Sss...',sox-2,soy-8);
ctx.fillStyle='#f00';ctx.fillRect(ex,ey-5,e.w,2);
ctx.fillStyle='#ff0';ctx.fillRect(ex,ey-5,Math.floor(e.w*fp),2);
}
}else{
if(e.type=='cave_spider'){ctx.fillStyle='#4a2810';ctx.fillRect(ex,ey+1,8,3);ctx.fillStyle='#f00';ctx.fillRect(ex+2,ey+1,1,1);ctx.fillRect(ex+5,ey+1,1,1);}else if(e.type=='cave_skeleton'){ctx.fillStyle='#d4c9a8';ctx.fillRect(ex+1,ey,4,4);ctx.fillStyle='#bbb';ctx.fillRect(ex,ey+4,6,8);ctx.fillStyle='#222';ctx.fillRect(ex+2,ey+1,1,1);ctx.fillRect(ex+4,ey+1,1,1);}else if(e.type=='zombie'){ctx.fillStyle='#0a0';ctx.fillRect(ex+1,ey,4,4);ctx.fillStyle='#080';ctx.fillRect(ex,ey+4,6,4);ctx.fillStyle='#050';ctx.fillRect(ex+1,ey+4,1,4);ctx.fillRect(ex+4,ey+4,1,4);ctx.fillStyle='#060';ctx.fillRect(ex,ey+8,2,4);ctx.fillRect(ex+4,ey+8,2,4);ctx.fillStyle='#000';ctx.fillRect(ex+2,ey+1,1,1);ctx.fillRect(ex+4,ey+1,1,1);ctx.fillStyle='#030';ctx.fillRect(ex+2,ey+3,2,1);}else if(e.type=='skeleton'){ctx.fillStyle='#ddd';ctx.fillRect(ex+1,ey,4,4);ctx.fillStyle='#bbb';ctx.fillRect(ex+1,ey+4,4,4);ctx.fillStyle='#999';ctx.fillRect(ex+2,ey+5,2,1);ctx.fillRect(ex+2,ey+7,2,1);ctx.fillStyle='#ddd';ctx.fillRect(ex,ey+8,2,4);ctx.fillRect(ex+4,ey+8,2,4);ctx.fillStyle='#222';ctx.fillRect(ex+2,ey+1,1,1);ctx.fillRect(ex+4,ey+1,1,1);ctx.fillStyle='#444';ctx.fillRect(ex+2,ey+3,2,1);}else if(e.type=='sheep'){ctx.fillStyle='#f0f0f0';ctx.fillRect(ex,ey+2,6,6);ctx.fillStyle='#aaa';ctx.fillRect(ex+1,ey,4,3);ctx.fillStyle='#f0f0f0';ctx.fillRect(ex,ey+8,2,4);ctx.fillRect(ex+4,ey+8,2,4);ctx.fillStyle='#222';ctx.fillRect(ex+2,ey+1,1,1);ctx.fillRect(ex+4,ey+1,1,1);}else{ctx.fillStyle=e.color;ctx.fillRect(ex,ey,e.w,e.h);}
}
drawEntityShading(ctx,ex,ey,e.w||6,e.h||12);
if(e.onFire){ctx.fillStyle='#f80';ctx.fillRect(ex,ey,e.w,e.h);ctx.fillStyle='#ff0';ctx.fillRect(ex+1,ey+2,2,3);ctx.fillRect(ex+e.w-3,ey+1,2,4);}ctx.fillStyle='#f00';ctx.fillRect(ex,ey-3,e.w*((e.hp||0)/(e.maxHp||1)),2);
}
// Particles
for(var i=particles.length-1;i>=0;i--){
var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.life--;
if(p.life<=0){particles.splice(i,1);continue;}
ctx.fillStyle=p.color;ctx.fillRect(p.x-camX,p.y-camY,2,2);
}
}
// Arrows
for(var ai=0;ai<arrows.length;ai++){
var arr=arrows[ai];if(!arr)continue;
var ax=arr.x-camX, ay=arr.y-camY;
ctx.strokeStyle=arr.fromEnemy?'#8B0000':'#555';
ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(ax-arr.vx*1.5,ay-arr.vy*1.5); ctx.stroke();
ctx.fillStyle=arr.fromEnemy?'#aa3322':'#333'; ctx.fillRect(ax-1,ay-1,3,3);
}
ctx.restore();
// === HUD ===
function renderHUD(){
var hpBar=document.getElementById('health-bar');
var hunBar=document.getElementById('hunger-bar');
if(gameMode=='creative'){
if(hpBar)hpBar.style.display='none';
if(hunBar)hunBar.style.display='none';
}else{
if(hpBar){hpBar.style.display='block';hpBar.innerHTML='';for(var h=0;h<10;h++){hpBar.innerHTML+=(h<Math.ceil(player.hp/2))?'<span style="color:#ff3b3b">\u2764</span>':'<span style="color:#444">\u2661</span>';}}
if(hunBar){hunBar.style.display='block';var huns='';for(var hi=0;hi<player.maxHunger/2;hi++){huns+=hi<Math.ceil(player.hunger/2)?'<span style="color:#c80;">&#x1F35E;</span>':'<span style="color:#444;">&#x25A1;</span>';}hunBar.innerHTML=huns;}
}
var hb=document.getElementById('inv-bar');hb.innerHTML='';
for(var i=0;i<9;i++){
var s=inventory[i];var div=document.createElement('div');div.className='inv-slot'+(i==player.selectedSlot?' selected':'');
if(s.id>0){
var icon=document.createElement('div');icon.className='block-icon';
if(s.id>=101&&s.id<=122&&TOOL_TIER[s.id]){var tc=document.createElement('canvas');tc.width=16;tc.height=16;drawToolSprite(tc.getContext('2d'),0,0,16,16,s.id);icon.style.background='url('+tc.toDataURL()+') center/contain no-repeat';}else{icon.style.background=s.id<100?BCOLORS[s.id]:(ICOLORS[s.id]||'#fff');}
icon.style.width='14px';icon.style.height='14px';div.appendChild(icon);
var td=getToolDur(i);if(td){var db=document.createElement('div');db.style.cssText='position:absolute;bottom:1px;left:1px;height:2px;width:'+Math.round(12*td.cur/td.max)+'px;background:'+(td.cur/td.max>0.5?'#0f0':td.cur/td.max>0.25?'#ff0':'#f00')+';';div.appendChild(db);}
var cnt=document.createElement('span');cnt.className='count';cnt.textContent=s.count>1?s.count:'';div.appendChild(cnt);
}
hb.appendChild(div);
}
// Health
if(gameMode=='survival'){
var hbar=document.getElementById('health-bar');hbar.innerHTML='';
for(var i=0;i<10;i++){
var h=document.createElement('span');h.style.fontSize='7px';
h.textContent=i<Math.ceil(player.hp/2)?'\u2764':'\u2661';
h.style.color=i<Math.ceil(player.hp/2)?'#ff3b3b':'#444';hbar.appendChild(h);
}
}
// Time
var td=document.getElementById('time-display');
var hr=Math.floor((dayTime/dayLength)*24);var ampm=hr>=12?'PM':'AM';
hr=hr%12;if(hr==0)hr=12;
td.textContent=(isNight?'\u263D':'\u2600')+' '+hr+ampm;
var coord=document.getElementById('coord-display');if(coord)coord.textContent='X:'+Math.floor(player.x/TILE)+' Y:'+Math.floor(player.y/TILE);
var hv=document.getElementById('hud-values');if(hv){hv.textContent='HP '+Math.ceil(player.hp)+'/'+player.maxHp+'  Food '+Math.floor(player.hunger)+'/'+player.maxHunger;}
var body=document.body;
if(body&&body.classList){
  var nearMob=false;
  for(var mi=0;mi<entities.length;mi++){var e=entities[mi];if(!e)continue;if(e.type==='zombie'||e.type==='skeleton'||e.type==='creeper'||e.type==='cave_spider'||e.type==='cave_skeleton'){var ddist=Math.sqrt((player.x-e.x)*(player.x-e.x)+(player.y-e.y)*(player.y-e.y));if(ddist<80){nearMob=true;break;}}}
  var danger=gameMode!=='creative'&&(player.hp<=player.maxHp*0.35||nearMob);
  body.classList.toggle('danger',danger);
}
}
// === CRAFTING UI ===


document.addEventListener('click',function(e){if(gameState=='crafting'){var cs=document.getElementById('craft-screen');var rl=document.getElementById('recipe-list');if(!rl.contains(e.target)&&e.target.id!=='craft-close-btn')hideCrafting();}});
var CRAFT_FAV_KEY='r1mc_craft_favs';
var craftingSearchQuery='';
var craftingFilter='all';
var craftingFavorites=[];
function loadCraftingFavorites(){try{var raw=localStorage.getItem(CRAFT_FAV_KEY);if(raw){var a=JSON.parse(raw);if(Array.isArray(a))craftingFavorites=a.slice();}}catch(e){}}
function saveCraftingFavorites(){try{localStorage.setItem(CRAFT_FAV_KEY,JSON.stringify(craftingFavorites));}catch(e){}}
function isCraftingFavorite(rec){if(!rec)return false;return craftingFavorites.indexOf(rec.name)>=0;}
function toggleCraftingFavorite(rec){if(!rec)return false;if(isCraftingFavorite(rec)){craftingFavorites=craftingFavorites.filter(function(n){return n!==rec.name;});}else{craftingFavorites.push(rec.name);}saveCraftingFavorites();return isCraftingFavorite(rec);}
function setCraftingSearchQuery(q){craftingSearchQuery=String(q==null?'':q).toLowerCase();return craftingSearchQuery;}
function setCraftingFilter(m){craftingFilter=(m==='favorites'||m==='craftable')?m:'all';return craftingFilter;}
function getFilteredRecipes(){
  var out=[];
  for(var r=0;r<RECIPES.length;r++){
    var rec=RECIPES[r];
    if(!rec)continue;
    if(craftingSearchQuery){
      var nm=(rec.name||'').toLowerCase();
      var costStr='';
      for(var j=0;j<rec.inp.length;j++){costStr+=(BNAMES[rec.inp[j][0]]||INAMES[rec.inp[j][0]]||rec.inp[j][0])+' '; }
      if(nm.indexOf(craftingSearchQuery)<0 && costStr.toLowerCase().indexOf(craftingSearchQuery)<0) continue;
    }
    if(craftingFilter==='favorites' && !isCraftingFavorite(rec)) continue;
    if(craftingFilter==='craftable' && !canCraftRecipe(rec)) continue;
    out.push(rec);
  }
  return out;
}
function canCraftRecipe(rec){if(!rec)return false;for(var j=0;j<rec.inp.length;j++){if(countItem(rec.inp[j][0])<rec.inp[j][1])return false;}return true;}
function getCraftingHint(rec){return getRecipeUnlockHint(rec);}
function getRecipeHint(rec){return getRecipeUnlockHint(rec);}
function getRecipeUnlockHint(rec){if(!rec)return '';var miss=[];for(var j=0;j<rec.inp.length;j++){var have=countItem(rec.inp[j][0]);var need=rec.inp[j][1];if(have<need){miss.push((BNAMES[rec.inp[j][0]]||INAMES[rec.inp[j][0]]||rec.inp[j][0])+' '+(need-have)+'/'+need);}}return miss.length?'Missing: '+miss.join(', '):'Ready to craft';}
function toggleCraftingMenu(){if(gameState=='crafting'){hideCrafting();}else if(gameState=='playing'){showCrafting();}}
function renderCraftingList(){
var cs=document.getElementById('craft-screen');if(cs)cs.style.display='block';
var rl=document.getElementById('recipe-list');if(!rl)return;
rl.innerHTML='';
var search=document.getElementById('craft-search');if(search){search.value=craftingSearchQuery;search.oninput=function(){setCraftingSearchQuery(this.value);renderCraftingList();};}
var filter=document.getElementById('craft-filter');if(filter){filter.value=craftingFilter;filter.onchange=function(){setCraftingFilter(this.value);renderCraftingList();};}
var list=getFilteredRecipes();
if(list.length===0){
var empty=document.createElement('div');empty.style.cssText='color:#aaa;font-size:7px;padding:6px;';empty.textContent='No recipes match';rl.appendChild(empty);return;
}
for(var i=0;i<list.length;i++){
var rec=list[i];var canCraft=canCraftRecipe(rec);
var ridx=RECIPES.indexOf(rec);
var div=document.createElement('div');div.className='recipe';div.setAttribute('data-ridx',String(ridx));div.title=getRecipeUnlockHint(rec);
div.style.opacity=canCraft?'1':'0.4';
var star=document.createElement('span');star.className='r-star';star.textContent=isCraftingFavorite(rec)?'★':'☆';
(function(recRef,starRef){starRef.onclick=function(e){if(e&&e.stopPropagation)e.stopPropagation();toggleCraftingFavorite(recRef);starRef.textContent=isCraftingFavorite(recRef)?'★':'☆';renderCraftingList();};})(rec,star);
div.appendChild(star);
var nm=document.createElement('span');nm.className='r-name';
nm.textContent=rec.name+' x'+rec.cnt;div.appendChild(nm);
var cost=document.createElement('span');cost.className='r-cost';
var costStr='';for(var j=0;j<rec.inp.length;j++){
var iid=rec.inp[j][0];costStr+=(BNAMES[iid]||INAMES[iid]||'?')+'x'+rec.inp[j][1]+' ';
}
cost.textContent=costStr;div.appendChild(cost);
if(canCraft){(function(recRef){div.onclick=function(){craftItem(recRef);};})(rec);}
rl.appendChild(div);
}
}
function updateCraftingLive(){
if(gameState!=='crafting')return;
var rl=document.getElementById('recipe-list');if(!rl||!rl.children)return;
for(var i=0;i<rl.children.length;i++){
var div=rl.children[i];if(!div||!div.getAttribute)continue;
var ridx=parseInt(div.getAttribute('data-ridx'),10);if(!isFinite(ridx)||ridx<0||ridx>=RECIPES.length)continue;
var rec=RECIPES[ridx];if(!rec)continue;
var can=canCraftRecipe(rec);
div.style.opacity=can?'1':'0.4';
div.title=getRecipeUnlockHint(rec);
if(can){(function(recRef){div.onclick=function(){craftItem(recRef);};})(rec);}
else{div.onclick=null;}
}
}
function showCrafting(){
gameState='crafting';document.getElementById('craft-btn').style.display='none';
var cs=document.getElementById('craft-screen');if(cs)cs.style.display='block';
loadCraftingFavorites();
renderCraftingList();
}
function hideCrafting(){gameState='playing';document.getElementById('craft-btn').style.display='block';document.getElementById('zoom-btn').style.display='block';document.getElementById('autolock-btn').style.display='block';document.getElementById('craft-btn').style.display='block';document.getElementById('combat-btn').style.display='block';document.getElementById('craft-screen').style.display='none';}
function craftItem(rec){
for(var j=0;j<rec.inp.length;j++){if(countItem(rec.inp[j][0])<rec.inp[j][1]){playSound('error');return;}}
for(var j=0;j<rec.inp.length;j++){removeItem(rec.inp[j][0],rec.inp[j][1]);}
addItem(rec.out,rec.cnt);
playSound('craft');
if(TOOL_TIER[rec.out]){for(var ti=0;ti<9;ti++){if(inventory[ti].id==rec.out&&!getToolDur(ti)){initToolDur(ti,rec.out);break;}}}
showCrafting();
}
// === CONTROLS ===
// R1 Hardware: Scroll wheel
window.addEventListener('scrollUp',function(){
if(gameState=='crafting'){document.getElementById('craft-screen').scrollTop-=30;return;}
if(gameState=='furnace'){document.getElementById('smelt-list').scrollTop-=30;return;}
if(zoomPanelOpen){var s=document.getElementById('zoom-slider');var v=Math.min(3,parseFloat(s.value)+0.1);s.value=v;setZoom(v);return;}
player.selectedSlot=(player.selectedSlot-1+9)%9;
});
window.addEventListener('scrollDown',function(){
if(gameState=='crafting'){document.getElementById('craft-screen').scrollTop+=30;return;}
if(gameState=='furnace'){document.getElementById('smelt-list').scrollTop+=30;return;}
if(zoomPanelOpen){var s=document.getElementById('zoom-slider');var v=Math.max(0.5,parseFloat(s.value)-0.1);s.value=v;setZoom(v);return;}
player.selectedSlot=(player.selectedSlot+1)%9;
});
// R1 Hardware: Side button (single tap = mine/place, double-tap = craft/fly)
var lastSideClickTime=0;
window.addEventListener('sideClick',function(){
if(gameState=='title'||gameState=='paused'){return;}
if(gameState=='crafting'){hideCrafting();return;}
if(gameState=='furnace'){closeFurnace();return;}
if(gameState=='chest'){closeChest();return;}
if(gameState=='dead'){restartGame();return;}
// Double-tap detection
var now=Date.now();
if(now-lastSideClickTime<400&&gameState=='playing'){
lastSideClickTime=0;
if(gameMode=='creative')toggleFly();else showCrafting();
return;
}
lastSideClickTime=now;
var bx=cursorX,by=cursorY;if(bx>=0&&bx<WORLD_W&&by>=0&&by<WORLD_H){
if(world[bx][by]==BLOCKS.DOOR){toggleDoor(bx,by);r1Vibrate(15);}
else if(world[bx][by]!=BLOCKS.AIR&&world[bx][by]!=BLOCKS.WATER&&world[bx][by]!=BLOCKS.BEDROCK){mineBlock();}
else{var hi=getHeldItem();if(hi.id==126){useHoe(cursorX,cursorY);}else if(hi.id==123&&plantSeed(cursorX,cursorY)){if(gameMode!='creative'){hi.count--;if(hi.count<=0){hi.id=0;hi.count=0;}}}else{placeBlock();}}
}
});
// === R1 LONG-PRESS SUPPORT (side button aliases + touch) ===
// Save when app is backgrounded/closed on R1.
try{
  document.addEventListener('visibilitychange',function(){ if(document.hidden && gameState==='playing'){ try{ saveGame('Autosave'); }catch(e){} } if(!document.hidden){ try{resetGlobalInputs();}catch(e){} } });
  window.addEventListener('pagehide',function(){ if(gameState==='playing'){ try{ saveGame('Autosave'); }catch(e){} } try{resetGlobalInputs();}catch(e){} });
  window.addEventListener('beforeunload',function(){ if(gameState==='playing'){ try{ saveGame('Autosave'); }catch(e){} } try{resetGlobalInputs();}catch(e){} });
  try{window.addEventListener('focus',function(){try{resetGlobalInputs();}catch(e){}});}catch(e){}
}catch(e){}

function getContextualLongPressAction(){
  // Returns a human/action result for long-press in the current context.
  var bx=cursorX,by=cursorY;
  if(bx>=0&&bx<WORLD_W&&by>=0&&by<WORLD_H){
    var b=world[bx][by];
    if(b===BLOCKS.CHEST)return 'chest';
    if(b===BLOCKS.FURNACE)return 'furnace';
    if(b===BLOCKS.DOOR)return 'door';
  }
  var held=getHeldItem();
  if(held&&held.id>0){
    if(PLACEABLE_BLOCK_IDS.indexOf(held.id)>=0) return 'place';
    if(FOOD_IDS.indexOf(held.id)>=0)return 'eat';
    if(SWORD_IDS.indexOf(held.id)>=0)return 'attack';
    if(TOOL_IDS.indexOf(held.id)>=0)return 'repair';
    if(held.id===ITEMS.WHEAT_SEEDS)return 'plant';
  }
  return 'inventory';
}
function performContextualLongPress(){
  var action=getContextualLongPressAction();
  r1LongPressHandledAt=Date.now();
  if(action==='chest'){openChest(cursorX,cursorY);r1Vibrate(20);r1Toast('Chest',800);return 'chest';}
  if(action==='furnace'){openFurnace();r1Vibrate(20);r1Toast('Furnace',800);return 'furnace';}
  if(action==='door'){toggleDoor(cursorX,cursorY);r1Vibrate(15);r1Toast('Door',700);return 'door';}
  if(action==='place'){placeBlock();r1Vibrate(20);r1Toast('Placed',700);return 'place';}
  if(action==='eat'){eatFood();r1Vibrate(20);return 'eat';}
  if(action==='attack'){attackEntity();r1Vibrate(15);return 'attack';}
  if(action==='repair'){repairTool();r1Vibrate(15);return 'repair';}
  if(action==='plant'){useSeeds();r1Vibrate(15);return 'plant';}
  toggleInventory();r1Vibrate(25);r1Toast('Inventory',900);return 'inventory';
}
function dedicatedLongPressPlacement(){
  r1LongPressHandledAt=Date.now();
  var held=getHeldItem();
  if(!held||held.id===0){ r1Toast('Nothing held to place',900); return 'empty'; }
  if((held.id>0 && held.id<100)||held.id===ITEMS.DOOR_ITEM){
    var ok=placeBlock();
    if(ok){ playSound('place'); r1Vibrate(20); r1Toast('Placed (long press)',700); return 'place'; }
    r1Toast('Cannot place here',900); playSound('error'); return 'blocked';
  }
  if(held.id===ITEMS.WHEAT_SEEDS){ var pok=useSeeds(); if(pok){playSound('place');r1Toast('Planted',700);return 'plant';} r1Toast('Need farmland',900);return 'blocked';}
  if(FOOD_IDS.indexOf(held.id)>=0){ eatFood(); playSound('eat'); r1Toast('Eaten',700); return 'eat'; }
  if(SWORD_IDS.indexOf(held.id)>=0){ attackEntity(); playSound('attack'); return 'attack'; }
  if(TOOL_IDS.indexOf(held.id)>=0){ repairTool(); return 'repair'; }
  r1Toast('Hold block/item to place',900); playSound('error'); return 'not-placeable';
}
function longPressPlaceBlock(){return dedicatedLongPressPlacement();}
function longPressPlaceItem(){return dedicatedLongPressPlacement();}
function longPressPlace(){return dedicatedLongPressPlacement();}
function performDedicatedLongPress(){return dedicatedLongPressPlacement();}
function performDedicatedLongPressPlacement(){return dedicatedLongPressPlacement();}
function dedicatedLongPress(){return dedicatedLongPressPlacement();}
function dedicatedLongPressBlock(){return dedicatedLongPressPlacement();}
function dedicatedLongPressItem(){return dedicatedLongPressPlacement();}
function longPressItemPlacement(){return dedicatedLongPressPlacement();}
function longPressBlockPlacement(){return dedicatedLongPressPlacement();}
function placeOnLongPress(){return dedicatedLongPressPlacement();}
function performPlacementLongPress(){return dedicatedLongPressPlacement();}
function performLongPressPlacement(){return dedicatedLongPressPlacement();}
function longPressPlacement(){return dedicatedLongPressPlacement();}
function dedicatedPlaceLongPress(){return dedicatedLongPressPlacement();}
function handleR1LongPressPlacement(){return dedicatedLongPressPlacement();}
function handleR1LongPress(){
  if(gameState=='title'){showHelp();r1LongPressHandledAt=Date.now();return;}
  if(gameState=='playing'){return performContextualLongPress();}
  if(gameState=='paused'){closeHelp&&closeHelp();return;}
  r1LongPressHandledAt=Date.now();
}
function handleSideLongPressCompat(){handleR1LongPress();}
['sideLongPress','longPress','sideHold','longPressStart','sideLongClick'].forEach(function(ev){
  try{window.addEventListener(ev,function(){handleR1LongPress();});}catch(e){}
});
// Touch long-press: holding still on canvas opens inventory/help without leaving mine/place tap.
var originalTouchStartHandler=null;
function clearTouchLongPress(){if(touchLongPressTimer){clearTimeout(touchLongPressTimer);touchLongPressTimer=null;}}
var touchStartedOnGame=false;
var touchStartTime=0;
var touchStartTarget=null;

// Touch controls
var touchMode='move';
document.addEventListener('touchstart',function(e){
e.preventDefault();var t=e.touches[0];touchStartX=t.clientX;touchStartY=t.clientY;touchActive=true;touchMoved=false;touchLongPressed=false;touchStartTime=Date.now();
clearTouchLongPress();
touchLongPressTimer=setTimeout(function(){
  if(touchActive&&!touchMoved&&gameState=='playing'){touchLongPressed=true;touchLongPressHandled=true;handleR1LongPress();}
},580);
var sx=t.clientX,sy=t.clientY;var ux=(sx-W/2)/zoomLevel+W/2;var uy=(sy-H/2)/zoomLevel+H/2;var tx=Math.floor((ux+camX)/TILE),ty=Math.floor((uy+camY)/TILE);
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H){cursorX=tx;cursorY=ty;}
touchState.active=true;touchState.startX=t.clientX;touchState.startY=t.clientY;touchState.moved=false;
},{passive:false});
document.addEventListener('touchmove',function(e){
e.preventDefault();if(!touchActive)return;var t=e.touches[0];
var dx=t.clientX-touchStartX,dy=t.clientY-touchStartY;
if(Math.abs(dx)>6||Math.abs(dy)>6){touchMoved=true;touchState.moved=true;}
clearTouchLongPress();
// joystick-like drag with dead zone and vertical intent
var dead=10;
if(Math.abs(dx)>dead){keys.left=dx<0;keys.right=dx>0;}else{keys.left=false;keys.right=false;}
if(dy<-18){keys.up=true;}else{keys.up=false;}
touchState.joystickX=dx;touchState.joystickY=dy;
var ux=(t.clientX-W/2)/zoomLevel+W/2;var uy=(t.clientY-H/2)/zoomLevel+H/2;var tx=Math.floor((ux+camX)/TILE),ty=Math.floor((uy+camY)/TILE);
if(tx>=0&&tx<WORLD_W&&ty>=0&&ty<WORLD_H){cursorX=tx;cursorY=ty;}
},{passive:false});
document.addEventListener('touchend',function(e){
e.preventDefault();clearTouchLongPress();
var wasTap=!touchMoved&&!touchLongPressed&&(Date.now()-touchStartTime)<420;
touchActive=false;keys.left=false;keys.right=false;keys.up=false;keys.down=false;
touchMoved=false;touchState.active=false;touchState.moved=false;
// tap-to-mine/place when release over game canvas
if(wasTap&&gameState=='playing'&&touchStartedOnGame){
var bx=cursorX,by=cursorY;
if(bx>=0&&bx<WORLD_W&&by>=0&&by<WORLD_H){
if(world[bx][by]==BLOCKS.DOOR){toggleDoor(bx,by);r1Vibrate(15);}
else if(world[bx][by]!=BLOCKS.AIR&&world[bx][by]!=BLOCKS.WATER){
  if(isToolMismatch(bx,by)){r1Toast('Wrong tool for this block',900);}
  mineBlock();
}else{placeBlock();}
}
}
touchStartedOnGame=false;
},{passive:false});
// === GAME LOOP ===
function startGame(mode){
gameMode=mode;gameState='playing';weatherState='clear';weatherTimer=0;weatherDuration=WEATHER_MIN_CLEAR+Math.floor(Math.random()*(WEATHER_MAX_CLEAR-WEATHER_MIN_CLEAR));weatherIntensity=0;targetIntensity=0;raindrops=[];lightningFlash=0;
document.getElementById('title').style.display='none';document.getElementById('r1-hud').style.display='flex';
canvas=document.getElementById('game');ctx=canvas.getContext('2d');
initAudio();


generateWorld();
if(mode=='creative'){for(var b=1;b<=28;b++)addItem(b,64);for(var t=100;t<=120;t++)addItem(t,64);}
else{addItem(ITEMS.WOOD_PICK,1);addItem(ITEMS.WOOD_AXE,1);addItem(ITEMS.BREAD,3);addItem(ITEMS.RAW_PORK,2);}
lastTime=performance.now();
requestAnimationFrame(gameLoop);
}
function cancelPointerState(){
keys.left=false;keys.right=false;keys.up=false;keys.down=false;
touchState.active=false;touchState.moved=false;touchState.longPressed=false;
touchActive=false;touchMoved=false;touchLongPressed=false;
clearTouchLongPress();
miningProgress=0;miningTarget={x:-1,y:-1};
player.mining=0;player.mineX=-1;player.mineY=-1;
pointerCancelled=true;
setTimeout(function(){pointerCancelled=false;},0);
}
function pauseGame(){
if(gameState!=='playing')return;
gameState='paused';
cancelPointerState();
var pm=document.getElementById('pause-menu');if(pm)pm.style.display='flex';
r1Toast('Paused',900);
}
function resumeGame(){gameState='playing';var pm=document.getElementById('pause-menu');if(pm)pm.style.display='none';cancelPointerState();lastTime=performance.now();}
function restartGame(){
cancelPointerState();
gameState='playing';player.hp=player.maxHp;player.hunger=player.maxHunger;
entities=[];particles=[];droppedItems=[];miningProgress=0;miningTarget={x:-1,y:-1};
chestData={};doorStates={};toolDurability={};
inventory=[];for(var i=0;i<36;i++)inventory.push({id:0,count:0});
try{generateWorld();}catch(e){}
if(gameMode=='creative'){for(var b=1;b<=28;b++)addItem(b,64);for(var t=100;t<=120;t++)addItem(t,64);}
else{addItem(ITEMS.WOOD_PICK,1);addItem(ITEMS.WOOD_AXE,1);addItem(ITEMS.BREAD,3);addItem(ITEMS.RAW_PORK,2);}
player.x=WORLD_W/2*TILE;
for(var y=0;y<WORLD_H;y++){if(world[Math.floor(player.x/TILE)][y]!=BLOCKS.AIR&&world[Math.floor(player.x/TILE)][y]!=BLOCKS.WATER){player.y=(y-2)*TILE;break;}}
camX=player.x-W/2;camY=player.y-H/2;
var sb=document.getElementById('save-btn-hud');if(sb)sb.style.display='block';
var pm=document.getElementById('pause-menu');if(pm)pm.style.display='none';
r1Toast('Restarted',1200);
lastTime=performance.now();
}
function resumeGame(){gameState='playing';document.getElementById('pause-menu').style.display='none';}
function gameLoop(now){
dt=(now-lastTime)/16.67;if(dt>3)dt=3;lastTime=now;
if(gameState=='playing'){
updatePlayer(dt);updateHunger(dt);updateBlockPhysics();updateWaterFlow(dt);updateCrops(dt);updateDayNight();updateWeather();updateDoors(dt);spawnEnemies();spawnCaveEnemies();spawnSheep();updateEntities(dt);updateAutoLock();updateAutoCombat(dt);updateDroppedItems(dt);updateArrows(dt);
// Autosave: persist progress periodically so R1 reloads/crashes never erase it.
autoSaveTimer+=(dt*16.67);
if(autoSaveTimer>=AUTO_SAVE_INTERVAL){autoSaveTimer=0;try{if(saveGame('Autosave')){r1Toast('Autosaved',1200);}}catch(e){}}if(miningTarget.x!=cursorX||miningTarget.y!=cursorY){miningProgress=0;miningTarget.x=cursorX;miningTarget.y=cursorY;}
render();renderDroppedItems(ctx,camX,camY);renderAutoLock();renderAutoCombat(ctx,camX,camY);renderWeather();updateContextPanel();renderHUD();renderMobArrows(ctx,camX,camY);
if(gameMsgTimer>0){ctx.save();ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(20,120,200,20);ctx.fillStyle='#ff4';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(gameMsg,120,134);ctx.restore();gameMsgTimer--;}

}
if(gameState=='dead'){
ctx.fillStyle='rgba(200,0,0,0.3)';ctx.fillRect(0,0,W,H);
ctx.fillStyle='#fff';ctx.font='14px monospace';ctx.textAlign='center';ctx.fillText('YOU DIED',W/2,100);
ctx.font='8px monospace';ctx.fillStyle='#ff4';ctx.fillText('Tap or press to respawn',W/2,130);
ctx.font='7px monospace';ctx.fillStyle='#aaa';ctx.fillText('Items dropped at death location',W/2,150);
ctx.textAlign='left';
}
if(gameState=='crafting')try{updateCraftingLive();}catch(e){}
requestAnimationFrame(gameLoop);
}
// Touch-to-mine/place on canvas (R1 touch screen): cursor tracks touch; tap action resolves on release.
document.getElementById('game').addEventListener('touchstart',function(e){
if(gameState!='playing')return;
e.preventDefault();
touchStartedOnGame=true;
var t=e.touches[0];
var rect=canvas.getBoundingClientRect();
var mx=t.clientX-rect.left,my=t.clientY-rect.top;
cursorX=Math.floor((mx+camX)/TILE);cursorY=Math.floor((my+camY)/TILE);
r1Vibrate(6);
},{passive:false});
document.getElementById('game').addEventListener('touchmove',function(e){
if(gameState!='playing')return;
e.preventDefault();
var t=e.touches[0];
var rect=canvas.getBoundingClientRect();
var mx=t.clientX-rect.left,my=t.clientY-rect.top;
cursorX=Math.floor((mx+camX)/TILE);cursorY=Math.floor((my+camY)/TILE);
},{passive:false});

// === SAVE/LOAD SYSTEM ===
function sanitizeSaveName(name){
name=String(name==null?'':name).trim();
name=name.replace(/[\\\/:*?"<>|]/g,'_');
if(name.length===0)name='Save';
if(name.length>SAVE_NAME_MAX)name=name.slice(0,SAVE_NAME_MAX);
return name;
}
function makeUniqueSaveName(name,saves){
name=sanitizeSaveName(name);
if(!saves[name])return name;
var base=name;var i=2;
while(saves[name+'_'+i])i++;
return name+'_'+i;
}
function normalizeSaveState(raw){
if(!raw||typeof raw!=='object')return null;
if(!raw.player||typeof raw.player!=='object')raw.player={};
var p=raw.player;
p.x=typeof p.x==='number'?p.x:128;p.y=typeof p.y==='number'?p.y:0;
p.vx=p.vx||0;p.vy=p.vy||0;p.hp=typeof p.hp==='number'?p.hp:20;
p.maxHp=typeof p.maxHp==='number'&&p.maxHp>0?p.maxHp:20;
p.hunger=typeof p.hunger==='number'?p.hunger:20;
p.maxHunger=typeof p.maxHunger==='number'&&p.maxHunger>0?p.maxHunger:20;
p.hungerTimer=p.hungerTimer||0;p.air=typeof p.air==='number'?p.air:10;
p.selectedSlot=Math.max(0,Math.min(8,parseInt(p.selectedSlot,10)||0));
p.dir=p.dir===-1?-1:1;p.flying=!!p.flying;p.fallDist=p.fallDist||0;p.lastY=p.lastY||0;p.onGround=!!p.onGround;p.mining=0;p.attacking=0;p.mineX=-1;p.mineY=-1;
if(!Array.isArray(raw.inventory)||raw.inventory.length!==36){raw.inventory=[];for(var i=0;i<36;i++)raw.inventory.push({id:0,count:0});}
for(var i=0;i<36;i++){var it=raw.inventory[i];if(!it||typeof it!=='object'){raw.inventory[i]={id:0,count:0};continue;}it.id=parseInt(it.id,10)||0;it.count=parseInt(it.count,10)||0;if(it.count<0)it.count=0;}
if(!Array.isArray(raw.world)||raw.world.length!==WORLD_W){raw.world=[];for(var x=0;x<WORLD_W;x++){raw.world[x]=[];for(var y=0;y<WORLD_H;y++)raw.world[x][y]=(y>=SEA?BLOCKS.STONE:BLOCKS.AIR);}}
for(var x=0;x<WORLD_W;x++){if(!Array.isArray(raw.world[x])||raw.world[x].length!==WORLD_H){raw.world[x]=[];for(var y=0;y<WORLD_H;y++)raw.world[x][y]=(y>=SEA?BLOCKS.STONE:BLOCKS.AIR);}for(var y=0;y<WORLD_H;y++){var b=parseInt(raw.world[x][y],10);if(isNaN(b)||b<0||b>29)raw.world[x][y]=BLOCKS.AIR;}}
raw.gameMode=raw.gameMode==='creative'?'creative':'survival';
raw.camX=typeof raw.camX==='number'?raw.camX:0;raw.camY=typeof raw.camY==='number'?raw.camY:0;
raw.dayTime=typeof raw.dayTime==='number'?raw.dayTime:0;raw.dayLength=typeof raw.dayLength==='number'&&raw.dayLength>0?raw.dayLength:12000;raw.isNight=!!raw.isNight;raw.cursorX=Math.max(0,Math.min(WORLD_W-1,parseInt(raw.cursorX,10)||15));raw.cursorY=Math.max(0,Math.min(WORLD_H-1,parseInt(raw.cursorY,10)||15));
if(!Array.isArray(raw.entities))raw.entities=[];
if(!Array.isArray(raw.heightMap)||raw.heightMap.length!==WORLD_W){
raw.heightMap=[];for(var hx=0;hx<WORLD_W;hx++){for(var hy=0;hy<WORLD_H;hy++){if(raw.world[hx][hy]!=BLOCKS.AIR&&raw.world[hx][hy]!=BLOCKS.WATER){raw.heightMap[hx]=hy;break;}}}}
if(!raw.toolDurability||typeof raw.toolDurability!=='object')raw.toolDurability={};
if(!raw.chestData||typeof raw.chestData!=='object')raw.chestData={};
if(!raw.doorStates||typeof raw.doorStates!=='object')raw.doorStates={};
if(!Array.isArray(raw.droppedItems))raw.droppedItems=[];
if(typeof raw.weatherState!=='string')raw.weatherState='clear';
raw.weatherTimer=raw.weatherTimer||0;raw.weatherDuration=raw.weatherDuration||3000;raw.weatherIntensity=raw.weatherIntensity||0;raw.targetIntensity=raw.targetIntensity||0;
if(!raw.settings||typeof raw.settings!=='object'){raw.settings=getGlobalQualitySettings();}
else{raw.settings=normalizeQualitySettings(raw.settings);}
raw.timestamp=typeof raw.timestamp==='number'?raw.timestamp:Date.now();
raw.version=SAVE_VERSION;
raw.__repaired=!!raw.__repaired||true;
return raw;
}
function migrateSaveState(raw){
if(!raw||typeof raw!=='object')return null;
if(!raw.version){raw.version=1;raw.migratedFrom=raw.version;}
if(raw.version<2){
// older saves lacked hunger/fall metadata
if(!raw.player)raw.player={};
if(raw.player.hunger===undefined)raw.player.hunger=20;
if(raw.player.maxHunger===undefined)raw.player.maxHunger=20;
raw.version=2;
}
if(raw.version<SAVE_VERSION){
if(!raw.settings||typeof raw.settings!=='object'){raw.settings=getGlobalQualitySettings();}else{raw.settings=normalizeQualitySettings(raw.settings);}
raw.version=SAVE_VERSION;
raw.migrated=true;
}
return raw;
}
function repairSaveState(raw){
var migrated=migrateSaveState(raw);
return normalizeSaveState(migrated);
}
function getSaves(){
var raw=null;var parsed={};
try{raw=localStorage.getItem('r1mc_saves');}catch(e){raw=null;}
if(!raw)return {};
try{parsed=JSON.parse(raw);}catch(e){
try{localStorage.setItem('r1mc_saves_backup_corrupt',raw);}catch(_e){}
parsed={};
}
if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))parsed={};
// Repair per-slot and drop invalid.
var out={};
var keys=Object.keys(parsed);
for(var i=0;i<keys.length;i++){
var k=keys[i];var slot=parsed[k];
try{var repaired=repairSaveState(slot);if(repaired)out[sanitizeSaveName(k)]=repaired;}catch(e){ /* drop corrupt slot */ }
}
// Limit slots: keep newest.
var slotKeys=Object.keys(out);
if(slotKeys.length>SAVE_SLOTS_LIMIT){
slotKeys.sort(function(a,b){return (out[b].timestamp||0)-(out[a].timestamp||0);});
var trimmed={};
for(var i=0;i<SAVE_SLOTS_LIMIT;i++)trimmed[slotKeys[i]]=out[slotKeys[i]];
out=trimmed;
}
return out;
}
function repairSaveSlots(){
var saves=getSaves();
putSaves(saves);
return saves;
}
function putSaves(obj){
try{
if(!obj||typeof obj!=='object')obj={};
// validate and normalize
var clean={};
var keys=Object.keys(obj);
for(var i=0;i<keys.length;i++){var r=repairSaveState(obj[keys[i]]);if(r)clean[sanitizeSaveName(keys[i])]=r;}
var json=JSON.stringify(clean);
if(json.length>MAX_SAVE_BYTES){return false;}
localStorage.setItem('r1mc_saves',json);
return true;
}catch(e){return false;}
}
function saveGame(name){
try{
var saves=getSaves();
name=makeUniqueSaveName(name||('Save '+(Object.keys(saves).length+1)),saves);
var state={version:SAVE_VERSION,player:{x:player.x,y:player.y,vx:player.vx,vy:player.vy,hp:player.hp,maxHp:player.maxHp,hunger:player.hunger,maxHunger:player.maxHunger,hungerTimer:player.hungerTimer,air:player.air,selectedSlot:player.selectedSlot,dir:player.dir,flying:player.flying,fallDist:player.fallDist,lastY:player.lastY,onGround:player.onGround},inventory:JSON.parse(JSON.stringify(inventory)),world:world.map(function(col){return col.slice();}),gameMode:gameMode,camX:camX,camY:camY,dayTime:dayTime,dayLength:dayLength,isNight:isNight,cursorX:cursorX,cursorY:cursorY,entities:JSON.parse(JSON.stringify(entities)),heightMap:heightMap.slice(),toolDurability:JSON.parse(JSON.stringify(toolDurability)),chestData:JSON.parse(JSON.stringify(chestData||{})),doorStates:JSON.parse(JSON.stringify(doorStates||{})),droppedItems:JSON.parse(JSON.stringify(droppedItems||[])),weatherState:weatherState,weatherTimer:weatherTimer,weatherDuration:weatherDuration,weatherIntensity:weatherIntensity,targetIntensity:targetIntensity,timestamp:Date.now(),settings:getQualitySettings()};var repaired=repairSaveState(state);
saves[name]=repaired;
if(!putSaves(saves)){r1Toast('Save too large',1800);return false;}
r1Toast('Saved: '+name,1200);
return true;
}catch(e){r1Toast('Save failed',1800);return false;}
}
function loadGame(name){
try{
var saves=getSaves();
if(!saves[name])return false;
var s=repairSaveState(JSON.parse(JSON.stringify(saves[name])));
if(!s)return false;
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
if(s.heightMap){heightMap=s.heightMap.slice();}else{heightMap=[];for(var hx=0;hx<WORLD_W;hx++){for(var hy=0;hy<WORLD_H;hy++){if(world[hx][hy]!=BLOCKS.AIR&&world[hx][hy]!=BLOCKS.WATER){heightMap[hx]=hy;break;}}}}
toolDurability=s.toolDurability?JSON.parse(JSON.stringify(s.toolDurability)):{};
chestData=s.chestData?JSON.parse(JSON.stringify(s.chestData)):{};
doorStates=s.doorStates?JSON.parse(JSON.stringify(s.doorStates)):{};
droppedItems=s.droppedItems?JSON.parse(JSON.stringify(s.droppedItems)):[];
weatherState=s.weatherState||'clear';
weatherTimer=s.weatherTimer||0;
weatherDuration=s.weatherDuration||3000;
weatherIntensity=s.weatherIntensity||0;
targetIntensity=s.targetIntensity||0;
raindrops=[];
lightningFlash=0;
particles=[];
miningProgress=0;miningTarget={x:-1,y:-1};
if(s.settings&&typeof s.settings==='object'){
  try{applyQualityFields(s.settings);}catch(e){}
} else {
  try{loadQualitySettings();applyVisualModes();}catch(e){}
}
return true;
}catch(e){return false;}
}
function deleteSave(name){var saves=getSaves();if(!saves[name])return;delete saves[name];putSaves(saves);}
function openSaveScreen(){
if(gameState=='playing'){gameState='paused';}
document.getElementById('pause-menu').style.display='none';
var sc=document.getElementById('save-screen');sc.style.display='block';
document.getElementById('save-name-input').value='';
renderSaveSlots();
r1Vibrate(20);
}
function closeSaveScreen(){
document.getElementById('save-screen').style.display='none';
if(gameState=='paused'){document.getElementById('pause-menu').style.display='block';}
}
function doSaveGame(){
var inp=document.getElementById('save-name-input');var name=inp&&inp.value?inp.value:'';
if(!name)name='Save '+(Object.keys(getSaves()).length+1);
// Guard JSON: show existing?
if(saveGame(name)){closeSaveScreen();if(gameState=='paused'){resumeGame();}showGameMsg('Game saved: '+name);}
else{showGameMsg('Save failed (size?)');}
}

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
div.innerHTML='<span class="slot-name">'+k+'</span><span class="slot-delete" data-sname="'+k.replace(/'/g,"\\'")+'">X</span><br><span class="slot-info">'+s.gameMode+' | HP:'+Math.round(s.player.hp)+'/'+s.player.maxHp+' | '+ds+'</span>';
div.onclick=function(){doLoadGame(k);};div.ontouchend=function(e){e.preventDefault();doLoadGame(k);};
list.appendChild(div);})(keys[i]);}
}
function confirmDeleteSave(name){if(confirm('Delete save: '+name+'?')){deleteSave(name);renderLoadSlots();}}
// Event delegation for load screen delete buttons
document.addEventListener('click',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('slot-delete')){var name=e.target.getAttribute('data-sname');if(name)confirmDeleteSave(name);}});
function doLoadGame(name){
if(loadGame(name)){
document.getElementById('load-screen').style.display='none';
document.getElementById('title').style.display='none';
if(!canvas){canvas=document.getElementById('game');ctx=canvas.getContext('2d');}
gameState='playing';
document.getElementById('save-btn-hud').style.display='block';
lastTime=performance.now();
requestAnimationFrame(gameLoop);
showGameMsg('Loaded: '+name);
}
}

let gameLoopId = null;
let _currentMapName = "default";

// === R1 TOAST NOTIFICATIONS ===
function r1Toast(msg,dur){var t=document.getElementById('r1-toast');if(!t)return;t.textContent=msg;t.classList.add('show');toastHistory.push({msg:msg,time:Date.now()});if(toastHistory.length>toastHistoryLimit)toastHistory.shift();setTimeout(function(){t.classList.remove('show');},dur||1500);}
function getToastHistory(){return toastHistory.slice();}
// Compatibility aliases for tests/external integrations
function normalizeSave(s){return normalizeSaveState(s);}
function migrateSave(s){return migrateSaveState(s);}
function repairSave(s){return repairSaveState(s);}
function sanitizeSave(s){return sanitizeSaveName(s);}
function repairAllSaves(){return repairSaveSlots();}
function toolMismatch(bx,by){return isToolMismatch(bx,by);}
function toolMismatchMessage(bx,by){return getToolMismatchMessage(bx,by);}
function applyAccessibilityMode(){return toggleAccessibility();}
function clearToastHistory(){toastHistory=[];return true;}
var SETTINGS_STORAGE_KEY='r1mc_settings_v1';
function buildQualitySettings(){
  return {
    lowMotion:!!lowMotionMode,
    highContrast:!!highContrastMode,
    accessibility:!!accessibilityMode,
    cameraSmoothing:!!cameraSmoothingEnabled,
    controlSmoothing:!!controlSmoothing,
    smoothingEnabled:!!cameraSmoothingEnabled,
    soundEnabled:!!soundEnabled,
    audioMuted:!!soundMuted,
    muted:!!soundMuted,
    soundMuted:!!soundMuted,
    masterVolume:(typeof masterVolume==='number'?masterVolume:0.7),
    volume:(typeof masterVolume==='number'?masterVolume:0.7),
    soundVolume:(typeof masterVolume==='number'?masterVolume:0.7),
    audioQuality:audioQuality||'high',
    hudScale:(typeof hudScale==='number'?hudScale:1.0),
    particles:particlesEnabled!==false,
    particlesEnabled:particlesEnabled!==false
  };
}
function getQualitySettings(){return buildQualitySettings();}
function applyQualityFields(s){
  s=normalizeQualitySettings(s);
  if(!s||typeof s!=='object')return getQualitySettings();
  lowMotionMode=!!s.lowMotion;
  highContrastMode=!!s.highContrast;
  accessibilityMode=!!s.accessibility;
  cameraSmoothingEnabled=(s.cameraSmoothing!==false);
  controlSmoothing=(s.controlSmoothing!==false);
  soundEnabled=(s.soundEnabled!==false);
  soundMuted=!!s.audioMuted;
  if(s.audioMuted!==undefined) soundMuted=!!s.audioMuted;
  if(typeof s.masterVolume==='number') masterVolume=Math.max(0,Math.min(1,s.masterVolume));
  if(typeof s.soundVolume==='number') masterVolume=Math.max(0,Math.min(1,s.soundVolume));
  if(typeof s.volume==='number') masterVolume=Math.max(0,Math.min(1,s.volume));
  audioQuality=s.audioQuality||audioQuality;
  if(typeof s.hudScale==='number') hudScale=Math.max(0.8,Math.min(2,s.hudScale));
  particlesEnabled=(s.particles!==false);
  try{saveQualitySettings();}catch(e){}
  try{applyVisualModes();}catch(e){}
  try{applyAudioSettings();}catch(e){}
  return getQualitySettings();
}
function applyQualitySettings(s){return applyQualityFields(s);}
function applySaveSettings(s){return applyQualityFields(s&&s.settings?s.settings:s);}
function restoreSaveSettings(s){return applyQualityFields(s&&s.settings?s.settings:s);}
function loadQualitySettingsFromSave(s){if(!s||typeof s!=='object')return loadQualitySettings();if(s.settings&&typeof s.settings==='object')return applyQualityFields(s.settings);return applyQualityFields(s);}
function getSaveSettings(){return getQualitySettings();}
function normalizeQualitySettings(s){
  s=s&&typeof s==='object'?s:{};
  return {
    lowMotion:!!s.lowMotion,
    highContrast:!!s.highContrast,
    accessibility:!!s.accessibility,
    cameraSmoothing:s.cameraSmoothing!==false,
    controlSmoothing:s.controlSmoothing!==false,
    soundEnabled:s.soundEnabled!==false,
    audioMuted:!!s.audioMuted||!!s.muted||!!s.soundMuted,
    masterVolume:(typeof s.masterVolume==='number'?s.masterVolume:(typeof s.volume==='number'?s.volume:(typeof s.soundVolume==='number'?s.soundVolume:masterVolume))),
    audioQuality:s.audioQuality||audioQuality,
    hudScale:(typeof s.hudScale==='number'?s.hudScale:hudScale),
    particles:s.particles!==false
  };
}
function getGlobalQualitySettings(){
  try{
    var raw=localStorage.getItem(SETTINGS_STORAGE_KEY);
    if(raw){var s=JSON.parse(raw);if(s&&typeof s==='object')return normalizeQualitySettings(s);}
  }catch(e){}
  return normalizeQualitySettings(getQualitySettings());
}
function loadQualitySettings(){
  try{
    var raw=localStorage.getItem(SETTINGS_STORAGE_KEY);
    if(raw){
      var s=JSON.parse(raw);
      if(s&&typeof s==='object'){ applyQualityFields(s); }
    }
  }catch(e){}
  applyVisualModes();
  try{applyAudioSettings();}catch(e){}
  return getQualitySettings();
}
function saveQualitySettings(){
  try{localStorage.setItem(SETTINGS_STORAGE_KEY,JSON.stringify(getQualitySettings()));}catch(e){}
  return getQualitySettings();
}
var particlesEnabled=true;
function applyAudioSettings(){var btn=null;try{btn=document.getElementById('audio-mute-btn');}catch(e){}return getAudioSettings();}
function resetGlobalInputs(){
  keys.left=false;keys.right=false;keys.up=false;keys.down=false;
  touchState.active=false;touchState.moved=false;touchState.longPressed=false;touchState.joystickX=0;touchState.joystickY=0;
  touchActive=false;touchMoved=false;touchLongPressed=false;touchLongPressHandled=false;
  clearTouchLongPress();
  miningProgress=0;miningTarget={x:-1,y:-1};
  player.mining=0;player.mineX=-1;player.mineY=-1;
  autoCombatTarget=null;autoLockTarget=null;autoLockPulse=0;
  pointerCancelled=false;
  return true;
}
function toggleLowMotion(){lowMotionMode=!lowMotionMode;saveQualitySettings();applyVisualModes();r1Toast('Low motion: '+(lowMotionMode?'ON':'OFF'),1200);return lowMotionMode;}
function toggleHighContrast(){highContrastMode=!highContrastMode;saveQualitySettings();applyVisualModes();r1Toast('High contrast: '+(highContrastMode?'ON':'OFF'),1200);return highContrastMode;}
function toggleAccessibility(){accessibilityMode=!accessibilityMode;saveQualitySettings();applyVisualModes();r1Toast('Accessibility: '+(accessibilityMode?'ON':'OFF'),1200);return accessibilityMode;}
function toggleCameraSmoothing(){cameraSmoothingEnabled=!cameraSmoothingEnabled;controlSmoothing=cameraSmoothingEnabled;saveQualitySettings();r1Toast('Camera smoothing: '+(cameraSmoothingEnabled?'ON':'OFF'),1200);return cameraSmoothingEnabled;}
function toggleParticles(){particlesEnabled=!particlesEnabled;saveQualitySettings();r1Toast('Particles: '+(particlesEnabled?'ON':'OFF'),1200);return particlesEnabled;}
function setHudScale(v){hudScale=Math.max(0.8,Math.min(2,Number(v)||1));saveQualitySettings();return hudScale;}
function setQualityProfile(name){if(name==='low'){lowMotionMode=true;particlesEnabled=false;audioQuality='low';cameraSmoothingEnabled=false;}else if(name==='medium'){lowMotionMode=false;particlesEnabled=true;audioQuality='medium';cameraSmoothingEnabled=true;}else if(name==='high'){lowMotionMode=false;particlesEnabled=true;audioQuality='high';cameraSmoothingEnabled=true;}saveQualitySettings();applyVisualModes();return getQualitySettings();}
function applyQualityProfile(name){return setQualityProfile(name);}
function loadQualitySettingsForSave(s){return loadQualitySettingsFromSave(s);}
function applyVisualModes(){try{document.body.classList.toggle('high-contrast',highContrastMode);document.body.classList.toggle('low-motion',lowMotionMode);document.body.classList.toggle('accessibility',accessibilityMode);}catch(e){}}
function togglePause(){if(gameState=='playing'){pauseGame();}else if(gameState=='paused'){resumeGame();}else if(gameState=='title'){/* no-op */}}

// === VIBRATION FEEDBACK ===
function r1Vibrate(ms){try{if(navigator.vibrate)navigator.vibrate(ms||30);}catch(e){}}

// === CONTEXT-SENSITIVE ACTION PANEL ===
var CONTEXT_ACTIONS={
FOOD:{items:[115,116,125],action:eatFood,icon:'Eat',cls:'food'},
WEAPON:{items:[105,106,107,108],action:attackEntity,icon:'Atk',cls:'weapon'},
TOOL:{items:[101,102,103,104,109,110,117,118,119,120,121,122,126,131,132,133],action:repairTool,icon:'Fix',cls:'tool'},
PLACEABLE:{items:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,134],action:placeBlock,icon:'Place',cls:'block'},
THROWABLE:{items:[123],action:useSeeds,icon:'Plant',cls:'block'}
};
function updateContextPanel(){var panel=document.getElementById('r1-context-panel');if(!panel)return;if(gameState!='playing'){panel.innerHTML='';return;}var held=getHeldItem();panel.innerHTML='';panel.style.display='none';if(!held||held.id===0)return;var actions=[];for(var key in CONTEXT_ACTIONS){var a=CONTEXT_ACTIONS[key];if(a.items.indexOf(held.id)!==-1)actions.push(a);}if(actions.length===0&&held.id===17)actions.push({action:torchPlace,icon:'Torch',cls:'block'});if(actions.length===0)return;panel.style.display='flex';actions.forEach(function(a){var btn=document.createElement('div');btn.className='cbtn '+a.cls;btn.textContent=a.icon;btn.onclick=function(){a.action();};btn.ontouchend=function(e){e.preventDefault();a.action();};panel.appendChild(btn);});}
function repairTool(){var held=getHeldItem();if(!held||held.id<100)return;var tier=TOOL_TIER[held.id];if(!tier)return;var repairItem={'wood':5,'stone':12,'iron':111,'diamond':113}[tier];if(!repairItem){r1Toast('Cannot repair this');return;}
var slot=player.selectedSlot;var td=getToolDur(slot);if(!td){r1Toast('Tool not damaged');return;}
if(td.cur>=td.max){r1Toast('Tool at full durability');return;}
if(countItem(repairItem)<1){r1Toast('Need '+(BNAMES[repairItem]||INAMES[repairItem])+' to repair');return;}
removeItem(repairItem,1);td.cur=Math.min(td.max,td.cur+Math.floor(td.max*0.25));r1Toast('Repaired! '+td.cur+'/'+td.max);r1Vibrate(30);}
function showHelp(){document.getElementById('r1-help').style.display='flex';}
function closeHelp(){document.getElementById('r1-help').style.display='none';}
function torchPlace(){placeBlock();r1Vibrate(20);}
function useSeeds(){return placeBlock();}

var MOB_ARROW_HOSTILES=['zombie','skeleton','creeper','cave_spider','cave_skeleton'];
function isHostileMobType(t){return MOB_ARROW_HOSTILES.indexOf(t)>=0;}
function getMobArrowIndicators(){
  var out=[];
  if(!world||!world.length)return out;
  for(var i=0;i<entities.length;i++){
    var e=entities[i];if(!e)continue;
    if(!isHostileMobType(e.type))continue;
    var sx=e.x-camX, sy=e.y-camY;
    if(sx>=8&&sx<=W-8&&sy>=8&&sy<=H-8)continue; // on-screen: no arrow
    var cx=Math.max(8,Math.min(W-8,sx)), cy=Math.max(8,Math.min(H-8,sy));
    var angle=Math.atan2(sy-cy?0:sy-cy, sx-cx?0:sx-cx);
    // compute angle toward mob from clamped point not useful; use from screen center
    angle=Math.atan2(e.y-(camY+H/2), e.x-(camX+W/2));
    out.push({x:cx,y:cy,type:e.type,angle:angle,dist:Math.sqrt((player.x-e.x)*(player.x-e.x)+(player.y-e.y)*(player.y-e.y))});
  }
  return out;
}
function renderMobArrows(ctx2,camXArg,camYArg){
  if(!ctx2||gameState!=='playing')return;
  var oldAlpha=ctx2.globalAlpha;ctx2.globalAlpha=0.85;
  var arrows=getMobArrowIndicators();
  for(var i=0;i<arrows.length;i++){
    var a=arrows[i];
    ctx2.save();
    ctx2.translate(a.x,a.y);
    ctx2.rotate(a.angle);
    ctx2.fillStyle='#f33';
    ctx2.beginPath();
    ctx2.moveTo(6,0);ctx2.lineTo(-4,-3);ctx2.lineTo(-4,3);ctx2.closePath();
    ctx2.fill();
    ctx2.restore();
  }
  ctx2.globalAlpha=oldAlpha;
}
// === INVENTORY TOGGLE ===
function toggleInventory(){if(gameState=='inventory'){hideInventory();gameState='playing';}else if(gameState=='playing'){showInventory();gameState='inventory';}}
function showInventory(){var sc=document.getElementById('inv-fullscreen-screen');if(!sc){createInventoryScreen();sc=document.getElementById('inv-fullscreen-screen');}sc.style.display='flex';renderInventory();}
function hideInventory(){var sc=document.getElementById('inv-fullscreen-screen');if(sc)sc.style.display='none';}
function createInventoryScreen(){var d=document.createElement('div');d.id='inv-fullscreen-screen';d.style.cssText='position:absolute;top:0;left:0;width:240px;height:282px;background:rgba(0,0,0,0.92);z-index:70;display:none;flex-direction:column;padding:4px;color:#fff;font-family:monospace;';d.innerHTML='<h3 style="text-align:center;padding:4px;font-size:10px;color:#5c3;">Inventory</h3><div id="inv-grid" style="display:flex;flex-wrap:wrap;gap:1px;justify-content:center;"></div><div id="inv-selected-name" style="text-align:center;font-size:7px;color:#aaa;padding:2px;"></div><div class="menu-btn" style="margin-top:4px;" onclick="hideInventory()" ontouchend="event.preventDefault();hideInventory()">Close</div>';document.body.appendChild(d);}
function renderInventory(){var grid=document.getElementById('inv-grid');if(!grid)return;grid.innerHTML='';for(var i=0;i<36;i++){var item=inventory[i];var slot=document.createElement('div');slot.style.cssText='width:22px;height:22px;border:1px solid #555;background:rgba(40,40,40,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';if(item&&item.id>0){var ic=item.id<100?BCOLORS[item.id]||'#fff':ICOLORS[item.id]||'#fff';slot.innerHTML='<div style="width:12px;height:12px;background:'+ic+';margin-bottom:1px;"></div><span style="font-size:6px;color:#fff;">'+item.count+'</span>';}else{slot.innerHTML='<span style="font-size:6px;color:#333;">--</span>';}slot.onclick=function(idx){return function(){selectInventorySlot(idx);}}(i);slot.ontouchend=function(idx){return function(e){e.preventDefault();selectInventorySlot(idx);}}(i);grid.appendChild(slot);}
var selName=document.getElementById('inv-selected-name');if(selName){var held=getHeldItem();selName.textContent=held&&held.id>0?(held.id<100?BNAMES[held.id]||'Block':INAMES[held.id]||'Item'):'Empty';}
}
function selectInventorySlot(idx){
  if(idx<0||idx>=36)return;
  if(idx<9){player.selectedSlot=idx;r1Vibrate(10);renderInventory();return;}
  // Full-inventory slots (9+) can be moved into the hotbar so they are actually usable.
  var held=inventory[player.selectedSlot];
  var stack=inventory[idx];
  if(!stack||stack.id===0||stack.count<=0){r1Toast('Empty slot');renderInventory();return;}
  // Swap with current hotbar slot if it already holds something, otherwise move the stack.
  inventory[idx]=held?{id:held.id,count:held.count}:inventory[idx]={id:0,count:0};
  inventory[player.selectedSlot]=stack;
  if(TOOL_TIER[stack.id])initToolDur(player.selectedSlot,stack.id);
  r1Toast('Moved '+(stack.id<100?(BNAMES[stack.id]||'Block'):(INAMES[stack.id]||'Item'))+' to hotbar',1200);
  r1Vibrate(12);
  renderInventory();
  renderHUD();
}// Context panel updated each frame via gameLoop



function quitToMenu() {
  if (gameLoopId) { clearInterval(gameLoopId); gameLoopId = null; }
  ["save-screen","load-screen","craft-screen","map-select-screen","inv-fullscreen-screen"].forEach(function(id){ var e=document.getElementById(id); if(e) e.style.display="none"; });
  document.getElementById("title").style.display = "flex";
  document.getElementById("r1-hud").style.display = "none";
  document.getElementById("save-btn-hud").style.display = "none";
}

function saveAndQuit() {
  var name = _currentMapName || 'quicksave';
  saveGame(name);
  quitToMenu();
}

function showMapSelect() {
  var ms = document.getElementById("map-select-screen");
  ms.style.display = "flex";
  var list = ms.querySelector(".map-list");
  list.innerHTML = "";
  var maps = JSON.parse(localStorage.getItem("mc_maps") || "[]");
  maps.forEach(function(name) {
    var btn = document.createElement("div");
    btn.className = "menu-btn";
    btn.textContent = name;
    btn.onclick = function(){ _currentMapName = name; loadMap(name); ms.style.display="none"; };
    btn.ontouchend = function(e){ e.preventDefault(); _currentMapName = name; loadMap(name); ms.style.display="none"; };
    list.appendChild(btn);
  });
}

function createNewMap() {
  var name = "Map_" + Date.now();
  _currentMapName = name;
  var maps = JSON.parse(localStorage.getItem("mc_maps") || "[]");
  if (maps.indexOf(name) === -1) { maps.push(name); localStorage.setItem("mc_maps", JSON.stringify(maps)); }
  generateWorld();
  document.getElementById("map-select-screen").style.display = "none";
  document.getElementById("title").style.display = "none";
  if (gameLoopId) clearInterval(gameLoopId);
  gameState='playing';
  if (!canvas) { canvas=document.getElementById('game'); ctx=canvas.getContext('2d'); }
  lastTime=performance.now();
  requestAnimationFrame(gameLoop);
}

function loadMap(name) {
  var data = localStorage.getItem("mc_map_" + name);
  if (data) {
    var save = JSON.parse(data);
    if (save.world) world = save.world;
    if (save.player) { for(var k in save.player) player[k]=save.player[k]; }
    if (save.inventory) inventory = save.inventory;
  }
  document.getElementById("title").style.display = "none";
  document.getElementById("map-select-screen").style.display = "none";
  if (gameLoopId) clearInterval(gameLoopId);
  gameState='playing';
  if (!canvas) { canvas=document.getElementById('game'); ctx=canvas.getContext('2d'); }
  lastTime=performance.now();
  requestAnimationFrame(gameLoop);
}
try{loadQualitySettings();}catch(e){}
try{loadCraftingFavorites();}catch(e){}
try{resetGlobalInputs();}catch(e){}
