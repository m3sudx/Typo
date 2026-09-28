function errorHandler(err,req,res,next){
    const statusCode=err.statusCode||500
    const message=err.isoprational?err.message:"internal server error"

    res.status(statusCode
    ).json({
        success:false,
        message:message
    })
}

export default errorHandler