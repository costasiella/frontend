import React from 'react'
import { useMutation, useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Dimmer, Grid } from 'tabler-react';

import ScheduleClassEnrollSubscriptions from "./ScheduleClassEnrollSubscriptions"
import { GET_SCHEDULE_ITEM_ENROLLMENT_OPTIONS_QUERY, CREATE_SCHEDULE_ITEM_ENROLLMENT } from './queries'
import ClassEditBase from "../ClassEditBase"
import ButtonBack from '../../../../ui/ButtonBack';


function ScheduleClassEnrollmentOptions({ t, history, match }) {
  const classId = match.params.class_id
  const accountId = match.params.account_id
  const returnUrl = `/schedule/classes/all/enrollments/${classId}/search`
  const menuActiveLink = "enrollments" 
  const pageHeaderButtonList = <ButtonBack returnUrl={returnUrl} />
  const { loading, error, data } = useQuery(GET_SCHEDULE_ITEM_ENROLLMENT_OPTIONS_QUERY, {
    variables: {
      account: accountId,
      scheduleItem: classId,
      
    }
  })
  const [addScheduleClassEnrollment] = useMutation(CREATE_SCHEDULE_ITEM_ENROLLMENT)

  if (loading) return (
    <ClassEditBase
    defaultCard={false}
    menuActiveLink={menuActiveLink}
    pageHeaderButtonList={pageHeaderButtonList}
    >
      <Dimmer loader={true} active={true} />
    </ClassEditBase>
  )

  if (error) return (
    <ClassEditBase
      defaultCard={false}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBase>
  )
  
  const account = data.account
  const subscriptions = data.scheduleClassEnrollmentOptions.subscriptions

  
  return (
    <ClassEditBase
      defaultCard={false}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <h4>{t('schedule.classes.enrollments.enrollment_options_for')} {account.fullName}</h4>
      <Grid.Row cards deck>
        <ScheduleClassEnrollSubscriptions subscriptions={subscriptions} />
      </Grid.Row>
    </ClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassEnrollmentOptions))