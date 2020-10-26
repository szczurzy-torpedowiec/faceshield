<template>
  <v-card
    outlined
    class="dashboard-touches-chart"
  >
    <v-card-title>
      Touches chart
      <v-spacer />
      <v-sheet
        outlined
        class="d-flex align-center"
      >
        <v-btn
          icon
          @click="previousDay"
        >
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <div class="text-body-1 mx-1">
          {{ dateString }}
        </div>
        <v-btn
          icon
          :disabled="!nextDayEnabled"
          @click="nextDay"
        >
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </v-sheet>
    </v-card-title>
    <div
      class="px-1 pb-2 chart-container"
    >
      <canvas
        ref="chart"
      />
    </div>
  </v-card>
</template>

<script>
  import { Chart } from 'chart.js';
  import _ from 'lodash';

  export default {
    data: () => ({
      chart: null,
      date: new Date().toISOString().split('T')[0],
      now: new Date(),
    }),
    computed: {
      nextDayEnabled() {
        const newDate = new Date(this.date);
        return (newDate < new Date(new Date().toISOString().split('T')[0]));
      },
      dateString() {
        return new Date(this.date).toLocaleDateString('pl-PL');
      },
      touches() {
        const hours = _.times(24, _.constant(0));
        this.$store.state.touches.forEach((touch) => {
          const date = new Date(touch.timestamp);
          if (date.toISOString().split('T')[0] === this.date) {
            hours[date.getHours()] += 1;
          }
        });
        return hours;
      },
      activeTimes() {
        const activeTimes = [
          ...this.$store.state.activeTimes,
        ];
        if (this.$store.state.lastActiveStart !== null) {
          activeTimes.push({
            startTimestamp: this.$store.state.lastActiveStart,
            endTimestamp: this.now.getTime(),
          });
        }
        const hours = _.times(24, _.constant(0));
        const date = new Date(this.date);
        const nextDate = new Date(this.date).setDate(date.getDate() + 1);
        activeTimes.forEach((activeTime) => {
          if (activeTime.startTimestamp < nextDate && activeTime.endTimestamp > date) {
            for (let i = 0; i < 24; i += 1) {
              const hourStart = new Date(date);
              hourStart.setHours(i);
              const hourEnd = new Date(date);
              hourEnd.setHours(i + 1);
              const start = Math.max(activeTime.startTimestamp, hourStart.getTime());
              const end = Math.min(activeTime.endTimestamp, hourEnd.getTime());
              hours[i] += Math.max(0, (end - start) / 60000);
            }
          }
        });
        return hours;
      },
    },
    watch: {
      touches(value) {
        this.chart.data.datasets[0].data = value;
        this.chart.update();
      },
      activeTimes(value) {
        this.chart.data.datasets[1].data = value;
        this.chart.update();
      },
    },
    mounted() {
      this.chart = new Chart(this.$refs.chart.getContext('2d'), {
        type: 'bar',
        data: {
          labels: _.range(0, 24, 1).map((n) => `${n}:00`),
          datasets: [
            {
              label: 'Touches',
              backgroundColor: '#F44336',
              data: this.touches,
              yAxisID: 'touches',
            },
            {
              label: 'Time active',
              backgroundColor: '#2196F333',
              borderColor: '#2196F388',
              borderWidth: 1,
              data: this.activeTimes,
              yAxisID: 'timeActive',
            },
          ],
        },
        options: {
          legends: {
            labels: {
              defaultFontFamily: '"Roboto", sans-serif',
            },
          },
          scales: {
            yAxes: [
              {
                id: 'touches',
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 20,
                },
              },
              {
                id: 'timeActive',
                position: 'right',
                ticks: {
                  min: 0,
                  max: 60,
                  callback(value) {
                    return `${value} min`;
                  },
                  padding: 10,
                },
                gridLines: {
                  drawTicks: false,
                  drawOnChartArea: false,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label(tooltipItem) {
                if (tooltipItem.datasetIndex === 1) return `${Math.ceil(tooltipItem.yLabel)} minutes`;
                return tooltipItem.yLabel;
              },
            },
          },
        },
      });
    },
    created() {
      setInterval(() => {
        this.now = new Date();
      }, 30000);
    },
    methods: {
      previousDay() {
        const newDate = new Date(this.date);
        newDate.setUTCDate(newDate.getUTCDate() - 1);
        [this.date] = newDate.toISOString().split('T');
      },
      nextDay() {
        if (!this.nextDayEnabled) return;
        const newDate = new Date(this.date);
        newDate.setUTCDate(newDate.getUTCDate() + 1);
        [this.date] = newDate.toISOString().split('T');
      },
    },
  };
</script>

<style lang="scss">
  .dashboard-touches-chart {
    max-width: 100%;
    overflow: hidden;

    .chart-container {
      position: relative;
      max-width: 100%;
    }
  }
</style>
