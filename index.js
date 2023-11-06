
const express = require('express')
const cors = require('cors')
const UserRoute = require("./src/routers/UserRoute")

const app = express()

// app.use(cors)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 // Beberapa browser membutuhkan ini untuk mengizinkan metode HTTP lain selain GET/POST
// }));

// app.use(express.json())
// app.use("/", UserRoute);

app.get("/", (res, req) => {
  res.set("Welcome")
})


app.listen(3000, () => console.log("running server"))

