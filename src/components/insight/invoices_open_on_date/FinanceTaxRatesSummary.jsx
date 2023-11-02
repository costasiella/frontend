import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'
import {
  Dimmer,
  Table, 
} from "tabler-react";


import ContentCard from "../../general/ContentCard"
import FinanceTaxRatesSummaryBase from "./FinanceTaxRatesSummaryBase"
import { GET_INSIGHT_FINANCE_TAX_SUMMARY_QUERY } from "./queries"
import { dateToLocalISO } from '../../../tools/date_tools'



function FinanceTaxRatesSummary({ t, location, history }) {
  const cardTitle = t('finance.taxrates_summary.title')
  const dateStart = moment().startOf('month')
  const dateEnd   = moment().endOf('month')

  // Set back location for edit invoice
  // localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)
  // Fetch data
  const { loading, error, data, refetch } = useQuery(GET_INSIGHT_FINANCE_TAX_SUMMARY_QUERY, {
    variables: {
      dateStart: dateToLocalISO(dateStart),
      dateEnd: dateToLocalISO(dateEnd)
    },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )
  // Error
  if (error) return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.taxrates_summary.error_loading')}</p>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )

  const taxRatesSummary = data.insightFinanceTaxRateSummary

  // Empty list
  if (!taxRatesSummary.data.length) { return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>
          {t('finance.taxrates_summary.empty_list')}
        </p>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )}

  return (
    <FinanceTaxRatesSummaryBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.taxrates_summary.title')}
                  pageInfo={taxRatesSummary.pageInfo}
                  hasCardBody={false}
        >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.taxrates.percentage')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.taxrates_summary.taxable_amount')}</Table.ColHeader>
              <Table.ColHeader>{t('general.tax')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {taxRatesSummary.data.map(({financeTaxRate, taxDisplay, subtotalDisplay }) => (
              <Table.Row>
                <Table.Col>{financeTaxRate.name}</Table.Col>
                <Table.Col>{financeTaxRate.percentage} %</Table.Col>
                <Table.Col>{subtotalDisplay}</Table.Col>
                <Table.Col>{taxDisplay}</Table.Col>
              </Table.Row>  
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </FinanceTaxRatesSummaryBase>
  )
} 

export default withTranslation()(withRouter(FinanceTaxRatesSummary))