# build stage
FROM node:26 AS build
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# install pnpm as defined in package.json
RUN npm install -g corepack
RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm docs:build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]