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
  GeoPoint,
  setDoc,
  getDoc
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
export const fetchBranches = createAsyncThunk(
  'branch/fetch',
  async (_, thunkAPI) => {
    try {
      const colRef = collection(db, 'branches');
      const snapshot = await getDocs(colRef);

      const branches = await Promise.all(snapshot.docs.map(async (branchDoc) => {
        const branchData = branchDoc.data();
        const branchId = branchDoc.id;

        // Ambil subkoleksi Penjualan
        const penjualanColRef = collection(db, "branches", branchId, "Penjualan");
        const penjualanSnap = await getDocs(penjualanColRef);

        const penjualanObj = {};

        // Untuk setiap periode penjualan
        await Promise.all(penjualanSnap.docs.map(async (periodeDoc) => {
          const periodeId = periodeDoc.id;
          const periodeData = periodeDoc.data();

          // Ambil DetailPenjualan dari masing-masing periode
          const detailColRef = collection(db, "branches", branchId, "Penjualan", periodeId, "DetailPenjualan");
          const detailSnap = await getDocs(detailColRef);

          const detailMap = {};
          detailSnap.docs.forEach(detailDoc => {
            const detailData = detailDoc.data();
            if (detailData.menu && detailData.qty != null) {
              detailMap[detailData.menu] = detailData.qty;
            }
          });

          penjualanObj[periodeId] = {
            totalTransaksi: periodeData.totalTransaksi || 0,
            totalPendapatan: periodeData.totalPendapatan || 0,
            catatan: periodeData.catatan || '',
            detail: detailMap
          };
        }));

        return {
          id: branchId,
          ...branchData,
          area: parseAreaArray(branchData.area),
          penjualan: penjualanObj
        };
      }));

      return branches;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

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
// penjualan
export const savePenjualan = createAsyncThunk(
  "branch/savePenjualan",
  async ({ branchId, periode, summary, detail }, { rejectWithValue }) => {
    try {
      const bulanIndex = [
        "JAN", "FEB", "MAR", "APR", "MEI", "JUN",
        "JUL", "AGU", "SEP", "OKT", "NOV", "DES"
      ].indexOf(periode.bulan);
      if (bulanIndex === -1) throw new Error("Bulan tidak valid");

      const periodeId = `${periode.tahun}-${String(bulanIndex + 1).padStart(2, "0")}`;
      const penjualanRef = doc(db, "branches", branchId, "Penjualan", periodeId);
      await setDoc(penjualanRef, {
        totalTransaksi: Number(summary.totalTransaksi) || 0,
        totalPendapatan: Number(summary.totalPendapatan) || 0,
        catatan: summary.catatan || ""
      }, { merge: true });

      // Simpan detail penjualan per menu
      const detailCollectionRef = collection(penjualanRef, "DetailPenjualan");
      const promises = Object.entries(detail).map(([menuId, qty]) =>
        setDoc(doc(detailCollectionRef, menuId), {
          qty: Number(qty),
          menu: menuId
        })
      );

      await Promise.all(promises);

      return {
        branchId,
        periodeId,
        summary,
        detail,
        isUpdate: true // masih bisa kirim ini kalau kamu ingin tahu, walau timestamp-nya tidak disimpan
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

