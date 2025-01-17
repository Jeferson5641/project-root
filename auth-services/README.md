# Auth-Service

## Descrição

O **Auth-Service** é responsável pela autenticação e gerenciamento de usuários. Ele inclui funcionalidades de registro, login e validação de usuários. Este serviço também se comunica com o **Data-Service** para persistir os dados de registro no banco de dados.

## Tecnologias Utilizadas na API `auth-services`

| **Tecnologia/Dependência** | **Descrição**                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **NestJS**                 | Framework para construção de aplicações escaláveis com suporte a TypeScript.                          |
| **TypeScript**             | Superset do JavaScript com tipagem estática para maior segurança no desenvolvimento.                  |
| **Axios**                  | Biblioteca para realizar requisições HTTP, facilitando a integração entre microsserviços.             |
| **bcrypt**                 | Biblioteca para hashing de senhas, usada para armazenamento seguro de credenciais.                    |
| **Class-Transformer**      | Biblioteca para transformar e serializar objetos, útil para manipulação de DTOs.                      |
| **Class-Validator**        | Biblioteca para validação de dados de entrada, garantindo integridade e segurança.                    |
| **TypeORM**                | ORM usado para interação com bancos de dados relacionais, como MySQL.                                 |
| **MySQL2**                 | Driver para conexão com bancos de dados MySQL.                                                        |
| **JWT (Json Web Token)**   | Implementação de autenticação baseada em tokens para proteger rotas e autenticar usuários.            |
| **Passport**               | Middleware de autenticação flexível, usado para implementar estratégias de login.                     |
| **Passport-JWT**           | Estratégia de autenticação para validar tokens JWT no backend.                                        |
| **Passport-Local**         | Estratégia de autenticação para login com nome de usuário e senha.                                    |
| **@nestjs/swagger**        | Biblioteca para documentação automática de APIs no formato OpenAPI/Swagger.                           |
| **Fastify**                | Alternativa ao Express.js, usado para maior desempenho no NestJS.                                     |
| **Fastify-Swagger**        | Extensão para integração do Swagger com o Fastify.                                                    |
| **Reflect-Metadata**       | Pacote usado internamente pelo TypeScript para manipulação de metadados.                              |
| **RxJS**                   | Biblioteca para programação reativa, usada principalmente para lidar com fluxos de dados assíncronos. |
| **Prettier**               | Ferramenta de formatação de código para manter padrões consistentes no projeto.                       |
| **ESLint**                 | Ferramenta de linting para identificar e corrigir problemas de código em TypeScript e JavaScript.     |
| **Nodemon**                | Utilitário que reinicia automaticamente o servidor em caso de alterações nos arquivos.                |
| **Jest**                   | Framework de testes utilizado para realizar testes unitários e de integração.                         |
| **Ts-Jest**                | Integração entre Jest e TypeScript para testes.                                                       |

---

## Estrutura de Pastas

```plaintext
auth-service/
├── src/
│   ├── common/
│   │   ├── dtos/
│   │   │   ├── create-user.dto.ts          # DTO para registro
│   │   │   ├── login-user.dto.ts           # DTO para login
│   │   └── mocks/
│   │       └── in-memory-db.service.ts     # Mock para testes locais
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts          # Controlador principal
│   │   │   ├── auth.service.ts             # Lógica de negócio
│   │   │   ├── auth.module.ts              # Módulo de autenticação
│   │   │   ├── jwt.strategy.ts             # Estratégia JWT
│   │   │   └── local.strategy.ts           # Estratégia Local para validação
│   │   └── exceptions/
│   │       ├── invalid-credentials.exception.ts
│   │       ├── user-not-found.exception.ts
│   │       └── user-registration-failed.exception.ts
│   ├── app.controller.ts                   # Controller principal
│   ├── app.module.ts                       # Módulo principal
│   ├── main.ts                             # Inicialização da aplicação
├── .env                                    # Variáveis de ambiente
├── package.json                            # Dependências e scripts
└── README.md                               # Documentação
```

---

---

## Endpoints

### **POST /auth/register**

Registra um novo usuário e envia os dados para o **Data-Service**.

- **Body**:

  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- **Resposta**:

  ```json
  {
    "message": "User registered successfully"
  }
  ```

### **POST /auth/login**

Autentica o usuário com base no email e senha.

- **Body**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Resposta**:

  ```json
  {
    "message": "Login successful"
  }
  ```

---

## Configurações Importantes

### **Variáveis de Ambiente (.env)**

```plaintext
DATA_SERVICE_URL=http://localhost:3002
PORT=3001

JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### **Scripts Disponíveis**

- **Instalar dependências**:

  ```bash
  npm install
  ```

- **Rodar localmente**:

  ```bash
  npm run dev
  ```

- **Build para produção**:

  ```bash
  npm run build
  ```

---

## Comunicação com o Data-Service

Durante o registro, o **Auth-Service** envia os dados do usuário para o endpoint `/users` do **Data-Service** usando uma requisição HTTP POST.

---
