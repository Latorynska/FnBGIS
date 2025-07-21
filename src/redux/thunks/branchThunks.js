// src/features/branch/branchThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  GeoPoint
} from 'firebase/firestore';

// Utility: Convert GeoPoint or legacy format to [lat, lng]
const parseAreaArray = (area = []) => {
  return area.map(point => {
    if (point && typeof point.latitude === 'number' && typeof point.longitude === 'number') {
      return [point.latitude, point.longitude];
    }
    if (point?._lat && point?._long) {
      return [point._lat, point._long];
    }
    if (typeof point === 'string') {
      const [latStr, lngStr] = point.split(', ');
      return [parseFloat(latStr), parseFloat(lngStr)];
    }
    return null;
  }).filter(Boolean);
};

// Utility: Convert [lat, lng] array to GeoPoint[]
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

// GET
export const fetchBranches = createAsyncThunk('branch/fetch', async (_, thunkAPI) => {
  try {
    const colRef = collection(db, 'branches');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        area: parseAreaArray(data.area)
      };
    });
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// CREATE
export const saveBranch = createAsyncThunk('branch/save', async (branchData, thunkAPI) => {
  try {
    const geoPoints = convertToGeoPoints(branchData.area || []);
    const dataToSave = {
      ...branchData,
      area: geoPoints
    };
    const docRef = await addDoc(collection(db, 'branches'), dataToSave);
    return {
      id: docRef.id,
      ...branchData,
      area: branchData.area // tetap array biasa untuk state
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// UPDATE
export const updateBranch = createAsyncThunk('branch/update', async ({ id, data }, thunkAPI) => {
  try {
    const geoPoints = convertToGeoPoints(data.area || []);
    const dataToUpdate = {
      ...data,
      area: geoPoints
    };
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, dataToUpdate);

    return {
      id,
      ...data,
      area: data.area // tetap array biasa untuk state
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// DELETE
export const deleteBranch = createAsyncThunk('branch/delete', async (id, thunkAPI) => {
  try {
    const docRef = doc(db, 'branches', id);
    await deleteDoc(docRef);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// branch menu
export const updateBranchMenus = createAsyncThunk(
  'branch/updateBranchMenus',
  async ({ branchId, menuCabang }, { rejectWithValue }) => {
    try {
      const branchRef = doc(db, 'branches', branchId);

      await updateDoc(branchRef, { menuCabang });

      return { branchId, menuCabang };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);