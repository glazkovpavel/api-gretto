const WorkSpace = require("../models/work-space");
const ConflictErr = require("../errors/conflict-err");
const BadRequestErr = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const {
  duplicateEmailErrorText,
  invalidDataErrorText,
  userIdNotFoundText,
  invalidUserIdErrorText } = require("../errors/error-text");


module.exports.createWorkSpace = (req, res, next) => {
  const { id } = req.body;
  const  space  = req.body;
  space.owner = req.user._id

  WorkSpace.findOne({ id })
    .then((workSpace) => {
      if (workSpace) {

        WorkSpace.findByIdAndUpdate(req.user._id,  req.body,
          { upsert: true, new: true, runValidators: true })
          .then((space) => {
            if (!space) {
              throw new NotFoundError(userIdNotFoundText);
            }
            return res.status(202).send(space);
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
        WorkSpace.create( space)
          .then((space) => res.status(201).send(space))
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


