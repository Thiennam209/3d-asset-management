import { createSlice } from '@reduxjs/toolkit'

const getJWTToken = localStorage.getItem('dtvt') || "";
const initialState = {
    value: getJWTToken,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        checkAuth: (state) => {
            state.value = state
        }
    },
})

// Action creators are generated for each case reducer function
export const { checkAuth } = authSlice.actions

export default authSlice.reducer