function reloj() {
    var hoy = new Date();
    var hr = hoy.getHours();
    var min = hoy.getMinutes();
    var sec = hoy.getSeconds();
    var zona = hoy.getTimezoneOffset() / 60;
    if (zona > 0) {
        zona = '+' + zona;
    }
    min = checkTime(min);
    sec = checkTime(sec);
    var clockEl = document.getElementById("clock");
    if (clockEl) {
        clockEl.innerHTML = hr + " : " + min + " : " + sec + " - UTC" + zona;
    }
    setTimeout(function () { reloj(); }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function fecha() {
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1;
    var anio = fechaActual.getFullYear();
    var dateEl = document.getElementById("date");
    if (dateEl) {
        dateEl.innerHTML = dia + " / " + mes + " / " + anio;
    }
}

function fechaE() {
    var fechaActual = new Date();
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1;
    var anio = fechaActual.getFullYear();
    var dateEl = document.getElementById("date");
    if (dateEl) {
        dateEl.innerHTML = mes + " / " + dia + " / " + anio;
    }
}

function ocultarCarga() {
    var contenedor = document.getElementById("contenedor_carga");
    if (contenedor) {
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
    }
}

function usarFormatoFechaIngles() {
    var path = window.location.pathname.toLowerCase();
    return path.indexOf("ingles") !== -1;
}

function iniciarPagina() {
    reloj();

    if (usarFormatoFechaIngles()) {
        fechaE();
    } else {
        fecha();
    }

    ocultarCarga();

    if (typeof initVotacionCharts === "function") {
        initVotacionCharts();
    }
}

document.addEventListener("DOMContentLoaded", iniciarPagina);
