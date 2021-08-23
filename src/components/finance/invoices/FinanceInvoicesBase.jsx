// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Container,
  Grid,
  Icon,
  Page
} from "tabler-react";

import SiteWrapper from '../../SiteWrapper'
import FinanceInvoicesFilter from "./FinanceInvoicesFilter"
import FinanceMenu from "../FinanceMenu"


function FinanceInvoicesBase ({ t, history, children, refetch }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              <Link to="/finance/invoices/groups" 
                    className='btn btn-outline-secondary btn-sm'>
                <Icon prefix="fe" name="folder" /> {t('general.groups')}
              </Link>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              <h5 className="mt-2 pt-1">{t("general.filter")}</h5>
              <FinanceInvoicesFilter refetch={refetch}/>
              <h5>{t("general.menu")}</h5>
              <FinanceMenu activeLink='invoices'/>
            </Grid.Col>
          </Grid.Row>
          </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(FinanceInvoicesBase))