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
    foundImageUrl = `${(window as any).ENV_MINIO_URL}/event-images/${prefix}.${type}`;
    try{
      const found = await checkImageExists(foundImageUrl);
      if (found) {
        return foundImageUrl;
      }
    }catch (error){
      console.log(error)
      return ''
    }
  }
  return '';
}
export { getImageUrl };
