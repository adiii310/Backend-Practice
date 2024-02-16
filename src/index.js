import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", () => {
      console.log("error in  listening to port ", error);
    });
    app.listen(port, () => {
      console.log(`Server is running at  port : ${process.env.PORT}`);
    });
    app.get("/",(req,res)=>{
        res.send(`This is port ${port}`)
    })
  })
  .catch((error) => {
    console.log("Mongodb Connection Failed ", error);
  });

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
