import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/Route.js";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from "./config/Logger.js"; 
import { requestLogger } from "./middleware/LoggerMiddleware.js";

// --- PROMETHEUS SETUP ---
import client from "prom-client";

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'inventory-backend'
});

// Enable the collection of default metrics (CPU, Memory, Event Loop, etc.)
client.collectDefaultMetrics({ register });
// ------------------------

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup View Engine
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger); // Log requests

// --- METRICS ROUTE (Must be before main router if you want to skip Auth) ---
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});
// --------------------------------------------------------------------------

app.use(router);

app.listen(5000, () => logger.info("Backend server connected on port 5000"));