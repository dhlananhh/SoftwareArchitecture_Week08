# Sử dụng base image Node.js (chọn phiên bản LTS phù hợp)
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Copy file package.json và package-lock.json (nếu có)
# Copy riêng lẻ để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt các dependencies trong container
RUN npm install
# Nếu là ứng dụng production, bạn có thể dùng: RUN npm ci --only=production

# Copy toàn bộ source code của ứng dụng vào thư mục làm việc
COPY . .

# Mở cổng 3000 bên trong container để ứng dụng lắng nghe
EXPOSE 3000

# Lệnh để chạy ứng dụng khi container khởi động
CMD [ "node", "app.js" ]
# Hoặc dùng: CMD [ "npm", "start" ] nếu script start được định nghĩa trong package.json