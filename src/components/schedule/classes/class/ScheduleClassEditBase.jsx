import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import ScheduleClassBack from "./ScheduleClassBack"
import ClassMenu from "./ClassMenu"


function ScheduleClassEditBase({ t, match, history, children, subTitle="", menuActiveLink="" }) {
  const scheduleItemId = match.params.class_id
  const classDate = match.params.date

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('schedule.title')} subTitle={subTitle}>
            <div className="page-options d-flex">       
              <ScheduleClassBack />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col xs={12} sm={9} md={9}>
              {children}
            </Grid.Col>
            <Grid.Col xs={12} sm={3} md={3}>
              <ClassMenu 
                scheduleItemId={scheduleItemId}
                class_date={classDate}
                activeLink={menuActiveLink}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ScheduleClassEditBase))