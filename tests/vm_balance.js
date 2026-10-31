const fs=require('fs');
const vm=require('vm');

function makeEl(){return {id:'',value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){return true;},contains(){return false;}},children:[],appendChild(e){this.children.push(e);},getContext(){return {save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fillText(){},measureText(){return{width:0};},drawImage(){},setLineDash(){},fillStyle:'',strokeStyle:'',lineWidth:1,font:'',textAlign:'left',globalAlpha:1,canvas:{width:240,height:282}};},getBoundingClientRect(){return{x:0,y:0,width:240,height:282};},addEventListener(){},querySelector(){return makeEl();}};}
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
function assert(name,cond){if(cond){pass++;console.log('PASS:',name);}else{fail++;console.log('FAIL:',name);}console.log('  ->',name,cond);}

// Combat formula determinism
assert('sword dmg wood', sandbox.getSwordDamage(105)===4);
assert('sword dmg diamond', sandbox.getSwordDamage(108)===8);
assert('combatDamage alias', sandbox.combatDamage(107)===6);
assert('sword reach iron', Math.abs(sandbox.getSwordReachBlocks(107)-1.6)<0.0001);
assert('attack cooldown', sandbox.getAttackCooldownMs()<=350);
assert('in range true', sandbox.isInAttackRange(1,1,1.5)===true);
assert('in range false', sandbox.isInAttackRange(2,0,1.5)===false);
assert('knockback', sandbox.computeKnockbackForSword(108)>sandbox.computeKnockbackForSword(105));

// Spawn rules
const ents=[];
assert('night count 0', sandbox.countNightEnemies(ents)===0);
ents.push({type:'zombie'},{type:'sheep'},{type:'creeper'});
assert('night count 2', sandbox.countNightEnemies(ents)===2);
assert('spawn not night false', sandbox.isNightMobSpawnAllowed({isNight:false,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:1,chance:1,protectedNearby:false})===false);
assert('spawn protected false', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:1,chance:1,protectedNearby:true})===false);
assert('spawn roof false', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:false,cooldown:0,rngRoll:1,chance:1,protectedNearby:false})===false);
assert('spawn too many false', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:2,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:1,chance:1,protectedNearby:false})===false);
assert('spawn ok', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:1,chance:1,protectedNearby:false})===true);
assert('cooldown false', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:5,rngRoll:1,chance:1,protectedNearby:false})===false);
assert('rng chance false', sandbox.isNightMobSpawnAllowed({isNight:true,nightEnemyCount:0,maxNight:2,totalEntities:0,maxTotal:7,sheltered:false,onSurfaceExposed:true,cooldown:0,rngRoll:0.5,chance:0.2})===false);

// distance
assert('distance2D', Math.abs(sandbox.distance2D(0,0,3,4)-5)<0.0001);

// crafting hint
sandbox.inventory=[];for(var i=0;i<36;i++)sandbox.inventory.push({id:0,count:0});
sandbox.addItem(11,5);
var rec={inp:[[11,4]],out:100,cnt:4,name:'Sticks'};
assert('can craft recipe', sandbox.canCraftRecipe(rec)===true);
var rec2={inp:[[11,10]],out:100,cnt:4,name:'Sticks'};
assert('cannot craft recipe', sandbox.canCraftRecipe(rec2)===false);
assert('hint string', typeof sandbox.getRecipeUnlockHint(rec2)==='string' && sandbox.getRecipeUnlockHint(rec2).indexOf('Missing')>=0);

console.log('\nRESULT:',pass,'passed,',fail,'failed');
if(fail>0)process.exit(1);