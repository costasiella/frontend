import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
// import HasPermissionWrapper from "../../../HasPermissionWrapper"
import ScheduleShiftBack from "./ScheduleShiftBack"


function ScheduleShiftEditBase({ t, match, history, children, pageHeaderButtonList="", subTitle="" }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('schedule.title')} subTitle={subTitle}>
            <div className="page-options d-flex">       
              <ScheduleShiftBack />
              {pageHeaderButtonList}
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


export default withTranslation()(withRouter(ScheduleShiftEditBase))