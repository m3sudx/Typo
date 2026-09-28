import {Pool} from 'pg'

const pool=new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

pool.connect((err,client,release)=>{
    if(err){
        return console.log("database connection fails",err.message)
    }
console.log("database is connected")
release()
})

export default pool;