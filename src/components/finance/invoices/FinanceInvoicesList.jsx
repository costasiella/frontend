import React, { useContext } from 'react'
import { useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  Button,
  Table, 
  Text
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import { get_list_query_variables } from "./tools"
import FinanceInvoicesStatus from "../../ui/FinanceInvoiceStatus"
import { GET_INVOICES_QUERY, DELETE_FINANCE_INVOICE } from "./queries"
import confirm_delete from "../../../tools/confirm_delete"
import moment from 'moment'

function FinanceInvoicesList({t, history, match, invoices, showColRelation=false}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const [ deleteFinanceInvoice ] = useMutation(DELETE_FINANCE_INVOICE)

  return (
    <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.status')}</Table.ColHeader>
            <Table.ColHeader>{t('finance.invoices.invoice_number')} & {t('finance.invoices.summary')}</Table.ColHeader>
            {showColRelation && <Table.ColHeader>{t('finance.invoices.relation')}</Table.ColHeader>}
            <Table.ColHeader>{t('finance.invoices.date')} & {t('finance.invoices.due')}</Table.ColHeader>
            {/* <Table.ColHeader>{t('finance.invoices.due')}</Table.ColHeader> */}
            <Table.ColHeader>{t('general.total')}</Table.ColHeader>
            <Table.ColHeader>{t('general.balance')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              <Table.Col key={v4()}>
                <FinanceInvoicesStatus status={node.status} /> <br />
                {(node.business && !showColRelation) && 
                  <Link to={"/relations/b2b/" + node.business.id + "/edit"}>
                    <small><Icon name="home" /> {node.business.name}</small>
                  </Link>
                }
              </Table.Col>
              <Table.Col key={v4()}>
                <Link to={"/finance/invoices/edit/" + node.id}>
                  {node.invoiceNumber}
                </Link><br />
                <Text.Small color="gray">{node.summary.trunc(28)}</Text.Small>
              </Table.Col>
              {showColRelation &&
                <Table.Col key={v4()}>
                  { node.account && 
                    <Link to={"/relations/accounts/" + node.account.id + "/profile"}>
                      <Icon name="user" /> {node.account.fullName} <br />
                    </Link> 
                  }
                  { node.business && 
                    <Link to={"/relations/b2b/" + node.business.id + "/edit"}>
                      <small><Icon name="home" /> {node.business.name}</small>
                    </Link>
                  }
                </Table.Col>
              }
              <Table.Col key={v4()}>
                {moment(node.dateSent).format(dateFormat)} <br />
                {moment(node.dateDue).format(dateFormat)}
              </Table.Col>
              <Table.Col key={v4()}>
                {node.totalDisplay}
              </Table.Col>
              <Table.Col key={v4()}>
                {node.balanceDisplay}
              </Table.Col>
              <Table.Col className="text-right" key={v4()}>
                <Link to={"/finance/invoices/edit/" + node.id}>
                  <Button className='btn-sm' 
                          color="secondary">
                    {t('general.edit')}
                  </Button>
                </Link>
                <button className="icon btn btn-link btn-sm" 
                  title={t('general.delete')} 
                  href=""
                  onClick={() => {
                    confirm_delete({
                      t: t,
                      msgConfirm: t("finance.invoices.delete_confirm_msg"),
                      msgDescription: <p>{node.invoiceNumber}</p>,
                      msgSuccess: t('finance.invoices.deleted'),
                      deleteFunction: deleteFinanceInvoice,
                      functionVariables: { 
                        variables: {
                          input: {
                            id: node.id
                          }
                        }, 
                        refetchQueries: [
                          {query: GET_INVOICES_QUERY, variables: get_list_query_variables() } 
                        ]
                      }
                    })
                }}>
                  <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                </button>
            </Table.Col>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default withTranslation()(withRouter(FinanceInvoicesList))