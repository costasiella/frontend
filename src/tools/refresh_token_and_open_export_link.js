import CSLS from './cs_local_storage'
import { CSAuth } from './authentication';

// Create a link element and simulate a click. This prevents having to redirect creating a pop up that might be blocked.
function download(dataurl) {
  let link = document.createElement("a");
  link.href = dataurl
  // link.setAttribute('download', '')
  // Put the link in the dom and click it
  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export function refreshTokenAndOpenExportLinkInNewTab(doTokenRefresh, history, exportUrl) {  
  const refreshToken = localStorage.getItem(CSLS.AUTH_REFRESH_TOKEN)

  doTokenRefresh({ variables: { refreshToken: refreshToken }})
    .then(({data}) => {
      CSAuth.updateTokenInfo(data.refreshToken)
      const token = data.refreshToken.token
      //Add authentication headers in URL
      var url = `${exportUrl}/${token}`;

      // window.open(url, "_blank")
      download(url);
    }).catch((error) => {
      console.log(error)
      history.push("/#/user/login")
    })
}
