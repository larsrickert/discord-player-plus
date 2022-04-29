FROM node:16-alpine

WORKDIR /usr/src/app

COPY . ./

#  remove husky init script (needed because --only=production does not install husky)
RUN npm set-script prepare ""
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
