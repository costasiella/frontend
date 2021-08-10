// @flow

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
import OrganizationMenu from "../OrganizationMenu"


function OrganizationSubscriptionsBase({t, children}) {
  const activeLink = "subscriptions"

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <Link to="/organization/subscriptions/groups" 
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
              <HasPermissionWrapper permission="add"
                                    resource="organizationsubscription">
                <Link to="/organization/subscriptions/add">
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="plus-circle" /> {t('organization.subscriptions.add')}
                  </Button>
                </Link>
              </HasPermissionWrapper>
              <OrganizationMenu activeLink={activeLink}/>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  ) 
}


export default withTranslation()(withRouter(OrganizationSubscriptionsBase))