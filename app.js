const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const port = 3000;
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const errController = require('./controllers/errorController');
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.all('*', function(req , res , next) {
  

   
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(errController);
module.exports = app;
