import { collection, getDocs, query, where, limit, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export const fetchBrands = createAsyncThunk('brand/fetch', async (_, thunkAPI) => {
    const auth = getAuth();
    try {
        const q = query(
            collection(db, 'brands'),
            where('owner', '==', auth.currentUser.uid),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return [{ id: docSnap.id, ...docSnap.data() }];
        } else {
            return [];
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const saveBrand = createAsyncThunk('brand/save', async (brandData, thunkAPI) => {
    const auth = getAuth();
    try {
        const newBrand = {
            ...brandData,
            owner: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, 'brands'), newBrand);
        return { id: docRef.id, ...newBrand };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateBrand = createAsyncThunk(
    'brand/update',
    async ({ id, data }, thunkAPI) => {
        try {
            let iconUrl = data.prevIconUrl;
            if (data.logoFile) {
                console.log(data);
                const storage = getStorage();
                const fileName = `${Date.now()}-${data.logoFile.name}`;
                const path = `brands/${getAuth().currentUser.uid}/${fileName}`;
                const storageRef = ref(storage, path);
                await uploadBytes(storageRef, data.logoFile);
                iconUrl = await getDownloadURL(storageRef);
                if (data.prevIconUrl) {
                    const prevPath = data.prevIconUrl.split('/o/')[1]?.split('?')[0]; 
                    const decodedPath = decodeURIComponent(prevPath);
                    const oldRef = ref(storage, decodedPath);
                    await deleteObject(oldRef).catch(() => {
                        console.warn("Gagal hapus icon lama, mungkin sudah tidak ada");
                    });
                }
            }

            const brandData = {
                nama: data.nama,
                kategori: data.kategori,
                deskripsi: data.deskripsi,
                website: data.website,
                email: data.email,
                iconUrl,
            };

            const docRef = doc(db, 'brands', id);
            await updateDoc(docRef, brandData);

            return { id, ...brandData };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);