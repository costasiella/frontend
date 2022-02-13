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


function FinancePaymentBatchCategoriesBase({t, history, children, showAdd=false, showBack=false}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")} >
            <div className={'page-options d-flex'}>
              {(showAdd) ?
                <HasPermissionWrapper permission="add"
                                      resource="financepaymentbatchcategory">
                  <ButtonAdd addUrl={'/finance/paymentbatchcategories/add'} />
                </HasPermissionWrapper>
                : "" 
              }
              {(showBack) ?
                <HasPermissionWrapper permission="view"
                                      resource="financepaymentbatchcategory">
                  <ButtonBack returnUrl="/finance/paymentbatchcategories" />
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

export default withTranslation()(withRouter(FinancePaymentBatchCategoriesBase))