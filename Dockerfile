FROM node:14.19.1-buster as build

WORKDIR /website

COPY package.json .

RUN npm install

COPY . .

RUN [ "npm", "run", "build" ]


FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /website/public .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
