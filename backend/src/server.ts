import { app } from "./app";
import { sequelize } from "./config/database";
import { env } from "./config/env";

// Importamos los modelos para que Sequelize los registre.
import "./modules/bicycles/bicycle.model";
import "./modules/brands/brand.model";

async function startServer() {
  try {

    await sequelize.authenticate();

    console.log("Conexión con MySQL establecida.");

    // await sequelize.sync();

    await sequelize.sync({ force: true }).then (() => {
      console.log("Modelos sincronizados.");
    });


    app.listen(env.PORT, () => {
      console.log(
        `Servidor funcionando en http://localhost:${env.PORT}`
      );
    });

  } catch (error) {

    console.error(
      "No se pudo iniciar la aplicación:",
      error
    );

    process.exit(1);
  }
}

startServer();