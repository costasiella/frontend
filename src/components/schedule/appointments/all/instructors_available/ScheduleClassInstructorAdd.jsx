// @flow

import React from 'react'
import { Query, Mutation } from "@apollo/client";
import { gql } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, GET_INPUT_VALUES_QUERY } from './queries'
import { SCHEDULE_CLASS_INSTRUCTOR_SCHEMA } from './yupSchema'
import ScheduleClassInstructorForm from './ScheduleClassInstructorForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import SiteWrapper from "../../../../SiteWrapper"

import ClassEditBase from "../ClassEditBase"
import ScheduleClassInstructorBack from "./ScheduleClassInstructorBack"


const ADD_SCHEDULE_CLASS_INSTRUCTOR = gql`
  mutation CreateScheduleItemAccount($input:CreateScheduleItemAccountInput!) {
    createScheduleItemAccount(input:$input) {
      scheduleItemAccount {
        id
      } 
    }
  }
`

const return_url = "/schedule/classes/all/instructors/"

const ScheduleClassInstructorAdd = ({ t, history, match }) => (
  <SiteWrapper>
    <div className="my-3 my-md-5">
      <Query query={GET_INPUT_VALUES_QUERY} >
        {({ loading, error, data, refetch }) => {
          // Loading
          if (loading) return <p>{t('general.loading_with_dots')}</p>
          // Error
          if (error) {
            console.log(error)
            return <p>{t('general.error_sad_smiley')}</p>
          }

          console.log('query data')
          console.log(data)
          const inputData = data

          return (
            <ClassEditBase 
              card_title={t('schedule.classes.instructors.title_add')}
              menu_activeLink="instructors"
              sidebar_button={<ScheduleClassInstructorBack classId={match.params.class_id} />}
            >
              <Mutation mutation={ADD_SCHEDULE_CLASS_INSTRUCTOR} onCompleted={() => history.push(return_url + match.params.class_id)}> 
                {(addScheduleClassInstructor, { data }) => (
                    <Formik
                        initialValues={{ 
                          price: "", 
                          dateStart: new Date() ,
                          account: "",
                          role: "",
                          account2: "",
                          role2: "",
                        }}
                        validationSchema={SCHEDULE_CLASS_INSTRUCTOR_SCHEMA}
                        onSubmit={(values, { setSubmitting }) => {

                            let dateEnd
                            if (values.dateEnd) {
                              dateEnd = dateToLocalISO(values.dateEnd)
                            } else {
                              dateEnd = values.dateEnd
                            }

                            addScheduleClassInstructor({ variables: {
                              input: {
                                scheduleItem: match.params.class_id,
                                account: values.account,
                                role: values.role,
                                account2: values.account2,
                                role2: values.role2,
                                dateStart: dateToLocalISO(values.dateStart),
                                dateEnd: dateEnd
                              }
                            }, refetchQueries: [
                                {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }},
                                // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
                            ]})
                            .then(({ data }) => {
                                console.log('got data', data);
                                toast.success((t('schedule.classes.instructors.toast_add_success')), {
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
                          <ScheduleClassInstructorForm
                            inputData={inputData}
                            isSubmitting={isSubmitting}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            values={values}
                            return_url={return_url + match.params.class_id}
                          />
                        )}
                    </Formik>
                )}
              </Mutation>
            </ClassEditBase>
          )
        }}
      </Query>
    </div>
  </SiteWrapper>
)


export default withTranslation()(withRouter(ScheduleClassInstructorAdd))