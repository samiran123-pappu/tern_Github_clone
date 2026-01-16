// ============ 1. ENVIRONMENT VARIABLES (MUST BE FIRST) ============
import dotenv from "dotenv";
dotenv.config();

// ============ 2. CORE/BUILT-IN MODULES ============
import path from "path";

// ============ 3. THIRD-PARTY PACKAGES ============
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

// ============ 4. LOCAL MODULES (Routes, Controllers, DB) ============
import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/mongo_db.js";

// ============ 5. SIDE-EFFECT IMPORTS (Last, because they may need env vars) ============
import "./passport/github.auth.js";

// ============ 6. APP INITIALIZATION ============
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ============ 7. MIDDLEWARE (Order matters!) ============
app.use(cors());                          // 1st: CORS
// app.use(express.json());               // 2nd: Parse JSON body (uncomment if needed)
app.use(session({                         // 3rd: Session
    secret: 'keyboard cat', 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());           // 4th: Passport init
app.use(passport.session());              // 5th: Passport session

// ============ 8. ROUTES ============
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/auth", authRoutes);

// ============ 9. SERVE FRONTEND (Production) ============
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ============ 10. START SERVER ============
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    connectMongoDB();
});