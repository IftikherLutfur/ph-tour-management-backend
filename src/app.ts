import express, {Request, Response } from "express"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/NotFound";


const app = express();

app.use(express.json())
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Hello this is the PH tour management backend"
    })
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler)

app.use(notFound)

export default app;