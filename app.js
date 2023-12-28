
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const helper = require('./utils/helper');
const jwt = require('jsonwebtoken');
app.use(fileupload());
app.use(express.json());


mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.dbName}`);
const permitRouter = require('./route/permit');
const roleRouter = require('./route/role');
const userRouter = require('./route/user');
const catRouter = require('./route/category');
const subCatRouter = require('./route/subcat');
const childCatRouter = require('./route/childcat');
const tagRouter = require('./route/tag');
const deliRouter = require('./route/delivery');
const warrantyRouter = require('./route/warranty');
const productRouter = require('./route/product');
const orderRouter = require('./route/order');
const { validateToken, hasAnyRole, hasAnyPermit, validateRole } = require('./utils/validator');
// const bodyParser = require('body-parser');
app.use('/permits', permitRouter);
app.use('/role', validateToken(), validateRole("Owner"), roleRouter);
app.use('/user', userRouter);
app.use('/cats', catRouter);
app.use('/subcat', subCatRouter);
app.use('/childcat', childCatRouter);
app.use('/tags', tagRouter);
app.use('/delivery', deliRouter);
app.use('/warranty', warrantyRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);


// require('body-parser');
// app.use(bodyParser);

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({
    con: false,
    err: err.message
  })
});

const defaultData = async () => {
  let migrator = require('./migrations/migrator');
  // await migrator.migrate();
  // await migrator.backup();
  // await migrator.rpMigrate();
  // await migrator.addOwnerRole();
}
// defaultData();
// io.on('connection',socket=>{
//   socket.on('test',data=>{
//     console.log("Client sent msg",data);
//   });
//   socket.emit('success',{"greet":"Hello"})
// })
io.of('/chat').use(async (socket, next) => {
  token = socket.handshake.query.token;
  if (token) {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      let user = await helper.get(decoded._id);
      if (user) {
        socket.userData = user;
        next();
      } else {
        next(new Error("Tokenization Error"));
      }
    } else {
      next(new Error("Tokenization Error"));
    }
  } else {
    next(new Error("Tokenization Error"))
  }
}).on('connection', socket => {
  require('./utils/chat').initialize(io,socket);
})

server.listen(process.env.PORT, console.log(`Server is running at http://localhost:${process.env.PORT}`));