import { createSlice } from '@reduxjs/toolkit';
import { fetchBranches, saveBranch, updateBranch, deleteBranch, updateBranchMenus, savePenjualan } from '../thunks/branchThunks';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        updateBranchRating: (state, action) => {
            const { branchId, rating, totalReview } = action.payload;
            const branch = state.items.find(item => item.id === branchId);
            if (branch) {
                branch.rating = rating;
                branch.totalReview = totalReview;
            }
        }
    },
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
            .addCase(deleteBranch.rejected, rejectedHandler)

            // update menu branch
            .addCase(updateBranchMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBranchMenus.fulfilled, (state, action) => {
                const { branchId, menuCabang } = action.payload;
                const index = state.items.findIndex(branch => branch.id === branchId);
                if (index !== -1) {
                    state.items[index].menuCabang = menuCabang;
                }
                state.loading = false;
            })
            .addCase(updateBranchMenus.rejected, rejectedHandler)
            // penjualan
            .addCase(savePenjualan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(savePenjualan.fulfilled, (state, action) => {
                const { branchId, periodeId, summary, detail } = action.payload;
                const branch = state.items.find(b => b.id === branchId);
                if (branch) {
                    if (!branch.penjualan) branch.penjualan = {};
                    branch.penjualan[periodeId] = {
                        ...(branch.penjualan[periodeId] || {}),
                        totalTransaksi: Number(summary.totalTransaksi) || 0,
                        totalPendapatan: Number(summary.totalPendapatan) || 0,
                        catatan: summary.catatan || '',
                        detail: {
                            ...(branch.penjualan[periodeId]?.detail || {}),
                            ...(detail || {})
                        }
                    };
                }
                state.loading = false;
                state.successMessage = "Penjualan berhasil disimpan"
            })
            .addCase(savePenjualan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});
export const { updateBranchRating } = branchSlice.actions;
export default branchSlice.reducer;
