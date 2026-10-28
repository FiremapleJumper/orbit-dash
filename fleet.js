(()=>{'use strict';
const ships=[
{id:'vanguard',name:'Vanguard',role:'Balanced explorer',desc:'A dependable hull for any run.',hp:100,speed:245,pickup:62,fuel:100,regen:25,boost:850,points:[[0,-18],[13,13],[0,7],[-13,13]]},
{id:'scout',name:'Scout',role:'Speed specialist',desc:'Outrun the swarm with a lighter, faster hull.',hp:75,speed:310,pickup:62,fuel:90,regen:28,boost:960,points:[[0,-23],[9,15],[0,8],[-9,15]]},
{id:'bulwark',name:'Bulwark',role:'Heavy defender',desc:'Extra armor and fuel, with slower cruising speed.',hp:170,speed:185,pickup:62,fuel:125,regen:22,boost:760,points:[[0,-18],[15,-7],[18,12],[9,17],[-9,17],[-18,12],[-15,-7]]},
{id:'interceptor',name:'Interceptor',role:'Aggressive sprinter',desc:'A fast strike craft with powerful boost thrust.',hp:90,speed:280,pickup:62,fuel:100,regen:25,boost:1050,points:[[0,-22],[7,-2],[21,13],[6,9],[0,15],[-6,9],[-21,13],[-7,-2]]},
{id:'prospector',name:'Prospector',role:'Stardust collector',desc:'A wider pickup field makes every detour count.',hp:110,speed:220,pickup:110,fuel:100,regen:25,boost:820,points:[[0,-17],[11,-9],[17,12],[7,16],[0,10],[-7,16],[-17,12],[-11,-9]]},
{id:'comet',name:'Comet',role:'Endurance booster',desc:'A bigger fuel tank and faster refill for long boosts.',hp:85,speed:260,pickup:62,fuel:155,regen:32,boost:950,points:[[0,-23],[8,-7],[13,15],[0,10],[-13,15],[-8,-7]]}
];
const accessories=[
{id:'none',name:'Clean hull',buff:'No modifiers',debuff:'',cost:0,mods:{}},
{id:'halo',name:'Unstable reactor',buff:'+25% weapon damage',debuff:'−15% max hull',cost:70,mods:{damage:.25,hull:-.15}},
{id:'wings',name:'Racing fins',buff:'+20% cruise speed',debuff:'−15% fire rate',cost:60,mods:{speed:.2,rate:-.15}},
{id:'crown',name:'Lucky star',buff:'+25% stardust value',debuff:'−15% pickup radius',cost:65,mods:{dust:.25,pickup:-.15}},
{id:'antenna',name:'Deep-space scanner',buff:'+45% pickup radius',debuff:'−10% weapon damage',cost:55,mods:{pickup:.45,damage:-.1}},
{id:'pennant',name:'Reserve tank',buff:'+35% boost fuel',debuff:'−15% cruise speed',cost:60,mods:{fuel:.35,speed:-.15}},
{id:'overdrive',name:'Overdrive chip',buff:'+25% fire rate',debuff:'−15% weapon damage',cost:75,mods:{rate:.25,damage:-.15}},
{id:'plating',name:'Dense plating',buff:'+35% max hull',debuff:'−15% fuel capacity',cost:80,mods:{hull:.35,fuel:-.15}},
{id:'afterburner',name:'Hot exhaust',buff:'+30% boost speed',debuff:'−20% fuel refill',cost:70,mods:{boost:.3,regen:-.2}},
{id:'salvager',name:'Scrap magnet',buff:'+25% stardust value',debuff:'−20% max hull',cost:65,mods:{dust:.25,hull:-.2}},
{id:'coolant',name:'Cryo coolant',buff:'+40% fuel refill',debuff:'−15% weapon damage',cost:55,mods:{regen:.4,damage:-.15}},
{id:'lens',name:'Focusing lens',buff:'+25% weapon reach',debuff:'−15% fire rate',cost:65,mods:{range:.25,rate:-.15}},
{id:'razor',name:'Ram spikes',buff:'+35% boost impact damage',debuff:'−15% max hull',cost:70,mods:{ram:.35,hull:-.15}}
];
const paints=[{id:'lime',name:'Stardust lime',color:'#d5ff77'},{id:'ice',name:'Ion ice',color:'#8fe8ff'},{id:'orchid',name:'Cosmic orchid',color:'#f0a1e6'},{id:'solar',name:'Solar orange',color:'#ffb98b'},{id:'violet',name:'Deep violet',color:'#b8a1ff'},{id:'pearl',name:'Moon pearl',color:'#f4f2ee'}];
const trails=[{id:'violet',name:'Nebula',color:'#b8a1ff'},{id:'ice',name:'Ion',color:'#8fe8ff'},{id:'solar',name:'Solar',color:'#ffb98b'},{id:'lime',name:'Stardust',color:'#d5ff77'}];
const find=(list,id)=>list.find(x=>x.id===id)||list[0],ship=id=>find(ships,id),defaults=(index=0)=>({ship:'vanguard',accessory:'none',paint:paints[index%4].id,trail:'violet'});
function sanitize(value,index=0){const base=defaults(index),v=value&&typeof value==='object'?value:{};return Object.fromEntries([['ship',ships],['accessory',accessories],['paint',paints],['trail',trails]].map(([key,list])=>[key,list.some(x=>x.id===v[key])?v[key]:base[key]]));}
let profiles=[];try{const saved=JSON.parse(localStorage.getItem('orbit-fleet')||'[]');if(Array.isArray(saved))profiles=saved.slice(0,4).map(sanitize);}catch{}
function get(index=0){return sanitize(profiles[index],index);}
function save(index,value){if(!Number.isInteger(index)||index<0||index>3)return;profiles[index]=sanitize(value,index);try{localStorage.setItem('orbit-fleet',JSON.stringify(profiles));}catch{}return get(index);}
function pilot(value,index=0){const p=sanitize(value,index),s=ship(p.ship);const result={shipType:s.id,accessory:p.accessory,paint:p.paint,trail:p.trail,color:find(paints,p.paint).color,hp:s.hp,maxHp:s.hp,speed:s.speed,pickup:s.pickup,fuel:s.fuel,items:p.accessory==='none'?{}:{[p.accessory]:1}};applyItems(result);result.hp=result.maxHp;return result;}
function modifiers(p){const result={damage:1,hull:1,speed:1,rate:1,pickup:1,fuel:1,regen:1,boost:1,dust:1,range:1,ram:1};for(const [id,count]of Object.entries(p?.items||{})){const item=accessories.find(a=>a.id===id);if(!item)continue;for(const [key,value]of Object.entries(item.mods))result[key]+=value*Math.max(0,Number(count)||0);}for(const key in result)result[key]=Math.max(.25,result[key]);return result;}
function applyItems(p,upgrades=p.upgrades||{}){const s=ship(p.shipType),m=modifiers(p),old=p.maxHp||s.hp;p.maxHp=Math.max(1,Math.round((s.hp+(upgrades.hull||0)*25)*m.hull));p.hp=Math.max(0,Math.min(p.maxHp,(p.hp??old)+p.maxHp-old));p.speed=(s.speed+(upgrades.speed||0)*22)*m.speed;p.pickup=(s.pickup+(upgrades.magnet||0)*30)*m.pickup;return p;}
function drive(p,level=0,tier=1){const s=ship(p.shipType),m=modifiers(p);return{capacity:(s.fuel+level*12)*m.fuel,regen:(s.regen+level*4)*m.regen,drain:25,speed:Math.max(s.boost+level*20,p.speed*(2.8+level*.03))*m.boost,damage:(35+tier*10+level*8)*m.ram};}
function adjustWeapon(p,stats){const m=modifiers(p);return{...stats,damage:Math.max(1,Math.round(stats.damage*m.damage)),interval:stats.interval/m.rate,range:stats.range*m.range,radius:stats.radius*m.range};}
function offers(random=Math.random){const pool=accessories.slice(1).map((_,i)=>i+1);for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,3);}
function itemCost(p,id){const item=accessories[id];return item&&id>0?item.cost+20*(p.items?.[item.id]||0):Infinity;}
function buyItem(p,id,upgrades=p.upgrades||{}){const item=accessories[id],cost=itemCost(p,id);if(!item||id===0||!p.itemOffers?.includes(id)||p.itemsBought?.includes(id)||p.dust<cost||!Number.isFinite(cost)||p.ready)return false;p.dust-=cost;p.items||={};p.items[item.id]=(p.items[item.id]||0)+1;p.itemsBought||=[];p.itemsBought.push(id);applyItems(p,upgrades);p.fuel=Math.min(p.fuel,drive(p,upgrades.dash||0).capacity);return true;}
function itemHTML(p,attributes,disabled=false){return `<section class="dock-section"><div class="section-heading"><h3>Accessories · bonuses & tradeoffs</h3><span>STACK ACROSS WAVES</span></div><div class="item-inventory">${Object.entries(p.items||{}).map(([id,n])=>`<span>${find(accessories,id).name} ×${n}</span>`).join('')||'<span>No accessories equipped</span>'}</div><div class="offer-grid">${(p.itemOffers||[]).map(id=>{const item=accessories[id],bought=p.itemsBought?.includes(id);return `<article class="offer-card accessory-offer"><h4>${item.name}</h4><p class="item-buff">${item.buff}</p><p class="item-debuff">${item.debuff}</p><button class="${bought?'secondary':'play'}" ${attributes(id)} ${disabled||bought||p.dust<itemCost(p,id)?'disabled':''}>${bought?'Equipped ✓':'Equip · '+itemCost(p,id)+' ✦'}</button></article>`;}).join('')}</div></section>`;}
function icon(id,color='#d5ff77'){return `<svg viewBox="-30 -32 60 64" aria-hidden="true"><path d="${ship(id).points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join('')}Z" fill="${paints.some(p=>p.color===color)?color:'#d5ff77'}"/><path d="M0 -10 4 5 -4 5Z" fill="#152333"/></svg>`;}
function draw(ctx,p,time=0,boost=false){const s=ship(p.shipType),color=p.color||find(paints,p.paint).color,engine=find(trails,p.trail).color;ctx.save();ctx.translate(p.x,p.y);ctx.rotate((p.angle||0)+Math.PI/2);if(p.inv>0)ctx.globalAlpha=.65+Math.sin(time*22)*.2;
ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.4;
if(p.accessory==='halo'){ctx.globalAlpha*=.7;ctx.beginPath();ctx.ellipse(0,0,24,11,-.4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
if(p.accessory==='wings'){for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*8,0);ctx.lineTo(side*28,-3);ctx.lineTo(side*23,14);ctx.lineTo(side*10,10);ctx.closePath();ctx.globalAlpha=.6;ctx.fill();}ctx.globalAlpha=1;}
if(p.accessory==='antenna'){ctx.beginPath();ctx.moveTo(8,-5);ctx.lineTo(20,-18);ctx.stroke();ctx.beginPath();ctx.arc(20,-18,2.5,0,Math.PI*2);ctx.fill();}
if(p.accessory==='pennant'){ctx.beginPath();ctx.moveTo(-10,1);ctx.lineTo(-21,-17);ctx.stroke();ctx.beginPath();ctx.moveTo(-21,-17);ctx.lineTo(-34,-11+Math.sin(time*8)*2);ctx.lineTo(-17,-10);ctx.closePath();ctx.fill();}
ctx.shadowColor=color;ctx.shadowBlur=boost?20:7;ctx.beginPath();s.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#233346';ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(4,5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();
ctx.fillStyle=engine;ctx.beginPath();ctx.moveTo(-4,12);ctx.lineTo(0,21+Math.sin(time*30)*3+(boost?25:0));ctx.lineTo(4,12);ctx.closePath();ctx.fill();if(s.id==='bulwark'||s.id==='interceptor')for(const x of [-10,10]){ctx.beginPath();ctx.moveTo(x-2,13);ctx.lineTo(x,boost?35:23);ctx.lineTo(x+2,13);ctx.closePath();ctx.fill();}
if(p.accessory==='crown'){ctx.fillStyle='#f8d77e';ctx.beginPath();ctx.moveTo(-9,-23);ctx.lineTo(-11,-32);ctx.lineTo(-4,-28);ctx.lineTo(0,-35);ctx.lineTo(4,-28);ctx.lineTo(11,-32);ctx.lineTo(9,-23);ctx.closePath();ctx.fill();}ctx.restore();}
function summary(index=0){const p=get(index),s=ship(p.ship);return `<button class="fleet-summary secondary" data-hangar="${index}">${icon(s.id,find(paints,p.paint).color)}<span><b>${s.name}</b> · ${find(accessories,p.accessory).name}</span><span>Customize ↗</span></button>`;}
const ramWeapon={id:-2,name:'Ram-only',type:'ram',label:'Boost impact',icon:'↯',color:'#ffb98b',damage:45,interval:.25,range:30,speed:0,count:1};
window.OrbitFleet={ramWeapon,ships,accessories,paints,trails,ship,defaults,sanitize,get,save,pilot,icon,draw,summary,modifiers,applyItems,drive,adjustWeapon,offers,itemCost,buyItem,itemHTML};
})();
