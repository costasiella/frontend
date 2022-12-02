import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { CartesianGrid, XAxis, YAxis, Legend, LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts'
import moment from 'moment'
import {
  colors,
  Dimmer,
  Grid,
  Button,
  Card,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import { getMonthNamesShort } from '../../../tools/date_tools'
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../tools/refresh_token_and_open_export_link"
import { GET_INSIGHT_SUBSCRIPTIONS_QUERY } from './queries'
import { TOKEN_REFRESH } from "../../../queries/system/auth"
import InsightSubscriptionsBase from './InsightSubscriptionsBase'


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.INSIGHT_SUBSCRIPTIONS_YEAR)) {
  console.log('year from not found... defaulting to today...')
  localStorage.setItem(CSLS.INSIGHT_SUBSCRIPTIONS_YEAR, moment().format('YYYY')) 
} 


function InsightSubscriptions ({ t, history }) {
  const cardTitle = t('general.chart')
  const year = parseInt(localStorage.getItem(CSLS.INSIGHT_SUBSCRIPTIONS_YEAR))
  const export_url_active = "/d/export/insight/subscriptions/active/" + year
  const export_url_sold = "/d/export/insight/subscriptions/sold/" + year
  const export_url_stopped = "/d/export/insight/subscriptions/stopped/" + year
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  console.log(year)


  const { loading, error, data, refetch } = useQuery(GET_INSIGHT_SUBSCRIPTIONS_QUERY, {
    variables: { year: year }
  })

  if (loading) {
    return (
      <InsightSubscriptionsBase year={year} refetch={refetch}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer active={true} loader={true} />
          </Card.Body>
        </Card>
      </InsightSubscriptionsBase>
    )
  }

  if (error) {
    return (
      <InsightSubscriptionsBase year={year} refetch={refetch}>
        <Card title={cardTitle}>
          <Card.Body>
            {t("general.error_sad_smiley")}
          </Card.Body>
        </Card>
      </InsightSubscriptionsBase>
    )
  }

  const monthNames = getMonthNamesShort(t)

  // Add month name to data
  const chartData = data.insightAccountSubscriptions.months.map((item, index) => (
    { ...item, monthName: monthNames[index] }
  ))


  return (
    <InsightSubscriptionsBase year={year} refetch={refetch}>
      <Grid.Row>
        <Grid.Col md={9}>
          <Card title={cardTitle}>
            <ResponsiveContainer width="100%" aspect={2.5}>
              <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName"/>
                <YAxis width={40} />
                <Tooltip />
                <Legend />
                {/* <Area type="monotone" dataKey="sold" stroke={colors["green"]} fillOpacity={0.4} fill={colors["green"]} />
                <Area type="monotone" dataKey="stopped" stroke={colors["red"]} fillOpacity={0.4} fill={colors["red"]} />
                <Area type="monotone" dataKey="active" stroke={colors["blue"]} fillOpacity={0.1} fill={colors["blue"]} /> */}
                <Line type="monotone" dataKey="sold" stroke={colors["green"]} />
                <Line type="monotone" dataKey="stopped" stroke={colors["red"]} />
                <Line type="monotone" dataKey="active" stroke={colors["blue"]} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
        <Grid.Col md={3}>
          {/* Export as sold as excel sheet */}
          <Button
            block
            color="secondary"
            RootComponent="a"
            icon="download-cloud"
            onClick={() => refreshTokenAndOpenExportLinkInNewTab(
              t, doTokenRefresh, history, export_url_sold
            )}
          >
            {t("insight.subscriptions.sold.export_excel")}
          </Button>
          <Button
            block
            color="secondary"
            RootComponent="a"
            icon="download-cloud"
            onClick={() => refreshTokenAndOpenExportLinkInNewTab(
              t, doTokenRefresh, history, export_url_stopped
            )}
          >
            {t("insight.subscriptions.stopped.export_excel")}
          </Button>
          {/* Export as active as excel sheet */}
          <Button
            block
            color="secondary"
            RootComponent="a"
            icon="download-cloud"
            onClick={() => refreshTokenAndOpenExportLinkInNewTab(
              t, doTokenRefresh, history, export_url_active
            )}
          >
            {t("insight.subscriptions.active.export_excel")}
          </Button>
        </Grid.Col>
      </Grid.Row>
    </InsightSubscriptionsBase>
  )
}

export default withTranslation()(withRouter(InsightSubscriptions))