import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Card,
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import SettingsBack from "../../SettingsBack"

function SettingsMailTemplatesBase({ t, children, headerSubTitle, help={} }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("general.settings")} subTitle={`${t('settings.mail.title')} ${headerSubTitle}`}>
            <div className="page-options d-flex">
              <SettingsBack returnUrl="/settings/mail/templates" />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={8}>
              {children}
            </Grid.Col>
            <Grid.Col md={4}>
              <Card title={t('general.subject')}>
                <Card.Body>
                  {help.subject}
                </Card.Body>
              </Card>
              <Card title={t('general.title')}>
                <Card.Body>
                  {help.title}
                </Card.Body>
              </Card>
              <Card title={t('general.description')}>
                <Card.Body>
                  {help.description}
                </Card.Body>
              </Card>
              <Card title={t('general.content')}>
                <Card.Body>
                  {help.content}
                </Card.Body>
              </Card>
              <Card title={t('general.comments')}>
                <Card.Body>
                  {help.comments}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(SettingsMailTemplatesBase))