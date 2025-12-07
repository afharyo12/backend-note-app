import express from "express";
import cors from "cors";
import router from "./routes/Route.js";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from "./config/Database.js"; // Import DB connection

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Middlewares (MUST come first)
app.use(cors());
app.use(express.json()); // Parses application/json
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // Parses form-data

// 2. Static Files
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// 3. Routes (MUST come after middlewares)
app.use(router);

// 4. Database Connection
(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        await db.sync();
    } catch (error) {
        console.error('Connection Error:', error);
    }
})();

app.listen(5000, () => console.log("Backend server connected"));