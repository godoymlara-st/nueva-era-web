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
- **Unidades y choferes:** los datos reales (internos 29, 04 y 26, choferes, licencias, idiomas, puntajes y comentarios) están en `app.js`, dentro de `const U`. Para cambiar una foto, reemplazá el archivo de `img/` manteniendo el nombre.
- **Foto del interno 29:** todavía no hay foto propia de esa unidad; `img/interno-29.webp` es una foto provisoria de otro Mercedes Nuevobus. Reemplazala por la real con ese mismo nombre.
- **Precios:** son de referencia. El ómnibus con baño (interno 04) usa los mismos valores que el ómnibus de 50 asientos; se ajustan en `app.js` (`b` = base, `k` = por km, `e` = espera por hora).
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
