let stockChart = null;
let cryptoChart = null;

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById("stock-section").style.display = tab === "stock" ? "block" : "none";
  document.getElementById("crypto-section").style.display = tab === "crypto" ? "block" : "none";
}

function makeChart(canvasId, labels, data, label, color) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color + "22",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#ccc" } } },
      scales: {
        x: { ticks: { color: "#888", maxTicksLimit: 8 }, grid: { color: "#ffffff11" } },
        y: { ticks: { color: "#888" }, grid: { color: "#ffffff11" } }
      }
    }
  });
}

async function loadStock() {
  const symbol = document.getElementById("stock-input").value.trim();
  const period = document.getElementById("stock-period").value;
  const res = await fetch(`/api/stock?symbol=${symbol}&period=${period}`);
  const data = await res.json();
  if (stockChart) stockChart.destroy();
  stockChart = makeChart("stockChart", data.labels, data.prices, data.symbol + " 종가", "#7c6af7");
}

async function loadCrypto() {
  const coin = document.getElementById("coin-select").value;
  const days = document.getElementById("coin-days").value;
  const res = await fetch(`/api/crypto?coin=${coin}&days=${days}`);
  const data = await res.json();
  if (cryptoChart) cryptoChart.destroy();
  cryptoChart = makeChart("cryptoChart", data.labels, data.prices, data.coin + " (USD)", "#f7a26a");
}

loadStock();
