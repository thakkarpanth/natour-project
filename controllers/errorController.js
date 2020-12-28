const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = "Invalid " + err.path ;
    return new AppError(message ,400);
}
const handleDuplicateFieldsDB = err => {

    //console.log(err.errmsg.match(/(["'])(\\?.)*?\1/));
    const message = "Duplicate Field Value: " + 
    err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0] + ". Please enter another value";

    return new AppError(message , 400);
}
const handleValidationErorrDB = err => {
    message = "Invalid input data. ";
    const errors =Object.values(err.errors).map(el => el.message);

    
    return new AppError(message + errors.join('. '), 400) ;
}
const sendErrorDev = (err , res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message:err.message,
        stack: err.stack,

        });
}

const sendErrorProd = (err , res) => {

    if(err.isOperational)
    {
        res.status(err.statusCode).json({
            status: err.status,
            message:err.message,
        
        });
    }
    // Programming or some unknown error
    else
    {
        console.error('Error ' , err);
        
        
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        })
    }
}

const errController = (err , req , res , next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
     
    console.log("Environmenr is "  + process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res); 
    }
    else if(process.env.NODE_ENV === 'production'){

        let error = { ...err } ;
        if(err.name === 'CastError')
        {
            console.log("Pika");
            error = handleCastErrorDB(err);
        }

        else if(err.code === 11000 )
        {
            error = handleDuplicateFieldsDB(err);
        }

        else if(err.name === 'ValidationError')
        {
            error = handleValidationErorrDB(err);
        }
        
        sendErrorProd(error, res); 
        
    }
}

module.exports = errController;