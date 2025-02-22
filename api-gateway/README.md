# API Gateway

Este projeto é um **API Gateway** desenvolvido com **NestJS**. Ele atua como ponto central para roteamento de requisições entre os serviços **auth-service** e **data-service**, utilizando balanceamento de carga (Round-Robin) e integração com **Axios** para redirecionamento.

## 🛠️ Tecnologias Utilizadas

- **NestJS 11** - Framework para Node.js
- **Axios** - Cliente HTTP para redirecionamento de requisições
- **Fastify** - Plataforma de execução para maior desempenho
- **Swagger** - Documentação de API
- **TypeScript** - Tipagem estática
- **Jest** - Testes unitários e de integração
<!-- - **Docker** - Contêineres para ambiente de desenvolvimento -->

## 📁 Estrutura do Projeto

```
api-gateway/
├─ src/
│   ├─ config/
│   ├─ modules/
│   │    ├─ gateway/
│   │    ├─ mapper/
│   │    ├─ middlewares/
│   │    ├─ swagger/
│   │    └─ exceptions/
│   └─ main.ts
├─ test/
└─ package.json
```

## 🚀 Executando a Aplicação

### Pré-requisitos

- **Node.js** >= 18
- **Docker** (opcional, para execução em contêineres)

### Ambiente Local

- #### Instalar as dependências:

```bash
npm install
```

- #### Executar a aplicação em modo de desenvolvimento:

```bash
yarn dev
```

```bash
npm run start:dev
```

- #### Acessar a documentação do Swagger:

```
http://localhost:3003/api-docs
```

<!-- ### Com Docker

1. Construir a imagem Docker:

```bash
docker build -t api-gateway .
```

####  Executar o contêiner:

```bash
docker run -p 3004:3004 api-gateway
``` -->

## 🔀 Roteamento e Serviços

A API Gateway roteia requisições para serviços internos:

| Rota Gateway     | Serviço de Destino                    | Método |
| ---------------- | ------------------------------------- | ------ |
| `/user/register` | `http://localhost:3001/auth/register` | POST   |
| `/user/login`    | `http://localhost:3001/auth/login`    | POST   |
| `/data/info`     | `http://localhost:3002/data/info`     | GET    |

## 📊 Balanceamento de Carga

O Gateway implementa o balanceamento de carga utilizando a técnica **Round-Robin** para distribuir requisições entre múltiplas instâncias dos serviços.

## 📜 Scripts Disponíveis

- `yarn dev` - Inicia a aplicação em modo de produção
- `npm run start:dev` - Inicia a aplicação em modo de desenvolvimento
- `npm run build` - Compila o código TypeScript
- `npm run lint` - Executa o ESLint para análise estática
  <!-- - `npm run test` - Executa os testes unitários com Jest -->
  <!-- - `npm run test:e2e` - Executa testes de integração (end-to-end) -->

<!-- ## ✅ Testes

Para executar os testes unitários:

```bash
yarn dev
```

```bash
npm run test
```

Para gerar o relatório de cobertura de testes:

```bash
npm run test:cov
``` -->

## 📌 Observações

- Certifique-se de que os serviços **auth-service** e **data-service** estão rodando nas portas corretas.
- O balanceamento de carga funciona automaticamente ao adicionar novas instâncias dos serviços no código.
- O Swagger está disponível em `/api-docs` para facilitar a exploração da API.

<!-- ## 📣 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. Crie um fork do projeto
2. Crie uma branch (`feature/minha-feature`)
3. Envie um Pull Request -->

<!-- ---

**Autor:** Seu Nome

**Licença:** UNLICENSED -->
