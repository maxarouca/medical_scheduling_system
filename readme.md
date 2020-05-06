# API REST NODE POSTGRESS

## TECNOLOGIAS

- Node
- Nodemon
- Express
- Sucrase
- Postgres
- Docker
- Sequelize
- Bcryptjs
- JWT
- YUP

## RODANDO O PROJETO

1 - Clonar esse projeto em sua máquina.
2 - Instalar as dependências por meio de `yarn` ou `npm install`
3 - Subir a imagem do docker com a database usando o comando:
`docker run --name database -e POSTGRES_PASSWORD=postgresdb -p 5432:5432 -d postgres`
4 - Rodar o projeto usando `yarn dev` ou `npm run dev`
5 - `yarn sequelize migration:create --name=create-sales` para criar a migration
6 - `yarn sequelize db:migrate` para fazer a migration no banco

### COMANDOS BÁSICOS DO DOCKER

- `docker ps` - Lista todos os container ativos
- `docker ps -a` - Lista todos os containers existentes, mesmo não ativos
- `docker rm [container]` - Remove o container
- `docker logs [container]` - Verificar o log do container
