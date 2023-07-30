import { redisHost, apiHost, backendApiHost, publicApiHost, rate, serverPort } from "./config.js"
import compression from "compression"
import connectRedis from "connect-redis"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"
import { logger } from "express-winston"
import helmet from "helmet"
import { createProxyMiddleware } from "http-proxy-middleware"
import path, { dirname } from "path"
import { createClient } from "redis"
import responseTime from "response-time"
import serveStatic from "serve-static"
import { fileURLToPath } from "url"
import { format as _format, transports as _transports } from "winston"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
/** logging */
app.use(responseTime())
app.use(
  logger({
    transports: [new _transports.Console()],
    format: _format.json(),
    statusLevels: true,
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false
    },
  })
)
/** end logging */

// Initialize client.

app.use(cookieParser())

let redisClient = createClient({
  url: `redis://${redisHost}:6379`,
  legacyMode: true,
})
redisClient.connect().catch(console.error)

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err)
})
redisClient.on("connect", function (err) {
  console.log("Connected to Redis successfully")

  redisClient.set("start", new Date().toISOString(), function (err, reply) {
    console.log(reply.toString())
  })
})

const port = serverPort

/** end session */
const protect = (req, res, next) => {
  const { authenticated } = req.session

  if (!authenticated) {
    res.status(401).send({ message: "Not authenticated" })
  } else {
    next()
  }
}
/** end auth routes */

/** static */
app.use(compression())
app.use(
  serveStatic(path.join(__dirname, "dist"), {
    maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
    setHeaders: setCustomCacheControl,
  })
)

function setCustomCacheControl(res, path) {
  if (serveStatic.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "public, max-age=0")
  }
}

/** security */
let corsOptions = {
  origin: ["https://sdrive.app"],
  optionsSuccessStatus: 200, // For legacy browser support
}

app.use(cors(corsOptions))

app.use(rateLimit(rate))

app.disable("x-powered-by")
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
/** end security */

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"))
})

const PORT = process.env.PORT || serverPort
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
