# Usa a imagem do Node.js
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia todo o código da aplicação
COPY . .

# Compila o TypeScript
RUN yarn build

# Expõe a porta do Gateway
EXPOSE 3003

# Comando para iniciar a aplicação em produção
CMD ["yarn", "dev", "start:prod"]
