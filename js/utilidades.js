/* ==========================================================================
   Golden Notes — utilidades.js
   Funciones compartidas por todas las páginas: rutas relativas, formato de
   precios, manejo del tema, notificaciones y utilidades varias.
   Expone el objeto global GN (Golden Notes).
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  /* La carpeta "paginas/" cambia las rutas relativas de la raíz del sitio. */
  var enPaginas = /\/paginas\//.test(window.location.pathname);
  var RUTA_BASE = enPaginas ? "../" : "";

  var CLAVE_TEMA = "gn-tema";

  /* ------------------------------- Selectores ---------------------------- */

  function $(selector, contexto) {
    return (contexto || document).querySelector(selector);
  }

  function $$(selector, contexto) {
    return Array.prototype.slice.call((contexto || document).querySelectorAll(selector));
  }

  /* ------------------------------- Rutas --------------------------------- */

  function ruta(relativa) {
    return RUTA_BASE + relativa;
  }

  function rutaImagen(imagen) {
    if (!imagen) return ruta("img/placeholder-perfume.svg");
    return /^https?:/i.test(imagen) || imagen.indexOf("data:") === 0
      ? imagen
      : RUTA_BASE + imagen;
  }

  function rutaDiseñador(slug) {
    return ruta("paginas/disenador.html?d=" + encodeURIComponent(slug));
  }

  /* ------------------------------- Precios -------------------------------- */

  function precioDe(perfume, tamano) {
    if (perfume && perfume.precios && typeof perfume.precios[tamano] === "number") {
      return perfume.precios[tamano];
    }
    return PRECIOS_BASE[tamano] || PRECIOS_BASE[50];
  }

  function tamanosDisponibles(perfume) {
    var disponibles = perfume && perfume.precios
      ? TAMANOS.filter(function (tamano) {
          return typeof perfume.precios[tamano] === "number";
        })
      : [];
    return disponibles.length ? disponibles : TAMANOS.slice();
  }

  function precioMinimo(perfume) {
    return Math.min.apply(
      null,
      tamanosDisponibles(perfume).map(function (t) {
        return precioDe(perfume, t);
      })
    );
  }

  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: NEGOCIO.moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  }

  /* ------------------------------- Tema ----------------------------------- */

  function temaActual() {
    return document.documentElement.getAttribute("data-tema") === "oscuro"
      ? "oscuro"
      : "claro";
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute("data-tema", tema);
    $$("[data-tema-toggle]").forEach(function (boton) {
      boton.setAttribute("aria-pressed", tema === "oscuro" ? "true" : "false");
      var interior = boton.querySelector("[data-tema-icono]");
      if (interior) interior.textContent = tema === "oscuro" ? "☀" : "☾";
      boton.setAttribute(
        "aria-label",
        tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
    });
  }

  function alternarTema() {
    aplicarTema(temaActual() === "oscuro" ? "claro" : "oscuro");
  }

  /* --------------------------- Notificaciones ----------------------------- */

  function avisar(mensaje, tipo) {
    var contenedor = $(".avisos");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.className = "avisos";
      contenedor.setAttribute("role", "status");
      document.body.appendChild(contenedor);
    }

    var aviso = document.createElement("div");
    aviso.className = "aviso" + (tipo === "error" ? " aviso--error" : "");
    aviso.innerHTML =
      '<span class="aviso__icono" aria-hidden="true">' +
      (tipo === "error" ? "!" : "✓") +
      "</span><span></span>";
    aviso.lastElementChild.textContent = mensaje;
    contenedor.appendChild(aviso);

    setTimeout(function () {
      aviso.classList.add("saliendo");
      setTimeout(function () {
        if (aviso.parentNode) aviso.parentNode.removeChild(aviso);
      }, 400);
    }, 3200);
  }

  /* ----------------------------- Utilidades ------------------------------- */

  function slugify(texto) {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function escapar(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function buscarPerfume(id) {
    for (var i = 0; i < PERFUMES.length; i++) {
      if (PERFUMES[i].id === id) return PERFUMES[i];
    }
    return null;
  }

  function listaDiseñadores() {
    var vistos = {};
    PERFUMES.forEach(function (p) {
      vistos[p.disenador] = (vistos[p.disenador] || 0) + 1;
    });
    return Object.keys(vistos)
      .map(function (nombre) {
        return {
          nombre: nombre,
          slug: slugify(nombre),
          total: vistos[nombre],
        };
      })
      .sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre, "es");
      });
  }

  function etiquetaGenero(genero) {
    if (genero === "unisex") return "Unisex";
    return genero === "mujer" ? "Mujer" : "Hombre";
  }

  function textoFecha(fecha) {
    return new Intl.DateTimeFormat("es-GT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(fecha || new Date());
  }

  function alIniciar(funcion) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", funcion);
    } else {
      funcion();
    }
  }

  var utilidades = {
    RUTA_BASE: RUTA_BASE,
    $: $,
    $$: $$,
    ruta: ruta,
    rutaImagen: rutaImagen,
    rutaDiseñador: rutaDiseñador,
    precioDe: precioDe,
    tamanosDisponibles: tamanosDisponibles,
    precioMinimo: precioMinimo,
    formatearPrecio: formatearPrecio,
    temaActual: temaActual,
    aplicarTema: aplicarTema,
    alternarTema: alternarTema,
    avisar: avisar,
    slugify: slugify,
    escapar: escapar,
    buscarPerfume: buscarPerfume,
    listaDiseñadores: listaDiseñadores,
    etiquetaGenero: etiquetaGenero,
    textoFecha: textoFecha,
    alIniciar: alIniciar,
  };
  Object.keys(utilidades).forEach(function (clave) {
    modulo[clave] = utilidades[clave];
  });
  return modulo;
})(GN || {});
