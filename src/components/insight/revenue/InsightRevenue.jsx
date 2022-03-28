import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../tools/cs_local_storage"
import { GET_REVENUE_TOTAL_QUERY, GET_REVENUE_SUBTOTAL_QUERY, GET_REVENUE_TAX_QUERY } from './queries'
import InsightRevenueBase from './InsightRevenueBase'
import InsightRevenueTotal from './InsightRevenueTotal'

function InsightRevenue ({ t, history }) {
  const year = localStorage.getItem(CSLS.INSIGHT_REVENUE_YEAR)

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

  function refetchData(year) {
    refetchTotal({year: year})
    refetchSubtotal({year: year})
    refetchTax({year: year})
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