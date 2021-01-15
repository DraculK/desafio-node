const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //Lista todos os repositórios criados
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  //Campos que a rota deve receber
  const { title, url, techs } = request.body;
  //Forma na qual o repositório vai ser armazenado
  const repository = { id:uuid(), title, url, techs, likes:0. };
  //Armazena o último repositório criado no array de repositórios
  repositories.push(repository);
  //Retorna o último repositório criado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //Recebe o id do projeto que queremos alterar
  const { id } = request.params;
  //Recebe os parâmetros que podemos alterar
  const { title, url, techs } = request.body;
  //Busca o id do repositório para que possamos alterar os dados
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  //Caso não ache o id de algum repositório retorna o erro abaixo
  if (repositoryIndex < 0 ){
    return response.status(400).json({ erro: "Repository not found." })
  }
  //Caso ache o id de algum repositório, nós criamos um novo projeto atualizando os dados escolhidos
  const repository ={
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }
  //Atualiza o projeto pelo id que encontramos
  repositories[repositoryIndex] = repository;
  //Retorna o repositório atualizado
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  //Mesma ideia do update
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
    return response.status(400).json({ erro: "Repository not found." });
  }else{
    //Remove o repositório pelo o índice
    repositories.splice(repositoryIndex,1);
    //Retorna o status 204, caso o repositório seja deletado com sucesso
    return response.status(204).send();
  }
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex<0){
    return response.status(400).json({ erro: "Repository not found."})
  }else{
    repositories[repositoryIndex].likes += 1;
    return response.json( repositories[repositoryIndex] );
  }
});

module.exports = app;
