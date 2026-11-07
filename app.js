const $=id=>document.getElementById(id),fmt=n=>"$ "+Math.round(n).toLocaleString("es-AR");
const U={bus:{n:"Ómnibus",b:90000,k:2100,e:22000,d:[["Marca","Mercedes-Benz"],["Modelo","Nuevobus OH 1618"],["Año","2021"],["Dominio","AE 638 BR"],["Butacas","50 lugares"]],i:"07"},
spr:{n:"Sprinter",b:60000,k:1400,e:15000,d:[["Marca","Mercedes-Benz"],["Modelo","Sprinter"],["Año","A definir"],["Dominio","A definir"],["Butacas","19 asientos"]],i:"12"}};
function ficha(k){$("fi").textContent=U[k].i;$("fd").innerHTML=U[k].d.map(x=>`<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join("");const bus=k==="bus";document.querySelector(".fch img.bi").style.display=bus?"":"none";$("van").style.display=bus?"none":"block";document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",(x.dataset.i==="0")===bus))}
ficha("bus");
$("un").addEventListener("change",()=>ficha($("un").value));
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#tabs button").forEach(x=>x.classList.remove("on"));b.classList.add("on");const k=b.dataset.i==="0"?"bus":"spr";ficha(k);$("un").value=k;calc()});
function calc(){const u=U[$("un").value],km=Math.max(0,+$("km").value||0),h=Math.max(0,+$("es").value||0),ida=$("ida").checked;
const base=u.b,kms=km*u.k*(ida?1:2),esp=h*u.e;let ex=0;if($("med").checked)ex+=(base+kms)*.08;if($("en").checked)ex+=(base+kms)*.1;
const t=base+kms+esp+ex;$("tot").textContent=fmt(t);$("r1").textContent=fmt(base);$("r2").textContent=fmt(kms);$("r3").textContent=fmt(esp);$("r4").textContent=fmt(ex);
const PT=window.__pts||{},ml=k=>PT[k]?` (${PT[k].url})`:"";window.__q={u:u.n,t,km,ida,or:$("or").value,de:$("de").value,fe:$("fe").value};
const m=`Hola Nueva Era! Quiero cotizar: ${u.n}, ${$("or").value||"origen"}${ml("or")} → ${$("de").value||"destino"}${ml("de")}, ${km} km, ${ida?"solo ida":"ida y vuelta"}, fecha ${$("fe").value||"a definir"}. Estimado: ${fmt(t)}`;
$("wa").href="https://wa.me/?text="+encodeURIComponent(m)}
document.querySelectorAll(".form input,.form select").forEach(e=>e.addEventListener("input",calc));
const d=new Date();d.setDate(d.getDate()+14);$("fe").value=d.toISOString().slice(0,10);calc();
$("bg").onclick=()=>$("nv").classList.toggle("open");document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>$("nv").classList.remove("open"));
$("sd").onclick=()=>{window.open("https://wa.me/?text="+encodeURIComponent(`Hola, soy ${$("nm").value}. ${$("ms").value}`),"_blank")};
document.querySelectorAll(".gal img").forEach(i=>i.onclick=()=>{const l=$("lb");l.firstElementChild.src=i.src;l.classList.add("on")});$("lb").onclick=()=>$("lb").classList.remove("on");
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("v")),{threshold:.15});
document.querySelectorAll(".rv-in").forEach(e=>io.observe(e));

(function(){const G=[...document.querySelectorAll(".gal img")].map(i=>i.src);
const SC=[{t:"Exterior · Mercedes-Benz",img:G[1],n:"Afuera",z:[47,60],hs:[{x:47,y:60,go:1,l:"▶"},{x:55,y:30,l:"i",h:"Frente",d:"Mercedes-Benz Nuevobus OH 1618: 50 lugares, unidad con GPS satelital."}]},
{t:"Pasillo · Ómnibus",img:G[0],n:"Pasillo",hs:[{x:27,y:55,l:"i",h:"Butacas",d:"Asientos individuales tapizados, con buen espacio entre filas."},{x:46,y:78,l:"i",h:"Pasamanos",d:"Barras de seguridad para viajar cómodo también de pie."},{x:72,y:28,l:"i",h:"Cortinas",d:"Control de luz y sol en los viajes largos."},{x:50,y:42,l:"i",h:"Telemetría GPS",d:"Las 29 unidades se monitorean por satélite en tiempo real."}]},
{t:"Butacas · Minibus",img:G[2],n:"Butacas",hs:[{x:30,y:48,l:"i",h:"Butacas turquesa",d:"Asientos individuales con respaldo alto."},{x:20,y:30,l:"i",h:"Ventanas amplias",d:"Mucha luz natural y vista a la montaña."},{x:86,y:46,l:"i",h:"Tu chofer",d:"Profesionales con licencia especial. Español e inglés."},{x:50,y:72,go:0,l:"↺"}]}];
const $=id=>document.getElementById(id),vr=$("vr"),vi=$("vi"),vimg=$("vimg"),vp=$("vp"),vv=$("vv"),hi=$("hi");
let s=0,px=0,py=0,tx=0,ty=0,W=0,H=0,drag=null,raf=0,busy=false,mx=0,my=0,gx=0;
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function size(){const a=vimg.naturalWidth/vimg.naturalHeight||4/3,vw=innerWidth,vh=innerHeight;W=Math.max(vw*1.35,vh*a*1.15);H=W/a;vi.style.width=W+"px";vi.style.height=H+"px"}
function lim(){return[Math.max(0,(W-innerWidth)/2),Math.max(0,(H-innerHeight)/2)]}
function loop(){const[lx,ly]=lim();tx=Math.max(-lx,Math.min(lx,tx));ty=Math.max(-ly,Math.min(ly,ty));
px+=(tx+(drag?0:mx*-14+gx)-px)*.08;py+=(ty+(drag?0:my*-10)-py)*.08;vi.style.transform=`translate(-50%,-50%) translate(${px}px,${py}px)`;raf=requestAnimationFrame(loop)}
function hsRender(){const c=$("vhs");c.innerHTML="";SC[s].hs.forEach(o=>{const d=document.createElement("div");d.className="hsp"+(o.go!=null?" go":"");d.style.cssText=`left:${o.x}%;top:${o.y}%`;const b=document.createElement("button");b.textContent=o.l;b.setAttribute("aria-label",o.h||"Avanzar");
b.onclick=e=>{e.stopPropagation();if(o.go!=null){o.go===1&&s===0?enter():set(o.go)}else{hi.innerHTML=`<b>${o.h}</b><span>${o.d}</span>`;hi.classList.add("on");clearTimeout(hi._t);hi._t=setTimeout(()=>hi.classList.remove("on"),4200)}};b.addEventListener("pointerdown",e=>e.stopPropagation());d.append(b);c.append(d)})}
function load(i,cb){vimg.onload=()=>{size();cb&&cb()};vimg.src=SC[i].img;if(vimg.complete)vimg.onload()}
function nav(){$("vn").innerHTML=SC.map((o,i)=>`<button class="${i===s?"on":""}" data-i="${i}" aria-label="${o.t}"><img src="${o.img}" alt=""><span>${o.n}</span></button>`).join("");$("vn").querySelectorAll("button").forEach(b=>b.onclick=()=>set(+b.dataset.i))}
function set(i){if(busy)return;busy=true;hi.classList.remove("on");vv.classList.add("on");setTimeout(()=>{s=i;$("vt").textContent=SC[i].t;px=py=tx=ty=0;load(i,()=>{hsRender();nav();vp.style.transition="none";vp.style.transform="scale(1)";vv.classList.remove("on");busy=false;const h=$("vh");h.style.opacity=1;setTimeout(()=>h.style.opacity=0,3500)})},rm?0:500)}
function enter(){if(busy)return;busy=true;hi.classList.remove("on");const o=SC[0].z;vp.style.transformOrigin=`${o[0]}% ${o[1]}%`;vp.style.transition=rm?"none":"transform 1.3s cubic-bezier(.65,0,.25,1)";vp.style.transform="scale(3.2)";setTimeout(()=>vv.classList.add("on"),rm?0:900);setTimeout(()=>{busy=false;set(1)},rm?0:1400)}
function open(){vr.classList.add("on");document.body.style.overflow="hidden";s=0;busy=false;$("vt").textContent=SC[0].t;vp.style.transition="none";vp.style.transform="scale(1)";vv.classList.remove("on");px=py=tx=ty=0;load(0,()=>{hsRender();nav();$("vh").style.opacity=1;setTimeout(()=>$("vh").style.opacity=0,4000)});cancelAnimationFrame(raf);loop();
if(window.DeviceOrientationEvent)addEventListener("deviceorientation",gyro)}
function close(){vr.classList.remove("on");document.body.style.overflow="";cancelAnimationFrame(raf);removeEventListener("deviceorientation",gyro)}
function gyro(e){if(e.gamma!=null)gx=Math.max(-60,Math.min(60,-e.gamma*3))}
document.querySelectorAll("[data-vr]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();open()}));
$("vx").onclick=close;$("vq").onclick=()=>close();
vr.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;drag={x:e.clientX,y:e.clientY,tx,ty};vr.setPointerCapture(e.pointerId);$("vh").style.opacity=0;hi.classList.remove("on")});
vr.addEventListener("pointermove",e=>{if(drag){tx=drag.tx+(e.clientX-drag.x);ty=drag.ty+(e.clientY-drag.y)}else{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5}});
vr.addEventListener("pointerup",()=>drag=null);vr.addEventListener("pointercancel",()=>drag=null);
addEventListener("keydown",e=>{if(!vr.classList.contains("on"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")tx+=140;if(e.key==="ArrowRight")tx-=140});
addEventListener("resize",()=>vr.classList.contains("on")&&size());
})();
