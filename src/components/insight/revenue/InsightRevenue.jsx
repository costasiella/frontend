import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../tools/cs_local_storage"
import { GET_REVENUE_QUERY } from './queries'
import InsightRevenueBase from './InsightRevenueBase'
import InsightRevenueDisplay from './InsightRevenueDisplay'

function InsightRevenue ({ t, history }) {
  const year = localStorage.getItem(CSLS.INSIGHT_REVENUE_YEAR)

  const { 
    loading: loading, 
    error: error, 
    data: data,
    refetch: refetch
   } = useQuery(GET_REVENUE_QUERY, {
    variables: { year: year }
  })

  function refetchData(year) {
    refetch({year: year})
  }

  return (
    <InsightRevenueBase year={year} refetchData={refetchData}>
      {/* Total */}
      <InsightRevenueDisplay
        loading={loading}
        error={error}
        cardTitle={t("general.total")}
        data={data && data.insightRevenueTotal}
      />
      {/* Subscriptions */}
      <InsightRevenueDisplay
        loading={loading}
        error={error}
        cardTitle={t("general.subscriptions")}
        data={data && data.insightRevenueSubscriptions}
      />
      {/* Classpasses */}
      <InsightRevenueDisplay
        loading={loading}
        error={error}
        cardTitle={t("general.classpasses")}
        data={data && data.insightRevenueClasspasses}
      />
      {/* Event tickets */}
      <InsightRevenueDisplay
        loading={loading}
        error={error}
        cardTitle={t("general.event_tickets")}
        data={data && data.insightRevenueEventTickets}
      />
      {/* Other */}
      <InsightRevenueDisplay
        loading={loading}
        error={error}
        cardTitle={t("general.other")}
        data={data && data.insightRevenueOther}
      />
    </InsightRevenueBase> 
  )
}

export default withTranslation()(withRouter(InsightRevenue))