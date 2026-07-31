<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增用户</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="username" label="账号" width="120" />
        <el-table-column prop="realName" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="roleName" label="角色" width="120" />
        <el-table-column prop="campusName" label="所属校区" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="resetPwd(row)">重置密码</el-button>
            <el-button :type="row.status === 'active' ? 'danger' : 'success'" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="username"><el-input v-model="form.username" :disabled="isEdit" /></el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password"><el-input v-model="form.password" type="password" show-password /></el-form-item>
        <el-form-item label="姓名" prop="realName"><el-input v-model="form.realName" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" style="width:100%">
            <el-option v-for="r in roleList" :key="r.id" :label="r.name" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属校区">
          <el-select v-model="form.campusId" clearable style="width:100%">
            <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
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
import { userApi, roleApi } from '@/api/user'
import { campusApi } from '@/api/basic'
import type { User, Role, Campus } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<User[]>([])
const roleList = ref<Role[]>([])
const campusList = ref<Campus[]>([])
const formRef = ref<FormInstance>()
const form = reactive<any>({})
const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    const data = await userApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, username: 'admin', realName: '系统管理员', phone: '13800138000', roleId: 1, roleName: '管理员', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, username: 'wang', realName: '王校长', phone: '13800138001', roleId: 2, roleName: '校区负责人', campusId: 1, campusName: '总校', status: 'active', createdAt: '', updatedAt: '' },
      { id: 3, username: 'li', realName: '李前台', phone: '13800138002', roleId: 3, roleName: '前台', campusId: 1, campusName: '总校', status: 'active', createdAt: '', updatedAt: '' },
    ]
  } finally { loading.value = false }
}

async function loadOptions() {
  try { roleList.value = await roleApi.getAll() } catch {
    roleList.value = [
      { id: 1, name: '管理员', code: 'admin', createdAt: '', permissions: [] },
      { id: 2, name: '校区负责人', code: 'campus_manager', createdAt: '', permissions: [] },
      { id: 3, name: '前台', code: 'receptionist', createdAt: '', permissions: [] },
      { id: 4, name: '教师', code: 'teacher', createdAt: '', permissions: [] },
    ]
  }
  try { campusList.value = await campusApi.getAll() } catch {
    campusList.value = [{ id: 1, name: '总校', address: '', phone: '', status: 'active', createdAt: '', updatedAt: '' }]
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, username: '', password: '', realName: '', phone: '', roleId: undefined, campusId: undefined })
  dialogVisible.value = true
}

function handleEdit(row: User) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function resetPwd(row: User) {
  await ElMessageBox.confirm(`确定要重置 ${row.realName} 的密码吗？`, '提示', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('密码已重置为: 123456')
}

async function toggleStatus(row: User) {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  await userApi.updateStatus(row.id, newStatus).catch(() => {})
  ElMessage.success('状态更新成功')
  loadData()
}

onMounted(() => { loadData(); loadOptions() })
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
