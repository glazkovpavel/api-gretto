const bcrypt = require('bcrypt');
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const {
  invalidDataErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  duplicateEmailErrorText,
  wrongCredentialsErrorText,
} = require('../errors/error-text');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauthorized-err');

const saltRounds = 10;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userIdNotFoundText);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr(invalidDataErrorText);
      }
    })
    .catch(next);
};

module.exports.getUsersWorkSpace = (req, res, next) => {
  const { users } = req.body

  User.find( {_id: users} )
    .then((usersWorkSpace) => {
      res.send(usersWorkSpace);
    })
    .catch(next);
};

module.exports.getUsername = (req, res, next) => {
  const { username, surname } = req.body

  User.findOne({ username, surname })
    .then((user) => {
      if (user) {
        res.send({ message: 'Пользователь с таким username уже существует', data: 'error' });
      }
     res.send(null);
    })

    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userIdNotFoundText);
      }
      res.send({ data: user });
    })

    .catch(next);
};

module.exports.getUsers = (req, res, next) => {

  const { name } = req.body;

  User.find({ name })
    .then((users) => res.send( users ))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    username,
    surname,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr(duplicateEmailErrorText);
      }
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => User.create({
      name, surname, username, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({
        user: {
          name: user.name,
          surname: user.surname,
          username: user.username,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestErr(invalidDataErrorText);
        }
      }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar},
    { new: true, runValidators: true,  upsert: false })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userIdNotFoundText);
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(invalidDataErrorText);
      } else if (err.name === 'CastError') {
        throw new BadRequestErr(invalidUserIdErrorText);
      } else if (err.codeName === 'DuplicateKey') {
        throw new ConflictErr(duplicateEmailErrorText);
      }
      return next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedErr(wrongCredentialsErrorText);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedErr(wrongCredentialsErrorText);
          }
          return user;
        });
    })
    .then((verifiedUser) => {
      const token = jwt.sign({ _id: verifiedUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
