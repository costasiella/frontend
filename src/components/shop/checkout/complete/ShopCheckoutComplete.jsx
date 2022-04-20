import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon
} from "tabler-react";
import ShopCheckoutCompleteBase from "./ShopCheckoutCompleteBase"
import ShopCheckoutOrderSummary from "../order_summary/ShopCheckoutOrderSummary"

import { GET_ORDER_QUERY } from "../queries"


function ShopCheckoutComplete({ t, match, history }) {
  // const btnPayNow = useRef(null);
  // const initialBtnText = <span><Icon name="credit-card" /> {t('shop.checkout.payment.to_payment')} <Icon name="chevron-right" /></span>
  // const [btn_text, setBtnText] = useState(initialBtnText)
  const title = t("shop.home.title")
  const id = match.params.id
  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id: id }
  })

  if (loading) return (
    <ShopCheckoutCompleteBase title={title} >
      <Dimmer active={true} loader={true} />
    </ShopCheckoutCompleteBase>
  )
  if (error) return (
    <ShopCheckoutCompleteBase title={title}>
      {t("shop.classpass.error_loading")}
    </ShopCheckoutCompleteBase>
  )

  console.log(data)
  const order = data.financeOrder
  console.log(order)
  const orderItems = order.items.edges
  console.log(orderItems)

  // Order not found
  if (!order) {
    return (
      <ShopCheckoutCompleteBase title={title}>
        {t("shop.checkout.complete.order_not_found")}
      </ShopCheckoutCompleteBase>
    )
  }

  let subHeader = ""
  let contentText = ""
  let paymentText = ""
  let complete = false

  // Success!
  if (order.status === "DELIVERED") {
    // subHeader: thank you message
    // contentText: Something to explain the user what's next
    if (order.total === "0.00") {
      subHeader = t("shop.checkout.complete.success_subheader_free_order") 
      contentText = t("shop.checkout.complete.success_content_text_free_order")
    } else {
      subHeader = t("shop.checkout.complete.success_subheader") 
      contentText = t("shop.checkout.complete.success_content_text")
    }
    
    complete = true

    // Confirm receiving payment to user
    if (order.total !== "0.00") {
      paymentText = t("shop.checkout.complete.success_payment_text")
    }
  } else {
    // Fail...
    // Looks like something went wrong message
    subHeader = t("shop.checkout.complete.fail_subheader") 
    // Notify user of ways to contact
    contentText = t("shop.checkout.complete.fail_content_text")

    // Notify user that payment hasn't been received
    if (order.total !== "0.00") {
      paymentText = t("shop.checkout.complete.fail_payment_text")
    }
  }


  return (
    <ShopCheckoutCompleteBase title={title}>
        <Grid.Row>
          <Grid.Col xs={12} sm={12} md={6} lg={6}>
            <Card title={t("shop.checkout.complete.title")}>
              <Card.Body>
                <h5 className={"mb-4"}>{subHeader}</h5>
                {paymentText} <br />
                {contentText}
              </Card.Body>
              <Card.Footer>
                <Link to="/shop/account/">
                  <Button 
                    block
                    color="success"
                  >
                    {t("shop.complete.to_account")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={12} md={6} lg={6}>
            <ShopCheckoutOrderSummary id={id} complete={complete} />
          </Grid.Col>
        </Grid.Row>
    </ShopCheckoutCompleteBase>
  )
}

export default withTranslation()(withRouter(ShopCheckoutComplete))
