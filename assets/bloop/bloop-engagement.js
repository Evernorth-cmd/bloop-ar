(()=>{"use strict";
const KEY="bloop-engagement-v1";
const today=()=>new Date().toISOString().slice(0,10);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")||{date:today(),discoveries:[],total:0}}catch(_){return{date:today(),discoveries:[],total:0}}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(_){}}
function state(){const s=load();if(s.date!==today()){s.date=today();s.discoveries=[];save(s)}return s}
function injectStyles(){
 if(document.getElementById("bloop-engagement-style"))return;
 const st=document.createElement("style");st.id="bloop-engagement-style";st.textContent=`
 #bloop-quest{position:fixed;top:calc(env(safe-area-inset-top,0px) + 58px);left:18px;z-index:12;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:rgba(20,16,28,.72);border:1px solid rgba(255,157,46,.18);backdrop-filter:blur(8px);font:600 11px 'Space Grotesk',sans-serif;color:#ffe2bd;box-shadow:0 8px 24px rgba(0,0,0,.16);transition:transform .25s ease,opacity .25s ease}
 #bloop-quest b{color:#ffd59e}.bq-dot{width:7px;height:7px;border-radius:50%;background:#6ee7b7;box-shadow:0 0 8px #6ee7b7}
 #bloop-quest.done{border-color:rgba(110,231,183,.34);color:#d9fff0;animation:bq-pop .55s cubic-bezier(.2,.9,.2,1)}
 @keyframes bq-pop{50%{transform:scale(1.06)}}
 #bloop-share{position:fixed;right:18px;bottom:calc(env(safe-area-inset-bottom,0px) + 146px);z-index:11;display:none;border:1px solid rgba(255,255,255,.12);background:rgba(20,16,28,.82);color:#fff2df;border-radius:999px;padding:9px 13px;font:700 12px 'Space Grotesk',sans-serif;backdrop-filter:blur(8px);box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer}
 #bloop-share.show{display:block;animation:bq-pop .45s cubic-bezier(.2,.9,.2,1)}
 #bloop-share:active{transform:scale(.94)}
 #bloop-share[disabled]{opacity:.55}
 #bloop-onboarding{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 104px);transform:translateX(-50%);z-index:11;width:min(330px,calc(100vw - 36px));padding:12px 14px;border-radius:18px;background:rgba(20,16,28,.9);border:1px solid rgba(255,157,46,.22);box-shadow:0 14px 40px rgba(0,0,0,.3);text-align:center;display:none}
 #bloop-onboarding.show{display:block;animation:onboard-in .55s cubic-bezier(.2,.9,.2,1)}
 #bloop-onboarding strong{display:block;color:#ffd59e;font:700 16px 'Fredoka',sans-serif;margin-bottom:4px}
 #bloop-onboarding span{color:#b9ada0;font-size:12px;line-height:1.4}
 #bloop-onboarding button{margin-top:8px;border:0;border-radius:999px;background:#ff9d2e;color:#2a1706;padding:7px 12px;font:700 11px 'Space Grotesk',sans-serif}
 @keyframes onboard-in{from{opacity:0;transform:translate(-50%,-8px) scale(.96)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
 `;
 document.head.appendChild(st);
}
function makeUI(){
 injectStyles();
 if(!document.getElementById("bloop-quest")){const q=document.createElement("div");q.id="bloop-quest";q.innerHTML='<span class="bq-dot"></span><span>Today: <b id="bq-count">0/3</b> new discoveries</span>';document.body.appendChild(q)}
 if(!document.getElementById("bloop-share")){const b=document.createElement("button");b.id="bloop-share";b.type="button";b.textContent="📸 Share Bloop";document.body.appendChild(b);b.addEventListener("click",shareMoment)}
 if(!document.getElementById("bloop-onboarding")){const o=document.createElement("div");o.id="bloop-onboarding";o.innerHTML='<strong>Let’s see what Bloop does 👀</strong><span>Scan something nearby. Then try a cup, bottle, laptop, mouse or TV.</span><br><button type="button">Got it</button>';document.body.appendChild(o);o.querySelector("button").onclick=()=>{o.classList.remove("show");try{localStorage.setItem("bloop-onboarded","1")}catch(_){}};try{if(!localStorage.getItem("bloop-onboarded"))setTimeout(()=>o.classList.add("show"),900)}catch(_){}}
 updateQuest();
}
function updateQuest(){
 const s=state(),n=Math.min(3,s.discoveries.length),q=document.getElementById("bq-count"),el=document.getElementById("bloop-quest");
 if(q)q.textContent=n+"/3";
 if(el){el.classList.toggle("done",n>=3);el.title=n>=3?"Quest complete!":"Discover 3 different things today."}
}
function record(detail){
 const s=state();
 const object=String(detail.object||detail.reaction||"unknown").replace(/<[^>]*>/g,"").trim().toLowerCase();
 const reaction=String(detail.reaction||"curious").replace(/<[^>]*>/g,"").trim().toLowerCase();
 const key=(reaction+"|"+object).slice(0,100);
 if(!s.discoveries.includes(key)){s.discoveries.push(key);s.discoveries=s.discoveries.slice(-50);s.total=(s.total||0)+1;save(s)}
 updateQuest();
 const share=document.getElementById("bloop-share");if(share)share.classList.add("show");
 if(s.discoveries.length===3){setTimeout(()=>{if(window.bloop2d?.play)window.bloop2d.play("celebrate",{next:"idle",force:true});if(window.say)window.say("🎉 Bloop's daily discovery quest is complete!",3000)},260)}
}
async function snapshot(){
 const video=document.getElementById("camera-video"),host=document.getElementById("bloop-character");
 if(!video||video.readyState<2||!host)return null;
 const w=video.videoWidth||video.clientWidth,h=video.videoHeight||video.clientHeight;
 if(!w||!h)return null;
 const canvas=document.createElement("canvas");canvas.width=Math.max(720,Math.round(window.innerWidth*1.5));canvas.height=Math.round(canvas.width*(window.innerHeight/window.innerWidth));
 const ctx=canvas.getContext("2d");
 const vr=video.getBoundingClientRect(),scale=Math.max(canvas.width/w,canvas.height/h),rw=w*scale,rh=h*scale;
 const ox=(canvas.width-rw)/2,oy=(canvas.height-rh)/2;ctx.drawImage(video,0,0,w,h,ox,oy,rw,rh);
 const hr=host.getBoundingClientRect(),sx=canvas.width/window.innerWidth,sy=canvas.height/window.innerHeight;
 const img=host.querySelector(".bloop-2d-sprite");
 if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,hr.left*sx,hr.top*sy,hr.width*sx,hr.height*sy)}
 ctx.fillStyle="rgba(18,12,24,.78)";ctx.fillRect(18*sx,18*sy,120*sx,34*sy);
 ctx.fillStyle="#ffd59e";ctx.font=`700 ${18*sx}px sans-serif`;ctx.fillText("bloop ✨",28*sx,41*sy);
 return new Promise(resolve=>canvas.toBlob(blob=>resolve(blob),"image/jpeg",.9));
}
async function shareMoment(){
 const btn=document.getElementById("bloop-share");if(!btn)return;
 btn.disabled=true;const old=btn.textContent;btn.textContent="✨ Making a Bloop moment…";
 try{
  const blob=await snapshot();
  const file=blob?new File([blob],"bloop-moment.jpg",{type:"image/jpeg"}):null;
  if(file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
   await navigator.share({files:[file],title:"My Bloop moment",text:"Look what Bloop did! 🟠✨"});
  }else if(navigator.share){
   await navigator.share({title:"My Bloop moment",text:"Look what Bloop did! 🟠✨",url:location.href});
  }else{
   await navigator.clipboard?.writeText("Look what Bloop did! 🟠✨ "+location.href);
   if(window.say)window.say("📋 Bloop moment copied to your clipboard!",2200);
  }
 }catch(e){if(e?.name!=="AbortError"&&window.say)window.say("Bloop couldn't share that moment yet.",2200)}
 finally{btn.disabled=false;btn.textContent=old}
}
function boot(){
 makeUI();
 window.addEventListener("bloop-reaction-complete",e=>record(e.detail||{}));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)updateQuest()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();