import React, { useContext, useState } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from "moment"
import {
  Dimmer,
  Icon,
  Table, 
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import ContentCard from "../../general/ContentCard"
import FinanceInvoiceStatus from '../../ui/FinanceInvoiceStatus'
import InsightFinanceInvoicesOpenOnDateBase from "./InsightFinanceInvoicesOpenOnDateBase"
import { GET_INSIGHT_FINANCE_OPEN_INVOICES_QUERY } from "./queries"
import { dateToLocalISO } from '../../../tools/date_tools'



function InsightFinanceInvoicesOpenOnDate({ t, location, history }) {
  const cardTitle = t('insight.invoicesopenondate.title')
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const [date, setDate] = useState(new Date())

  // Set back location for edit invoice
  // localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)
  // Fetch data
  const { loading, error, data, refetch } = useQuery(GET_INSIGHT_FINANCE_OPEN_INVOICES_QUERY, {
    variables: {
      date: dateToLocalISO(date),
    },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch} setDate={setDate}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )
  // Error
  if (error) return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch} setDate={setDate}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('insight.invoicesopenondate.error_loading')}</p>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )

  const openInvoices = data.insightFinanceOpenInvoices

  console.log(openInvoices)

  // Empty list
  if (!openInvoices.financeInvoices.length) { return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch} setDate={setDate}>
      <ContentCard cardTitle={cardTitle}>
        <p>
          {t('insight.invoicesopenondate.empty_list')}
        </p>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )}

  return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch} setDate={setDate}>
      <ContentCard cardTitle={cardTitle}
                  // pageInfo={taxRatesSummary.pageInfo}
                  hasCardBody={false}
        >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.status')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.invoices.invoice_number')}</Table.ColHeader>
              <Table.ColHeader>{t('insight.invoicesopenondate.invoice_date')}</Table.ColHeader>
              <Table.ColHeader>{t('insight.invoicesopenondate.relation')}</Table.ColHeader>
              <Table.ColHeader>{t('general.amount')}</Table.ColHeader>
              <Table.ColHeader>{t('insight.invoicesopenondate.amount_paid_on')} {moment(date).format(dateFormat)}</Table.ColHeader>
              <Table.ColHeader>{t('general.balance')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {openInvoices.financeInvoices.map((financeInvoice) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  <FinanceInvoiceStatus status={financeInvoice.status} /> <br />
                  {/* Perhaps but the business relation in the "relation" column? */}
                  {/* {(financeInvoice.business) && 
                    <Link to={"/relations/b2b/" + financeInvoice.business.id + "/edit"}>
                      <small><Icon name="home" /> {financeInvoice.business.name}</small>
                    </Link>} */}
                </Table.Col>
                {/* TODO: Add a link to the invoice page */}
                <Table.Col>{financeInvoice.invoiceNumber}</Table.Col>
                <Table.Col>{moment(financeInvoice.dateSent).format(dateFormat)}</Table.Col>
                {/* <Table.Col>{financeTaxRate.percentage} %</Table.Col>
                <Table.Col>{subtotalDisplay}</Table.Col>
                <Table.Col>{taxDisplay}</Table.Col> */}
              </Table.Row>  
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )
} 

export default withTranslation()(withRouter(InsightFinanceInvoicesOpenOnDate))