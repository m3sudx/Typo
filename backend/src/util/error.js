class AppErr extends Error {
    constructor(statusCode,message){
        super(message),
        this.statusCode=statusCode
        this.isoprational=true
    }
}

export default AppErr