# Registro de cambios — Golden Notes

## [Sin publicar]

### Mejorado
- El botón «Limpiar filtros» vacía la búsqueda, restablece género, diseñador, familia y orden, actualiza los controles visibles y elimina esos parámetros de la URL.
- La búsqueda del catálogo encuentra coincidencias en nombre, diseñador, familia olfativa, acordes y notas, sin distinguir mayúsculas ni tildes.
- Las opciones de los selectores del catálogo y del tamaño en el carrito usan los colores del tema activo.
- La portada presenta las cuatro fragancias destacadas en tarjetas compactas de dos columnas en móvil, y el acceso al carrito queda flotante en pantallas pequeñas.
- En móvil, las familias olfativas se agrupan en un control desplegable y se pliegan al avanzar por la página; el diseño de escritorio conserva la lista completa.

## [2.0.1] — 2026-10-17

### Mejorado
- Los 77 perfumes del catálogo declaran `noDisponible: false` de forma explícita como valor predeterminado.
- Fuentes Outfit y Cormorant Garamond servidas localmente, conservando sus licencias Open Font License; el diseño ya no depende de Google Fonts.
- jsPDF 4.2.1 incluido localmente con licencia MIT, sin dependencia de CDN. Esta versión oficial incluye correcciones para dos problemas de seguridad descritos por el proyecto jsPDF.
- Guías de seguridad y publicación actualizadas con los pasos de revisión de Git, configuración de GitHub Pages y los servicios que siguen siendo externos por decisión del visitante (WhatsApp y correo).

### Corregido
- Se restauró la declaración del arreglo `PERFUMES`, que se había omitido al incorporar `noDisponible: false`; el catálogo vuelve a exponer correctamente sus 77 registros.

### Preparación para publicación
- Se documentaron los comandos para crear el repositorio y subirlo a GitHub Pages. No se creó un remoto ni se publicó el proyecto.

## [2.0.0] — 2026-10-17

### Añadido
- Página **Origen y compra**, enlazada en los menús y preparada para la historia, procedencia y políticas confirmadas por el negocio.
- Documentación actualizada de arquitectura, edición, privacidad y publicación en GitHub Pages.
- Bandera opcional `noDisponible: true` por perfume, con etiqueta visual y bloqueo de compra en las tarjetas, fichas y lógica del carrito.
- Referencias del catálogo actualizadas de `.webp` a `.png` para coincidir con los archivos actuales de `img/`.
- Guía ampliada con instrucciones concretas para activar y desactivar `noDisponible` usando el valor booleano `true` o `false`.

### Corregido
- `utilidades.js` reemplazaba el objeto global `GN` y eliminaba la API de `carrito.js`; ahora añade sus funciones al objeto compartido y el carrito vuelve a renderizar sus productos.
- La lectura del almacenamiento se inicia cuando ya están disponibles las funciones del catálogo.
- Los datos guardados del carrito se validan y reconstruyen a partir del catálogo vigente; tamaño, cantidad, imagen y precio quedan normalizados.
- La cotización PDF ajusta los nombres y datos largos, alinea las columnas y continúa en páginas adicionales.
- Se corrigió el nombre del atributo de contenido del carrito (`data-carrito-contenido`) y se limita la cantidad añadida a 99 unidades por perfume.
- El texto de WhatsApp incluye dirección cuando se indica y abre el destino con protección `noopener,noreferrer`.
- Se eliminó un valor inválido (`tue`) en el registro del primer perfume, que impedía ejecutar JavaScript y cargar el catálogo. Ningún perfume queda marcado como no disponible por defecto.
- El área de desplazamiento del detalle ahora tiene espacio interior y un canal reservado para que la barra quede dentro del panel redondeado.
- Se corrigió el conteo actual del catálogo en el README: contiene 77 perfumes.

### Alcance
- El sitio prepara pedidos y cotizaciones; no procesa pagos, no confirma existencias ni genera comprobantes fiscales.

## [1.0.0] — 2026-10-14

Primera versión: portada, catálogo de 78 fragancias, filtros, páginas por diseñador, carrito persistente, cotización PDF, preparación de pedido por WhatsApp, contacto y temas claro y oscuro.

[2.0.1]: https://github.com/daemonserver/golden-notes/releases/tag/v2.0.1
[2.0.0]: https://github.com/daemonserver/golden-notes/releases/tag/v2.0.0
[1.0.0]: https://github.com/daemonserver/golden-notes/releases/tag/v1.0.0
