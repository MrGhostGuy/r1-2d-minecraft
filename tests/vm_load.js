const fs=require('fs');
const vm=require('vm');

function makeEl(){return {style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){},contains(){return false;}},addEventListener(){},appendChild(){},getContext(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282}};},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};}};}

const document={
  getElementById(){return makeEl();},
  createElement(){return makeEl();},
  body:{appendChild(){}},
  addEventListener(){},
  querySelector(){return makeEl();}
};
const canvas=makeEl();
const localStorage=(function(){let store={};return{getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];},clear(){store={};}};})();
const ctx=canvas.getContext('2d');
const windowObj={performance:{now(){return Date.now();}},AudioContext:function(){},webkitAudioContext:function(){},innerWidth:240,innerHeight:282,addEventListener(){},localStorage};
const sandbox={
  console,
  document,
  window:windowObj,
  localStorage,
  canvas,
  ctx,
  performance:windowObj.performance,
  requestAnimationFrame(){},
  cancelAnimationFrame(){},
  Date,
  Math,
  Array,
  Object,
  JSON,
  setTimeout(fn,t){return 0;},
  clearTimeout(){},
  navigator:{vibrate(){return true;}},
  AudioContext:windowObj.AudioContext
};
windowObj.document=document;
vm.createContext(sandbox);
const code=fs.readFileSync('game.js','utf8');
try {
  vm.runInContext(code,sandbox,{filename:'game.js'});
  console.log('LOADED OK');
  console.log('typeof saveGame:',typeof sandbox.saveGame);
  console.log('typeof loadGame:',typeof sandbox.loadGame);
  console.log('typeof togglePause:',typeof sandbox.togglePause);
  console.log('typeof resumeGame:',typeof sandbox.resumeGame);
  console.log('state:',sandbox.gameState);
} catch(e) {
  console.log('ERROR:',e&&e.stack?e.stack:e);
}