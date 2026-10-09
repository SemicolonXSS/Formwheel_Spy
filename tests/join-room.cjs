const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/app.js'),'utf8');
const join=source.slice(source.indexOf('let joiningRoom=false;'),source.indexOf('async function startGame(){'));
async function run(data,{cold=false,error=false}={}){
 const alerts=[];let attached=0,phase,server=structuredClone(data);
 const ctx={document:{getElementById:id=>({value:id==='joinName'?'Guest':'ABC123'})},getId:()=> 'guest',firebase:{database:{ServerValue:{TIMESTAMP:123}}},alert:s=>alerts.push(s),console:{error(){}},history:{replaceState(){}},attachRoom(){attached++},applyRoomState(){phase=ctx.roomData.phase},db:{ref:()=>({async transaction(update){
  if(error)throw {code:'PERMISSION_DENIED'};
  if(cold)assert.equal(update(null),null,'cold cache must not abort');
  const next=update(structuredClone(server));
  if(next!==undefined)server=next;
  return {committed:next!==undefined,snapshot:{val:()=>server}};
 }})}};
 vm.createContext(ctx);vm.runInContext(join,ctx);await ctx.joinRoom();return {alerts,attached,phase,server};
}
(async()=>{
 const lobby={phase:'lobby',hostId:'host',players:{host:{id:'host',name:'Host'}}};
 let r=await run(lobby,{cold:true});assert.equal(r.attached,1);assert.equal(r.server.players.guest.name,'Guest');
 r=await run(null,{cold:true});assert.match(r.alerts[0],/찾을 수/);assert.equal(r.attached,0);
 r=await run({...lobby,phase:'question'});assert.match(r.alerts[0],/이미 시작/);assert.equal(r.server.players.guest,undefined);
 const full={...lobby,players:Object.fromEntries(Array.from({length:20},(_,i)=>['p'+i,{id:'p'+i}]))};
 r=await run(full);assert.match(r.alerts[0],/가득/);
 for(const phase of ['lobby','question','voting','guess','result']){
  r=await run({...full,phase,players:{...full.players,guest:{id:'guest',name:'Original',joinedAt:42}}});
  assert.equal(r.attached,1);assert.equal(r.phase,phase);assert.equal(r.server.players.guest.joinedAt,42);
 }
 r=await run(lobby,{error:true});assert.match(r.alerts[0],/권한/);assert.equal(r.attached,0);
 console.log('PASS cold cache, missing room, active room, capacity, existing-player reentry (5 phases), permission error');
})().catch(e=>{console.error(e);process.exitCode=1});
