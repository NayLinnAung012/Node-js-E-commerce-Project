
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.dbName}`);
const permitRouter = require('./route/permit');
const roleRouter = require('./route/role');
const { insertMany } = require('./models/permit');
// const bodyParser = require('body-parser');
app.use('/permits',permitRouter);
app.use('/role', roleRouter);


// require('body-parser');
// app.use(bodyParser);

app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).json({
        con:false,
        err:err.message
    })
  });

  const defaultData = async()=>{
    let migrator = require('./migrations/migrator');
    // await migrator.migrate();
    await migrator.backup();
  }
  defaultData();

app.listen(process.env.PORT,console.log(`Server is running at http://localhost:${process.env.PORT}`));