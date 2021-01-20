module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        if (req.url === '/login' || req.url === '/' || req.url === '/register') {
            return next()
        }
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/login');
    }
}
