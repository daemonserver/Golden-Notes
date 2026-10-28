/* ==========================================================================
   Golden Notes — disenador.js
   Lógica de la página de diseñadores:
   - Sin parámetro: muestra la cuadrícula con todas las casas y su conteo.
   - Con ?d=slug: muestra los perfumes de ese diseñador (cabecera + rejilla).
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function nombreDesdeSlug(slug) {
    var lista = GN.listaDiseñadores();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].slug === slug) return lista[i].nombre;
    }
    return null;
  }

  function pintarIndice() {
    var rejilla = GN.$("[data-rejilla-disenadores]");
    if (!rejilla) return;

    rejilla.innerHTML = GN.listaDiseñadores()
      .map(function (diseñador, indice) {
        var ejemplo = PERFUMES.filter(function (p) {
          return p.disenador === diseñador.nombre;
        })[0];

        return (
          '<a class="tarjeta-disenador revelar" style="--retardo:' +
          (indice * 0.03).toFixed(2) +
          's" href="' +
          GN.rutaDiseñador(diseñador.slug) +
          '">' +
          '<img class="tarjeta-disenador__img" src="' +
          GN.rutaImagen(ejemplo ? ejemplo.imagen : null) +
          '" alt="" aria-hidden="true" loading="lazy" decoding="async">' +
          '<div class="tarjeta-disenador__contenido">' +
          "<h3>" +
          GN.escapar(diseñador.nombre) +
          "</h3>" +
          "<p>" +
          diseñador.total +
          (diseñador.total === 1 ? " perfume" : " perfumes") +
          "</p>" +
          "</div></a>"
        );
      })
      .join("");

    rejilla.classList.add("es-visible");
    GN.observarRevelados();
  }

  function pintarPerfumes(nombre) {
    var rejilla = GN.$("[data-rejilla-disenadores]");
    var seccionIndice = GN.$("[data-seccion-indice]");
    var seccionPerfumes = GN.$("[data-seccion-perfumes]");
    if (!rejilla || !seccionIndice || !seccionPerfumes) return;

    var lista = PERFUMES.filter(function (p) {
      return p.disenador === nombre;
    });

    seccionIndice.hidden = true;
    seccionPerfumes.hidden = false;

    GN.$("[data-nombre-disenador]", seccionPerfumes).textContent = nombre;
    GN.$("[data-total-disenador]", seccionPerfumes).textContent =
      lista.length === 1 ? "1 fragancia disponible" : lista.length + " fragancias disponibles";

    document.title = nombre + " — Perfumes | Golden Notes";

    var contenedor = GN.$("[data-rejilla-perfumes]", seccionPerfumes);
    GN.renderizar(lista, contenedor);
    GN.observarRevelados();
  }

  function iniciar() {
    var parametros = new URLSearchParams(window.location.search);
    var slug = (parametros.get("d") || "").toLowerCase();
    var nombre = slug ? nombreDesdeSlug(slug) : null;

    if (nombre) {
      pintarPerfumes(nombre);
    } else {
      pintarIndice();
      var seccionPerfumes = GN.$("[data-seccion-perfumes]");
      if (seccionPerfumes) seccionPerfumes.hidden = true;
    }

    GN.observarRevelados();
  }

  GN.alIniciar(iniciar);
  return modulo;
})(GN || {});
