import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import moment from 'moment'

import { GET_INSIGHT_ACCOUNTS_INACTIVES, ADD_INSIGHT_ACCOUNTS_INACTIVE } from './queries'
// import { PAYMENT_METHOD_SCHEMA } from './yupSchema'


import {
  Card,
} from "tabler-react"

import { dateToLocalISO } from '../../../tools/date_tools'
import InsightInactiveAccountsBase from './InsightInactiveAccountsBase';
import InsightInactiveAccountsForm from './InsightInactiveAccountsForm'


function InsightInactiveAccountsAdd({ t, history }) {
  const returnUrl = "/insight/inactive_accounts"
  const [ addInsightAccountsInactive ] = useMutation(ADD_INSIGHT_ACCOUNTS_INACTIVE)

  return (
    <InsightInactiveAccountsBase showBack={true}>
      <Card title={t('insight.inactive_accounts.title_add')}>
        <Formik
          initialValues={{ noActivityAfterDate: new Date(moment().subtract(1, "year")) }}
          // validationSchema={PAYMENT_METHOD_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addInsightAccountsInactive({ variables: {
                input: {
                  noActivityAfterDate: dateToLocalISO(values.noActivityAfterDate), 
                }
              }, refetchQueries: [
                  {query: GET_INSIGHT_ACCOUNTS_INACTIVES}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('insight.inactive_accounts.toast_add_success')), {
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
          {({ isSubmitting, values, errors, setFieldTouched, setFieldValue }) => (
              <InsightInactiveAccountsForm
                isSubmitting={isSubmitting}
                errors={errors}
                values={values}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                returnUrl={returnUrl}
              />
          )}
        </Formik>
      </Card>
    </InsightInactiveAccountsBase>
  )
}


export default withTranslation()(withRouter(InsightInactiveAccountsAdd))