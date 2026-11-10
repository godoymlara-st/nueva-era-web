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
const MODALS=["pgm","lgm","acm"];
function openM(id){lastFocus=document.activeElement;$(id).classList.add("on")}
function closeM(id){$(id).classList.remove("on");if(id==="lgm")pend=null;lastFocus&&lastFocus.focus&&lastFocus.focus()}
MODALS.forEach(id=>$(id).addEventListener("pointerdown",e=>{if(e.target===$(id))closeM(id)}));
$("lgx").onclick=()=>closeM("lgm");$("pgx").onclick=()=>closeM("pgm");$("acx").onclick=()=>closeM("acm");
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
  me={...acc,email:em};
 }
 ST.set("ne_user",JSON.stringify({email:em}));
 ["lgp","lgp2","lgnm"].forEach(i=>$(i).value="");$("lgerr").textContent="";$("lgt2").checked=false;
 const f=pend;pend=null;closeM("lgm");tab="res";render();
 if(f)f();else toast(`¡Hola, ${first(me.name)}! Sesión iniciada.`);
};
function logout(){me=null;ST.del("ne_user");tab="res";closeM("acm");render();toast("Cerraste sesión.")}

/* ---------- reservas de ejemplo ---------- */
function seed(){
 if(J(resK(me.email),null)!==null)return;
 const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
 const ro=(a,b)=>`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b)}&travelmode=driving`;
 setR([{id:"NE-2087",demo:1,fe:d(12),u:"Ómnibus",or:"Maipú, Mendoza",de:"Potrerillos, Mendoza",km:60,ida:false,t:408000,est:"Confirmada",pago:{modo:"sena",monto:122400,pagado:122400,medio:"Visa •••• 4242"},ro:ro("Maipú, Mendoza","Potrerillos, Mendoza")},
 {id:"NE-2112",demo:1,fe:d(26),u:"Sprinter",or:"Luján de Cuyo, Mendoza",de:"Tunuyán, Mendoza",km:85,ida:false,t:343000,est:"Pendiente de pago",pago:{modo:"total",monto:343000,pagado:0,medio:"Transferencia bancaria"},ro:ro("Luján de Cuyo, Mendoza","Tunuyán, Mendoza")}]);
}

/* ---------- cuenta (sección "Mi cuenta") ---------- */
const ini=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";
const avatar=sz=>me.foto?`<img class="avt" style="width:${sz}px;height:${sz}px" src="${me.foto}" alt="Tu foto de perfil">`:`<span class="avt ini" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz/2.6)}px" aria-hidden="true">${esc(ini(me.name))}</span>`;
const IC={
 res:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
 datos:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
 bill:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/>',
 pass:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
 out:'<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/>',
 chev:'<path d="M6 9l6 6 6-6"/>'};
const svg=k=>`<svg class="umi" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const TABS=[["res","Mis reservas"],["datos","Mis datos"],["bill","Billetera"],["pass","Contraseña"]];
function closeUm(){const m=$("umm");if(m&&!m.hidden){m.hidden=true;$("acc").setAttribute("aria-expanded","false")}}
function hdr(){
 const u=$("um");
 if(!me){u.innerHTML=`<button class="btn o ingb" id="acc" type="button">Ingresar</button>`;return}
 const n=getR().filter(r=>r.est!=="Cancelada").length;
 u.innerHTML=`<button class="umb" id="acc" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="umm">${avatar(32)}<span class="umn">${esc(first(me.name))}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC.chev}</svg></button>
