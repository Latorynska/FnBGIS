import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, deleteUser, getAuth } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

export const savePengguna = createAsyncThunk(
    'pengguna/save',
    async ({ email, password, username }, thunkAPI) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const penggunaDoc = { email, username, role: 'owner' };
            await setDoc(doc(db, 'users', uid), penggunaDoc);

            return { id: uid, ...penggunaDoc };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const fetchPengguna = createAsyncThunk(
    'pengguna/fetch',
    async (_, thunkAPI) => {
        try {
            const snapshot = await getDocs(collection(db, 'users'));
            const result = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return result;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const softDeletePengguna = createAsyncThunk(
    'pengguna/softDelete',
    async (id, { rejectWithValue }) => {
        try {
            const docRef = doc(db, 'users', id);
            await updateDoc(docRef, { status: 'deleted' });
            return id;
        } catch (error) {
            console.error('Gagal soft delete pengguna:', error);
            return rejectWithValue('Gagal menghapus pengguna.');
        }
    }
);
