/* ==========================================================================
   Golden Notes — contacto.js
   Formulario de contacto: redacta el mensaje y lo envía por WhatsApp o
   correo electrónico (no necesita servidor). También incluye botones para
   copiar los datos de contacto al portapapeles.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function textoFormulario() {
    var nombre = (GN.$("#nombre") || {}).value || "";
    var correo = (GN.$("#correo") || {}).value || "";
    var mensaje = (GN.$("#mensaje") || {}).value || "";

    return (
      "Hola " +
      NEGOCIO.nombre +
      ", soy " +
      (nombre || "…") +
      ".\n\n" +
      mensaje +
      (correo ? "\n\nMi correo: " + correo : "")
    );
  }

  function enviarPorWhatsApp() {
    var url =
      "https://wa.me/" +
      NEGOCIO.telefonoWhatsApp +
      "?text=" +
      encodeURIComponent(textoFormulario());
    window.open(url, "_blank", "noopener");
  }

  function enviarPorCorreo() {
    var asunto = encodeURIComponent("Consulta desde la web de " + NEGOCIO.nombre);
    var cuerpo = encodeURIComponent(textoFormulario());
    window.location.href = "mailto:" + NEGOCIO.correo + "?subject=" + asunto + "&body=" + cuerpo;
  }

  function copiar(texto, mensaje) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(
        function () {
          GN.avisar(mensaje);
        },
        function () {
          GN.avisar("No se pudo copiar. Anótalo: " + texto, "error");
        }
      );
    } else {
      GN.avisar("Copia manualmente: " + texto, "error");
    }
  }

  function validar() {
    var nombre = GN.$("#nombre");
    var mensaje = GN.$("#mensaje");
    if (!nombre.value.trim()) {
      GN.avisar("Escribe tu nombre para continuar.", "error");
      nombre.focus();
      return false;
    }
    if (!mensaje.value.trim()) {
      GN.avisar("Cuéntanos en qué podemos ayudarte.", "error");
      mensaje.focus();
      return false;
    }
    return true;
  }

  function iniciar() {
    var formulario = GN.$("[data-formulario-contacto]");
    if (formulario) {
      formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (validar()) enviarPorWhatsApp();
      });

      var botonCorreo = GN.$("[data-enviar-correo]");
      if (botonCorreo) {
        botonCorreo.addEventListener("click", function () {
          if (validar()) enviarPorCorreo();
        });
      }
    }

    GN.$$("[data-copiar]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        copiar(boton.dataset.copiar, "Copiado al portapapeles.");
      });
    });

    GN.observarRevelados();
  }

  GN.alIniciar(iniciar);
  return modulo;
})(GN || {});
