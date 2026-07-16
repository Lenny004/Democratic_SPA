(function () {
  "use strict";

  var votacionData = null;
  var charts = {
    barras: null,
    pastel: null,
    linea: null
  };

  var chartDefaults = {
    color: "#CFD3D6",
    borderColor: "#292F3B"
  };

  function getTotalVotos() {
    if (!votacionData || !votacionData.opciones) {
      return 0;
    }
    return votacionData.opciones.reduce(function (sum, opcion) {
      return sum + opcion.votos;
    }, 0);
  }

  function getLabels() {
    return votacionData.opciones.map(function (opcion) {
      return opcion.nombre;
    });
  }

  function getVotos() {
    return votacionData.opciones.map(function (opcion) {
      return opcion.votos;
    });
  }

  function getColores() {
    return votacionData.opciones.map(function (opcion) {
      return opcion.color;
    });
  }

  function updateHeader() {
    var config = window.DEMOCRATIC_CONFIG || {};
    var tituloEl = document.getElementById("votacion-titulo");
    var taglineEl = document.getElementById("votacion-tagline");
    var totalEl = document.getElementById("votacion-total");

    if (tituloEl) {
      tituloEl.textContent = votacionData.titulo || config.nombre;
    }

    if (taglineEl) {
      taglineEl.textContent = config.tagline + " - " + (config.anio || new Date().getFullYear());
    }

    if (totalEl) {
      totalEl.textContent = "Total de votos registrados: " + getTotalVotos();
    }
  }

  function buildChartOptions(type) {
    var base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#CFD3D6",
            font: { family: "Cambria", size: 12 }
          }
        }
      }
    };

    if (type === "bar" || type === "line") {
      base.scales = {
        x: {
          ticks: { color: "#CFD3D6", maxRotation: 45, minRotation: 0 },
          grid: { color: "rgba(207, 211, 214, 0.15)" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#CFD3D6", precision: 0 },
          grid: { color: "rgba(207, 211, 214, 0.15)" }
        }
      };
    }

    return base;
  }

  function createCharts() {
    var ctxBarras = document.getElementById("chart-barras");
    var ctxPastel = document.getElementById("chart-pastel");
    var ctxLinea = document.getElementById("chart-linea");

    if (!ctxBarras || !ctxPastel || !ctxLinea || typeof Chart === "undefined") {
      return;
    }

    if (charts.barras) charts.barras.destroy();
    if (charts.pastel) charts.pastel.destroy();
    if (charts.linea) charts.linea.destroy();

    charts.barras = new Chart(ctxBarras, {
      type: "bar",
      data: {
        labels: getLabels(),
        datasets: [{
          label: "Votos",
          data: getVotos(),
          backgroundColor: getColores(),
          borderColor: chartDefaults.borderColor,
          borderWidth: 1
        }]
      },
      options: buildChartOptions("bar")
    });

    charts.pastel = new Chart(ctxPastel, {
      type: "doughnut",
      data: {
        labels: getLabels(),
        datasets: [{
          data: getVotos(),
          backgroundColor: getColores(),
          borderColor: "#292F3B",
          borderWidth: 2
        }]
      },
      options: buildChartOptions("doughnut")
    });

    var historial = votacionData.historial || [getTotalVotos()];
    charts.linea = new Chart(ctxLinea, {
      type: "line",
      data: {
        labels: historial.map(function (_, index) {
          return "T" + (index + 1);
        }),
        datasets: [{
          label: "Acumulado de votos",
          data: historial,
          borderColor: "#6B969D",
          backgroundColor: "rgba(107, 150, 157, 0.2)",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "#6B969D",
          pointBorderColor: "#CFD3D6"
        }]
      },
      options: buildChartOptions("line")
    });
  }

  function refreshCharts() {
    if (!charts.barras) {
      createCharts();
      return;
    }

    charts.barras.data.labels = getLabels();
    charts.barras.data.datasets[0].data = getVotos();
    charts.barras.data.datasets[0].backgroundColor = getColores();
    charts.barras.update();

    charts.pastel.data.labels = getLabels();
    charts.pastel.data.datasets[0].data = getVotos();
    charts.pastel.data.datasets[0].backgroundColor = getColores();
    charts.pastel.update();

    var historial = votacionData.historial || [];
    charts.linea.data.labels = historial.map(function (_, index) {
      return "T" + (index + 1);
    });
    charts.linea.data.datasets[0].data = historial;
    charts.linea.update();

    updateHeader();
  }

  function simularVoto() {
    if (!votacionData || !votacionData.opciones.length) {
      return;
    }

    var indice = Math.floor(Math.random() * votacionData.opciones.length);
    var incremento = Math.floor(Math.random() * 5) + 1;

    votacionData.opciones[indice].votos += incremento;

    if (!votacionData.historial) {
      votacionData.historial = [];
    }

    votacionData.historial.push(getTotalVotos());

    if (votacionData.historial.length > 20) {
      votacionData.historial.shift();
    }

    refreshCharts();
  }

  function bindSimularButton() {
    var btn = document.getElementById("btn-simular-voto");
    if (btn) {
      btn.addEventListener("click", simularVoto);
    }
  }

  window.initVotacionCharts = function () {
    var section = document.getElementById("graficas");
    if (!section) {
      return;
    }

    var config = window.DEMOCRATIC_CONFIG || {};
    var dataUrl = config.dataUrl || "data/demo-votacion.json";

    fetch(dataUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se pudo cargar demo-votacion.json");
        }
        return response.json();
      })
      .then(function (data) {
        votacionData = data;
        updateHeader();
        createCharts();
        bindSimularButton();
      })
      .catch(function (error) {
        console.error("Error al cargar datos de votacion:", error);
      });
  };
})();
