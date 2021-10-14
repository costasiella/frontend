import CSLS from './cs_local_storage'
import { CSAuth } from './authentication';

export function refreshTokenAndOpenExportLinkInNewTab(doTokenRefresh, history, exportUrl) {  
  const refreshToken = localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN)

  doTokenRefresh({ variables: { refreshToken: refreshToken }})
    .then(({data}) => {
      CSAuth.updateTokenInfo(data.refreshToken)
      const token = data.refreshToken.token
      //Add authentication headers in URL
      var url = `${exportUrl}/${token}`;

      window.open(url, "_blank")
      // history.push(export_url)
    }).catch((error) => {
      console.log(error)
      history.push("/#/user/login")
    })
}
