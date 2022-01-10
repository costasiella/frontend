// @flow

import React, { Children } from 'react'
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
// import { confirmAlert } from 'react-confirm-alert'; // Import




function OrganizationClasspassesGroupsBase({ t, history, children, showBack=false }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              <Link to="/organization/classpasses" 
                    className='btn btn-outline-secondary btn-sm'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back_to')} {t('organization.classpasses.title')}
              </Link>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {(showBack) ?
                <Link to={"/organization/classpasses/groups"}>
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="chevrons-left" /> {t("general.back")}
                  </Button>
                </Link>
              :
                <HasPermissionWrapper permission="add"
                                      resource="organizationclasspassgroup">
                  <Button color="primary btn-block mb-6"
                          onClick={() => history.push("/organization/classpasses/groups/add")}>
                    <Icon prefix="fe" name="plus-circle" /> {t('organization.classpass_groups.add')}
                  </Button>
                </HasPermissionWrapper>              
              }
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(OrganizationClasspassesGroupsBase))