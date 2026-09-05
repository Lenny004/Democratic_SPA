(function () {
  "use strict";

  const config = window.DEMOCRATIC_CONFIG || { locale: "es-SV" };
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  function updateDateTime() {
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat(config.locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now);
    date.textContent = new Intl.DateTimeFormat(config.locale, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(now);
  }

  updateDateTime();
  window.setInterval(updateDateTime, 1000);
  window.initVotacionCharts?.();
}());
