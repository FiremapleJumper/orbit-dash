(()=>{'use strict';
const input=window.OrbitInput,stick=document.getElementById('joystick'),thumb=document.getElementById('joystick-thumb'),boost=document.getElementById('dash'),overlay=document.getElementById('overlay');
let moveId=null,boostId=null,dx=0,dy=0,boostHeld=false;
function available(){return overlay.classList.contains('hidden')&&!window.OrbitFleet?.isOpen?.();}
function reset(){moveId=null;boostId=null;dx=dy=0;boostHeld=false;thumb.style.transform='translate(-50%,-50%)';stick.classList.remove('engaged');boost.classList.remove('engaged');}
function steer(e){const r=stick.getBoundingClientRect(),radius=Math.min(r.width,r.height)*.34,x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,length=Math.hypot(x,y),travel=Math.min(length,radius),power=Math.max(0,(travel/radius-.12)/.88);dx=length?x/length*power:0;dy=length?y/length*power:0;thumb.style.transform=`translate(calc(-50% + ${length?x/length*travel:0}px),calc(-50% + ${length?y/length*travel:0}px))`;}
stick.addEventListener('pointerdown',e=>{if(!available()||moveId!==null)return;e.preventDefault();moveId=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('engaged');steer(e);});
stick.addEventListener('pointermove',e=>{if(e.pointerId===moveId){e.preventDefault();steer(e);}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,e=>{if(e.pointerId!==moveId)return;moveId=null;dx=dy=0;thumb.style.transform='translate(-50%,-50%)';stick.classList.remove('engaged');});
boost.addEventListener('pointerdown',e=>{if(!available()||boostId!==null)return;e.preventDefault();boostId=e.pointerId;boostHeld=true;boost.setPointerCapture(e.pointerId);boost.classList.add('engaged');});
for(const event of ['pointerup','pointercancel','lostpointercapture'])boost.addEventListener(event,e=>{if(e.pointerId!==boostId)return;boostId=null;boostHeld=false;boost.classList.remove('engaged');});
const sample=input.sample;input.sample=(index=0,count=1)=>{const value=sample(index,count);if(index===0&&available()){if(moveId!==null){value.dx=dx;value.dy=dy;}value.boost||=boostHeld;value.touch=moveId!==null||boostId!==null;}return value;};
const clear=input.clear;input.clear=()=>{clear();reset();};
window.OrbitMobile={scale(r){return Math.min(r.width,r.height)<600&&window.matchMedia('(max-width: 760px), (max-height: 500px), (pointer: coarse)').matches ? .72 : 1;},reset};
window.addEventListener('blur',reset);window.addEventListener('resize',reset);window.addEventListener('orbit-hangar-open',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
new MutationObserver(()=>{if(!available())reset();}).observe(overlay,{attributes:true,attributeFilter:['class']});
})();
