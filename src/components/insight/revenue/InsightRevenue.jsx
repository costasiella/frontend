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
import InsightRevenueTotal from './InsightRevenueTotal'

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

  return (
    <InsightRevenueBase year={year} refetchData={refetchData}>
      <InsightRevenueTotal 
        loading={(loadingTotal || loadingSubtotal || loadingTax)}
        error={(errorTotal || errorSubtotal || errorTax)}
        dataTotal={dataTotal}
        dataSubtotal={dataSubtotal}
        dataTax={dataTax}
      />
    </InsightRevenueBase>
  )
}

export default withTranslation()(withRouter(InsightRevenue))