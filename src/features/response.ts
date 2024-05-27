export function getErrorResponse(response: any) {
  const data = response.data;
  if (typeof data === 'string') {
    return data;
  } else {
    return JSON.stringify(data);
  }
}
