import { createSlice } from '@reduxjs/toolkit';
import { fetchBranches, saveBranch, updateBranch, deleteBranch } from '../thunks/branchThunks';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const pendingHandler = (state) => {
            state.loading = true;
            state.error = null;
        };

        const rejectedHandler = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            // Fetch branches
            .addCase(fetchBranches.pending, pendingHandler)
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchBranches.rejected, rejectedHandler)

            // Save new branch
            .addCase(saveBranch.pending, pendingHandler)
            .addCase(saveBranch.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.loading = false;
            })
            .addCase(saveBranch.rejected, rejectedHandler)

            // Update branch
            .addCase(updateBranch.pending, pendingHandler)
            .addCase(updateBranch.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex(item => item.id === updated.id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
                state.loading = false;
            })
            .addCase(updateBranch.rejected, rejectedHandler)

            // Delete branch
            .addCase(deleteBranch.pending, pendingHandler)
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteBranch.rejected, rejectedHandler);
    },
});

export default branchSlice.reducer;
