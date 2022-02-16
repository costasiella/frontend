import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Page,
  Grid,
  Container,
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import ButtonAdd from "../../ui/ButtonAdd"
import ButtonBack from "../../ui/ButtonBack"


function FinancePaymentBatchesBase({t, history, match, children, showAdd=false, showBack=false, returnUrl=""}) {
  const batchType = match.params.batch_type

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")} >
            <div className='page-options d-flex'>
              {(showAdd) ?
                <HasPermissionWrapper permission="add"
                                      resource="financepaymentbatch">
                  <ButtonAdd addUrl={`/finance/paymentbatches/${batchType}/add_what`} />
                </HasPermissionWrapper>
                : "" 
              }
              {(showBack) ?
                <HasPermissionWrapper permission="view"
                                      resource="financepaymentbatch">
                  <ButtonBack returnUrl={returnUrl} />
                </HasPermissionWrapper>
                : "" 
              }
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
              {children}
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinancePaymentBatchesBase))