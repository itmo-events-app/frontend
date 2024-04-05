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
