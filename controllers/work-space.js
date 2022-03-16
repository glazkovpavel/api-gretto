const WorkSpace = require("../models/work-space");
const ConflictErr = require("../errors/conflict-err");
const BadRequestErr = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const {
  duplicateEmailErrorText,
  invalidDataErrorText,
  userIdNotFoundText,
  invalidUserIdErrorText, movieIdNotFoundErrorText, forbiddenErrorText
} = require("../errors/error-text");
const ForbiddenErr = require("../errors/forbidden-err");


module.exports.updateWorkSpace = (req, res, next) => {
  WorkSpace.findById(req.params._id)
    .then((workSpace) => {
      if (!workSpace) {
        throw new NotFoundError('Нет workSpace с таким id');
      }
      WorkSpace.findByIdAndUpdate(req.params._id,
        { $addToSet: { owner: req.body.id } },
        { new: true })
        .then((workSpace) => {
          if (workSpace !== null) {
            res.send( workSpace );
          } else { throw new NotFoundError('Данного workSpace не существует'); }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequestErr('Произошла ошибка валидации');
          }
        });
    })
    .catch(next);
};


module.exports.getWorkSpace = (req, res, next) => {
  const owner = req.user._id;

  WorkSpace.find({owner})
    .then((spaces) =>

      res.status(200).send(spaces))
    .catch(next)
}

module.exports.createWorkSpace = (req, res, next) => {
  const { _id } = req.body;
  const  space  = req.body;

  if (!req.body.owner.length) {
    space.owner = req.user._id;
  }

  WorkSpace.findOne({ _id })
    .then((workSpace) => {
      if (workSpace) {

        WorkSpace.findByIdAndUpdate(_id,  space,
          { upsert: true, new: true })
          .then((space) => {
            if (!space) {
              throw new NotFoundError(userIdNotFoundText);
            } else {
              return res.status(200).send(space);
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
        space.holder = req.user._id;
        WorkSpace.create( space, {"ordered" : false})
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

module.exports.deleteSpaceById = (req, res, next) => {
  const space = {_id: req.params.spaceId}
  const holder = req.user._id
  WorkSpace.findOne(space).select('+holder')
    .then((space) => {
      if (!space) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (space.holder.toString() === holder) {
        WorkSpace.findByIdAndDelete(space).select('-holder')
          .then((deletedMovie) => res.status(200).send(deletedMovie));
      } else {
        throw new ForbiddenErr(forbiddenErrorText);
      }

    })
    .catch(next);
};
