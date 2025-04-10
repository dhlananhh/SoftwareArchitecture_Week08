# ---- Stage 1: Build React App ----
	FROM node:18-alpine AS builder
	WORKDIR /app

	COPY ./my-react-app/package*.json ./
	RUN npm install

	COPY ./my-react-app ./

	RUN npm run build

	# ---- Stage 2: Serve with Nginx ----
	FROM nginx:alpine
	WORKDIR /usr/share/nginx/html

	RUN rm -rf ./*

	COPY --from=builder /app/build .

	COPY nginx.conf /etc/nginx/conf.d/default.conf

	EXPOSE 80
	CMD ["nginx", "-g", "daemon off;"] # Chạy Nginx ở foreground
