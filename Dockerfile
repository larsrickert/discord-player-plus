# build stage
FROM node:18 as build

WORKDIR /app

# install pnpm as defined in package.json
COPY pnpm-lock.yaml package.json ./
RUN npm i -g $(node -p "require('./package.json').packageManager")

RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm docs:build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
