#!/bin/bash
#===============================================================================
# 培训机构管理系统 - 更新部署脚本
# 用于代码更新后重新构建和部署
#===============================================================================

set -e

DEPLOY_DIR="/opt/training-system"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

echo "[INFO] 拉取最新代码..."
cd "$DEPLOY_DIR"
git pull origin main || git pull origin master

echo "[INFO] 构建后端..."
cd "$DEPLOY_DIR/backend"
pnpm install --no-frozen-lockfile
pnpm run build

echo "[INFO] 构建前端..."
cd "$DEPLOY_DIR/frontend"
pnpm install --no-frozen-lockfile
pnpm run build

echo "[INFO] 重启后端服务..."
pm2 restart training-system-api

echo "[INFO] 重载 Nginx..."
systemctl reload nginx

echo "[INFO] 更新部署完成！"
