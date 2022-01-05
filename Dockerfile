# syntax docker/dockerfile:1

FROM node:16.6

WORKDIR /app

RUN mkdir -p /app/data

COPY ["package.json", "./"]

RUN npm install

COPY /src .

ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD

ENV DB_NAME $DB_NAME
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD

CMD [ "node", "index.js" ]
