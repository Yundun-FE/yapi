FROM node:12-alpine as builder

RUN apk add --no-cache git python make openssl tar gcc

COPY . /home

RUN cd /home && mkdir /api && mv /home /api/vendors

RUN cd /api/vendors && \
    npm install --production --registry https://registry.npm.taobao.org

FROM node:12-alpine

ENV TZ="Asia/Shanghai" HOME="/"

WORKDIR ${HOME}

COPY --from=builder /api/vendors /api/vendors

COPY config.json /api/

EXPOSE 3000

CMD ["node", "/api/vendors/server/app.js"]