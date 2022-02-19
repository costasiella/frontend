import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Grid,
  Card
} from "tabler-react";

import ClasspassCheckinButton from "./ScheduleClassBookClasspassBtn"


function ScheduleClassBookClasspasses({ 
  t, 
  match, 
  history, 
  classpasses,  
  locationId,
  onClickCheckin=f=>f ,
  returnTo="schedule_classes"
}) {

  return (
    classpasses.map((classpass) =>(
      <Grid.Col md={3}>
        <Card 
          statusColor="blue"
          title={t("general.classpass")} >
        <Card.Body>
          <b>{classpass.accountClasspass.organizationClasspass.name}</b><br />
          <span className="text-muted">
            {t('general.classes_remaining')}: {classpass.accountClasspass.classesRemainingDisplay} <br />
            {t('general.valid_until')}: {moment(classpass.accountClasspass.dateEnd).format('LL')} <br />
          </span>
        </Card.Body>
        <Card.Footer>
          {(!classpass.allowed) ? t('schedule.classes.class.book.classpass_not_allowed') :
            <ClasspassCheckinButton classpass={classpass} returnTo={returnTo} locationId={locationId} />
          }
        </Card.Footer>
        </Card>
      </Grid.Col>
    ))
  )
}


export default withTranslation()(withRouter(ScheduleClassBookClasspasses))

