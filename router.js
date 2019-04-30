const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  
  //GET stuff
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);  
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/remove', mid.requiresLogin, controllers.Domo.removerPage);
  app.get('/account', mid.requiresLogin, controllers.Domo.accountPage);
  app.get('/search', mid.requiresLogin, controllers.Domo.searchPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/searchKeyword', mid.requiresLogin, controllers.Domo.searchKeyword);
  
  //POST stuff
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.post('/remove', mid.requiresLogin, controllers.Domo.remove);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.post('/ad', mid.requiresLogin, controllers.Domo.ad);
};

module.exports = router;
