/* Ayuda y aspectos legales (footer). Texto en borrador: lo entre [corchetes] lo define la empresa. */
(function(){
const $=id=>document.getElementById(id);
const BR='<p class="nt2 ej">Borrador de ejemplo para la tesina. Lo que está entre [corchetes] lo tiene que definir Nueva Era, y todo el texto debe revisarlo la empresa junto con un asesor legal antes de publicarse.</p>';
const pct=()=>Math.round((typeof SENA==="number"?SENA:.3)*100);
const L={
comprar:{t:"Cómo comprar",h:()=>`<ol class="lgo">
<li><b>Cotizá.</b> En el cotizador elegí la fecha y la unidad (ómnibus de 50 asientos o Sprinter de 19), marcá en el mapa el origen y el destino exactos y completá el tiempo de espera y los extras.</li>
<li><b>Revisá el importe.</b> Te mostramos un valor estimado con el detalle: servicio base, kilómetros, espera y extras.</li>
<li><b>Ingresá o creá tu usuario.</b> Lo necesitás para reservar y seguir tus viajes.</li>
<li><b>Reservá.</b> Tocá “Reservar este viaje” y elegí si querés señar (${pct()}% del total) o pagar todo.</li>
<li><b>Elegí cómo pagar.</b> Tarjeta de crédito o débito, Mercado Pago o transferencia bancaria.</li>
<li><b>Seguí tu reserva.</b> En Mi cuenta → Mis reservas ves el estado, el recorrido en Google Maps y, si señaste, el saldo que queda por pagar antes del viaje.</li></ol>
<p>Trabajamos como Servicio Contratado General: se contrata la unidad completa, con itinerario y precio pactados. No vendemos pasajes individuales.</p>
<p>¿Dudas? Tocá “Quiero hablar con un asesor” y te atendemos por WhatsApp.</p>`},
pagos:{t:"Medios de pago y promociones",h:()=>`<h4>Medios de pago aceptados</h4>
<ul><li>Tarjetas de crédito y débito (Visa, Mastercard, American Express).</li><li>Mercado Pago.</li><li>Transferencia bancaria (CBU y alias: [a definir]).</li></ul>
<h4>Seña y saldo</h4>
<p>Para reservar podés abonar una seña del ${pct()}% del importe total o pagar el total. El saldo se abona antes del viaje, desde Mi cuenta → Mis reservas.</p>
<h4>Promociones</h4>
<p>Promociones vigentes: [a definir por la empresa]. Algunos ejemplos de cómo podrían presentarse:</p>
<ul><li>Descuento por pago con transferencia: [a definir]%.</li><li>Cuotas sin interés con bancos y tarjetas adheridas: [a definir].</li><li>Tarifas especiales para escuelas, instituciones y empresas con servicio mensual: consultá con un asesor.</li></ul>
<p>Vigencia y condiciones de acumulación: [a definir].</p>`},
cambios:{t:"Cambios y devoluciones",h:()=>`<h4>Cambios</h4>
<p>Podés pedir un cambio de fecha, horario, recorrido o unidad hablando con un asesor, con al menos [a definir] horas de anticipación. Se confirma según la disponibilidad de la flota y puede tener una diferencia de importe.</p>
<h4>Cancelaciones y devoluciones</h4>
<ul><li>Con más de [a definir] días de anticipación: devolución del [a definir]% de lo abonado.</li><li>Entre [a definir] y [a definir] días: devolución del [a definir]%.</li><li>Con menos de [a definir] horas: no corresponde la devolución de la seña.</li></ul>
<p>Las devoluciones se hacen por el mismo medio de pago, en un plazo de [a definir] días hábiles.</p>
<h4>Derecho de revocación</h4>
<p>Si contrataste a distancia, podés tener derecho a revocar la contratación según la Ley 24.240 de Defensa del Consumidor, dentro de los plazos y condiciones que ella establece. Consultá con un asesor para ejercerlo.</p>
<h4>Si cancelamos nosotros</h4>
<p>Si no podemos prestar el servicio (por ejemplo, por una falla de la unidad), te ofrecemos reprogramarlo o te devolvemos el 100% de lo abonado.</p>`},
perdidos:{t:"Objetos perdidos",h:()=>`<p>Si olvidaste algo en una de nuestras unidades:</p>
<ol class="lgo"><li>Escribinos por WhatsApp lo antes posible desde “Quiero hablar con un asesor”.</li>
<li>Indicá la fecha del viaje, la unidad o interno, el chofer y una descripción del objeto.</li>
<li>Te avisamos si lo encontramos y coordinamos el retiro en [dirección a definir], Maipú, Mendoza.</li></ol>
<p>Guardamos los objetos encontrados durante [a definir] días. Para retirarlo vas a tener que acreditar tu identidad y describir el objeto.</p>`},
legales:{t:"Aspectos legales",h:()=>`<h4>Datos de la empresa</h4>
<ul><li>Razón social: [a definir]</li><li>CUIT: [a definir]</li><li>Domicilio: Maipú, Mendoza, Argentina ([dirección a definir])</li><li>Contacto: WhatsApp Business [a definir] · contacto@nuevaera.com.ar [a definir]</li></ul>
<h4>Tipo de servicio</h4>
<p>Nueva Era presta Servicio Contratado General de transporte de pasajeros en el marco de la Ley Provincial 9086 de Movilidad de Mendoza. Se contrata la unidad completa; no se venden pasajes individuales. Habilitaciones y seguros: [a definir].</p>
<h4>Defensa del consumidor</h4>
<p>Se aplica la Ley 24.240 de Defensa del Consumidor. Ante cualquier reclamo podés comunicarte con nosotros o con la autoridad de Defensa del Consumidor de tu jurisdicción. [Datos del organismo y libro de quejas: a definir]</p>
<h4>Protección de datos personales</h4>
<p>Los datos que cargás (nombre, email, teléfono y reservas) se usan solo para gestionar tus reservas y comunicarnos con vos. De los medios de pago únicamente se guardan la marca y los últimos 4 dígitos. Podés pedir el acceso, la rectificación o la eliminación de tus datos, según la Ley 25.326. El organismo de control es la Agencia de Acceso a la Información Pública.</p>
<h4>Propiedad intelectual</h4>
<p>El nombre, el logo y las imágenes de Nueva Era Transporte pertenecen a la empresa y no pueden usarse sin su autorización.</p>
<h4>Sobre este sitio</h4>
<p>Esta web es un prototipo hecho para un trabajo de tesina de la UTN. Las cuentas y los pagos están simulados y no se realiza ningún cobro real.</p>`},
terminos:{t:"Términos y condiciones",h:()=>`<ol class="lgo">
<li><b>Objeto.</b> Estos términos regulan el uso de este sitio y la contratación de servicios de transporte de Nueva Era Transporte.</li>
<li><b>Servicio contratado.</b> Se contrata la unidad completa (ómnibus de 50 asientos o Sprinter de 19) con itinerario, fecha y precio pactados. No se venden pasajes individuales.</li>
<li><b>Cotización y precio.</b> El importe del cotizador es una estimación según unidad, kilómetros, espera y extras. El precio definitivo se confirma antes del viaje.</li>
<li><b>Reserva y pago.</b> La reserva se realiza con una seña del ${pct()}% o con el pago total. El saldo se abona antes del viaje. Hasta que se acredite el pago, la reserva puede quedar pendiente.</li>
<li><b>Cambios y cancelaciones.</b> Se rigen por la sección “Cambios y devoluciones”.</li>
<li><b>Obligaciones de quien contrata.</b> Informar con exactitud el recorrido y los horarios, no superar la cantidad de asientos de la unidad y respetar las normas de seguridad y las indicaciones del chofer.</li>
<li><b>Demoras.</b> Los horarios pueden verse afectados por tránsito, clima o cortes de ruta ajenos a la empresa. El tiempo de espera adicional se cotiza aparte.</li>
<li><b>Equipaje.</b> Se transporta el equipaje que entre en el espacio de la unidad. Condiciones especiales: [a definir].</li>
<li><b>Datos personales.</b> El tratamiento de tus datos se describe en “Aspectos legales”.</li>
<li><b>Modificaciones.</b> Nueva Era puede actualizar estos términos; se aplican las versiones vigentes al momento de la reserva.</li>
<li><b>Ley aplicable y jurisdicción.</b> Ley argentina. Jurisdicción: [a definir], Mendoza.</li></ol>`}
};
const ORDER=["comprar","pagos","cambios","perdidos","legales","terminos"];
const m=$("lglm");let last=null,cur=null;
function openLegal(k){
 if(!L[k])k="comprar";cur=k;
 if(!m.classList.contains("on"))last=document.activeElement;
 $("lln").innerHTML=ORDER.map(x=>`<button type="button" data-k="${x}" class="${x===k?"on":""}" ${x===k?'aria-current="true"':""}>${L[x].t}</button>`).join("");
 $("llt").textContent=L[k].t;$("llb").innerHTML=BR+L[k].h();
 m.classList.add("on");m.querySelector(".llc").scrollTop=0;$("llx").focus();
}
function closeLegal(){m.classList.remove("on");last&&last.focus&&last.focus()}
window.openLegal=openLegal;window.closeLegal=closeLegal;
$("lln").addEventListener("click",e=>{const b=e.target.closest("button");b&&openLegal(b.dataset.k)});
$("llx").onclick=closeLegal;
m.addEventListener("pointerdown",e=>{if(e.target===m)closeLegal()});
document.addEventListener("click",e=>{const a=e.target.closest("[data-lgl]");if(a){e.preventDefault();openLegal(a.dataset.lgl)}});
})();
