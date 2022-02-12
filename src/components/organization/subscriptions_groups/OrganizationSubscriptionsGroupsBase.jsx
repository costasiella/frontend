import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import ButtonAdd from '../../ui/ButtonAdd'
import ButtonBack from '../../ui/ButtonBack'



function OrganizationSubscriptionsGroupsBase({ 
  t, history, children, showAdd=false, returnUrl="/organization/subscriptions" 
}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
              {(showAdd) ? 
                <HasPermissionWrapper permission="add"
                                      resource="organizationsubscriptiongroup">
                  <ButtonAdd addUrl="/organization/subscriptions/groups/add" className="ml-2" />
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


export default withTranslation()(withRouter(OrganizationSubscriptionsGroupsBase))