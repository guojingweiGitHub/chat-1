<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header><span>AI 智能表格识别导入</span></template>
      
      <el-steps :active="step" align-center style="margin-bottom:30px">
        <el-step title="上传文件" />
        <el-step title="AI识别" />
        <el-step title="字段映射" />
        <el-step title="数据校验" />
        <el-step title="导入完成" />
      </el-steps>

      <!-- 步骤1: 上传 -->
      <div v-show="step === 0" class="step-content">
        <el-form label-width="100px">
          <el-form-item label="导入类型">
            <el-select v-model="targetType" style="width:200px">
              <el-option label="学生信息" value="student" />
              <el-option label="教师信息" value="teacher" />
              <el-option label="缴费记录" value="payment" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-upload drag :auto-upload="false" :limit="1" accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.pdf" :on-change="handleFileChange">
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持 Excel、CSV、图片(JPG/PNG)、PDF 格式，AI 将自动识别表格内容</div>
          </template>
        </el-upload>
        <div class="step-actions">
          <el-button type="primary" :disabled="!file" @click="startRecognize">开始识别</el-button>
        </div>
      </div>

      <!-- 步骤2: 识别中 -->
      <div v-show="step === 1" class="step-content center">
        <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
        <p>AI 正在识别表格内容...</p>
      </div>

      <!-- 步骤3: 字段映射 -->
      <div v-show="step === 2" class="step-content">
        <el-alert title="请确认字段映射关系，可手动调整" type="info" :closable="false" style="margin-bottom:16px" />
        <el-table :data="mappings" size="small">
          <el-table-column prop="sourceField" label="源字段" width="150" />
          <el-table-column label="映射到">
            <template #default="{ row }">
              <el-select v-model="row.targetField" size="small" style="width:100%">
                <el-option v-for="f in targetFields" :key="f.value" :label="f.label" :value="f.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" width="80">
            <template #default="{ row }"><el-tag v-if="row.required" type="danger" size="small">是</el-tag></template>
          </el-table-column>
        </el-table>
        <div class="step-actions">
          <el-button @click="step = 0">上一步</el-button>
          <el-button type="primary" @click="validateData">校验数据</el-button>
        </div>
      </div>

      <!-- 步骤4: 校验结果 -->
      <div v-show="step === 3" class="step-content">
        <el-row :gutter="16" style="margin-bottom:16px">
          <el-col :span="8"><el-statistic title="总行数" :value="previewData.length" /></el-col>
          <el-col :span="8"><el-statistic title="有效行" :value="validCount" /></el-col>
          <el-col :span="8"><el-statistic title="错误行" :value="errors.length" /></el-col>
        </el-row>
        <el-table v-if="errors.length" :data="errors" size="small" max-height="200" type="danger">
          <el-table-column prop="row" label="行号" width="70" />
          <el-table-column prop="field" label="字段" width="100" />
          <el-table-column prop="message" label="错误信息" />
        </el-table>
        <div class="step-actions">
          <el-button @click="step = 2">上一步</el-button>
          <el-button type="primary" :loading="importing" @click="executeImport">
            {{ errors.length ? '跳过错误并导入' : '确认导入' }}
          </el-button>
        </div>
      </div>

      <!-- 步骤5: 完成 -->
      <div v-show="step === 4" class="step-content center">
        <el-result icon="success" title="导入完成" :sub-title="`成功导入 ${result?.success || 0} 条，失败 ${result?.failed || 0} 条`">
          <template #extra>
            <el-button type="primary" @click="reset">继续导入</el-button>
            <el-button @click="$router.push('/students')">查看数据</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import type { ImportResult, FieldMapping } from '@/types'

const step = ref(0)
const file = ref<File | null>(null)
const targetType = ref('student')
const mappings = ref<FieldMapping[]>([])
const previewData = ref<any[]>([])
const errors = ref<{ row: number; field: string; message: string }[]>([])
const validCount = ref(0)
const importing = ref(false)
const result = ref<ImportResult | null>(null)

const targetFields = [
  { label: '姓名', value: 'name' }, { label: '性别', value: 'gender' },
  { label: '手机号', value: 'phone' }, { label: '家长姓名', value: 'parentName' },
  { label: '校区', value: 'campusName' }, { label: '班级', value: 'className' },
  { label: '入学日期', value: 'enrollmentDate' }, { label: '忽略', value: '' },
]

function handleFileChange(f: UploadFile) { file.value = f.raw || null }

function startRecognize() {
  step.value = 1
  setTimeout(() => {
    mappings.value = [
      { sourceField: '姓名', targetField: 'name', required: true },
      { sourceField: '性别', targetField: 'gender', required: true },
      { sourceField: '联系电话', targetField: 'phone', required: true },
      { sourceField: '家长', targetField: 'parentName', required: false },
      { sourceField: '校区', targetField: 'campusName', required: false },
    ]
    previewData.value = Array(10).fill({})
    step.value = 2
  }, 1500)
}

function validateData() {
  errors.value = [
    { row: 3, field: 'phone', message: '手机号格式不正确' },
    { row: 7, field: 'name', message: '姓名不能为空' },
  ]
  validCount.value = previewData.value.length - errors.value.length
  step.value = 3
}

async function executeImport() {
  importing.value = true
  setTimeout(() => {
    result.value = { total: 10, success: 8, failed: 2, skipped: 0, errors: [] }
    importing.value = false
    step.value = 4
    ElMessage.success('导入完成')
  }, 1000)
}

function reset() {
  step.value = 0
  file.value = null
  mappings.value = []
  previewData.value = []
  errors.value = []
  result.value = null
}
</script>

<style scoped>
.step-content { min-height: 300px; padding: 20px 0; }
.step-content.center { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.step-actions { margin-top: 24px; text-align: center; }
.loading-icon { animation: rotating 1.5s linear infinite; color: #409eff; }
@keyframes rotating { from { transform: rotate(0); } to { transform: rotate(360deg); } }
</style>
