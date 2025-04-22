# 使用多阶段构建减少镜像体积
# 第一阶段：构建应用
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 第二阶段：生产环境
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# 构建镜像：docker build -t my-react-app .
# 运行容器：docker run -p 3000:80 my-react-app