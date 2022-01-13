# syntax docker/dockerfile:1

FROM node:16.6

RUN mkdir -p /app/data

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install

COPY . .

ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD

ENV DB_NAME $DB_NAME
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD

EXPOSE 6080

CMD [ "node", "./app//src/index.js" ]
