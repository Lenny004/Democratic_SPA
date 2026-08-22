window.DEMOCRATIC_CONFIG = {
  nombre: "Democratic",
  tagline: "Sistema de votacion generico",
  anio: 2026,
  dataUrl: (function () {
    var path = window.location.pathname.toLowerCase();
    return path.indexOf("/html/") !== -1
      ? "../data/demo-votacion.json"
      : "data/demo-votacion.json";
  })()
};
