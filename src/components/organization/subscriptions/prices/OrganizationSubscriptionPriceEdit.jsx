import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
  Dimmer
} from "tabler-react";

import { GET_SUBSCRIPTION_PRICES_QUERY, GET_SUBSCRIPTION_PRICE_QUERY, UPDATE_SUBSCRIPTION_PRICE } from './queries'
import { GET_SUBSCRIPTIONS_QUERY } from '../queries'
import { SUBSCRIPTION_PRICE_SCHEMA } from './yupSchema'
import OrganizationSubscriptionPriceForm from './OrganizationSubscriptionPriceForm'
import { dateToLocalISO } from '../../../../tools/date_tools'

import OrganizationSubscriptionsPricesBase from './OrganizationSubscriptionsPricesBase';


function OrganizationSubscriptionPriceEdit({ t, history, match }) {
  const id = match.params.id
  const subscriptionId = match.params.subscription_id
  const cardTitle = t('organization.subscription_prices.title_edit')
  const returnUrl = `/organization/subscriptions/prices/${subscriptionId}`

  const { loading, error, data } = useQuery(GET_SUBSCRIPTION_PRICE_QUERY, {
    variables: { id: id }
  })
  const [ updateSubscriptionPrice ] = useMutation(UPDATE_SUBSCRIPTION_PRICE)

  if (loading) return (
    <OrganizationSubscriptionsPricesBase returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer active={true} loader={true} />
          </Card.Body>
        </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  if (error) return (
    <OrganizationSubscriptionsPricesBase returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('organization.subscription_prices.error_loading')}</p>
          </Card.Body>
        </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  const initialData = data.organizationSubscriptionPrice

    // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  if (initialData.dateStart) {
    dateStart = new Date(initialData.dateStart)
  }
  let dateEnd = null
  if (initialData.dateEnd) {
    dateEnd = new Date(initialData.dateEnd)
  }

  return (
    <OrganizationSubscriptionsPricesBase returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            price: initialData.price, 
            financeTaxRate: initialData.financeTaxRate.id,
            dateStart: dateStart,
            dateEnd: dateEnd,
          }}
          validationSchema={SUBSCRIPTION_PRICE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              let dateEnd
              if (values.dateEnd) {
                if (values.dateEnd instanceof Date) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }
              } else {
                dateEnd = values.dateEnd
              }

              let dateStart
              if (values.dateStart instanceof Date) {
                dateStart = dateToLocalISO(values.dateStart)
              } else {
                // Input hasn't changed and DatePicket hasn't made a Date object out of it
                dateStart = values.dateStart
              }

              updateSubscriptionPrice({ variables: {
                input: {
                  id: match.params.id,
                  price: values.price,
                  financeTaxRate: values.financeTaxRate,
                  dateStart: dateStart,
                  dateEnd: dateEnd,
                }
              }, refetchQueries: [
                {query: GET_SUBSCRIPTION_PRICES_QUERY, variables: { organizationSubscription: subscriptionId }},
                {query: GET_SUBSCRIPTIONS_QUERY, variables: { "archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.subscription_prices.toast_edit_success')), {
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
            <OrganizationSubscriptionPriceForm
              inputData={data}
              isSubmitting={isSubmitting}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
            >
              {console.log(errors)}
            </OrganizationSubscriptionPriceForm>
          )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsPricesBase>
  )
}


export default withTranslation()(withRouter(OrganizationSubscriptionPriceEdit))