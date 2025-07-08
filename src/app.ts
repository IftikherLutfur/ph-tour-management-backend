import express, { Request, Response } from "express"
const app = express();

app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Hello this is the PH tour management backend"
    })
});

export default app;