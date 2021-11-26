// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import ScheduleClassBack from "../ScheduleClassBack"
import ClassMenu from "../ClassMenu"


function ScheduleClassEditBase({ t, match, history, subTitle="", menuActiveLink="" }) {
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
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
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