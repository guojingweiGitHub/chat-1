#!/bin/bash
#===============================================================================
# 培训机构管理系统 - 阿里云一键部署脚本
# 适用环境: Alibaba Cloud Linux 3.2104 U12.3 (OpenAnolis Edition)
# Node.js: v20.20.2 (NVM管理) | 包管理器: pnpm
# 代码仓库: https://github.com/guojingweiGitHub/chat-1.git
#===============================================================================

set -e

# ========================= 配置区域 =========================
REPO_URL="https://github.com/guojingweiGitHub/chat-1.git"
DEPLOY_DIR="/opt/training-system"
NODE_VERSION="v20.20.2"
DB_NAME="training_system"
DB_USER="postgres"
DB_PASSWORD="Training@2024!"
JWT_SECRET="$(openssl rand -hex 32)"
BACKEND_PORT=4000
DOMAIN="_"  # 如有域名请修改，如 "example.com"
# ===========================================================

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then
  log_error "请使用 root 用户运行此脚本: sudo bash deploy.sh"
  exit 1
fi

echo ""
echo "=============================================="
echo "   培训机构管理系统 - 一键部署"
echo "=============================================="
echo ""

# ========================= 1. 系统依赖 =========================
log_info "Step 1/9: 安装系统依赖..."

dnf install -y git nginx postgresql-server postgresql-contrib gcc-c++ make 2>/dev/null || \
yum install -y git nginx postgresql-server postgresql-contrib gcc-c++ make

log_info "系统依赖安装完成"

# ========================= 2. NVM + Node.js =========================
log_info "Step 2/9: 配置 Node.js 环境..."

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
else
  log_warn "NVM 未找到，正在安装..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  source "$NVM_DIR/nvm.sh"
fi

nvm install $NODE_VERSION 2>/dev/null || true
nvm use $NODE_VERSION
nvm alias default $NODE_VERSION

log_info "Node.js 版本: $(node -v)"
log_info "npm 版本: $(npm -v)"

# ========================= 3. pnpm =========================
log_info "Step 3/9: 安装 pnpm..."

if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi
log_info "pnpm 版本: $(pnpm -v)"

# ========================= 4. 拉取代码 =========================
log_info "Step 4/9: 拉取项目代码..."

if [ -d "$DEPLOY_DIR" ]; then
  log_warn "目录 $DEPLOY_DIR 已存在，执行 git pull..."
  cd "$DEPLOY_DIR"
  git pull origin main || git pull origin master
else
  git clone "$REPO_URL" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

log_info "代码拉取完成: $DEPLOY_DIR"

# ========================= 5. PostgreSQL =========================
log_info "Step 5/9: 配置 PostgreSQL 数据库..."

# 初始化数据库（如果尚未初始化）
if [ ! -d "/var/lib/pgsql/data" ] || [ ! -f "/var/lib/pgsql/data/PG_VERSION" ]; then
  postgresql-setup --initdb
fi

# 启动并设置开机自启
systemctl enable postgresql
systemctl start postgresql

# 配置 PostgreSQL 密码和数据库
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'\"" | grep -q 1 || \
su - postgres -c "psql -c \"ALTER USER ${DB_USER} PASSWORD '${DB_PASSWORD}';\""

# 创建数据库
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'\"" | grep -q 1 || \
su - postgres -c "psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\""

# 配置 pg_hba.conf 允许本地密码认证
PG_HBA="/var/lib/pgsql/data/pg_hba.conf"
if ! grep -q "md5" "$PG_HBA" 2>/dev/null; then
  sed -i 's/local\s\+all\s\+all\s\+peer/local   all             all                                     md5/' "$PG_HBA"
  sed -i 's/host\s\+all\s\+all\s\+127.0.0.1\/32\s\+ident/host    all             all             127.0.0.1\/32            md5/' "$PG_HBA"
  systemctl restart postgresql
fi

log_info "PostgreSQL 配置完成 (数据库: ${DB_NAME})"

