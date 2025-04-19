# ---- Stage 1: Build React App ----
	FROM node:18-alpine AS build-stage

	WORKDIR /react-app

	COPY package*.json ./

	RUN npm install

	COPY . .

	ARG REACT_DOCKER_PORT
	ENV REACT_DOCKER_PORT=$REACT_DOCKER_PORT
	ARG REACT_APP_API_BASE_URL
	ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL


	RUN npm run build

	# ---- Stage 2: Serve with Nginx ----
	FROM nginx:alpine
	# WORKDIR /usr/share/nginx/html

	COPY --from=build-stage /react-app/build /usr/share/nginx/html
	EXPOSE 80

	CMD ["nginx", "-g", "daemon off;"]
