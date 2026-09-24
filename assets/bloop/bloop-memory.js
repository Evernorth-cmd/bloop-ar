(()=>{"use strict";
const DB="bloop-memory-v1",STORE="memories";let dbPromise=null,modelPromise=null;
function openDB(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"id",autoIncrement:true})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
async function all(){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,"readonly").objectStore(STORE).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
async function put(v){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).put(v);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function remove(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function getModel(){if(modelPromise)return modelPromise;if(typeof mobilenet==="undefined")throw new Error("MobileNet library did not load");modelPromise=mobilenet.load({version:2,alpha:1});return modelPromise}
function norm(v){const a=Array.from(v),n=Math.sqrt(a.reduce((s,x)=>s+x*x,0))||1;return a.map(x=>x/n)}
async function embed(video){const m=await getModel(),t=m.infer(video,true),a=Array.from(await t.data());t.dispose();return norm(a)}
function cos(a,b){let s=0;for(let i=0;i<Math.min(a.length,b.length);i++)s+=a[i]*b[i];return s}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function teach(video,name,onProgress){const total=5,v=[];for(let i=0;i<total;i++){await wait(i?420:80);v.push(await embed(video));onProgress?.(i+1,total)}const items=await all(),old=items.find(x=>x.name.toLowerCase()===name.toLowerCase());if(old){old.vectors=[...(old.vectors||[]),...v].slice(-15);old.samples=old.vectors.length;old.updatedAt=Date.now();await put(old)}else await put({name,vectors:v,samples:v.length,createdAt:Date.now(),updatedAt:Date.now()});try{await navigator.storage?.persist?.()}catch(_){}return{name,samples:v.length}}
async function match(video){const items=await all();if(!items.length)return null;const q=await embed(video);let best=null;for(const item of items){for(const v of item.vectors||[]){const score=cos(q,v);if(!best||score>best.score)best={id:item.id,name:item.name,score}}}return best&&best.score>=0.82?best:null}
window.BloopMemory={list:all,teach,match,remove,clear:async()=>{for(const x of await all())await remove(x.id)}}})();