# ========================= 6. 后端部署 =========================
log_info "Step 6/9: 部署后端服务..."

cd "$DEPLOY_DIR/backend"

# 生成 .env 文件
cat > .env << EOF
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_NAME}

# JWT 配置
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# 应用配置
PORT=${BACKEND_PORT}
NODE_ENV=production
FRONTEND_URL=http://${DOMAIN}
EOF

log_info "后端 .env 配置已生成"

# 安装依赖并构建
pnpm install --no-frozen-lockfile
pnpm run build

# 安装 PM2 全局进程管理
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# 运行数据库种子（初始化角色和管理员账号）
log_info "初始化数据库种子数据..."
npx ts-node src/seed.ts || log_warn "种子数据可能已存在，跳过"

log_info "后端构建完成"

# ========================= 7. 前端部署 =========================
log_info "Step 7/9: 部署前端..."

cd "$DEPLOY_DIR/frontend"

pnpm install --no-frozen-lockfile
pnpm run build

log_info "前端构建完成，输出目录: $DEPLOY_DIR/frontend/dist"

# ========================= 8. Nginx 配置 =========================
log_info "Step 8/9: 配置 Nginx 反向代理..."

cat > /etc/nginx/conf.d/training-system.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    # 前端静态文件
    root ${DEPLOY_DIR}/frontend/dist;
    index index.html;

    # 前端路由 (SPA History模式)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API 反向代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;
}
EOF

# 移除默认配置避免冲突
rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# 检查 Nginx 配置并启动
nginx -t
systemctl enable nginx
systemctl restart nginx

log_info "Nginx 配置完成"

# ========================= 9. PM2 启动后端 =========================
log_info "Step 9/9: 使用 PM2 启动后端服务..."

cd "$DEPLOY_DIR/backend"

# 创建 PM2 生态配置
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'training-system-api',
    script: 'dist/main.js',
    cwd: '${DEPLOY_DIR}/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
EOF

# 停止旧进程（如果存在）
pm2 delete training-system-api 2>/dev/null || true

# 启动
pm2 start ecosystem.config.js
pm2 save

# 设置 PM2 开机自启
pm2 startup systemd -u root --hp $HOME 2>/dev/null || true
pm2 save

log_info "后端服务已通过 PM2 启动"

# ========================= 防火墙配置 =========================
log_info "配置防火墙..."

if command -v firewall-cmd &> /dev/null; then
  firewall-cmd --permanent --add-service=http 2>/dev/null || true
  firewall-cmd --permanent --add-service=https 2>/dev/null || true
  firewall-cmd --reload 2>/dev/null || true
fi

# ========================= 完成 =========================
echo ""
echo "=============================================="
echo -e "${GREEN}   部署完成！${NC}"
echo "=============================================="
echo ""
echo "  访问地址:  http://$(hostname -I | awk '{print $1}')"
echo "  后端API:   http://$(hostname -I | awk '{print $1}')/api"
echo "  管理账号:  admin"
echo "  管理密码:  admin123"
echo ""
echo "  常用命令:"
echo "    查看后端日志:  pm2 logs training-system-api"
echo "    重启后端:      pm2 restart training-system-api"
echo "    查看状态:      pm2 status"
echo "    重启Nginx:     systemctl restart nginx"
echo ""
echo "  部署目录:  $DEPLOY_DIR"
echo "  前端目录:  $DEPLOY_DIR/frontend/dist"
echo "  后端目录:  $DEPLOY_DIR/backend"
echo "  环境配置:  $DEPLOY_DIR/backend/.env"
echo ""
echo "  ⚠️  安全提醒:"
echo "    1. 请及时修改管理员密码"
echo "    2. 生产环境建议配置 HTTPS (certbot)"
echo "    3. 请修改 .env 中的 JWT_SECRET"
echo "    4. 阿里云安全组需开放 80/443 端口"
echo "=============================================="
