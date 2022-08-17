import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceInvoicesStatus from "../../../ui/FinanceInvoiceStatus"

import {
  Alert,
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
  Table,
} from "tabler-react"
import { QUERY_ACCOUNT_INVOICE } from "./queries"

import ShopAccountInvoiceBase from "./ShopAccountInvoiceBase"


function ShopAccountInvoice({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const onlinePaymentsAvailable = appSettings.onlinePaymentsAvailable

  const invoiceId = match.params.id

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading, error, data } = useQuery(QUERY_ACCOUNT_INVOICE, {
    variables: {
      id: invoiceId
    },
    fetchPolicy: "network-only"
  })
  // const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  if (loading) return (
    <ShopAccountInvoiceBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountInvoiceBase>
  )
  if (error) return (
    <ShopAccountInvoiceBase>
      {t("shop.account.invoice.error_loading_data")}
    </ShopAccountInvoiceBase>
  )

  console.log("User data: ###")
  console.log(data)
  const user = data.user
  const invoice = data.financeInvoice

  const pageHeaderButtonList = ((invoice.status === "SENT" || invoice.status === "OVERDUE") && onlinePaymentsAvailable) ?
    <Link to={"/shop/account/invoice_payment/" + invoice.id}>
      <Button
        className="float-right ml-2"
        color="success"
      >
        {t('shop.account.invoices.to_payment')} <Icon name="chevron-right" />
      </Button>
    </Link>
    : ""
    

  return (
    <ShopAccountInvoiceBase accountName={user.fullName} pageHeaderButtonList={pageHeaderButtonList}>
      <Grid.Row>
        <Grid.Col md={12}>
          <div className='float-right'>
            <FinanceInvoicesStatus status={invoice.status}/>
          </div>
          <h4>{t("shop.account.invoice.title")} {invoice.invoiceNumber}</h4>
          { invoice.business && 
              <Alert type="primary">
                {t("shop.account.invoice.billed_to_b2b")}: <b>{invoice.business.name}</b>
              </Alert> 
          }
          <Card>
            <Card.Body>
              {invoice.summary}
            </Card.Body>
            <Table cards>
              <Table.Body>
                <Table.Row>
                  <Table.ColHeader>{t("general.date")}</Table.ColHeader>
                  <Table.Col>{moment(invoice.dateSent).format(dateFormat)}</Table.Col>
                  <Table.ColHeader>{t("finance.invoices.due")}</Table.ColHeader>
                  <Table.Col>{moment(invoice.dateDue).format(dateFormat)}</Table.Col>
                </Table.Row>
                <Table.Row>
                  <Table.ColHeader>{t("general.total")}</Table.ColHeader>
                  <Table.Col>{invoice.totalDisplay}</Table.Col>
                  <Table.ColHeader><b>{t("shop.account.invoices.to_be_paid")}</b></Table.ColHeader>
                  <Table.Col><b>{invoice.balanceDisplay}</b></Table.Col>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
          <h4>{t('general.items')}</h4>
          {invoice.items.edges.map(({ node }) => (
            <Card>
              <Card.Body>
                <Grid.Row>
                  <Grid.Col xs={12} sm={12} md={6}>
                    <h6>{node.productName}</h6>
                    {node.description}
                  </Grid.Col>
                  <Grid.Col xs={12} sm={12} md={4}>
                    {(parseFloat(node.quantity) > 1.00) ? <div>
                      <b>{node.quantity} {t("shop.account.invoice.pieces")} </b><br />
                      {node.priceDisplay} {t("general.each")}
                    </div> : ""}
                  </Grid.Col>
                  <Grid.Col xs={12} sm={12} md={2}>
                    <div className="float-right">
                      <b>{node.totalDisplay}</b><br />
                    </div>
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
            </Card>
          ))}
          {(invoice.payments.edges.length) ?
            <React.Fragment>
              <h4>{t("general.payments")}</h4>
              {invoice.payments.edges.map(({ node }) => (
              <Card>
                <Card.Body>
                  <Grid.Row>
                    <Grid.Col xs={12} sm={12} md={8}>
                      <h6>{moment(node.date).format(dateFormat)}</h6>
                      {node.financePaymentMethod.name}
                    </Grid.Col>
                    <Grid.Col xs={12} sm={12} md={4}>
                      <div className="float-right">
                        <b>{node.amountDisplay}</b><br />
                      </div>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              </Card>
            ))}
            </React.Fragment>
          : ""}
        </Grid.Col>
      </Grid.Row>
    </ShopAccountInvoiceBase>
  )
}


export default withTranslation()(withRouter(ShopAccountInvoice))