export function appendClassName(base: string, add?: string | null) {
  if (add == null) {
    return base;
  }
  return base + ' ' + add;
}

export function sharedStart(array: any[]) {
  var A = array.concat().sort(),
    a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
}
