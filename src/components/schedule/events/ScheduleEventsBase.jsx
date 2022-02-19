import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Container,
  Grid
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
// import ShopAccountBack from "../ShopAccountBack"


function ScheduleEventsBase({ t, match, history, children, pageHeaderButtonList="" }) {
  return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("schedule.title")} subTitle={t("schedule.events.title")}>
              <div className="page-options d-flex">
                {pageHeaderButtonList}
              </div>
            </Page.Header>
            <Grid.Row>
            <Grid.Col md={12}>
              { children }
            </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
      </SiteWrapper>
  )
}

export default withTranslation()(withRouter(ScheduleEventsBase))
