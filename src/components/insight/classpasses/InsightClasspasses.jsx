import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts'

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
import { GET_INSIGHT_CLASSPASSES_QUERY } from './queries'
import { TOKEN_REFRESH } from "../../../queries/system/auth"
import InsightClasspassesBase from './InsightClasspassesBase'

function InsightClasspasses ({ t, history }) {
  const year = parseInt(localStorage.getItem(CSLS.INSIGHT_CLASSPASSES_YEAR))
  const export_url_active = "/d/export/insight/classpasses/active/" + year
  const export_url_sold = "/d/export/insight/classpasses/sold/" + year
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  const { loading, error, data, refetch } = useQuery(GET_INSIGHT_CLASSPASSES_QUERY, {
    variables: { year: year },
  })

  if (loading) {
    return (
      <InsightClasspassesBase year={year} refetch={refetch}>
        <Card title={t('general.chart')}>
          <Dimmer active={true} loader={true} />
        </Card>
      </InsightClasspassesBase>
    )
  }

  if (error) {
    return (
      <InsightClasspassesBase year={year} refetch={refetch}>
        <Card title={t('general.chart')}>
          {t("general.error_sad_smiley")}
        </Card>
      </InsightClasspassesBase>
    )
  }

  const monthNames = getMonthNamesShort(t)

  // Add month name to data
  const chartData = data.insightAccountClasspasses.months.map((item, index) => (
    { ...item, monthName: monthNames[index] }
  ))

  return (
    <InsightClasspassesBase year={year} refetch={refetch}>
        <Grid.Col md={9}>
          <Card title={t('general.chart')}>
            <Card.Body>
              <ResponsiveContainer width="100%" aspect={2.5}>
                <AreaChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 30,
                    right: 30,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <XAxis dataKey="monthName"/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sold" stroke={colors["blue"]} fillOpacity={0.4} fill={colors["blue"]} />
                  <Area type="monotone" dataKey="active" stroke={colors["green"]} fillOpacity={0.2} fill={colors["green"]} />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
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
            {t("insight.classpasses.sold.export_excel")}
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
            {t("insight.classpasses.active.export_excel")}
          </Button>
        </Grid.Col>
    </InsightClasspassesBase>
  )
}

export default withTranslation()(withRouter(InsightClasspasses))