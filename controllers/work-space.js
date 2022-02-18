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
    .then((workSpase) => {
      if (!workSpase) {
        throw new NotFoundError('Нет workSpase с таким id');
      }
      WorkSpace.findByIdAndUpdate(req.params._id,
        { $addToSet: { owner: req.body.id } },
        { new: true })
        .then((workSpase) => {
          if (workSpase !== null) {
            res.send({ data: workSpase });
          } else { throw new NotFoundError('Данного workSpase не существует'); }
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
  space.owner = req.user._id

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

module.exports.deleteSpaceById = (req, res, next) => {
  const space = {_id: req.params.spaceId}

  WorkSpace.findOne(space).select('+owner')
    .then((space) => {
      if (!space) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (space.owner.toString() !== req.user._id) {
        throw new ForbiddenErr(forbiddenErrorText);
      }

      WorkSpace.findByIdAndDelete(space).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch(next);
};
