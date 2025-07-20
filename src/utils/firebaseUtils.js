function getPathFromFirebaseUrl(url) {
  try {
    const path = url.split('/o/')[1]?.split('?')[0];
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

export { getPathFromFirebaseUrl };