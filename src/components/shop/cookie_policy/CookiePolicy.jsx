import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Card, 
} from "tabler-react";
import CookiePolicyBase from "./CookiePolicyBase"


function CookiePolicy({ t, match, history }) {
  return (
    <CookiePolicyBase>
      <Card>
        <Card.Body>
          {t("cookie_policy.policy_text")}
        </Card.Body>
      </Card>
    </CookiePolicyBase>
  )
}


export default withTranslation()(withRouter(CookiePolicy))
