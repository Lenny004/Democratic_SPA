(function () {
  "use strict";

  const path = window.location.pathname.toLowerCase();
  const language = path.includes("ingles") ? "en" : path.includes("portugues") ? "pt" : "es";
  const translations = {
    es: {
      locale: "es-SV",
      tagline: "Sistema de votación genérico",
      demoTitle: "Votación interna: propuestas corporativas",
      total: "Total de votos registrados",
      votes: "Votos",
      accumulated: "Acumulado de votos",
      period: "Periodo",
      optionsCount: "{count} opciones",
      options: ["Expansión digital", "Mejora operativa", "Formación del equipo", "Sostenibilidad"]
    },
    en: {
      locale: "en-US",
      tagline: "Generic voting system",
      demoTitle: "Internal vote: corporate proposals",
      total: "Total registered votes",
      votes: "Votes",
      accumulated: "Accumulated votes",
      period: "Period",
      optionsCount: "{count} options",
      options: ["Digital expansion", "Operational improvement", "Team development", "Sustainability"]
    },
    pt: {
      locale: "pt-PT",
      tagline: "Sistema de votação genérico",
      demoTitle: "Votação interna: propostas corporativas",
      total: "Total de votos registrados",
      votes: "Votos",
      accumulated: "Votos acumulados",
      period: "Período",
      optionsCount: "{count} opções",
      options: ["Expansão digital", "Melhoria operacional", "Formação da equipe", "Sustentabilidade"]
    }
  };

  const text = translations[language];
  const votes = [142, 98, 76, 54];
  const colors = ["#6b969d", "#8ab4bb", "#cfd3d6", "#4d83b8"];

  window.DEMOCRATIC_CONFIG = {
    language,
    locale: text.locale,
    tagline: text.tagline,
    year: 2026,
    labels: text,
    dataUrl: path.includes("/html/") ? "../data/demo-votacion.json" : "data/demo-votacion.json",
    demoData: {
      titulo: text.demoTitle,
      opciones: text.options.map((name, index) => ({
        id: `opcion-${index}`,
        nombre: name,
        votos: votes[index],
        color: colors[index]
      })),
      historial: [120, 145, 168, 192, 215, 248, 270, 298, 325, 350, 370]
    }
  };
}());
