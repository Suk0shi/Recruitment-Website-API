const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Prevents spam by only allowing 5 requests per ip per 15 mins
const emailRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: "Too many email requests from this IP, please try again later.",
});

// Require controller modules.
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController");
const email_controller = require("../controllers/emailController");

router.get("/posts", post_controller.posts);

router.get("/unpublished", verifyToken, post_controller.unpublished);

router.post("/post", verifyToken, post_controller.post_post);

router.post("/post/:id/update", verifyToken, post_controller.update_post);

router.post("/post/:id/delete", verifyToken, post_controller.delete_post);

router.get("/post/:id", post_controller.post_detail);

router.get("/login", user_controller.login);

router.get("/signUp", user_controller.signUp);

router.post("/signUp", verifyToken, user_controller.signUp_post);

router.post("/sendEmail", emailRateLimiter, email_controller.sendEmail_post);

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value 
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.json('Login required')
    }
}


module.exports = router;