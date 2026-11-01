const fs=require('fs');
const vm=require('vm');

function makeCtx(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282},createRadialGradient(){return {addColorStop(){}};},shadowBlur:0,shadowColor:''};}
function makeEl(){return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return makeCtx();},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();}}}
function getEl(id){if(!els[id]){const e=makeEl();e.id=id;els[id]=e;}return els[id];}
const els={};
const document={getElementById:id=>getEl(id),createElement(){return makeEl();},body:{appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}}},addEventListener(){},querySelector(){return makeEl();}};
const canvas=getEl('game');const ctx=canvas.getContext('2d');
const store={};
const localStorage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];},clear(){for(const kk in store)delete store[kk];}};
function AudioContextCtor(){this.createOscillator=function(){return {connect(){return this;},setValueAtTime(){},exponentialRampToValueAtTime(){},start(){},stop(){},frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:1}};};this.createGain=this.createOscillator;this.destination={};this.currentTime=0;}
const windowObj={performance:{now(){return Date.now();}},AudioContext:AudioContextCtor,webkitAudioContext:AudioContextCtor,innerWidth:240,innerHeight:282,addEventListener(){},localStorage,matchMedia(){return {matches:false};}};
const elsVOld=document;document=getEl;document.getElementById(id){return getEl(id);};document.createElement(){return makeEl();}document.getElementById(id){return getEl(id);}document.createElement(){return makeEl();}document.body={appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}};document.addEventListener(){},querySelector(){return makeEl();}};
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

// === visual pass 8 assertions ===
// 1. Torch glow must be detectable (>0) for at least one sample location
assert('torch glow presence >0', sandbox.getTorchGlow(5,5) > 0);

// 2. Rain streaks must be rendered each simulation step without throwing
assert('rain streak rendering runs', (function(){
  try{
    sandbox.updateWeather();
    sandbox.renderWeather();
    return true;
  }catch(e){
    return false;
  }
})());

// 3. Dust particles must exist after a few frames (count > 0)
assert('dust particles existing', (function(){
  // Simulate a few ticks to trigger ambient particle spawn
  for(let i=0;i<10;i++){
    sandbox.updateDayNight();
    if(sandbox.particles && sandbox.particles.length>0) return true;
  }
  return sandbox.particles && sandbox.particles.length>0;
})());

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);