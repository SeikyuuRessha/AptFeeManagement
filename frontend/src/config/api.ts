import axios from "axios";
import { jwtDecode } from "jwt-decode";

import jwtManager from "../helpers/jwtManager";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

api.interceptors.request.use(
    async (config) => {
        const { accessToken, refreshToken } = jwtManager.getTokens();

        if ((accessToken && refreshToken) && (accessToken !="undefined")) {
            console.log("Access Token:", accessToken, typeof accessToken);
            console.log("Refresh Token:", refreshToken, typeof refreshToken);
            const decodedToken = jwtDecode(accessToken);

            if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
                const { data } = await axios.get(`${BASE_URL}/auth/refresh`, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                if (data.code === 0) {
                    jwtManager.removeTokens();
                    return config;
                }

                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = data.data;
                jwtManager.setTokens(newAccessToken, newRefreshToken);
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } else {
            jwtManager.removeTokens();
        }
        console.log("Request Config:", config);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default api;
