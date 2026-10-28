# Seguridad y publicación — Golden Notes

Golden Notes es una web estática. Los archivos que se publican pueden leerse y descargarse; no hay backend para ocultar secretos ni para validar compras.

## No publiques

- Contraseñas, tokens, claves privadas, archivos `.env` o credenciales de terceros.
- Respaldos, bases de datos o documentos con información personal de clientes.
- Copias originales de imágenes que no sean necesarias para la web. `Perfumes disponibles/` y los PDF se excluyen mediante `.gitignore`.

No incluyas claves de pago, correo o servicios privados en JavaScript: quedan expuestas al visitante. Una integración que requiera secretos necesita un backend.

## Datos que usa el sitio

- Carrito y tema: `localStorage` del navegador del visitante.
- Datos del cliente: se usan localmente para armar la cotización y el texto del pedido.
- WhatsApp: recibe esos datos solo si el visitante abre y envía el mensaje desde su cuenta.
- La cotización PDF se genera en el equipo. No es factura fiscal ni confirmación de venta.

No existe inventario en tiempo real, autenticación, pago en línea ni envío de datos a un servidor propio. Confirma disponibilidad y condiciones con Golden Notes.

## Antes de publicar

1. Revisa `git status --short`, `git diff --check` y `git ls-files`.
2. Confirma que no se incluyan secretos, exportaciones de clientes ni respaldos.
3. Busca secretos en el contenido y el historial. Si una clave fue publicada, revócala y reemplázala; borrar el archivo actual no borra el historial.
4. Comprueba rutas y navegación bajo la URL de GitHub Pages.

## Recursos externos

Las fuentes (Outfit y Cormorant Garamond) y jsPDF se sirven desde archivos del mismo repositorio. No hace falta consultar Google Fonts ni un CDN para que carguen los estilos o se genere el PDF. Sus licencias se conservan junto a los archivos en `assets/fonts/` y `js/vendor/`.

WhatsApp y el correo son enlaces de contacto: solo se abren cuando el visitante los selecciona, y dependen de que tenga acceso a esos servicios. El sitio seguirá mostrando el catálogo y el carrito sin ellos; no podrá enviar un pedido por esos canales mientras estén indisponibles.

## Preparar el repositorio

El repositorio local ya está inicializado en la rama `main`. Antes del primer `commit`, crea un repositorio vacío en GitHub y revisa qué quedará preparado:

```powershell
git add .
git status --short
git diff --cached --check
```

No continúes al `commit` hasta confirmar que no aparecen credenciales, copias originales, datos de clientes ni documentos generados. `.gitignore` excluye estos archivos, los PDF exportados y `Perfumes disponibles/`. Las fuentes y jsPDF locales sí deben subirse: son recursos de ejecución necesarios y sus licencias están incluidas. Sigue los pasos de `README.md` para enlazar el remoto y habilitar Pages.

GitHub Pages publica archivos estáticos. La configuración del repositorio no oculta el contenido que se sirve en la web. Cualquier teléfono, correo, precio, imagen o dato incluido en los archivos será visible para visitantes.
