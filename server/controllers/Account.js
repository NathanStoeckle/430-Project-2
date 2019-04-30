const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // Force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'RAWR! All fields are required',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password',
      });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({
      redirect: '/maker',
    });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! Passwords do not match',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({
        redirect: '/maker',
      });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username already in use.',
        });
      }

      return res.status(400).json({
        error: 'An error occured',
      });
    });
  });
};

//Update the password
const changePassword = (require, response) => {
  const req = require;
  const res = response;
  
  // Gets the fields necessary to create new password
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;
  
  if (req.body.newPass !== req.body.newPass2) {
    return response.status(400).json({ error: 'New passwords do not match!' });
  }
  
  if (req.body.oldPass === req.body.newPass) {
    return response.status(400).json({ error: 'Your current password cannot be your current one!' });
  }

  const username = req.session.account.username;
  
  return Account.AccountModel.authenticate(username, req.body.oldPass, (err, username) => {
    if (err || !username) {
      return response.status(401).json({ error: 'Current Password is incorrect' });
    }
    
    // Create a new account that is set to the old account
    const newAccount = username;
    
    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      newAccount.password = hash;
      newAccount.salt = salt;
      
      const savePromise = newAccount.save();
      
      savePromise.catch((err) => {
        res.json(err);
      });
      
      savePromise.then(() => res.json({ redirect: '/logout' }));
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
