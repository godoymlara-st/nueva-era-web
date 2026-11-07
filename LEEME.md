# Nueva Era Transporte – Propuesta web (v2)

Prototipo de la web para la tesina (UTN). Es HTML, CSS y JavaScript puro: no hace falta instalar nada.

## Qué hay en cada archivo
- `index.html` – estructura y textos de la página (header, banner, cotizador, servicios, flota, recorrido 3D, mis reservas, preguntas, contacto).
- `estilos.css` – colores, tipografías y diseño. Los colores principales están al comienzo, en `:root` (`--or` naranja, `--or2` amarillo, `--bl` azul).
- `app.js` – precios y datos de las unidades (objeto `U`), cálculo del cotizador, fichas de flota y recorrido 3D.
- `mapa-reservas.js` – mapa y puntos exactos del cotizador, login y "Mis reservas" (simulados en el navegador).
- `img/` – logo y fotos. Para cambiar una foto, reemplazá el archivo manteniendo el nombre.

## Para ver la web
Abrí `index.html` con doble clic (el mapa y la búsqueda de direcciones necesitan internet).

## Para publicarla
Subí esta carpeta a un repositorio de GitHub y conectalo con Netlify, o arrastrá la carpeta a https://app.netlify.com/drop

## Pendiente para una versión real
- Reemplazar el login y las reservas simulados por un backend (por ejemplo Firebase o Supabase).
- Cambiar OpenStreetMap por Google Maps Platform (requiere clave de API).
- Cargar los datos reales de la Sprinter (año, dominio, interno) y la matriz de tarifas de la empresa.
