const express = require("express");
const conn = require("./config/conn");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

conn.once("open", () => app.listen(PORT, () => console.log(`SERVER RUNNING ON: http://localhost:${PORT}`)));
