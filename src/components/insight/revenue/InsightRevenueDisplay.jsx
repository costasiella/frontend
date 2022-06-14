import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  colors,
  Dimmer,
  Grid,
  Card,
  Table,
} from "tabler-react";

import { getMonthNamesShort } from '../../../tools/date_tools'


function InsightRevenueDisplay({ 
  t, 
  history, 
  error, 
  loading, 
  cardTitle,
  data
 }) {

  if (loading) {
    return (
      <Grid.Row>
        <Grid.Col md={9}>
          <Card title={cardTitle}>
            <Card.Body>
              <Dimmer loader={true} active={true} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col md={3}>
        </Grid.Col>
      </Grid.Row>
    )
  }

  if (error) {
    <Grid.Row>
      <Grid.Col md={9}>
        <Card title={cardTitle}>
          <Card.Body>
            {t("general.error_sad_smiley")}
          </Card.Body>
        </Card>
      </Grid.Col>
    </Grid.Row>
  }



  const monthNames = getMonthNamesShort(t)
  // Add month name to data
  const chartData = data.months.map((item, index) => (
    { ...item, monthName: monthNames[index] }
  ))

  return (
    <Grid.Row>
      <Grid.Col md={9}>
        <Card title={cardTitle}>
          <ResponsiveContainer width="100%" aspect={2.6}>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill={colors['blue']} />
              <Bar dataKey="subtotal" stackId="a" fill={colors['green']} />
              <Bar dataKey="tax" stackId="a" fill={colors['orange']} />
            </BarChart>
          </ResponsiveContainer>
          <Card.Footer>
            {t("insight.revenue.total.explanation")}
          </Card.Footer>
        </Card>
      </Grid.Col>
      <Grid.Col md={3}>
        <Card title={t("general.data")}>
          <small>
          <Table cards>
            <Table.Body>
              {data.months.map((item, index) => (
                <Table.Row>
                  <Table.Col className="cs-insight-data-table-cell">
                    {monthNames[index]}
                  </Table.Col>
                  <Table.Col className="cs-insight-data-table-cell text-right">
                    {item['totalDisplay']}
                  </Table.Col>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          </small>
        </Card>
        {/* Export as sold as excel sheet */}
        {/* <Button
          block
          color="secondary"
          RootComponent="a"
          icon="download-cloud"
          onClick={() => refreshTokenAndOpenExportLinkInNewTab(
            t, doTokenRefresh, history, export_url_sold
          )}
        >
          {t("insight.classpasses.sold.export_excel")}
        </Button> */}
        {/* Export as active as excel sheet */}
        {/* <Button
          block
          color="secondary"
          RootComponent="a"
          icon="download-cloud"
          onClick={() => refreshTokenAndOpenExportLinkInNewTab(
            t, doTokenRefresh, history, export_url_active
          )}
        >
          {t("insight.classpasses.active.export_excel")}
        </Button> */}
      </Grid.Col>
    </Grid.Row>
  )
}

export default withTranslation()(withRouter(InsightRevenueDisplay))