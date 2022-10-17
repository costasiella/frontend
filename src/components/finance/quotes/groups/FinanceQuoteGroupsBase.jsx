import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";

import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import ButtonAdd from '../../../ui/ButtonAdd'
import ButtonBack from '../../../ui/ButtonBack'


function FinanceQuoteGroupsBase({t, history, children, showEditBack=false}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("finance.title")}>
            <div className="page-options d-flex">
              {(showEditBack) ? 
                // Back for add or edit component
                <ButtonBack returnUrl="/finance/quotes/groups" className="mr-2" />
              :
                // Back for list
                <ButtonBack returnUrl="/finance/quotes" className="mr-2" />
              }
              <HasPermissionWrapper permission="add"
                                      resource="financequotegroup">
                <ButtonAdd addUrl="/finance/quotes/groups/add" />
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


export default withTranslation()(withRouter(FinanceQuoteGroupsBase))