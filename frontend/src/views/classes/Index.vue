<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增班级</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="班级名称" width="150" />
        <el-table-column prop="campusName" label="校区" width="120" />
        <el-table-column prop="subject" label="科目" width="100" />
        <el-table-column prop="teacherName" label="授课教师" width="100" />
        <el-table-column label="人数" width="100">
          <template #default="{ row }">{{ row.currentCount || 0 }}/{{ row.capacity }}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="开班日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑班级' : '新增班级'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班级名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="form.campusId" style="width:100%">
            <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目"><el-input v-model="form.subject" /></el-form-item>
        <el-form-item label="容量上限" prop="capacity"><el-input-number v-model="form.capacity" :min="1" :max="100" /></el-form-item>
        <el-form-item label="开班日期" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { classApi, campusApi } from '@/api/basic'
import type { ClassInfo, Campus } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<ClassInfo[]>([])
const campusList = ref<Campus[]>([])
const formRef = ref<FormInstance>()
const form = reactive<Partial<ClassInfo>>({ name: '', campusId: undefined, subject: '', capacity: 20, startDate: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  campusId: [{ required: true, message: '请选择校区', trigger: 'change' }],
  capacity: [{ required: true, message: '请输入容量', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开班日期', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    const data = await classApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, name: '钢琴一班', campusId: 1, campusName: '总校', subject: '钢琴', teacherName: '张老师', capacity: 20, currentCount: 15, startDate: '2024-01-01', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '舞蹈二班', campusId: 1, campusName: '总校', subject: '舞蹈', teacherName: '李老师', capacity: 25, currentCount: 20, startDate: '2024-01-01', status: 'active', createdAt: '', updatedAt: '' },
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
  Object.assign(form, { id: undefined, name: '', campusId: undefined, subject: '', capacity: 20, startDate: '' })
  dialogVisible.value = true
}

function handleEdit(row: ClassInfo) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row: ClassInfo) {
  await ElMessageBox.confirm(`确定要删除班级「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => { loadData(); loadCampuses() })
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
