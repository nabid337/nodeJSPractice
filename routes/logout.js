module.exports = {
    getLogOut : function(req, res, next){
       if (req.session) {
        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }
}


}