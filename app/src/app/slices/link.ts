import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const generateLinkApi = createApi({
    reducerPath: "generate-landing",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    tagTypes: ['generate-landing'],
    endpoints: (builder) => ({
        generateLanding: builder.mutation<any, any>({
            query(data) {
                return {
                    url: "/api/generate-landing",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ['generate-landing']
        })
    })
})

export const { useGenerateLandingMutation } = generateLinkApi