# api-quiz
A API de criação de quiz é uma solução completa para desenvolvedores que desejam criar jogos educativos, avaliações e testes para seus usuários. Com a API, é possível criar, gerenciar e disponibilizar quizzes personalizados com facilidade.

A API foi desenvolvida utilizando Node.js com TypeScript e Express, além de contar com recursos como bcrypt para criptografia de senhas, jwt para autenticação de usuários, Multer para upload de imagens e MongoDB com Mongoose para persistência de dados.

Com essa API, é possível criar uma experiência de usuário atraente e personalizada, permitindo a criação de avaliações e testes para diferentes áreas de conhecimento.

## Endpoints
### POST /login
O endpoint /login é responsável por autenticar um usuário no sistema. Para isso, o endpoint recebe o email e a senha do usuário na requisição POST, e salva um token jwt para autenticação em outros endpoints.
#### Parametros
email: email do usuário cadastrada no sistema

password: senha do usuário cadastrada no sistema, com o email
#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai autenticar o usuário no sistema

Exemplo de resposta:
```
{
    "login": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTBmMGIyZDJjZjc1Y2I4NjE5MDM2YiIsImVtYWlsIjoiYXBpQGdtYWlsLmNvbSIsImlhdCI6MTY3OTAxODAzOSwiZXhwIjoxNjc5MDI1MjM5fQ.eF-CVwUCTPqMSAQiLf3GEcEUCCj55JBTibk1Fy1dveA"
}
```
##### Password is not correct ! 404
Caso essa resposta aconteça, significa que a autenticação não foi concluida devido a senha estar incorreta

Exemplo de resposta:
```
{
    "error": "password is not correct"
}
```
##### User does not exists ! 400
Caso essa resposta aconteça, siginifica que não existe usuário no sistema com o email passado

Exemplo de resposta: 
```
{
    "error": "user does not exists"
}
```
##### Missing data ! 400
Caso essa resposta aconteça, significa que não foi passado os parametros para a realização do login

Exemplo de respota:
```
{
    "error": "missing data"
}
```


### POST /create
O endpoint /create é responsável por criar um novo usuário no banco de dados do seu sistema. Para utilizar este endpoint, é necessário enviar uma requisição HTTP com os dados do novo usuário que se deseja criar, utilizando um método POST. E salva um token jwt para autenticação em outros endpoints.
#### Parametros
email: email do novo usuário

password: senha do usuário do novo usuário

user: nome do usuário
#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai criar uma nova instancia de usuário no banco de dados

Exemplo de resposta:
```
{
    "newUser": {
        "user": "testApi",
        "email": "testandoapi@gmail.com",
        "password": "$2b$10$e9is.S1/A0cyt17qYp2hE.AZwlE4.1ULzdA1yff/4UeLsckGC9Xke",
        "data_bases": [],
        "favorites": [],
        "_id": "64150962dcda80947ba45cb9",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTUwOTYyZGNkYTgwOTQ3YmE0NWNiOSIsImVtYWlsIjoidGVzdGFuZG9hcGlAZ21haWwuY29tIiwiaWF0IjoxNjc5MTAwMjU4LCJleHAiOjE2NzkxMDc0NTh9.mzdmbLYU1ByvHwMLviA5h8aAZvngN_9yWn0svy6ijXw"
}
```
##### Email or user already exists ! 400
Caso essa resposta aconteça, significa que a criação do usuário não foi concluida devido a ja existir algum usuário com o mesmo email ou user

Exemplo de resposta:
```
{
    "error": "email or user already exists"
}
```

##### Missing data ! 400
Caso essa resposta aconteça, significa que não foi passado os parametros

Exemplo de respota:
```
{
    "error": "missing data"
}
```



### GET /users
O endpoint /users é responsável por listar todos os usuários registrados no banco de dados do seu sistema, exibindo apenas o ID do usuário e seu nome de usuário (username). Para utilizar este endpoint, é necessário enviar uma requisição HTTP utilizando o método GET.
#### Parametros
Não tem
#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai listar todos usuários no do sistema

Exemplo de resposta:
```
{
    "users": [
        {
            "_id": "64050ffaa408cbee4b4684d3",
            "user": "test"
        },
        {
            "_id": "640fa315419613006b8010a6",
            "user": "rafael"
        }
    ]
}
```

### GET /user-profile
O endpoint /user-profile é responsável por exibir as informações do usuário que está atualmente logado no sistema, utilizando um token JWT (JSON Web Token) para autenticação e autorização. Para utilizar este endpoint, é necessário enviar uma requisição HTTP utilizando o método GET, juntamente com o token JWT do usuário logado no cabeçalho da requisição.
#### Parametros
Authorization: tipo Bearer
```
Authorization: Bearer token
```
#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai retorna as informações do usuário que esta conectado

