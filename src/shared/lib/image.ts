async function checkImageExists(url: string) {
  try {
    const response = await fetch(url);
    return response.status === 200;
  } catch (_) {
    return false;
  }
}
async function getImageUrl(prefix: string) {
  const types = ['png', 'jpg', 'jpeg'];
  let foundImageUrl = '';

  for (const type of types) {
    foundImageUrl = `http://localhost:9000/event-images/${prefix}.${type}`;
    const found = await checkImageExists(foundImageUrl);
    if (found) {
      return foundImageUrl;
    }
  }
  return '';
}
export { getImageUrl };
