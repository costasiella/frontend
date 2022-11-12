import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
// import { Link } from "react-router-dom"

import {
  // Button,
  Container,
  Grid,
  Page
} from "tabler-react";

import SiteWrapper from '../../SiteWrapper'
import ButtonAdd from '../../ui/ButtonAdd';
import ButtonBack from '../../ui/ButtonBack';
import ButtonExport from '../../ui/ButtonExport';


function FinanceExpensesBase ({ t, history, children, refetch, returnUrl }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              {returnUrl && <ButtonBack returnUrl={returnUrl} />}
              {/* <FinanceInvoicesFilter refetch={refetch}/> */}
              <ButtonExport url="/finance/expenses/export" className='mr-2' />
              <ButtonAdd addUrl="/finance/expenses/add" className='mr-2' />
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

export default withTranslation()(withRouter(FinanceExpensesBase))