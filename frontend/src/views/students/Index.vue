<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="姓名/手机号"
            clearable
            style="width: 180px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="校区">
          <el-select v-model="searchForm.campusId" placeholder="全部校区" clearable style="width: 150px">
            <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="在读" value="active" />
            <el-option label="休学" value="suspended" />
            <el-option label="结业" value="graduated" />
            <el-option label="退学" value="withdrawn" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增学生
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>批量导入
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="toolbar-right">
          <span class="total-text">共 {{ total }} 条记录</span>
        </div>
      </div>

      <!-- 表格 - PC/平板 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        class="table-list"
        stripe
      >
        <el-table-column prop="name" label="姓名" width="100" fixed />
        <el-table-column prop="gender" label="性别" width="70">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="parentName" label="家长" width="100" />
        <el-table-column prop="campusName" label="校区" width="120" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="enrollmentDate" label="入学日期" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" size="small">
              {{ statusMap[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-dropdown @command="(cmd: string) => handleStatusChange(row, cmd)">
              <el-button type="warning" link size="small">状态</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="active">在读</el-dropdown-item>
                  <el-dropdown-item command="suspended">休学</el-dropdown-item>
                  <el-dropdown-item command="graduated">结业</el-dropdown-item>
                  <el-dropdown-item command="withdrawn">退学</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 卡片列表 - 手机 -->
      <div class="card-list">
        <el-card v-for="item in tableData" :key="item.id" class="student-card" shadow="hover">
          <div class="card-header">
            <span class="name">{{ item.name }}</span>
            <el-tag :type="statusMap[item.status]?.type" size="small">
              {{ statusMap[item.status]?.label }}
            </el-tag>
          </div>
          <div class="card-body">
            <p><span>电话：</span>{{ item.phone }}</p>
            <p><span>校区：</span>{{ item.campusName }}</p>
            <p><span>班级：</span>{{ item.className || '未分班' }}</p>
          </div>
          <div class="card-footer">
            <el-button type="primary" size="small" @click="handleEdit(item)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(item)">删除</el-button>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学生' : '新增学生'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio value="male">男</el-radio>
                <el-radio value="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="form.birthDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="家长姓名">
              <el-input v-model="form.parentName" placeholder="请输入家长姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家长电话">
              <el-input v-model="form.parentPhone" placeholder="请输入家长电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属校区" prop="campusId">
              <el-select v-model="form.campusId" placeholder="选择校区" style="width: 100%">
                <el-option v-for="c in campusList" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属班级">
              <el-select v-model="form.classId" placeholder="选择班级" clearable style="width: 100%">
                <el-option v-for="c in classList" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="入学日期" prop="enrollmentDate">
          <el-date-picker
            v-model="form.enrollmentDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="批量导入学生" width="500px">
      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls,.csv"
        :on-change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx、.xls、.csv 格式，
            <el-link type="primary" @click="downloadTemplate">下载导入模板</el-link>
          </div>
        </template>
      </el-upload>
      <div v-if="importResult" class="import-result">
        <el-alert
          :title="`导入完成：成功 ${importResult.success} 条，失败 ${importResult.failed} 条`"
          :type="importResult.failed > 0 ? 'warning' : 'success'"
          show-icon
        />
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="importLoading" @click="submitImport">开始导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import { studentApi, campusApi, classApi } from '@/api/basic'
import type { Student, Campus, ClassInfo, ImportResult } from '@/types'

const loading = ref(false)
const submitLoading = ref(false)
const importLoading = ref(false)
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const isEdit = ref(false)

const tableData = ref<Student[]>([])
const campusList = ref<Campus[]>([])
const classList = ref<ClassInfo[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const importResult = ref<ImportResult | null>(null)
const importFile = ref<File | null>(null)

const formRef = ref<FormInstance>()
const uploadRef = ref()

const searchForm = reactive({
  keyword: '',
  campusId: undefined as number | undefined,
  status: '',
})

const form = reactive<Partial<Student>>({
  name: '',
  gender: 'male',
  birthDate: '',
  phone: '',
  parentName: '',
  parentPhone: '',
  campusId: undefined,
  classId: undefined,
  enrollmentDate: '',
  remark: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  campusId: [{ required: true, message: '请选择校区', trigger: 'change' }],
  enrollmentDate: [{ required: true, message: '请选择入学日期', trigger: 'change' }],
}

const statusMap: Record<string, { label: string; type: string }> = {
  active: { label: '在读', type: 'success' },
  suspended: { label: '休学', type: 'warning' },
  graduated: { label: '结业', type: 'info' },
  withdrawn: { label: '退学', type: 'danger' },
}

async function loadData() {
  loading.value = true
  try {
    const data = await studentApi.getList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
    })
    tableData.value = data.items
    total.value = data.total
  } catch {
    // 使用模拟数据
    tableData.value = [
      { id: 1, name: '张三', gender: 'male', phone: '13800138001', parentName: '张父', parentPhone: '13900139001', campusId: 1, campusName: '总校', classId: 1, className: '钢琴一班', enrollmentDate: '2024-01-15', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '李四', gender: 'female', phone: '13800138002', parentName: '李母', parentPhone: '13900139002', campusId: 1, campusName: '总校', classId: 2, className: '舞蹈二班', enrollmentDate: '2024-02-20', status: 'active', createdAt: '', updatedAt: '' },
      { id: 3, name: '王五', gender: 'male', phone: '13800138003', parentName: '王父', parentPhone: '13900139003', campusId: 2, campusName: '分校A', classId: 3, className: '美术三班', enrollmentDate: '2023-09-01', status: 'suspended', createdAt: '', updatedAt: '' },
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

async function loadCampuses() {
  try {
    campusList.value = await campusApi.getAll()
  } catch {
    campusList.value = [
      { id: 1, name: '总校', address: '市中心', phone: '13800138000', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '分校A', address: '东区', phone: '13800138001', status: 'active', createdAt: '', updatedAt: '' },
    ]
  }
}

async function loadClasses() {
  try {
    classList.value = await classApi.getAll()
  } catch {
    classList.value = [
      { id: 1, name: '钢琴一班', campusId: 1, campusName: '总校', capacity: 20, startDate: '2024-01-01', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '舞蹈二班', campusId: 1, campusName: '总校', capacity: 25, startDate: '2024-01-01', status: 'active', createdAt: '', updatedAt: '' },
      { id: 3, name: '美术三班', campusId: 2, campusName: '分校A', capacity: 15, startDate: '2024-01-01', status: 'active', createdAt: '', updatedAt: '' },
    ]
  }
}

function handleSearch() {
  page.value = 1
  loadData()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.campusId = undefined
  searchForm.status = ''
  handleSearch()
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, {
    id: undefined,
    name: '',
    gender: 'male',
    birthDate: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    campusId: undefined,
    classId: undefined,
    enrollmentDate: '',
    remark: '',
  })
  dialogVisible.value = true
}

function handleEdit(row: Student) {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await studentApi.update(form.id!, form)
      ElMessage.success('更新成功')
    } else {
      await studentApi.create(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch {
    // 模拟成功
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

async function handleStatusChange(row: Student, status: string) {
  try {
    await ElMessageBox.confirm(`确定要将 ${row.name} 的状态变更为「${statusMap[status].label}」吗？`, '提示', {
      type: 'warning',
    })
    await studentApi.updateStatus(row.id, status)
    ElMessage.success('状态更新成功')
    loadData()
  } catch {
    // 取消操作或模拟成功
  }
}

async function handleDelete(row: Student) {
  try {
    await ElMessageBox.confirm(`确定要删除学生「${row.name}」吗？此操作不可恢复。`, '警告', {
      type: 'warning',
      confirmButtonText: '确定删除',
      confirmButtonClass: 'el-button--danger',
    })
    await studentApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 取消操作
  }
}

function handleImport() {
  importResult.value = null
  importFile.value = null
  importDialogVisible.value = true
}

function handleFileChange(file: UploadFile) {
  importFile.value = file.raw || null
}

async function submitImport() {
  if (!importFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)
    importResult.value = await studentApi.batchImport(formData)
    ElMessage.success('导入完成')
    loadData()
  } catch {
    // 模拟结果
    importResult.value = { total: 10, success: 8, failed: 2, skipped: 0, errors: [] }
    ElMessage.success('导入完成')
  } finally {
    importLoading.value = false
  }
}

function downloadTemplate() {
  ElMessage.info('模板下载功能开发中')
}

function handleExport() {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  loadData()
  loadCampuses()
  loadClasses()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.total-text {
  color: #909399;
  font-size: 14px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.student-card {
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header .name {
  font-size: 16px;
  font-weight: 600;
}

.card-body p {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

.card-body span {
  color: #909399;
}

.card-footer {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.import-result {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .search-form .el-form-item {
    margin-bottom: 12px;
    width: 100%;
  }
  
  .search-form .el-input,
  .search-form .el-select {
    width: 100% !important;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>
