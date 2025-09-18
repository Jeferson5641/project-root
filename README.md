# Project Root

Este projeto consiste em um sistema distribuído, desenvolvido com arquitetura de microsserviços, projetado para atender funcionalidades relacionadas a autenticação e gestão de dados de usuários. O projeto utiliza tecnologias modernas para garantir escalabilidade, segurança e eficiência no desenvolvimento.

## Estrutura do Projeto

O sistema é dividido em dois serviços principais:

### Auth-Services

O serviço de autenticação (`auth-services`) é responsável por gerenciar o cadastro, login e validação de usuários. Ele garante que as credenciais dos usuários sejam processadas de forma segura, fornecendo funcionalidades essenciais para o controle de acesso.

#### **Principais Funcionalidades**

- Cadastro de novos usuários.
- Login de usuários com validação de credenciais.
- Geração e verificação de tokens JWT para autenticação.
- Segurança de senhas com hashing (usando `bcrypt`).

#### **Principais Tecnologias Utilizadas**

| **Tecnologia**           | **Descrição**                                                                 |
| ------------------------ | ----------------------------------------------------------------------------- |
| **NestJS**               | Framework para construção de APIs escaláveis e modulares com TypeScript.      |
| **TypeScript**           | Superset do JavaScript com tipagem estática, garantindo maior confiabilidade. |
| **JWT (JSON Web Token)** | Utilizado para geração e validação de tokens de autenticação.                 |
| **Bcrypt**               | Biblioteca para hashing seguro de senhas.                                     |
| **Axios**                | Biblioteca HTTP para comunicação entre serviços.                              |
| **TypeORM**              | ORM utilizado para a interação com o banco de dados relacional (MySQL).       |
| **MySQL2**               | Driver para integração com o banco de dados MySQL.                            |

#### **Em Desenvolvimento**

- Integração com um API Gateway para unificação dos microsserviços.
- Suporte a Docker para orquestração de contêineres.

---

### Data-Service

O serviço de dados (`data-service`) é o núcleo de gestão de informações no sistema, focado no armazenamento e manipulação de dados de usuários e informações adicionais.

#### **Principais Funcionalidades**

- Armazenamento e gerenciamento de dados de usuários.
- Validação e formatação de dados antes da persistência no banco de dados.
- Suporte para múltiplos bancos de dados relacionais (MySQL e PostgreSQL).

#### **Principais Tecnologias Utilizadas**

| **Tecnologia** | **Descrição**                                                                          |
| -------------- | -------------------------------------------------------------------------------------- |
| **NestJS**     | Framework para construção de APIs escaláveis e modulares com TypeScript.               |
| **TypeScript** | Superset do JavaScript com tipagem estática, garantindo maior confiabilidade.          |
| **TypeORM**    | ORM utilizado para a interação com bancos de dados relacionais.                        |
| **MySQL2**     | Driver para integração com o banco de dados MySQL.                                     |
| **RxJS**       | Biblioteca para programação reativa, usada em operações assíncronas e fluxos de dados. |
| **Bcrypt**     | Utilizado para segurança adicional em algumas operações de dados.                      |

<!--#### **Em Desenvolvimento**

- Expansão de suporte a novos bancos de dados, caso necessário.
- Integração com serviços externos para sincronização de dados.
-->
---

## Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional para futura orquestração)

### Passos:

1. Clone o repositório:

   ```bash
   git clone https://github.com/Jeferson5641/project-root.git
   ```

2. Instale as dependências em cada serviço:

   ```bash
   cd auth-services
   yarn install
   cd ../data-service
   yarn install
   ```

3. Execute os serviços em modo de desenvolvimento:

   # No diretório auth-services

   ```bash
   yarn dev
   ```

   # No diretório data-service

   ```bash
   yarn dev
   ```

---

## Estrutura do Repositório

```plaintext
project-root/
├── auth-services/ # Serviço de autenticação
│ ├── src/
│ ├── package.json
│ └── README.md
├── data-service/ # Serviço de dados
│ ├── src/
│ ├── package.json
│ └── README.md
└── README.md # Descrição geral do projeto
```
