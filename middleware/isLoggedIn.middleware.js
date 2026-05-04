module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user); // req.user ni madad thi jo user login hase to eni detail batavse and log in nay hoy to ema undifined avse

  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl);//=> je path par request gay hoy te akho path batavse

    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create first");
    return res.redirect("/login");
  } else {
    next();
  }
};

//passport ma  login karvi etle session refresh thay jase etle juni detail mokli hase te jati rese tethi authenticate karvya pahela
// saveRedirectUrl middalvare chalavsu tema apde local ma save karavi lesu data etleke session ni detail ne  authenticate pahela j local ma save karvsu
//tethi local variabal ne access kari sakase ema detail hase
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//ek middleware banavyu je check karse ke login che ke nay jo log in nay hoy to pahela login vala page par redirect kari dese
