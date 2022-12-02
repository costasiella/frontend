import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Card, Icon } from 'tabler-react';

import AppSettingsContext from '../../../context/AppSettingsContext'
import { GET_ACCOUNT_ENROLLMENTS_QUERY } from "./queries"
import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, GET_SCHEDULE_ITEM_ENROLLMENT_QUERY, UPDATE_SCHEDULE_ITEM_ENROLLMENT } from '../../../schedule/classes/all/enrollments/queries'
import { SCHEDULE_CLASS_ENROLLMENT_SCHEMA } from '../../../schedule/classes/all/enrollments/yupSchema'
import ScheduleClassEnrollmentForm from '../../../schedule/classes/all/enrollments/ScheduleClassEnrollmentForm'
import { dateToLocalISO, getWeekdayNames } from '../../../../tools/date_tools'

import AccountEnrollmentsBase from "./AccountEnrollmentsBase"
import AccountEnrollmentBack from "./AccountEnrollmentBack"
import { getEnrollmentsListQueryVariables } from "../../../schedule/classes/all/enrollments/tools"


function AccountEnrollmentEdit({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  // const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const weekdayNames = getWeekdayNames(t)

  const id = match.params.id
  const accountId = match.params.account_id
  const returnUrl = `/relations/accounts/${accountId}/enrollments`
  let cardTitle = t('relations.account.enrollments.title_edit')
  const menuActiveLink = "enrollments"
  const pageHeaderButtonList = <AccountEnrollmentBack accountId={accountId} />

  const {loading, error, data} = useQuery(GET_SCHEDULE_ITEM_ENROLLMENT_QUERY, {
    variables: { id: id }
  })
  const [updateScheduleClassEnrollment] = useMutation(UPDATE_SCHEDULE_ITEM_ENROLLMENT)

  if (loading) return (
    <AccountEnrollmentsBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.loading_with_dots')}</p>
      </Card.Body>
    </AccountEnrollmentsBase>
  )

  if (error) return (
    <AccountEnrollmentsBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
      </Card.Body>
    </AccountEnrollmentsBase>
  )

//   { node.scheduleItem.organizationClasstype.name } <br />
//   <span className="text-muted">
//     <Icon name="clock" /> { weekdayNames[node.scheduleItem.frequencyInterval] } { moment(node.timeStart).format(timeFormat) } <br />
//     <Icon name="home" /> { node.scheduleItem.organizationLocationRoom.organizationLocation.name } {" - " } 

  console.log('query data')
  console.log(data)
  const scheduleItemEnrollment = data.scheduleItemEnrollment
  const account = data.scheduleItemEnrollment.accountSubscription.account
  const scheduleItem = data.scheduleItemEnrollment.scheduleItem

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  if (scheduleItemEnrollment.dateStart) {
    dateStart = new Date(scheduleItemEnrollment.dateStart)
  }
  
  let dateEnd = null
  if (scheduleItemEnrollment.dateEnd) {
    dateEnd = new Date(scheduleItemEnrollment.dateEnd)
  }

  console.log(scheduleItem)

  return (
    <AccountEnrollmentsBase 
      cardTitle={cardTitle}
      menuActiveLink="enrollments"
      pageHeaderButtonList={pageHeaderButtonList}
      account={account}
    >
      <Card title={cardTitle}>
        <Card.Body>
        <Card.Alert color="primary">
          <b>{scheduleItem.organizationClasstype.name}</b><br />
          <Icon name="clock" /> {" "} 
              { weekdayNames[scheduleItem.frequencyInterval] } {" "}
              { moment(`${scheduleItem.dateStart} ${scheduleItem.timeStart}`).format(timeFormat) } <br />
            <Icon name="home" /> {" "}
            { scheduleItem.organizationLocationRoom.organizationLocation.name } {" - " } 
            { scheduleItem.organizationLocationRoom.name }
        </Card.Alert>
        </Card.Body>
          <Formik
            initialValues={{  
              dateStart: dateStart,
              dateEnd: dateEnd,
            }}
            validationSchema={SCHEDULE_CLASS_ENROLLMENT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {

                let dateEnd
                if (values.dateEnd) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }

                updateScheduleClassEnrollment({ variables: {
                  input: {
                    id: match.params.id,
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateEnd
                  }
                }, refetchQueries: [
                    { query: GET_ACCOUNT_ENROLLMENTS_QUERY, 
                      variables: { account: accountId }},
                    // Also update enrollment list under schedule
                    {query: GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, 
                      variables: getEnrollmentsListQueryVariables(scheduleItem.id)},
                ]})
                .then(({ data }) => {
                    console.log('got data', data);
                    history.push(returnUrl)
                    toast.success((t('schedule.classes.enrollments.toast_edit_success')), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error)
                    setSubmitting(false)
                  })
            }}
            >
            {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
              <ScheduleClassEnrollmentForm
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              >
                {console.log(errors)}
              </ScheduleClassEnrollmentForm>
            )}
          </Formik>
      </Card>
    </AccountEnrollmentsBase>
  )
}


export default withTranslation()(withRouter(AccountEnrollmentEdit))