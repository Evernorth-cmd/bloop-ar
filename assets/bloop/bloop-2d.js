(()=>{"use strict";
const STATES=Object.freeze({
 idle:{loop:true,ms:1400},blink:{loop:false,ms:180},happy:{loop:false,ms:700},curious:{loop:false,ms:520},celebrate:{loop:false,ms:1000},
 run:{loop:true,ms:700},dash:{loop:false,ms:760},thinking:{loop:true,ms:1300},surprised:{loop:false,ms:650},excited:{loop:false,ms:850},sleep:{loop:true,ms:1800},
 cup_melt:{loop:false,ms:380},cup_slime:{loop:false,ms:1050},bottle_stretch:{loop:false,ms:360},bottle_snake:{loop:false,ms:1050},
 tv_transform:{loop:false,ms:380},tv_remote:{loop:false,ms:1050},remote:{loop:false,ms:1500},teddy_transform:{loop:false,ms:380},teddy:{loop:false,ms:1050},
 typing:{loop:false,ms:850},mouse_found:{loop:false,ms:1000},mouse_play:{loop:false,ms:850},laptop_found:{loop:false,ms:1100},train_zoom:{loop:false,ms:700}
});
function makeCharacter(){
 const el=document.createElement("div"); el.className="bloop-live-character bloop-canvas-character";
 const c=document.createElement("canvas"); c.className="bloop-canvas"; c.width=480;c.height=480; el.appendChild(c); return el;
}
function ellipse(ctx,x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function rr(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()}
function drawCharacter(ctx,t,state){
 const W=480,H=480; ctx.clearRect(0,0,W,H);
 let bob=Math.sin(t*2.2)*5, squash=1, stretch=1, rot=0;
 if(state==="curious"){bob-=8;rot=-.06;squash=1.04;stretch=.96}
 if(state==="happy"||state==="celebrate"){bob-=10;squash=1.06;stretch=.94}
 if(state==="excited"){bob-=7;squash=1.07;stretch=.93}
 if(state==="surprised"){squash=1.1;stretch=.9}
 if(state==="thinking"){rot=.06;bob-=4}
 if(state==="dash"||state==="run"){squash=.88;stretch=1.12;rot=.06*Math.sin(t*8)}
 if(state==="cup_melt"||state==="cup_slime"){squash=1.18;stretch=.72;bob+=12}
 if(state==="bottle_stretch"||state==="bottle_snake"){squash=.72;stretch=1.28;rot=.05*Math.sin(t*5)}
 if(state==="remote"){squash=.86;stretch=1.12}
 ctx.save();ctx.translate(240,245+bob);ctx.rotate(rot);ctx.scale(squash,stretch);
 ellipse(ctx,0,145,105,20,"rgba(50,20,4,.22)");
 const limb=ctx.createLinearGradient(-70,75,70,145);limb.addColorStop(0,"#ffd25a");limb.addColorStop(.55,"#ff9d20");limb.addColorStop(1,"#e96a0c");
 ellipse(ctx,-55,112,48,30,limb);ellipse(ctx,55,112,48,30,limb);
 ellipse(ctx,-108,-2,45,39,limb);ellipse(ctx,108,-2,45,39,limb);
 const g=ctx.createRadialGradient(-52,-85,12,35,35,205);g.addColorStop(0,"#fff0a2");g.addColorStop(.2,"#ffd65c");g.addColorStop(.52,"#ffad28");g.addColorStop(.82,"#f27c12");g.addColorStop(1,"#d95809");ellipse(ctx,0,0,122,142,g);
 const sh=ctx.createRadialGradient(40,60,15,55,65,125);sh.addColorStop(0,"rgba(173,54,4,0)");sh.addColorStop(1,"rgba(128,35,0,.34)");ellipse(ctx,20,20,95,105,sh);
 const belly=ctx.createRadialGradient(0,25,5,0,55,95);belly.addColorStop(0,"rgba(255,218,84,.48)");belly.addColorStop(1,"rgba(255,150,15,0)");ellipse(ctx,0,48,75,55,belly);
 ctx.fillStyle="#f47f12";ctx.beginPath();ctx.moveTo(-15,-136);ctx.quadraticCurveTo(-4,-174,17,-144);ctx.quadraticCurveTo(28,-125,5,-118);ctx.closePath();ctx.fill();
 const blink=state==="blink";
 const eyeY=-48;
 for(const ex of [-48,48]){
   if(blink){ctx.strokeStyle="#7a3410";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ex-22,eyeY);ctx.quadraticCurveTo(ex,eyeY+8,ex+22,eyeY);ctx.stroke()}
   else{
     ellipse(ctx,ex,eyeY,39,51,"#fffdf7");
     const ig=ctx.createRadialGradient(ex-7,eyeY-12,3,ex,eyeY+3,31);ig.addColorStop(0,"#a8edff");ig.addColorStop(.28,"#56b8ff");ig.addColorStop(.62,"#2866d0");ig.addColorStop(1,"#101d69");ellipse(ctx,ex,eyeY+3,29,38,ig);
     ellipse(ctx,ex+2,eyeY+8,12,20,"#06133f");ellipse(ctx,ex-10,eyeY-18,9,12,"rgba(255,255,255,.95)");ellipse(ctx,ex+12,eyeY+19,5,6,"rgba(255,255,255,.72)");
   }
 }
 ctx.strokeStyle="#71300d";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-76,-102);ctx.quadraticCurveTo(-50,-112,-26,-105);ctx.moveTo(26,-105);ctx.quadraticCurveTo(50,-112,76,-102);ctx.stroke();
 ellipse(ctx,-83,38,28,13,"rgba(255,92,103,.48)");ellipse(ctx,83,38,28,13,"rgba(255,92,103,.48)");
 const mouthH=state==="surprised"||state==="excited"?38:28;ellipse(ctx,0,43,24,mouthH/2,"#641b23");ellipse(ctx,0,54,13,8,"#ff8794");
 ctx.save();ctx.rotate(-.18);rr(ctx,-80,-105,20,95,10,"rgba(255,255,255,.35)");ellipse(ctx,73,-102,12,12,"rgba(255,255,255,.4)");ctx.restore();
 ctx.restore();
}
class Bloop2D{
 constructor(root){this.root=root;this.timer=null;this.locked=false;this.lastReactionAt=0;this.sprite=document.createElement("div");this.sprite.className="bloop-2d-sprite";this.character=makeCharacter();this.sprite.appendChild(this.character);root.replaceChildren(this.sprite);this.canvas=this.character.querySelector("canvas");this.ctx=this.canvas.getContext("2d");this.start();this.play("idle",{force:true})}
 start(){const tick=ms=>{drawCharacter(this.ctx,ms/1000,this.root.dataset.bloopState||"idle");requestAnimationFrame(tick)};requestAnimationFrame(tick)}
 play(state,{next="idle",force=false,schedule=true}={}){if(!STATES[state])state="idle";if(!force&&this.locked)return this;clearTimeout(this.timer);this.root.dataset.bloopState=state;this.sprite.dataset.state=state;this.root.classList.remove("bloop-morphing");this.root.classList.add("bloop-state-active");if(schedule&&!STATES[state].loop)this.timer=setTimeout(()=>this.play(next),STATES[state].ms);return this}
 sequence(steps){clearTimeout(this.timer);this.locked=true;let i=0;const run=()=>{const step=steps[i++];if(!step){this.locked=false;this.play("idle",{force:true});return}this.play(step.state,{next:"idle",force:true,schedule:false});this.timer=setTimeout(run,step.ms??600)};run();return this}
 react(form,label=""){if(label)this.root.setAttribute("aria-label",label);const now=Date.now();if(now-this.lastReactionAt<700)return this;this.lastReactionAt=now;
 const p={cup:[["curious",500],["cup_melt",650],["cup_slime",1800],["happy",900],["celebrate",1200]],bottle:[["curious",500],["bottle_stretch",650],["bottle_snake",1800],["happy",900],["celebrate",1200]],tv:[["curious",500],["tv_transform",650],["tv_remote",1800],["excited",900],["celebrate",1200]],remote:[["curious",500],["remote",2200],["happy",900],["celebrate",1200]],teddy:[["curious",500],["teddy_transform",650],["teddy",1800],["happy",900],["celebrate",1200]],mouse:[["curious",500],["mouse_found",1800],["mouse_play",1500],["happy",900],["celebrate",1200]],laptop:[["curious",500],["laptop_found",1800],["typing",1500],["excited",900],["celebrate",1200]],train:[["curious",450],["dash",1000],["train_zoom",1100],["excited",900],["celebrate",1200]],animal:[["curious",500],["excited",1000],["happy",900],["celebrate",1200]],blob:[["curious",900],["surprised",900],["thinking",1400],["celebrate",1200]]};
 return this.sequence((p[form]||p.blob).map(x=>({state:x[0],ms:x[1]})))}
}
window.Bloop2D=Bloop2D;
})();