import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useUploadImage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, path) => {
    setUploading(true);
    setError(null);

    try {
      const storage = getStorage();
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return null;
    }
  };

  return { uploadImage, uploading, error };
};
