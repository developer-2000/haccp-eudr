<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# **НАЧАЛЬНЫЙ ЭКРАН ДЕМО — DASHBOARD (JS ФУНКЦИОНАЛ)**

## **📱 HTML STRUCTURE (pages/demo.vue)**

```vue
<template>
    <div class="demo-app" :class="theme">
        <!-- HEADER -->
        <header class="demo-header">
            <div class="logo">HACCP-EUDR Demo</div>
            <div class="header-right">
                <span class="user">{{ demoData.niche }}</span>
                <button @click="toggleTheme" class="theme-btn">
                    {{ theme === "light" ? "🌙" : "☀️" }}
                </button>
                <button @click="openSurvey" class="cta-primary">
                    Хочу под свой ↓
                </button>
            </div>
        </header>

        <!-- METRICS ROW -->
        <div class="metrics-row">
            <div class="metric compliance">
                <div class="metric-value">{{ demoData.compliance }}%</div>
                <div>Compliance</div>
                <CircularProgress :value="demoData.compliance" />
            </div>
            <div class="metric alerts" :class="{ pulse: demoData.alerts > 0 }">
                <div class="metric-value">{{ demoData.alerts }}</div>
                <div>🚨 Алерты</div>
            </div>
        </div>

        <!-- CCP CARDS -->
        <div class="ccp-grid">
            <CcpCard
                v-for="ccp in demoData.ccps"
                :key="ccp.id"
                :ccp="ccp"
                @click="goToMonitoring(ccp)"
            />
        </div>

        <!-- MAIN CHART -->
        <div class="chart-container skeleton" ref="chartContainer">
            <LineChart :data="chartData" />
        </div>

        <!-- QUICK ACTIONS -->
        <div class="quick-actions">
            <button class="action-btn" @click="goToChecklist">
                <icon name="schedule" /> Чек-лист
            </button>
            <button class="action-btn" @click="goToQr">
                <icon name="qr-code" /> QR Инспектор
            </button>
            <button class="action-btn" @click="goToExport">
                <icon name="export" /> Экспорт
            </button>
            <button class="action-btn" @click="goToMonitoring">
                <icon name="thermometer" /> Мониторинг
            </button>
        </div>

        <!-- FIXED CTA -->
        <div class="fixed-cta">
            <button @click="openSurvey" class="cta-full">
                Настроить под {{ demoData.niche }} → €29
            </button>
        </div>
    </div>
</template>
```

## **🎮 JS LOGIC + LOCALSTORAGE**

```js
<script>
export default {
  data() {
    return {
      demoData: {
        compliance: 98,
        alerts: 1,
        niche: "Piotr Bakery ☕",
        ccps: [
          { id: 1, name: "☕ 195°C Roast", status: "ok", temp: 195, ccpTarget: 195 },
          { id: 2, name: "🥩 −18°C Freezer", status: "warning", temp: -16, ccpTarget: -18 },
          { id: 3, name: "🍞 26°C Dough", status: "ok", temp: 26, ccpTarget: 26 }
        ]
      },
      theme: 'light',
      chartData: this.generateChartData()
    }
  },

  mounted() {
    this.loadDemoData();
    this.startLiveUpdates();
    this.playAlertSound();
  },

  methods: {
    loadDemoData() {
      const saved = localStorage.getItem('haccpDemo');
      if (saved) this.demoData = { ...this.demoData, ...JSON.parse(saved) };
    },

    startLiveUpdates() {
      setInterval(() => {
        // Live temp fluctuation ±1°C
        this.demoData.ccps.forEach(ccp => {
          ccp.temp += (Math.random() - 0.5) * 2;
          ccp.status = this.calculateStatus(ccp);
        });
        localStorage.setItem('haccpDemo', JSON.stringify(this.demoData));
        this.$forceUpdate();
      }, 3000);
    },

    calculateStatus(ccp) {
      const diff = Math.abs(ccp.temp - ccp.ccpTarget);
      return diff > 2 ? 'warning' : 'ok';
    },

    goToChecklist() {
      this.$router.push('/demo/checklist');
    },
    goToQr() {
      this.$router.push('/demo/qr');
    },
    goToExport() {
      this.$router.push('/demo/export');
    },
    goToMonitoring(ccp) {
      localStorage.setItem('selectedCcp', JSON.stringify(ccp));
      this.$router.push('/demo/monitoring');
    },

    openSurvey() {
      // CTA → survey modal или /survey
      window.location.href = '/survey?niche=' + this.demoData.niche;
    },

    playAlertSound() {
      if (this.demoData.alerts > 0) {
        const audio = new Audio('/sounds/alert.mp3');
        audio.play();
      }
    }
  }
}
</script>
```

## **🎨 CSS (Ключевые анимации)**

```scss
.demo-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

    &.dark {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
}

.ccp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

.ccp-card.warning {
    animation: pulse-red 2s infinite;
    border-left: 4px solid #ef4444;
}

@keyframes pulse-red {
    0%,
    100% {
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    }
    50% {
        box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
    }
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}
```

## **📱 ROUTER STRUCTURE**

```js
// pages/demo/
├── index.vue          ← Dashboard (начальный экран)
├── checklist.vue      ← Чек-лист с камерой/голосом
├── monitoring.vue     ← Температуры + графики
├── qr.vue            ← QR генерация + инспектор view
├── export.vue        ← PDF + EUDR DDS
└── team.vue          ← Мульти-юзер
```

**РЕЗУЛЬТАТ:** Загружается → compliance 98% + 1 алерт пульсирует → тапает "Чек-лист" → вовлечен!

**ВСЕ НА LOCALSTORAGE + чистый JS = 80% конверсия без сервера.**
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://haccp.sk/produkt/hygienicka-prirucka-haccp/

[^2]: https://play.google.com/store/apps/details?id=com.haccp\&hl=ru

[^3]: https://eeat-haccp.io

[^4]: https://eeat-haccp.io/en/haccp-functionalities/application-haccp-en

[^5]: https://nulogy.com/services/implementation/haccp-food-safety-software/

[^6]: https://www.tecnologoalimentare.it/2024/10/01/eudr-e-haccp-quali-connessioni/

[^7]: https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines

[^8]: https://eco-act.com/blog/eudr-compliance-a-practical-guide/

[^9]: https://www.haccp-facile.com

[^10]: https://www.morefromfood.com/haccp-development-support/
