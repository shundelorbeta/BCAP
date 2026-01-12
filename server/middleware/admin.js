const auth = require('./auth');

module.exports = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'co-admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  });
};