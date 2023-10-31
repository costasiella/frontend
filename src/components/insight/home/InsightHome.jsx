import React, {Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Card,
  Page,
  Grid,
  Container,
} from "tabler-react";

import HomeItemButton from "../../ui/HomeItemButton"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"


class InsightHome extends Component {
  constructor(props) {
    super(props)
    console.log("Insight home props:")
    console.log(props)
  }

  render() {
    const t = this.props.t
    const linkTitle = t("insight.home.link_view")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("insight.title")} />
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("insight.home.products.title")}</h4>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                                    resource="insightclasspasses">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.classpasses.title")}</h5>
                      {t("insight.classpasses.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/classpasses" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                                    resource="insightsubscriptions">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.subscriptions.title")}</h5>
                      {t("insight.subscriptions.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/subscriptions" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                                    resource="insighttrialpasses">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.trialpasses.title")}</h5>
                      {t("insight.trialpasses.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/trialpasses" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("insight.home.finance.title")}</h4>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                                    resource="insightrevenue">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.revenue.title")}</h5>
                      {t("insight.revenue.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/revenue" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                                    resource="insightfinanceinvoicesopenondate">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.invoicesopenondate.title")}</h5>
                      {t("insight.invoicesopenondate.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/invoices_open_on_date" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("insight.home.accounts.title")}</h4>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                                    resource="insightaccountsinactive">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.inactive_accounts.title")}</h5>
                      {t("insight.inactive_accounts.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/inactive_accounts" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                                    resource="insightkeynumberswosubscription">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.keynumbers_wo_subscription.title")}</h5>
                      {t("insight.keynumbers_wo_subscription.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/keynumbers_wo_subscription" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
            </Grid.Row>
            <Grid.Row>
             <Grid.Col md={12}>
                <h4>{t("insight.home.schedule.title")}</h4>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                                    resource="insightinstructorclassesmonth">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("insight.instructor_classes_month.title")}</h5>
                      {t("insight.instructor_classes_month.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/insight/instructor_classes_month" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(InsightHome))