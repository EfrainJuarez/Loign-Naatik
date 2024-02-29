# Stage 1: Build the Angular application
FROM node:18-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

# Exponer el puerto para acceder a la aplicación desde fuera del contenedor
EXPOSE 80
