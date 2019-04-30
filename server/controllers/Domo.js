const models = require('../models');

const Domo = models.Domo;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || ! req.body.level) {
    return res.status(400).json({ error: 'Title, text area, and tags are all required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Idea has been written already' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const removerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('remove', { csrfToken: req.csrfToken(), domos: docs });
  });
};

// New Pages:
const accountPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('account', { csrfToken: req.csrfToken(), domos: docs });
  });
};

//New Pages for Project 3
const searchPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('search', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const removeDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.removeById(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const searchKeyword = (request/*, response*/) => {
  const req = request;
  const res = response;
  
  const query = {};
  
  if (req.body.name) {
    query.name = req.body.name;
  }
  
  /* db.users.find(query, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    
    return res.json({ domos: docs });
  }); */
};

const ad = () => {
  console.log('Congrats! Pretend that you have no ads! :D');
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.removerPage = removerPage;
module.exports.remove = removeDomo;
module.exports.getDomos = getDomos;
module.exports.accountPage = accountPage;
module.exports.searchPage = searchPage;
module.exports.searchKeyword = searchKeyword;
module.exports.ad = ad;
