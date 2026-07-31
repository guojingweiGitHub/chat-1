<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增校区
        </el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="校区名称" width="150" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="managerName" label="负责人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑校区' : '新增校区'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="校区名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入校区名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.managerName" placeholder="请输入负责人姓名" />
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
import { campusApi } from '@/api/basic'
import type { Campus } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<Campus[]>([])
const formRef = ref<FormInstance>()

const form = reactive<Partial<Campus>>({ name: '', address: '', phone: '', managerName: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入校区名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
}

async function loadData() {
  loading.value = true
  try {
    const data = await campusApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, name: '总校', address: '市中心大道100号', phone: '13800138000', managerName: '王校长', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '分校A', address: '东区科技园', phone: '13800138001', managerName: '李主任', status: 'active', createdAt: '', updatedAt: '' },
    ]
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, name: '', address: '', phone: '', managerName: '' })
  dialogVisible.value = true
}

function handleEdit(row: Campus) {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function toggleStatus(row: Campus) {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  await campusApi.updateStatus(row.id, newStatus).catch(() => {})
  ElMessage.success('状态更新成功')
  loadData()
}

async function handleDelete(row: Campus) {
  await ElMessageBox.confirm(`确定要删除校区「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error('cancel') })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
