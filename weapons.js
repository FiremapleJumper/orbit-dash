/* 50 base weapons: 10 attack systems × 5 distinct tunings. */
(()=>{'use strict';
const families=[
{type:'bolt',label:'Pulse cannon',icon:'↗',color:'#d5ff77',damage:15,interval:.42,speed:630,range:660,count:1,desc:'Precise, fast bolts track the nearest asteroid.',names:['Pulse Needle','Quasar Cannon','Photon Lance','Ion Repeater','Starbreaker']},
{type:'spread',label:'Scatter cannon',icon:'⋔',color:'#ffb98b',damage:8,interval:.85,speed:470,range:440,count:4,desc:'A fan of projectiles shreds clustered enemies.',names:['Meteor Scatter','Solar Buckshot','Comet Fan','Ember Volley','Nebula Shredder']},
{type:'beam',label:'Piercing beam',icon:'ϟ',color:'#8fe8ff',damage:22,interval:1.1,speed:0,range:620,count:1,desc:'A piercing ray cuts through every rock in its path.',names:['Prism Ray','Aurora Beam','Void Laser','Helios Lance','Spectrum Cutter']},
{type:'missile',label:'Homing rockets',icon:'⌁',color:'#ff9cbb',damage:30,interval:1.7,speed:290,range:740,count:1,desc:'Seeking missiles explode into splash damage.',names:['Comet Seeker','Starfall Rocket','Nova Torpedo','Gravity Warhead','Eclipse Salvo']},
{type:'orbit',label:'Orbiting blades',icon:'⊙',color:'#b8a1ff',damage:11,interval:.46,speed:3.2,range:110,count:2,desc:'Rotating blades damage rocks that get close.',names:['Moon Blades','Saturn Rings','Satellite Saws','Orbital Cleavers','Halo Guard']},
{type:'nova',label:'Shockwave',icon:'◎',color:'#f8d77e',damage:29,interval:2.1,speed:0,range:165,count:1,desc:'A circular shockwave hits every nearby enemy.',names:['Solar Bloom','Supernova','Gravity Pulse','Neutron Burst','Event Horizon']},
{type:'chain',label:'Chain lightning',icon:'ϟ',color:'#9caeff',damage:18,interval:1.15,speed:0,range:460,count:3,desc:'Electric arcs leap between nearby asteroids.',names:['Arc Spark','Thunder Relay','Storm Circuit','Tesla Web','Lightning Cascade']},
{type:'mine',label:'Space mines',icon:'✹',color:'#f0a1e6',damage:44,interval:1.25,speed:0,range:120,count:1,desc:'Leave explosive traps behind you as you fly.',names:['Void Mine','Stardust Trap','Plasma Charge','Crater Maker','Dark Matter Bomb']},
{type:'return',label:'Returning discs',icon:'◇',color:'#8df1c8',damage:17,interval:1.2,speed:380,range:460,count:1,desc:'Piercing discs fly out, then return for a second hit.',names:['Lunar Disc','Comet Boomerang','Rift Glaive','Echo Blade','Cosmic Chakram']},
{type:'drone',label:'Combat drones',icon:'⠿',color:'#c6cfff',damage:10,interval:.85,speed:530,range:610,count:2,desc:'Small orbiting drones fire at the nearest target.',names:['Scout Swarm','Wasp Squadron','Guardian Drones','Firefly Fleet','Sentinel Array']}
];
const tunings=[{label:'Rapid',damage:.78,interval:.64,range:.9,speed:1.16,extra:0,detail:'Faster attacks, lighter hits.'},{label:'Heavy',damage:1.65,interval:1.4,range:.94,speed:.87,extra:0,detail:'Slower attacks, heavier hits.'},{label:'Wide',damage:.8,interval:1.18,range:1.06,speed:1,extra:1,detail:'More projectiles, blades, arcs, or pulses.'},{label:'Long reach',damage:.95,interval:1.05,range:1.4,speed:1.15,extra:0,detail:'Extra reach to keep danger at a distance.'},{label:'Balanced',damage:1.1,interval:1,range:1.05,speed:1,extra:0,detail:'A dependable balance of power and speed.'}];
const weapons=families.flatMap((f,fi)=>tunings.map((t,ti)=>({id:fi*5+ti,name:f.names[ti],type:f.type,label:f.label,icon:f.icon,color:f.color,desc:f.desc+' '+t.detail,tuning:t.label,damage:f.damage*t.damage,interval:f.interval*t.interval,speed:f.speed*t.speed,range:f.range*t.range,count:f.count+t.extra})));
const roman=['I','II','III','IV','V'];
function stats(w,tier=1){const t=Math.max(0,Math.min(4,tier-1));return{...w,tier,damage:Math.round(w.damage*(1+t*.42)),interval:w.interval/(1+t*.17),range:w.range*(1+t*.09),count:w.count+((['beam','nova'].includes(w.type))?0:Math.floor(t/2)),speed:w.speed*(1+t*.06),radius:(w.type==='missile'?62:w.type==='mine'?w.range:0)*(1+t*.12)};}
window.OrbitWeapons={weapons,families,roman,stats};
})();
