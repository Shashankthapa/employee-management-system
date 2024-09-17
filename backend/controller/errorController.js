const errorController = (error, req, res, next) => {
  // console.log("HI from errorcontroller")
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    message: error.message,
    errorIsOperational: error.isOperational,
    statusCode: error.statusCode,
  });
};

export default errorController;
