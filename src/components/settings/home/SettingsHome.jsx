import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import {
  Card,
  Container,
  Grid,
  Page,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HomeItemButton from "../../ui/HomeItemButton"

function SettingsHome({ t, match, params }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('settings.title')} />
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.general.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.general.date_time.title")}</h5>
                  {t("settings.general.date_time.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/general/datetime" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.general.system.title")}</h5>
                  {t("settings.general.system.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/general/system" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.workflow.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.workflow.class_booking.title")}</h5>
                  {t("settings.workflow.class_booking.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/workflow/class_booking" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.workflow.subscription_pauses.title")}</h5>
                  {t("settings.workflow.subscription_pauses.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/workflow/subscription_pauses" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.workflow.trial.title")}</h5>
                  {t("settings.workflow.trial.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/workflow/trial" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.workflow.shop.title")}</h5>
                  {t("settings.workflow.shop.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/workflow/shop" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.finance.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.finance.currency.title")}</h5>
                  {t("settings.finance.currency.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/finance/currency" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.finance.bank_accounts.title")}</h5>
                  {t("settings.finance.bank_accounts.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/finance/bank_accounts" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.mail.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.mail.mailchimp_lists.title")}</h5>
                  {t("settings.mail.mailchimp_lists.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/mail/mailchimp_lists" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.mail.templates.title")}</h5>
                  {t("settings.mail.templates.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/mail/templates" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.mail.notifications.title")}</h5>
                  {t("settings.mail.notifications.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/mail/notifications" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.shop.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.shop.features.title")}</h5>
                  {t("settings.shop.features.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/shop/features/" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.shop.account_profiles.title")}</h5>
                  {t("settings.shop.account_profiles.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/shop/account_profiles/" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.integration.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.integration.mailchimp.title")}</h5>
                  {t("settings.integration.mailchimp.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/integration/mailchimp/" />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.integration.mollie.title")}</h5>
                  {t("settings.integration.mollie.explanation")}
                  <br /><br />
                  <HomeItemButton link="/settings/integration/mollie/" />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={12}>
              <h4>{t("settings.about.title")}</h4>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.about.about.title")}</h5>
                  {t("settings.about.explanation")}
                  <br /><br />
                  <HomeItemButton 
                    link="/settings/about" 
                    linkTitle={t("View info")}
                  />
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card>
                <Card.Body>
                  <h5>{t("settings.about.diagnostics.title")}</h5>
                  {t("settings.about.diagnostics.explanation")}
                  <br /><br />
                  <HomeItemButton 
                    link="/settings/diagnostics" 
                    linkTitle={t("View info")}
                  />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(SettingsHome))