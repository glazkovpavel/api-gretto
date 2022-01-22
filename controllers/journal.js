const Journal = require("../models/journal");

const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const {
  invalidDataErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  duplicateEmailErrorText,
} = require('../errors/error-text');


module.exports.getJournal = (req, res, next) => {
  Journal.findById(req.user._id)
    .then((journal) => {
      if (!journal) {
        throw new NotFoundError(userIdNotFoundText);
      }
      res.send(journal);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr(invalidDataErrorText);
      }
      return next(err);
    })
    .catch(next);
};

module.exports.updateJournal = (req, res, next) => {
  const { data } = req.body;

  Journal.findOneAndUpdate(data, req.body, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((journal) => {
      if (!journal) {
        throw new NotFoundError(userIdNotFoundText);
      } else {
        return res.send({
          text: journal.name,
          date: journal.email,
        });
      }
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

module.exports.createJournal = (req, res, next) => {

  const journal = req.body
  journal.owner = req.user._id


  Journal.create(journal)
      .then((journal) => res.status(200).send({
        date: journal.date,
        text: journal.text
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestErr(invalidDataErrorText);
        }
        return next(err);
      })
    .catch(next);
};
