import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Button,
  Container,
  Grid,
  Page
} from "tabler-react";

import SiteWrapper from '../../SiteWrapper'
import ButtonExport from '../../ui/ButtonExport';
import FinanceInvoicesFilter from "./FinanceInvoicesFilter"


function FinanceInvoicesBase ({ t, history, children, refetch }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              <ButtonExport url="/finance/invoices/export" className='mr-2' />
              <Link to="/finance/invoices/groups">
                <Button
                  color="secondary"
                  icon="folder"
                >
                  {t('general.groups')}
                </Button>
              </Link>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
              <FinanceInvoicesFilter refetch={refetch}/>
              {children}
            </Grid.Col>
          </Grid.Row>
          </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceInvoicesBase))