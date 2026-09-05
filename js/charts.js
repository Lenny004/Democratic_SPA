(function () {
  "use strict";

  const config = window.DEMOCRATIC_CONFIG;
  let votingData;
  const charts = {};

  const totalVotes = () => votingData.opciones.reduce((total, option) => total + option.votos, 0);
  const optionValues = (property) => votingData.opciones.map((option) => option[property]);

  function getPercentage(votes, total) {
    return total ? Math.round((votes / total) * 1000) / 10 : 0;
  }

  function getLeadingOption() {
    return votingData.opciones.reduce(
      (leading, option) => (option.votos > leading.votos ? option : leading),
      votingData.opciones[0]
    );
  }

  function formatNumber(value) {
    return value.toLocaleString(config.locale);
  }

  function tooltipLabel(context) {
    const total = totalVotes();
    const rawValue = context.parsed.y ?? context.parsed ?? context.raw;
    const percentage = getPercentage(rawValue, total);
    const label = context.dataset.label || context.label || "";
    return `${label}: ${formatNumber(rawValue)} (${percentage}%)`;
  }

  function updateHeader() {
    document.getElementById("votacion-titulo").textContent = votingData.titulo || config.labels.demoTitle;
    document.getElementById("votacion-tagline").textContent = `${config.tagline} · ${config.year}`;
  }

  function updateSummary() {
    const total = totalVotes();
    const leading = getLeadingOption();
    const history = votingData.historial;
    const lastRecord = history[history.length - 1] ?? total;
    const previousRecord = history[history.length - 2] ?? lastRecord;
    const delta = lastRecord - previousRecord;

    document.getElementById("kpi-total").textContent = formatNumber(total);

    const leaderElement = document.getElementById("kpi-lider");
    leaderElement.textContent = leading.nombre;
    leaderElement.title = leading.nombre;

    document.getElementById("kpi-lider-share").textContent = `${getPercentage(leading.votos, total)}%`;

    const trendElement = document.getElementById("kpi-tendencia");
    trendElement.textContent = delta >= 0 ? `+${formatNumber(delta)}` : formatNumber(delta);
    trendElement.classList.toggle("text-info", delta > 0);
    trendElement.classList.toggle("text-white-50", delta === 0);
    trendElement.classList.toggle("text-warning", delta < 0);

    document.getElementById("ranking-badge").textContent = config.labels.optionsCount.replace(
      "{count}",
      String(votingData.opciones.length)
    );

    const sortedOptions = [...votingData.opciones].sort((first, second) => second.votos - first.votos);
    document.getElementById("resultados-resumen").innerHTML = sortedOptions
      .map((option, index) => {
        const percentage = getPercentage(option.votos, total);
        const isLeader = option.id ? option.id === leading.id : option.nombre === leading.nombre;

        return `
          <div class="result-option-row${isLeader ? " result-option-row--leader" : ""}">
            <div class="d-flex justify-content-between align-items-baseline gap-2 mb-1">
              <span class="fw-semibold">
                <span class="result-option-rank badge rounded-pill ${isLeader ? "text-bg-info" : "text-bg-dark"} me-1">${index + 1}</span>
                ${option.nombre}
              </span>
              <span class="text-white-50 small text-nowrap">${formatNumber(option.votos)} · ${percentage}%</span>
            </div>
            <div class="progress result-progress" role="progressbar" aria-label="${option.nombre}" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar" style="width: ${percentage}%; background-color: ${option.color}"></div>
            </div>
          </div>`;
      })
      .join("");
  }

  function chartOptions(withAxes) {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 650,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#cfd3d6",
            padding: 16,
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: "rgba(32, 37, 48, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.12)",
          borderWidth: 1,
          padding: 12,
          callbacks: { label: tooltipLabel }
        }
      }
    };

    if (withAxes) {
      options.scales = {
        x: {
          ticks: { color: "#cfd3d6", maxRotation: 0, autoSkip: true },
          grid: { color: "rgba(207, 211, 214, 0.08)" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#cfd3d6", precision: 0 },
          grid: { color: "rgba(207, 211, 214, 0.12)" }
        }
      };
    }

    return options;
  }

  function createCharts() {
    const labels = optionValues("nombre");
    const votes = optionValues("votos");
    const colors = optionValues("color");
    const periods = votingData.historial.map((_, index) => `${config.labels.period} ${index + 1}`);

    charts.bars = new Chart(document.getElementById("chart-barras"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: config.labels.votes,
          data: votes,
          backgroundColor: colors,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 56
        }]
      },
      options: chartOptions(true)
    });

    charts.doughnut = new Chart(document.getElementById("chart-pastel"), {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: votes,
          backgroundColor: colors,
          borderColor: "#292f3b",
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        ...chartOptions(false),
        cutout: "62%"
      }
    });

    charts.line = new Chart(document.getElementById("chart-linea"), {
      type: "line",
      data: {
        labels: periods,
        datasets: [{
          label: config.labels.accumulated,
          data: votingData.historial,
          borderColor: "#8ab4bb",
          backgroundColor: "rgba(107, 150, 157, 0.22)",
          pointBackgroundColor: "#cfd3d6",
          pointBorderColor: "#6b969d",
          pointHoverRadius: 6,
          pointRadius: 4,
          fill: true,
          tension: 0.35
        }]
      },
      options: chartOptions(true)
    });
  }

  function refreshCharts() {
    const labels = optionValues("nombre");
    const votes = optionValues("votos");
    const colors = optionValues("color");
    const periods = votingData.historial.map((_, index) => `${config.labels.period} ${index + 1}`);

    charts.bars.data.labels = labels;
    charts.bars.data.datasets[0].data = votes;
    charts.bars.data.datasets[0].backgroundColor = colors;

    charts.doughnut.data.labels = labels;
    charts.doughnut.data.datasets[0].data = votes;
    charts.doughnut.data.datasets[0].backgroundColor = colors;

    charts.line.data.labels = periods;
    charts.line.data.datasets[0].data = votingData.historial;

    Object.values(charts).forEach((chart) => chart.update("active"));
    updateHeader();
    updateSummary();
  }

  function simulateVote() {
    const option = votingData.opciones[Math.floor(Math.random() * votingData.opciones.length)];
    option.votos += Math.floor(Math.random() * 5) + 1;
    votingData.historial.push(totalVotes());

    if (votingData.historial.length > 20) {
      votingData.historial.shift();
    }

    refreshCharts();
  }

  function bindChartTabs() {
    document.querySelectorAll("#chart-tabs button[data-bs-toggle='pill']").forEach((tab) => {
      tab.addEventListener("shown.bs.tab", () => {
        Object.values(charts).forEach((chart) => chart.resize());
      });
    });
  }

  async function loadData() {
    if (window.location.protocol === "file:") {
      return config.demoData;
    }

    try {
      const response = await fetch(config.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      data.titulo = config.labels.demoTitle;
      data.opciones.forEach((option, index) => {
        option.nombre = config.labels.options[index] || option.nombre;
        option.id = option.id || `opcion-${index}`;
      });
      return data;
    } catch (error) {
      console.warn("No se pudieron cargar los datos externos; se usará la demostración local.", error);
      return config.demoData;
    }
  }

  window.initVotacionCharts = async function () {
    if (!document.getElementById("graficas") || typeof Chart === "undefined") {
      return;
    }

    votingData = await loadData();
    updateHeader();
    updateSummary();
    createCharts();
    bindChartTabs();
    document.getElementById("btn-simular-voto").addEventListener("click", simulateVote);
  };
}());
