/* ==========================================================================
   Golden Notes — tarjetas.js
   Componente visual reutilizable de las tarjetas de perfume. Se usa en la
   portada, el catálogo y la página de diseñadores.
   ========================================================================== */

var GN = (function (modulo) {
  "use strict";

  function acordesHTML(acordes) {
    return (acordes || [])
      .slice(0, 4)
      .map(function (acorde) {
        return '<li class="acorde">' + GN.escapar(acorde) + "</li>";
      })
      .join("");
  }

  function crearTarjeta(perfume) {
    var noDisponible = perfume.noDisponible === true;
    var articulo = document.createElement("article");
    articulo.className = "tarjeta cristal revelar";
    articulo.dataset.id = perfume.id;
    articulo.setAttribute("tabindex", "0");
    articulo.setAttribute(
      "aria-label",
      perfume.nombre + " de " + perfume.disenador +
        (noDisponible ? ". No disponible. Ver detalle" : ". Ver detalle")
    );

    articulo.innerHTML =
      '<div class="tarjeta__marco">' +
      '<span class="tarjeta__genero etiqueta etiqueta--cristal">' +
      GN.etiquetaGenero(perfume.genero) +
      "</span>" +
      (noDisponible
        ? '<span class="etiqueta etiqueta--no-disponible tarjeta__disponibilidad">No disponible</span>'
        : '<button class="tarjeta__rapida" type="button" data-accion="agregar" ' +
          'aria-label="Añadir ' + GN.escapar(perfume.nombre) + ' al carrito" title="Añadir al carrito">🛒</button>') +
      '<img class="tarjeta__img" src="' +
      GN.rutaImagen(perfume.imagen) +
      '" alt="' +
      GN.escapar(perfume.nombre + " — " + perfume.disenador) +
      '" loading="lazy" width="400" height="440">' +
      "</div>" +
      '<div class="tarjeta__cuerpo">' +
      '<p class="tarjeta__disenador">' + GN.escapar(perfume.disenador) + "</p>" +
      '<h3 class="tarjeta__nombre">' + GN.escapar(perfume.nombre) + "</h3>" +
      '<ul class="acordes">' + acordesHTML(perfume.acordes) + "</ul>" +
      '<div class="tarjeta__pie">' +
      '<span class="precio">' +
      GN.formatearPrecio(GN.precioMinimo(perfume)) +
      "<small>desde</small></span>" +
      '<span class="btn btn--oro" data-accion="detalle">Ver detalle</span>' +
      "</div></div>";

    function abrir(event) {
      if (event.target.closest('[data-accion="agregar"]')) return;
      if (typeof GN.abrirDetalle === "function") GN.abrirDetalle(perfume.id);
    }

    articulo.addEventListener("click", abrir);
    articulo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir(event);
      }
    });

    var botonAgregar = articulo.querySelector('[data-accion="agregar"]');
    if (botonAgregar) botonAgregar.addEventListener("click", function (evento) {
      evento.stopPropagation();
      if (!GN.carrito.agregar(perfume.id, TAMANOS[0], 1)) {
        GN.avisar("Este perfume no está disponible.", "error");
        return;
      }
      GN.avisar(perfume.nombre + " (" + TAMANOS[0] + " ml) añadido al carrito.");
    });

    return articulo;
  }

  function renderizar(lista, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (!lista.length) {
      var vacio = document.createElement("div");
      vacio.className = "vacio revelar";
      vacio.innerHTML =
        '<div class="vacio__icono" aria-hidden="true">🔍</div>' +
        "<h3>Sin resultados</h3>" +
        '<p class="texto-suave">Prueba con otro nombre, diseñador o filtro.</p>' +
        '<a class="btn btn--contorno" href="' +
        GN.ruta("paginas/catalogo.html") +
        '">Ver catálogo completo</a>';
      contenedor.appendChild(vacio);
      contenedor.classList.add("es-visible");
      return;
    }

    var fragmento = document.createDocumentFragment();
    lista.forEach(function (perfume) {
      fragmento.appendChild(crearTarjeta(perfume));
    });
    contenedor.appendChild(fragmento);
    contenedor.classList.add("es-visible");
  }

  /* ------------------ Aparición progresiva de elementos ------------------- */

  function observarRevelados() {
    var elementos = GN.$$(".revelar:not(.es-visible)");
    if (!elementos.length) return;

    if (!("IntersectionObserver" in window)) {
      elementos.forEach(function (elemento) {
        elemento.classList.add("es-visible");
      });
      return;
    }

    var altoVentana = window.innerHeight || 0;

    function enPantalla(elemento) {
      return elemento.getBoundingClientRect().top < altoVentana + 60;
    }

    /* Lo que ya está a la vista se revela de inmediato: más fiable y evita
       que una cuadrícula quede invisible si el observer no llega a dispararse. */
    var pendientes = [];
    elementos.forEach(function (elemento) {
      if (enPantalla(elemento)) elemento.classList.add("es-visible");
      else pendientes.push(elemento);
    });

    if (!pendientes.length) return;

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("es-visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    pendientes.forEach(function (elemento) {
      observador.observe(elemento);
    });

    /* Red de seguridad: si el navegador no emite los cambios de intersección
       (capturas automáticas, pestañas en segundo plano…), todo lo que siga
       dentro de la pantalla se revela pase lo que pase. */
    setTimeout(function () {
      pendientes.forEach(function (elemento) {
        if (enPantalla(elemento)) {
          elemento.classList.add("es-visible");
          observador.unobserve(elemento);
        }
      });
    }, 1500);
  }

  modulo.acordesHTML = acordesHTML;
  modulo.crearTarjeta = crearTarjeta;
  modulo.renderizar = renderizar;
  modulo.observarRevelados = observarRevelados;

  return modulo;
})(GN || {});
