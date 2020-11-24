const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const db = require("./src/helper/db");

const app = express();
const server = require('http').createServer(app);
// console.log('creacr'. server)
const io = require('socket.io')(server);
// const db = require("./src/helper/db");
const AuthRoute = require("./src/routes/Auth");
const UserRoute = require("./src/routes/User");
const TransactionRoute = require("./src/routes/Transaction");
const TopupRoute = require("./src/routes/Topup");

app.use(cors()); // WAJIB DI ISI

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static("images"));

app.get("/", (req, res) => res.send("<h2> Success </h2>"));

app.use('*',cors())

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/transaction", TransactionRoute);
app.use("/api/v1/topup", TopupRoute);

// db.query(`SELECT balance FROM user WHERE id=11`, (err, res) => {
//   console.log(res[0].balance)
//   // socket.broadcast.to(userId).emit('get-data', chat)
// });

io.on('connection', (socket)=> {
  // const userId = socket.handshake.query.userId
  console.log('user connect')
  // socket.join(userId)
  socket.on('initial-user', (id) => {
    if (id) {
      socket.join(id)
      console.log('datany adalah ini: ',id)
      db.query(`SELECT balance FROM user WHERE id=${id}`, (err, res) => {
        io.to(id).emit('get-data', res[0].balance)
      });
    }
  })
      // disconnect 
    socket.on('disconnect',() => {
        console.log("Users disconnect to socket or server");
    })

  })


server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});



