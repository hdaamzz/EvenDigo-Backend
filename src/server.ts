
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './configs/db';
import authRouter from "./routes/user/auth.routes";
const PORT: string | undefined = process.env.PORT;



const app=express();
const corsOptions={ 
    origin: process.env.CLIENT_SERVER, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  
  };

//Middlewares
app.use(cors(corsOptions));
app.use(morgan('dev'));;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());

//Database Connection
connectDB();


//Routes
app.use('/user/auth',authRouter);




if(!PORT) {
    throw new Error('PORT is not defined in env')
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
