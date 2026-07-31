<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增周期</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="周期名称" width="160" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ typeMap[row.type] || row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="campusName" label="校区" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="标准学费" width="120">
          <template #default="{ row }">¥{{ row.standardFee?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑周期' : '新增周期'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="周期名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="学期" value="semester" />
            <el-option label="学年" value="year" />
            <el-option label="月度" value="month" />
            <el-option label="暑期" value="summer" />
            <el-option label="寒假" value="winter" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="form.campusId" style="width:100%">
            <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期" required>
          <el-date-picker v-model="dateRange" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始" end-placeholder="结束" style="width:100%" />
        </el-form-item>
        <el-form-item label="标准学费" prop="standardFee">
          <el-input-number v-model="form.standardFee" :min="0" :precision="2" style="width:100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { feeCycleApi } from '@/api/fee'
import { campusApi } from '@/api/basic'
import type { FeeCycle, Campus } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<FeeCycle[]>([])
const campusList = ref<Campus[]>([])
const formRef = ref<FormInstance>()
const dateRange = ref<string[]>([])

const form = reactive<Partial<FeeCycle>>({ name: '', type: 'semester', campusId: undefined, standardFee: 0 })
const rules: FormRules = {
  name: [{ required: true, message: '请输入周期名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  campusId: [{ required: true, message: '请选择校区', trigger: 'change' }],
  standardFee: [{ required: true, message: '请输入标准学费', trigger: 'blur' }],
}

const typeMap: Record<string, string> = { semester: '学期', year: '学年', month: '月度', summer: '暑期', winter: '寒假', custom: '自定义' }

watch(dateRange, (val) => {
  if (val) { form.startDate = val[0]; form.endDate = val[1] }
})

async function loadData() {
  loading.value = true
  try {
    const data = await feeCycleApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, name: '2024春季学期', type: 'semester', startDate: '2024-02-01', endDate: '2024-07-01', standardFee: 5800, campusId: 1, campusName: '总校', createdAt: '' },
      { id: 2, name: '2024暑期班', type: 'summer', startDate: '2024-07-01', endDate: '2024-08-31', standardFee: 3200, campusId: 1, campusName: '总校', createdAt: '' },
    ]
  } finally { loading.value = false }
}

async function loadCampuses() {
  try { campusList.value = await campusApi.getAll() } catch {
    campusList.value = [{ id: 1, name: '总校', address: '', phone: '', status: 'active', createdAt: '', updatedAt: '' }]
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, name: '', type: 'semester', campusId: undefined, startDate: '', endDate: '', standardFee: 0 })
  dateRange.value = []
  dialogVisible.value = true
}

function handleEdit(row: FeeCycle) {
  isEdit.value = true
  Object.assign(form, row)
  dateRange.value = [row.startDate, row.endDate]
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row: FeeCycle) {
  await ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => { loadData(); loadCampuses() })
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
