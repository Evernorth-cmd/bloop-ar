(()=>{"use strict";
const STATES=Object.freeze({
 idle:{loop:true,ms:1400},blink:{loop:false,ms:180},happy:{loop:false,ms:700},curious:{loop:false,ms:520},celebrate:{loop:false,ms:1000},run:{loop:true,ms:700},dash:{loop:false,ms:760},thinking:{loop:true,ms:1300},surprised:{loop:false,ms:650},excited:{loop:false,ms:850},sleep:{loop:true,ms:1800},
 cup_melt:{loop:false,ms:380},cup_slime:{loop:false,ms:1050},bottle_stretch:{loop:false,ms:360},bottle_snake:{loop:false,ms:1050},tv_transform:{loop:false,ms:380},tv_remote:{loop:false,ms:1050},remote:{loop:false,ms:1500},teddy_transform:{loop:false,ms:380},teddy:{loop:false,ms:1050},typing:{loop:false,ms:850},mouse_found:{loop:false,ms:1000},mouse_play:{loop:false,ms:850},laptop_found:{loop:false,ms:1100},train_zoom:{loop:false,ms:700}
});
function makeCharacter(){
 const el=document.createElement("div"); el.className="bloop-live-character";
 el.innerHTML='<div class="bloop-shadow"></div><div class="bloop-speed-spark spark-a"></div><div class="bloop-speed-spark spark-b"></div><div class="bloop-limb bloop-arm bloop-arm-l"></div><div class="bloop-limb bloop-arm bloop-arm-r"></div><div class="bloop-body"><i class="bloop-gloss"></i><i class="bloop-body-shine"></i><div class="bloop-tuft"></div><div class="bloop-brow brow-l"></div><div class="bloop-brow brow-r"></div><div class="bloop-eye eye-l"><i></i><b></b></div><div class="bloop-eye eye-r"><i></i><b></b></div><div class="bloop-cheek cheek-l"></div><div class="bloop-cheek cheek-r"></div><div class="bloop-mouth"><span></span></div></div><div class="bloop-limb bloop-foot foot-l"></div><div class="bloop-limb bloop-foot foot-r"></div>';
 return el;
}
class Bloop2D{
 constructor(root){this.root=root;this.timer=null;this.busyUntil=0;this.locked=false;this.lastReactionAt=0;this.sprite=document.createElement("div");this.sprite.className="bloop-2d-sprite";this.sprite.appendChild(makeCharacter());root.replaceChildren(this.sprite);this.play("idle",{force:true})}
 play(state,{next="idle",force=false,schedule=true}={}){
  if(!STATES[state])state="idle"; if(!force&&(this.locked||Date.now()<this.busyUntil))return this;
  clearTimeout(this.timer); this.root.dataset.bloopState=state; this.sprite.dataset.state=state;
  this.root.classList.remove("bloop-morphing"); this.root.classList.toggle("bloop-state-active",true);
  if(schedule&&!STATES[state].loop)this.timer=setTimeout(()=>this.play(next),STATES[state].ms);
  return this
 }
 sequence(steps){clearTimeout(this.timer);this.locked=true;let i=0;const run=()=>{const step=steps[i++];if(!step){this.locked=false;this.play("idle",{force:true});return}this.play(step.state,{next:"idle",force:true,schedule:false});this.timer=setTimeout(run,step.ms??STATES[step.state]?.ms??600)};run();return this}
 react(form,label=""){if(label)this.root.setAttribute("aria-label",label);const now=Date.now();if(now-this.lastReactionAt<700)return this;this.lastReactionAt=now;
 const p={cup:[["curious",500],["cup_melt",650],["cup_slime",1800],["happy",900],["celebrate",1200]],bottle:[["curious",500],["bottle_stretch",650],["bottle_snake",1800],["happy",900],["celebrate",1200]],tv:[["curious",500],["tv_transform",650],["tv_remote",1800],["excited",900],["celebrate",1200]],remote:[["curious",500],["remote",2200],["happy",900],["celebrate",1200]],teddy:[["curious",500],["teddy_transform",650],["teddy",1800],["happy",900],["celebrate",1200]],mouse:[["curious",500],["mouse_found",1800],["mouse_play",1500],["happy",900],["celebrate",1200]],laptop:[["curious",500],["laptop_found",1800],["typing",1500],["excited",900],["celebrate",1200]],train:[["curious",450],["dash",1000],["train_zoom",1100],["excited",900],["celebrate",1200]],animal:[["curious",500],["excited",1000],["happy",900],["celebrate",1200]],blob:[["curious",900],["surprised",900],["thinking",1400],["celebrate",1200]]};
 return this.sequence((p[form]||p.blob).map(x=>({state:x[0],ms:x[1]})))
 }
}
window.Bloop2D=Bloop2D;
})();