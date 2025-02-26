const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./config/swaggerConfig");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.use(express.json());
const useRoutes=require('./routes/userRoutes');
app.use("/users", useRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});