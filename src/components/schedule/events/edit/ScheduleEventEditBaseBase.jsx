import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Container,
  Grid
} from "tabler-react";

import SiteWrapper from "../../../SiteWrapper"
import ScheduleEventEditMenu from "./ScheduleEventEditMenu"
import ButtonBack from '../../../ui/ButtonBack';

function ScheduleEventEditBaseBase({ 
  t, 
  match, 
  history, 
  children, 
  returnUrl="/schedule/events", 
  pageHeaderOptions, 
  activeLink,
  pageSubTitle
 }) {
  const eventId = match.params.event_id

  return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("schedule.events.title")} subTitle={pageSubTitle}>
              <div className="page-options d-flex">
                {/* Page options can go here... */}
                <ButtonBack returnUrl={returnUrl} />
                { pageHeaderOptions }
              </div>
            </Page.Header>
            <Grid.Row>
            <Grid.Col md={9}>
              { children }
            </Grid.Col>
            <Grid.Col md={3}>
              <ScheduleEventEditMenu activeLink={activeLink} eventId={eventId}/>
            </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
      </SiteWrapper>
  )
}

export default withTranslation()(withRouter(ScheduleEventEditBaseBase))