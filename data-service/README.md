# Data-Service

## Descrição

O **Data-Service** é responsável por gerenciar e persistir os dados dos usuários no banco de dados MySQL. Ele recebe solicitações de outros microsserviços, como o **Auth-Service**, para criar registros no banco.

## Tecnologias Utilizadas na API `data-service`

| **Tecnologia/Dependência** | **Descrição**                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **NestJS**                 | Framework para construção de aplicações escaláveis com suporte a TypeScript.                          |
| **TypeScript**             | Superset do JavaScript com tipagem estática para maior segurança no desenvolvimento.                  |
| **TypeORM**                | ORM usado para interação com bancos de dados relacionais, como MySQL e PostgreSQL.                    |
| **MySQL2**                 | Driver para conexão com bancos de dados MySQL.                                                        |
| **PostgreSQL (pg)**        | Driver para conexão com bancos de dados PostgreSQL.                                                   |
| **RxJS**                   | Biblioteca para programação reativa, usada principalmente para lidar com fluxos de dados assíncronos. |
| **Class-Validator**        | Biblioteca para validação de dados de entrada, garantindo integridade e segurança.                    |
| **Reflect-Metadata**       | Pacote usado internamente pelo TypeScript para manipulação de metadados.                              |
| **Bcrypt**                 | Biblioteca para hashing de senhas, usada para armazenamento seguro de credenciais.                    |
| **Prettier**               | Ferramenta de formatação de código para manter padrões consistentes no projeto.                       |
| **ESLint**                 | Ferramenta de linting para identificar e corrigir problemas de código em TypeScript e JavaScript.     |
| **Nodemon**                | Utilitário que reinicia automaticamente o servidor em caso de alterações nos arquivos.                |
| **Jest**                   | Framework de testes utilizado para realizar testes unitários e de integração.                         |
| **Ts-Jest**                | Integração entre Jest e TypeScript para testes.                                                       |
| **Source Map Support**     | Ferramenta para mapear código transpilado de volta ao TypeScript original para facilitar a depuração. |

---

## Estrutura de Pastas

```plaintext
data-service/
├── src/
│   ├── common/
│   │   ├── dtos/
│   │   │   └── create-user.dto.ts          # DTO para criar usuários
│   │   └── entities/
│   │       └── user.entity.ts             # Entidade User para o banco
│   ├── config/
│   │   └── database.config.ts/
│   ├── modules/
│   │   └── users/
│   │       ├── users.controller.ts        # Controlador de usuários
│   │       ├── users.service.ts           # Lógica de negócio
│   │       └── users.module.ts            # Módulo de usuários
│   ├── app.module.ts                       # Módulo principal
│   └── main.ts                             # Inicialização da aplicação
├── .env                                    # Variáveis de ambiente
├── package.json                            # Dependências e scripts
└── README.md                               # Documentação
```

---

## Endpoints

### **POST /users**

Cria um novo usuário no banco de dados.

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
    "message": "User created successfully"
  }
  ```

---

## Configurações Importantes

### **Variáveis de Ambiente (.env)**

```plaintext
DB_HOST=localhost
DB_PORT=your_port
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=auth_db
```

### **Configuração do TypeORM (ormconfig.json)**

```json
{
  "type": "mysql",
  "host": "${DB_HOST}",
  "port": ${DB_PORT},
  "username": "${DB_USERNAME}",
  "password": "${DB_PASSWORD}",
  "database": "${DB_DATABASE}",
  "entities": [User],
  "synchronize": true // de forma alguma deve ser usado em Produção
}
```

---

## Scripts Disponíveis

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

- **Testes**:

  ```bash
  npm run test
  ```

---
