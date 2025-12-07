FROM node:18-alpine
WORKDIR /app

# Sửa: Chỉ rõ đường dẫn đến thư mục BE
COPY BE/package*.json ./

RUN npm install
RUN npx prisma generate

# Sửa: Sao chép source code từ BE/ vào /app
COPY BE/. .

RUN npm run build
CMD ["node", "dist/main.js"]