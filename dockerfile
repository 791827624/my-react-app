# 使用 Node 镜像作为基础镜像
FROM node:20 as base

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 并安装依赖
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# 复制应用程序代码
COPY . .

# 构建生产环境应用
RUN yarn run build

FROM nginx:stable-alpine

COPY --from=base /app/build /usr/share/nginx/html
