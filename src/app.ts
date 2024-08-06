import express from "express"
import cors from "cors"
import { authRouter } from "./routes/auth"
import { userRouter } from "./routes/users"
import { eventRouter } from "./routes/event"
import { registrationsRtouer } from "./routes/registrations"
import { adminRouter } from "./routes/admin"
const app = express()

app.use("/*",cors())

app.use("/api/auth",authRouter)
app.use("/api/users", userRouter)
app.use("/api/event", eventRouter)
app.use("/api/registrations", registrationsRtouer)

app.use("/api/admin",adminRouter)

app.listen(3000)