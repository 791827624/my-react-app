# 阶段1：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 1. 先只复制包管理文件（利用Docker缓存层）
COPY package.json yarn.lock ./

# 2. 安装依赖（使用frozen-lockfile确保一致性）
RUN yarn install --frozen-lockfile --production=false

# 3. 复制所有源代码
COPY . .

# 4. 执行构建
RUN yarn build

# ----------------------------
# 阶段2：生产环境
FROM nginx:stable-alpine

# 5. 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 6. 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/

# 7. 从构建阶段复制产物
COPY --from=builder /app/build /usr/share/nginx/html

# 8. 暴露端口
EXPOSE 80

# 9. 启动Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]