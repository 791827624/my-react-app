# 阶段1：构建阶段 (修改为使用pnpm)
FROM node:20-alpine AS builder

# 安装 pnpm (比直接使用corepack更快)
RUN npm install -g pnpm@8

# 设置工作目录
WORKDIR /app

# 1. 先只复制包管理文件（利用Docker缓存层）
COPY package.json pnpm-lock.yaml ./

# 2. 安装依赖（使用frozen-lockfile确保一致性）
RUN pnpm install --frozen-lockfile --prod=false

# 3. 复制所有源代码
COPY . .

# 4. 执行构建
RUN pnpm build

# ----------------------------
# 阶段2：生产环境 (保持不变)
FROM nginx:stable-alpine

# 5. 清理默认配置
RUN rm -rf /etc/nginx/conf.d/*

# 6. 复制Nginx配置
# 6.1 主配置文件
COPY nginx/nginx.conf /etc/nginx/nginx.conf
# 6.2 应用配置
COPY nginx/app.conf /etc/nginx/conf.d/default.conf

# 7. 从构建阶段复制产物
COPY --from=builder /app/build /usr/share/nginx/html

# 8. 添加权限控制
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 9. 暴露端口
EXPOSE 80

# 10. 启动Nginx
CMD ["nginx", "-g", "daemon off;"]