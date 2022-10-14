import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"


function FinanceQuoteEditBase({t, match, history, children}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
          <Container>
            {children}
          </Container>
      </div>
    </SiteWrapper>
  ) 
}

export default withTranslation()(withRouter(FinanceQuoteEditBase))