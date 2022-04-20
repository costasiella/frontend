import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
} from "tabler-react"
import { GET_INVOICE_QUERY } from "../invoice_payment/queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"

import ShopAccountInvoicePaymentStatusBase from "./ShopAccountInvoicePaymentStatusBase"


function ShopAccountInvoicePaymentStatus({t, match, history}) {
  const id = match.params.id
  const cardTitleLoadingError = t("shop.account.invoice_payment.title")

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data } = useQuery(GET_INVOICE_QUERY, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      id: id
    }
  })

  if (loading || loadingUser || !data) return (
    <ShopAccountInvoicePaymentStatusBase>
      <Card title={cardTitleLoadingError}>
        <Card.Body>
          <Dimmer active={true} loader={true} />
        </Card.Body>
      </Card>
    </ShopAccountInvoicePaymentStatusBase>
  )
  if (error || errorUser) return (
    <ShopAccountInvoicePaymentStatusBase>
      <Card title={cardTitleLoadingError}>
        <Card.Body>
          {t("shop.account.invoice_payment_status.error_loading_data")}
        </Card.Body>
      </Card>
    </ShopAccountInvoicePaymentStatusBase>
  )

  const user = dataUser.user
  const invoice = data.financeInvoice

  let alert
  if (invoice.status === "PAID") {
    alert = <Alert type="success" icon="check">
      {t("shop.account.invoice_payment_status.payment_received")}
    </Alert>
  } else {
    alert = <Alert type="primary" icon="help-circle">
      {t("shop.account.invoice_payment_status.payment_not_confirmed")}
    </Alert>
  }

  
  return (
    <ShopAccountInvoicePaymentStatusBase accountName={user.fullName}>
      {alert}
      <Card title={<span>{t("general.invoice")} #{invoice.invoiceNumber}</span>}>
        <Card.Body>
          { invoice.items.edges.map(({ node }) => (
            <Grid.Row>
              <Grid.Col md={9}>
                {node.productName} <br />
                <small className="text-muted">
                  {node.description}
                </small>
              </Grid.Col>
              <Grid.Col md={3}>
                <span className="float-right">
                  {node.totalDisplay}
                </span>
              </Grid.Col>
            </Grid.Row>
          ))}
          {/* Total */}
          <Grid.Row>
            <Grid.Col md={9} className="bold">
              <br />
              {t("general.total")}
            </Grid.Col>
            <Grid.Col md={3}>
              <span className="bold float-right">
                <br />
                {invoice.totalDisplay}
              </span>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
        <Card.Footer>
          <Link to="/shop/account/invoices">
            <Button 
              color="primary"
              className="float-right"
            >
              {t("shop.account.invoice_payment_status.to_profile")} <Icon name="chevron-right" />
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </ShopAccountInvoicePaymentStatusBase>
  )
}

export default withTranslation()(withRouter(ShopAccountInvoicePaymentStatus))
