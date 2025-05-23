const TOKENS_KEY = {
    at: "accessToken",
    rt: "refreshToken",
};

class JwtManager {
    setTokens(at: string, rt: string) {
        if (typeof window !== "undefined") {
            localStorage.setItem(TOKENS_KEY.at, at);
            localStorage.setItem(TOKENS_KEY.rt, rt);
        }
    }

    getTokens() {
        if (typeof window !== "undefined") {
            return {
                accessToken: localStorage.getItem(TOKENS_KEY.at),
                refreshToken: localStorage.getItem(TOKENS_KEY.rt),
            };
        } else {
            return {
                accessToken: null,
                refreshToken: null,
            };
        }
    }

    removeTokens() {
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKENS_KEY.at);
            localStorage.removeItem(TOKENS_KEY.rt);
        }
    }
}

const jwtManager = new JwtManager();

export default jwtManager;
