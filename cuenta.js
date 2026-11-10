/* Cuenta de usuario, perfil, billetera, reservas y pago (seña o total).
   TODO SIMULADO en el navegador (localStorage): no se envía nada a ningún servidor ni se cobra nada.
   Para una versión real hay que reemplazar esto por un backend (login, base de datos y pasarela de pago). */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mem={},ST={get(k){try{const v=localStorage.getItem(k);if(v!=null)return v}catch(e){}return mem[k]??null},set(k,v){mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}},del(k){delete mem[k];try{localStorage.removeItem(k)}catch(e){}}};
const J=(k,d)=>{try{const v=JSON.parse(ST.get(k)||"null");return v==null?d:v}catch(e){return d}};
const accK=e=>"ne_acc_"+e,resK=e=>"ne_res_"+e;
const first=n=>String(n||"").trim().split(/\s+/)[0]||"";
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const go=id=>$(id).scrollIntoView({behavior:reduce?"auto":"smooth"});
const fdate=s=>{try{return new Date(s+"T00:00:00Z").toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}catch(e){return s||"A definir"}};
let me=null,tab="res",pend=null,lgMode="in",lastFocus=null,CK=null;
const sess=J("ne_user",null);
if(sess&&sess.email){const a=J(accK(sess.email),null);if(a)me={...a,email:sess.email}}
const saveMe=()=>{const {email,...r}=me;ST.set(accK(email),JSON.stringify(r))};
const getR=()=>J(resK(me.email),[]),setR=a=>ST.set(resK(me.email),JSON.stringify(a));
async function H(pw,email){const s="ne|"+email+"|"+pw;try{if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}}catch(e){}let h=5381;for(const c of s)h=((h<<5)+h+c.charCodeAt(0))>>>0;return"f"+h.toString(16)}
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),4200)}

/* ---------- modales ---------- */
const MODALS=["pgm","lgm","acm","nmm"];
function openM(id){lastFocus=document.activeElement;$(id).classList.add("on")}
function closeM(id){$(id).classList.remove("on");if(id==="lgm")pend=null;lastFocus&&lastFocus.focus&&lastFocus.focus()}
MODALS.forEach(id=>$(id).addEventListener("pointerdown",e=>{if(e.target===$(id))closeM(id)}));
$("lgx").onclick=()=>closeM("lgm");$("pgx").onclick=()=>closeM("pgm");$("acx").onclick=()=>closeM("acm");$("nmx").onclick=()=>closeM("nmm");
addEventListener("keydown",e=>{if(e.key!=="Escape")return;closeUm();if($("lglm").classList.contains("on"))return window.closeLegal();for(const id of MODALS){if($(id).classList.contains("on")){closeM(id);break}}});

/* ---------- login / crear usuario ---------- */
function setLg(m){
 lgMode=m;const up=m==="up";
 document.querySelectorAll("#lgtabs button").forEach(b=>b.classList.toggle("on",b.dataset.m===m));
 $("lgn").hidden=!up;$("lgq").hidden=!up;$("lgk").hidden=!up;
 $("lgb").textContent=up?"Crear usuario":"Ingresar";
 $("lgt").textContent=up?"Creá tu usuario":"Ingresá a tu cuenta";
 $("lgp").autocomplete=up?"new-password":"current-password";$("lgerr").textContent="";
}
function openLogin(m,msg,after){
 pend=after||null;setLg(m||"in");
 $("lgs").textContent=msg||(m==="up"?"Con tu usuario reservás más rápido y seguís tus viajes.":"Para reservar y ver tus viajes.");
 openM("lgm");setTimeout(()=>(lgMode==="up"?$("lgnm"):$("lge")).focus(),30);
}
document.querySelectorAll("#lgtabs button").forEach(b=>b.onclick=()=>setLg(b.dataset.m));
$("lgf").onsubmit=async e=>{
 e.preventDefault();
 const em=$("lge").value.trim().toLowerCase(),pw=$("lgp").value,nm=$("lgnm").value.trim(),err=m=>{$("lgerr").textContent=m};
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return err("Ingresá un email válido.");
 if(pw.length<6)return err("La contraseña debe tener al menos 6 caracteres.");
 const acc=J(accK(em),null);
 if(lgMode==="up"){
  if(!nm)return err("Contanos tu nombre o el de tu empresa.");
  if(pw!==$("lgp2").value)return err("Las contraseñas no coinciden.");
  if(!$("lgt2").checked)return err("Para crear tu usuario tenés que aceptar los Términos y condiciones.");
  if(acc)return err("Ya existe un usuario con ese email. Probá ingresar.");
  me={email:em,name:nm,hash:await H(pw,em),tel:"",org:"",city:"",foto:"",cards:[]};saveMe();seed();
 }else{
  if(!acc)return err("No encontramos un usuario con ese email. Creá uno en “Crear nuevo usuario”.");
  if(acc.hash!==await H(pw,em))return err("La contraseña no es correcta.");
  me={...acc,email:em};seed();
 }
 ST.set("ne_user",JSON.stringify({email:em}));
 ["lgp","lgp2","lgnm"].forEach(i=>$(i).value="");$("lgerr").textContent="";$("lgt2").checked=false;
 const f=pend;pend=null;closeM("lgm");tab="res";render();
 if(f)f();else toast(`¡Hola, ${first(me.name)}! Sesión iniciada.`);
};
function logout(){me=null;ST.del("ne_user");tab="res";closeM("acm");render();toast("Cerraste sesión.")}

