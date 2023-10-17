import React, { useContext, useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage'
import AppSettingsContext from '../../../context/AppSettingsContext'
import ShopCheckoutPaymentBase from "./ShopCheckoutPaymentBase"
import ShopCheckoutOrderSummary from "../order_summary/ShopCheckoutOrderSummary"

import { GET_ORDER_QUERY } from "../queries"
import { CREATE_PAYMENT_LINK } from "./queries"


function ShopCheckoutPayment({ t, match, history, location }) {
  const appSettings = useContext(AppSettingsContext)
  const onlinePaymentsAvailable = appSettings.onlinePaymentsAvailable
  const btnPayNow = useRef(null);
  const initialBtnText = <span><Icon name="credit-card" /> {t('shop.checkout.payment.to_payment')} <Icon name="chevron-right" /></span>
  const [btn_text, setBtnText] = useState(initialBtnText)
  const title = t("shop.home.title")
  const id = match.params.id
  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })

  const [createPaymentLink] = useMutation(CREATE_PAYMENT_LINK)

  localStorage.setItem(CSLS.SHOP_ACCOUNT_PROFILE_NEXT, location.pathname)

  if (loading) return (
    <ShopCheckoutPaymentBase title={title} >
      <Dimmer active={true} loader={true} />
    </ShopCheckoutPaymentBase>
  )
  if (error) return (
    <ShopCheckoutPaymentBase title={title}>
      {t("shop.classpass.error_loading")}
    </ShopCheckoutPaymentBase>
  )

  const order = data.financeOrder
  const account = data.financeOrder.account
  // const orderItems = order.items.edges

  function onClickPay() {
    btnPayNow.current.setAttribute("disabled", "disabled")
    setBtnText(t("shop.checkout.payment.redirecting"))
    // btnPayNow.current.setValue("redirecting...")
    // btnPayNow
    // btnPayNow.current.removeAttribute("disabled")
    createPaymentLink({ variables: { id: id } }).then(({ data }) => {
      console.log('got data', data);
      const paymentLink = data.createFinanceOrderPaymentLink.financeOrderPaymentLink.paymentLink
      window.location.href = paymentLink
    }).catch((error) => {
      toast.error((t('general.toast_server_error')) +  error, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      console.log('there was an error sending the query', error)
    })
  }

  let msgNextStep
  let buttonNext
  
  // The order has been added to the users' account as it's free.
  // No need for a payment.
  if (order.total === "0.00") {
    history.push(`/shop/checkout/complete/${id}`)
  }

  // Continue processing and see if online payments are available
  // Check profile complete enough
  if (!account.hasCompleteEnoughProfile) {
    // If not, show message that a more complete profile is required
    msgNextStep = <Alert type="primary">
      {t("shop.checkout.payment.profile_not_complete_enough")}
    </Alert>
    buttonNext = <Link to="/shop/account/profile">
      <Button
        block
        color="primary"
      >
        {t("shop.checkout.payment.update_profile")} <Icon name="chevron-right" />
      </Button>
    </Link>
  } else if (onlinePaymentsAvailable) {
    msgNextStep = t("shop.checkout.payment.order_received_to_payment_text")
    buttonNext = <button
      className="btn btn-block btn-success"
      ref={btnPayNow}
      onClick={ onClickPay }
    >
      {btn_text}
    </button>
  } else {
    msgNextStep = t("shop.checkout.payment.order_received_to_profile_text")
    buttonNext = <Link to="/">
      <Button
        block
        color="success"
      >
        {t("shop.checkout.payment.to_profile")} <Icon name="chevron-right" />
      </Button>
    </Link>
  }


  return (
    <ShopCheckoutPaymentBase title={title}>
        <Grid.Row>
          <Grid.Col xs={12} sm={12} md={6} lg={6}>
            <Card title={t("shop.checkout.payment.order_received")}>
              <Card.Body>
                <h5 className={"mb-4"}>{t("shop.checkout.payment.order_received_subheader")}</h5>
                {t("shop.checkout.payment.order_received_to_payment_explanation")} <br />< br />
                {msgNextStep}
              </Card.Body>
              <Card.Footer>
                {buttonNext}
              </Card.Footer>
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={12} md={6} lg={6}>
            <ShopCheckoutOrderSummary id={id} />
          </Grid.Col>
        </Grid.Row>
    </ShopCheckoutPaymentBase>
  )
}

export default withTranslation()(withRouter(ShopCheckoutPayment))
