import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SUBSCRIPTION_QUERY, UPDATE_SUBSCRIPTION } from './queries'
import { SUBSCRIPTION_SCHEMA } from './yupSchema'
import OrganizationSubscriptionForm from './OrganizationSubscriptionForm'


import {
  Card,
  Dimmer
} from "tabler-react";
import ContentCard from "../../general/ContentCard"
import OrganizationSubscriptionsBase from './OrganizationSubscriptionsBase';


function OrganizationSubscriptionEdit({t, match, history}) {
  const id = match.params.id
  const returnUrl = "/organization/subscriptions"
  const cardTitle = t('organization.subscriptions.title_edit')

  const { loading, error, data } = useQuery(GET_SUBSCRIPTION_QUERY, { 
    variables: { id: id },
    fetchPolicy: "network-only"
  })
  const [ updateSubscription ] = useMutation(UPDATE_SUBSCRIPTION)

  if (loading) return (
    <OrganizationSubscriptionsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  if (error) return (
    <OrganizationSubscriptionsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  const initialData = data

  let initialMembership = ""
  if (initialData.organizationSubscription.organizationMembership) {
    initialMembership =  initialData.organizationSubscription.organizationMembership.id
  } 

  let initialGlaccount = ""
  if (initialData.organizationSubscription.financeGlaccount) {
    initialGlaccount =  initialData.organizationSubscription.financeGlaccount.id
  } 

  let initialCostcenter = ""
  if (initialData.organizationSubscription.financeCostcenter) {
    initialCostcenter =  initialData.organizationSubscription.financeCostcenter.id
  } 

  return (
    <OrganizationSubscriptionsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: initialData.organizationSubscription.displayPublic,
            displayShop: initialData.organizationSubscription.displayShop,
            name: initialData.organizationSubscription.name,
            description: initialData.organizationSubscription.description,
            sortOrder: initialData.organizationSubscription.sortOrder,
            minDuration: initialData.organizationSubscription.minDuration,
            classes: initialData.organizationSubscription.classes,
            subscriptionUnit: initialData.organizationSubscription.subscriptionUnit,
            reconciliationClasses: initialData.organizationSubscription.reconciliationClasses,
            creditValidity: initialData.organizationSubscription.creditValidity,
            unlimited: initialData.organizationSubscription.unlimited,
            termsAndConditions: initialData.organizationSubscription.termsAndConditions,
            organizationMembership: initialMembership,
            quickStatsAmount: initialData.organizationSubscription.quickStatsAmount,
            financeGlaccount:  initialGlaccount,
            financeCostcenter: initialCostcenter
          }}
          validationSchema={SUBSCRIPTION_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateSubscription({ variables: {
                input: {
                  id: match.params.id,
                  displayPublic: values.displayPublic,
                  displayShop: values.displayShop,
                  name: values.name,
                  description: values.description,
                  sortOrder: parseInt(values.sortOrder),
                  minDuration: parseInt(values.minDuration),
                  classes: parseInt(values.classes),
                  subscriptionUnit: values.subscriptionUnit,
                  reconciliationClasses: parseInt(values.reconciliationClasses),
                  creditValidity: parseInt(values.creditValidity),
                  unlimited: values.unlimited,
                  termsAndConditions: values.termsAndConditions,
                  quickStatsAmount: values.quickStatsAmount,
                  financeGlaccount: values.financeGlaccount,
                  financeCostcenter: values.financeCostcenter
                }
              }})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('organization.subscriptions.toast_edit_success')), {
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
            <OrganizationSubscriptionForm
              inputData={initialData}
              isSubmitting={isSubmitting}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
            />
          )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsBase>
  )
}


export default withTranslation()(withRouter(OrganizationSubscriptionEdit))