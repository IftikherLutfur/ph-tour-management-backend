// import express, {Request, Response } from "express"
// import { router } from "./app/routes";
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/NotFound";
// import cookieParser from "cookie-parser";
// import passport from "passport";
// import expressSeeeion  from "express-session";
// import "./app/config/passport"

// const app = express();

// app.use(passport.initialize())
// app.use(passport.session())

// app.use(expressSeeeion({
//     secret: "Your Secret",
//     resave: true,
//     saveUninitialized: false
// }))
// app.use(cookieParser())
// app.use(express.json())
// app.use("/api/v1", router)

// app.get("/", (req: Request, res: Response) =>{
//     res.status(200).json({
//         message: "Hello this is the PH tour management backend"
//     })
// });

// // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
// app.use(globalErrorHandler)

// app.use(notFound)

// export default app;

import express, { Request, Response } from "express";
import { router } from "./app/routes";
import notFound from "./app/middlewares/NotFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session"; // ✅ fixed typo
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();

app.use(session({
  secret: "Your Secret",
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // ✅ placed after session middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello this is the PH tour management backend"
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);
app.use(notFound);

export default app;
