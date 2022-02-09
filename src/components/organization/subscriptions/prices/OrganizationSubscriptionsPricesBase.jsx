import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Container,
  Grid,
  Page,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import ButtonAdd from "../../../ui/ButtonAdd"
import ButtonBack from '../../../ui/ButtonBack'


function OrganizationSubscriptionsPricesBase ({ t, history, match, children, showAdd=false, returnUrl="/organization/subscriptions" }) {
  const subscriptionId = match.params.subscription_id

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
              {(showAdd) ?
                <HasPermissionWrapper permission="add"
                                      resource="organizationsubscriptionprice">
                  <ButtonAdd addUrl={`/organization/subscriptions/prices/add/${subscriptionId}`} className="ml-2" />
                </HasPermissionWrapper>
              : "" }
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

export default withTranslation()(withRouter(OrganizationSubscriptionsPricesBase))
