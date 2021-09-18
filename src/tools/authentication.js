import CSLS from "./cs_local_storage"


export const CSAuth = {
    login(tokenData) {
        localStorage.setItem(CSLS.AUTH_TOKEN, tokenData.token)
        localStorage.setItem(CSLS.AUTH_TOKEN_EXP, tokenData.payload.exp)
        localStorage.setItem(CSLS.AUTH_TOKEN_ORIGIAT, tokenData.payload.origIat)
        localStorage.setItem(CSLS.AUTH_REFRESH_TOKEN, tokenData.refreshToken)
        localStorage.setItem(CSLS.AUTH_REFRESH_TOKEN_EXP, tokenData.refreshExpiresIn)
        localStorage.removeItem(CSLS.AUTH_LOGIN_NEXT)
    },
    updateTokenInfo(refreshTokenData) {
        console.log("Token payload:")
        console.log(refreshTokenData)
        localStorage.setItem(CSLS.AUTH_TOKEN, refreshTokenData.token)
        localStorage.setItem(CSLS.AUTH_TOKEN_EXP, refreshTokenData.payload.exp)
        localStorage.setItem(CSLS.AUTH_TOKEN_ORIGIAT, refreshTokenData.payload.origIat)
        localStorage.setItem(CSLS.AUTH_REFRESH_TOKEN, refreshTokenData.refreshToken)
        localStorage.setItem(CSLS.AUTH_REFRESH_TOKEN_EXP, refreshTokenData.refreshExpiresIn)
    },
    cleanup() {
        // Like logging out, but don't unset next url. 
        // This function is used when a refreshToken has expired
        localStorage.removeItem(CSLS.AUTH_TOKEN)
        localStorage.removeItem(CSLS.AUTH_TOKEN_EXP)
        localStorage.removeItem(CSLS.AUTH_TOKEN_ORIGIAT)
        localStorage.removeItem(CSLS.AUTH_REFRESH_TOKEN)
        localStorage.removeItem(CSLS.AUTH_REFRESH_TOKEN_EXP)
    },
    logout(expired=false) {
        if (!expired) {
            // Manual logout, remove everything
            this.cleanup()
            localStorage.removeItem(CSLS.AUTH_LOGIN_NEXT)
        }        
    }
}
