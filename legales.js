/* Ayuda y aspectos legales (footer). Todos los datos editables están en el bloque D de abajo. */
(function(){
const $=id=>document.getElementById(id);
/* ===== DATOS DE LA EMPRESA Y CONDICIONES (editar acá) =====
   Los datos de la empresa que queden vacíos ("") simplemente no se muestran. */
const D={
 razon:"", cuit:"", direccion:"", email:"nuevaeracontacto@gmail.com", habilitaciones:"",
 whatsapp:"+54 9 261 609-8573",
 cbu:BANCO.cbu, alias:BANCO.alias,   // se cargan en app.js (const BANCO)
 cambioHs:72,                       // anticipación mínima para pedir un cambio
 cancelA:{dias:7,pct:80},           // cancelación con más de X días: se devuelve el % de lo abonado
 cancelB:{dias:2,pct:50},           // entre cancelA.dias y cancelB.dias: se devuelve el %
 sinDevHs:48,                       // con menos de X horas: no se devuelve la seña
 plazoDev:10,                       // días hábiles para devolver
 guardadoDias:30,                   // días que se guardan los objetos perdidos
 jurisdiccion:"los tribunales ordinarios de la Provincia de Mendoza",
 menorEdadMin:18                    // edad mínima para crear cuenta y contratar
};
const pct=()=>Math.round((typeof SENA==="number"?SENA:.3)*100);
const L={
comprar:{t:"Cómo comprar",h:()=>`<ol class="lgo">
<li><b>Cotizá.</b> En el cotizador elegí la fecha y la unidad (ómnibus de 50 asientos o Sprinter de 19), marcá en el mapa el origen y el destino exactos y completá el tiempo de espera y los extras.</li>
<li><b>Revisá el importe.</b> Te mostramos un valor estimado con el detalle: servicio base, kilómetros, espera y extras.</li>
<li><b>Ingresá o creá tu usuario.</b> Lo necesitás para reservar y seguir tus viajes.</li>
<li><b>Reservá.</b> Tocá “Reservar este viaje” y elegí si querés señar (${pct()}% del total) o pagar todo.</li>
<li><b>Elegí cómo pagar.</b> Tarjeta de crédito o débito, Mercado Pago o transferencia bancaria.</li>
<li><b>Seguí tu reserva.</b> En el menú de tu nombre (arriba a la derecha) → Mis reservas ves el estado, el recorrido en Google Maps y, si señaste, el saldo que queda por pagar antes del viaje.</li></ol>
<p>Trabajamos como Servicio Contratado General: se contrata la unidad completa, con itinerario y precio pactados. No vendemos pasajes individuales.</p>
<p>¿Dudas? Tocá “Quiero hablar con un asesor” y te atendemos por WhatsApp.</p>`},
pagos:{t:"Medios de pago y promociones",h:()=>`<h4>Medios de pago aceptados</h4>
<ul><li>Tarjetas de crédito y débito (Visa, Mastercard, American Express).</li><li>Mercado Pago.</li><li>Transferencia bancaria${D.cbu||D.alias?` (${D.cbu?"CBU: "+D.cbu:""}${D.cbu&&D.alias?" · ":""}${D.alias?"alias: "+D.alias:""})`:". Pedí los datos por WhatsApp al reservar."}</li></ul>
<h4>Seña y saldo</h4>
<p>Para reservar podés abonar una seña del ${pct()}% del importe total o pagar el total. El saldo se abona antes del viaje, desde el menú de tu nombre (arriba a la derecha) → Mis reservas.</p>
<h4>Promociones</h4>
<p>Consultá con un asesor por las promociones vigentes y las tarifas especiales para escuelas, instituciones y empresas con servicio mensual.</p>`},
cambios:{t:"Cambios y devoluciones",h:()=>`<h4>Cambios</h4>
<p>Podés pedir un cambio de fecha, horario, recorrido o unidad hablando con un asesor, con al menos ${D.cambioHs} horas de anticipación. Se confirma según la disponibilidad de la flota y puede tener una diferencia de importe.</p>
<h4>Cancelaciones y devoluciones</h4>
<ul><li>Con más de ${D.cancelA.dias} días de anticipación: devolución del ${D.cancelA.pct}% de lo abonado.</li><li>Entre ${D.cancelB.dias} y ${D.cancelA.dias} días: devolución del ${D.cancelB.pct}%.</li><li>Con menos de ${D.sinDevHs} horas: no corresponde la devolución de la seña.</li></ul>
<p>Las devoluciones se hacen por el mismo medio de pago, en un plazo de ${D.plazoDev} días hábiles.</p>
<h4>Derecho de revocación</h4>
<p>Si contrataste a distancia, podés tener derecho a revocar la contratación según la Ley 24.240 de Defensa del Consumidor, dentro de los plazos y condiciones que ella establece. Consultá con un asesor para ejercerlo.</p>
<h4>Si cancelamos nosotros</h4>
<p>Si no podemos prestar el servicio (por ejemplo, por una falla de la unidad), te ofrecemos reprogramarlo o te devolvemos el 100% de lo abonado.</p>`},
perdidos:{t:"Objetos perdidos",h:()=>`<p>Si olvidaste algo en una de nuestras unidades:</p>
<ol class="lgo"><li>Escribinos por WhatsApp lo antes posible desde “Quiero hablar con un asesor”.</li>
<li>Indicá la fecha del viaje, la unidad o interno, el chofer y una descripción del objeto.</li>
<li>Te avisamos si lo encontramos y coordinamos el retiro en nuestra base de Maipú, Mendoza${D.direccion?" ("+D.direccion+")":""}.</li></ol>
<p>Guardamos los objetos encontrados durante ${D.guardadoDias} días. Para retirarlo vas a tener que acreditar tu identidad y describir el objeto.</p>`},
legales:{t:"Aspectos legales",h:()=>`<h4>Datos de la empresa</h4>
<ul><li>Nueva Era Transporte${D.razon?" · "+D.razon:""}</li>${D.cuit?`<li>CUIT: ${D.cuit}</li>`:""}<li>Domicilio: Maipú, Mendoza, Argentina${D.direccion?" ("+D.direccion+")":""}</li><li>WhatsApp: ${D.whatsapp}</li>${D.email?`<li>Email: ${D.email}</li>`:""}</ul>
<h4>Tipo de servicio</h4>
<p>Nueva Era presta Servicio Contratado General de transporte de pasajeros en el marco de la Ley Provincial 9086 de Movilidad de Mendoza. Se contrata la unidad completa; no se venden pasajes individuales.${D.habilitaciones?" "+D.habilitaciones:""}</p>
<h4>Defensa del consumidor</h4>
<p>Se aplica la Ley 24.240 de Defensa del Consumidor. Ante cualquier reclamo podés comunicarte con nosotros o con la autoridad de Defensa del Consumidor de tu jurisdicción.</p>
<h4>Protección de datos personales</h4>
<p>Los datos que cargás (nombre, email, teléfono y reservas) se usan solo para gestionar tus reservas y comunicarnos con vos. De los medios de pago únicamente se guardan la marca y los últimos 4 dígitos. Podés pedir el acceso, la rectificación o la eliminación de tus datos, según la Ley 25.326. El organismo de control es la Agencia de Acceso a la Información Pública.</p>
<h4>Propiedad intelectual</h4>
<p>El nombre, el logo y las imágenes de Nueva Era Transporte pertenecen a la empresa y no pueden usarse sin su autorización.</p>
`},
menores:{t:"Menores de edad",h:()=>`<h4>Quién puede contratar</h4>
<p>Para crear una cuenta y contratar un servicio hay que ser mayor de ${D.menorEdadMin} años. Si el viaje es para menores (escuelas, clubes, colonias, cumpleaños, excursiones), la contratación la hace un adulto responsable.</p>
<h4>Menores que viajan</h4>
<ul><li>Los menores de ${D.menorEdadMin} años deben viajar acompañados por al menos un adulto responsable (familiar, docente, coordinador o tutor) que viaje en la misma unidad.</li>
<li>En viajes de grupos de menores, el adulto responsable debe informarnos la cantidad de menores y de adultos acompañantes al reservar.</li>
<li>Si el menor viaja sin sus padres o tutores, quien lo acompaña debe llevar la autorización firmada por ellos y la documentación del menor (DNI).</li>
<li>Los menores deben usar el cinturón de seguridad donde la unidad lo tenga y respetar las indicaciones del chofer.</li></ul>
<h4>Responsabilidad</h4>
<p>El cuidado de los menores durante el viaje es de los adultos responsables que los acompañan. El chofer no puede hacerse cargo de su supervisión.</p>
<h4>Protección de datos</h4>
<p>No pedimos datos de menores al crear una cuenta ni al reservar. Si el viaje lo requiere, los datos que nos pasen se usan solo para organizar el servicio.</p>
<p>Si tenés dudas sobre un viaje con menores, tocá “Quiero hablar con un asesor”.</p>`},
terminos:{t:"Términos y condiciones",h:()=>`<ol class="lgo">
<li><b>Objeto.</b> Estos términos regulan el uso de este sitio y la contratación de servicios de transporte de Nueva Era Transporte.</li>
<li><b>Servicio contratado.</b> Se contrata la unidad completa (ómnibus de 50 asientos o Sprinter de 19) con itinerario, fecha y precio pactados. No se venden pasajes individuales.</li>
<li><b>Cotización y precio.</b> El importe del cotizador es una estimación según unidad, kilómetros, espera y extras. El precio definitivo se confirma antes del viaje.</li>
<li><b>Reserva y pago.</b> La reserva se realiza con una seña del ${pct()}% o con el pago total. El saldo se abona antes del viaje. Hasta que se acredite el pago, la reserva puede quedar pendiente.</li>
<li><b>Cambios y cancelaciones.</b> Se rigen por la sección “Cambios y devoluciones”.</li>
<li><b>Obligaciones de quien contrata.</b> Informar con exactitud el recorrido y los horarios, no superar la cantidad de asientos de la unidad y respetar las normas de seguridad y las indicaciones del chofer.</li>
<li><b>Demoras.</b> Los horarios pueden verse afectados por tránsito, clima o cortes de ruta ajenos a la empresa. El tiempo de espera adicional se cotiza aparte.</li>
<li><b>Equipaje.</b> Se transporta el equipaje que entre en el espacio de la unidad. Para cargas voluminosas o especiales, consultá antes con un asesor.</li>
<li><b>Datos personales.</b> El tratamiento de tus datos se describe en “Aspectos legales”.</li>
<li><b>Modificaciones.</b> Nueva Era puede actualizar estos términos; se aplican las versiones vigentes al momento de la reserva.</li>
<li><b>Menores de edad.</b> Se rigen por la sección “Menores de edad”.</li>
<li><b>Ley aplicable y jurisdicción.</b> Ley argentina. Jurisdicción: ${D.jurisdiccion}.</li></ol>`}
};
const ORDER=["comprar","pagos","cambios","perdidos","menores","legales","terminos"];
const m=$("lglm");let last=null,cur=null;
function openLegal(k){
 if(!L[k])k="comprar";cur=k;
 if(!m.classList.contains("on"))last=document.activeElement;
 $("lln").innerHTML=ORDER.map(x=>`<button type="button" data-k="${x}" class="${x===k?"on":""}" ${x===k?'aria-current="true"':""}>${L[x].t}</button>`).join("");
 $("llt").textContent=L[k].t;$("llb").innerHTML=L[k].h();
 m.classList.add("on");m.querySelector(".llc").scrollTop=0;$("llx").focus();
}
function closeLegal(){m.classList.remove("on");last&&last.focus&&last.focus()}
window.openLegal=openLegal;window.closeLegal=closeLegal;
$("lln").addEventListener("click",e=>{const b=e.target.closest("button");b&&openLegal(b.dataset.k)});
$("llx").onclick=closeLegal;
m.addEventListener("pointerdown",e=>{if(e.target===m)closeLegal()});
document.addEventListener("click",e=>{const a=e.target.closest("[data-lgl]");if(a){e.preventDefault();openLegal(a.dataset.lgl)}});
})();
