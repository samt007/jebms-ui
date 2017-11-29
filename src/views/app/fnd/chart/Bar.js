import {Bar, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}

/*
export default {
  extends: Bar,
  data () {
    return {
      datacollection: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
          },
          {
            label: 'Data Two',
            backgroundColor: '#00D8FF',
            data: [30, 20, 42, 59, 10, 20, 59, 30, 60, 40, 22, 31]
          },
          {
            label: 'Data Three',
            backgroundColor: '#00D8FF',
            data: [30, 20, 42, 59, 10, 20, 59, 30, 60, 40, 22, 31]
          }
        ]
      }
    }
  },
  mounted () {
    this.renderChart(this.datacollection, {responsive: true, maintainAspectRatio: false})
  }
}*/