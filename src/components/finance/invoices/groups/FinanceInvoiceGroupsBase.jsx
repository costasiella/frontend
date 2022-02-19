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

import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import ButtonAdd from '../../../ui/ButtonAdd'
import ButtonBack from '../../../ui/ButtonBack'


function FinanceInvoiceGroupsBase({t, history, children, showEditBack=false}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              {(showEditBack) ? 
                // Back for add or edit component
                <ButtonBack returnUrl="/finance/invoices/groups" className="mr-2" />
              :
                // Back for list
                <ButtonBack returnUrl="/finance/invoices" className="mr-2" />
              }
              <Link to="/finance/invoices/groups/defaults" 
                    className='btn btn-secondary mr-2'>
                  <Icon prefix="fe" name="settings" /> {t('finance.invoice_groups_defaults.title')}
              </Link> 
              <HasPermissionWrapper permission="add"
                                      resource="financeinvoicegroup">
                <ButtonAdd addUrl="/finance/invoices/groups/add" />
              </HasPermissionWrapper>
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


export default withTranslation()(withRouter(FinanceInvoiceGroupsBase))