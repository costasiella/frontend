import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Container,
  Grid,
  Page
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"


function FinanceInvoiceEditToBase({t, match, history, children, invoiceNumber}) {
  const pageTitle = t('finance.invoice.edit_to.title') + ' #' + invoiceNumber && invoiceNumber

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

export default withTranslation()(withRouter(FinanceInvoiceEditToBase))