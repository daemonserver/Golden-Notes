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
      doc.rect(0, 0, ancho, 34, "F");
      doc.setTextColor(232, 207, 122);
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.text(NEGOCIO.nombre, margen, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(245, 245, 245);
      doc.text(NEGOCIO.telefono + " · " + NEGOCIO.correo, ancho - margen, 15, { align: "right" });
      doc.text(NEGOCIO.pais, ancho - margen, 21, { align: "right" });
      doc.setFontSize(9);
      doc.text(continuacion ? "COTIZACIÓN · CONTINUACIÓN" : "COTIZACIÓN DE PEDIDO", margen, 26);
      y = 43;
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

    var campos = [["Nombre", cliente.nombre], ["Teléfono", cliente.telefono],
      ["Correo", cliente.correo], ["Dirección", cliente.direccion], ["Nota", cliente.nota]];
    if (campos.some(function (campo) { return !!campo[1]; })) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Datos del cliente", margen, y);
      y += 5;
      campos.forEach(function (campo) { escribirCampo(campo[0], campo[1]); });
      y += 2;
    }

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

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(115, 115, 115);
    doc.text(doc.splitTextToSize(NEGOCIO.notaFactura, anchoUtil), margen, alto - 13);
    doc.save("golden-notes-" + orden.toLowerCase() + ".pdf");
    GN.avisar("Cotización PDF descargada correctamente.");
  }

  modulo.generarFacturaPDF = generarFacturaPDF;
  modulo.enviarPedidoWhatsApp = enviarWhatsApp;
  return modulo;
})(GN || {});