/* ---------- datos de ejemplo y helpers ---------- */
const budK=e=>"ne_bud_"+e,getB=()=>J(budK(me.email),[]),setB=a=>ST.set(budK(me.email),JSON.stringify(a));
const bid=()=>{const n=(+ST.get("ne_budn")||1000)+1;ST.set("ne_budn",String(n));return"PRE-"+new Date().getFullYear()+"-"+String(n).padStart(4,"0")};
function seed(){
 if(!me)return;const sv="ne_seedv_"+me.email;if(J(sv,0)>=2)return;
 const dd=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)},ago=n=>new Date(Date.now()-n*864e5).toISOString();
 const ro=(a,b)=>`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b)}&travelmode=driving`;
 const mk=(o,pg,pagos)=>({demo:1,tvn:"Ida y vuelta",es:3,ida:false,ro:ro(o.or,o.de),...o,pago:pg,pagos});
 const B=n=>({t:"B",nro:"B 0003-"+String(n).padStart(8,"0")});
 const demos=[
  mk({id:"NE-2087",fe:dd(12),hs:"08:00",u:U.bus.n,or:"Maipú, Mendoza",de:"Potrerillos, Mendoza",km:60,t:408000,est:"Confirmada"},{modo:"sena",monto:122400,pagado:122400,medio:"Visa •••• 4242"},[{f:ago(6),monto:122400,modo:"sena",medio:"Visa •••• 4242",fact:B(4127)}]),
  mk({id:"NE-2112",fe:dd(26),hs:"09:00",u:U.spr.n,or:"Luján de Cuyo, Mendoza",de:"Tunuyán, Mendoza",km:85,t:343000,est:"Pendiente de pago"},{modo:"total",monto:343000,pagado:0,medio:"Transferencia bancaria"},[]),
  mk({id:"NE-2051",sim:"curso",fe:dd(0),hs:"07:30",u:U.vw.n,or:"San Martín, Mendoza",de:"Uspallata, Mendoza",km:105,t:529000,est:"Confirmada"},{modo:"total",monto:529000,pagado:529000,medio:"Mercado Pago"},[{f:ago(9),monto:529000,modo:"total",medio:"Mercado Pago",fact:{t:"A",nro:"A 0003-00001583",cu:"30-71234567-8",rs:"Bodega Los Andes S.A."}}]),
  mk({id:"NE-2019",sim:"fin",fe:dd(-3),hs:"08:00",u:U.spr.n,or:"Maipú, Mendoza",de:"Chacras de Coria, Mendoza",km:28,t:158000,est:"Confirmada"},{modo:"total",monto:158000,pagado:158000,medio:"Visa •••• 4242"},[{f:ago(12),monto:158000,modo:"total",medio:"Visa •••• 4242",fact:B(3990)}])];
 setR([...demos,...(J(resK(me.email),[])||[]).filter(r=>!r.demo)]);
 const q0={uk:"bus",u:U.bus.n,or:"Godoy Cruz, Mendoza",de:"Cacheuta, Mendoza",km:38,fe:dd(20),hs:"08:00",es:3,tvn:"Ida y vuelta",t:284040,det:{base:90000,kms:159600,esp:66000,ex:0,sub:315600,dab:0,don:31560}};
 setB([{id:"PRE-2026-0998",demo:1,cr:ago(3),q:q0},{id:"PRE-2026-0987",demo:1,cr:ago(14),q:q0},...getB().filter(b=>!b.demo)]);
 ST.set(sv,"2");
}
const DAY=864e5,when=r=>new Date(r.fe+"T"+(r.hs||"08:00")+":00"),durH=r=>Math.max(2,(r.km||0)*2/55+(+r.es||0)),tvl=r=>r.tvn||(r.ida?"Solo ida":"Ida y vuelta");
const ukOf=r=>r.uk||Object.keys(U).find(k=>U[k].n===r.u)||"bus",capOf=r=>parseInt((U[ukOf(r)].n.match(/\d+/)||[0])[0])||0;
const hm=ms=>new Date(ms).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
const pagosOf=r=>r.pagos||((r.pago&&r.pago.pagado>0)?[{f:r.fe,monto:r.pago.pagado,modo:r.pago.modo,medio:r.pago.medio,fact:null}]:[]);
const cuitOk=c=>{c=c.replace(/\D/g,"");if(c.length!==11)return false;const w=[5,4,3,2,7,6,5,4,3,2];let t=0;for(let i=0;i<10;i++)t+=+c[i]*w[i];let v=11-t%11;if(v===11)v=0;if(v===10)v=9;return v===+c[10]};
/* estado del viaje: proc (en proceso) · curso (en curso) · fin (finalizado) · canc */
function info(r){
 if(r.est==="Cancelada")return{k:"canc",l:"Cancelada"};
 if(r.sim==="fin")return{k:"fin",l:"Finalizado"};
 if(r.sim==="curso")return{k:"curso",l:"En curso",p:.05+((Date.now()/1000)%600)/600*.9};
 if(r.est!=="Confirmada")return{k:"proc",l:r.est};
 const now=Date.now(),st=when(r).getTime(),e=r.ab?new Date(r.ab.h+"T23:59:00").getTime():st+durH(r)*36e5;
 if(now>=e)return{k:"fin",l:"Finalizado"};
 if(r.ab)return now>=st?{k:"curso",l:"Abono vigente",ab:1}:{k:"proc",l:"Confirmada"};
 if(now>=st)return{k:"curso",l:"En curso",p:Math.min(.97,(now-st)/(e-st))};
 return{k:"proc",l:"Confirmada"};
}
const STEPS=["Solicitado","Confirmado","En curso","Finalizado"];
const stp=I=>{const i=I.k==="fin"?3:I.k==="curso"?2:I.l==="Confirmada"?1:0;return`<ol class="stp rx">${STEPS.map((x,j)=>`<li class="${j<i?"dn":j===i?"on":""}">${x}</li>`).join("")}</ol>`};
function live(r,I){
 if(I.ab)return`<div class="rx lv"><b>Abono vigente</b> hasta el ${esc(fdate(r.ab.h))}. El seguimiento en vivo se activa en cada servicio.</div>`;
 const p=I.p,pc=(p*100).toFixed(1);
 return`<div class="rx lv" data-live="${esc(r.id)}"><div class="lvh"><span class="lvd"><i></i>En vivo</span><b>${Math.round(p*100)}% del recorrido</b><small>Llegada estimada ${hm(Date.now()+(1-p)*durH(r)*36e5)} · ${50+Math.round(p*100)%14} km/h</small></div><div class="lvb"><span style="width:${pc}%"></span><em style="left:${pc}%">🚌</em></div><div class="lvs"><span>${esc(r.or)}</span><span>${esc(r.de)}</span></div><small class="lvn">Posición simulada en este prototipo. En la versión final se toma del GPS satelital de la unidad.</small></div>`}
