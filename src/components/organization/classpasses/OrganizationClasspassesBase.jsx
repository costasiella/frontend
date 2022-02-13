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
import ButtonAdd from "../../ui/ButtonAdd"
import ButtonBack from "../../ui/ButtonBack"


function OrganizationClasspassesBase({t, children, showBack=false}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")}>
            <div className="page-options d-flex">
              {(showBack) ?
                <ButtonBack returnUrl="/organization/classpasses" />           
              :
                <React.Fragment>
                  <Link to="/organization/classpasses/groups" 
                    className='btn btn-secondary mr-2'>
                    <Icon prefix="fe" name="folder" /> {t('general.groups')}
                  </Link>
                  <HasPermissionWrapper permission="add"
                                      resource="organizationclasspass">
                    <ButtonAdd addUrl="/organization/classpasses/add" />
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


export default withTranslation()(withRouter(OrganizationClasspassesBase))