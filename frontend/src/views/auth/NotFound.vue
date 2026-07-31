<template>
  <div class="not-found">
    <div class="content">
      <h1 class="code">404</h1>
      <p class="message">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="$router.push('/dashboard')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.content {
  text-align: center;
}

.code {
  font-size: 120px;
  font-weight: 700;
  color: #409eff;
  margin: 0;
  line-height: 1;
}

.message {
  font-size: 18px;
  color: #606266;
  margin: 24px 0 32px;
}
</style>
