const fs=require('fs');
const vm=require('vm');

function makeAudioNode(){const n={connect(){return n;},setValueAtTime(){},exponentialRampToValueAtTime(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:1}};return n;}
function makeCtx(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282}};}

function makeEl(){return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return makeCtx();},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();},getAttribute(k){return this._attrs?this._attrs[k]:null;},setAttribute(k,v){if(!this._attrs)this._attrs={};this._attrs[k]=v;}};}

function getEl(id){if(!els[id]){const e=makeEl();e.id=id;els[id]=e;}return els[id];}
const els={};
const document={getElementById(id){return getEl(id);},createElement(){return makeEl();},body:{appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}}},addEventListener(){},querySelector(){return makeEl();}};
const canvas=getEl('game');const ctx=canvas.getContext('2d');
const store={};
const localStorage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];},clear(){for(const kk in store)delete store[kk];}};
function AudioContextCtor(){this.createOscillator=makeAudioNode;this.createGain=makeAudioNode;this.destination={};this.currentTime=0;}
const windowObj={performance:{now(){return Date.now();}},AudioContext:AudioContextCtor,webkitAudioContext:AudioContextCtor,innerWidth:240,innerHeight:282,addEventListener(){},localStorage};
const sandbox={console,document,window:windowObj,localStorage,canvas,ctx,performance:windowObj.performance,requestAnimationFrame(){},cancelAnimationFrame(){},Date,Math,Array,Object,JSON,setTimeout(fn,t){return 0;},clearTimeout(){},navigator:{vibrate(){return true;}},AudioContext:AudioContextCtor};
windowObj.document=document;
vm.createContext(sandbox);
const code=fs.readFileSync('game.js','utf8');
vm.runInContext(code,sandbox,{filename:'game.js'});

let pass=0,fail=0;
function assert(name,cond){if(cond){pass++;console.log('PASS:',name);}else{fail++;console.log('FAIL:',name);}}

// audio init + helpers
sandbox.initAudio();
assert('audioCtx created', !!sandbox.audioCtx);
assert('toggleMute exists', typeof sandbox.toggleMute==='function');
sandbox.masterVolume=0.5;sandbox.soundMuted=false;sandbox.soundEnabled=true;
assert('getAudioVolume respects volume', sandbox.getAudioVolume()>0);
const mutedBefore=sandbox.toggleMute();
assert('toggleMute returns boolean', typeof mutedBefore==='boolean');
assert('audio muted state', sandbox.isMuted()===true||sandbox.audioMutedState()===true);
sandbox.toggleMute();
assert('toggleMute toggles back', !sandbox.isMuted());
sandbox.soundMuted=false;sandbox.soundEnabled=true;
sandbox.masterVolume=0.2;
assert('setMasterVolume', sandbox.setMasterVolume(0.4)===0.4);
assert('volumeUp', (sandbox.volumeUp(0.1), sandbox.masterVolume>0.4));
assert('mute/unmute', sandbox.mute()===true && sandbox.unmute()===true);
assert('soundEnabled after unmute', sandbox.isSoundEnabled()===true);
// playSound branches
const soundTypes=['break','place','hit','eat','explode','levelup','attack','hurt','pickup','craft','error','jump','thunder','step'];
let soundOk=true;
for(var i=0;i<soundTypes.length;i++){try{sandbox.playSound(soundTypes[i]);}catch(e){soundOk=false;console.log('SOUNDFAIL',soundTypes[i],e&&e.message);}}
assert('all playSound branches safe', soundOk);
// muted playSound does not throw
sandbox.soundMuted=true; sandbox.masterVolume=0;
try{sandbox.playSound('place'); soundOk=true;}catch(e){soundOk=false;}
assert('muted playSound safe', soundOk);
sandbox.soundMuted=false; sandbox.masterVolume=0.7;

