<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header><span>学生数量趋势</span></template>
          <div ref="studentTrendRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header><span>收费趋势</span></template>
          <div ref="revenueTrendRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header><span>学生状态分布</span></template>
          <div ref="statusPieRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header><span>校区学生分布</span></template>
          <div ref="campusPieRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header><span>续报率统计</span></template>
          <div ref="renewalRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const studentTrendRef = ref<HTMLElement>()
const revenueTrendRef = ref<HTMLElement>()
const statusPieRef = ref<HTMLElement>()
const campusPieRef = ref<HTMLElement>()
const renewalRef = ref<HTMLElement>()
const charts: echarts.ECharts[] = []

function initChart(el: HTMLElement | undefined, option: any) {
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption(option)
  charts.push(chart)
}

function initCharts() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  
  initChart(studentTrendRef.value, {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ data: [820, 932, 901, 934, 1290, 1330], type: 'line', smooth: true, areaStyle: {} }],
  })

  initChart(revenueTrendRef.value, {
    tooltip: { trigger: 'axis' },
    legend: { data: ['收入', '支出'] },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '收入', type: 'bar', data: [120, 132, 101, 134, 90, 230], itemStyle: { color: '#67c23a' } },
      { name: '支出', type: 'bar', data: [80, 92, 71, 94, 60, 130], itemStyle: { color: '#f56c6c' } },
    ],
  })

  initChart(statusPieRef.value, {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '60%', data: [
      { value: 1024, name: '在读' }, { value: 156, name: '休学' },
      { value: 89, name: '结业' }, { value: 17, name: '退学' },
    ]}],
  })

  initChart(campusPieRef.value, {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['40%', '70%'], data: [
      { value: 680, name: '总校' }, { value: 420, name: '分校A' }, { value: 186, name: '分校B' },
    ]}],
  })

  initChart(renewalRef.value, {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [{ data: [75, 78, 82, 80, 85, 88], type: 'line', smooth: true, itemStyle: { color: '#409eff' } }],
  })
}

function handleResize() { charts.forEach(c => c.resize()) }

onMounted(() => { initCharts(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); charts.forEach(c => c.dispose()) })
</script>

<style scoped>
.chart { height: 280px; }
.el-card { margin-bottom: 16px; }
</style>