Exemplo de resposta:
```
{
    "user": {
        "_id": "6410f0b2d2cf75cb8619036b",
        "user": "api",
        "email": "api@gmail.com",
        "password": "$2b$10$YUBm.osqhCTzzjRNdSuh9OZgNk61ltznDY8Rmj7FNvJw7lQgSOjRy",
        "data_bases": [
            "6410f0d6d2cf75cb8619036e"
        ],
        "__v": 11,
        "favorites": [
            "63fe89df4fcec301da5c3fbd"
        ]
    }
}
```


### GET /user-:id/all-quizzes
O endpoint /user-:id/all-quizzes é responsável por listar todos os quizzes realizados por um usuário específico, identificado pelo seu ID. Para utilizar este endpoint, é necessário enviar uma requisição HTTP utilizando o método GET, especificando o ID do usuário na URL.
#### Parametros
id: id do usuário

#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai mostrar todo os quizzes feitos pelo usuário

Exemplo de resposta:
```
{
    "quizzes": [
        "6410f0d6d2cf75cb8619036e"
    ]
}
```
##### Id is not valid! 400
Caso essa resposta aconteça, significa que a autenticação não foi concluida devido ao id que foi passado no parametro não é um id dos tipos do mongoose

Exemplo de resposta:
```
{
    "error": "id is not valid"
}
```
##### User does not exists ! 400
Caso essa resposta aconteça, siginifica que não existe usuário no sistema com o id passado

Exemplo de resposta: 
```
{
    "error": "user does not exists"
}
```
##### Missing data ! 400
Caso essa resposta aconteça, significa que não foi passado os parametros

Exemplo de respota:
```
{
    "error": "missing data"
}
```

### PUT /change-user/:newPassword?/:newEmail?
O endpoint PUT /change-user/:newPassword?/:newEmail? é responsável por permitir que um usuário logado altere sua senha e/ou e-mail registrado no sistema.
Para utilizar este endpoint, é necessário enviar uma requisição HTTP utilizando o método PUT e passar os parâmetros opcionais para a nova senha e/ou novo e-mail na URL. Caso o usuário não queira alterar algum dos campos, é necessário passar "false" no respectivo parâmetro.

Exemplo:

Alterar apenas o email
```
/change-user/false/novoEmail
```
Alterar apenas a senha 
```
/change-user/novaSenha/false
```
Alterar senha e email
```
/change-user/novaSenha/novoEmail
```
#### Parametros
newPassword: nova senha do usuário que será atualizada

newEmail: novo email do usuário que será atualizado

#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai alterar a senha e/ou email do usuário

Exemplo de resposta:
```
{
    "changed": true,
    "newEmail": "novoEmail@gmail.com"
}
```
```
{
    "changed": true,
    "newPassword": "$2b$10$pFvM9h4IuAhvSmwDzLMp1e9.0BLjaxy/707eCzh2o6EXGmILCwsVq"
}
```
##### Email already exist! 400
Caso essa resposta aconteça, significa que a autenticação não foi concluida devido já existir um usuário com o mesmo email

Exemplo de resposta:
```
{
    "error": "email already exist"
}
```
##### Missing data ! 400
Caso essa resposta aconteça, significa que não foi passado os parametros

Exemplo de respota:
```
{
    "error": "missing data"
}
```


### PUT /user/save/favorite/:idQuiz
O endpoint PUT /user/save/favorite/:idQuiz é responsável por permitir que um usuário salve um quiz específico em sua lista de favoritos. Este endpoint requer autenticação com um token JWT, que contém informações sobre o usuário conectado ao sistema.
Para utilizar este endpoint, é necessário enviar uma requisição HTTP utilizando o método PUT e passar o ID do quiz que deve ser salvo na URL.

#### Parametros

Authorization: tipo Bearer
```
Authorization: Bearer token
```

idQuiz: id do quiz que será salvo no usuário

#### Respostas 
##### OK ! 200
Caso essa resposta aconteça, vai alterar salvar o quiz no favoritos do usuário

Exemplo de resposta:
```
{
    "idQuiz": "64111855a3a47142e0a8f190",
    "favorites": [
        "64111855a3a47142e0a8f190"
    ]
}
```

##### Id is not valid! 400
Caso essa resposta aconteça, significa que a autenticação não foi concluida devido ao id que foi passado no parametro não é um id dos tipos do mongoose

Exemplo de resposta:
```
{
    "error": "id is not valid"
}
```

##### Quiz does not exists ! 400
Caso essa resposta aconteça, siginifica que não existe quiz no sistema com o id passado

Exemplo de resposta: 
```
{
    "error": "quiz does not exists"
}
```


