const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// إعداد الجلسة الخاصة بمسار /customer
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// البرمجية الوسيطة للتحقق من التوكين والجلسة
app.use("/customer/auth/*", function auth(req, res, next) {
    // التحقق مما إذا كان للمستخدم جلسة مصرحة تحتوي على accessToken
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        
        // فحص صحة التوكين بملف المفتاح السرّي
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // الانتقال إلى المسار المكتوب
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));