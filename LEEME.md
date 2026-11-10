# Nueva Era Transporte – Propuesta web (v4)

Prototipo de la web para la tesina (UTN). Es HTML, CSS y JavaScript puro: no hace falta instalar nada.

## Qué hay en cada archivo
- `index.html` – estructura y textos (header con menú de usuario, banner, cotizador, servicios, flota, recorrido 3D, preguntas, contacto, footer y ventanas).
- `estilos.css` – colores, tipografías y diseño. Los colores corporativos están al comienzo, en `:root`: `--navy` #0A192F (dominante), `--red` #D32F2F (solo botones de acción principal) y `--g1` #F4F6F8 / `--g2` #4A5568 (grises).
- `app.js` – **configuración** (arriba de todo), precios, fichas de las unidades y sus choferes, cotizador y recorrido 3D.
- `mapa.js` – mapa y puntos exactos del cotizador.
- `cuenta.js` – usuario, menú desplegable del nombre (arriba a la derecha: Mis reservas, Mis datos, Billetera, Contraseña, Cerrar sesión), billetera, reservas y pago con seña o total (todo simulado en el navegador).
- `legales.js` – textos de Cómo comprar, Medios de pago y promociones, Cambios y devoluciones, Objetos perdidos, Aspectos legales y Términos y condiciones.
- `img/` – logo, banner y fotos. Para cambiar una foto, reemplazá el archivo manteniendo el nombre.

## Datos para completar o editar
- **Email de contacto:** nuevaeracontacto@gmail.com, en `index.html` (contacto y footer) y en `legales.js` (`email`).
- **WhatsApp:** `app.js`, línea `WA_NUM` (ya cargado: +54 9 261 609-8573). También figura en el footer de `index.html` y en `legales.js` (`whatsapp`).
- **CBU, alias y titular:** `app.js`, bloque `BANCO`. Si quedan vacíos, la web le pide al cliente los datos por WhatsApp.
- **Datos de la empresa** (razón social, CUIT, dirección, email, habilitaciones): `legales.js`, bloque `D` al principio. Lo que quede vacío no se muestra.
- **Plazos de cambios y devoluciones, objetos perdidos, jurisdicción, edad mínima:** el mismo bloque `D` de `legales.js`.
- **Textos de cada sección del footer:** `legales.js` (Cómo comprar, Medios de pago, Cambios y devoluciones, Objetos perdidos, Menores de edad, Aspectos legales, Términos).
- **Seña:** `SENA` en `app.js`.

## Para ver la web
Abrí `index.html` con doble clic (el mapa y la búsqueda de direcciones necesitan internet).

## Para publicarla
Subí el contenido de esta carpeta a un repositorio de GitHub y conectalo con Netlify, o arrastrá la carpeta a https://app.netlify.com/drop

## Pendiente para una versión real
- Reemplazar el login, las reservas y los pagos simulados por un backend (por ejemplo Firebase o Supabase) y una pasarela de pago (Mercado Pago, etc.).
- Cambiar OpenStreetMap por Google Maps Platform (requiere clave de API).
- Cargar la matriz de tarifas real de la empresa.

## Archivos
- `index.html` (página), `estilos.css`, `app.js` (cotizador, flota, Recorrido 3D, configuración), `mapa.js`, `legales.js`, `pdf.js` (genera el PDF del presupuesto), `cuenta.js` (usuario, reservas, presupuestos, billetera, pago) e `img/` (fotos).
