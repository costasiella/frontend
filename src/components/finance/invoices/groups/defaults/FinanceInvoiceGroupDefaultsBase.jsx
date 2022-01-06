import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Page,
  Grid,
  Icon,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"


function FinanceInvoiceGroupsDefaultsBase({ t, history, children }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              <Link to="/finance/invoices/groups" 
                    className='btn btn-outline-secondary btn-sm'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back_to')} {t('finance.invoice_groups.title')}
              </Link>
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
};

export default withTranslation()(withRouter(FinanceInvoiceGroupsDefaultsBase))