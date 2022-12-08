const addDateSuf = (date) => {
  let dateString = date.toString();

  // GET DATE STRING LAST CHARACTER
  const lastChar = dateString.charAt(dateString.length - 1);

  if (lastChar === '1' && dateString !== '11') {
    dateString = `${dateString}st`;
  } else if (lastChar === '2' && dateString !== '12') {
    dateString = `${dateString}nd`;
  } else if (lastChar === '3' && dateString !== '13') {
    dateString = `${dateString}rd`;
  } else {
    dateString = `${dateString}th`;
  }

  return dateString;
};

// FUNCTION FOR TIMESTAMP
module.exports = (
  timestamp,
  { monthLen = 'short', dateSuffix = true } = {}
) => {
  // OBJECT OF MONTH
  const months = {
    0: monthLen === 'short' ? 'Jan' : 'January',
    1: monthLen === 'short' ? 'Feb' : 'February',
    2: monthLen === 'short' ? 'Mar' : 'March',
    3: monthLen === 'short' ? 'Apr' : 'April',
    4: monthLen === 'short' ? 'May' : 'May',
    5: monthLen === 'short' ? 'Jun' : 'June',
    6: monthLen === 'short' ? 'Jul' : 'July',
    7: monthLen === 'short' ? 'Aug' : 'August',
    8: monthLen === 'short' ? 'Sep' : 'September',
    9: monthLen === 'short' ? 'Oct' : 'October',
    10: monthLen === 'short' ? 'Nov' : 'November',
    11: monthLen === 'short' ? 'Dec' : 'December',
  };

  const dateObject = new Date(timestamp);
  const mformat = months[dateObject.getMonth()];

  const dayOfMonth = dateSuffix
    ? addDateSuf(dateObject.getDate())
    : dateObject.getDate();

  const year = dateObject.getFullYear();
  let hour =
    dateObject.getHours() > 12
      ? Math.floor(dateObject.getHours() - 12)
      : dateObject.getHours();

  // if hour is 0 (12:00am), change it to 12
  if (hour === 0) {
    hour = 12;
  }

  const minutes = (dateObject.getMinutes() < 10 ? '0' : '') + dateObject.getMinutes();

  // set `am` or `pm`
  const dayPer = dateObject.getHours() >= 12 ? 'pm' : 'am';

  const tsFormat = `${mformat} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${dayPer}`;

  return tsFormat;
};
