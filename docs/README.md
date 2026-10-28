# Golden Notes — versión 2.0.1

Sitio estático de perfumería para Guatemala, preparado para GitHub Pages. Incluye catálogo de 77 fragancias, filtros, páginas por diseñador, carrito local, cotización PDF y preparación de pedidos por WhatsApp. No procesa pagos ni confirma existencias automáticamente.

## Funciones

- Catálogo con búsqueda por nombre, diseñador, familia olfativa, acordes y notas; filtros restablecibles, ordenamiento y fichas olfativas.
- Carrito persistente en el navegador, tamaños de 50 y 100 ml y sincronización entre pestañas.
- Etiqueta opcional de disponibilidad por perfume, controlada desde el catálogo y respetada por el carrito.
- Cotización PDF con ajuste de texto y paginación.
- Pedido por WhatsApp que el usuario revisa y envía desde esa aplicación.
- Páginas de contacto y de origen y compra.
- Temas claro y oscuro, diseño adaptable y controles accesibles.

## Estructura

```text
index.html                   Portada
paginas/catalogo.html        Catálogo y filtros
paginas/disenador.html       Índice y vistas por diseñador
paginas/carrito.html         Carrito, PDF y WhatsApp
paginas/origen-y-compra.html Información de procedencia y compra
paginas/contacto.html        Contacto y formulario
css/                         Estilos, componentes, estructura y animaciones
css/fuentes-locales.css      Fuentes incluidas en el repositorio
assets/fonts/                Archivos de fuentes y licencias OFL
js/datos.js                  Catálogo y datos del negocio
js/utilidades.js             Funciones compartidas
js/carrito.js                Lógica y almacenamiento local del carrito
js/carrito-pagina.js         Interfaz y controles del carrito
js/factura-pdf.js            Cotización PDF y mensaje para WhatsApp
img/                         Marca, imágenes PNG y marcador de posición
js/vendor/                   jsPDF local y su licencia MIT
docs/                        Guías de uso y seguridad
CHANGELOG.md                 Registro de versiones
```

## Ejecutar en local

Sirve la carpeta raíz (no abras directamente con `file://`, pues el navegador puede limitar el almacenamiento):

```bash
python -m http.server 8000
```

Visita `http://localhost:8000`.

## Publicar en GitHub Pages

La carpeta ya está inicializada localmente en la rama `main`; todavía no tiene commit ni remoto. Crea en GitHub un repositorio vacío llamado `golden-notes` (sin README ni archivos iniciales) y, desde esta carpeta, ejecuta en PowerShell:

```powershell
git add .
git status --short
git diff --cached --check
```

Revisa la lista: debe incluir el sitio, sus imágenes necesarias, fuentes, licencias y jsPDF local. No debe incluir secretos, respaldos, exportaciones PDF ni la carpeta de imágenes originales excluida. Si todo está correcto:

```powershell
git commit -m "Publicación inicial de Golden Notes 2.0.1"
git remote add origin https://github.com/USUARIO/golden-notes.git
git push -u origin main
```

Sustituye `USUARIO` por tu cuenta de GitHub. En **Settings → Pages**, selecciona publicar desde la rama `main` y la carpeta raíz. Después abre la dirección que muestre GitHub y revisa navegación, imágenes, temas, carrito, descarga PDF y enlaces de WhatsApp. Reemplaza `USUARIO` en `sitemap.xml` con tu cuenta real antes de publicar. La guía [Seguridad y publicación](SEGURIDAD-GITHUB.md) incluye una lista de verificación.

El sitio no tiene servidor, base de datos, autenticación, inventario en tiempo real ni pagos. Todo valor incluido en archivos estáticos puede ser leído por visitantes. Un repositorio privado no convierte la página publicada en privada.

## Privacidad y seguridad

El carrito y el tema se guardan en `localStorage`. Los datos del cliente se usan en el navegador para preparar una cotización o el mensaje que podría enviar a WhatsApp. No se envían a un servidor Golden Notes. Los datos del carrito se reconstruyen desde el catálogo y normalizan antes de usarse. El PDF es informativo, no una factura fiscal ni confirmación de venta.

Las fuentes y jsPDF están guardados en el repositorio, por lo que el diseño y la generación PDF no consultan servicios externos. WhatsApp y el correo solo se usan cuando el visitante decide abrir esos enlaces y requieren sus respectivos servicios. Consulta [Guía de edición](GUIA-EDICION.md), [Seguridad](SEGURIDAD-GITHUB.md) y [Cambios](../CHANGELOG.md).

Golden Notes · Perfumería de autor · Guatemala

