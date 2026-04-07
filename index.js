const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
// 1. Check if session exists
    if (!req.session.authorization) {
        return res.status(401).json({ message: "Access denied. Please log in." });
    }

    // 2. Get the token from the session
    const token = req.session.authorization.token;

    // 3. Verify the JWT token
    try {
        const decoded = jwt.verify(token, "fingerprint_customer"); // same secret used in login
        req.user = decoded; // attach username info to request
        next(); // allow the request to continue to the route
    } catch (err) {
        return res.status(403).json({ message: "Invalid token. Please log in again." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
