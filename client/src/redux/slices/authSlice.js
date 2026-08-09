import { createSlice } from "@reduxjs/toolkit";


const token = localStorage.getItem("token");


const initialState = {

    user: null,

    token: token,

    isAuthenticated: Boolean(token),

    isLoading: true

};


const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {


        loginSuccess: (state, action) => {

            state.user =
                action.payload.user;

            state.token =
                action.payload.token;

            state.isAuthenticated = true;

            state.isLoading = false;

            localStorage.setItem(
                "token",
                action.payload.token
            );

        },


        setUser: (state, action) => {

            state.user =
                action.payload;

            state.isAuthenticated =
                Boolean(action.payload);

        },


        finishLoading: (state) => {

            state.isLoading = false;

        },


        logout: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.isLoading = false;

            localStorage.removeItem(
                "token"
            );

        }

    }

});


export const {
    loginSuccess,
    setUser,
    finishLoading,
    logout
} = authSlice.actions;


export default authSlice.reducer;