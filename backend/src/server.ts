import { app } from "./app";
import { sequelize } from "./config/database";
import { env } from "./config/env";

import { defineAssociations } from "./models/associations";

// Importamos los modelos para que Sequelize los registre.
import "./modules/bicycles/bicycle.model";
import "./modules/brands/brand.model";

async function startServer() {
  try {

    await defineAssociations();  

    await sequelize.authenticate();

    console.log("Connection with MySQL established.");

    // await sequelize.sync();

    await sequelize.sync({ force: true }).then (() => {
      console.log("Synchronized models.");
    });


    app.listen(env.PORT, () => {
      console.log(
        `Server running at http://localhost:${env.PORT}`
      );
    });

  } catch (error) {

    console.error(
      "The application could not be started:",
      error
    );

    process.exit(1);
  }
}

startServer();