import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const generateLinkApi = createApi({
    reducerPath: "generateLink",
    baseQuery: customBaseQuery,
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