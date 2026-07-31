#!/bin/bash
#===============================================================================
# 培训机构管理系统 - 部署诊断修复脚本
# 用于排查 502 Bad Gateway 等部署问题
#===============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

DEPLOY_DIR="/opt/training-system"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

echo ""
echo "=============================================="
echo "   部署诊断与修复"
echo "=============================================="
echo ""

# ===== 1. 检查后端进程 =====
log_info "1. 检查 PM2 后端进程状态..."
pm2 status 2>/dev/null
echo ""

PM2_RUNNING=$(pm2 jlist 2>/dev/null | grep -c '"status":"online"')
if [ "$PM2_RUNNING" -eq 0 ]; then
  log_error "后端进程未运行！查看错误日志："
  pm2 logs training-system-api --lines 30 --nostream 2>/dev/null
  echo ""
fi

# ===== 2. 检查 PostgreSQL =====
log_info "2. 检查 PostgreSQL 状态..."
if systemctl is-active postgresql &>/dev/null; then
  echo -e "  ${GREEN}✓ PostgreSQL 正在运行${NC}"
else
  log_error "PostgreSQL 未运行！正在启动..."
  systemctl start postgresql
  systemctl enable postgresql
  sleep 2
  if systemctl is-active postgresql &>/dev/null; then
    echo -e "  ${GREEN}✓ PostgreSQL 已成功启动${NC}"
  else
    log_error "PostgreSQL 启动失败，请检查: journalctl -u postgresql"
  fi
fi

# 测试数据库连接
log_info "   测试数据库连接..."
source "$DEPLOY_DIR/backend/.env" 2>/dev/null
if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST:-localhost}" -U "${DB_USERNAME:-postgres}" -d "${DB_DATABASE:-training_system}" -c "SELECT 1;" &>/dev/null; then
  echo -e "  ${GREEN}✓ 数据库连接成功${NC}"
else
  log_error "数据库连接失败！"
  log_warn "  当前 .env 配置:"
  grep -E "^DB_" "$DEPLOY_DIR/backend/.env" 2>/dev/null | sed 's/^/    /'
  echo ""
  log_info "  尝试修复 PostgreSQL 认证配置..."
  
  PG_HBA="/var/lib/pgsql/data/pg_hba.conf"
  if [ -f "$PG_HBA" ]; then
    # 确保本地连接使用 md5 认证
    sed -i 's/local\s\+all\s\+all\s\+peer/local   all             all                                     md5/' "$PG_HBA"
    sed -i 's/host\s\+all\s\+all\s\+127.0.0.1\/32\s\+ident/host    all             all             127.0.0.1\/32            md5/' "$PG_HBA"
    # 如果还是 ident 也改成 md5
    sed -i 's/ident$/md5/' "$PG_HBA"
    systemctl restart postgresql
    sleep 2
    log_info "  pg_hba.conf 已更新为 md5 认证，PostgreSQL 已重启"
  fi
  
  # 确保密码正确
  log_info "  重置数据库密码..."
  su - postgres -c "psql -c \"ALTER USER ${DB_USERNAME:-postgres} PASSWORD '${DB_PASSWORD}';\"" 2>/dev/null
  su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE:-training_system}'\"" | grep -q 1 || \
  su - postgres -c "psql -c \"CREATE DATABASE ${DB_DATABASE:-training_system} OWNER ${DB_USERNAME:-postgres};\""
  
  # 再次测试
  if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST:-localhost}" -U "${DB_USERNAME:-postgres}" -d "${DB_DATABASE:-training_system}" -c "SELECT 1;" &>/dev/null; then
    echo -e "  ${GREEN}✓ 数据库连接修复成功${NC}"
  else
    log_error "数据库仍然无法连接，请手动检查！"
  fi
fi
echo ""

# ===== 3. 检查 SELinux =====
log_info "3. 检查 SELinux..."
if command -v getenforce &>/dev/null && [ "$(getenforce)" = "Enforcing" ]; then
  log_warn "SELinux 处于 Enforcing 状态，这很可能就是 502 的原因！"
  log_info "  允许 Nginx 进行网络连接..."
  setsebool -P httpd_can_network_connect 1
  echo -e "  ${GREEN}✓ 已设置 httpd_can_network_connect = 1${NC}"
else
  echo -e "  ${GREEN}✓ SELinux 未启用或已为 Permissive${NC}"
fi
echo ""

# ===== 4. 检查端口监听 =====
log_info "4. 检查端口监听..."
BACKEND_PORT=$(grep "^PORT=" "$DEPLOY_DIR/backend/.env" 2>/dev/null | cut -d= -f2)
BACKEND_PORT=${BACKEND_PORT:-4000}

if ss -tlnp | grep -q ":${BACKEND_PORT}"; then
  echo -e "  ${GREEN}✓ 后端端口 ${BACKEND_PORT} 正在监听${NC}"
else
  log_error "端口 ${BACKEND_PORT} 未被监听，后端未成功启动"
fi

if ss -tlnp | grep -q ":80"; then
  echo -e "  ${GREEN}✓ Nginx 端口 80 正在监听${NC}"
else
  log_error "Nginx 端口 80 未监听"
  systemctl start nginx
fi
echo ""

# ===== 5. 检查 Nginx 配置 =====
log_info "5. 检查 Nginx 配置..."
nginx -t 2>&1
echo ""

# ===== 6. 尝试重启后端 =====
log_info "6. 重启后端服务..."
cd "$DEPLOY_DIR/backend"

# 确保依赖存在
if [ ! -d "node_modules" ]; then
  log_warn "node_modules 不存在，重新安装依赖..."
  pnpm install --no-frozen-lockfile
fi

# 确保 dist 存在
if [ ! -f "dist/main.js" ]; then
  log_warn "dist/main.js 不存在，重新构建..."
  pnpm run build
fi

# 重启 PM2
pm2 delete training-system-api 2>/dev/null || true
pm2 start ecosystem.config.js 2>/dev/null || pm2 start dist/main.js --name training-system-api
pm2 save

sleep 3

# 验证
if pm2 jlist 2>/dev/null | grep -q '"status":"online"'; then
  echo -e "  ${GREEN}✓ 后端服务已成功启动${NC}"
else
  log_error "后端启动失败，最近日志："
  pm2 logs training-system-api --lines 20 --nostream 2>/dev/null
fi
echo ""

# ===== 7. 最终验证 =====
log_info "7. 最终验证..."
sleep 2

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${BACKEND_PORT}/api 2>/dev/null)
if [ "$HTTP_CODE" != "000" ]; then
  echo -e "  ${GREEN}✓ 后端直连测试: HTTP ${HTTP_CODE}${NC}"
else
  log_error "后端直连失败 (端口 ${BACKEND_PORT} 无响应)"
fi

HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' 2>/dev/null)
echo -e "  Nginx代理 /api 测试: HTTP ${HTTP_CODE2}"
if [ "$HTTP_CODE2" = "502" ]; then
  log_error "仍然 502！请检查以上各项是否修复成功"
elif [ "$HTTP_CODE2" != "000" ]; then
  echo -e "  ${GREEN}✓ Nginx 代理正常${NC}"
fi

echo ""
echo "=============================================="
echo "  诊断完成。如仍有问题，请提供以下命令输出："
echo "    pm2 logs training-system-api --lines 50"
echo "    journalctl -u postgresql --no-pager -n 30"
echo "    journalctl -u nginx --no-pager -n 30"
echo "    cat $DEPLOY_DIR/backend/.env"
echo "=============================================="
