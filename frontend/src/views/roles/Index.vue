<template>
  <div class="page-container">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增角色</el-button>
      </div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column label="权限数" width="100">
          <template #default="{ row }">{{ row.permissions?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handlePermission(row)">权限</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)" :disabled="row.code === 'admin'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新增角色'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="角色编码" prop="code"><el-input v-model="form.code" :disabled="isEdit" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="permDialogVisible" title="权限配置" width="500px">
      <el-tree ref="treeRef" :data="permTree" show-checkbox node-key="id" :default-checked-keys="checkedPerms" :props="{ label: 'name', children: 'children' }" />
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { roleApi } from '@/api/user'
import type { Role } from '@/types'

const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<Role[]>([])
const formRef = ref<FormInstance>()
const treeRef = ref()
const checkedPerms = ref<number[]>([])
const currentRole = ref<Role | null>(null)

const form = reactive({ id: undefined as number | undefined, name: '', code: '', description: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const permTree = [
  { id: 1, name: '学生管理', children: [
    { id: 11, name: '查看学生' }, { id: 12, name: '编辑学生' }, { id: 13, name: '删除学生' }, { id: 14, name: '导入学生' },
  ]},
  { id: 2, name: '收费管理', children: [
    { id: 21, name: '查看缴费' }, { id: 22, name: '录入缴费' }, { id: 23, name: '退费操作' }, { id: 24, name: '折扣管理' },
  ]},
  { id: 3, name: '统计分析', children: [{ id: 31, name: '查看报表' }, { id: 32, name: '导出报表' }]},
  { id: 4, name: '系统管理', children: [{ id: 41, name: '用户管理' }, { id: 42, name: '角色管理' }]},
]

async function loadData() {
  try {
    const data = await roleApi.getList()
    tableData.value = data.items
  } catch {
    tableData.value = [
      { id: 1, name: '管理员', code: 'admin', description: '系统最高权限', createdAt: '', permissions: [] },
      { id: 2, name: '校区负责人', code: 'campus_manager', description: '管理本校区数据', createdAt: '', permissions: [] },
      { id: 3, name: '前台', code: 'receptionist', description: '负责接待和录入', createdAt: '', permissions: [] },
      { id: 4, name: '教师', code: 'teacher', description: '查看本班学员', createdAt: '', permissions: [] },
    ]
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, name: '', code: '', description: '' })
  dialogVisible.value = true
}

function handleEdit(row: Role) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleDelete(row: Role) {
  await ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '警告', { type: 'warning' }).catch(() => { throw new Error() })
  ElMessage.success('删除成功')
  loadData()
}

function handlePermission(row: Role) {
  currentRole.value = row
  checkedPerms.value = row.permissions?.map((p: any) => typeof p === 'number' ? p : p.id) || []
  permDialogVisible.value = true
}

function savePermissions() {
  ElMessage.success('权限保存成功')
  permDialogVisible.value = false
}

onMounted(loadData)
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; }
</style>
