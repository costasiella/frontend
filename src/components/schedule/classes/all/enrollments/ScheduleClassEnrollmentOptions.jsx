import React from 'react'
import { useMutation, useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Card } from 'tabler-react';

import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, CREATE_SCHEDULE_ITEM_ENROLLMENT } from './queries'
import { SCHEDULE_CLASS_ENROLLMENT_SCHEMA } from './yupSchema'
import ScheduleClassEnrollmentForm from './ScheduleClassEnrollmentForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassEnrollmentBack from "./ScheduleClassEnrollmentBack"


function ScheduleClassEnrollmentOptions({ t, history, match }) {
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/enrollments/${classId}`
  const menuActiveLink = "enrollments" 
  const pageHeaderButtonList = <ScheduleClassEnrollmentBack classId={classId} />
  // Fetch 

  const [addScheduleClassEnrollment] = useMutation(CREATE_SCHEDULE_ITEM_ENROLLMENT)

  return (
    <ClassEditBase
      defaultCard={false}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <h4>Enrollment options for (account here)</h4>
      {/* {enrollments.edges.map(({ node }) => (

      )} */}
    </ClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassEnrollmentOptions))