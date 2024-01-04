
const express = require('express')
const cors = require('cors')
const router = require("./src/routers/routers")

const app = express()

// app.use(cors)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 // Beberapa browser membutuhkan ini untuk mengizinkan metode HTTP lain selain GET/POST
// }));

app.use(express.json())
app.use("/", router);




app.listen(3000, () => console.log("running server"))

