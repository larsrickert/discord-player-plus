# build stage
FROM node:17 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run docs:build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
