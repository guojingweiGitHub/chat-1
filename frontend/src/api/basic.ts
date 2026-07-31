import { request } from '@/utils/request'
import type { Student, Campus, ClassInfo, Teacher, PaginatedResponse, ImportResult } from '@/types'

// 学生 API
export const studentApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    campusId?: number
    classId?: number
    status?: string
  }): Promise<PaginatedResponse<Student>> {
    return request.get('/students', { params })
  },

  getById(id: number): Promise<Student> {
    return request.get(`/students/${id}`)
  },

  create(data: Partial<Student>): Promise<Student> {
    return request.post('/students', data)
  },

  update(id: number, data: Partial<Student>): Promise<Student> {
    return request.put(`/students/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/students/${id}`)
  },

  updateStatus(id: number, status: string): Promise<void> {
    return request.put(`/students/${id}/status`, { status })
  },

  batchImport(formData: FormData): Promise<ImportResult> {
    return request.upload('/students/import', formData)
  },

  downloadTemplate(): Promise<Blob> {
    return request.get('/students/template', { responseType: 'blob' })
  },

  export(params?: any): Promise<Blob> {
    return request.get('/students/export', { params, responseType: 'blob' })
  },
}

// 校区 API
export const campusApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
  }): Promise<PaginatedResponse<Campus>> {
    return request.get('/campuses', { params })
  },

  getAll(): Promise<Campus[]> {
    return request.get('/campuses/all')
  },

  getById(id: number): Promise<Campus> {
    return request.get(`/campuses/${id}`)
  },

  create(data: Partial<Campus>): Promise<Campus> {
    return request.post('/campuses', data)
  },

  update(id: number, data: Partial<Campus>): Promise<Campus> {
    return request.put(`/campuses/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/campuses/${id}`)
  },

  updateStatus(id: number, status: string): Promise<void> {
    return request.put(`/campuses/${id}/status`, { status })
  },
}

// 班级 API
export const classApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    campusId?: number
    teacherId?: number
    status?: string
  }): Promise<PaginatedResponse<ClassInfo>> {
    return request.get('/classes', { params })
  },

  getAll(campusId?: number): Promise<ClassInfo[]> {
    return request.get('/classes/all', { params: { campusId } })
  },

  getById(id: number): Promise<ClassInfo> {
    return request.get(`/classes/${id}`)
  },

  create(data: Partial<ClassInfo>): Promise<ClassInfo> {
    return request.post('/classes', data)
  },

  update(id: number, data: Partial<ClassInfo>): Promise<ClassInfo> {
    return request.put(`/classes/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/classes/${id}`)
  },

  addStudents(classId: number, studentIds: number[]): Promise<void> {
    return request.post(`/classes/${classId}/students`, { studentIds })
  },

  removeStudent(classId: number, studentId: number): Promise<void> {
    return request.delete(`/classes/${classId}/students/${studentId}`)
  },
}

// 教师 API
export const teacherApi = {
  getList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    campusId?: number
    status?: string
  }): Promise<PaginatedResponse<Teacher>> {
    return request.get('/teachers', { params })
  },

  getAll(campusId?: number): Promise<Teacher[]> {
    return request.get('/teachers/all', { params: { campusId } })
  },

  getById(id: number): Promise<Teacher> {
    return request.get(`/teachers/${id}`)
  },

  create(data: Partial<Teacher>): Promise<Teacher> {
    return request.post('/teachers', data)
  },

  update(id: number, data: Partial<Teacher>): Promise<Teacher> {
    return request.put(`/teachers/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return request.delete(`/teachers/${id}`)
  },

  updateStatus(id: number, status: string): Promise<void> {
    return request.put(`/teachers/${id}/status`, { status })
  },
}
