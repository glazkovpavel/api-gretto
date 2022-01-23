const Journal = require("../models/journal");

const ForbiddenErr = require("../errors/forbidden-err");
const NotFoundError = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ConflictErr = require('../errors/conflict-err');
const {
  invalidDataErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  duplicateEmailErrorText,
  forbiddenErrorText,
} = require('../errors/error-text');

module.exports.getJournal = (req, res, next) => {

  const  date = req.params.journalDate;
  const owner = req.user._id;

  Journal.findOne({date: date, owner: owner} )
    .then((item) => {
      if (!item) {
        return res.status(200).send({});
      } else if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenErr(forbiddenErrorText);
      } else {
         res.status(200).send({
        date: item.date,
        text: item.text
      })}})
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
  const { date } = req.body;
  const  journal  = req.body;
  journal.owner = req.user._id
  const owner = req.user._id;


  Journal.findOne({date: date, owner: owner})
    .then((item) => {
      if (item) {

        Journal.findOneAndUpdate({date: date, owner: owner},  journal,
          { upsert: true, new: true })
          .then((journal) => {
            if (!journal) {
              throw new NotFoundError(userIdNotFoundText);
            } else {
              return res.status(200).send({
                date: journal.date,
                text: journal.text
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
      } else {
        Journal.create( journal)
          .then((journal) => res.status(201).send({
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
      }
    })
    .catch(next);
};
