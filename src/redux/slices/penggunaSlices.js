import { createSlice } from '@reduxjs/toolkit';
import { fetchPengguna, savePengguna, softDeletePengguna } from '../thunks/penggunaThunks';

const penggunaSlice = createSlice({
    name: 'pengguna',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch pengguna
            .addCase(fetchPengguna.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPengguna.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPengguna.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Save pengguna
            .addCase(savePengguna.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(savePengguna.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(savePengguna.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Soft delete pengguna
            .addCase(softDeletePengguna.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(softDeletePengguna.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(user => user.id !== action.payload);
            })
            .addCase(softDeletePengguna.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
});

export default penggunaSlice.reducer;
