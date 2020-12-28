const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


process.on('uncaughtException' , err => {
  console.log(err.name , err.message);
  console.log('Uncaught Exception! Need to Shut Down');
  server.close(()=>  process.exit(1));

})

process.on('unhandledRejection' , err => {
  console.log(err.name , err.message);
  console.log('Unhandled Rejection! Need to Shut Down');
  server.close(()=>  process.exit(1));

})


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;

//connection with database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful.....');
  })

// creating schema for tour model

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


