import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync(); // Crea las tablas automáticamente
    console.log("Conexión a la base de datos establecida y sincronizada.");

    app.listen(3000, () => {
      console.log("Servidor corriendo en el puerto 3000");
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

startServer();

import "dotenv/config";
import express from "express";

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});