const rate=r=>`<div class="rx rt2"><b>${r.cal?"Tu calificación":"¿Cómo fue tu viaje?"}</b><div class="stars" role="group" aria-label="Calificá el viaje">${[1,2,3,4,5].map(n=>`<button type="button" data-star="${n}" data-r="${esc(r.id)}" class="${r.cal&&n<=r.cal?"on":""}" aria-label="${n} estrella${n>1?"s":""}">★</button>`).join("")}</div><small>${r.cal?"¡Gracias por calificar!":"Tocá las estrellas para calificar el viaje y al chofer."}</small></div>`;
function nomBlock(r){
 if(r.est!=="Confirmada")return`<div class="rx nm"><div><b>Nómina de pasajeros</b><small>Se habilita cuando la reserva queda confirmada (seña acreditada).</small></div></div>`;
 const lim=new Date(when(r).getTime()-48*36e5),open=Date.now()<lim.getTime(),n=(r.nom||[]).length,fl=lim.toLocaleString("es-AR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
 return`<div class="rx nm"><div><b>Nómina de pasajeros</b><small>${n?`${n} de ${capOf(r)} cargados`:"Todavía no la cargaste"} · ${open?`podés cargarla hasta el ${fl} (48 hs antes de la salida)`:`el plazo venció el ${fl}; para cambios escribinos por WhatsApp`}</small></div>${open?`<button class="btn o" data-nom="${esc(r.id)}">${n?"Editar nómina":"Cargar nómina"}</button>`:n?`<button class="btn o" data-nom="${esc(r.id)}" data-ro="1">Ver nómina</button>`:""}</div>`}
const msgPres=b=>`Hola Nueva Era! Solicité el presupuesto ${b.id} (válido 10 días, hasta el ${new Date(new Date(b.cr).getTime()+10*DAY).toLocaleDateString("es-AR")}): ${b.q.u}, ${b.q.or} → ${b.q.de}, ${b.q.km} km, ${tvl(b.q)}, salida ${b.q.fe} ${b.q.hs||""}${b.q.hr?", regreso "+b.q.hr:""}.${b.q.ab?` Abono hasta el ${b.q.ab.h} (${b.q.ab.dias} días: ${b.q.ab.dl}).`:""} Total estimado ${fmt(b.q.t)}. Cliente: ${me.name} (${me.email}).`;
function dl(b){const bl=NEPDF.budget({...b,cli:{name:me.name,email:me.email,tel:me.tel}}),a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="Presupuesto-"+b.id+".pdf";document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)}
window.NE_pres=function(){
 const q=window.__q;
 if(!q||!q.or||!q.de){toast("Indicá el origen y el destino para armar el presupuesto.");go("cotizador");return}
 if(!q.t){toast("Revisá los días del abono: no hay días de servicio en ese rango.");return}
 if(!me){openLogin("in","Iniciá sesión o creá tu usuario para guardar tu presupuesto en “Mis viajes”.",()=>window.NE_pres());return}
 const b={id:bid(),cr:new Date().toISOString(),q:{...q,ro:$("gmr").href}};
 setB([b,...getB()]);render();dl(b);window.open(waUrl(msgPres(b)),"_blank");
 toast(`Presupuesto ${b.id} generado y guardado en Mis viajes. Avisamos al asesor por WhatsApp.`);
};

/* ---------- cuenta (sección "Mi cuenta") ---------- */
const ini=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";
const avatar=sz=>me.foto?`<img class="avt" style="width:${sz}px;height:${sz}px" src="${me.foto}" alt="Tu foto de perfil">`:`<span class="avt ini" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz/2.6)}px" aria-hidden="true">${esc(ini(me.name))}</span>`;
const IC={
 res:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
 datos:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
 bill:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/>',
 pass:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
 out:'<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/>',
 cta:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>',
 chev:'<path d="M6 9l6 6 6-6"/>'};
const svg=k=>`<svg class="umi" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const TABS=[["res","Mis viajes"],["cta","Estado de cuenta"],["datos","Mis datos"],["bill","Billetera"],["pass","Contraseña"]];
function closeUm(){const m=$("umm");if(m&&!m.hidden){m.hidden=true;$("acc").setAttribute("aria-expanded","false")}}
function hdr(){
 const u=$("um");
 if(!me){u.innerHTML=`<button class="btn o ingb" id="acc" type="button">Ingresar</button>`;return}
 const n=getR().filter(r=>["proc","curso"].includes(info(r).k)).length;
 u.innerHTML=`<button class="umb" id="acc" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="umm">${avatar(32)}<span class="umn">${esc(first(me.name))}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC.chev}</svg></button>
