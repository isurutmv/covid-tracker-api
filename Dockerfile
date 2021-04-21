ARG node_version=12.18.3
ARG npm_version=6.14.4

#NPM Build
FROM node:${node_version} as npm-builder

ARG build_env
ARG npm_version

RUN npm install pm2 -g
RUN mkdir -p /app/build
WORKDIR /app/build
COPY package*.json ./
RUN npm install npm@${npm_version} -g \
    && npm install \
    && npm audit fix 
COPY . .
RUN npm build 
EXPOSE 3000

CMD ["true"]
