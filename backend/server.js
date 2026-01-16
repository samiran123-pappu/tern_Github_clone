import express from "express";
import dotenv from "dotenv";

// Load environment variables FIRST before any other imports that need them
dotenv.config();

import cors from "cors";
import session from "express-session";
import passport from "passport";

import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/mongo_db.js";

// Register the GitHub strategy on passport (env vars already loaded above)
import "./passport/github.auth.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
	connectMongoDB();
});