<div class="umm" id="umm" role="menu" hidden><div class="umh">${avatar(60)}<div><b>¡Hola, ${esc(first(me.name))}!</b><small>${esc(me.email)}</small></div></div>
<div class="uml">${TABS.map(t=>`<button type="button" role="menuitem" data-open="${t[0]}">${svg(t[0])}<span>${t[1]}</span>${t[0]==="res"&&n?`<em>${n}</em>`:""}</button>`).join("")}</div>
<div class="uml uo"><button type="button" role="menuitem" data-out="1">${svg("out")}<span>Cerrar sesión</span></button></div></div>`;
}
function render(){
 hdr();
 $("acp").innerHTML=me?({res:pRes,cta:pCta,datos:pDatos,bill:pBill,pass:pPass})[tab]():"";
}
function openAcct(t){if(!me)return openLogin("in");tab=t;render();openM("acm")}
$("um").addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 if(t.id==="acc"){if(!me)return openLogin("in");$("nv").classList.remove("open");const m=$("umm"),op=m.hidden;m.hidden=!op;t.setAttribute("aria-expanded",String(op));return}
 if(t.dataset.open){closeUm();return openAcct(t.dataset.open)}
 if(t.dataset.out){closeUm();return logout()}
});
document.addEventListener("pointerdown",e=>{if(!$("um").contains(e.target))closeUm()});
let vf="all";
function cardB(b){const v=new Date(new Date(b.cr).getTime()+10*DAY),ok=v>Date.now(),q=b.q;
 return`<article class="rr"><div><span class="bd ${ok?"ok":"no"}">Presupuesto ${ok?"vigente":"vencido"}</span><span class="bd">N° ${esc(b.id)}</span>${b.res?`<span class="bd ok">Reservado · ${esc(b.res)}</span>`:""}${b.demo?'<span class="bd ej">Ejemplo</span>':""}<h3>${esc(q.or)} → ${esc(q.de)}</h3><p>${esc(fdate(q.fe))}${q.hs?" · "+esc(q.hs)+" hs":""} · ${esc(q.u)} · ${esc(q.km)} km · ${esc(tvl(q))}</p><p>Emitido el ${esc(new Date(b.cr).toLocaleDateString("es-AR"))} · válido hasta el ${esc(v.toLocaleDateString("es-AR"))} (10 días)</p></div><div class="rt"><b>${fmt(q.t)}</b><small>importe estimado</small></div><div class="ra"><button class="btn o" data-bpdf="${esc(b.id)}">⬇ Descargar PDF</button>${ok&&!b.res?`<button class="btn" data-bres="${esc(b.id)}">Reservar con este presupuesto</button>`:""}<button class="btn o" data-bdel="${esc(b.id)}">Quitar</button></div></article>`}
function cardR(r){
 const I=info(r),pg=r.pago||{pagado:0},sal=Math.max(0,r.t-pg.pagado),canc=I.k==="canc",c=canc?"no":(I.k==="curso"||r.est==="Confirmada")?"ok":"";
 const chip=canc?"":pg.pagado>=r.t?'<span class="bd ok">Pagada</span>':pg.pagado>0?`<span class="bd">Seña abonada · saldo ${fmt(sal)}</span>`:'<span class="bd">Sin pago acreditado</span>';
 const ex=(canc?"":stp(I))+(I.k==="curso"?live(r,I):"")+(I.k==="fin"?rate(r):"")+(!canc&&I.k!=="fin"?nomBlock(r):"");
 return`<article class="rr"><div><span class="bd ${c}">${esc(I.l)}</span>${chip}${r.demo?'<span class="bd ej">Ejemplo</span>':""}<h3>${esc(r.or)} → ${esc(r.de)}</h3><p>${esc(fdate(r.fe))}${r.hs?" · ida "+esc(r.hs)+" hs":""}${r.hr?" · regreso "+esc(r.hr)+" hs":""} · ${esc(r.u)} · ${esc(r.km)} km · ${esc(tvl(r))} · N° ${esc(r.id)}</p>${r.ab?`<p>Abono hasta el ${esc(fdate(r.ab.h))} · ${esc(r.ab.dias)} días de servicio</p>`:""}</div><div class="rt"><b>${fmt(r.t)}</b><small>importe estimado</small></div>${ex}<div class="ra">${r.ro?`<a class="btn o" href="${esc(r.ro)}" target="_blank" rel="noopener">Ver ruta en Google Maps ↗</a>`:""}${!canc&&I.k!=="fin"&&sal>0?`<button class="btn" data-pay="${esc(r.id)}">${pg.pagado>0?"Pagar saldo · "+fmt(sal):"Pagar ahora"}</button>`:""}${!canc&&I.k==="proc"?`<button class="btn o" data-x="${esc(r.id)}">Cancelar reserva</button>`:""}${canc||I.k==="fin"?`<button class="btn o" data-d="${esc(r.id)}">Quitar de la lista</button>`:""}</div></article>`}
function pRes(){
 const rs=getR(),bs=getB(),k=r=>info(r).k,F=[["all","Todos",rs.length+bs.length],["proc","En proceso",rs.filter(r=>k(r)==="proc").length],["curso","En curso",rs.filter(r=>k(r)==="curso").length],["fin","Finalizados",rs.filter(r=>k(r)==="fin").length],["pres","Presupuestos",bs.length]];
 const it=[];if(vf==="all"||vf==="pres")bs.forEach(b=>it.push(cardB(b)));rs.forEach(r=>{if(vf==="all"||vf===k(r))it.push(cardR(r))});
 return`<div class="rh"><h3>Mis viajes</h3><a class="btn" href="#cotizador" style="padding:9px 18px;font-size:13px">+ Nuevo viaje</a></div><div class="tabs vf">${F.map(f=>`<button type="button" class="${vf===f[0]?"on":""}" data-vf="${f[0]}">${f[1]} <small>${f[2]}</small></button>`).join("")}</div>`+
 (it.length?`<div class="rl">${it.join("")}</div>`:`<div class="card empty"><div class="ic">🚌</div><h3>No hay nada para mostrar</h3><p>Cotizá un traslado y reservalo con una seña o pagando el total.</p><div class="cta"><a class="btn" href="#cotizador">Ir al cotizador</a></div></div>`);
}
function pCta(){
 const rs=getR().filter(r=>r.est!=="Cancelada"),L=me.limite||2000000,paid=r=>(r.pago||{}).pagado||0;
 const tot=rs.reduce((a,r)=>a+r.t,0),pag=rs.reduce((a,r)=>a+Math.min(r.t,paid(r)),0),sal=tot-pag,pend=rs.filter(r=>r.t-paid(r)>0),mv=[];
 getR().forEach(r=>pagosOf(r).forEach(p=>mv.push({r,p})));mv.sort((a,b)=>new Date(b.p.f)-new Date(a.p.f));
 return`<h3>Estado de cuenta</h3><div class="ecg"><div><small>Total contratado</small><b>${fmt(tot)}</b></div><div><small>Pagado</small><b>${fmt(pag)}</b></div><div class="${sal?"warn":""}"><small>Saldo pendiente</small><b>${fmt(sal)}</b></div><div><small>Límite de crédito (ejemplo)</small><b>${fmt(L)}</b><span class="lim"><i style="width:${Math.min(100,Math.round(sal/L*100))}%"></i></span><small>Disponible ${fmt(Math.max(0,L-sal))}</small></div></div>
