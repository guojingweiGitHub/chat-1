<template>
  <el-container class="main-layout">
    <!-- 侧边栏 - PC/平板 -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar hidden-mobile">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="Logo" class="logo-img" />
        <span v-show="!isCollapsed" class="logo-text">培训机构管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        router
        class="sidebar-menu"
      >
        <template v-for="item in menuItems" :key="item.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <!-- 折叠按钮 - PC/平板 -->
          <el-icon class="collapse-btn hidden-mobile" @click="toggleCollapse">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <!-- 菜单按钮 - 手机 -->
          <el-icon class="menu-btn hidden-desktop" @click="showMobileMenu = true">
            <Menu />
          </el-icon>
          <el-breadcrumb separator="/" class="hidden-mobile">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta.title">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-badge :value="reminderCount" :hidden="reminderCount === 0" class="reminder-badge">
            <el-icon class="header-icon" @click="$router.push('/fees/reminders')">
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="authStore.user?.avatar">
                {{ authStore.username?.charAt(0) }}
              </el-avatar>
              <span class="username hidden-mobile">{{ authStore.username }}</span>
              <el-icon class="hidden-mobile"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>

    <!-- 手机端抽屉菜单 -->
    <el-drawer
      v-model="showMobileMenu"
      direction="ltr"
      :size="260"
      :show-close="false"
      class="mobile-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <img src="@/assets/logo.svg" alt="Logo" class="logo-img" />
          <span class="logo-text">管理系统</span>
        </div>
      </template>
      <el-menu :default-active="activeMenu" router @select="showMobileMenu = false">
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children?.length" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-drawer>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { reminderApi } from '@/api/fee'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const showMobileMenu = ref(false)
const showPasswordDialog = ref(false)
const reminderCount = ref(0)

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const currentRoute = computed(() => route)
const activeMenu = computed(() => route.path)

// 菜单配置
const menuItems = computed(() => {
  const items = [
    { path: '/dashboard', title: '工作台', icon: 'Odometer' },
    { path: '/students', title: '学生管理', icon: 'User', permission: 'student:view' },
    { path: '/campuses', title: '校区管理', icon: 'School', permission: 'campus:view' },
    { path: '/classes', title: '班级管理', icon: 'Collection', permission: 'class:view' },
    { path: '/teachers', title: '教师管理', icon: 'Avatar', permission: 'teacher:view' },
    {
      path: '/fees',
      title: '收费管理',
      icon: 'Money',
      permission: 'fee:view',
      children: [
        { path: '/fees/cycles', title: '收费周期' },
        { path: '/fees/payments', title: '缴费记录' },
        { path: '/fees/reminders', title: '到期提醒' },
        ...(authStore.isAdmin ? [{ path: '/fees/discounts', title: '折扣管理' }] : []),
      ],
    },
    { path: '/statistics', title: '统计分析', icon: 'DataAnalysis', permission: 'statistics:view' },
    { path: '/import', title: 'AI智能导入', icon: 'Upload', permission: 'import:use' },
  ]

  // 管理员显示系统管理
  if (authStore.isAdmin) {
    items.push({
      path: '/system',
      title: '系统管理',
      icon: 'Setting',
      children: [
        { path: '/system/users', title: '用户管理' },
        { path: '/system/roles', title: '角色管理' },
      ],
    } as any)
  }

  return items.filter((item: any) => {
    if (!item.permission) return true
    return authStore.hasPermission(item.permission)
  })
})

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中')
      break
    case 'password':
      showPasswordDialog.value = true
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        authStore.logout()
        router.push('/login')
      }).catch(() => {})
      break
  }
}

async function handleChangePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  try {
    await authApi.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    })
    ElMessage.success('密码修改成功，请重新登录')
    showPasswordDialog.value = false
    authStore.logout()
    router.push('/login')
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

async function loadReminderCount() {
  try {
    const data = await reminderApi.getExpiringList(30)
    reminderCount.value = data.length
  } catch {
    // 忽略错误
  }
}

onMounted(() => {
  loadReminderCount()
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: #263445;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  margin-left: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
  background: transparent;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: #263445;
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
  background: #263445;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn,
.menu-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.header-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.reminder-badge {
  line-height: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  color: #303133;
  font-size: 14px;
}

.main-content {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
  
  .header {
    padding: 0 12px;
  }
}
</style>
