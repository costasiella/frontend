import React, {Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react";
import HomeItemButton from "../../ui/HomeItemButton"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"


class ScheduleHome extends Component {
  constructor(props) {
    super(props)
    console.log("Schedule home props:")
    console.log(props)
  }

  render() {
    const t = this.props.t
    const linkTitle = t('general.manage')

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("schedule.title")} />
            <Grid.Row>
              <Grid.Col md={12}>
                <Grid.Row>
                  <HasPermissionWrapper
                    resource="scheduleclass"
                    permission="view"
                  >
                    <Grid.Col xs={12} sm={6} md={3} lg={3}>
                      <Card>
                        <Card.Body>
                          <h5>{t("schedule.classes.title")}</h5>
                          {t("schedule.classes.explanation")}
                          <br /><br />
                          <HomeItemButton linkTitle={linkTitle} link="/schedule/classes" />
                        </Card.Body>
                      </Card>
                    </Grid.Col>
                  </HasPermissionWrapper>
                  <HasPermissionWrapper
                    resource="scheduleevent"
                    permission="view"
                  >
                    <Grid.Col xs={12} sm={6}  md={3} lg={3}>
                      <Card>
                        <Card.Body>
                          <h5>{t("schedule.events.title")}</h5>
                          {t("schedule.events.explanation")}
                          <br /><br />
                          <HomeItemButton linkTitle={linkTitle} link="/schedule/events" />
                        </Card.Body>
                      </Card>
                    </Grid.Col>
                  </HasPermissionWrapper>
                  <HasPermissionWrapper
                    resource="scheduleshift"
                    permission="view"
                  >
                    <Grid.Col xs={12} sm={6}  md={3} lg={3}>
                      <Card>
                        <Card.Body>
                          <h5>{t("schedule.shifts.title")}</h5>
                          {t("schedule.shifts.explanation")}
                          <br /><br />
                          <HomeItemButton linkTitle={linkTitle} link="/schedule/shifts" />
                        </Card.Body>
                      </Card>
                    </Grid.Col>
                  </HasPermissionWrapper>
                  {/* <HasPermissionWrapper
                    resource="scheduleappointment"
                    permission="view"
                  >
                    <Grid.Col md={3} lg={3}>
                      <Link to='/schedule/appointments')}>
                        <StampCard header={<small>{t('schedule.appointments.title')}</small>} footer={t('')} color="blue" icon="calendar" />
                      </div>
                    </Grid.Col>
                  </HasPermissionWrapper> */}
                </Grid.Row>
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(ScheduleHome))