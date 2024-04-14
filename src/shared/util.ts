export function appendClassName(base: string, add?: string | null) {
  if (add == null) {
    return base;
  }
  return base + ' ' + add;
}

export function sharedStart(array: string[]) {
  let A = array.concat().sort(),
    a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
}

export function union<T>(left: Set<T>, right: Set<T>): Set<T> {
  return new Set([...left, ...right]);
}

export function intersection<T>(left: Set<T>, right: Set<T>): Set<T> {
  return new Set([...left].filter(x => right.has(x)))
}

export function difference<T>(left: Set<T>, right: Set<T>): Set<T> {
  return new Set([...left].filter(x => !right.has(x)));
}

export function truncateTextByWords(text: string, wordLimit: number): string {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  } else {
    return text;
  }
}

/**
 * Formats ISO 8601 datetime and extracts date and time
 * @param datetimeStr string in ISO 8601 format (e.g., "1999-12-31T23:59:59")
 * @returns {{date: string, time: string}} An object containing formatted date and time strings.
 *  - Date format: 'DD.MM.YYYY'
 *  - Time format: 'hh:mm'
 */
export function formatDateTime(datetimeStr: string) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  const dateObj = new Date(datetimeStr);
  const dateFormatter = new Intl.DateTimeFormat('de-DE', options);
  let formattedString = dateFormatter.format(dateObj);
  let [date, time] = formattedString.split(', ');
  return { date, time };
}
