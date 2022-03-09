import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_SUBSCRIPTIONS_QUERY, GET_ACCOUNT_SUBSCRIPTION_QUERY, UPDATE_ACCOUNT_SUBSCRIPTION } from '../queries'
import { SUBSCRIPTION_SCHEMA } from '../yupSchema'
import AccountSubscriptionForm from '../AccountSubscriptionForm'

import { dateToLocalISO } from '../../../../../tools/date_tools'
import AccountSubscriptionEditBase from "./AccountSubscriptionEditBase"


function AccountSubscriptionEdit({t, match, history}) {
  const id = match.params.subscription_id
  const accountId = match.params.account_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "general"

  const { loading, error, data } = useQuery(GET_ACCOUNT_SUBSCRIPTION_QUERY, {
    variables: {
      archived: false,
      accountId: accountId,
      id: id
    }
  })

  const [ updateSubscription ] = useMutation(UPDATE_ACCOUNT_SUBSCRIPTION)
  
  if (loading) return (
    <AccountSubscriptionEditBase activeTab={activeTab} returnUrl={returnUrl}>
      {t("general.loading_with_dots")}
    </AccountSubscriptionEditBase>
  )
  if (error) return (
    <AccountSubscriptionEditBase activeTab={activeTab} returnUrl={returnUrl}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </AccountSubscriptionEditBase>
  )

  const inputData = data
  const initialdata = data.accountSubscription

  let initialPaymentMethod = ""
  if (initialdata.financePaymentMethod) {
    initialPaymentMethod = initialdata.financePaymentMethod.id
  }
  
  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  let dateEnd = null
  if (initialdata.dateStart) {
    dateStart = new Date(initialdata.dateStart)
  }
  if (initialdata.dateEnd) {
    dateEnd = new Date(initialdata.dateEnd)
  }

  return (
    <AccountSubscriptionEditBase activeTab={activeTab} returnUrl={returnUrl}>
      <Formik
        initialValues={{ 
          organizationSubscription: initialdata.organizationSubscription.id,
          financePaymentMethod: initialPaymentMethod,
          dateStart: dateStart,
          dateEnd: dateEnd,
          note: initialdata.note,
          registrationFeePaid: initialdata.registrationFeePaid
        }}
        validationSchema={SUBSCRIPTION_SCHEMA}
        onSubmit={(values, { setSubmitting }, errors) => {
            console.log('submit values:')
            console.log(values)
            console.log(errors)

            
            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            updateSubscription({ variables: {
              input: {
                id: id,
                organizationSubscription: values.organizationSubscription,
                financePaymentMethod: values.financePaymentMethod,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd,
                note: values.note,
                registrationFeePaid: values.registrationFeePaid
              }
            }, refetchQueries: [
                {query: GET_ACCOUNT_SUBSCRIPTIONS_QUERY, variables: {accountId: accountId}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('relations.account.subscriptions.toast_edit_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                setSubmitting(false)
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
        }}
        >
        {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
          <AccountSubscriptionForm
            inputData={inputData}
            isSubmitting={isSubmitting}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          >
            {console.log(errors)}
          </AccountSubscriptionForm>
        )}
      </Formik>
    </AccountSubscriptionEditBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEdit))
