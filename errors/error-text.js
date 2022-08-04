const invalidDataErrorText = 'Произошла ошибка валидации';
const forbiddenErrorText = 'Нет прав, нельзя удалять ресурсы других пользователей';
const forbiddenErrorTextDeleteOwner = 'Нет прав, нельзя удалить владельца чата';
const invalidUserIdErrorText = 'Введен невалидный id пользователя';
const userIdNotFoundText = 'Нет пользователя с таким id';
const movieIdNotFoundErrorText = 'Запрашиваемый ресурс не найден';
const duplicateEmailErrorText = 'Пользователь с таким email уже существует';
const wrongCredentialsErrorText = 'Неправильные почта или пароль';
const unauthorizedErrorText = 'Необходима авторизация';

module.exports = {
  invalidDataErrorText,
  forbiddenErrorText,
  invalidUserIdErrorText,
  userIdNotFoundText,
  movieIdNotFoundErrorText,
  duplicateEmailErrorText,
  wrongCredentialsErrorText,
  unauthorizedErrorText,
  forbiddenErrorTextDeleteOwner,
};
