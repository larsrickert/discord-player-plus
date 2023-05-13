# build stage
FROM node:18 as build
WORKDIR /app

# install pnpm
RUN npm i -g pnpm@8.5.0

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm docs:build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
