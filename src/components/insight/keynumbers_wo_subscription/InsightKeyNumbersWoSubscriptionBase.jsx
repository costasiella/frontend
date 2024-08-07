import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Container,
  Grid,
  Page
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"
import InsightBackHome from '../InsightBackHome'

function InsightKeyNumbersWoSubscriptionBase ({ t, history, children }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("insight.title")} subTitle={t("insight.keynumbers_wo_subscription.title")}>
            <div className="page-options d-flex">
              <InsightBackHome />
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

export default withTranslation()(withRouter(InsightKeyNumbersWoSubscriptionBase))