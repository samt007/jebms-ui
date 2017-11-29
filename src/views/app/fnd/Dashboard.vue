<template>
    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="box">
        <div class="box-header with-border">
          <h3 class="title">图表样例</h3>
        </div>
        <section class="section">
          <div class="columns is-multiline">
            <div class="column is-half">
              <div class="box">
                <doughnut :chart-data="DoughnutDatacollection" :options="{responsive: true, maintainAspectRatio: false}"></doughnut>
              </div>
            </div>
            <div class="column is-half">
              <div class="box">
                <radar :chart-data="RadarDatacollection" :options="{responsive: true, maintainAspectRatio: false}"></radar>
              </div>
            </div>
            <div class="column is-12">
              <div class="box">
                <line-chart :chart-data="LineChartDatacollection" :options="{responsive: true, maintainAspectRatio: false}"></line-chart>
              </div>
            </div>
            <div class="column is-12">
              <div class="box">
                <bar  :chart-data="BarDatacollection" :options="{responsive: true, maintainAspectRatio: false}"></bar>
              </div>
            </div>
          </div>
        </section>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->

    </section>
    <!-- /.content -->
</template>

<script>

import Bar from './chart/Bar'
import Doughnut from './chart/Doughnut'
import LineChart from './chart/LineChart'
import Radar from './chart/Radar'
// import {Bar} from 'vue-chartjs'

export default {
        name: 'Dashboard',
        components: {
          Bar,
          Doughnut,
          LineChart,
          Radar
        },
        data () {
            return {
              LineChartDatacollection: null,
              BarDatacollection: null,
              DoughnutDatacollection: null,
              RadarDatacollection: null
            }
        },

        computed:{
        },

        methods:{
          fillData () {
              this.LineChartDatacollection = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [
                  {
                    label: 'Data One',
                    //backgroundColor: '#00D8FF',
                    data: [30, 35, 40, 20, 10, 40, 38, 70]
                  },
                  {
                    label: 'Data Two',
                    //backgroundColor: '#41B883',
                    data: [50, 45, 10, 30, 50, 40, 44, 40]
                  }
                ]
              }
              this.RadarDatacollection = {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [
                  {
                    label: 'Data One',
                    data: [30, 35, 40, 20, 10]
                  },
                  {
                    label: 'Data Two',
                    data: [50, 45, 10, 30, 50]
                  }
                ]
              }
              this.BarDatacollection = {
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
              this.DoughnutDatacollection = {
                  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                  datasets: [
                    {
                      label: 'Data One',
                      backgroundColor: [
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                      ],
                      data: [40, 20, 80, 10]
                    }
                  ]
              }
          },
          getRandomInt () {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
          }
        },
        
        beforeMount(){
          this.fillData()
        },
        mounted() {
        },
        created(){
        },
        beforeCreate(){
        },
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
