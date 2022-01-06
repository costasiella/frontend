// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"



function OrganizationClasstypesBase({t, history, children, showBack=false}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title="Organization" />
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {(showBack) ?
                <Link to="/organization/classtypes/">
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
                  </Button>
                </Link>
              :
                <HasPermissionWrapper permission="add"
                                      resource="organizationclasstype">
                  <Link to="/organization/classtypes/add">
                    <Button color="primary btn-block mb-6">
                      <Icon prefix="fe" name="plus-circle" /> {t('organization.classtypes.add')}
                    </Button>
                  </Link>
                </HasPermissionWrapper>
              }
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>          
  )
}

export default withTranslation()(withRouter(OrganizationClasstypesBase))