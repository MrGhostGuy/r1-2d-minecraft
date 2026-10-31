const fs=require('fs');
const vm=require('vm');

function makeCtx(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282},createRadialGradient(){return {addColorStop(){}};},shadowBlur:0,shadowColor:''};}

function makeEl(){return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return makeCtx();},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();}};}

function getEl(id){if(!els[id]){const e=makeEl();e.id=id;els[id]=e;}return els[id];}
const els={};
const document={getElementById(id){return getEl(id);},createElement(){return makeEl();},body:{appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}}},addEventListener(){},querySelector(){return makeEl();}};
const canvas=getEl('game');const ctx=canvas.getContext('2d');
const store={};
const localStorage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];},clear(){for(const kk in store)delete store[kk];}};
function AudioContextCtor(){this.createOscillator=function(){return {connect(){return this;},setValueAtTime(){},exponentialRampToValueAtTime(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:1}};};this.createGain=this.createOscillator;this.destination={};this.currentTime=0;}
const windowObj={performance:{now(){return Date.now();}},AudioContext:AudioContextCtor,webkitAudioContext:AudioContextCtor,innerWidth:240,innerHeight:282,addEventListener(){},localStorage,matchMedia(){return {matches:false};}};
const sandbox={console,document,window:windowObj,localStorage,canvas,ctx,performance:windowObj.performance,requestAnimationFrame(){},cancelAnimationFrame(){},Date,Math,Array,Object,JSON,setTimeout(fn,t){return 0;},clearTimeout(){},navigator:{vibrate(){return true;}},AudioContext:AudioContextCtor};
windowObj.document=document;
vm.createContext(sandbox);
const code=fs.readFileSync('game.js','utf8');
vm.runInContext(code,sandbox,{filename:'game.js'});

let pass=0,fail=0;
function assert(name,cond){if(cond){pass++;console.log('PASS:',name);}else{fail++;console.log('FAIL:',name);}}

sandbox.gameMode='survival';
sandbox.gameState='playing';
sandbox.generateWorld();

// extraction helpers
assert('clampCameraAxis', sandbox.clampCameraAxis(-5,10,100)===0 && sandbox.clampCameraAxis(200,10,100)===90);
assert('computeCameraAxis', typeof sandbox.computeCameraAxis(sandbox.player.x,80,128*8)==='number');
assert('camera fallback bool', typeof sandbox.cameraLowMotionFallback()==='boolean');
assert('sky color string', typeof sandbox.getSkyColor()==='string');
assert('star positions', sandbox.getStarPositions(12).length===12);
assert('renderStars safe', (sandbox.renderStars(ctx,true,Date.now()), true));
assert('drawTileShading safe', (sandbox.drawTileShading(ctx,0,0,8), true));
assert('drawWoodBark safe', (sandbox.drawWoodBark(ctx,0,0,8), true));
assert('drawOreCracks safe', (sandbox.drawOreCracks(ctx,0,0,8), true));
assert('drawCropGrowth safe', (sandbox.drawCropGrowth(ctx,sandbox.BLOCKS.WHEAT3,0,0,8), true));
assert('drawEntityShading safe', (sandbox.drawEntityShading(ctx,0,0,6,8), true));
assert('atmosphere safe', (sandbox.renderAtmosphereBackground(ctx,0,0,1), true));
assert('compass safe', (sandbox.renderCompass(ctx,0,0), true));
assert('torch glow number', typeof sandbox.getTorchGlow(5,5)==='number');
assert('createRadialHole safe', (sandbox.createRadialHole(ctx,4,4,12), true));
assert('lighting overlay safe', (sandbox.applyLightingOverlay(ctx,true,0.2), true));

// render path should not throw in VM
let renderOk=true;
try { sandbox.render(); } catch(e){ renderOk=false; console.log('RENDERFAIL', e&&e.stack); }
assert('render safe', renderOk);
let weatherOk=true;
try { sandbox.updateWeather(); sandbox.renderWeather(); } catch(e){ weatherOk=false; console.log('WEATHERFAIL', e&&e.stack); }
assert('weather render safe', weatherOk);
let hudOk=true;
try { sandbox.renderHUD(); } catch(e){ hudOk=false; console.log('HUDFAIL', e&&e.stack); }
assert('hud render safe', hudOk);

// HUD color helpers
assert('heart color', sandbox.getHeartColor(true)===sandbox.getHeartColor(true));
assert('hunger color', typeof sandbox.getHungerColor(false)==='string');
assert('inv slot style', typeof sandbox.getInvSlotStyle(true,false)==='object');

// camera helpers / zoom
assert('stabilize camera', typeof sandbox.stabilizeCamera(100,100,2)==='object');
assert('compute camera', typeof sandbox.computeCamera(100,100,1.5)==='object');
assert('camera getters', typeof sandbox.getCameraPosition()==='object');

// sky/weather
assert('sky phase', typeof sandbox.getSkyColor(0.5)==='string');
assert('isNightTime bool', typeof sandbox.isNightTime(0.1)==='boolean');
assert('weather intensity', typeof sandbox.getWeatherIntensity()==='number');
assert('raindrop count', typeof sandbox.getRaindropCount()==='number');
assert('lightning flash', typeof sandbox.getLightningFlash()==='number');
assert('wind? getCompassHeading', sandbox.getCompassHeading()==='N');

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);
