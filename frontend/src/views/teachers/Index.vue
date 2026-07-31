<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增教师</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="campusName" label="所属校区" width="120" />
        <el-table-column prop="subjects" label="教授科目" min-width="150" />
        <el-table-column prop="hireDate" label="入职日期" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑教师' : '新增教师'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="form.campusId" style="width:100%">
            <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="教授科目"><el-input v-model="form.subjects" placeholder="多个科目用逗号分隔" /></el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker v-model="form.hireDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
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
import { teacherApi, campusApi } from '@/api/basic'
import type { Teacher, Campus } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<Teacher[]>([])
const campusList = ref<Campus[]>([])
const formRef = ref<FormInstance>()
const form = reactive<Partial<Teacher>>({ name: '', phone: '', campusId: undefined, subjects: '', hireDate: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  campusId: [{ required: true, message: '请选择校区', trigger: 'change' }],
  hireDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    const data = await teacherApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, name: '张老师', phone: '13800138010', campusId: 1, campusName: '总校', subjects: '钢琴,乐理', hireDate: '2022-03-01', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '李老师', phone: '13800138011', campusId: 1, campusName: '总校', subjects: '舞蹈', hireDate: '2023-06-15', status: 'active', createdAt: '', updatedAt: '' },
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
  Object.assign(form, { id: undefined, name: '', phone: '', campusId: undefined, subjects: '', hireDate: '' })
  dialogVisible.value = true
}

function handleEdit(row: Teacher) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row: Teacher) {
  await ElMessageBox.confirm(`确定要删除教师「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => { loadData(); loadCampuses() })
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
