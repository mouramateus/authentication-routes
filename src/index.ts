import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { AppDataSource } from "./config/ormconfig";
import router from "./routes";

const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

AppDataSource.initialize()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

app.listen(3000, () => console.log("Servidor em execução na porta 3000"));
