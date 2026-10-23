/* ==========================================================================
   Golden Notes — catalogo.js
   Lógica de la página del catálogo: búsqueda por nombre o diseñador,
   filtros por género, diseñador y familia olfativa, ordenamiento y
   sincronización con la URL para poder compartir enlaces con filtros.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  var estado = { q: "", genero: "", diseñador: "", familia: "", orden: "nombre-asc" };
  var temporizador = null;

  /* ------------------------------- Filtros -------------------------------- */

  function familias() {
    var vistos = {};
    PERFUMES.forEach(function (p) {
      vistos[p.familia] = true;
    });
    return Object.keys(vistos).sort(function (a, b) {
      return a.localeCompare(b, "es");
    });
  }

  function pintarSelectorDiseñadores() {
    var selector = GN.$("#filtro-disenador");
    if (!selector) return;
    selector.innerHTML =
      '<option value="">Todos los diseñadores</option>' +
      GN.listaDiseñadores()
        .map(function (d) {
          return '<option value="' + GN.escapar(d.nombre) + '">' + GN.escapar(d.nombre) + " (" + d.total + ")</option>";
        })
        .join("");
  }

  function pintarFamilias() {
    var contenedor = GN.$("[data-familias]");
    if (!contenedor) return;
    contenedor.innerHTML =
      '<button type="button" class="chip activo" data-familia="">Todas las familias</button>' +
      familias()
        .map(function (familia) {
          return (
            '<button type="button" class="chip" data-familia="' +
            GN.escapar(familia) +
            '">' +
            GN.escapar(familia) +
            "</button>"
          );
        })
        .join("");
  }

  // Normaliza acentos y espacios para que las búsquedas coincidan con los
  // datos aunque el visitante escriba sin tildes (por ejemplo, "ambar").
  function normalizarBusqueda(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();
  }

  function filtrar() {
    var consulta = normalizarBusqueda(estado.q);

    var lista = PERFUMES.filter(function (perfume) {
      if (estado.genero && perfume.genero !== estado.genero) return false;
      if (estado.diseñador && perfume.disenador !== estado.diseñador) return false;
      if (estado.familia && perfume.familia !== estado.familia) return false;
      if (!consulta) return true;

      var sobre = normalizarBusqueda([
        perfume.nombre,
        perfume.disenador,
        perfume.familia,
        (perfume.acordes || []).join(" "),
        (perfume.notas || []).join(" "),
        perfume.piramide
          ? [
              (perfume.piramide.salida || []).join(" "),
              (perfume.piramide.corazon || []).join(" "),
              (perfume.piramide.fondo || []).join(" ")
            ].join(" ")
          : ""
      ].join(" "));

      return sobre.indexOf(consulta) !== -1;
    });

    var orden = estado.orden;
    lista.sort(function (a, b) {
      // Mantiene los perfumes no disponibles al final con cualquier orden.
      if (a.noDisponible === true && b.noDisponible !== true) return 1;
      if (a.noDisponible !== true && b.noDisponible === true) return -1;
      if (orden === "nombre-asc") return a.nombre.localeCompare(b.nombre, "es");
      if (orden === "nombre-desc") return b.nombre.localeCompare(a.nombre, "es");
      if (orden === "precio-asc") return GN.precioMinimo(a) - GN.precioMinimo(b);
      if (orden === "precio-desc") return GN.precioMinimo(b) - GN.precioMinimo(a);
      if (orden === "disenador") return a.disenador.localeCompare(b.disenador, "es");
      return 0;
    });

    return lista;
  }

  function sincronizarURL() {
    var parametros = new URLSearchParams();
    if (estado.q) parametros.set("q", estado.q);
    if (estado.genero) parametros.set("genero", estado.genero);
    if (estado.diseñador) parametros.set("disenador", estado.diseñador);
    if (estado.familia) parametros.set("familia", estado.familia);
    if (estado.orden && estado.orden !== "nombre-asc") parametros.set("orden", estado.orden);

    var texto = parametros.toString();
    var nueva = window.location.pathname + (texto ? "?" + texto : "");
    window.history.replaceState(null, "", nueva);
  }

  function pintarResultados() {
    var lista = filtrar();
    var contador = GN.$("[data-contador]");
    if (contador) {
      contador.textContent =
        lista.length === 1 ? "1 fragancia encontrada" : lista.length + " fragancias encontradas";
    }

    GN.renderizar(lista, GN.$("[data-rejilla-catalogo]"));
    sincronizarURL();
    GN.observarRevelados();
  }

  /* ------------------------------ Sincronizar ----------------------------- */

  function leerURL() {
    var parametros = new URLSearchParams(window.location.search);
    estado.q = parametros.get("q") || "";
    estado.genero = parametros.get("genero") || "";
    estado.diseñador = parametros.get("disenador") || "";
    estado.familia = parametros.get("familia") || "";
    estado.orden = parametros.get("orden") || "nombre-asc";

    var buscador = GN.$("#buscar");
    if (buscador) buscador.value = estado.q;

    var selectorD = GN.$("#filtro-disenador");
    if (selectorD) selectorD.value = estado.diseñador;

    var selectorO = GN.$("#filtro-orden");
    if (selectorO) selectorO.value = estado.orden;

    GN.$$("[data-genero]").forEach(function (chip) {
      chip.classList.toggle("activo", chip.dataset.genero === estado.genero);
    });

    GN.$$("[data-familia]").forEach(function (chip) {
      chip.classList.toggle("activo", chip.dataset.familia === estado.familia);
    });
  }

  function iniciar() {
    pintarSelectorDiseñadores();
    pintarFamilias();
    leerURL();

    var buscador = GN.$("#buscar");
    if (buscador) {
      buscador.addEventListener("input", function () {
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
          estado.q = buscador.value;
          pintarResultados();
        }, 220);
      });
    }

    GN.$$("[data-genero]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        estado.genero = chip.dataset.genero;
        GN.$$("[data-genero]").forEach(function (otro) {
          otro.classList.toggle("activo", otro === chip);
        });
        pintarResultados();
      });
    });

    var selectorD = GN.$("#filtro-disenador");
    if (selectorD) {
      selectorD.addEventListener("change", function () {
        estado.diseñador = selectorD.value;
        pintarResultados();
      });
    }

    var contenedorFamilias = GN.$("[data-familias]");
    if (contenedorFamilias) {
      contenedorFamilias.addEventListener("click", function (evento) {
        var chip = evento.target.closest("[data-familia]");
        if (!chip) return;
        estado.familia = chip.dataset.familia;
        actualizarResumenFamilias();
        if (window.matchMedia("(max-width: 768px)").matches) plegarFamilias(true);
        GN.$$("[data-familia]", contenedorFamilias).forEach(function (otro) {
          otro.classList.toggle("activo", otro === chip);
        });
        pintarResultados();
      });
    }

    var selectorO = GN.$("#filtro-orden");
    if (selectorO) {
      selectorO.addEventListener("change", function () {
        estado.orden = selectorO.value;
        pintarResultados();
      });
    }

    var filaFamilias = GN.$("[data-familias-contenedor]");
    var botonFamilias = GN.$("[data-toggle-familias]");
    var resumenFamilias = GN.$("[data-resumen-familias]");
    var familiasPlegadas = false;

    function actualizarResumenFamilias() {
      if (resumenFamilias) resumenFamilias.textContent = estado.familia || "Ver opciones";
    }

    function plegarFamilias(plegadas) {
      if (!filaFamilias || !botonFamilias) return;
      familiasPlegadas = plegadas;
      filaFamilias.classList.toggle("plegado", plegadas);
      botonFamilias.setAttribute("aria-expanded", plegadas ? "false" : "true");
    }

    if (filaFamilias && botonFamilias) {
      botonFamilias.addEventListener("click", function () {
        plegarFamilias(!familiasPlegadas);
      });

      function esVistaMovil() {
        return window.matchMedia("(max-width: 768px)").matches;
      }

      function plegarAlDesplazarse() {
        if (!esVistaMovil()) {
          plegarFamilias(false);
          return;
        }
        var inicioFamilias = filaFamilias.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > inicioFamilias - 84) plegarFamilias(true);
      }

      function ajustarAlAncho() {
        plegarFamilias(esVistaMovil());
      }

      window.addEventListener("scroll", plegarAlDesplazarse, { passive: true });
      window.addEventListener("resize", ajustarAlAncho);
      ajustarAlAncho();
    }

    actualizarResumenFamilias();

    var botonLimpiar = GN.$("[data-limpiar]");
    if (botonLimpiar) {
      botonLimpiar.addEventListener("click", function () {
        estado = { q: "", genero: "", diseñador: "", familia: "", orden: "nombre-asc" };
        actualizarResumenFamilias();
        if (buscador) buscador.value = "";
        if (selectorD) selectorD.value = "";
        if (selectorO) selectorO.value = "nombre-asc";
        GN.$$('[data-genero], [data-familia]').forEach(function (chip) {
          chip.classList.toggle("activo", chip.dataset.genero === "" || chip.dataset.familia === "");
        });
        pintarResultados();
        GN.avisar("Filtros restablecidos.");
      });
    }

    pintarResultados();
    GN.observarRevelados();
  }

  GN.alIniciar(iniciar);
  return modulo;
})(GN || {});
