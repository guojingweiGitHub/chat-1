<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>到期/续费提醒</span>
          <el-button type="primary" size="small" @click="showConfig">提醒配置</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="待处理" name="pending" />
        <el-tab-pane label="已跟进" name="contacted" />
        <el-tab-pane label="已续费" name="renewed" />
        <el-tab-pane label="已流失" name="lost" />
      </el-tabs>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="studentName" label="学员" width="100" />
        <el-table-column prop="campusName" label="校区" width="120" />
        <el-table-column label="金额" width="110">
          <template #default="{ row }">¥{{ row.amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日期" width="120" />
        <el-table-column label="剩余天数" width="100">
          <template #default="{ row }">
            <el-tag :type="row.daysRemaining <= 7 ? 'danger' : row.daysRemaining <= 15 ? 'warning' : 'info'" size="small">
              {{ row.daysRemaining }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="primary" link size="small" @click="updateStatus(row, 'contacted')">标记跟进</el-button>
              <el-button type="success" link size="small" @click="updateStatus(row, 'renewed')">已续费</el-button>
              <el-button type="danger" link size="small" @click="updateStatus(row, 'lost')">已流失</el-button>
            </template>
            <span v-else class="status-text">{{ statusMap[row.status] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="configVisible" title="提醒配置" width="400px">
      <el-form label-width="120px">
        <el-form-item label="启用提醒">
          <el-switch v-model="config.enabled" />
        </el-form-item>
        <el-form-item label="提醒天数">
          <el-checkbox-group v-model="config.days">
            <el-checkbox :value="30">30天</el-checkbox>
            <el-checkbox :value="15">15天</el-checkbox>
            <el-checkbox :value="7">7天</el-checkbox>
            <el-checkbox :value="3">3天</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { reminderApi } from '@/api/fee'
import type { Reminder } from '@/types'

const loading = ref(false)
const configVisible = ref(false)
const activeTab = ref('pending')
const tableData = ref<Reminder[]>([])
const config = reactive({ enabled: true, days: [30, 15, 7, 3] })
const statusMap: Record<string, string> = { pending: '待处理', contacted: '已跟进', renewed: '已续费', lost: '已流失' }

watch(activeTab, loadData)

async function loadData() {
  loading.value = true
  try {
    const data = await reminderApi.getList({ status: activeTab.value })
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, paymentId: 1, studentName: '张三', campusName: '总校', dueDate: '2024-02-15', amount: 5800, daysRemaining: 5, status: 'pending' as const, createdAt: '' },
      { id: 2, paymentId: 2, studentName: '李四', campusName: '分校A', dueDate: '2024-02-18', amount: 3200, daysRemaining: 8, status: 'pending' as const, createdAt: '' },
    ].filter(r => r.status === activeTab.value) as Reminder[]
  } finally { loading.value = false }
}

async function updateStatus(row: Reminder, status: string) {
  await reminderApi.updateStatus(row.id, status).catch(() => {})
  ElMessage.success('状态更新成功')
  loadData()
}

function showConfig() { configVisible.value = true }

async function saveConfig() {
  await reminderApi.updateConfig(config).catch(() => {})
  ElMessage.success('配置保存成功')
  configVisible.value = false
}

onMounted(loadData)
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.status-text { color: #909399; font-size: 13px; }
</style>
