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


