function getDataTimeLine(dateTimeString: string) {
  if (!dateTimeString) return;

  const dateTime = new Date(dateTimeString);
  const date = dateTime.toLocaleDateString().split('T')[0];

  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');

  return date + ' ' + `${hours}:${minutes}`;
}

export { getDataTimeLine };
