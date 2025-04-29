import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const generateLinkApi = createApi({
    reducerPath: "generateLink",
    baseQuery: customBaseQuery,
    tagTypes: ['Link'],
    endpoints: (builder) => ({
        generateLanding: builder.mutation<any, any>({
            query(data) {
                return {
                    url: "/api/generate-landing",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ['Link']
        }),
        getLinks: builder.query<any, { limit?: number }>({
            query: ({ limit }) => ({
                url: '/api/links',
                method: 'GET',
                params: { limit }
            }),
            providesTags: ['Link']
        }),
        deleteLink: builder.mutation<any, string>({
            query(id) {
                return {
                    url: `/api/links/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['Link']
        }),
        editLink: builder.mutation<any, { id: string; customSuffix: string }>({
            query({ id, customSuffix }) {
                return {
                    url: `/api/links/${id}`,
                    method: 'PUT',
                    body: { customSuffix }
                }
            },
            invalidatesTags: ['Link']
        })
    })
})

export const { useGenerateLandingMutation, useGetLinksQuery, useDeleteLinkMutation, useEditLinkMutation } = generateLinkApi