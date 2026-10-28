# Guía de edición — Golden Notes 2.0

El catálogo y la información de contacto se mantienen en `js/datos.js`. Edita los valores existentes y conserva comas, llaves y comillas. Sirve el proyecto con `python -m http.server 8000` y abre `http://localhost:8000` para revisar los cambios.

## Datos del negocio

Al inicio del archivo está `NEGOCIO`: nombre, teléfono, WhatsApp, correo, moneda, horario y nota de la cotización. Los enlaces de contacto también aparecen en los pies de página; al cambiar teléfono o correo, actualiza esos enlaces.

## Editar o agregar perfumes

Cada elemento del arreglo `PERFUMES` contiene:

```js
{
  id: "nuevo-perfume-marca", // identificador único, minúsculas y guiones
  nombre: "Nuevo Perfume",
  disenador: "Marca",
  genero: "mujer", // hombre o mujer
  familia: "Floral Frutal",
  imagen: "img/mujeres/nuevo-perfume_marca_w.png",
  acordes: ["Floral", "Frutal"],
  notas: ["Rosa", "Pera", "Vainilla"],
  piramide: {
    salida: ["Pera", "Bergamota"],
    corazon: ["Rosa", "Jazmín"],
    fondo: ["Vainilla", "Almizcle"]
  },
  precios: { 50: 300, 100: 500 }
}
```

1. Copia un registro existente dentro de `PERFUMES`.
2. Cambia el `id` por uno único y completa los campos.
3. Coloca la imagen PNG en `img/hombres/` o `img/mujeres/`. Si no hay foto, usa `img/placeholder-perfume.svg`.
4. Define el precio para cada tamaño. `TAMANOS` y `PRECIOS_BASE` están al inicio de `js/datos.js`.
5. Recarga las páginas. Los filtros y el índice de diseñadores se generan desde el catálogo.

En `paginas/catalogo.html`, el campo de búsqueda localiza perfumes por nombre, diseñador, familia olfativa, acordes y notas; no distingue mayúsculas ni tildes. «Limpiar filtros» restablece la búsqueda y todos los filtros y el ordenamiento, y quita sus parámetros de la dirección de la página.

### Marcar un perfume como no disponible

Todos los registros del catálogo ya incluyen `noDisponible: false`. Déjala así para mantener el perfume disponible. Para marcarlo como no disponible, cambia el valor a `true` dentro del objeto de ese perfume. Por ejemplo:

```js
{
  id: "aventus",
  nombre: "Aventus",
  disenador: "Creed",
  noDisponible: true,
  imagen: "img/hombres/aventus_creed_m.png",
  // conserva aquí los demás datos del perfume
}
```

La propiedad es un booleano: usa exactamente `true` o `false`, sin comillas. Con `true`, la etiqueta **No disponible** aparecerá en la tarjeta y en la ficha del perfume; se ocultarán los controles de compra y no podrá agregarse al carrito. Si ya estaba guardado en un carrito, se excluirá al cargar de nuevo la página. Para habilitarlo otra vez, cambia el valor a `false`.

Recuerda separar las propiedades del objeto con comas. La etiqueta es solo un indicador manual: actívala cuando quieras bloquear temporalmente ese perfume y desactívala cuando vuelva a estar disponible.

Al quitar un perfume, los renglones guardados que ya no correspondan al catálogo se descartan al reconstruir el carrito.

## Página Origen y compra

Edita `paginas/origen-y-compra.html` para añadir historia del negocio, procedencia comprobable, criterios de selección y políticas de pago, envío, cambios y devoluciones. Confirma esa información antes de publicarla. El texto actual identifica los espacios pendientes y explica que disponibilidad y condiciones se confirman con el negocio.

Si cambias páginas o enlaces, mantén rutas relativas: la portada usa `paginas/...` y las páginas dentro de `paginas/` enlazan archivos vecinos sin prefijo.

## Carrito y cotización

El carrito guarda selecciones en `localStorage` del navegador. La cotización PDF es un documento informativo generado localmente; no es comprobante fiscal ni confirma una venta. WhatsApp solo recibe el contenido si el cliente lo envía desde esa aplicación.

## Revisión antes de publicar

- [ ] Identificadores únicos, precios, imágenes y notas revisados.
- [ ] Información de origen y políticas verificada por el negocio.
- [ ] Navegación, filtros, modo claro/oscuro, carrito y PDF revisados en móvil y escritorio.
- [ ] Rutas internas correctas bajo la dirección de proyecto de GitHub Pages.
- [ ] Archivos a publicar revisados según `SEGURIDAD-GITHUB.md`.