<h4>Saldos pendientes</h4>${pend.length?`<div class="wl">${pend.map(r=>`<div class="wc"><span class="wi" aria-hidden="true">🧾</span><div><b>${esc(r.id)} · ${esc(r.or)} → ${esc(r.de)}</b><small>${esc(fdate(r.fe))} · saldo ${fmt(r.t-paid(r))}</small></div><button class="btn" data-pay="${esc(r.id)}">Pagar</button></div>`).join("")}</div>`:`<p class="mu">No tenés saldos pendientes.</p>`}
<h4>Facturas y pagos</h4>${mv.length?`<div class="tw"><table class="tb"><thead><tr><th>Fecha</th><th>Comprobante</th><th>Concepto</th><th>Medio</th><th>Importe</th><th>Estado</th></tr></thead><tbody>${mv.map(({r,p})=>`<tr><td>${esc(new Date(p.f).toLocaleDateString("es-AR"))}</td><td>${p.fact?`Factura ${esc(p.fact.nro)}${p.fact.rs?`<br><small>${esc(p.fact.rs)}</small>`:""}`:"—"}</td><td>${esc(r.id)} · ${p.modo==="sena"?"seña":p.modo==="saldo"?"saldo":"total"}</td><td>${esc(p.medio)}</td><td>${fmt(p.monto)}</td><td>${p.tr?"Pendiente de acreditación":"Acreditado"}</td></tr>`).join("")}</tbody></table></div>`:`<p class="mu">Todavía no hay comprobantes.</p>`}
<p class="nt2">Prototipo: facturas y límite de ejemplo.</p><a class="btn o" target="_blank" rel="noopener" href="${waUrl("Hola Nueva Era! Quiero consultar por mi línea de crédito / límite de cuenta corriente.")}">Consultar mi límite por WhatsApp</a>`}
function pDatos(){return `<h3>Mis datos</h3><form id="fdat" class="fgrid" novalidate>
<div class="full phrow">${avatar(84)}<div><button type="button" class="btn o fbtn" id="fpick">Cambiar foto</button> <button type="button" class="btn o fbtn" id="fquit" ${me.foto?"":"hidden"}>Quitar foto</button><input type="file" id="ffoto" accept="image/*" hidden><p class="nt2">La foto se guarda solo en este navegador (prototipo).</p></div></div>
<div class="f"><label for="dn">Nombre o empresa</label><input id="dn" value="${esc(me.name)}" autocomplete="name"></div>
<div class="f"><label for="dm">Email</label><input id="dm" value="${esc(me.email)}" readonly></div>
<div class="f"><label for="dt">Teléfono</label><input id="dt" type="tel" value="${esc(me.tel||"")}" placeholder="Ej: 261 555 1234" autocomplete="tel"></div>
<div class="f"><label for="do">Institución / empresa</label><input id="do" value="${esc(me.org||"")}"></div>
<div class="f full"><label for="dc">Localidad</label><input id="dc" value="${esc(me.city||"")}" placeholder="Ej: Maipú, Mendoza"></div>
<p class="err full" id="derr" role="alert"></p><div class="full"><button class="btn" type="submit">Guardar cambios</button></div></form>`}
const cardFields=p=>`<div class="fgrid cf"><div class="f full"><label for="${p}h">Titular</label><input id="${p}h" autocomplete="cc-name" placeholder="Como figura en la tarjeta"></div>
<div class="f full"><label for="${p}n">Número de tarjeta</label><input id="${p}n" data-cn inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="23"></div>
<div class="f"><label for="${p}e">Vencimiento</label><input id="${p}e" data-ce inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5"></div>
<div class="f"><label for="${p}c">Código de seguridad</label><input id="${p}c" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" type="password"></div></div>`;
function pBill(){
 const cs=me.cards||[];
 return `<div class="rh"><h3>Billetera</h3><button class="btn" id="cadd" type="button" style="padding:9px 18px;font-size:13px">+ Agregar tarjeta</button></div>
<p class="mu" style="margin:6px 0 16px">Medios de pago guardados para reservar más rápido. Solo guardamos la marca y los últimos 4 dígitos: nunca el número completo ni el código de seguridad.</p>
<div class="wl">${cs.length?cs.map(c=>`<div class="wc"><span class="wi" aria-hidden="true">💳</span><div><b>${esc(c.brand)} •••• ${esc(c.last4)}</b><small>${esc(c.holder)} · vence ${esc(c.exp)}</small></div>${c.def?'<span class="bd ok">Principal</span>':`<button class="btn o" data-def="${esc(c.id)}">Hacer principal</button>`}<button class="btn o" data-del="${esc(c.id)}" aria-label="Eliminar tarjeta terminada en ${esc(c.last4)}">Eliminar</button></div>`).join(""):`<div class="card empty"><div class="ic">💳</div><h3>No tenés tarjetas guardadas</h3><p>Agregá una para pagar tus reservas más rápido.</p></div>`}
<div class="wc wo"><span class="wi" aria-hidden="true">🟦</span><div><b>Mercado Pago</b><small>Disponible al pagar una reserva</small></div></div>
<div class="wc wo"><span class="wi" aria-hidden="true">🏦</span><div><b>Transferencia bancaria</b><small>Disponible al pagar una reserva</small></div></div></div>
<form id="fcard" hidden novalidate><h4>Nueva tarjeta</h4>${cardFields("w")}<p class="err" id="werr" role="alert"></p><div class="cta"><button class="btn" type="submit">Guardar tarjeta</button><button class="btn o" type="button" id="ccan">Cancelar</button></div></form>`;
}
function pPass(){return `<h3>Cambiar contraseña</h3><form id="fpass" class="fgrid" novalidate>
<div class="f full"><label for="pc0">Contraseña actual</label><input id="pc0" type="password" autocomplete="current-password"></div>
<div class="f"><label for="pc1">Nueva contraseña</label><input id="pc1" type="password" autocomplete="new-password"></div>
<div class="f"><label for="pc2">Repetir nueva contraseña</label><input id="pc2" type="password" autocomplete="new-password"></div>
<p class="err full" id="perr" role="alert"></p><div class="full"><button class="btn" type="submit">Actualizar contraseña</button></div></form>`}

function readPhoto(file){return new Promise((ok,ko)=>{const fr=new FileReader();fr.onerror=ko;fr.onload=()=>{const im=new Image();im.onerror=ko;im.onload=()=>{const S=240,c=document.createElement("canvas");c.width=c.height=S;const m=Math.min(im.width,im.height);c.getContext("2d").drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,S,S);ok(c.toDataURL("image/jpeg",.82))};im.src=fr.result};fr.readAsDataURL(file)})}
const luhn=n=>{let s=0,d=false;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(d){x*=2;if(x>9)x-=9}s+=x;d=!d}return s%10===0};
const brandOf=n=>/^4/.test(n)?"Visa":/^(5[1-5]|2[2-7])/.test(n)?"Mastercard":/^3[47]/.test(n)?"American Express":"Tarjeta";
function readCard(p){
 const h=$(p+"h").value.trim(),n=$(p+"n").value.replace(/\D/g,""),e=$(p+"e").value.trim(),c=$(p+"c").value.trim();
 if(h.length<3)return{err:"Ingresá el nombre del titular tal como figura en la tarjeta."};
 if(n.length<13||n.length>19||!luhn(n))return{err:"El número de tarjeta no es válido."};
 const m=e.match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);if(!m)return{err:"El vencimiento debe tener el formato MM/AA."};
 const now=new Date(),y=2000+ +m[2],mo=+m[1];if(y<now.getFullYear()||(y===now.getFullYear()&&mo<now.getMonth()+1))return{err:"La tarjeta está vencida."};
 if(!/^\d{3,4}$/.test(c))return{err:"Ingresá el código de seguridad (3 o 4 dígitos)."};
 return{brand:brandOf(n),last4:n.slice(-4),exp:m[1]+"/"+m[2],holder:h};
}
document.addEventListener("input",e=>{
 const t=e.target;
 if(t.matches&&t.matches("[data-cn]")){const d=t.value.replace(/\D/g,"").slice(0,19);t.value=d.replace(/(.{4})/g,"$1 ").trim()}
 if(t.matches&&t.matches("[data-ce]")){let d=t.value.replace(/\D/g,"").slice(0,4);if(d.length>2)d=d.slice(0,2)+"/"+d.slice(2);t.value=d}
});

