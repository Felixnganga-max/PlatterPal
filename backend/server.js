import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from './routes/foodRoute.js'
import 'dotenv/config'
import userRouter from "./routes/userRouter.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoute.js"

const port = 4000 || process.env.PORT;


// App config
const app = express()


// middleware
app.use(express.json())
app.use(cors())

// app.use(cors(
//     {
//         origin: ["http://localhost:3000"],
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
        
//     }
// ))


// db connection 
connectDB();

//API ENDPOINT
app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


app.get("/", (req, res) =>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})



// mongodb+srv://standardwebtechnologies:<db_password>@cluster0.evei3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
