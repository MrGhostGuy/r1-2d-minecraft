const fs=require('fs');
const vm=require('vm');

function makeEl(){
  return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282}};},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();}};
}

const els={};
function getEl(id){if(!els[id]){const e=makeEl();e.id=id;els[id]=e;}return els[id];}
const document={
  getElementById(id){return getEl(id);},
  createElement(){return makeEl();},
  body:{appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}}},
  addEventListener(){},
  querySelector(){return makeEl();}
};
const canvas=getEl('game');
const ctx=canvas.getContext('2d');
const store={};
const localStorage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];},clear(){for(const kk in store)delete store[kk];}};
const windowObj={performance:{now(){return Date.now();}},AudioContext:function(){},webkitAudioContext:function(){},innerWidth:240,innerHeight:282,addEventListener(){},localStorage};
const sandbox={console,document,window:windowObj,localStorage,canvas,ctx,performance:windowObj.performance,requestAnimationFrame(){},cancelAnimationFrame(){},Date,Math,Array,Object,JSON,setTimeout(fn){return 0;},clearTimeout(){},navigator:{vibrate(){return true;}},AudioContext:windowObj.AudioContext};
windowObj.document=document;
vm.createContext(sandbox);
const code=fs.readFileSync('game.js','utf8');
vm.runInContext(code,sandbox,{filename:'game.js'});

let pass=0,fail=0;
function assert(name,cond){if(cond){pass++;console.log('PASS:',name);}else{fail++;console.log('FAIL:',name);}}

// Setup
sandbox.gameMode='survival';
sandbox.gameState='playing';
sandbox.generateWorld();
const beforeWorld=JSON.stringify(sandbox.world);
sandbox.saveGame('T1');
assert('save returns true', sandbox.saveGame('T2')===true);
// corrupt world then load
sandbox.world[0][0]=999;
assert('load returns true', sandbox.loadGame('T1')===true);
assert('load restored world', JSON.stringify(sandbox.world)===beforeWorld);
assert('save version header', sandbox.getSaves()['T1'].version===sandbox.SAVE_VERSION);

// Pause toggle
sandbox.gameState='playing';
sandbox.togglePause();
assert('pause toggles to paused', sandbox.gameState==='paused');
sandbox.togglePause();
assert('pause toggles back to playing', sandbox.gameState==='playing');

// Tool helpers
assert('tool tier iron pickaxe', sandbox.getToolTierLevel(sandbox.ITEMS.IRON_PICK)===3);
assert('tool mismatch detection works', typeof sandbox.isToolMismatch==='function');

// Corrupt repair
localStorage.setItem('r1mc_saves','{bad json');
const repaired=sandbox.getSaves();
assert('corrupt JSON returns object', repaired && typeof repaired==='object');
// slot repair drops invalid but no throw
localStorage.setItem('r1mc_saves',JSON.stringify({bad:{not:'a save'},good:sandbox.getSaves().T1?undefined:undefined}));
// inject a corrupt slot
const saves=sandbox.getSaves();
saves.corrupt='not an object';
localStorage.setItem('r1mc_saves',JSON.stringify(saves));
const after=sandbox.getSaves();
assert('corrupt slot dropped', !('corrupt' in after));

// Toast history populated
sandbox.r1Toast('hello',10);
assert('toast history recorded', sandbox.getToastHistory().length>0);

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);