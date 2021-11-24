import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import C3Chart from "react-c3js"

import AppSettingsContext from '../../context/AppSettingsContext'
import CSLS from "../../../tools/cs_local_storage"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../tools/refresh_token_and_open_export_link"

import {
  colors,
  Grid,
  Button,
  Card,
} from "tabler-react";
// import ContentCard from "../../general/ContentCard"
import { GET_REVENUE_TOTAL_QUERY, GET_REVENUE_SUBTOTAL_QUERY } from './queries'
import { TOKEN_REFRESH } from "../../../queries/system/auth"
import InsightRevenueBase from './InsightRevenueBase'

function InsightRevenue ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const year = localStorage.getItem(CSLS.INSIGHT_REVENUE_YEAR)
  // const export_url_active = "/d/export/insight/classpasses/active/" + year
  // const export_url_sold = "/d/export/insight/classpasses/sold/" + year

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

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


  if (loadingTotal || loadingSubtotal) {
    return (
      <InsightRevenueBase year={year}>
        {t("general.loading_with_dots")}
      </InsightRevenueBase>
    )
  }

  if (errorTotal || errorSubtotal) {
    return (
      <InsightRevenueBase year={year}>
        {t("general.error_sad_smiley")}
      </InsightRevenueBase>
    )
  }

  function refetchData(year) {
    refetchTotal({year: year})
    refetchSubtotal({year: year})
  }

  console.log(dataTotal)
  console.log(dataSubtotal)

  const data_label_total = t("insight.revenue.total.title")
  const chart_data_total = dataTotal.insightRevenueTotal.data
  console.log("chart_data total")
  console.log(data_label_total, ...chart_data_total)

  const data_label_subtotal = t("insight.revenue.subtotal.title")
  const chart_data_subtotal = dataSubtotal.insightRevenueSubtotal.data
  console.log("chart_data subtotal")
  console.log(data_label_subtotal, ...chart_data_subtotal)


  return (
    <InsightRevenueBase year={year} refetchData={refetchData}>
      {/* <Grid.Row> */}
        <Grid.Col md={9}>
          <Card title={t('general.total')}>
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
                    [ 'total', ...chart_data_total],
                    [ 'subtotal', ...chart_data_subtotal],
                  ],
                  type: "bar", // default type of chart
                  groups: [['total'], ['subtotal']],
                  colors: {
                    total: colors["blue"],
                    subtotal: colors["green"],
                  },
                  names: {
                    // name of each serie
                    total: data_label_total,
                    subtotal: data_label_subtotal,
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
              {t("insight.revenue.total.explanation")}
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
      {/* </Grid.Row> */}
    </InsightRevenueBase>
  //   <SiteWrapper>
  //     <div className="my-3 my-md-5">
  //       <Container>
  //         <Page.Header title={t("insight.title")} subTitle={t("general.classpasses") + " " + year}>
  //           <div className="page-options d-flex">
  //             <InsightBackHome />
  //           </div>
  //         </Page.Header>

  //       </Container>  
  //     </div>
  //   </SiteWrapper>
  )
}

export default withTranslation()(withRouter(InsightRevenue))