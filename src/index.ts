import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { AppDataSource } from "./config/ormconfig";
import router from "./routes";

// Configuração do app
const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
// Inicialização do banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado!");
  })
  .catch((error: any) => {
    console.error("Erro ao conectar ao banco:", error);
  });
// Configurar o servidor para escutar
app.listen(3000, () => {
  console.log("Servidor em execução na porta 3000");
});
