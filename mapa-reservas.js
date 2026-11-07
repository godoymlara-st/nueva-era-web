(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mem={},ST={get(k){try{const v=localStorage.getItem(k);if(v!=null)return v}catch(e){}return mem[k]??null},set(k,v){mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}},del(k){delete mem[k];try{localStorage.removeItem(k)}catch(e){}}};

/* ---------- MAPA / PUNTOS EXACTOS ---------- */
const P=window.__pts={or:null,de:null},NM={or:"origen",de:"destino"};
const hasL=typeof L!=="undefined";
let map=null,mk={},line=null,mode=null,tm={},rseq=0,sugs={or:[],de:[]};
const ll=p=>p.lat.toFixed(6)+","+p.lng.toFixed(6);
function stat(t){$("mst").textContent=t}
function defStat(){
 if(!hasL)return;
 if(!P.or&&!P.de)return stat("Escribí una dirección y elegí una sugerencia, o tocá el mapa para fijar el punto exacto. Podés arrastrar los pines A y B para ajustarlos.");
 if(!P.or)return stat("Falta fijar el punto exacto de salida (A).");
 if(!P.de)return stat("Falta fijar el punto exacto de llegada (B).");
}
function links(){
 const o=P.or,d=P.de,q=k=>encodeURIComponent($(k).value||"Mendoza, Argentina");
 $("gmo").href=o?`https://www.google.com/maps/search/?api=1&query=${ll(o)}`:`https://www.google.com/maps/search/?api=1&query=${q("or")}`;
 $("gmd").href=d?`https://www.google.com/maps/search/?api=1&query=${ll(d)}`:`https://www.google.com/maps/search/?api=1&query=${q("de")}`;
 $("gmr").href=`https://www.google.com/maps/dir/?api=1&origin=${o?ll(o):encodeURIComponent($("or").value||"")}&destination=${d?ll(d):encodeURIComponent($("de").value||"")}&travelmode=driving`;
 if(typeof calc==="function")calc();
}
function pin(k){return L.divIcon({className:"pin "+k,html:`<span><b>${k==="or"?"A":"B"}</b></span>`,iconSize:[34,34],iconAnchor:[17,40]})}
function setPoint(k,lat,lng,label,o){
 o=o||{};
 P[k]={lat,lng,url:`https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`};
 if(label!=null)$(k).value=label;
 if(map){
  if(mk[k])mk[k].setLatLng([lat,lng]);
  else{mk[k]=L.marker([lat,lng],{draggable:true,icon:pin(k),title:"Punto de "+NM[k]+" (arrastrá para ajustar)"}).addTo(map);
   mk[k].on("dragend",()=>{const p=mk[k].getLatLng();setPoint(k,p.lat,p.lng,p.lat.toFixed(5)+", "+p.lng.toFixed(5),{rev:1,noFit:1})})}
 }
 links();
 if(o.rev)reverse(k);
 route(o.noFit);
}
function clearPoint(k){
 if(!P[k])return;
 P[k]=null;if(map&&mk[k]){map.removeLayer(mk[k]);delete mk[k]}
 if(map&&line){map.removeLayer(line);line=null}
 links();defStat();
}
async function reverse(k){
 const p=P[k];if(!p)return;
 try{
  const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&zoom=18&lat=${p.lat}&lon=${p.lng}`);
  const j=await r.json();
  if(P[k]===p&&j&&j.display_name){$(k).value=j.display_name.replace(/, Argentina$/,"");links()}
 }catch(e){}
}
async function geo(q){
 const r=await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=es&countrycodes=ar&viewbox=-70.6,-32.0,-66.5,-37.6&q="+encodeURIComponent(q));
 if(!r.ok)throw new Error(r.status);return r.json();
}
function parseLL(t){
 const m=t.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||t.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)||t.match(/[?&](?:q|query|ll|destination|origin)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/)||t.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)\s*$/);
 if(!m)return null;const a=+m[1],b=+m[2];return Math.abs(a)<=90&&Math.abs(b)<=180?[a,b]:null;
}
function showSug(k,list){
 sugs[k]=list;const ul=$("sg"+k);
 if(!list.length){ul.hidden=true;ul.innerHTML="";return}
 ul.innerHTML=list.map((r,i)=>`<li role="option" tabindex="0" data-i="${i}">${esc(r.display_name.replace(/, Argentina$/,""))}</li>`).join("");ul.hidden=false;
}
function pick(k,i){const r=sugs[k][i];if(!r)return;$("sg"+k).hidden=true;setPoint(k,+r.lat,+r.lon,r.display_name.replace(/, Argentina$/,""))}
function wire(k){
 const inp=$(k),ul=$("sg"+k);
 inp.addEventListener("input",()=>{
  clearTimeout(tm[k]);const v=inp.value.trim();
  if(P[k])clearPoint(k);
  if(v.length<3){showSug(k,[]);return}
  const c=parseLL(v);
  if(c){tm[k]=setTimeout(()=>{showSug(k,[]);setPoint(k,c[0],c[1],c[0].toFixed(5)+", "+c[1].toFixed(5),{rev:1})},400);return}
  if(!hasL)return;
  tm[k]=setTimeout(async()=>{try{showSug(k,await geo(v))}catch(e){stat("No pudimos buscar la dirección ahora. Probá marcarla directamente en el mapa.")}},500);
 });
 inp.addEventListener("keydown",e=>{
  if(e.key==="Enter"){e.preventDefault();if(sugs[k].length)pick(k,0)}
  if(e.key==="Escape")ul.hidden=true;
  if(e.key==="ArrowDown"&&!ul.hidden){e.preventDefault();ul.firstElementChild&&ul.firstElementChild.focus()}
 });
 ul.addEventListener("click",e=>{const li=e.target.closest("li");li&&pick(k,+li.dataset.i)});
 ul.addEventListener("keydown",e=>{
  const li=e.target.closest("li");if(!li)return;
  if(e.key==="Enter"){e.preventDefault();pick(k,+li.dataset.i)}
  if(e.key==="ArrowDown"){e.preventDefault();li.nextElementSibling&&li.nextElementSibling.focus()}
  if(e.key==="ArrowUp"){e.preventDefault();(li.previousElementSibling||inp).focus()}
  if(e.key==="Escape"){ul.hidden=true;inp.focus()}
 });
 document.addEventListener("click",e=>{if(!e.target.closest("#sg"+k)&&e.target!==inp)ul.hidden=true});
}
function hav(a,b){const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dg=r(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function setKm(v,msg){$("km").value=Math.max(1,Math.round(v));stat(msg);if(typeof calc==="function")calc()}
const mins=s=>{const m=Math.round(s/60);return m<60?m+" min":Math.floor(m/60)+" h "+(m%60?m%60+" min":"")};
async function route(noFit){
 const o=P.or,d=P.de,my=++rseq;
 if(map&&line){map.removeLayer(line);line=null}
 if(!o||!d){if(map&&!noFit){const a=o||d;a&&map.setView([a.lat,a.lng],14)}defStat();return}
 stat("Calculando la ruta…");
 try{
  const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${o.lng},${o.lat};${d.lng},${d.lat}?overview=full&geometries=geojson`);
  const j=await r.json();if(my!==rseq)return;
  if(j.code!=="Ok")throw 0;
  const rt=j.routes[0];
  if(map){line=L.geoJSON(rt.geometry,{style:{color:"#e8300d",weight:5,opacity:.85}}).addTo(map);if(!noFit)map.fitBounds(line.getBounds(),{padding:[34,34]})}
  setKm(rt.distance/1000,`Ruta por calles: ${(rt.distance/1000).toFixed(1)} km · unos ${mins(rt.duration)} de viaje. Los km del cotizador se actualizaron (podés ajustarlos).`);
 }catch(e){
  if(my!==rseq)return;
  const km=hav(o,d)*1.3;
  if(map){line=L.polyline([[o.lat,o.lng],[d.lat,d.lng]],{color:"#e8300d",weight:4,dashArray:"6 8"}).addTo(map);if(!noFit)map.fitBounds(line.getBounds(),{padding:[34,34]})}
  setKm(km,"No se pudo trazar la ruta por calles; estimamos los km en línea recta (×1,3). Podés ajustarlos a mano.");
 }
}
function initMap(){
 const el=$("map");
 if(!hasL){el.innerHTML='<div class="mapoff">No se pudo cargar el mapa (revisá tu conexión). Igual podés escribir los km a mano o abrir Google Maps con los botones de abajo.</div>';["mo","md","mg"].forEach(i=>$(i).disabled=true);return}
 map=L.map(el,{scrollWheelZoom:false}).setView([-32.97,-68.79],9);
 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
 map.on("click",e=>{
  const k=mode||(!P.or?"or":!P.de?"de":null);
  if(!k){stat("Ya tenés los dos puntos. Arrastrá los pines A y B para moverlos, o usá los botones para volver a marcarlos.");return}
  setMode(null);
  setPoint(k,e.latlng.lat,e.latlng.lng,e.latlng.lat.toFixed(5)+", "+e.latlng.lng.toFixed(5),{rev:1,noFit:1});
 });
 el.addEventListener("focusin",()=>map.scrollWheelZoom.enable());el.addEventListener("mouseleave",()=>map.scrollWheelZoom.disable());
 setTimeout(()=>map.invalidateSize(),300);
}
function setMode(k){
 mode=(mode===k)?null:k;
 $("mo").classList.toggle("on",mode==="or");$("md").classList.toggle("on",mode==="de");
 if(mode)stat(`Tocá el mapa para marcar el punto exacto de ${NM[mode]}.`);else defStat();
}
$("mo").onclick=()=>setMode("or");$("md").onclick=()=>setMode("de");
$("mg").onclick=()=>{
 if(!navigator.geolocation)return stat("Tu navegador no permite obtener la ubicación.");
 stat("Buscando tu ubicación…");
 navigator.geolocation.getCurrentPosition(p=>{setPoint("or",p.coords.latitude,p.coords.longitude,p.coords.latitude.toFixed(5)+", "+p.coords.longitude.toFixed(5),{rev:1})},()=>stat("No pudimos obtener tu ubicación. Revisá los permisos del navegador o marcá el punto en el mapa."),{enableHighAccuracy:true,timeout:10000});
};
wire("or");wire("de");initMap();links();

