const dateFns = require('date-fns');

const REMOVE_HOURS_MINUTES = 'P';

const ONLY_HOURS = 'HH';

const formatDate = (date) => dateFns.format(date, REMOVE_HOURS_MINUTES);

const formatTime = (date) => dateFns.format(date, ONLY_HOURS);

const addTime = (date, timeToAdd) => dateFns.add(date, timeToAdd);

const checkIsValidDate = async (date, expirationDate) => dateFns.isAfter(date, expirationDate);


module.exports = {
  addTime,
  formatDate,
  checkIsValidDate,
  formatTime,
};
