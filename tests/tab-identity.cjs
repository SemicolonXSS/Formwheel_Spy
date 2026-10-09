const {readFileSync}=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=readFileSync(require('node:path').join(__dirname,'../assets/app.js'),'utf8');
const code=s.slice(s.indexOf('let playerIdPromise;'),s.indexOf('function allWords'));
const locks=new Set();let seq=0;
function tab(saved){
 const data=new Map(saved);
 const ctx={sessionStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},crypto:{randomUUID:()=>String(++seq)},navigator:{locks:{request:async(name,options,cb)=>{const lock=locks.has(name)?null:{};if(lock)locks.add(name);return cb(lock)}}}};
 vm.createContext(ctx);vm.runInContext(code,ctx);return {ctx,data};
}
(async()=>{
 const a=tab(),b=tab();const aid=await a.ctx.getId(),bid=await b.ctx.getId();assert.notEqual(aid,bid);
 assert.equal(await a.ctx.getId(),aid);
 const duplicate=tab(a.data);assert.notEqual(await duplicate.ctx.getId(),aid);
 locks.delete('formwheel-spy-player:'+aid);
 const reload=tab(a.data);assert.equal(await reload.ctx.getId(),aid);
 console.log('PASS separate tabs, repeated calls, duplicated tab, reload identity');
})().catch(e=>{console.error(e);process.exitCode=1});
