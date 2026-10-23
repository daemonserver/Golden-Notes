/* ==========================================================================
   Golden Notes — modal-detalle.js
   Ventana emergente con la ficha completa del perfume: acordes, notas
   principales, pirámide olfativa, selector de tamaño (50/100 ml), cantidad
   y botón para añadir al carrito. Se puede cerrar con Esc o con la X.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  var elementoModal = null;
  var enfoqueAnterior = null;
  var estado = { tamano: TAMANOS[0], cantidad: 1 };

  function nivelHTML(clase, titulo, notas) {
    return (
      '<div class="nivel nivel--' +
      clase +
      '"><h4>' +
      titulo +
      "</h4><p>" +
      notas.map(GN.escapar).join(" · ") +
      "</p></div>"
    );
  }

  function notasHTML(notas) {
    return (notas || [])
      .map(function (nota) {
        return '<li class="nota">' + GN.escapar(nota) + "</li>";
      })
      .join("");
  }

  function tamanosHTML(perfume) {
    return TAMANOS.map(function (t) {
      return (
        '<button type="button" class="tamano" data-tamano="' +
        t +
        '"><strong>' +
        t +
        ' ml</strong><span>' +
        GN.formatearPrecio(GN.precioDe(perfume, t)) +
        "</span></button>"
      );
    }).join("");
  }

  function totalHTML(perfume) {
    var precio = GN.precioDe(perfume, estado.tamano);
    return GN.formatearPrecio(precio * estado.cantidad);
  }

  function refrescar(perfume) {
    GN.$$(".tamano", elementoModal).forEach(function (boton) {
      boton.classList.toggle("activo", parseInt(boton.dataset.tamano, 10) === estado.tamano);
      boton.setAttribute(
        "aria-pressed",
        parseInt(boton.dataset.tamano, 10) === estado.tamano ? "true" : "false"
      );
    });

    var entradaCantidad = GN.$("[data-cantidad]", elementoModal);
    if (entradaCantidad) entradaCantidad.value = estado.cantidad;

    var boton = GN.$("[data-accion='añadir']", elementoModal);
    if (boton) boton.textContent = "Añadir al carrito · " + totalHTML(perfume);
  }

  function contenidoHTML(perfume) {
    return (
      '<div class="modal__fondo" data-cerrar></div>' +
      '<div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="detalle-titulo">' +
      '<button type="button" class="modal__cerrar" data-cerrar aria-label="Cerrar detalle">×</button>' +
      '<div class="detalle">' +
      '<div class="detalle__imagen">' +
      '<img src="' +
      GN.rutaImagen(perfume.imagen) +
      '" alt="' +
      GN.escapar(perfume.nombre + " — " + perfume.disenador) +
      '" width="600" height="700">' +
      "</div>" +
      '<div class="detalle__info">' +
      '<p class="detalle__disenador">' +
      GN.escapar(perfume.disenador) +
      "</p>" +
      '<h2 id="detalle-titulo">' +
      GN.escapar(perfume.nombre) +
      "</h2>" +
      '<p class="detalle__familia"><span class="etiqueta etiqueta--oro">' +
      GN.escapar(perfume.familia) +
      "</span> · " +
      GN.etiquetaGenero(perfume.genero) +
      "</p>" +

      (perfume.noDisponible === true
        ? '<p class="etiqueta etiqueta--no-disponible detalle__disponibilidad" role="status">No disponible</p>'
        : "") +

      '<div class="detalle__bloque"><h3>Acordes principales</h3>' +
      '<ul class="acordes">' +
      GN.acordesHTML(perfume.acordes) +
      "</ul></div>" +

      '<div class="detalle__bloque"><h3>Notas principales</h3>' +
      '<ul class="notas">' +
      notasHTML(perfume.notas) +
      "</ul></div>" +

      '<div class="detalle__bloque"><h3>Pirámide olfativa</h3>' +
      '<div class="piramide">' +
      nivelHTML("salida", "Notas de salida", perfume.piramide.salida) +
      nivelHTML("corazon", "Notas de corazón", perfume.piramide.corazon) +
      nivelHTML("fondo", "Notas de fondo", perfume.piramide.fondo) +
      "</div></div>" +

      (perfume.noDisponible === true
        ? '<p class="aviso-disponibilidad" role="status">Este perfume no se puede agregar al carrito en este momento.</p>'
        : '<div class="detalle__compra">' +
      '<div class="detalle__fila">' +
      '<div class="tamanos" role="group" aria-label="Elegir tamaño">' +
      tamanosHTML(perfume) +
      "</div></div>" +
      '<div class="detalle__fila">' +
      '<div class="cantidad">' +
      '<button type="button" data-paso="-1" aria-label="Reducir cantidad">−</button>' +
      '<input type="number" min="1" max="99" value="1" data-cantidad aria-label="Cantidad">' +
      '<button type="button" data-paso="1" aria-label="Aumentar cantidad">+</button>' +
      "</div>" +
      '<button type="button" class="btn btn--oro btn--ancho" data-accion="añadir"></button>' +
      "</div></div>") +

      "</div></div></div>"
    );
  }

  function abrir(idPerfume) {
    var perfume = GN.buscarPerfume(idPerfume);
    if (!perfume) return;

    estado = { tamano: TAMANOS[0], cantidad: 1 };
    enfoqueAnterior = document.activeElement;

    if (!elementoModal) {
      elementoModal = document.createElement("div");
      elementoModal.className = "modal";
      elementoModal.setAttribute("id", "detalle-perfume");
      document.body.appendChild(elementoModal);

      elementoModal.addEventListener("click", function (evento) {
        if (evento.target.closest("[data-cerrar]")) cerrar();
      });

      document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && elementoModal.classList.contains("abierto")) {
          cerrar();
        }
      });
    }

    elementoModal.innerHTML = contenidoHTML(perfume);
    document.body.style.overflow = "hidden";

    GN.$$(".tamano", elementoModal).forEach(function (boton) {
      boton.addEventListener("click", function () {
        estado.tamano = parseInt(boton.dataset.tamano, 10);
        refrescar(perfume);
      });
    });

    GN.$$("[data-paso]", elementoModal).forEach(function (boton) {
      boton.addEventListener("click", function () {
        var cambio = parseInt(boton.dataset.paso, 10);
        estado.cantidad = Math.min(99, Math.max(1, estado.cantidad + cambio));
        refrescar(perfume);
      });
    });

    var entrada = GN.$("[data-cantidad]", elementoModal);
    if (entrada) entrada.addEventListener("change", function () {
      estado.cantidad = Math.min(99, Math.max(1, parseInt(entrada.value, 10) || 1));
      refrescar(perfume);
    });

    var botonAgregar = GN.$("[data-accion='añadir']", elementoModal);
    if (botonAgregar) botonAgregar.addEventListener("click", function () {
      if (!GN.carrito.agregar(perfume.id, estado.tamano, estado.cantidad)) {
        GN.avisar("Este perfume no está disponible.", "error");
        return;
      }
      GN.avisar(
        perfume.nombre +
          " · " +
          estado.tamano +
          " ml × " +
          estado.cantidad +
          " añadido al carrito."
      );
      cerrar();
    });

    requestAnimationFrame(function () {
      elementoModal.classList.add("abierto");
      refrescar(perfume);
      var cerrar = GN.$(".modal__cerrar", elementoModal);
      if (cerrar) cerrar.focus();
    });
  }

  function cerrar() {
    if (!elementoModal) return;
    elementoModal.classList.remove("abierto");
    document.body.style.overflow = "";
    if (enfoqueAnterior && enfoqueAnterior.focus) enfoqueAnterior.focus();
  }

  modulo.abrirDetalle = abrir;
  modulo.cerrarDetalle = cerrar;

  return modulo;
})(GN || {});
