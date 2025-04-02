import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authenticateApis = createApi({
    reducerPath: "authenticate",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
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