import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../tools/cs_local_storage"
import { 
  GET_REVENUE_TOTAL_QUERY, 
  GET_REVENUE_SUBTOTAL_QUERY, 
  GET_REVENUE_TAX_QUERY,
  GET_REVENUE_TOTAL_SUBSCRIPTIONS_QUERY, 
  GET_REVENUE_SUBTOTAL_SUBSCRIPTIONS_QUERY, 
  GET_REVENUE_TAX_SUBSCRIPTIONS_QUERY
} from './queries'
import InsightRevenueBase from './InsightRevenueBase'
import InsightRevenueDisplay from './InsightRevenueDisplay'

function InsightRevenue ({ t, history }) {
  const year = localStorage.getItem(CSLS.INSIGHT_REVENUE_YEAR)

  // Total
  const { 
    loading: loadingTotal, 
    error: errorTotal, 
    data: dataTotal,
    refetch: refetchTotal
   } = useQuery(GET_REVENUE_TOTAL_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotal, 
    error: errorSubtotal, 
    data: dataSubtotal,
    refetch: refetchSubtotal
   } = useQuery(GET_REVENUE_SUBTOTAL_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTax, 
    error: errorTax, 
    data: dataTax,
    refetch: refetchTax
   } = useQuery(GET_REVENUE_TAX_QUERY, {
    variables: { year: year }
  })

  // Subscriptions
  const { 
    loading: loadingTotalSubs, 
    error: errorTotalSubs, 
    data: dataTotalSubs,
    refetch: refetchTotalSubs
   } = useQuery(GET_REVENUE_TOTAL_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingSubtotalSubs, 
    error: errorSubtotalSubs, 
    data: dataSubtotalSubs,
    refetch: refetchSubtotalSubs
   } = useQuery(GET_REVENUE_SUBTOTAL_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingTaxSubs, 
    error: errorTaxSubs, 
    data: dataTaxSubs,
    refetch: refetchTaxSubs
   } = useQuery(GET_REVENUE_TAX_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  function refetchData(year) {
    refetchTotal({year: year})
    refetchSubtotal({year: year})
    refetchTax({year: year})
    refetchTotalSubs({year: year})
    refetchSubtotalSubs({year: year})
    refetchTaxSubs({year: year})
  }

  // use <datavar> && <datavar unpacked> as <datavar> might not yet be loaded.

  return (
    <InsightRevenueBase year={year} refetchData={refetchData}>
      {/* Total */}
      <InsightRevenueDisplay
        loading={(loadingTotal || loadingSubtotal || loadingTax)}
        error={(errorTotal || errorSubtotal || errorTax)}
          cardTitle={t("general.total")}
          dataTotal={dataTotal && dataTotal.insightRevenueTotal.data}
          dataSubtotal={dataSubtotal && dataSubtotal.insightRevenueSubtotal.data}
          dataTax={dataTax && dataTax.insightRevenueTax.data}
      />
      {/* Subscriptions */}
      <InsightRevenueDisplay
          loading={(loadingTotalSubs || loadingSubtotalSubs || loadingTaxSubs)}
          error={(errorTotalSubs || errorSubtotalSubs || errorTaxSubs)}
          cardTitle={t("general.subscriptions")}
          dataTotal={dataTotalSubs && dataTotalSubs.insightRevenueTotalSubscriptions.data}
          dataSubtotal={dataSubtotalSubs && dataSubtotalSubs.insightRevenueSubtotalSubscriptions.data}
          dataTax={dataTaxSubs && dataTaxSubs.insightRevenueTaxSubscriptions.data}
      />
    </InsightRevenueBase>
  )
}

export default withTranslation()(withRouter(InsightRevenue))