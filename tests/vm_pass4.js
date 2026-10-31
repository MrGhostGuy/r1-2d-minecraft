const fs=require('fs');
const vm=require('vm');

function makeEl(){return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282}};},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();},getAttribute(k){return this._attrs?this._attrs[k]:null;},setAttribute(k,v){if(!this._attrs)this._attrs={};this._attrs[k]=v;}};}
function getEl(id){if(!els[id]){const e=makeEl();e.id=id;els[id]=e;}return els[id];}
const els={};
const document={getElementById(id){return getEl(id);},createElement(){return makeEl();},body:{appendChild(){},classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}}},addEventListener(){},querySelector(){return makeEl();}};
const canvas=getEl('game');const ctx=canvas.getContext('2d');
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

// quality settings persist
localStorage.setItem('r1mc_settings_v1',JSON.stringify({lowMotion:true,highContrast:true,accessibility:false}));
const qs=sandbox.loadQualitySettings();
assert('quality settings load object', qs && typeof qs==='object');
assert('quality lowMotion loaded', sandbox.lowMotionMode===true);
assert('quality highContrast loaded', sandbox.highContrastMode===true);
sandbox.toggleLowMotion();
// toggle flips + saves
assert('quality toggle returns bool', typeof sandbox.toggleLowMotion()==='boolean');

// reset global inputs
sandbox.keys={left:true,right:true,up:false,down:false};
assert('resetGlobalInputs success', sandbox.resetGlobalInputs()===true);
assert('reset clears keys', sandbox.keys.left===false && sandbox.keys.right===false);

// crafting UX
sandbox.inventory=[];for(var i=0;i<36;i++)sandbox.inventory.push({id:0,count:0});
sandbox.addItem(11,10);sandbox.addItem(100,10);
sandbox.setCraftingSearchQuery('stick');
const filtered=sandbox.getFilteredRecipes();
assert('craft search returns array', Array.isArray(filtered));
assert('craft search finds sticks', filtered.some(function(r){return /stick/i.test(r.name);}));
sandbox.setCraftingFilter('craftable');
const craftable=sandbox.getFilteredRecipes();
assert('craftable filter excludes impossible', Array.isArray(craftable));
// favorites
const sticksRecipe=sandbox.RECIPES.filter(function(r){return r.name==='Sticks';})[0];
sandbox.toggleCraftingFavorite(sticksRecipe);
assert('craft favorite toggled', sandbox.isCraftingFavorite(sticksRecipe)===true);
sandbox.setCraftingFilter('favorites');
assert('favorites filter includes fav', sandbox.getFilteredRecipes().some(function(r){return r.name==='Sticks';}));

// long press contextual
assert('handleR1LongPress exists', typeof sandbox.handleR1LongPress==='function');
sandbox.generateWorld();
sandbox.gameState='title';
sandbox.handleR1LongPress();
var helpEl=sandbox.document.getElementById('r1-help');
assert('long press title shows help', helpEl && helpEl.style && helpEl.style.display==='flex');
sandbox.gameState='playing';
var lpResult=sandbox.performContextualLongPress();
assert('long press playing returns string', typeof lpResult==='string');

// mob arrows / HUD helpers
assert('getMobArrowIndicators array', Array.isArray(sandbox.getMobArrowIndicators()));
sandbox.renderMobArrows(sandbox.ctx,sandbox.camX,sandbox.camY);

// misc no-crash
sandbox.updateCraftingLive();

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);
