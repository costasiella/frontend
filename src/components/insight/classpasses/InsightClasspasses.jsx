import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import C3Chart from "react-c3js"
import {
  colors,
  Grid,
  Button,
  Card,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../tools/refresh_token_and_open_export_link"
import { GET_CLASSPASSES_SOLD_QUERY, GET_CLASSPASSES_ACTIVE_QUERY } from './queries'
import { TOKEN_REFRESH } from "../../../queries/system/auth"
import InsightClasspassesBase from './InsightClasspassesBase'

function InsightClasspasses ({ t, history }) {
  const year = localStorage.getItem(CSLS.INSIGHT_CLASSPASSES_YEAR)
  const export_url_active = "/d/export/insight/classpasses/active/" + year
  const export_url_sold = "/d/export/insight/classpasses/sold/" + year
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  const { 
    loading: loadingSold, 
    error: errorSold, 
    data: dataSold,
    refetch: refetchSold
   } = useQuery(GET_CLASSPASSES_SOLD_QUERY, {
    variables: { year: year }
  })

  const { 
    loading: loadingActive, 
    error: errorActive, 
    data: dataActive,
    refetch: refetchActive
   } = useQuery(GET_CLASSPASSES_ACTIVE_QUERY, {
    variables: { year: year }
  })


  if (loadingSold || loadingActive) {
    return (
      <InsightClasspassesBase year={year}>
        {t("general.loading_with_dots")}
      </InsightClasspassesBase>
    )
  }

  if (errorSold || errorActive) {
    return (
      <InsightClasspassesBase year={year}>
        {t("general.error_sad_smiley")}
      </InsightClasspassesBase>
    )
  }

  function refetchData(year) {
    refetchActive({year: year})
    refetchSold({year: year})
  }

  console.log(dataSold)
  console.log(dataActive)

  const data_sold_label = t("insight.classpasses.sold.title")
  const chart_data_sold = dataSold.insightAccountClasspassesSold.data
  console.log("chart_data sold")
  console.log(data_sold_label, ...chart_data_sold)

  const data_active_label = t("insight.classpasses.active.title")
  const chart_data_active = dataActive.insightAccountClasspassesActive.data
  console.log("chart_data active")
  console.log(data_sold_label, ...chart_data_active)


  return (
    <InsightClasspassesBase year={year} refetchData={refetchData}>
      {/* <Grid.Row> */}
        <Grid.Col md={9}>
          <Card title={t('general.chart')}>
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
                    [ 'sold', ...chart_data_sold],
                    [ 'active', ...chart_data_active],
                  ],
                  type: "area", // default type of chart
                  groups: [['sold'], ['active']],
                  colors: {
                    sold: colors["blue"],
                    active: colors["green"],
                  },
                  names: {
                    // name of each serie
                    sold: data_sold_label,
                    active: data_active_label,
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
      {/* </Grid.Row> */}
    </InsightClasspassesBase>
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

export default withTranslation()(withRouter(InsightClasspasses))