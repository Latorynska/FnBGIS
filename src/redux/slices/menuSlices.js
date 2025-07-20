// File: menuSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchMenus, saveMenu, updateMenu, deleteMenu } from '../thunks/brandThunks';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handler re-use
        const pendingHandler = (state) => {
            state.loading = true;
            state.error = null;
        };
        const rejectedHandler = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            // Fetch Menus
            .addCase(fetchMenus.pending, pendingHandler)
            .addCase(fetchMenus.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchMenus.rejected, rejectedHandler)
            // Save Menu
            .addCase(saveMenu.pending, pendingHandler)
            .addCase(saveMenu.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.loading = false;
            })
            .addCase(saveMenu.rejected, rejectedHandler)
            // Update Menu
            .addCase(updateMenu.pending, pendingHandler)
            .addCase(updateMenu.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateMenu.rejected, rejectedHandler)
            //   delete menu
            .addCase(deleteMenu.pending, pendingHandler)
            .addCase(deleteMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteMenu.rejected, rejectedHandler);
    }
});

export default menuSlice.reducer;
