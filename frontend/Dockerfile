FROM node:16 AS build

WORKDIR /app

# Kopiowanie plików projektu
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine

# Kopiowanie zbudowanych plików do serwera NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Konfiguracja NGINX do obsługi React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
