import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const generateLinkApi = createApi({
    reducerPath: "generateLink",
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
    tagTypes: ['generateLink'],
    endpoints: (builder) => ({
        generateLanding: builder.mutation<any, any>({
            query(data) {
                return {
                    url: "/api/generate-landing",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ['generateLink']
        })
    })
})

export const { useGenerateLandingMutation } = generateLinkApi