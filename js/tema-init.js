/* ==========================================================================
   Golden Notes — tema-init.js
   Se carga al principio del <head> (sin defer) para aplicar el tema
   claro/oscuro antes de pintar la página y evitar el destello blanco.
   ========================================================================== */

(function () {
  if (!window.matchMedia) return;

  var preferencia = window.matchMedia("(prefers-color-scheme: dark)");

  function sincronizarTema() {
    document.documentElement.setAttribute(
      "data-tema",
      preferencia.matches ? "oscuro" : "claro"
    );
  }

  sincronizarTema();
})();
