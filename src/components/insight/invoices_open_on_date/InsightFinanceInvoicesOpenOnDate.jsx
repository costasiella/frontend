import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Dimmer,
  Table, 
} from "tabler-react";


import ContentCard from "../../general/ContentCard"
import InsightFinanceInvoicesOpenOnDateBase from "./InsightFinanceInvoicesOpenOnDateBase"
import { GET_INSIGHT_FINANCE_OPEN_INVOICES_QUERY } from "./queries"
import { dateToLocalISO } from '../../../tools/date_tools'



function InsightFinanceInvoicesOpenOnDate({ t, location, history }) {
  const cardTitle = t('finance.taxrates_summary.title')
  const date = new Date()

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
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )
  // Error
  if (error) return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('insight.invoicesopenondate.error_loading')}</p>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )

  const openInvoices = data.insightFinanceOpenInvoices

  console.log(openInvoices)

  // Empty list
  if (!openInvoices.financeInvoices.length) { return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>
          {t('insight.invoicesopenondate.empty_list')}
        </p>
      </ContentCard>
    </InsightFinanceInvoicesOpenOnDateBase>
  )}

  return (
    <InsightFinanceInvoicesOpenOnDateBase refetch={refetch}>
      <ContentCard cardTitle={t('insight.invoicesopenondate.title')}
                  // pageInfo={taxRatesSummary.pageInfo}
                  hasCardBody={false}
        >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('finance.invoices.invoice_number')}</Table.ColHeader>
              {/* <Table.ColHeader>{t('finance.taxrates.percentage')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.taxrates_summary.taxable_amount')}</Table.ColHeader>
              <Table.ColHeader>{t('general.tax')}</Table.ColHeader> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {openInvoices.financeInvoices.map((financeInvoice) => (
              <Table.Row>
                <Table.Col>{financeInvoice.invoiceNumber}</Table.Col>
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