const cta=$("acm");
cta.addEventListener("click",e=>{if(e.target.closest("a[href^='#']"))closeM("acm")});
cta.addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 if(t.dataset.vf){vf=t.dataset.vf;return render()}
 if(t.dataset.bpdf){const b=getB().find(x=>x.id===t.dataset.bpdf);return b&&dl(b)}
 if(t.dataset.bres)return openCheckout({bud:t.dataset.bres});
 if(t.dataset.bdel){setB(getB().filter(x=>x.id!==t.dataset.bdel));return render()}
 if(t.dataset.star){const rs=getR(),r=rs.find(x=>x.id===t.dataset.r);if(r){r.cal=+t.dataset.star;setR(rs);render();toast("¡Gracias por calificar tu viaje!")}return}
 if(t.dataset.nom)return openNom(t.dataset.nom,!!t.dataset.ro);
 if(t.dataset.lg)return openLogin(t.dataset.lg);
 if(t.dataset.out)return logout();
 if(t.dataset.t){tab=t.dataset.t;return render()}
 if(t.dataset.pay)return openCheckout({res:t.dataset.pay});
 if(t.dataset.x){if(confirm("¿Querés cancelar esta reserva? Si abonaste una seña, se aplica la política de “Cambios y devoluciones”.")){setR(getR().map(r=>r.id===t.dataset.x?{...r,est:"Cancelada"}:r));render();toast("Reserva cancelada.")}return}
 if(t.dataset.d){setR(getR().filter(r=>r.id!==t.dataset.d));return render()}
 if(t.id==="fpick")return $("ffoto").click();
 if(t.id==="fquit"){me.foto="";saveMe();return render()}
 if(t.id==="cadd"){$("fcard").hidden=false;$("wh").focus();return}
 if(t.id==="ccan"){$("fcard").hidden=true;return}
 if(t.dataset.def){me.cards.forEach(c=>c.def=c.id===t.dataset.def);saveMe();return render()}
 if(t.dataset.del){me.cards=me.cards.filter(c=>c.id!==t.dataset.del);if(me.cards.length&&!me.cards.some(c=>c.def))me.cards[0].def=true;saveMe();return render()}
});
cta.addEventListener("change",async e=>{
 if(e.target.id!=="ffoto")return;const f=e.target.files[0];if(!f)return;
 if(!f.type.startsWith("image/")||f.size>8e6){toast("Elegí una imagen de hasta 8 MB.");return}
 try{me.foto=await readPhoto(f);saveMe();render();toast("Foto actualizada.")}catch(x){toast("No pudimos leer esa imagen.")}
});
cta.addEventListener("submit",async e=>{
 e.preventDefault();const id=e.target.id;
 if(id==="fdat"){
  const n=$("dn").value.trim();if(!n)return $("derr").textContent="El nombre no puede quedar vacío.";
  Object.assign(me,{name:n,tel:$("dt").value.trim(),org:$("do").value.trim(),city:$("dc").value.trim()});saveMe();render();toast("Datos guardados.");
 }
 if(id==="fcard"){
  const r=readCard("w");if(r.err)return $("werr").textContent=r.err;
  me.cards=me.cards||[];me.cards.push({id:"c"+Date.now(),...r,def:!me.cards.length});saveMe();render();toast(`${r.brand} •••• ${r.last4} guardada en tu billetera.`);
 }
 if(id==="fpass"){
  const er=m=>$("perr").textContent=m;
  if(await H($("pc0").value,me.email)!==me.hash)return er("La contraseña actual no es correcta.");
  if($("pc1").value.length<6)return er("La nueva contraseña debe tener al menos 6 caracteres.");
  if($("pc1").value!==$("pc2").value)return er("Las contraseñas nuevas no coinciden.");
  me.hash=await H($("pc1").value,me.email);saveMe();render();toast("Contraseña actualizada.");
 }
});
/* ---------- nómina de pasajeros (se carga hasta 48 hs antes de la salida) ---------- */
let NM=null;
function openNom(id,ro){const r=getR().find(x=>x.id===id);if(!r)return;NM={id};
 $("nmb").innerHTML=`<h3>Nómina de pasajeros</h3><p class="mu">Reserva ${esc(r.id)} · ${esc(r.or)} → ${esc(r.de)} · ${esc(fdate(r.fe))} ${esc(r.hs||"")} hs · capacidad ${capOf(r)} pasajeros.</p><p class="mu">Escribí o pegá un pasajero por línea: <b>Apellido y nombre, DNI</b> (podés copiar y pegar desde Excel).</p><textarea id="nmt" rows="10" ${ro?"readonly":""} placeholder="Pérez Juan, 30123456">${esc((r.nom||[]).map(p=>p.n+", "+p.d).join("\n"))}</textarea><p class="mu" id="nmc"></p><p class="err" id="nme" role="alert"></p><div class="cta">${ro?"":'<button class="btn" id="nms" type="button">Guardar nómina</button>'}<button class="btn o" id="nmk" type="button">Cerrar</button></div>`;
 nmCount();openM("nmm")}
