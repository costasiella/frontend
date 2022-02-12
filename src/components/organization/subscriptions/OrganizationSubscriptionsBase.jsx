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



function OrganizationSubscriptionsBase({t, children, showBack=false}) {
  const activeLink = "subscriptions"

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              {(showBack) ? 
                <ButtonBack returnUrl="/organization/subscriptions" />
              :
                <React.Fragment>
                  <Link to="/organization/subscriptions/groups" 
                        className='btn btn-secondary ml-2 mr-2'>
                      <Icon prefix="fe" name="folder" /> {t('general.groups')}
                  </Link>
                  <HasPermissionWrapper permission="add"
                                      resource="organizationsubscription">
                    <ButtonAdd addUrl="/organization/subscriptions/add" />
                  </HasPermissionWrapper>
                </React.Fragment>
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


export default withTranslation()(withRouter(OrganizationSubscriptionsBase))