import { request } from '@/utils/request'
import type { ImportResult, FieldMapping } from '@/types'

export interface RecognizedData {
  headers: string[]
  rows: string[][]
  confidence: number
}

export interface ImportTask {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  fileName: string
  fileType: string
  recognizedData?: RecognizedData
  mappings?: FieldMapping[]
  result?: ImportResult
  createdAt: string
}

export const importApi = {
  // 上传文件并识别
  uploadAndRecognize(formData: FormData): Promise<{ taskId: string }> {
    return request.upload('/import/upload', formData)
  },

  // 获取识别结果
  getRecognizedData(taskId: string): Promise<RecognizedData> {
    return request.get(`/import/${taskId}/recognized`)
  },

  // 获取推荐字段映射
  getSuggestedMappings(taskId: string, targetType: string): Promise<FieldMapping[]> {
    return request.get(`/import/${taskId}/mappings`, { params: { targetType } })
  },

  // 校验数据
  validateData(data: {
    taskId: string
    targetType: string
    mappings: FieldMapping[]
    rows: string[][]
  }): Promise<{ validRows: number; errors: { row: number; field: string; message: string }[] }> {
    return request.post('/import/validate', data)
  },

  // 执行导入
  executeImport(data: {
    taskId: string
    targetType: string
    mappings: FieldMapping[]
    rows: string[][]
    skipErrors?: boolean
  }): Promise<ImportResult> {
    return request.post('/import/execute', data)
  },

  // 获取导入任务状态
  getTaskStatus(taskId: string): Promise<ImportTask> {
    return request.get(`/import/${taskId}/status`)
  },

  // 获取导入历史
  getHistory(params?: {
    page?: number
    pageSize?: number
    targetType?: string
  }): Promise<{ items: ImportTask[]; total: number }> {
    return request.get('/import/history', { params })
  },

  // 回滚导入
  rollback(batchId: string): Promise<void> {
    return request.post(`/import/${batchId}/rollback`)
  },

  // 下载错误报告
  downloadErrors(taskId: string): Promise<Blob> {
    return request.get(`/import/${taskId}/errors`, { responseType: 'blob' })
  },

  // 下载导入模板
  downloadTemplate(targetType: string): Promise<Blob> {
    return request.get(`/import/template/${targetType}`, { responseType: 'blob' })
  },
}
