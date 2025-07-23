import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  GeoPoint,
  deleteDoc,
} from 'firebase/firestore';

export const fetchDaerahs = createAsyncThunk('daerah/fetchDaerah', async () => {
  const snapshot = await getDocs(collection(db, 'daerah'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    // Convert GeoPoint -> [lat, lng]
    const parsedArea = (data.area || []).map((geoPoint) => {
      if (geoPoint && typeof geoPoint.latitude === 'number' && typeof geoPoint.longitude === 'number') {
        return [geoPoint.latitude, geoPoint.longitude];
      }

      // Kalau masih GeoPoint dengan _lat/_long (lama)
      if (geoPoint?._lat && geoPoint?._long) {
        return [geoPoint._lat, geoPoint._long];
      }

      // fallback jika string (jarang)
      if (typeof geoPoint === 'string') {
        const [latStr, lngStr] = geoPoint.split(', ');
        return [parseFloat(latStr), parseFloat(lngStr)];
      }

      return null;
    }).filter(Boolean); // buang null/nullish value

    return {
      id: doc.id,
      ...data,
      area: parsedArea,
    };
  });
});

// create daerah
export const createDaerah = createAsyncThunk(
  'daerah/createDaerah',
  async (daerah, thunkAPI) => {
    try {
      // Fungsi bantu untuk ubah array [lng, lat] menjadi GeoPoint
      const convertToGeoPoints = (areaArray) => {
        const result = [];

        const recurse = (arr) => {
          if (Array.isArray(arr[0])) {
            arr.forEach(sub => recurse(sub));
          } else if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
            const [lat, lng] = arr;
            result.push(new GeoPoint(lat, lng));
          }
        };

        recurse(areaArray);
        return result;
      };

      const geoPoints = convertToGeoPoints(daerah.area);

      const dataToSave = {
        ...daerah,
        area: geoPoints // untuk Firestore
      };

      const docRef = await addDoc(collection(db, 'daerah'), dataToSave);

      return {
        id: docRef.id,
        ...daerah,
        area: daerah.area // tetap kirim array biasa ke Redux
      };
    } catch (error) {
      console.error('Create daerah error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Daerah
export const updateDaerah = createAsyncThunk(
  'daerah/updateDaerah',
  async ({ id, data }, thunkAPI) => {
    try {
      const convertToGeoPoints = (areaArray) => {
        const result = [];
        const recurse = (arr) => {
          if (Array.isArray(arr[0])) {
            arr.forEach(sub => recurse(sub));
          } else if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
            const [lat, lng] = arr;
            result.push(new GeoPoint(lat, lng));
          }
        };
        recurse(areaArray);
        return result;
      };

      const geoPoints = convertToGeoPoints(data.area);
      const dataToUpdate = {
        ...data,
        area: geoPoints
      };

      const docRef = doc(db, 'daerah', id);
      await updateDoc(docRef, dataToUpdate);

      return {
        id,
        ...data,
        area: data.area // tetap kirim array biasa ke Redux
      };
    } catch (error) {
      console.error('Update daerah error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteDaerah = createAsyncThunk(
  'daerah/deleteDaerah',
  async (id, thunkAPI) => {
    try {
      const docRef = doc(db, 'daerah', id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error('Delete daerah error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);