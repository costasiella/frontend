// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

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


function OrganizationClasstypesBase({t, history, children}) {
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
              <HasPermissionWrapper permission="add"
                                    resource="organizationclasstype">
                <Button color="primary btn-block mb-6"
                        onClick={() => history.push("/organization/classtypes/add")}>
                  <Icon prefix="fe" name="plus-circle" /> {t('organization.classtypes.add')}
                </Button>
              </HasPermissionWrapper>
              <OrganizationMenu activeLink='classtypes'/>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>          
  )
}

export default withTranslation()(withRouter(OrganizationClasstypesBase))