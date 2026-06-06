// ============================================================================
// Neural City × Road Safety Insights — Application Logic
// ============================================================================

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  let allCities = [];
  let normalCities = [];
  let sortField = 'sri';
  let sortAsc = false;

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  const $ = id => document.getElementById(id);
  const fmt = n => (n == null ? '—' : n.toLocaleString());
  const pct = n => (n == null ? '—' : n.toFixed(1) + '%');
  const scr = n => (n == null ? '—' : n.toFixed(1));

  const TIER_COLORS = {
    SAFE: '#10B981', CAUTION: '#F59E0B',
    DANGER: '#EF4444', ANOMALY: '#8B5CF6'
  };
  const tierColor = t => TIER_COLORS[t] || '#7C8DB5';

  function tierBadge(t) {
    return `<span class="badge badge--${t.toLowerCase()}">${t}</span>`;
  }

  function gapBadge(g) {
    if (g == null) return '<span class="gap-badge gap-badge--neutral">—</span>';
    const cls = g > 0 ? 'positive' : g < 0 ? 'negative' : 'neutral';
    const s = g > 0 ? '+' : '';
    return `<span class="gap-badge gap-badge--${cls}">${s}${g}</span>`;
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  function init() {
    allCities = computeMetrics(JSON.parse(JSON.stringify(MATCHED_CITIES)));
    normalCities = allCities.filter(c => !c.hasDataAnomaly);

    Chart.defaults.color = '#7C8DB5';
    Chart.defaults.borderColor = 'rgba(28,39,64,0.5)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    renderHeroStats();
    renderLeaderboard();
    renderGapCards();
    renderQuadrantChart();
    renderSRICards();
    renderFatalityChart();
    renderComparisonChart();
    renderBubbleChart();
    setupNavigation();
  }

  // =========================================================================
  // HERO STATS
  // =========================================================================
  function renderHeroStats() {
    const stats = computeSummaryStats(allCities);
    $('hero-stats').innerHTML = `
      <div class="stat-card stat-card--blue">
        <div class="stat-card__label">Cities Analyzed</div>
        <div class="stat-card__value">${stats.cityCount}</div>
        <div class="stat-card__context">Neural City × NCRB matched</div>
      </div>
      <div class="stat-card stat-card--red">
        <div class="stat-card__label">Total Road Deaths</div>
        <div class="stat-card__value">${fmt(stats.totalDeaths)}</div>
        <div class="stat-card__context">Across matched cities, 2023</div>
      </div>
      <div class="stat-card stat-card--amber">
        <div class="stat-card__label">Avg Fatality Rate</div>
        <div class="stat-card__value">${stats.avgFatalityRate.toFixed(1)}%</div>
        <div class="stat-card__context">Excl. Mumbai anomaly</div>
      </div>
      <div class="stat-card stat-card--green">
        <div class="stat-card__label">Gap Cities Found</div>
        <div class="stat-card__value">${stats.gapCityCount}</div>
        <div class="stat-card__context">High quality, poor safety</div>
      </div>`;
  }

  // =========================================================================
  // LEADERBOARD (Feature 1)
  // =========================================================================
  function renderLeaderboard() {
    const sorted = sortCities(allCities, sortField, sortAsc);
    const tbody = $('leaderboard-tbody');

    tbody.innerHTML = sorted.map(c => {
      const anom = c.hasDataAnomaly;
      const cls = anom ? 'row-anomaly'
        : c.gapScore > 0 ? 'gap-danger'
        : c.gapScore < 0 ? 'gap-safe' : '';

      return `<tr class="${cls}">
        <td>${anom ? '—' : c.sriRank}</td>
        <td><span class="city-name${anom ? ' city-name--anomaly' : ''}">${anom ? '<span class="anomaly-icon">⚠</span>' : ''}${c.displayName}</span></td>
        <td>${scr(c.ncScore)}</td>
        <td>${fmt(c.ncrb.cases)}</td>
        <td><strong>${fmt(c.ncrb.died)}</strong></td>
        <td>${pct(c.fatalityRate)}</td>
        <td>${scr(c.sos)}</td>
        <td><strong style="color:var(--accent-purple)">${scr(c.sri)}</strong></td>
        <td>${tierBadge(c.safetyTier)}</td>
        <td>${gapBadge(c.gapScore)}</td>
      </tr>`;
    }).join('');

    // Attach sort handlers (re-attaches each render — fine for 10 rows)
    document.querySelectorAll('.leaderboard-table th[data-sort]').forEach(th => {
      th.onclick = () => handleSort(th);
    });
  }

  function handleSort(th) {
    const field = th.dataset.sort;
    if (sortField === field) { sortAsc = !sortAsc; }
    else { sortField = field; sortAsc = field === 'displayName'; }

    document.querySelectorAll('.leaderboard-table th').forEach(h => {
      h.classList.remove('sorted');
      const a = h.querySelector('.sort-arrow');
      if (a) a.textContent = '↕';
    });
    th.classList.add('sorted');
    const arrow = th.querySelector('.sort-arrow');
    if (arrow) arrow.textContent = sortAsc ? '↑' : '↓';

    renderLeaderboard();
  }

  // =========================================================================
  // GAP ANALYSIS — Cards (Feature 2)
  // =========================================================================
  function renderGapCards() {
    const danger = [...normalCities].filter(c => c.gapScore > 0)
      .sort((a, b) => b.gapScore - a.gapScore).slice(0, 3);
    const safe = [...normalCities].filter(c => c.gapScore < 0)
      .sort((a, b) => a.gapScore - b.gapScore).slice(0, 3);

    $('gap-danger-cards').innerHTML = danger.map(c => gapCardHTML(c, 'danger')).join('');
    $('gap-safe-cards').innerHTML = safe.map(c => gapCardHTML(c, 'safe')).join('');
  }

  function gapCardHTML(city, type) {
    const insight = generateGapInsight(city);
    return `
    <div class="gap-card gap-card--${type}">
      <div class="gap-card__header">
        <span class="gap-card__city">${city.displayName}</span>
        ${gapBadge(city.gapScore)}
      </div>
      <div class="gap-card__ranks">
        <div class="gap-card__rank-item">
          <span class="gap-card__rank-value" style="color:var(--accent-blue)">#${city.ncRankMatched}</span>
          <span class="gap-card__rank-label">Street Quality</span>
        </div>
        <div class="gap-card__rank-item">
          <span class="gap-card__rank-value" style="color:${tierColor(city.safetyTier)}">#${city.safetyRank}</span>
          <span class="gap-card__rank-label">Safety Rank</span>
        </div>
        <div class="gap-card__rank-item">
          <span class="gap-card__rank-value">${pct(city.fatalityRate)}</span>
          <span class="gap-card__rank-label">Fatality Rate</span>
        </div>
      </div>
      <p class="gap-card__insight">${insight}</p>
    </div>`;
  }

  // =========================================================================
  // GAP ANALYSIS — Quadrant Chart (Chart A)
  // =========================================================================
  function renderQuadrantChart() {
    const ctx = $('chart-quadrant').getContext('2d');
    const ncArr = normalCities.map(c => c.ncScore);
    const midNC = (Math.min(...ncArr) + Math.max(...ncArr)) / 2;
    const midSOS = 50;

    const quadrantPlugin = {
      id: 'quadrant',
      afterDraw(chart) {
        const { ctx: c, chartArea: a, scales: s } = chart;
        const px = s.x.getPixelForValue(midNC);
        const py = s.y.getPixelForValue(midSOS);
        c.save();

        // Quadrant background tints
        c.fillStyle = 'rgba(16,185,129,0.025)';
        c.fillRect(px, a.top, a.right - px, py - a.top);
        c.fillStyle = 'rgba(239,68,68,0.035)';
        c.fillRect(px, py, a.right - px, a.bottom - py);

        // Dashed divider lines
        c.strokeStyle = 'rgba(255,255,255,0.1)';
        c.lineWidth = 1;
        c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(px, a.top); c.lineTo(px, a.bottom); c.stroke();
        c.beginPath(); c.moveTo(a.left, py); c.lineTo(a.right, py); c.stroke();

        // Quadrant labels
        c.setLineDash([]);
        c.font = '500 11px Inter,sans-serif';
        c.textAlign = 'center';
        c.fillStyle = 'rgba(16,185,129,0.45)';
        c.fillText('Quality + Safe ✓', (px + a.right) / 2, a.top + 18);
        c.fillStyle = 'rgba(59,130,246,0.35)';
        c.fillText('Lower Quality, Safer', (a.left + px) / 2, a.top + 18);
        c.fillStyle = 'rgba(239,68,68,0.55)';
        c.fillText('Quality Streets, Higher Risk ⚠', (px + a.right) / 2, a.bottom - 8);
        c.fillStyle = 'rgba(124,141,181,0.3)';
        c.fillText('Lower Quality & Risk', (a.left + px) / 2, a.bottom - 8);

        c.restore();
      }
    };

    const labelPlugin = {
      id: 'dotLabels',
      afterDraw(chart) {
        const { ctx: c } = chart;
        const meta = chart.getDatasetMeta(0);
        c.save();
        c.font = '600 11px Inter,sans-serif';
        c.textBaseline = 'middle';
        meta.data.forEach((pt, i) => {
          const d = chart.data.datasets[0].data[i];
          c.fillStyle = 'rgba(241,245,249,0.85)';
          // Offset labels for closely positioned cities
          const offsetX = 13;
          const offsetY = d.city === 'Ahmedabad' ? -12 : d.city === 'NCT of Delhi' ? 12 : -2;
          c.textAlign = 'left';
          c.fillText(d.city, pt.x + offsetX, pt.y + offsetY);
        });
        c.restore();
      }
    };

    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          data: normalCities.map(c => ({ x: c.ncScore, y: c.sos, city: c.displayName })),
          pointBackgroundColor: normalCities.map(c => tierColor(c.safetyTier) + 'BB'),
          pointBorderColor: normalCities.map(c => tierColor(c.safetyTier)),
          pointBorderWidth: 2,
          pointRadius: 9,
          pointHoverRadius: 13,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true, aspectRatio: 2,
        scales: {
          x: {
            title: { display: true, text: 'Neural City Score  →', font: { size: 12, weight: '600' } },
            min: 44.5, max: 50.5,
            grid: { color: 'rgba(28,39,64,0.5)' }
          },
          y: {
            title: { display: true, text: 'Safety Outcome Score (higher = safer)  →', font: { size: 12, weight: '600' } },
            min: -8, max: 112,
            grid: { color: 'rgba(28,39,64,0.5)' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,19,33,0.95)',
            borderColor: '#1C2740', borderWidth: 1,
            titleFont: { size: 13, weight: '700' },
            bodyFont: { size: 12 }, padding: 12,
            callbacks: {
              title: ctx => ctx[0].raw.city,
              label: ctx => [
                `NC Score: ${ctx.raw.x}`,
                `Safety Score: ${ctx.raw.y.toFixed(1)}`,
              ]
            }
          }
        }
      },
      plugins: [quadrantPlugin, labelPlugin]
    });
  }

  // =========================================================================
  // STREET REALITY INDEX — Cards (Feature 3)
  // =========================================================================
  function renderSRICards() {
    const ranked = [...normalCities].sort((a, b) => b.sri - a.sri);
    const mumbai = allCities.find(c => c.hasDataAnomaly);

    $('sri-cards').innerHTML = ranked.map(c => {
      const sosColor = c.sos >= 60 ? 'green' : c.sos >= 35 ? 'amber' : 'red';
      return `
      <div class="sri-card">
        <div class="sri-card__header">
          <div>
            <span class="sri-card__rank">#${c.sriRank}</span>
            <span class="sri-card__city">${c.displayName}</span>
          </div>
          <span class="sri-card__score">${c.sri.toFixed(1)}</span>
        </div>
        <div class="sri-card__bars">
          <div class="bar-row">
            <span class="bar-row__label">NC Score</span>
            <div class="bar-row__track"><div class="bar-row__fill bar-row__fill--blue" style="width:${c.ncScore}%"></div></div>
            <span class="bar-row__value">${c.ncScore.toFixed(1)}</span>
          </div>
          <div class="bar-row">
            <span class="bar-row__label">Safety (SOS)</span>
            <div class="bar-row__track"><div class="bar-row__fill bar-row__fill--${sosColor}" style="width:${c.sos.toFixed(1)}%"></div></div>
            <span class="bar-row__value">${c.sos.toFixed(1)}</span>
          </div>
        </div>
        <div class="sri-card__footer">
          <span class="sri-card__fr">Fatality Rate: <strong>${pct(c.fatalityRate)}</strong></span>
          <span>${tierBadge(c.safetyTier)} ${gapBadge(c.gapScore)}</span>
        </div>
      </div>`;
    }).join('') + `
    <div class="sri-card" style="border-left:3px solid var(--accent-purple);background:var(--glow-purple)">
      <div class="sri-card__header">
        <div>
          <span class="sri-card__rank" style="color:var(--accent-purple)">⚠</span>
          <span class="sri-card__city">Mumbai</span>
        </div>
        <span class="sri-card__score" style="color:var(--text-muted)">N/A</span>
      </div>
      <p style="font-size:13px;color:var(--text-secondary);margin-top:12px;line-height:1.6">
        ${mumbai.anomalyNote}<br><br>
        NC Score: <strong style="color:var(--text-primary)">${mumbai.ncScore}</strong> &nbsp;|&nbsp;
        Deaths: <strong style="color:var(--text-primary)">${fmt(mumbai.ncrb.died)}</strong> &nbsp;|&nbsp;
        Fatality Rate: <strong style="color:var(--accent-red)">100.0%</strong>
      </p>
      <div style="margin-top:12px">${tierBadge('ANOMALY')}</div>
    </div>`;
  }

  // =========================================================================
  // VISUAL ANALYTICS — Chart B: Fatality Rate Bar
  // =========================================================================
  function renderFatalityChart() {
    const sorted = [...normalCities].sort((a, b) => b.fatalityRate - a.fatalityRate);
    const ctx = $('chart-fatality').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(c => c.displayName),
        datasets: [{
          data: sorted.map(c => c.fatalityRate),
          backgroundColor: sorted.map(c => tierColor(c.safetyTier) + 'AA'),
          borderColor: sorted.map(c => tierColor(c.safetyTier)),
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 28,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: true, aspectRatio: 1.4,
        scales: {
          x: {
            title: { display: true, text: 'Fatality Rate (%)', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(28,39,64,0.5)' },
            beginAtZero: true,
          },
          y: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,19,33,0.95)',
            borderColor: '#1C2740', borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.parsed.x.toFixed(1)}% — ${ctx.parsed.x > 35 ? 'DANGER' : ctx.parsed.x > 20 ? 'CAUTION' : 'SAFE'}`
            }
          }
        }
      }
    });
  }

  // =========================================================================
  // VISUAL ANALYTICS — Chart C: NC Score vs SRI Grouped Bar
  // =========================================================================
  function renderComparisonChart() {
    const ordered = [...normalCities].sort((a, b) => b.ncScore - a.ncScore);
    const ctx = $('chart-nc-sri').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ordered.map(c => c.displayName),
        datasets: [
          {
            label: 'Neural City Score',
            data: ordered.map(c => c.ncScore),
            backgroundColor: 'rgba(59,130,246,0.6)',
            borderColor: 'rgba(59,130,246,0.9)',
            borderWidth: 1, borderRadius: 4,
          },
          {
            label: 'Street Reality Index',
            data: ordered.map(c => c.sri),
            backgroundColor: 'rgba(139,92,246,0.6)',
            borderColor: 'rgba(139,92,246,0.9)',
            borderWidth: 1, borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true, aspectRatio: 1.4,
        scales: {
          y: {
            beginAtZero: true, max: 100,
            grid: { color: 'rgba(28,39,64,0.5)' },
            title: { display: true, text: 'Score', font: { size: 12, weight: '600' } },
          },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: {
            labels: { font: { size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'rectRounded' }
          },
          tooltip: {
            backgroundColor: 'rgba(13,19,33,0.95)',
            borderColor: '#1C2740', borderWidth: 1,
          }
        }
      }
    });
  }

  // =========================================================================
  // VISUAL ANALYTICS — Chart D: Bubble (All NCRB)
  // =========================================================================
  function renderBubbleChart() {
    const ctx = $('chart-bubble').getContext('2d');
    const scale = 0.5;

    const matched = FULL_NCRB.filter(c => c.isMatched && !c.isAnomaly).map(c => ({
      x: c.cases, y: c.died, r: Math.max(4, Math.sqrt(c.died) * scale), name: c.name
    }));
    const normal = FULL_NCRB.filter(c => !c.isMatched && !c.isAnomaly).map(c => ({
      x: c.cases, y: c.died, r: Math.max(3, Math.sqrt(c.died) * scale * 0.7), name: c.name
    }));
    const anomalies = FULL_NCRB.filter(c => c.isAnomaly).map(c => ({
      x: c.cases, y: c.died, r: Math.max(4, Math.sqrt(c.died) * scale), name: c.name,
      note: c.anomalyNote
    }));

    const labelPlugin = {
      id: 'bubbleLabels',
      afterDraw(chart) {
        const { ctx: c } = chart;
        c.save();
        c.font = '600 10px Inter,sans-serif';
        c.textAlign = 'left';
        c.textBaseline = 'middle';
        // Only label matched cities (dataset 0)
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((pt, i) => {
          const d = chart.data.datasets[0].data[i];
          c.fillStyle = 'rgba(241,245,249,0.7)';
          c.fillText(d.name, pt.x + d.r + 4, pt.y);
        });
        // Label key anomalies (dataset 2) - just Agra and Mumbai
        const meta2 = chart.getDatasetMeta(2);
        meta2.data.forEach((pt, i) => {
          const d = chart.data.datasets[2].data[i];
          if (d.name === 'Agra' || d.name === 'Mumbai' || d.name === 'Varanasi') {
            c.fillStyle = 'rgba(239,68,68,0.8)';
            c.fillText(d.name + ' ⚠', pt.x + d.r + 4, pt.y);
          }
        });
        c.restore();
      }
    };

    new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Neural City Matched',
            data: matched,
            backgroundColor: 'rgba(59,130,246,0.4)',
            borderColor: 'rgba(59,130,246,0.8)',
            borderWidth: 2,
          },
          {
            label: 'Other NCRB Cities',
            data: normal,
            backgroundColor: 'rgba(124,141,181,0.15)',
            borderColor: 'rgba(124,141,181,0.35)',
            borderWidth: 1,
          },
          {
            label: 'Data Anomalies',
            data: anomalies,
            backgroundColor: 'rgba(239,68,68,0.2)',
            borderColor: 'rgba(239,68,68,0.6)',
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true, aspectRatio: 1.8,
        scales: {
          x: {
            title: { display: true, text: 'Cases Reported  →', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(28,39,64,0.5)' },
          },
          y: {
            title: { display: true, text: 'Persons Died  →', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(28,39,64,0.5)' },
          }
        },
        plugins: {
          legend: {
            labels: { font: { size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' }
          },
          tooltip: {
            backgroundColor: 'rgba(13,19,33,0.95)',
            borderColor: '#1C2740', borderWidth: 1,
            titleFont: { size: 13, weight: '700' },
            callbacks: {
              title: ctx => ctx[0].raw.name,
              label: ctx => {
                const d = ctx.raw;
                const lines = [
                  `Cases: ${d.x.toLocaleString()}`,
                  `Deaths: ${d.y.toLocaleString()}`,
                  `Fatality Rate: ${((d.y / d.x) * 100).toFixed(1)}%`
                ];
                if (d.note) lines.push(`⚠ ${d.note}`);
                return lines;
              }
            }
          }
        }
      },
      plugins: [labelPlugin]
    });
  }

  // =========================================================================
  // NAVIGATION
  // =========================================================================
  function setupNavigation() {
    const sections = ['hero', 'leaderboard', 'gap-analysis', 'sri', 'analytics', 'methodology'];
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // =========================================================================
  // BOOT
  // =========================================================================
  document.addEventListener('DOMContentLoaded', init);

})();
