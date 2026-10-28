/* =======================================================================
   Golden Notes — factura-pdf.js
   Prepara una cotización paginada y el mensaje de pedido para WhatsApp.
   ======================================================================= */

var GN = (function (modulo) {
  "use strict";

  function obtenerCliente() {
    return {
      nombre: (GN.$("#cliente-nombre") || {}).value || "",
      telefono: (GN.$("#cliente-telefono") || {}).value || "",
      correo: (GN.$("#cliente-correo") || {}).value || "",
      direccion: (GN.$("#cliente-direccion") || {}).value || "",
      nota: (GN.$("#cliente-nota") || {}).value || "",
    };
  }

  function numeroOrden(fecha) {
    return "GN-" + fecha.getFullYear() + String(fecha.getMonth() + 1).padStart(2, "0") +
      String(fecha.getDate()).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 900) + 100);
  }

  function marcaTiempo(fecha) {
    function dosDigitos(valor) { return String(valor).padStart(2, "0"); }
    return fecha.getFullYear() + dosDigitos(fecha.getMonth() + 1) + dosDigitos(fecha.getDate()) + "-" +
      dosDigitos(fecha.getHours()) + dosDigitos(fecha.getMinutes()) + dosDigitos(fecha.getSeconds());
  }

  function cargarLogo() {
    return new Promise(function (resolve, reject) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">' +
        '<defs><linearGradient id="oro" x1="16" y1="14" x2="49" y2="51" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0" stop-color="#e8cf7a"/><stop offset=".52" stop-color="#c9a227"/>' +
        '<stop offset="1" stop-color="#a8842a"/></linearGradient>' +
        '<linearGradient id="brillo" x1="21" y1="25" x2="31" y2="45" gradientUnits="userSpaceOnUse">' +
        '<stop stop-color="#fff8dc" stop-opacity=".9"/><stop offset="1" stop-color="#fff8dc" stop-opacity=".08"/>' +
        '</linearGradient></defs><path d="M32 5.5C27.8 12.6 15 28.2 15 40a17 17 0 1 0 34 0C49 28.2 36.2 12.6 32 5.5Z" ' +
        'fill="url(#oro)" stroke="#e8cf7a" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M25.8 26.2c-3.4 5-5.2 9.3-5.2 13.7 0 3.2 1.1 6.1 3 8.4" ' +
        'stroke="url(#brillo)" stroke-width="2.2" stroke-linecap="round"/></svg>';
      var imagen = new Image();
      imagen.onload = function () {
        try {
          var canvas = document.createElement("canvas");
          canvas.width = 128;
          canvas.height = 128;
          canvas.getContext("2d").drawImage(imagen, 0, 0, 128, 128);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          resolve(null);
        }
      };
      imagen.onerror = function () { resolve(null); };
      imagen.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }

  function textoPedido(renglones, cliente) {
    var lineas = ["*Pedido — " + NEGOCIO.nombre + "*", ""];
    renglones.forEach(function (r, i) {
      lineas.push((i + 1) + ". " + r.nombre + " (" + r.disenador + ") — " + r.tamano +
        " ml × " + r.cantidad + " = " + GN.formatearPrecio(r.precio * r.cantidad));
    });
    lineas.push("", "*Total: " + GN.formatearPrecio(GN.carrito.subtotal()) + "*");
    if (cliente.nombre) lineas.push("Nombre: " + cliente.nombre);
    if (cliente.telefono) lineas.push("Teléfono: " + cliente.telefono);
    if (cliente.correo) lineas.push("Correo: " + cliente.correo);
    if (cliente.direccion) lineas.push("Dirección: " + cliente.direccion);
    if (cliente.nota) lineas.push("Nota: " + cliente.nota);
    return lineas.join("\n");
  }

  function enviarWhatsApp() {
    var renglones = GN.carrito.listar();
    if (!renglones.length) return GN.avisar("Tu carrito está vacío.", "error");
    window.open("https://wa.me/" + NEGOCIO.telefonoWhatsApp + "?text=" +
      encodeURIComponent(textoPedido(renglones, obtenerCliente())), "_blank", "noopener,noreferrer");
  }

  function generarFacturaPDF() {
    var renglones = GN.carrito.listar();
    if (!renglones.length) return GN.avisar("Tu carrito está vacío.", "error");
    if (!window.jspdf || !window.jspdf.jsPDF) {
      return GN.avisar("No se pudo cargar el generador de PDF. Revisa tu conexión a internet.", "error");
    }

    cargarLogo().then(function (logo) {
    var doc = new window.jspdf.jsPDF({ unit: "mm", format: "letter" });
    var fecha = new Date();
    var cliente = obtenerCliente();
    var orden = numeroOrden(fecha);
    var ancho = doc.internal.pageSize.getWidth();
    var alto = doc.internal.pageSize.getHeight();
    var margen = 16;
    var anchoUtil = ancho - margen * 2;
    var y;
    var total = GN.carrito.subtotal();

    function encabezadoPagina(continuacion) {
      doc.setFillColor(18, 20, 25);
      doc.rect(0, 0, ancho, 38, "F");
      doc.setFillColor(201, 162, 39);
      doc.rect(0, 37, ancho, 1, "F");
      if (logo) doc.addImage(logo, "PNG", margen, 7, 23, 23);
      doc.setTextColor(232, 207, 122);
      doc.setFont("times", "bold");
      doc.setFontSize(25);
      doc.text(NEGOCIO.nombre, margen + 28, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(245, 245, 245);
      doc.text(NEGOCIO.telefono, ancho - margen, 13, { align: "right" });
      doc.text(NEGOCIO.correo, ancho - margen, 18, { align: "right" });
      doc.text(NEGOCIO.pais, ancho - margen, 23, { align: "right" });
      doc.setFontSize(8.5);
      doc.setTextColor(232, 207, 122);
      doc.text(continuacion ? "COTIZACIÓN · CONTINUACIÓN" : "COTIZACIÓN DE PEDIDO", margen + 28, 23);
      y = 47;
    }

    function nuevaPagina() {
      doc.addPage();
      encabezadoPagina(true);
    }

    function asegurarEspacio(altura) {
      if (y + altura > alto - 20) nuevaPagina();
    }

    function escribirCampo(etiqueta, valor) {
      if (!valor) return;
      var lineas = doc.splitTextToSize(etiqueta + ": " + valor, anchoUtil);
      asegurarEspacio(lineas.length * 4.5 + 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(65, 65, 65);
      doc.text(lineas, margen, y);
      y += lineas.length * 4.5 + 1;
    }

    function cabeceraTabla() {
      doc.setFillColor(240, 236, 226);
      doc.rect(margen, y, anchoUtil, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(65, 65, 65);
      doc.text("PRODUCTO", margen + 2, y + 5.3);
      doc.text("TAMAÑO", 121, y + 5.3, { align: "center" });
      doc.text("PRECIO", 150, y + 5.3, { align: "right" });
      doc.text("CANT.", 166, y + 5.3, { align: "right" });
      doc.text("SUBTOTAL", ancho - margen - 2, y + 5.3, { align: "right" });
      y += 8;
    }

    encabezadoPagina(false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(35, 35, 35);
    doc.text("Orden: " + orden, margen, y);
    doc.text("Fecha: " + GN.textoFecha(fecha), ancho - margen, y, { align: "right" });
    y += 8;

    cabeceraTabla();
    renglones.forEach(function (r, i) {
      var nombre = doc.splitTextToSize(r.nombre + " — " + r.disenador, 78);
      var altoFila = Math.max(9, nombre.length * 4.3 + 4);
      if (y + altoFila > alto - 28) {
        nuevaPagina();
        cabeceraTabla();
      }
      if (i % 2) {
        doc.setFillColor(250, 249, 246);
        doc.rect(margen, y, anchoUtil, altoFila, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      doc.text(nombre, margen + 2, y + 4.5);
      doc.text(r.tamano + " ml", 121, y + 4.5, { align: "center" });
      doc.text(GN.formatearPrecio(r.precio), 150, y + 4.5, { align: "right" });
      doc.text(String(r.cantidad), 166, y + 4.5, { align: "right" });
      doc.text(GN.formatearPrecio(r.precio * r.cantidad), ancho - margen - 2, y + 4.5, { align: "right" });
      y += altoFila;
    });

    asegurarEspacio(31);
    y += 4;
    doc.setDrawColor(201, 162, 39);
    doc.setLineWidth(0.5);
    doc.line(margen, y, ancho - margen, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(65, 65, 65);
    doc.text("Subtotal", ancho - margen - 43, y);
    doc.text(GN.formatearPrecio(total), ancho - margen, y, { align: "right" });
    y += 7;
    doc.setFillColor(232, 207, 122);
    doc.roundedRect(ancho - margen - 68, y - 5, 68, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 25, 25);
    doc.text("TOTAL", ancho - margen - 64, y + 2.5);
    doc.text(GN.formatearPrecio(total), ancho - margen - 3, y + 2.5, { align: "right" });

    y += 18;
    var campos = [["Nombre", cliente.nombre], ["Teléfono", cliente.telefono],
      ["Correo", cliente.correo], ["Dirección", cliente.direccion], ["Nota", cliente.nota]];
    if (campos.some(function (campo) { return !!campo[1]; })) {
      asegurarEspacio(22);
      doc.setDrawColor(225, 220, 208);
      doc.line(margen, y, ancho - margen, y);
      y += 7;
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(35, 35, 35);
      doc.text("Datos del cliente", margen, y);
      y += 7;
      campos.forEach(function (campo) { escribirCampo(campo[0], campo[1]); });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(115, 115, 115);
    doc.text(doc.splitTextToSize(NEGOCIO.notaFactura, anchoUtil), margen, alto - 13);
    var nombreArchivo = "golden-notes-" + marcaTiempo(fecha) + ".pdf";
    var archivoPDF = new File([doc.output("blob")], nombreArchivo, { type: "application/pdf" });
    var puedeCompartirArchivo = !!(navigator.share && navigator.canShare &&
      navigator.canShare({ files: [archivoPDF] }));

    if (puedeCompartirArchivo) {
      navigator.share({ files: [archivoPDF], title: "Cotización Golden Notes" })
        .then(function () { GN.avisar("Cotización compartida correctamente."); })
        .catch(function (error) {
          if (error && error.name === "AbortError") return;
          descargarPDF(archivoPDF, nombreArchivo);
        });
    } else {
      descargarPDF(archivoPDF, nombreArchivo);
    }
    }).catch(function () {
      GN.avisar("No se pudo generar la cotización. Inténtalo de nuevo.", "error");
    });
  }

  function descargarPDF(archivo, nombre) {
    var url = URL.createObjectURL(archivo);
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    enlace.style.display = "none";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    GN.avisar("Cotización PDF descargada correctamente.");
  }

  modulo.generarFacturaPDF = generarFacturaPDF;
  modulo.enviarPedidoWhatsApp = enviarWhatsApp;
  return modulo;
})(GN || {});
