const express = require("express");
const path = require("path");

const app = express();

// Sirve los archivos estáticos desde Angular
app.use(express.static(path.join(__dirname, "dist/WorkSync")));

// Redirige todas las rutas al index.html
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist/WorkSync/browser/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de Angular corriendo en el puerto ${PORT}`);
});
