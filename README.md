# cedri-backend
Backend desenvolvido em javaScript (nodeJs) para o sistema do CEDRI (http://cedri.ipb.pt/). Projeto das disciplinas: Arquitetura de Sistemas de Informação e Desenvolvimento de Aplicações Multimédia.
## Pré requisitos:
  * Gerenciador de pacotes ***NPM***
  * ***NodeJs*** versão 10.15.3 ou superior (https://nodejs.org/en/download/)

## Como executar:
  * Depois de clonar o projeto executar o comando `npm install`, que intalará todas as dependencias (sequelize, mysql, etc)
  * Criar uma conta que enviará os emails do sistema (criação de conta, regate de senhas, etc)
  * Criar um arquivo de configuração (config.json) dentro da pasta ***app*** > ***config***
    * Esqueleto do arquivo **config.json** deve ser:
    * `{
        "development": {
          "port": "PORTA_BANCO_DE_DADOS",
          "database": "NOME_DATA_BASE",
          "username": "USER_NAME_DB",
          "password": "PASSWORD_DB",
          "host": "HOST_DB",
          "dialect": "mysql",
          "timezone": "+01:00",
          "API_SECRET": "SECRETKEY para JWT",
          "mailer": {
            "host": "smtp.gmail.com // ou outro servidor smtp escolhido",
            "username": "USERNAME PARA MAILER",
            "password": "PASSWORD PARA MAILER",
            "port": "587",
            "encryption": "tls"
          },
          "define": {
            "paranoid": true,
            "timestamps": true,
            "freezeTableName": true,
            "charset": "utf8mb4"
          }
        }
      }`
  * Executar `npm start`. Por padrão a porta do servidor será 5000, caso deseje outra porta pode executar `PORT=1234 node bin/www`
