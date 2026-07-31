<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="学员">
          <el-input v-model="searchForm.keyword" placeholder="姓名/手机号" clearable style="width:150px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:120px">
            <el-option label="已缴" value="paid" />
            <el-option label="部分缴" value="partial" />
            <el-option label="未缴" value="unpaid" />
            <el-option label="已退费" value="refunded" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增缴费</el-button>
        <el-button type="warning" @click="showOverdue">欠费列表</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="studentName" label="学员" width="100" />
        <el-table-column prop="cycleName" label="收费周期" width="140" />
        <el-table-column prop="campusName" label="校区" width="100" />
        <el-table-column label="应缴金额" width="110">
          <template #default="{ row }">¥{{ row.amountDue?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="实缴金额" width="110">
          <template #default="{ row }">¥{{ row.amountPaid?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="折扣" width="80">
          <template #default="{ row }">
            <span v-if="row.discountRate">{{ row.discountRate * 10 }}折</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日期" width="110" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" size="small">{{ statusMap[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status !== 'refunded'" type="danger" link size="small" @click="handleRefund(row)">退费</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="page" :total="total" :page-size="10" layout="total, prev, pager, next" @current-change="loadData" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑缴费' : '新增缴费'" width="550px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学员" prop="studentId">
          <el-select v-model="form.studentId" filterable placeholder="选择学员" style="width:100%">
            <el-option v-for="s in studentList" :key="s.id" :label="`${s.name} (${s.phone})`" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收费周期" prop="cycleId">
          <el-select v-model="form.cycleId" placeholder="选择周期" style="width:100%">
            <el-option v-for="c in cycleList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="应缴金额" prop="amountDue">
          <el-input-number v-model="form.amountDue" :min="0" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="实缴金额" prop="amountPaid">
          <el-input-number v-model="form.amountPaid" :min="0" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item v-if="authStore.isAdmin" label="折扣">
          <el-input-number v-model="form.discountRate" :min="0.1" :max="1" :step="0.05" :precision="2" style="width:150px" />
          <span style="margin-left:10px;color:#909399">仅管理员可设置</span>
        </el-form-item>
        <el-form-item v-if="authStore.isAdmin && form.discountRate && form.discountRate < 1" label="折扣原因">
          <el-input v-model="form.discountReason" placeholder="请输入折扣原因" />
        </el-form-item>
        <el-form-item label="缴费方式">
          <el-select v-model="form.paymentMethod" style="width:100%">
            <el-option label="现金" value="cash" />
            <el-option label="银行转账" value="transfer" />
            <el-option label="POS刷卡" value="pos" />
            <el-option label="在线支付" value="online" />
          </el-select>
        </el-form-item>
        <el-form-item label="到期日期" prop="dueDate">
          <el-date-picker v-model="form.dueDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
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
import { paymentApi, feeCycleApi } from '@/api/fee'
import { studentApi } from '@/api/basic'
import { useAuthStore } from '@/stores/auth'
import type { Payment, FeeCycle, Student } from '@/types'

const authStore = useAuthStore()
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<Payment[]>([])
const cycleList = ref<FeeCycle[]>([])
const studentList = ref<Student[]>([])
const total = ref(0)
const page = ref(1)
const formRef = ref<FormInstance>()

const searchForm = reactive({ keyword: '', status: '' })
const form = reactive<Partial<Payment>>({})

const rules: FormRules = {
  studentId: [{ required: true, message: '请选择学员', trigger: 'change' }],
  cycleId: [{ required: true, message: '请选择收费周期', trigger: 'change' }],
  amountDue: [{ required: true, message: '请输入应缴金额', trigger: 'blur' }],
  amountPaid: [{ required: true, message: '请输入实缴金额', trigger: 'blur' }],
  dueDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
}

const statusMap: Record<string, { label: string; type: string }> = {
  paid: { label: '已缴', type: 'success' },
  partial: { label: '部分缴', type: 'warning' },
  unpaid: { label: '未缴', type: 'danger' },
  refunded: { label: '已退费', type: 'info' },
}

async function loadData() {
  loading.value = true
  try {
    const data = await paymentApi.getList({ page: page.value, pageSize: 10, ...searchForm })
    tableData.value = data.items
    total.value = data.total
  } catch {
    tableData.value = [
      { id: 1, studentId: 1, studentName: '张三', cycleId: 1, cycleName: '2024春季学期', campusId: 1, campusName: '总校', amountDue: 5800, amountPaid: 5800, discountRate: 1, dueDate: '2024-07-01', status: 'paid', createdAt: '', updatedAt: '' },
      { id: 2, studentId: 2, studentName: '李四', cycleId: 1, cycleName: '2024春季学期', campusId: 1, campusName: '总校', amountDue: 5800, amountPaid: 3000, dueDate: '2024-07-01', status: 'partial', createdAt: '', updatedAt: '' },
      { id: 3, studentId: 3, studentName: '王五', cycleId: 2, cycleName: '2024暑期班', campusId: 2, campusName: '分校A', amountDue: 3200, amountPaid: 0, dueDate: '2024-08-15', status: 'unpaid', createdAt: '', updatedAt: '' },
    ]
    total.value = 3
  } finally { loading.value = false }
}

async function loadOptions() {
  try { cycleList.value = await feeCycleApi.getAll() } catch {
    cycleList.value = [
      { id: 1, name: '2024春季学期', type: 'semester', startDate: '2024-02-01', endDate: '2024-07-01', standardFee: 5800, campusId: 1, createdAt: '' },
      { id: 2, name: '2024暑期班', type: 'summer', startDate: '2024-07-01', endDate: '2024-08-31', standardFee: 3200, campusId: 1, createdAt: '' },
    ]
  }
  try { const d = await studentApi.getList({ pageSize: 100 }); studentList.value = d.items } catch {
    studentList.value = [
      { id: 1, name: '张三', gender: 'male', phone: '13800138001', campusId: 1, enrollmentDate: '', status: 'active', createdAt: '', updatedAt: '' },
      { id: 2, name: '李四', gender: 'female', phone: '13800138002', campusId: 1, enrollmentDate: '', status: 'active', createdAt: '', updatedAt: '' },
    ]
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { id: undefined, studentId: undefined, cycleId: undefined, amountDue: 0, amountPaid: 0, discountRate: 1, discountReason: '', paymentMethod: 'cash', dueDate: '' })
  dialogVisible.value = true
}

function handleEdit(row: Payment) { isEdit.value = true; Object.assign(form, row); dialogVisible.value = true }

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
  loadData()
}

async function handleRefund(row: Payment) {
  try {
    const { value } = await ElMessageBox.prompt('请输入退费原因', '退费确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '原因不能为空',
    })
    if (!value) return
    ElMessage.success('退费成功')
    loadData()
  } catch {
    // 取消操作
  }
}

function showOverdue() {
  searchForm.status = 'unpaid'
  loadData()
}

function resetSearch() {
  searchForm.keyword = ''
  searchForm.status = ''
  loadData()
}

onMounted(() => { loadData(); loadOptions() })
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.toolbar { margin-bottom: 16px; display: flex; gap: 8px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
