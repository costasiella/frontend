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


function ScheduleShiftEditBase({ t, match, history, children, sidebarButton="", subTitle="" }) {
  // const scheduleItemId = match.params.class_id
  // const classDate = match.params.date

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('schedule.title')} subTitle={subTitle}>
            <div className="page-options d-flex">       
              <ScheduleShiftBack />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {sidebarButton}
              {/* <ClassMenu 
                scheduleItemId={scheduleItemId}
                class_date={classDate}
                activeLink={menuActiveLink}
              /> */}
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ScheduleShiftEditBase))