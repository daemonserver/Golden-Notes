/* ==========================================================================
   Golden Notes — carrito-pagina.js
   Interfaz de la página del carrito: lista de renglones, cambio de tamaño
   (50/100 ml), cantidades, subtotales, resumen y acciones de cierre
   (factura PDF, pedido por WhatsApp, vaciar).
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function opcionesTamano(renglon) {
    var perfume = GN.buscarPerfume(renglon.idPerfume);
    return GN.tamanosDisponibles(perfume).map(function (t) {
      return (
        '<option value="' +
        t +
        '"' +
        (t === renglon.tamano ? " selected" : "") +
        ">" +
        t +
        " ml</option>"
      );
    }).join("");
  }

  function pintar() {
    var contenedor = GN.$("[data-lista-carrito]");
    var resumen = GN.$("[data-seccion-resumen]");
    var vacio = GN.$("[data-carrito-vacio]");
    var conContenido = GN.$("[data-carrito-contenido]");
    if (!contenedor || !resumen) return;

    var renglones = GN.carrito.listar();

    if (!renglones.length) {
      if (vacio) vacio.hidden = false;
      if (conContenido) conContenido.hidden = true;
      contenedor.innerHTML = "";
      return;
    }

    if (vacio) vacio.hidden = true;
    if (conContenido) conContenido.hidden = false;

    contenedor.innerHTML = renglones
      .map(function (r, i) {
        return (
          '<article class="linea" data-indice="' +
          i +
          '">' +
          '<img class="linea__img" src="' +
          GN.rutaImagen(r.imagen) +
          '" alt="' +
          GN.escapar(r.nombre) +
          '" loading="lazy" decoding="async" width="92" height="108">' +
          '<div class="linea__datos">' +
          '<p class="linea__disenador">' +
          GN.escapar(r.disenador) +
          "</p>" +
          '<h3 class="linea__nombre">' +
          GN.escapar(r.nombre) +
          "</h3>" +
          '<div class="linea__controles">' +
          '<label class="solo-lectores" for="tamano-' +
          i +
          '">Tamaño</label>' +
          '<select class="linea__tamano" id="tamano-' +
          i +
          '" data-tamano>' +
          opcionesTamano(r) +
          "</select>" +
          '<div class="cantidad">' +
          '<button type="button" data-paso="-1" aria-label="Reducir cantidad">−</button>' +
          '<input type="number" min="1" max="99" value="' +
          r.cantidad +
          '" data-cantidad aria-label="Cantidad de ' +
          GN.escapar(r.nombre) +
          '">' +
          '<button type="button" data-paso="1" aria-label="Aumentar cantidad">+</button>' +
          "</div>" +
          '<span class="texto-suave" style="font-size:.85rem">' +
          GN.formatearPrecio(r.precio) +
          " c/u</span>" +
          "</div></div>" +
          '<div class="linea__fin">' +
          '<span class="linea__subtotal">' +
          GN.formatearPrecio(r.precio * r.cantidad) +
          "</span>" +
          '<button type="button" class="linea__quitar" data-quitar>Eliminar</button>' +
          "</div></article>"
        );
      })
      .join("");

    var total = GN.carrito.subtotal();
    GN.$("[data-total]", resumen).textContent = GN.formatearPrecio(total);
    GN.$("[data-subtotal]", resumen).textContent = GN.formatearPrecio(total);
    GN.$("[data-numero-articulos]", resumen).textContent =
      GN.carrito.contar() === 1 ? "1 artículo" : GN.carrito.contar() + " artículos";
  }

  function eventos() {
    var contenedor = GN.$("[data-lista-carrito]");
    if (!contenedor) return;

    contenedor.addEventListener("click", function (evento) {
      var linea = evento.target.closest("[data-indice]");
      if (!linea) return;
      var indice = parseInt(linea.dataset.indice, 10);

      if (evento.target.closest("[data-quitar]")) {
        GN.carrito.eliminar(indice);
        GN.avisar("Producto eliminado del carrito.");
        return;
      }

      var botonPaso = evento.target.closest("[data-paso]");
      if (botonPaso) {
        var renglon = GN.carrito.listar()[indice];
        var cambio = parseInt(botonPaso.dataset.paso, 10);
        GN.carrito.establecerCantidad(indice, renglon.cantidad + cambio);
      }
    });

    contenedor.addEventListener("change", function (evento) {
      var linea = evento.target.closest("[data-indice]");
      if (!linea) return;
      var indice = parseInt(linea.dataset.indice, 10);

      if (evento.target.matches("[data-tamano]")) {
        GN.carrito.establecerTamano(indice, evento.target.value);
        GN.avisar("Tamaño actualizado.");
      }

      if (evento.target.matches("[data-cantidad]")) {
        GN.carrito.establecerCantidad(indice, evento.target.value);
      }
    });
  }

  function iniciar() {
    eventos();

    GN.carrito.suscribir(pintar);
    pintar();

    var botonVaciar = GN.$("[data-vaciar]");
    if (botonVaciar) {
      botonVaciar.addEventListener("click", function () {
        if (!GN.carrito.contar()) return;
        if (window.confirm("¿Seguro que quieres vaciar el carrito?")) {
          GN.carrito.vaciar();
          GN.avisar("Carrito vaciado.");
        }
      });
    }

    var botonPDF = GN.$("[data-factura]");
    if (botonPDF) botonPDF.addEventListener("click", GN.generarFacturaPDF);

    var botonWhatsApp = GN.$("[data-whatsapp]");
    if (botonWhatsApp) botonWhatsApp.addEventListener("click", GN.enviarPedidoWhatsApp);

    GN.observarRevelados();
  }

  GN.alIniciar(iniciar);
  return modulo;
})(GN || {});