<div class="umm" id="umm" role="menu" hidden><div class="umh">${avatar(60)}<div><b>¡Hola, ${esc(first(me.name))}!</b><small>${esc(me.email)}</small></div></div>
<div class="uml">${TABS.map(t=>`<button type="button" role="menuitem" data-open="${t[0]}">${svg(t[0])}<span>${t[1]}</span>${t[0]==="res"&&n?`<em>${n}</em>`:""}</button>`).join("")}</div>
<div class="uml uo"><button type="button" role="menuitem" data-out="1">${svg("out")}<span>Cerrar sesión</span></button></div></div>`;
}
function render(){
 hdr();
 $("acp").innerHTML=me?({res:pRes,datos:pDatos,bill:pBill,pass:pPass})[tab]():"";
}
function openAcct(t){if(!me)return openLogin("in");tab=t;render();openM("acm")}
$("um").addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 if(t.id==="acc"){if(!me)return openLogin("in");$("nv").classList.remove("open");const m=$("umm"),op=m.hidden;m.hidden=!op;t.setAttribute("aria-expanded",String(op));return}
 if(t.dataset.open){closeUm();return openAcct(t.dataset.open)}
 if(t.dataset.out){closeUm();return logout()}
});
document.addEventListener("pointerdown",e=>{if(!$("um").contains(e.target))closeUm()});
function pRes(){
 const rs=getR();
 let h=`<div class="rh"><h3>Mis reservas</h3><a class="btn" href="#cotizador" style="padding:9px 18px;font-size:13px">+ Nueva reserva</a></div>`;
 if(!rs.length)return h+`<div class="card empty" style="margin-top:18px"><div class="ic">🚌</div><h3>Todavía no tenés reservas</h3><p>Cotizá un traslado y reservalo con una seña o pagando el total.</p><div class="cta"><a class="btn" href="#cotizador">Ir al cotizador</a></div></div>`;
 return h+`<div class="rl">`+rs.map(r=>{
  const pg=r.pago||{pagado:0},sal=Math.max(0,r.t-pg.pagado),canc=r.est==="Cancelada";
  const c=r.est==="Confirmada"?"ok":canc?"no":"";
  const chip=canc?"":pg.pagado>=r.t?'<span class="bd ok">Pagada</span>':pg.pagado>0?`<span class="bd">Seña abonada · saldo ${fmt(sal)}</span>`:'<span class="bd">Sin pago acreditado</span>';
  return `<article class="rr"><div><span class="bd ${c}">${esc(r.est)}</span>${chip}${r.demo?'<span class="bd ej">Ejemplo</span>':""}<h3>${esc(r.or)} → ${esc(r.de)}</h3><p>${esc(fdate(r.fe))} · ${esc(r.u)} · ${esc(r.km)} km ${r.ida?"(solo ida)":"(ida y vuelta)"} · N° ${esc(r.id)}</p></div><div class="rt"><b>${fmt(r.t)}</b><small>importe estimado</small></div><div class="ra">${r.ro?`<a class="btn o" href="${esc(r.ro)}" target="_blank" rel="noopener">Ver ruta en Google Maps ↗</a>`:""}${!canc&&sal>0?`<button class="btn y" data-pay="${esc(r.id)}">${pg.pagado>0?"Pagar saldo · "+fmt(sal):"Pagar ahora"}</button>`:""}${!canc?`<button class="btn o" data-x="${esc(r.id)}">Cancelar reserva</button>`:`<button class="btn o" data-d="${esc(r.id)}">Quitar de la lista</button>`}</div></article>`}).join("")+`</div>`;
}
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
/* ---------- pago: seña o total ---------- */
const sena=()=>Math.round(CK.q.t*SENA);
const val=n=>{const r=document.querySelector(`#pgb input[name="${n}"]:checked`);return r?r.value:""};
function openCheckout(o){
 if(!o.res){const q=window.__q;if(!q||!q.or||!q.de){toast("Indicá el origen y el destino antes de reservar.");go("cotizador");return}}
 if(!me){openLogin("in","Iniciá sesión o creá tu usuario para reservar.",()=>openCheckout(o));return}
 let q,pagado=0,resId=null;
 if(o.res){const r=getR().find(x=>x.id===o.res);if(!r)return;q=r;pagado=r.pago?r.pago.pagado:0;resId=r.id}else q=window.__q;
 CK={q,resId,pagado,saldo:q.t-pagado};
 const s=sena(),cs=me.cards||[],dm=cs.length?"card:"+(cs.find(c=>c.def)||cs[0]).id:"new";
 $("pgh").textContent=resId?"Pagar tu reserva":"Confirmá tu reserva";
 $("pgb").innerHTML=`<p class="mu">Revisá el resumen y elegí cómo abonar.</p>
<div class="sumy"><b>${esc(q.or)} → ${esc(q.de)}</b><span>${esc(fdate(q.fe))} · ${esc(q.u)} · ${esc(q.km)} km ${q.ida?"(solo ida)":"(ida y vuelta)"}</span><div class="ln2"><span>Importe total estimado</span><b>${fmt(q.t)}</b></div>${pagado>0?`<div class="ln2"><span>Ya abonado</span><b>${fmt(pagado)}</b></div>`:""}</div>
<fieldset class="opts"><legend>¿Cómo querés abonar?</legend>${pagado===0?`<label class="opt"><input type="radio" name="pm" value="sena" checked><span><b>Señar ahora · ${fmt(s)}</b><small>${Math.round(SENA*100)}% del total para reservar la unidad. El saldo de ${fmt(q.t-s)} se abona antes del viaje.</small></span></label><label class="opt"><input type="radio" name="pm" value="total"><span><b>Pagar el total · ${fmt(q.t)}</b><small>Dejás la reserva totalmente abonada.</small></span></label>`:`<label class="opt"><input type="radio" name="pm" value="saldo" checked><span><b>Pagar el saldo · ${fmt(CK.saldo)}</b><small>Completás el pago de esta reserva.</small></span></label>`}</fieldset>
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
 $("pgn").hidden=mp!=="new";
 $("pgi").textContent=mp==="mp"?"Te vamos a llevar a Mercado Pago para completar el pago (simulado en este prototipo).":mp==="tr"?"Al confirmar te mostramos los datos para transferir. El importe tiene que acreditarse para confirmar la reserva.":"";
 $("pgpay").textContent=mp==="tr"?`Reservar y pagar por transferencia · ${fmt(monto)}`:`Pagar ${fmt(monto)}`;
}
$("pgb").addEventListener("change",e=>{if(e.target.name==="pm"||e.target.name==="mp")ckSync()});
$("pgb").addEventListener("click",e=>{
 if(e.target.id==="pgpay")pay();
 if(e.target.id==="pgv"){closeM("pgm");openAcct("res")}
 if(e.target.id==="pgc")closeM("pgm");
});
async function pay(){
 const q=CK.q,pm=val("pm"),mp=val("mp"),err=m=>{$("pgerr").textContent=m};
 if(!$("pgk").checked)return err("Para continuar tenés que aceptar los Términos y condiciones.");
 let card=null,medio="";
 if(mp==="new"){const r=readCard("pc");if(r.err)return err(r.err);card=r;medio=`${r.brand} •••• ${r.last4}`}
 else if(mp.startsWith("card:")){const c=(me.cards||[]).find(x=>x.id===mp.slice(5));if(!c)return err("Elegí un medio de pago.");medio=`${c.brand} •••• ${c.last4}`}
 else medio=mp==="mp"?"Mercado Pago":"Transferencia bancaria";
 err("");const b=$("pgpay");b.disabled=true;b.textContent="Procesando…";
 await new Promise(r=>setTimeout(r,reduce?0:900));
 const monto=pm==="sena"?sena():pm==="total"?q.t:CK.saldo,tr=mp==="tr";
 if(card&&$("pgs").checked){me.cards=me.cards||[];me.cards.push({id:"c"+Date.now(),...card,def:!me.cards.length});saveMe()}
 const pagado=CK.pagado+(tr?0:monto),pago={modo:pm,monto,pagado,medio},est=tr?"Pendiente de pago":"Confirmada",rs=getR();let id=CK.resId;
 if(id){const r=rs.find(x=>x.id===id);r.pago=pago;r.est=est}
 else{id="NE-"+(3000+Math.floor(Math.random()*6999));rs.unshift({id,fe:q.fe,u:q.u,or:q.or,de:q.de,km:q.km,ida:q.ida,t:q.t,est,pago,ro:$("gmr").href})}
 setR(rs);tab="res";render();
 const sal=q.t-pagado;
 $("pgh").textContent=tr?"Reserva registrada":"¡Pago recibido!";
 $("pgb").innerHTML=`<div class="okv"><div class="ic okic" aria-hidden="true">${tr?"⏳":"✓"}</div>
<h3>${tr?`Reserva ${esc(id)} pendiente de pago`:`Reserva ${esc(id)} confirmada`}</h3>
${tr?`<div class="sumy"><b>Datos para transferir ${fmt(monto)}</b>${BANCO.cbu||BANCO.alias?`${BANCO.cbu?`<span>CBU: ${esc(BANCO.cbu)}</span>`:""}${BANCO.alias?`<span>Alias: ${esc(BANCO.alias)}</span>`:""}<span>Titular: ${esc(BANCO.titular)}</span>`:`<span>Pedí el CBU o alias por WhatsApp para transferir.</span>`}</div><p class="mu">Cuando transfieras, enviá el comprobante por WhatsApp y confirmamos tu reserva.</p><a class="btn y" target="_blank" rel="noopener" href="${esc(waUrl(`Hola Nueva Era! Reservé el viaje ${id} y pago por transferencia ${fmt(monto)}. Te envío el comprobante.`))}">Enviar comprobante por WhatsApp</a>`:`<p>Abonaste <b>${fmt(monto)}</b> con ${esc(medio)}. ${sal>0?`Te queda un saldo de <b>${fmt(sal)}</b> para pagar antes del viaje desde Mis reservas.`:"La reserva quedó totalmente abonada."}</p>`}
<div class="cta" style="margin-top:18px"><button class="btn" id="pgv" type="button">Ver mis reservas</button><button class="btn o" id="pgc" type="button">Cerrar</button></div>
<p class="nt2">Prototipo: no se realizó ningún cobro real.</p></div>`;
}
$("rs").onclick=()=>openCheckout({});
render();
})();
