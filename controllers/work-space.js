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
  // const {
  //   idSpace,
  //   titleSpace,
  //   list: [{
  //     idList,
  //     titleList,
  //     card: [{
  //       idCard,
  //       titleCard,
  //       importantCard
  //     }]
  //   }]
  // } = req.body;
  //
  console.log(req.body.list.card)

  WorkSpace.findOne({  })
    .then((workSpace) => {
      if (workSpace) {
        this.updateWorkSpace()
      }
      WorkSpace.create({
        idSpace, titleSpace, idList, titleList, idCard, titleCard, importantCard,
      })
        .then((space) => res.status(201).send(space))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestErr(invalidDataErrorText);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateWorkSpace = (req, res, next) => {
  const {
    id,
    title,
    list: {
      idList,
      titleList,
      card: {
        idCard,
        titleCard,
        importantCard
      }
    }
  } = req.body;

  WorkSpace.findByIdAndUpdate(req.user._id, {
      id, title, idList, titleList, idCard, titleCard, importantCard,
      },
    { new: true, runValidators: true,  upsert: false })
    .then((space) => {
      if (!space) {
        throw new NotFoundError(userIdNotFoundText);
      }
      return res.send({ data: space });
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
