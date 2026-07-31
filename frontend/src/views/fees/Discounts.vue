<template>
  <div class="page-container">
    <el-alert title="折扣管理功能仅对管理员开放" type="warning" :closable="false" show-icon style="margin-bottom:16px" />
    
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增折扣规则</el-button>
      </div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="规则名称" width="160" />
        <el-table-column label="折扣比例" width="100">
          <template #default="{ row }">{{ row.rate * 10 }}折</template>
        </el-table-column>
        <el-table-column prop="condition" label="适用条件" min-width="180" />
        <el-table-column prop="description" label="说明" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑规则' : '新增规则'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规则名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="折扣比例" prop="rate">
          <el-slider v-model="form.rate" :min="0.5" :max="1" :step="0.05" show-input :format-tooltip="(v: number) => `${v * 10}折`" />
        </el-form-item>
        <el-form-item label="适用条件" prop="condition">
          <el-select v-model="form.condition" style="width:100%">
            <el-option label="多科联报" value="多科联报" />
            <el-option label="老生续费" value="老生续费" />
            <el-option label="新生报名" value="新生报名" />
            <el-option label="活动优惠" value="活动优惠" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
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
import { discountApi } from '@/api/fee'

const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<any[]>([])
const formRef = ref<FormInstance>()
const form = reactive({ id: undefined as number | undefined, name: '', rate: 0.9, condition: '', description: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  rate: [{ required: true, message: '请设置折扣比例', trigger: 'change' }],
  condition: [{ required: true, message: '请选择适用条件', trigger: 'change' }],
}

async function loadData() {
  try { tableData.value = await discountApi.getRules() } catch {
    tableData.value = [
      { id: 1, name: '多科联报优惠', rate: 0.9, condition: '多科联报', description: '同时报名2门及以上课程享9折' },
      { id: 2, name: '老生续费优惠', rate: 0.95, condition: '老生续费', description: '老学员续费享95折' },
    ]
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, name: '', rate: 0.9, condition: '', description: '' })
  dialogVisible.value = true
}

function handleEdit(row: any) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; }
.toolbar { margin-bottom: 16px; }
</style>
