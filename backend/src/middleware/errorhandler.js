function errorHandler(err,req,res,next){
    console.error("ERROR:", err);
    const statusCode=err.statusCode||500
    const message=err.isoprational?err.message:"internal server error"

    res.status(statusCode
    ).json({
        success:false,
        message:message
    })
}

export default errorHandler