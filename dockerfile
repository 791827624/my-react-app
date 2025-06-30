# 阶段1：构建阶段 (保持不变)
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
# 阶段2：生产环境 (主要修改部分)
FROM nginx:stable-alpine

# 5. 清理默认配置 (改为删除整个conf.d目录内容)
RUN rm -rf /etc/nginx/conf.d/*

# 6. 复制拆分后的Nginx配置 (关键修改)
# 6.1 主配置文件放到正确位置
COPY nginx/nginx.conf /etc/nginx/nginx.conf
# 6.2 应用配置重命名为default.conf确保被自动加载
COPY nginx/app.conf /etc/nginx/conf.d/default.conf

# 7. 从构建阶段复制产物 (保持不变)
COPY --from=builder /app/build /usr/share/nginx/html

# 8. 添加权限控制 (新增)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 9. 暴露端口 (保持不变)
EXPOSE 80

# 10. 启动Nginx (保持不变)
CMD ["nginx", "-g", "daemon off;"]