import React, { useContext } from 'react'

import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { v4 } from "uuid"
import { Link } from "react-router-dom"
import moment from 'moment'

import CSLS from "../../../../tools/cs_local_storage"
import { GET_ORDERS_QUERY } from '../queries'
import { GET_FINANCE_ORDER_QUERY, UPDATE_ORDER } from './queries'
import FinanceOrderEditForm from "./FinanceOrderEditForm"
import FinanceOrderEditBase from './FinanceOrderEditBase'

import {
  Alert,
  Grid,
  Icon,
  Card,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'


function FinanceOrderEdit({t, match, location, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const dateTimeFormat = dateFormat + ' ' + timeFormat

  const id = match.params.id
  const returnUrl = "/finance/orders"
  
  const { loading, error, data } = useQuery(GET_FINANCE_ORDER_QUERY, {
    variables: { id: id },
  })
  const [updateOrder] = useMutation(UPDATE_ORDER)


  // Loading
  if (loading) return (
    <FinanceOrderEditBase>
      <p>{t('general.loading_with_dots')}</p>
    </FinanceOrderEditBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <FinanceOrderEditBase>
        <p>{t('general.error_sad_smiley')}</p>
      </FinanceOrderEditBase>
    )
  }

  const order = data.financeOrder
  // Set back location for edit invoice
  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)

  return(
    <FinanceOrderEditBase>
      {/* Start info row */}
      <Grid.Row>
        <Grid.Col md={6}>
          <Card title={t("finance.orders.edit_details")}>
            <Table cards>
              <Table.Body>
                <Table.Row>
                  <Table.ColHeader>{t("general.order")} #</Table.ColHeader>
                  <Table.Col>{order.orderNumber}</Table.Col>
                </Table.Row>
                <Table.Row>
                  <Table.ColHeader>{t("general.account")}</Table.ColHeader>
                  <Table.Col>{order.account && order.account.fullName}</Table.Col>
                </Table.Row>
                <Table.Row>
                  <Table.ColHeader>{t("finance.orders.placed_at")}</Table.ColHeader>
                  <Table.Col>{moment(order.createdAt).format(dateTimeFormat)}</Table.Col>
                </Table.Row>
                <Table.Row>
                  <Table.ColHeader>{t("general.invoice")}</Table.ColHeader>
                  <Table.Col>
                    {(order.financeInvoice && 
                      <Link to={`/finance/invoices/edit/${order.financeInvoice.id}`}>
                        {order.financeInvoice.invoiceNumber}
                      </Link>
                    )}
                  </Table.Col>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>

        </Grid.Col>
        <Grid.Col md={6}>
          {(order.status === "DELIVERED") ? 
              <Card title={t('general.status')}>
              <Card.Body> 
                <span className="text-green"><Icon name="check" /></span> {t("finance.orders.statuses.DELIVERED")}
              </Card.Body>
            </Card> : "" }
          {(order.status === "DELIVERY_ERROR") ? 
              <Card title={t('general.status')}>
              <Card.Body> 
                <Alert type="danger" icon="alert-triangle">
                  {t("finance.orders.statuses.DELIVERY_ERROR")}
                </Alert>
                <p>
                  {order.deliveryErrorMessage && order.deliveryErrorMessage}
                </p>
              </Card.Body>
            </Card> : "" }
          {(order.status !== "DELIVERED" && order.status !== "DELIVERY_ERROR") ?
            <Formik
              initialValues={{ 
                status: order.status, 
              }}
              // validationSchema={GLACCOUNT_SCHEMA}
              onSubmit={(values, { setSubmitting }) => {
                  console.log('submit values:')
                  console.log(values)

                  updateOrder({ variables: {
                    input: {
                      id: match.params.id,
                      status: values.status
                    }
                  }, refetchQueries: [
                      {query: GET_ORDERS_QUERY }
                  ]})
                  .then(({ data }) => {
                      console.log('got data', data)
                      toast.success((t('finance.orders.toast_edit_success')), {
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
              {({ isSubmitting, errors, values }) => (
                <FinanceOrderEditForm
                  isSubmitting={isSubmitting}
                  errors={errors}
                  values={values}
                  returnUrl={returnUrl}
                />
              )}
            </Formik>
            : ""  
          }
        </Grid.Col>
      </Grid.Row> 
      {/* End information row */}
      {/* Start items row */}
      <Grid.Row>
        <Grid.Col md={12}>
          <Card title={t("general.items")}>
            <Table cards>
              <Table.Header>
                <Table.Row>
                  <Table.ColHeader>{t("general.product")}</Table.ColHeader>
                  <Table.ColHeader>{t("general.description")}</Table.ColHeader>
                  <Table.ColHeader>{t("general.quantity_short_and_price")}</Table.ColHeader>
                  <Table.ColHeader>{t("general.tax")}</Table.ColHeader>
                  <Table.ColHeader>{t("general.total")}</Table.ColHeader>
                  <Table.ColHeader></Table.ColHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { order.items.edges.map(({ node }) => (        
                  <Table.Row key={v4()}>
                    <Table.Col>
                      {node.productName}
                    </Table.Col>
                    <Table.Col>
                      {node.description}
                    </Table.Col>
                    <Table.Col>
                      {node.quantity} <br />
                      {node.priceDisplay}
                    </Table.Col>
                    <Table.Col>
                      {(node.financeTaxRate) ? node.financeTaxRate.name : ""}
                    </Table.Col>
                    <Table.Col>
                      {node.totalDisplay}
                    </Table.Col>
                  </Table.Row>
                ))}
              </Table.Body>                
            </Table>
          </Card>
        </Grid.Col>
      </Grid.Row>
      {/* End items row */}
      {/* Start note row */}
      { (order.message) ?
        <Grid.Row>
          <Grid.Col md={12}>
            <Card title={t('finance.orders.customer_message')}>
              <Card.Body>
                {order.message}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row> : ""
      }
      {/* End note row */}
    </FinanceOrderEditBase>
  )
}


export default withTranslation()(withRouter(FinanceOrderEdit))
