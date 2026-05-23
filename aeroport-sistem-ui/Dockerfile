# Estágio 1: Build da interface React/Vite com Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx para expor a interface web
FROM nginx:alpine
# Copia os arquivos gerados (HTML/CSS/JS) para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]