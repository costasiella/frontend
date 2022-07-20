import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import DOMPurify from 'dompurify'
import {
  Card,
  Dimmer,
  Grid,
} from "tabler-react"

import ShopEventTicketBase from "./ShopEventTicketBase"
import ShopCheckoutForm from "../ShopCheckoutForm"
import ShopEventTicketPricingCard from "../event/ShopEventTicketPricingCard"

import { GET_SCHEDULE_EVENT_TICKET_QUERY } from "./queries"
import { CREATE_ORDER } from "../queries"


function ShopEventTicket({ t, match, history }) {
  let title = t("shop.home.title")
  const scheduleEventTicketId = match.params.id
  const eventId = match.params.event_id

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_TICKET_QUERY, {
    variables: { id: scheduleEventTicketId },
    fetchPolicy: "network-only"
  })

  const [createOrder] = useMutation(CREATE_ORDER)


  if (loading) return (
    <ShopEventTicketBase title={title} >
      <Dimmer active={true} loader={true} />
    </ShopEventTicketBase>
  )
  if (error) return (
    <ShopEventTicketBase title={title}>
      {t("shop.events.ticket.error_loading")}
    </ShopEventTicketBase>
  )

  const eventTicket = data.scheduleEventTicket
  const subTitle = eventTicket.scheduleEvent.name

  // Chceck sold out
  if (eventTicket.isSoldOut) {
    return (
      <ShopEventTicketBase title={title} subTitle={subTitle}>
        <Card title={t("shop.events.ticket.sold_out_title")}>
          <Card.Body>{t("shop.events.ticket.sold_out")}</Card.Body>
        </Card>
      </ShopEventTicketBase>
    )
  }

  return (
    <ShopEventTicketBase title={title} subTitle={subTitle}>
      <Grid.Row>
        <Grid.Col md={4}>
          <ShopEventTicketPricingCard eventId={eventId} eventTicket={eventTicket} showButton={false} active={true} />
        </Grid.Col>
        <Grid.Col md={4}>
          <Card title={t("shop.events.ticket.additional_info")}>
            <Card.Body>
              {(eventTicket.description) ?
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventTicket.description) }} />
              : t("shop.events.ticket.no_additional_info")}
            </Card.Body>
          </Card> 
        </Grid.Col>
        <Grid.Col md={4}>
          <Card title={t("shop.checkout.title")}>
            <Card.Body>
              <Formik
                initialValues={{ message: "" }}
                // validationSchema={CLASSTYPE_SCHEMA}
                onSubmit={(values, { setSubmitting }) => {

                    let createOrderInput = {
                      message: values.message,
                      scheduleEventTicket: match.params.id,
                    }

                    createOrder({ variables: {
                      input: createOrderInput,
                      // file: values.image
                    }, refetchQueries: [
                        // {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
                    ]})
                    .then(({ data }) => {
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
    </ShopEventTicketBase>
  )
}

export default withTranslation()(withRouter(ShopEventTicket))
