import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
      // 基本信息管理
      {
        path: 'students',
        name: 'Students',
        component: () => import('@/views/students/Index.vue'),
        meta: { title: '学生管理', icon: 'User', permission: 'student:view' },
      },
      {
        path: 'campuses',
        name: 'Campuses',
        component: () => import('@/views/campuses/Index.vue'),
        meta: { title: '校区管理', icon: 'School', permission: 'campus:view' },
      },
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('@/views/classes/Index.vue'),
        meta: { title: '班级管理', icon: 'Collection', permission: 'class:view' },
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('@/views/teachers/Index.vue'),
        meta: { title: '教师管理', icon: 'Avatar', permission: 'teacher:view' },
      },
      // 收费管理
      {
        path: 'fees',
        name: 'Fees',
        redirect: '/fees/payments',
        meta: { title: '收费管理', icon: 'Money', permission: 'fee:view' },
        children: [
          {
            path: 'cycles',
            name: 'FeeCycles',
            component: () => import('@/views/fees/Cycles.vue'),
            meta: { title: '收费周期', permission: 'fee:view' },
          },
          {
            path: 'payments',
            name: 'Payments',
            component: () => import('@/views/fees/Payments.vue'),
            meta: { title: '缴费记录', permission: 'fee:view' },
          },
          {
            path: 'reminders',
            name: 'Reminders',
            component: () => import('@/views/fees/Reminders.vue'),
            meta: { title: '到期提醒', permission: 'fee:view' },
          },
          {
            path: 'discounts',
            name: 'Discounts',
            component: () => import('@/views/fees/Discounts.vue'),
            meta: { title: '折扣管理', permission: 'discount:manage', adminOnly: true },
          },
        ],
      },
      // 统计分析
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/statistics/Index.vue'),
        meta: { title: '统计分析', icon: 'DataAnalysis', permission: 'statistics:view' },
      },
      // AI 导入
      {
        path: 'import',
        name: 'Import',
        component: () => import('@/views/import/Index.vue'),
        meta: { title: 'AI智能导入', icon: 'Upload', permission: 'import:use' },
      },
      // 系统管理
      {
        path: 'system',
        name: 'System',
        redirect: '/system/users',
        meta: { title: '系统管理', icon: 'Setting', permission: 'system:view', adminOnly: true },
        children: [
          {
            path: 'users',
            name: 'Users',
            component: () => import('@/views/users/Index.vue'),
            meta: { title: '用户管理', permission: 'user:manage' },
          },
          {
            path: 'roles',
            name: 'Roles',
            component: () => import('@/views/roles/Index.vue'),
            meta: { title: '角色管理', permission: 'role:manage' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/auth/NotFound.vue'),
    meta: { title: '页面未找到', public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = `${to.meta.title || ''} - 培训机构管理系统`
  
  // 公开页面直接放行
  if (to.meta.public) {
    if (to.path === '/login' && authStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  // 未登录跳转登录页
  if (!authStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查管理员专属页面
  if (to.meta.adminOnly && !authStore.isAdmin) {
    next('/dashboard')
    return
  }
  
  // 检查权限
  const permission = to.meta.permission as string
  if (permission && !authStore.hasPermission(permission)) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