// per-save quality settings
localStorage.setItem('r1mc_settings_v1', JSON.stringify({lowMotion:true,highContrast:false,accessibility:true,cameraSmoothing:false,soundEnabled:false,audioMuted:true,masterVolume:0.3,audioQuality:'low',hudScale:1.25,particles:false}));
const qs=sandbox.loadQualitySettings();
assert('loadQualitySettings object', qs&&typeof qs==='object');
assert('quality audioMuted loaded', sandbox.soundMuted===true);
assert('quality volume loaded', Math.abs(sandbox.masterVolume-0.3)<0.001);
assert('quality cameraSmoothing loaded', sandbox.cameraSmoothingEnabled===false);
assert('quality hudScale loaded', Math.abs(sandbox.hudScale-1.25)<0.001);
const gqs=sandbox.getGlobalQualitySettings();
assert('getGlobalQualitySettings object', gqs&&typeof gqs==='object');
assert('global quality normalized masterVolume', typeof gqs.masterVolume==='number');

// save/load per-save settings
sandbox.gameMode='survival';
sandbox.gameState='playing';
sandbox.generateWorld();
sandbox.soundMuted=false;sandbox.masterVolume=0.6;sandbox.audioQuality='high';sandbox.cameraSmoothingEnabled=true;sandbox.particlesEnabled=true;sandbox.hudScale=1.1;
sandbox.saveGame('QSave');
const saves=sandbox.getSaves();
assert('save has settings', !!saves['QSave'] && !!saves['QSave'].settings);
// mutate runtime then load
sandbox.soundMuted=true;sandbox.masterVolume=0.1;sandbox.audioQuality='low';
assert('loadGame returns true', sandbox.loadGame('QSave')===true);
assert('load restores volume', Math.abs(sandbox.masterVolume-0.6)<0.001);
assert('load restores audioQuality', sandbox.audioQuality==='high');
assert('load restores cameraSmoothing', sandbox.cameraSmoothingEnabled===true);
assert('settings aliases', typeof sandbox.loadQualitySettingsForSave==='function');

// dedicated placement functions
assert('dedicatedLongPressPlacement exists', typeof sandbox.dedicatedLongPressPlacement==='function');
sandbox.generateWorld();
sandbox.gameState='playing';
sandbox.inventory=[];for(var i=0;i<36;i++)sandbox.inventory.push({id:0,count:0});
sandbox.inventory[0]={id:2,count:5};sandbox.player.selectedSlot=0;
const dlp= sandbox.dedicatedLongPressPlacement();
assert('dedicated placement returns string', typeof dlp==='string');
// aliases
assert('performDedicatedLongPress alias', typeof sandbox.performDedicatedLongPress==='function');
assert('performLongPressPlacement alias', typeof sandbox.performLongPressPlacement==='function');
assert('longPressPlacement alias', typeof sandbox.longPressPlacement==='function');

// context long press remains
const clp=sandbox.performContextualLongPress();
assert('contextual long press string', typeof clp==='string');

// toggle helpers
assert('toggleCameraSmoothing bool', typeof sandbox.toggleCameraSmoothing()==='boolean');
assert('toggleParticles bool', typeof sandbox.toggleParticles()==='boolean');
assert('setHudScale', sandbox.setHudScale(1.25)===1.25);
assert('setQualityProfile', typeof sandbox.setQualityProfile('high')==='object');

// reset inputs persists
sandbox.keys={left:true,right:true,up:true,down:true};
assert('resetGlobalInputs', sandbox.resetGlobalInputs()===true);
assert('resetGlobalInputs cleared', sandbox.keys.left===false && sandbox.keys.right===false && sandbox.keys.up===false && sandbox.keys.down===false);

// mob indicators no crash
sandbox.generateWorld(); sandbox.entities=[{type:'zombie',x:5,y:5,hp:10},{type:'sheep',x:6,y:6,hp:5}];
assert('getMobArrowIndicators array', Array.isArray(sandbox.getMobArrowIndicators()));

// per-save settings migration (old save)
var oldSave={version:1,player:{hp:10},world:sandbox.world,gameMode:'survival',inventory:sandbox.inventory,entities:[],timestamp:1};
var repaired=sandbox.repairSaveState(oldSave);
assert('old save settings filled', !!(repaired&&repaired.settings));
assert('old save version bumped', repaired.version===sandbox.SAVE_VERSION);

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);