<!DOCTYPE html>
<html>
<head>
  <title>Water Sensor Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
  <style>
    body { font-family: Arial; margin: 20px; }
    h1 { color: #333; text-align: center; margin-bottom: 20px; }

    .container { display: flex; gap: 20px; }

    /* Big chart container */
    .main-chart {
      flex: 3;
      height: 600px; /* fixed height */
    }

    /* Side charts container */
    .side-charts {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 600px; /* match big chart height */
    }

    .side-charts > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    canvas {
      background: #f9f9f9;
      padding: 10px;
      border-radius: 8px;
      width: 100%;
      flex: 1;
    }

    .chart-title {
      text-align: center;
      font-size: 14px;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <h1>Water Sensor Dashboard</h1>
  <div class="container">
    <!-- Big chart -->
    <div class="main-chart">
      <canvas id="waterChart"></canvas>
    </div>

    <!-- Side small charts -->
    <div class="side-charts">
      <div><div class="chart-title">1 Day Avg</div><canvas id="chart1Day"></canvas></div>
      <div><div class="chart-title">3 Days Avg</div><canvas id="chart3Days"></canvas></div>
      <div><div class="chart-title">1 Week Avg</div><canvas id="chart1Week"></canvas></div>
      <div><div class="chart-title">1 Month Avg</div><canvas id="chart1Month"></canvas></div>
      <div><div class="chart-title">1 Year Avg</div><canvas id="chart1Year"></canvas></div>
    </div>
  </div>

  <script>
    function avg(data) {
      if (!data.length) return 0;
      return (data.reduce((a,b)=>a+b,0)/data.length).toFixed(2);
    }

    // Big chart
    const mainCtx = document.getElementById('waterChart').getContext('2d');
    const waterChart = new Chart(mainCtx, {
      type: 'line',
      data: { 
        labels: [], 
        datasets: [{ label: 'Water Level', data: [], borderColor: 'blue', fill: false, tension: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: 'time',
            title: { display: true, text: 'Time' },
            time: { tooltipFormat: 'HH:mm:ss', unit: 'minute' },
            ticks: { maxRotation: 0 },
          },
          y: { title: { display: true, text: 'Level' } }
        },
        plugins: { legend: { display: true } }
      }
    });

    // Side charts
    function createSmallChart(canvasId) {
      const ctx = document.getElementById(canvasId).getContext('2d');
      return new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Avg Level', data: [], borderColor: 'green', fill: false }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: true } }
        }
      });
    }

    const chart1Day = createSmallChart('chart1Day');
    const chart3Days = createSmallChart('chart3Days');
    const chart1Week = createSmallChart('chart1Week');
    const chart1Month = createSmallChart('chart1Month');
    const chart1Year = createSmallChart('chart1Year');

    async function fetchData() {
      const res = await fetch('/api/water-level');
      const data = await res.json();

      // Only take last 100 readings
      const recentData = data.slice(-100);
      const labels = recentData.map(d => new Date(d.timestamp));
      const values = recentData.map(d => d.level);

      // Update big chart
      waterChart.data.labels = labels;
      waterChart.data.datasets[0].data = values;
      waterChart.update();

      const now = new Date();
      function filterByDays(days) {
        return data.filter(d => (now - new Date(d.timestamp))/(1000*60*60*24) <= days)
                   .map(d => d.level);
      }

      // Update side charts averages
      chart1Day.data.labels = ['1 Day']; chart1Day.data.datasets[0].data = [avg(filterByDays(1))]; chart1Day.update();
      chart3Days.data.labels = ['3 Days']; chart3Days.data.datasets[0].data = [avg(filterByDays(3))]; chart3Days.update();
      chart1Week.data.labels = ['1 Week']; chart1Week.data.datasets[0].data = [avg(filterByDays(7))]; chart1Week.update();
      chart1Month.data.labels = ['1 Month']; chart1Month.data.datasets[0].data = [avg(filterByDays(30))]; chart1Month.update();
      chart1Year.data.labels = ['1 Year']; chart1Year.data.datasets[0].data = [avg(filterByDays(365))]; chart1Year.update();
    }

    setInterval(fetchData, 1000);
    fetchData();
  </script>
</body>
</html>
