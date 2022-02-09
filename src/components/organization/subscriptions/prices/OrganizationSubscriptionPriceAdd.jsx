import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'


import {
  Card,
  Dimmer
} from "tabler-react"
import { dateToLocalISO } from '../../../../tools/date_tools'

import { GET_SUBSCRIPTION_PRICES_QUERY, ADD_SUBSCRIPTION_PRICE, GET_INPUT_VALUES_QUERY } from './queries'
import { GET_SUBSCRIPTIONS_QUERY } from '../queries'
import { SUBSCRIPTION_PRICE_SCHEMA } from './yupSchema'
import OrganizationSubscriptionsPricesBase from './OrganizationSubscriptionsPricesBase';
import OrganizationSubscriptionPriceForm from './OrganizationSubscriptionPriceForm'


function OrganizationSubscriptionPriceAdd({ t, history, match }) {
  const subscriptionId = match.params.subscription_id
  const cardTitle = t('organization.subscription_prices.title_add')
  const returnUrl = `/organization/subscriptions/prices/${subscriptionId}`

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [ addSubscriptionPrice ] = useMutation(ADD_SUBSCRIPTION_PRICE)

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

  return (
    <OrganizationSubscriptionsPricesBase returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ price: "", dateStart: new Date() }}
          validationSchema={SUBSCRIPTION_PRICE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {

              let dateEnd
              if (values.dateEnd) {
                dateEnd = dateToLocalISO(values.dateEnd)
              } else {
                dateEnd = values.dateEnd
              }

              addSubscriptionPrice({ variables: {
                input: {
                  organizationSubscription: match.params.subscription_id,
                  price: values.price,
                  financeTaxRate: values.financeTaxRate,
                  dateStart: dateToLocalISO(values.dateStart),
                  dateEnd: dateEnd
                }
              }, refetchQueries: [
                  {query: GET_SUBSCRIPTION_PRICES_QUERY, variables: {"organizationSubscription": match.params.subscription_id }},
                  {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.subscription_prices.toast_add_success')), {
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
            />
          )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsPricesBase>
  )
}


export default withTranslation()(withRouter(OrganizationSubscriptionPriceAdd))