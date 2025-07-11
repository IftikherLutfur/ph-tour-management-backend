/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from "express"
import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

// const app = express()
let server: Server;
const port = process.env.PORT || 5000;


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("MongoDB Connect")
        
        server = app.listen(envVars.PORT, () => {
            console.log(`App listening on ${envVars.PORT} `)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()

// process.on("SIGINT", ()=>{
//     console.log("SIGINT signal Exceptation detected, Server shutting down.");
//     if(server){
//         server.close(()=>{
//             process.exit(1)
//         });
//     }
//     process.exit(1)
// })

// process.on("unHandleRejection", (err)=>{
//     console.log("Unhandle Rejection detected, Server shutting down.", err);
//     if(server){
//         server.close(()=>{
//             process.exit(1)
//         });
//     }
//     process.exit(1)
// })

// process.on("uncaughtExceptation", (err)=>{
//     console.log("Unhandle Exceptation detected, Server shutting down.", err);
//     if(server){
//         server.close(()=>{
//             process.exit(1)
//         });
//     }
//     process.exit(1)
// })

// throw new Error("Failed to handle local servver")

// Promise.reject(new Error("I forgot to catch this promise "))