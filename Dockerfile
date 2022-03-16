FROM ubuntu:latest as build

WORKDIR /website

COPY . .

RUN apt update -y
RUN apt install curl gnupg git python make build-essential -y
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo deb https://deb.nodesource.com/node_15.x focal main > /etc/apt/sources.list.d/nodesource.list

RUN apt update -y
RUN apt install nodejs -y
RUN npm install
RUN npm install -g gatsby

RUN [ "npm", "run", "build" ]


FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /website/public .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
