// src/app/api/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        sessionStorage.clear();
        window.location.href = '/login';
        return result;
    }

    return result;
};
