// @flow

import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import DOMPurify from 'dompurify'
import {
  Button,
  Card,
  Icon, 
  Table
} from "tabler-react"

import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceInvoiceEditPaymentDelete from "./FinanceInvoiceEditPaymentDelete"


function FinanceInvoiceEditPayments ({ t, history, match, refetchInvoice, inputData }) {
  const id = match.params.id
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const paymentAddUrl = `/finance/invoices/${id}/payment/add`

  return (
    <Card statusColor="blue">
      <Card.Header>
        <Card.Title>{t('general.payments')}</Card.Title>
        <Card.Options>
          {/* <FinanceInvoiceItemAdd /> */}
          <Link to={paymentAddUrl}>
            <Button className="btn-sm" color="primary">
              <Icon prefix="fe" name="plus" /> {t('finance.invoice.payments.add')} 
            </Button>
          </Link>
        </Card.Options>
      </Card.Header>
      {(!inputData.financeInvoice.payments.edges.length) ?
        <Card.Body>
          <p>{t('finance.invoice.payments.empty_list')}</p>
        </Card.Body> :
        <Table cards>
          <Table.Header>
            <Table.Row>
              <Table.ColHeader>{t("general.date")}</Table.ColHeader>
              <Table.ColHeader>{t("general.amount")}</Table.ColHeader>
              <Table.ColHeader>{t("general.payment_method")}</Table.ColHeader>
              <Table.ColHeader>{t("general.note")}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inputData.financeInvoice.payments.edges.map(({ node }) => (
              <Table.Row key={"payment_" + node.id}>
                <Table.Col>
                  { moment(node.date).format(dateFormat) }
                </Table.Col>
                <Table.Col>
                  { node.amountDisplay }
                </Table.Col>
                <Table.Col>
                  { (node.financePaymentMethod) ? node.financePaymentMethod.name : "" }
                  { (node.onlinePaymentId) ? <div><small className="text-muted">{node.onlinePaymentId}</small></div> : "" }
                </Table.Col>
                <Table.Col>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(node.note) }}></div>
                </Table.Col>
                <Table.Col>
                  <span className="pull-right">
                    <Link to={ "/finance/invoices/" + inputData.financeInvoice.id + "/payment/edit/" + node.id } 
                          className='btn btn-secondary btn-sm mr-2'
                    >
                      {t('general.edit')}
                    </Link>
                    <FinanceInvoiceEditPaymentDelete node={node} />
                  </span>
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      }
    </Card>
  )
}

export default withTranslation()(withRouter(FinanceInvoiceEditPayments))