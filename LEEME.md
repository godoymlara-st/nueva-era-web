# Nueva Era Transporte – Propuesta web (v3)

Prototipo de la web para la tesina (UTN). Es HTML, CSS y JavaScript puro: no hace falta instalar nada.

## Qué hay en cada archivo
- `index.html` – estructura y textos (header, banner, cotizador, servicios, flota, recorrido 3D, mi cuenta, preguntas, contacto, footer y ventanas).
- `estilos.css` – colores, tipografías y diseño. Los colores principales están al comienzo, en `:root` (`--or` naranja, `--or2` amarillo, `--bl` azul).
- `app.js` – **configuración** (arriba de todo), precios, fichas de las unidades y sus choferes, cotizador y recorrido 3D.
- `mapa.js` – mapa y puntos exactos del cotizador.
- `cuenta.js` – usuario, perfil, billetera, reservas y pago con seña o total (todo simulado en el navegador).
- `legales.js` – textos de Cómo comprar, Medios de pago y promociones, Cambios y devoluciones, Objetos perdidos, Aspectos legales y Términos y condiciones.
- `img/` – logo, banner y fotos. Para cambiar una foto, reemplazá el archivo manteniendo el nombre.

## Cosas que hay que completar (están marcadas "a definir")
- **WhatsApp Business:** en `app.js`, línea `const WA_NUM=""` (código de país + número, sin +, ej: `5492610000000`). Con eso funcionan todos los botones "Quiero hablar con un asesor".
- **Seña:** en `app.js`, `const SENA=0.3` (30%).
- **Choferes:** datos en `app.js`, dentro de cada unidad (`ch:{...}`). La foto de Martín Sosa es un avatar provisorio: para poner una foto real, subila a `img/` y cambiá la ruta en `foto:` (por ejemplo `img/chofer-martin-sosa.jpg`). Los nombres, licencias y reseñas son ejemplos.
- **Sprinter:** año, dominio e interno en `app.js`.
- **Textos legales y promociones:** `legales.js`. Todo lo que está entre [corchetes] lo define la empresa y el texto lo tiene que revisar un asesor legal.
- **Transferencia:** CBU, alias y titular en `cuenta.js` (buscar "[a definir]").

## Para ver la web
Abrí `index.html` con doble clic (el mapa y la búsqueda de direcciones necesitan internet).

## Para publicarla
Subí el contenido de esta carpeta a un repositorio de GitHub y conectalo con Netlify, o arrastrá la carpeta a https://app.netlify.com/drop

## Pendiente para una versión real
- Reemplazar el login, las reservas y los pagos simulados por un backend (por ejemplo Firebase o Supabase) y una pasarela de pago (Mercado Pago, etc.).
- Cambiar OpenStreetMap por Google Maps Platform (requiere clave de API).
- Cargar la matriz de tarifas real de la empresa.
