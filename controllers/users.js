const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const UnauthorizedErr = require('../errors/unauthorized-err');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Произошла ошибка валидации');
      }
    })
    .catch(next);
};

module.exports.getUsername = (req, res, next) => {
  const { username } = req.body

  User.findOne({ username })
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
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })

    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    username,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictErr('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => User.create({
      name, username, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({
        user: {
          name: user.name,
          username: user.username,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestErr('Введены невалидные данные');
        }
      }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestErr('Произошла ошибка валидации');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestErr('Произошла ошибка валидации');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedErr('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedErr('Неправильные почта или пароль');
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