/* ---------- SESIÓN Y RESERVAS ---------- */
let user=null,pend=false,lastFocus=null,lgMode="in";
try{user=JSON.parse(ST.get("ne_user")||"null")}catch(e){}
const first=n=>String(n||"").trim().split(/\s+/)[0]||"";
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const rk=()=>"ne_res_"+user.email;
function getR(){try{return JSON.parse(ST.get(rk())||"null")}catch(e){return null}}
function setR(a){ST.set(rk(),JSON.stringify(a))}
function seed(){
 if(getR()!==null)return;
 const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
 setR([{id:"NE-2087",demo:1,fe:d(12),u:"Ómnibus",or:"Maipú, Mendoza",de:"Potrerillos, Mendoza",km:60,ida:false,t:408000,est:"Confirmada",ro:"https://www.google.com/maps/dir/?api=1&origin=Maip%C3%BA%2C%20Mendoza&destination=Potrerillos%2C%20Mendoza&travelmode=driving"},
 {id:"NE-2112",demo:1,fe:d(26),u:"Sprinter",or:"Luján de Cuyo, Mendoza",de:"Tunuyán, Mendoza",km:85,ida:false,t:343000,est:"Pendiente de confirmación",ro:"https://www.google.com/maps/dir/?api=1&origin=Luj%C3%A1n%20de%20Cuyo%2C%20Mendoza&destination=Tunuy%C3%A1n%2C%20Mendoza&travelmode=driving"}]);
}
const fdate=s=>{try{return new Date(s+"T00:00:00Z").toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}catch(e){return s||"A definir"}};
function render(){
 const el=$("rsv"),b=$("acc");b.textContent=user?"👤 "+first(user.name):"Ingresar";
 if(!user){el.innerHTML=`<div class="card empty"><div class="ic">🔒</div><h3>Iniciá sesión para ver tus reservas</h3><p>Con tu cuenta podés reservar traslados, seguir su estado y volver a ver el recorrido cuando quieras.</p><div class="cta"><button class="btn" data-lg="in">Ingresar</button><button class="btn o" data-lg="up">Crear cuenta</button></div></div>`;return}
 const rs=getR()||[];
 let h=`<div class="rh"><span>Sesión iniciada como <b style="color:var(--tx)">${esc(user.name)}</b> · ${esc(user.email)}</span><button class="btn o" data-out="1" style="padding:9px 18px;font-size:13px">Cerrar sesión</button></div>`;
 if(!rs.length)h+=`<div class="card empty" style="margin-top:18px"><div class="ic">🚌</div><h3>Todavía no tenés reservas</h3><p>Cotizá un traslado y reservalo con un clic.</p><div class="cta"><a class="btn" href="#cotizador">Ir al cotizador</a></div></div>`;
 else h+=`<div class="rl">`+rs.map(r=>{
  const c=r.est==="Confirmada"?"ok":r.est==="Cancelada"?"no":"";
  return `<article class="rr"><div><span class="bd ${c}">${esc(r.est)}</span>${r.demo?'<span class="bd ej">Ejemplo</span>':""}<h3>${esc(r.or)} → ${esc(r.de)}</h3><p>${esc(fdate(r.fe))} · ${esc(r.u)} · ${esc(r.km)} km ${r.ida?"(solo ida)":"(ida y vuelta)"} · N° ${esc(r.id)}</p></div><div class="rt"><b>${fmt(r.t)}</b><small>importe estimado</small></div><div class="ra">${r.ro?`<a class="btn o" href="${esc(r.ro)}" target="_blank" rel="noopener">Ver ruta en Google Maps ↗</a>`:""}${r.est!=="Cancelada"?`<button class="btn o" data-x="${esc(r.id)}">Cancelar reserva</button>`:`<button class="btn o" data-d="${esc(r.id)}">Quitar de la lista</button>`}</div></article>`}).join("")+`</div>`;
 el.innerHTML=h;
}
$("rsv").addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 if(t.dataset.lg)return openLogin(t.dataset.lg);
 if(t.dataset.out)return logout();
 if(t.dataset.x&&confirm("¿Querés cancelar esta reserva?")){setR(getR().map(r=>r.id===t.dataset.x?{...r,est:"Cancelada"}:r));render();toast("Reserva cancelada.")}
 if(t.dataset.d){setR(getR().filter(r=>r.id!==t.dataset.d));render()}
});
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),4200)}
function saveRes(){
 const q=window.__q;if(!q)return;
 const id="NE-"+(3000+Math.floor(Math.random()*6999)),a=getR()||[];
 a.unshift({id,fe:q.fe,u:q.u,or:q.or||"Origen a definir",de:q.de||"Destino a definir",km:q.km,ida:q.ida,t:q.t,est:"Pendiente de confirmación",ro:$("gmr").href});
 setR(a);render();toast(`Reserva ${id} creada: quedó pendiente de confirmación.`);
 $("reservas").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
}
$("rs").onclick=()=>{if(!user){pend=true;openLogin("in","Iniciá sesión o creá tu cuenta para reservar este viaje.");return}saveRes()};
function setLg(m){
 lgMode=m;
 document.querySelectorAll("#lgtabs button").forEach(b=>b.classList.toggle("on",b.dataset.m===m));
 $("lgn").hidden=m!=="up";$("lgb").textContent=m==="up"?"Crear cuenta":"Ingresar";
 $("lgt").textContent=m==="up"?"Creá tu cuenta":"Ingresá a tu cuenta";
 $("lgp").autocomplete=m==="up"?"new-password":"current-password";$("lgerr").textContent="";
}
function openLogin(m,msg){
 lastFocus=document.activeElement;setLg(m||"in");
 $("lgs").textContent=msg||"Para ver y gestionar tus reservas.";
 $("lgm").classList.add("on");setTimeout(()=>(lgMode==="up"?$("lgnm"):$("lge")).focus(),30);
}
function closeLogin(){$("lgm").classList.remove("on");pend=false;lastFocus&&lastFocus.focus&&lastFocus.focus()}
document.querySelectorAll("#lgtabs button").forEach(b=>b.onclick=()=>setLg(b.dataset.m));
$("lgx").onclick=closeLogin;$("lgm").addEventListener("pointerdown",e=>{if(e.target===$("lgm"))closeLogin()});
addEventListener("keydown",e=>{if(e.key==="Escape"&&$("lgm").classList.contains("on"))closeLogin()});
$("lgf").onsubmit=e=>{
 e.preventDefault();
 const em=$("lge").value.trim().toLowerCase(),pw=$("lgp").value,nm=$("lgnm").value.trim(),err=m=>{$("lgerr").textContent=m};
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return err("Ingresá un email válido.");
 if(pw.length<6)return err("La contraseña debe tener al menos 6 caracteres.");
 if(lgMode==="up"&&!nm)return err("Contanos tu nombre o el de tu empresa.");
 let name=nm||ST.get("ne_acc_"+em)||cap(em.split("@")[0]);
 if(nm)ST.set("ne_acc_"+em,nm);
 user={name,email:em};ST.set("ne_user",JSON.stringify(user));
 $("lgp").value="";$("lgerr").textContent="";
 const doRes=pend;pend=false;
 $("lgm").classList.remove("on");seed();render();
 if(doRes)saveRes();else toast(`¡Hola, ${first(name)}! Sesión iniciada.`);
};
function logout(){user=null;ST.del("ne_user");render();toast("Cerraste sesión.")}
$("acc").onclick=()=>{$("nv").classList.remove("open");if(user)$("reservas").scrollIntoView({behavior:"smooth"});else openLogin("in")};
if(user)seed();
render();
})();
