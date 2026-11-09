/* ===== CONFIGURACIÓN (editar acá) ===== */
const WA_NUM="";   // WhatsApp Business de Nueva Era: código de país + número, sin "+" (ej: 5492610000000). A definir.
const SENA=0.3;    // Porcentaje de seña al reservar (0.3 = 30%). A definir con la empresa.
const waUrl=m=>"https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(m);

const $=id=>document.getElementById(id),fmt=n=>"$ "+Math.round(n).toLocaleString("es-AR");
/* Unidades: precios de referencia, ficha técnica y chofer asignado (datos de ejemplo) */
const U={
bus:{n:"Ómnibus 50 asientos",b:90000,k:2100,e:22000,i:"29",img:"img/interno-29.webp",alt:"Ómnibus Mercedes-Benz Nuevobus OH 1618 de Nueva Era",ph:0,
 d:[["Marca","Mercedes-Benz"],["Modelo","Nuevobus OH 1618"],["Año","2021"],["Dominio","AE 846 DE"],["Butacas","50 fijas"],["Clima","A/A y calefacción"],["Baño","No"]],
 ch:{n:"Karim Rauek",foto:"img/chofer-karim-rauek.webp",r:"4,8",a:"4 años",l:"Licencia especial N° LINT-2021-004827",i:"Español, Inglés",
  rv:["Puntual, amable y te hace sentir súper seguro en el viaje.","Muy prudente en las rutas de montaña y respetuoso de las normas.","Maneja con cuidado y cumple con los horarios."]}},
vw:{n:"Ómnibus con baño 45 asientos",b:90000,k:2100,e:22000,i:"04",img:"img/interno-04-volksbus.webp",alt:"Ómnibus Volkswagen Volksbus 17.230 OD de Nueva Era, interno 04",ph:1,
 d:[["Marca","Volkswagen"],["Modelo","Volksbus 17.230 OD"],["Año","2007"],["Dominio","GJI 656"],["Butacas","45 reclinables"],["Clima","A/A y calefacción"],["Baño","Sí"]],
 ch:{n:"Carlos Rauek",foto:"img/chofer-carlos-rauek.webp",r:"5,0",a:"17 años",l:"Licencia especial N° LINT-2009-002641",i:"Español",
  rv:["Colectivo limpio y excelente trato del conductor.","Se nota la experiencia, excelente manejo en ruta.","Muy cordial y responsable. Da mucha tranquilidad viajar así."]}},
spr:{n:"Sprinter 19 asientos",b:60000,k:1400,e:15000,i:"26",img:"img/interno-26-sprinter.webp",alt:"Mercedes-Benz Sprinter de 19 asientos de Nueva Era, interno 26",ph:1,
 d:[["Marca","Mercedes-Benz"],["Modelo","Sprinter"],["Año","2025"],["Dominio","AH 136 WI"],["Butacas","19 reclinables"],["Clima","A/A y calefacción"],["Baño","No"]],
 ch:{n:"Ibraim Hessar",foto:"img/chofer-ibraim-hessar.webp",r:"4,9",a:"9 años",l:"Licencia especial N° LINT-2017-008315",i:"Español, Inglés",
  rv:["Muy profesional, conducción segura y tranquila.","Siempre atento a los pasajeros. ¡Muy buen servicio!","Un conductor de primera, siempre atento y puntual."]}}};
