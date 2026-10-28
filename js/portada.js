/* ==========================================================================
   Golden Notes — portada.js
   Lógica de la página de inicio: vitrina animada de fragancias destacadas,
   estadísticas del catálogo y sección de destacados.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function perfumesDestacados() {
    return DESTACADOS.map(GN.buscarPerfume).filter(Boolean);
  }

  function pintarVitrina() {
    var vitrina = GN.$("[data-vitrina]");
    if (!vitrina) return;

    var lista = perfumesDestacados();
    if (!lista.length) return;

    vitrina.innerHTML = lista
      .slice(0, 4)
      .map(function (perfume, indice) {
        return (
          '<a class="vitrina__tarjeta" href="' +
          GN.ruta("paginas/catalogo.html") +
          "?q=" +
          encodeURIComponent(perfume.nombre) +
          '" aria-label="Ver ' +
          GN.escapar(perfume.nombre) +
          '">' +
          '<img src="' +
          GN.rutaImagen(perfume.imagen) +
          '" alt="' +
          GN.escapar(perfume.nombre + " — " + perfume.disenador) +
          '" loading="eager" decoding="async" ' +
          (indice === 0 ? 'fetchpriority="high" ' : "") +
          'width="300" height="330">' +
          '<div class="vitrina__info">' +
          '<p class="vitrina__disenador">' +
          GN.escapar(perfume.disenador) +
          "</p>" +
          '<p class="vitrina__nombre">' +
          GN.escapar(perfume.nombre) +
          "</p>" +
          "</div></a>"
        );
      })
      .join("");
  }

  function pintarDestacados() {
    var rejilla = GN.$("[data-destacados]");
    if (!rejilla) return;

    var lista = perfumesDestacados();
    rejilla.innerHTML = "";
    lista.forEach(function (perfume) {
      rejilla.appendChild(GN.crearTarjeta(perfume));
    });
    rejilla.classList.add("es-visible");
  }

  function pintarEstadisticas() {
    var hombres = PERFUMES.filter(function (p) {
      return p.genero === "hombre";
    }).length;
    var mujeres = PERFUMES.filter(function (p) {
      return p.genero === "mujer";
    }).length;

    GN.$$("[data-estadistica]").forEach(function (elemento) {
      var clave = elemento.dataset.estadistica;
      if (clave === "total") elemento.textContent = String(PERFUMES.length);
      if (clave === "hombres") elemento.textContent = String(hombres);
      if (clave === "mujeres") elemento.textContent = String(mujeres);
      if (clave === "disenadores") elemento.textContent = String(GN.listaDiseñadores().length);
    });
  }

  function iniciar() {
    pintarVitrina();
    pintarDestacados();
    pintarEstadisticas();
    GN.observarRevelados();
  }

  GN.alIniciar(iniciar);
  return modulo;
})(GN || {});
