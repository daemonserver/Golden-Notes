/* ==========================================================================
   Golden Notes — navegacion.js
   Comportamiento compartido del encabezado en todas las páginas:
   menú móvil, efecto cristal al desplazar, botón de modo oscuro,
   enlace activo, badge del carrito y apariciones al hacer scroll.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function iniciarEncabezado() {
    var encabezado = GN.$("[data-encabezado]");
    if (!encabezado) return;

    var hamburguesa = GN.$("[data-hamburguesa]");
    var menuMovil = GN.$("[data-menu-movil]");

    function alDesplazar() {
      encabezado.classList.toggle("desplazado", window.scrollY > 24);
    }

    window.addEventListener("scroll", alDesplazar, { passive: true });
    alDesplazar();

    if (hamburguesa && menuMovil) {
      hamburguesa.addEventListener("click", function () {
        var abierto = menuMovil.classList.toggle("abierto");
        hamburguesa.classList.toggle("abierto", abierto);
        hamburguesa.setAttribute("aria-expanded", abierto ? "true" : "false");
      });

      menuMovil.addEventListener("click", function (evento) {
        if (evento.target.closest("a")) {
          menuMovil.classList.remove("abierto");
          hamburguesa.classList.remove("abierto");
          hamburguesa.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  function marcarEnlaceActivo() {
    var pagina =
      (window.location.pathname.split("/").pop() || "index.html").toLowerCase() ||
      "index.html";

    GN.$$("[data-nav]").forEach(function (enlace) {
      var destino = enlace.getAttribute("href").split("?")[0].split("/").pop().toLowerCase();
      var coincide =
        destino === pagina ||
        (pagina === "" && destino === "index.html") ||
        (destino === "index.html" && (pagina === "" || pagina === "index.html"));

      /* En la raíz GitHub puede servir el directorio sin nombre de archivo. */
      if (!coincide && destino === "index.html" && pagina.indexOf(".html") === -1) {
        coincide = true;
      }

      enlace.classList.toggle("activo", coincide);
      if (coincide) enlace.setAttribute("aria-current", "page");
    });
  }

  function iniciarTema() {
    GN.$$("[data-tema-toggle]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        GN.alternarTema();
      });
    });
    GN.aplicarTema(GN.temaActual());

    if (window.matchMedia) {
      var preferencia = window.matchMedia("(prefers-color-scheme: dark)");
      var alCambiarSistema = function (evento) {
        GN.aplicarTema(evento.matches ? "oscuro" : "claro");
      };
      if (preferencia.addEventListener) {
        preferencia.addEventListener("change", alCambiarSistema);
      } else if (preferencia.addListener) {
        preferencia.addListener(alCambiarSistema);
      }
    }
  }

  function iniciarPie() {
    GN.$$("[data-anio]").forEach(function (elemento) {
      elemento.textContent = String(new Date().getFullYear());
    });
  }

  function iniciar() {
    iniciarEncabezado();
    marcarEnlaceActivo();
    iniciarTema();
    iniciarPie();
    GN.carrito.montarBadge();
    GN.observarRevelados();
  }

  modulo.iniciarNavegacion = iniciar;

  return modulo;
})(GN || {});

GN.alIniciar(GN.iniciarNavegacion);
