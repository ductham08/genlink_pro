import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';
import { User } from '../interfaces/user';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: customBaseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => '/api/users/me',
            providesTags: ['User']
        })
    })
});

export const { useGetCurrentUserQuery } = userApi; 