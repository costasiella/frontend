import { CSAuth } from './authentication';
import { toast } from 'react-toastify'

// Create a link element and simulate a click. This prevents having to redirect creating a pop up that might be blocked.
function download(dataurl) {
  let link = document.createElement("a");
  link.href = dataurl
  link.target = "_blank"
  // Put the link in the DOM and click it
  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
}

export function refreshTokenAndOpenExportLinkInNewTab(t, doTokenRefresh, history, exportUrl) {  
  doTokenRefresh()
    .then(({data}) => {
      console.log(data)
      CSAuth.updateTokenInfo(data.refreshToken)

      // window.open(url, "_blank")
      download(exportUrl);
    }).catch((error) => {
      console.log(error)
      // history.push("/user/login")
      // Because safari doesn't deal with double clicks well, let the user refresh.
      // If there is no valid session, the user will be redirected to the sign-in.
      toast.error(t("general.error_try_refreshing"), {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
}
