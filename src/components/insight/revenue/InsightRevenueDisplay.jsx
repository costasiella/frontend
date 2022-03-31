import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import C3Chart from "react-c3js"
import {
  colors,
  Dimmer,
  Grid,
  Card,
} from "tabler-react";

function InsightRevenueDisplay({ 
  t, 
  history, 
  error, 
  loading, 
  cardTitle,
  cardFooterContent,
  dataTotal, 
  dataSubtotal, 
  dataTax
 }) {

  const labelDataTotal = t("insight.revenue.total.title")
  const labelDataSubtotal = t("insight.revenue.subtotal.title")
  const labelDataTax = t("insight.revenue.tax.title")

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

  // console.log("chart_data total")
  // console.log(labelDataTotal, ...dataTotal)

  // console.log("chart_data subtotal")
  // console.log(labelDataSubtotal, ...dataSubtotal)

  // console.log("chart_data tax")
  // console.log(labelDataTax, ...dataTax)


  return (
    <Grid.Row>
      <Grid.Col md={9}>
        <Card title={cardTitle}>
          <Card.Body>
            <C3Chart
              style={{ height: "16rem" }}
              data={{
                x: 'x',
                columns: [
                  // each columns data as array, starting with "name" and then containing data
                  [ 'x',
                    t("datetime.months.short_january"),
                    t("datetime.months.short_february"),
                    t("datetime.months.short_march"),
                    t("datetime.months.short_april"),
                    t("datetime.months.short_may"),
                    t("datetime.months.short_june"),
                    t("datetime.months.short_july"),
                    t("datetime.months.short_august"),
                    t("datetime.months.short_september"),
                    t("datetime.months.short_october"),
                    t("datetime.months.short_november"),
                    t("datetime.months.short_decemer"),
                  ],
                  [ 'total', ...dataTotal],
                  [ 'subtotal', ...dataSubtotal],
                  [ 'tax', ...dataTax],
                ],
                type: "bar", // default type of chart
                // types: {
                //   total: "bar"
                // },
                groups: [['subtotal', 'tax']],
                colors: {
                  total: colors["blue"],
                  subtotal: colors["green"],
                  tax: colors["orange"],
                },
                names: {
                  // name of each serie
                  total: labelDataTotal,
                  subtotal: labelDataSubtotal,
                  tax: labelDataTax,
                },
                
              }}
              axis={{
                y: {
                  padding: {
                    bottom: 0,
                  },
                  show: true,
                },
                x: {
                  padding: {
                    left: 0,
                    right: 0,
                  },
                  type: 'category',
                  show: true,
                },
              }}
              tooltip={{
                format: {
                  title: function(x) {
                    return "";
                  },
                },
              }}
              padding={{
                bottom: 0,
                // left: -1,
                right: -1,
              }}
              point={{
                show: false,
              }}
            />
          </Card.Body>
          <Card.Footer>
            {cardFooterContent}
          </Card.Footer>
        </Card>
      </Grid.Col>
      <Grid.Col md={3}>
        {/* Export as sold as excel sheet */}
        {/* <Button
          block
          color="secondary"
          RootComponent="a"
          icon="download-cloud"
          onClick={() => refreshTokenAndOpenExportLinkInNewTab(
            doTokenRefresh, history, export_url_sold
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
            doTokenRefresh, history, export_url_active
          )}
        >
          {t("insight.classpasses.active.export_excel")}
        </Button> */}
      </Grid.Col>
    </Grid.Row>
  )
}

export default withTranslation()(withRouter(InsightRevenueDisplay))