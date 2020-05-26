#MYSQL#
FROM mysql:5.7 as database
ENV MYSQL_DATABASE=vistolog \
    MYSQL_ROOT_PASSWORD=root
COPY ./vistolog_dump.sql /docker-entrypoint-initdb.d/

#NODEJS#
FROM alpine:3.9 as api
EXPOSE 3000
RUN apk add nodejs
RUN apk add npm
WORKDIR /app
