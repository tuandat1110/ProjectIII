FROM node:18-alpine
WORKDIR /app

# 1. SAO CHÉP CÁC FILE CẦN THIẾT CHO INSTALL VÀ PRISMA GENERATE
# Sao chép package.json và package-lock.json (Cần cho npm install)
COPY BE/package*.json ./

# Sao chép file schema.prisma (Cần cho npx prisma generate)
# Giả sử file này nằm ở BE/prisma/schema.prisma
# Cần tạo thư mục /app/prisma trước
RUN mkdir -p prisma
COPY BE/prisma/schema.prisma ./prisma/

# 2. CÀI ĐẶT VÀ GENERATE
RUN npm install
# Lệnh này bây giờ sẽ tìm thấy schema.prisma tại /app/prisma/schema.prisma
RUN npx prisma generate

# 3. SAO CHÉP SOURCE CODE CÒN LẠI VÀ BUILD
# Sao chép toàn bộ source code (bao gồm src/, dist/, v.v...)
COPY BE/. .

RUN npm run build
CMD ["node", "dist/main.js"]