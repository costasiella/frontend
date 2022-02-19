import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import ButtonAdd from "../../ui/ButtonAdd"
import ButtonBack from "../../ui/ButtonBack"


function OrganizationDiscoveriesBase({ t, history, children, showBack=false }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("organization.title")} >
            <div className='page-options d-flex'>
              {(showBack) ?
                <ButtonBack returnUrl="/organization/discoveries" />  
              :
                <HasPermissionWrapper permission="add"
                                      resource="organizationdiscovery">
                  <ButtonAdd addUrl="/organization/discoveries/add" />
                </HasPermissionWrapper>
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
)}


export default withTranslation()(withRouter(OrganizationDiscoveriesBase))