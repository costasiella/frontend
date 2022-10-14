import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Container,
  Grid,
  Page
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"


function FinanceQuoteEditToBase({t, match, history, children, quoteNumber}) {
  const pageTitle = t('finance.quote.edit_to.title') + ' #' + quoteNumber && quoteNumber

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={pageTitle} />
            <Grid.Row md={12}>
              {children}
            </Grid.Row>
          </Container>
      </div>
    </SiteWrapper>
  ) 
}

export default withTranslation()(withRouter(FinanceQuoteEditToBase))