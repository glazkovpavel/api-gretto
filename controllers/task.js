const Task = require("../models/task");
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

module.exports.getTask = (req, res, next) => {
  const date = req.params.dateId;
  const owner = req.user._id;

  Task.find({date: date, owner: owner})
    .then((tasks) => res.status(200).send(tasks))
    .catch(next)
}

module.exports.createTask = (req, res, next) => {
  const  task  = req.body;
  task.owner = req.user._id

    Task.create( task)
      .then((task) => res.status(201).send({
        _id: task._id,
        title: task.title,
        date: task.date
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestErr(invalidDataErrorText);
        }
        return next(err);
      })
      .catch(next);

};

module.exports.updateTask = (req, res, next) => {
  const { _id } = req.body;
  const  task  = req.body;
  task.owner = req.user._id

    Task.findByIdAndUpdate(_id,  task,
      { upsert: true, new: true })
      .then((task) => {
        if (!task) {
          throw new NotFoundError(userIdNotFoundText);
        } else {
          return res.status(200).send(task);
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

module.exports.deleteTaskById = (req, res, next) => {
  const space = {_id: req.params.taskId}

  Task.findOne(space).select('+owner')
    .then((space) => {
      if (!space) {
        throw new NotFoundError(movieIdNotFoundErrorText);
      } else if (space.owner.toString() !== req.user._id) {
        throw new ForbiddenErr(forbiddenErrorText);
      }

      Task.findByIdAndDelete(space).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch(next);
};
