/* ==========================================================================
   Golden Notes — carrito.js
   Modelo del carrito de compras. Persiste en localStorage del navegador y
   notifica los cambios a todas las vistas (badge del menú, página del carrito).
   Un "renglón" del carrito = un perfume en un tamaño con una cantidad.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  var CLAVE = "gn-carrito-v1";
  var renglones = [];
  var oyentes = [];
  var inicializado = false;

  /* ------------------------------ Persistencia ---------------------------- */

  function leer() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      var guardados = crudo ? JSON.parse(crudo) : [];
      if (!Array.isArray(guardados)) guardados = [];
      renglones = guardados.filter(function (r) {
        if (!r || typeof r.idPerfume !== "string") return false;
        var perfumeGuardado = GN.buscarPerfume(r.idPerfume);
        return !!perfumeGuardado && perfumeGuardado.noDisponible !== true;
      }).map(function (r) {
        var perfume = GN.buscarPerfume(r.idPerfume);
        var tamano = parseInt(r.tamano, 10);
        var cantidad = parseInt(r.cantidad, 10);
        var disponibles = GN.tamanosDisponibles(perfume);
        if (disponibles.indexOf(tamano) === -1) tamano = disponibles[0];
        return {
          idPerfume: perfume.id,
          nombre: perfume.nombre,
          disenador: perfume.disenador,
          imagen: perfume.imagen,
          tamano: tamano,
          cantidad: Math.max(1, Math.min(99, isFinite(cantidad) ? cantidad : 1)),
          precio: GN.precioDe(perfume, tamano),
        };
      });
    } catch (e) {
      renglones = [];
    }
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(renglones));
    } catch (e) {
      /* sin almacenamiento el carrito solo vive en la sesión */
    }
    notificar();
  }

  function notificar() {
    oyentes.forEach(function (funcion) {
      try {
        funcion(renglones);
      } catch (e) {
        /* un error en una vista no debe frenar las demás */
      }
    });
  }

  /* -------------------------------- API ----------------------------------- */

  function listar() {
    return renglones.slice();
  }

  function contar() {
    return renglones.reduce(function (total, r) {
      return total + r.cantidad;
    }, 0);
  }

  function subtotal() {
    return renglones.reduce(function (total, r) {
      return total + r.precio * r.cantidad;
    }, 0);
  }

  function agregar(idPerfume, tamano, cantidad) {
    var perfume = GN.buscarPerfume(idPerfume);
    if (!perfume || perfume.noDisponible === true) return false;

    tamano = parseInt(tamano, 10);
    var disponibles = GN.tamanosDisponibles(perfume);
    if (disponibles.indexOf(tamano) === -1) tamano = disponibles[0];
    cantidad = Math.min(99, Math.max(1, parseInt(cantidad, 10) || 1));

    var existente = renglones.filter(function (r) {
      return r.idPerfume === idPerfume && r.tamano === tamano;
    })[0];

    if (existente) {
      existente.cantidad = Math.min(99, existente.cantidad + cantidad);
    } else {
      renglones.push({
        idPerfume: idPerfume,
        nombre: perfume.nombre,
        disenador: perfume.disenador,
        imagen: perfume.imagen,
        tamano: tamano,
        cantidad: cantidad,
        precio: GN.precioDe(perfume, tamano),
      });
    }

    guardar();
    return true;
  }

  function establecerTamano(indice, nuevoTamano) {
    var original = renglones[indice];
    if (!original) return;

    nuevoTamano = parseInt(nuevoTamano, 10);
    var perfume = GN.buscarPerfume(original.idPerfume);
    if (!perfume) return;
    if (GN.tamanosDisponibles(perfume).indexOf(nuevoTamano) === -1 || nuevoTamano === original.tamano) return;
    original.tamano = nuevoTamano;
    original.precio = perfume ? GN.precioDe(perfume, nuevoTamano) : original.precio;

    /* Si ya existía un renglón con ese tamaño, se fusionan. */
    var dup = -1;
    renglones.forEach(function (r, i) {
      if (i !== indice && r.idPerfume === original.idPerfume && r.tamano === nuevoTamano) {
        dup = i;
      }
    });

    if (dup > -1) {
      renglones[dup].cantidad = Math.min(99, renglones[dup].cantidad + original.cantidad);
      renglones.splice(indice, 1);
    }

    guardar();
  }

  function establecerCantidad(indice, cantidad) {
    if (!renglones[indice]) return;
    cantidad = parseInt(cantidad, 10);
    if (!cantidad || cantidad < 1) {
      eliminar(indice);
      return;
    }
    renglones[indice].cantidad = Math.min(99, cantidad);
    guardar();
  }

  function eliminar(indice) {
    if (indice < 0 || indice >= renglones.length) return;
    renglones.splice(indice, 1);
    guardar();
  }

  function vaciar() {
    renglones = [];
    guardar();
  }

  function suscribir(funcion) {
    oyentes.push(funcion);
  }

  /* ----------------------- Badge de la barra superior --------------------- */

  function montarBadge() {
    if (!inicializado) {
      leer();
      inicializado = true;
    }
    function refrescar() {
      GN.$$("[data-contador-carrito]").forEach(function (badge) {
        var total = contar();
        badge.textContent = total > 99 ? "99+" : String(total);
        badge.classList.toggle("visible", total > 0);
      });
    }
    suscribir(refrescar);
    refrescar();
  }

  /* Se mantiene sincronizado si el usuario abre otra pestaña. */
  window.addEventListener("storage", function (evento) {
    if (evento.key === CLAVE) {
      leer();
      notificar();
    }
  });

  modulo.carrito = {
    listar: listar,
    contar: contar,
    subtotal: subtotal,
    agregar: agregar,
    establecerTamano: establecerTamano,
    establecerCantidad: establecerCantidad,
    eliminar: eliminar,
    vaciar: vaciar,
    suscribir: suscribir,
    montarBadge: montarBadge,
  };

  return modulo;
})(GN || {});
