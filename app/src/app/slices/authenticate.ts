import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authenticateApis = createApi({
    reducerPath: "authenticate",
    baseQuery: fetchBaseQuery({
        baseUrl: '/',
        prepareHeaders: (headers) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['authenticate'],
    endpoints: (builder) => ({
        register: builder.mutation<any, any>({
            query(data) {
                return {
                    url: "/api/register",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ['authenticate']
        }),
        login: builder.mutation<any, any>({
            query(data) {
                return {
                    url: "/api/login",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ['authenticate']
        }),
    })
})

export const { useRegisterMutation, useLoginMutation } = authenticateApis