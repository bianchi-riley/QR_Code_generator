const User = require("../models/users");

async function currentUserUser(req, res, next) {
    try{
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId).lean();
            res.locals.currentUser = user || null;
        } else {
            res.locals.currentUser = null;
        }
        next()
    } catch (err) {
        next(err);
    }
}

function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect("/login?msg=you%20must%20login");
}

module.exports = { currentUserUser, requireAuth };