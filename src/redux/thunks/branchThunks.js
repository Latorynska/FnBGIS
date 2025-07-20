// src/features/branch/branchThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// GET
export const fetchBranches = createAsyncThunk('branch/fetch', async (_, thunkAPI) => {
    try {
        const colRef = collection(db, 'branches');
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

// CREATE
export const saveBranch = createAsyncThunk('branch/save', async (branchData, thunkAPI) => {
    try {
        const newBranch = {
            ...branchData,
        };
        const docRef = await addDoc(collection(db, 'branches'), newBranch);
        return { id: docRef.id, ...newBranch };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

// UPDATE
export const updateBranch = createAsyncThunk('branch/update', async ({ id, data }, thunkAPI) => {
    try {
        const docRef = doc(db, 'branches', id);
        await updateDoc(docRef, data);
        return { id, ...data };
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
