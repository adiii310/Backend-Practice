// require ('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})
connectDB()














































/*
const app = express();

;(async () => {
    try{
        await mongoose.connect(`mongodb+srv://aditya:<password>@cluster0.nnxzcxj.mongodb.net/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error In app.on :"+ error);
            throw error
        })
        app.listen(process.env.PORT|| 8000,()=>{
            console.log("server is started on port " + process.env.PORT);
        })

    }catch(error){
        console.log("Error:" +  error);
        throw error
    }
})()
*/
