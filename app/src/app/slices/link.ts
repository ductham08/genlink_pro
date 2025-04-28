import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const generateLinkApi = createApi({
    reducerPath: "generateLink",
    baseQuery: customBaseQuery,
    tagTypes: ['generateLink', 'links'],
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
        }),
        getLinks: builder.query<any, { limit?: number }>({
            query: ({ limit }) => ({
                url: '/api/links',
                method: 'GET',
                params: { limit }
            }),
            providesTags: ['links']
        }),
        deleteLink: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `/api/links/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['links']
        })
    })
})

export const { useGenerateLandingMutation, useGetLinksQuery, useDeleteLinkMutation } = generateLinkApi