function nmParse(){const out=[],bad=[];($("nmt").value||"").split(/\n/).forEach((l,i)=>{l=l.trim();if(!l)return;const m=l.match(/^(.+?)[,;\t]\s*([\d.\s]{6,12})$/),d=m&&m[2].replace(/\D/g,"");if(m&&d.length>=6&&d.length<=9)out.push({n:m[1].trim(),d});else bad.push(i+1)});return{out,bad}}
function nmCount(){const r=getR().find(x=>x.id===NM.id),{out,bad}=nmParse();$("nmc").textContent=`${out.length} de ${capOf(r)} pasajeros${bad.length?` · revisá la línea ${bad.slice(0,5).join(", ")}`:""}`}
$("nmb").addEventListener("input",e=>{if(e.target.id==="nmt")nmCount()});
$("nmb").addEventListener("click",e=>{
 if(e.target.id==="nmk")return closeM("nmm");
 if(e.target.id!=="nms")return;
 const rs=getR(),r=rs.find(x=>x.id===NM.id),{out,bad}=nmParse(),cap=capOf(r),er=m=>$("nme").textContent=m;
 if(bad.length)return er(`Revisá la línea ${bad[0]}: tiene que ser “Apellido y nombre, DNI”.`);
 if(!out.length)return er("Cargá al menos un pasajero.");
 if(out.length>cap)return er(`La unidad tiene ${cap} asientos y cargaste ${out.length} pasajeros.`);
 if(new Set(out.map(x=>x.d)).size<out.length)return er("Hay DNI repetidos en la lista.");
 if(Date.now()>=when(r).getTime()-48*36e5)return er("El plazo de carga (48 hs antes de la salida) ya venció.");
 r.nom=out;setR(rs);closeM("nmm");render();toast(`Nómina guardada: ${out.length} pasajeros.`);
});
setInterval(()=>{if(!$("acm").classList.contains("on")||tab!=="res")return;document.querySelectorAll("[data-live]").forEach(el=>{const r=getR().find(x=>x.id===el.dataset.live);if(r){const I=info(r);if(I.k==="curso"&&!I.ab)el.outerHTML=live(r,I)}})},3000);
/* ---------- pago: seña o total ---------- */
const sena=()=>Math.round(CK.q.t*SENA);
const val=n=>{const r=document.querySelector(`#pgb input[name="${n}"]:checked`);return r?r.value:""};
function openCheckout(o){
 if(!o.res&&!o.bud){const q=window.__q;if(!q||!q.or||!q.de){toast("Indicá el origen y el destino antes de reservar.");go("cotizador");return}if(!q.t){toast("Revisá los días del abono: no hay días de servicio en ese rango.");return}}
 if(!me){openLogin("in","Iniciá sesión o creá tu usuario para reservar.",()=>openCheckout(o));return}
 let q,pagado=0,resId=null;
 if(o.res){const r=getR().find(x=>x.id===o.res);if(!r)return;q=r;pagado=r.pago?r.pago.pagado:0;resId=r.id}else if(o.bud){const b=getB().find(x=>x.id===o.bud);if(!b)return;q=b.q}else q=window.__q;
 CK={q,resId,pagado,saldo:q.t-pagado,bud:o.bud||null};
 const s=sena(),cs=me.cards||[],dm=cs.length?"card:"+(cs.find(c=>c.def)||cs[0]).id:"new";
 $("pgh").textContent=resId?"Pagar tu reserva":"Confirmá tu reserva";
 $("pgb").innerHTML=`<p class="mu">Revisá el resumen y elegí cómo abonar.</p>
<div class="sumy"><b>${esc(q.or)} → ${esc(q.de)}</b><span>${esc(fdate(q.fe))}${q.hs?" · "+esc(q.hs)+" hs":""} · ${esc(q.u)} · ${esc(q.km)} km · ${esc(tvl(q))}</span><div class="ln2"><span>Importe total estimado</span><b>${fmt(q.t)}</b></div>${pagado>0?`<div class="ln2"><span>Ya abonado</span><b>${fmt(pagado)}</b></div>`:""}</div>
<fieldset class="opts"><legend>¿Cómo querés abonar?</legend>${pagado===0?`<label class="opt"><input type="radio" name="pm" value="sena" checked><span><b>Señar ahora · ${fmt(s)}</b><small>${Math.round(SENA*100)}% del total para reservar la unidad. El saldo de ${fmt(q.t-s)} se abona antes del viaje.</small></span></label><label class="opt"><input type="radio" name="pm" value="total"><span><b>Pagar el total · ${fmt(q.t)}</b><small>Dejás la reserva totalmente abonada.</small></span></label>`:`<label class="opt"><input type="radio" name="pm" value="saldo" checked><span><b>Pagar el saldo · ${fmt(CK.saldo)}</b><small>Completás el pago de esta reserva.</small></span></label>`}</fieldset>
<fieldset class="opts"><legend>Factura</legend><label class="opt"><input type="radio" name="fc" value="B" ${(me.fact?"":"checked")}><span><b>Factura B</b><small>Consumidor final o monotributista</small></span></label><label class="opt"><input type="radio" name="fc" value="A" ${me.fact?"checked":""}><span><b>Factura A</b><small>Responsable inscripto: necesitamos tu CUIT y razón social</small></span></label>
<div id="fca" class="fgrid cf" hidden><div class="f"><label for="fcu">CUIT</label><input id="fcu" inputmode="numeric" maxlength="13" placeholder="30-12345678-9" value="${esc((me.fact||{}).cu||"")}"></div><div class="f"><label for="frs">Razón social</label><input id="frs" value="${esc((me.fact||{}).rs||"")}"></div></div></fieldset>
<fieldset class="opts"><legend>Medio de pago</legend>${cs.map(c=>`<label class="opt"><input type="radio" name="mp" value="card:${esc(c.id)}" ${"card:"+c.id===dm?"checked":""}><span><b>${esc(c.brand)} •••• ${esc(c.last4)}</b><small>${esc(c.holder)} · vence ${esc(c.exp)}</small></span></label>`).join("")}
<label class="opt"><input type="radio" name="mp" value="new" ${dm==="new"?"checked":""}><span><b>Tarjeta de crédito o débito</b><small>Ingresar una tarjeta nueva</small></span></label>
<div id="pgn" hidden>${cardFields("pc")}<label class="chk"><input type="checkbox" id="pgs" checked><span>Guardar esta tarjeta en mi billetera</span></label></div>
<label class="opt"><input type="radio" name="mp" value="mp"><span><b>Mercado Pago</b><small>Pagás desde tu cuenta de Mercado Pago</small></span></label>
<label class="opt"><input type="radio" name="mp" value="tr"><span><b>Transferencia bancaria</b><small>La reserva queda pendiente hasta que se acredite el pago</small></span></label></fieldset>
<p class="mu" id="pgi"></p>
<label class="chk"><input type="checkbox" id="pgk"><span>Acepto los <a href="#legales" data-lgl="terminos">Términos y condiciones</a> y la política de <a href="#legales" data-lgl="cambios">cambios y devoluciones</a>.</span></label>
<p class="err" id="pgerr" role="alert"></p>
<button class="btn" id="pgpay" type="button" style="justify-content:center;width:100%"></button>
<p class="nt2">Prototipo: no se realiza ningún cobro real. De las tarjetas solo se guardan la marca y los últimos 4 dígitos.</p>`;
 ckSync();openM("pgm");
}
function ckSync(){
 const q=CK.q,pm=val("pm"),mp=val("mp"),monto=pm==="sena"?sena():pm==="total"?q.t:CK.saldo;
 $("pgn").hidden=mp!=="new";$("fca").hidden=val("fc")!=="A";
 $("pgi").textContent=mp==="mp"?"Te vamos a llevar a Mercado Pago para completar el pago (simulado en este prototipo).":mp==="tr"?"Al confirmar te mostramos los datos para transferir. El importe tiene que acreditarse para confirmar la reserva.":"";
 $("pgpay").textContent=mp==="tr"?`Reservar y pagar por transferencia · ${fmt(monto)}`:`Pagar ${fmt(monto)}`;
}
$("pgb").addEventListener("change",e=>{if(["pm","mp","fc"].includes(e.target.name))ckSync()});
$("pgb").addEventListener("click",e=>{
 if(e.target.id==="pgpay")pay();
 if(e.target.id==="pgv"){closeM("pgm");openAcct("res")}
 if(e.target.id==="pgc")closeM("pgm");
});
async function pay(){
 const q=CK.q,pm=val("pm"),mp=val("mp"),err=m=>{$("pgerr").textContent=m};
 if(!$("pgk").checked)return err("Para continuar tenés que aceptar los Términos y condiciones.");
 const ft=val("fc")||"B",fact={t:ft};
 if(ft==="A"){const cu=$("fcu").value.replace(/\D/g,""),rz=$("frs").value.trim();if(!cuitOk(cu))return err("Para Factura A ingresá un CUIT válido (11 dígitos).");if(rz.length<3)return err("Para Factura A ingresá la razón social.");fact.cu=cu.replace(/^(\d{2})(\d{8})(\d)$/,"$1-$2-$3");fact.rs=rz;me.fact={cu:fact.cu,rs:rz};saveMe()}
 let card=null,medio="";
 if(mp==="new"){const r=readCard("pc");if(r.err)return err(r.err);card=r;medio=`${r.brand} •••• ${r.last4}`}
 else if(mp.startsWith("card:")){const c=(me.cards||[]).find(x=>x.id===mp.slice(5));if(!c)return err("Elegí un medio de pago.");medio=`${c.brand} •••• ${c.last4}`}
 else medio=mp==="mp"?"Mercado Pago":"Transferencia bancaria";
 err("");const wp=window.open("","_blank"),b=$("pgpay");b.disabled=true;b.textContent="Procesando…";
 await new Promise(r=>setTimeout(r,reduce?0:900));
 const monto=pm==="sena"?sena():pm==="total"?q.t:CK.saldo,tr=mp==="tr";
 if(card&&$("pgs").checked){me.cards=me.cards||[];me.cards.push({id:"c"+Date.now(),...card,def:!me.cards.length});saveMe()}
 const pagado=CK.pagado+(tr?0:monto),pago={modo:pm,monto,pagado,medio},est=tr?"Pendiente de pago":"Confirmada",rs=getR();let id=CK.resId;fact.nro=ft+" 0003-"+String(Math.floor(Math.random()*90000)+10000).padStart(8,"0");const pg={f:new Date().toISOString(),monto,modo:pm,medio,tr,fact};
 if(id){const r=rs.find(x=>x.id===id);r.pago=pago;r.est=est;r.pagos=[...pagosOf(r),pg]}
 else{id="NE-"+(3000+Math.floor(Math.random()*6999));rs.unshift({id,fe:q.fe,hs:q.hs,hr:q.hr,es:q.es,u:q.u,uk:q.uk,or:q.or,de:q.de,km:q.km,ida:false,tvn:q.tvn,ab:q.ab,det:q.det,t:q.t,est,pago,pagos:[pg],ro:q.ro||$("gmr").href});if(CK.bud){const bs=getB(),bb=bs.find(x=>x.id===CK.bud);if(bb){bb.res=id;setB(bs)}}}
 setR(rs);tab="res";render();
 const sal=q.t-pagado,msg=`Hola Nueva Era! Hice la reserva ${id}: ${q.u}, ${q.or} → ${q.de}, ${q.km} km, ${tvl(q)}, salida ${q.fe} ${q.hs||""}${q.hr?", regreso "+q.hr:""}.${q.ab?` Abono hasta el ${q.ab.h} (${q.ab.dias} días: ${q.ab.dl}).`:""} Total ${fmt(q.t)}; ${tr?"pago por transferencia pendiente":"abonado "+fmt(monto)+" ("+medio+")"}. Factura ${ft}${fact.rs?" - "+fact.rs+" CUIT "+fact.cu:""}. Cliente: ${me.name} (${me.email}).`;if(wp)wp.location.href=waUrl(msg);
 $("pgh").textContent=tr?"Reserva registrada":"¡Pago recibido!";
 $("pgb").innerHTML=`<div class="okv"><div class="ic okic" aria-hidden="true">${tr?"⏳":"✓"}</div>
<h3>${tr?`Reserva ${esc(id)} pendiente de pago`:`Reserva ${esc(id)} confirmada`}</h3>
${tr?`<div class="sumy"><b>Datos para transferir ${fmt(monto)}</b>${BANCO.cbu||BANCO.alias?`${BANCO.cbu?`<span>CBU: ${esc(BANCO.cbu)}</span>`:""}${BANCO.alias?`<span>Alias: ${esc(BANCO.alias)}</span>`:""}<span>Titular: ${esc(BANCO.titular)}</span>`:`<span>Pedí el CBU o alias por WhatsApp para transferir.</span>`}</div><p class="mu">Cuando transfieras, enviá el comprobante por WhatsApp y confirmamos tu reserva.</p><a class="btn y" target="_blank" rel="noopener" href="${esc(waUrl(`Hola Nueva Era! Reservé el viaje ${id} y pago por transferencia ${fmt(monto)}. Te envío el comprobante.`))}">Enviar comprobante por WhatsApp</a>`:`<p>Abonaste <b>${fmt(monto)}</b> con ${esc(medio)}. ${sal>0?`Te queda un saldo de <b>${fmt(sal)}</b> para pagar antes del viaje desde Mis reservas.`:"La reserva quedó totalmente abonada."}</p>`}
<div class="cta" style="margin-top:18px"><a class="btn wa" target="_blank" rel="noopener" href="${waUrl(msg)}"><span class="wai">${WA_SVG}</span>Avisar al asesor por WhatsApp</a><button class="btn" id="pgv" type="button">Ver mis viajes</button><button class="btn o" id="pgc" type="button">Cerrar</button></div>
<p class="nt2">Prototipo: no se realizó ningún cobro real.</p></div>`;
}
$("rs").onclick=()=>openCheckout({});
if(me)seed();
render();
})();
