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
import ButtonAdd from "../../../ui/ButtonAdd"
import ButtonBack from "../../../ui/ButtonBack"


function SettingsMailMailChimpListsBase({ t, history, children, showBack=false }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("settings.title")} subTitle={t("settings.mail.title")} >
            <div className='page-options d-flex'>
              {(showBack) ?
                <ButtonBack returnUrl="/settings/mail/mailchimp_lists" />  
              :
                <HasPermissionWrapper permission="add"
                                      resource="systemmailchimplist">
                  <ButtonAdd addUrl="/settings/mail/mailchimp_lists/add" />
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


export default withTranslation()(withRouter(SettingsMailMailChimpListsBase))