function ficha(k){const u=U[k],c=u.ch;
$("fi").textContent=u.i;$("fd").innerHTML=u.d.map(x=>`<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join("");
const im=$("fimg");im.src=u.img;im.alt=u.alt;im.classList.toggle("ph",!!u.ph);
$("drv").innerHTML=`<div class="av"><img class="dp" alt="${c.n}, chofer" src="${c.foto}"><div><h3 style="font-size:24px">${c.n}</h3><div class="st">★★★★★ <span style="color:var(--tx);font-weight:700;letter-spacing:0">${c.r}</span></div></div></div><p style="color:var(--mu);font-size:14px"><b style="color:var(--tx)">${c.a}</b> de antigüedad · ${c.l} · ${c.i}</p>${c.rv.map(r=>`<div class="rv">“${r}”</div>`).join("")}<a class="btn" href="#cotizador" style="margin-top:18px" data-un="${k}">Cotizar esta unidad</a>`;
document.querySelectorAll("#tabs button").forEach(x=>x.classList.toggle("on",x.dataset.k===k))}
$("drv").addEventListener("click",e=>{const a=e.target.closest("[data-un]");if(a){$("un").value=a.dataset.un;calc()}});
ficha("bus");
$("un").addEventListener("change",()=>ficha($("un").value));
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{ficha(b.dataset.k);$("un").value=b.dataset.k;calc()});
function calc(){const u=U[$("un").value],km=Math.max(0,+$("km").value||0),h=Math.max(0,+$("es").value||0),ida=$("ida").checked;
const base=u.b,kms=km*u.k*(ida?1:2),esp=h*u.e;let ex=0;if($("med").checked)ex+=(base+kms)*.08;if($("en").checked)ex+=(base+kms)*.1;
const t=base+kms+esp+ex;$("tot").textContent=fmt(t);$("r1").textContent=fmt(base);$("r2").textContent=fmt(kms);$("r3").textContent=fmt(esp);$("r4").textContent=fmt(ex);
const PT=window.__pts||{},ml=k=>PT[k]?` (${PT[k].url})`:"";window.__q={u:u.n,t,km,ida,or:$("or").value,de:$("de").value,fe:$("fe").value};
const m=`Hola Nueva Era! Quiero cotizar: ${u.n}, ${$("or").value||"origen"}${ml("or")} → ${$("de").value||"destino"}${ml("de")}, ${km} km, ${ida?"solo ida":"ida y vuelta"}, fecha ${$("fe").value||"a definir"}. Estimado: ${fmt(t)}`;
$("wa").href=waUrl(m)}
document.querySelectorAll(".form input,.form select").forEach(e=>e.addEventListener("input",calc));
const d=new Date();d.setDate(d.getDate()+14);$("fe").value=d.toISOString().slice(0,10);calc();
$("bg").onclick=()=>$("nv").classList.toggle("open");document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>$("nv").classList.remove("open"));
document.querySelectorAll("[data-asesor]").forEach(a=>a.href=waUrl("Hola Nueva Era! Quiero hablar con un asesor."));
$("sd").onclick=()=>{window.open(waUrl(`Hola, soy ${$("nm").value}. ${$("ms").value}`),"_blank")};
document.querySelectorAll(".gal img").forEach(i=>i.onclick=()=>{const l=$("lb");l.firstElementChild.src=i.src;l.classList.add("on")});$("lb").onclick=()=>$("lb").classList.remove("on");
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("v")),{threshold:.15});
document.querySelectorAll(".rv-in").forEach(e=>io.observe(e));

(function(){const SC=[{t:"Exterior · Volkswagen interno 04",img:"img/interno-04-volksbus.webp",n:"Afuera",z:[64,58],hs:[{x:64,y:58,go:1,l:"▶"},{x:30,y:36,l:"i",h:"Volkswagen Volksbus 17.230 OD",d:"45 butacas reclinables, aire acondicionado, calefacción y baño a bordo."}]},
{t:"Pasillo · Ómnibus de 50 butacas",img:"img/galeria-pasillo-50.webp",n:"Pasillo",hs:[{x:15,y:68,l:"i",h:"Butacas",d:"Asientos tapizados con cubre-cabezal Nueva Era y buen espacio entre filas."},{x:30,y:14,l:"i",h:"Aire acondicionado",d:"Salidas de aire individuales sobre cada fila, más calefacción para el invierno."},{x:21,y:34,l:"i",h:"Cortinas",d:"Control de luz y sol en los viajes largos."},{x:51,y:44,l:"i",h:"Telemetría GPS",d:"Las 29 unidades se monitorean por satélite en tiempo real."},{x:51,y:68,go:2,l:"→"}]},
{t:"Pasillo · Ómnibus con baño",img:"img/galeria-pasillo-bano.webp",n:"Con baño",hs:[{x:50,y:50,l:"i",h:"Baño a bordo",d:"El interno 04 cuenta con baño al fondo, ideal para los viajes largos."},{x:20,y:66,l:"i",h:"Butacas reclinables",d:"Asientos con cinturón de seguridad y apoyabrazos."},{x:50,y:12,l:"i",h:"Aire acondicionado y calefacción",d:"Climatización en todo el pasillo."},{x:50,y:70,go:3,l:"→"}]},
{t:"Butacas reclinables",img:"img/galeria-butacas.webp",n:"Butacas",hs:[{x:42,y:42,l:"i",h:"Respaldo alto",d:"Butacas con cabecera y cinturón de seguridad."},{x:80,y:30,l:"i",h:"Ventanas amplias",d:"Mucha luz natural y vista a la montaña."},{x:56,y:70,l:"i",h:"Apoyabrazos",d:"Cada butaca tiene apoyabrazos propio."},{x:88,y:72,go:4,l:"→"}]},
{t:"Exterior · Sprinter interno 26",img:"img/interno-26-sprinter.webp",n:"Sprinter",hs:[{x:68,y:50,l:"i",h:"Mercedes-Benz Sprinter",d:"19 butacas reclinables, aire acondicionado y calefacción. Ideal para grupos chicos."},{x:50,y:70,go:0,l:"↺"}]}];
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
