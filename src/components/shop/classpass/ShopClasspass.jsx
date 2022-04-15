import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import DOMPurify from 'dompurify'
import moment from 'moment'

import {
  Card,
  Grid,
} from "tabler-react"

import { TimeStringToJSDateOBJ } from '../../../tools/date_tools'
import AppSettingsContext from '../../context/AppSettingsContext'

import ShopClasspassBase from "./ShopClasspassBase"
import ShopCheckoutForm from "../ShopCheckoutForm"
import ShopClasspassesPricingCard from "./ShopClasspassPricingCard"

import { GET_CLASSPASS_QUERY } from "./queries"
import { GET_CLASS_QUERY } from "../queries"
import { CREATE_ORDER } from "../queries"


function ShopClasspass({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  const pageTitle = t("general.classpass")
  const id = match.params.id
  const scheduleItemId = match.params.class_id
  const classDate = match.params.date

  const { loading, error, data } = useQuery(GET_CLASSPASS_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })

  const { loading: loadingClass, error: errorClass, data: dataClass } = useQuery(GET_CLASS_QUERY, {
    variables: { scheduleItemId: scheduleItemId, date: classDate },
    skip: (!scheduleItemId || !classDate)
  })

  const [createOrder] = useMutation(CREATE_ORDER)


  if (loading) return (
    <ShopClasspassBase pageTitle={pageTitle} >
      {t("general.loading_with_dots")}
    </ShopClasspassBase>
  )
  if (error) return (
    <ShopClasspassBase pageTitle={pageTitle}>
      {t("shop.classpass.error_loading")}
    </ShopClasspassBase>
  )

  const classpass = data.organizationClasspass
  const user = data.user
  const pageSubTitle = classpass.name

  if (user.hasReachedTrialLimit && classpass.trialPass) {
    return (
      <ShopClasspassBase pageTitle={pageTitle}>
        <Card pageTitle={t("shop.classpass.trial_limit_reached")}>
          <Card.Body>
            {t("shop.classpass.trial_limit_reached_explanation")}
          </Card.Body>
        </Card>
      </ShopClasspassBase>
    )
  }

  return (
    <ShopClasspassBase pageTitle={pageTitle} pageSubTitle={pageSubTitle}>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={4}>
          <ShopClasspassesPricingCard classpass={classpass} active={true} />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4}>
          {(dataClass && !loadingClass && !errorClass) ?
            <Card pageTitle={t("shop.classpass.class_book_information")}>
              <Card.Body>
                {t("shop.classpass.class_book_explanation")} <br /><br />
                <b>
                  {moment(classDate).format(dateFormat)} {' '}
                  {moment(TimeStringToJSDateOBJ(dataClass.scheduleClass.timeStart)).format(timeFormat)} {' - '}
                  {moment(TimeStringToJSDateOBJ(dataClass.scheduleClass.timeEnd)).format(timeFormat)} <br />  
                </b>
                {dataClass.scheduleClass.organizationClasstype.name + " " + t("general.at") + ' ' + 
                  dataClass.scheduleClass.organizationLocationRoom.organizationLocation.name}

              </Card.Body>
            </Card>
            : "" 
          }
          <Card pageTitle={t("shop.classpass.additional_information")}>
            <Card.Body>
              <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(classpass.description) }}></div>
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4}>
          <Card pageTitle={t("shop.checkout.pageTitle")}>
            <Card.Body>
              <Formik
                initialValues={{ message: "" }}
                // validationSchema={CLASSTYPE_SCHEMA}
                onSubmit={(values, { setSubmitting }) => {

                    let createOrderInput = {
                      message: values.message,
                      organizationClasspass: match.params.id,
                    }

                    if (scheduleItemId && classDate) {
                      createOrderInput.attendanceDate = classDate
                      createOrderInput.scheduleItem = scheduleItemId
                    }

                    createOrder({ variables: {
                      input: createOrderInput,
                      // file: values.image
                    }, refetchQueries: [
                        // {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
                    ]})
                    .then(({ data }) => {
                        console.log('got data', data)
                        console.log('good...  now redirect to the payment page')
                        const orderId = data.createFinanceOrder.financeOrder.id
                        history.push('/shop/checkout/payment/' + orderId)
                      }).catch((error) => {
                        toast.error((t('general.toast_server_error')) +  error, {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        console.log('there was an error sending the query', error)
                        setSubmitting(false)
                      })
                }}
                >
                {({ isSubmitting, errors, values }) => (
                  <ShopCheckoutForm 
                    isSubmitting={isSubmitting}
                    errors={errors}
                    values={values}
                  />
                )}
              </Formik>

              {/* When a user is not logged in, show a login button to redirect to the login page */}
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </ShopClasspassBase>
  )
}

export default withTranslation()(withRouter(ShopClasspass))
