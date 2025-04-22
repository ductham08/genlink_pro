// src/app/api/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                // Kiểm tra và làm sạch token
                const cleanToken = token.trim();
                if (cleanToken) {
                    headers.set('Authorization', `Bearer ${cleanToken}`);
                }
            } catch (error) {
                console.error('Error setting authorization header:', error);
            }
        }
        return headers;
    }
});

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    try {
        let result = await baseQuery(args, api, extraOptions);

        // Chỉ xử lý lỗi 401 khi không phải là request đăng nhập
        const isLoginRequest = typeof args === 'string' 
            ? args.includes('/api/login')
            : args.url?.includes('/api/login');

        if (result.error?.status === 401 && !isLoginRequest) {
            // Thử refresh token hoặc xử lý token hết hạn ở đây
            // Nếu không thể refresh token, mới clear session
            const token = sessionStorage.getItem('token');
            if (!token) {
                sessionStorage.clear();
                window.location.href = '/login';
            }
            return result;
        }

        return result;
    } catch (error) {
        // Xử lý lỗi khi gọi API
        console.error('API call error:', error);
        return {
            error: {
                status: 401,
                data: { message: 'Có lỗi xảy ra khi gọi API!' }
            }
        };
    }
};
