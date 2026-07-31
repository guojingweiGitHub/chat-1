<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-cards">
      <el-col :xs="12" :sm="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-title">{{ card.title }}</p>
              <p class="stat-value">{{ card.value }}</p>
              <p class="stat-change" :class="card.trend > 0 ? 'up' : 'down'">
                <el-icon><Top v-if="card.trend > 0" /><Bottom v-else /></el-icon>
                {{ Math.abs(card.trend) }}% 较上月
              </p>
            </div>
            <div class="stat-icon" :style="{ background: card.color }">
              <el-icon :size="28"><component :is="card.icon" /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>招生趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button value="month">月度</el-radio-button>
                <el-radio-button value="quarter">季度</el-radio-button>
                <el-radio-button value="year">年度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header>
            <span>学生状态分布</span>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <span>收费统计</span>
          </template>
          <div ref="revenueChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>到期提醒</span>
              <el-button type="primary" link @click="$router.push('/fees/reminders')">
                查看全部
              </el-button>
            </div>
          </template>
          <el-table :data="reminderList" size="small" max-height="280">
            <el-table-column prop="studentName" label="学员" width="100" />
            <el-table-column prop="campusName" label="校区" width="100" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">
                ¥{{ row.amount?.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="daysRemaining" label="剩余天数" width="90">
              <template #default="{ row }">
                <el-tag :type="row.daysRemaining <= 7 ? 'danger' : 'warning'" size="small">
                  {{ row.daysRemaining }}天
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="到期日期" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { reminderApi } from '@/api/fee'
import type { Reminder } from '@/types'

const trendPeriod = ref('month')
const reminderList = ref<Reminder[]>([])

const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const revenueChartRef = ref<HTMLElement>()

let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let revenueChart: echarts.ECharts | null = null

// 统计卡片数据（模拟）
const statCards = ref([
  { title: '在读学员', value: '1,286', trend: 12.5, icon: 'User', color: '#409eff' },
  { title: '本月收入', value: '¥86.5万', trend: 8.2, icon: 'Money', color: '#67c23a' },
  { title: '待收金额', value: '¥23.8万', trend: -5.1, icon: 'Wallet', color: '#e6a23c' },
  { title: '即将到期', value: '45人', trend: 15.3, icon: 'AlarmClock', color: '#f56c6c' },
])

function initCharts() {
  // 招生趋势图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    updateTrendChart()
  }

  // 学生状态饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c}人' },
        data: [
          { value: 1024, name: '在读', itemStyle: { color: '#409eff' } },
          { value: 156, name: '休学', itemStyle: { color: '#e6a23c' } },
          { value: 89, name: '结业', itemStyle: { color: '#67c23a' } },
          { value: 17, name: '退学', itemStyle: { color: '#f56c6c' } },
        ],
      }],
    })
  }

  // 收费统计图
  if (revenueChartRef.value) {
    revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['应收', '实收', '欠费'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '应收',
          type: 'bar',
          data: [120, 132, 101, 134, 90, 230],
          itemStyle: { color: '#409eff' },
        },
        {
          name: '实收',
          type: 'bar',
          data: [110, 122, 95, 128, 85, 210],
          itemStyle: { color: '#67c23a' },
        },
        {
          name: '欠费',
          type: 'bar',
          data: [10, 10, 6, 6, 5, 20],
          itemStyle: { color: '#f56c6c' },
        },
      ],
    })
  }
}

function updateTrendChart() {
  if (!trendChart) return
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增学员', '流失学员'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: months },
    yAxis: { type: 'value' },
    series: [
      {
        name: '新增学员',
        type: 'line',
        smooth: true,
        data: [82, 93, 90, 93, 129, 133, 132, 145, 128, 135, 142, 156],
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' },
        itemStyle: { color: '#409eff' },
      },
      {
        name: '流失学员',
        type: 'line',
        smooth: true,
        data: [12, 15, 10, 18, 14, 12, 16, 11, 13, 10, 12, 8],
        areaStyle: { color: 'rgba(245, 108, 108, 0.1)' },
        itemStyle: { color: '#f56c6c' },
      },
    ],
  })
}

function handleResize() {
  trendChart?.resize()
  pieChart?.resize()
  revenueChart?.resize()
}

async function loadReminders() {
  try {
    const data = await reminderApi.getExpiringList(30)
    reminderList.value = data.slice(0, 5)
  } catch {
    // 使用模拟数据
    reminderList.value = [
      { id: 1, paymentId: 1, studentName: '张三', campusName: '总校', dueDate: '2024-02-15', amount: 5800, daysRemaining: 5, status: 'pending', createdAt: '' },
      { id: 2, paymentId: 2, studentName: '李四', campusName: '分校A', dueDate: '2024-02-18', amount: 3200, daysRemaining: 8, status: 'pending', createdAt: '' },
      { id: 3, paymentId: 3, studentName: '王五', campusName: '总校', dueDate: '2024-02-20', amount: 4500, daysRemaining: 10, status: 'contacted', createdAt: '' },
      { id: 4, paymentId: 4, studentName: '赵六', campusName: '分校B', dueDate: '2024-02-25', amount: 6800, daysRemaining: 15, status: 'pending', createdAt: '' },
      { id: 5, paymentId: 5, studentName: '钱七', campusName: '总校', dueDate: '2024-02-28', amount: 2900, daysRemaining: 18, status: 'pending', createdAt: '' },
    ]
  }
}

watch(trendPeriod, () => {
  updateTrendChart()
})

onMounted(() => {
  initCharts()
  loadReminders()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  pieChart?.dispose()
  revenueChart?.dispose()
})
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.stat-cards {
  margin-bottom: 16px;
}

.stat-card {
  margin-bottom: 16px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.stat-change {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.up {
  color: #67c23a;
}

.stat-change.down {
  color: #f56c6c;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-row .el-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

/* 响应式 */
@media (max-width: 768px) {
  .stat-value {
    font-size: 18px;
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
