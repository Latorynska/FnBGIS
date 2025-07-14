import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
    fetchBrandsStart,
    fetchBrandsSuccess,
    fetchBrandsFailure
} from '../slices/brandSlices';

export const fetchBrands = () => async (dispatch) => {
    dispatch(fetchBrandsStart());
    try {
        console.log('[THUNK] Fetching brand by owner');
        const q = query(
            collection(db, 'brands'),
            where('owner', '==', '0x001'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = { id: doc.id, ...doc.data() };
            console.log('[THUNK] Brand found:', data);
            dispatch(fetchBrandsSuccess([data]));
        } else {
            console.log('[THUNK] Brand not found');
        }
    } catch (error) {
        console.error('[THUNK] Error:', error);
        dispatch(fetchBrandsFailure(error.message));
    }
};

