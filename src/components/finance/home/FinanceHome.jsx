import React, {Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container
} from "tabler-react";
import HomeItemButton from "../../ui/HomeItemButton"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"


class FinanceHome extends Component {
  constructor(props) {
    super(props)
    console.log("Finance home props:")
    console.log(props)
  }


  render() {
    const t = this.props.t
    const linkTitle = t("general.manage")
    const linkTitleView = t("general.view")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("finance.title")} />
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("finance.home.general.title")}</h4>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.invoices.title")}</h5>
                    {t("finance.invoices.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/invoices" />
                  </Card.Body>
                </Card>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.orders.title")}</h5>
                    {t("finance.orders.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/orders" />
                  </Card.Body>
                </Card>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("finance.home.structure.title")}</h4>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.glaccounts.title")}</h5>
                    {t("finance.glaccounts.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/glaccounts" />
                  </Card.Body>
                </Card>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.costcenters.title")}</h5>
                    {t("finance.costcenters.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/costcenters"/>
                  </Card.Body>
                </Card>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.payment_methods.title")}</h5>
                    {t("finance.payment_methods.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/paymentmethods" />
                  </Card.Body>
                </Card>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("finance.home.taxes.title")}</h4>
              </Grid.Col>
              <Grid.Col md={3} lg={3}>
                <Card>
                  <Card.Body>
                    <h5>{t("finance.taxrates.title")}</h5>
                    {t("finance.taxrates.explanation")}
                    <br /><br />
                    <HomeItemButton linkTitle={linkTitle} link="/finance/taxrates" />
                  </Card.Body>
                </Card>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                          resource="insightfinancetaxratesummary">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("finance.taxrates_summary.title")}</h5>
                      {t("finance.taxrates_summary.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitleView} link="/finance/taxrates_summary" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col md={12}>
                <h4>{t("finance.home.batches.title")}</h4>
              </Grid.Col>
              <HasPermissionWrapper permission="view"
                          resource="financepaymentbatch">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("finance.payment_batch_collections.title")}</h5>
                      {t("finance.payment_batch_collections.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/finance/paymentbatches/collection" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                          resource="financepaymentbatch">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("finance.payment_batch_payments.title")}</h5>
                      {t("finance.payment_batch_payments.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/finance/paymentbatches/payment" />
                    </Card.Body>
                  </Card>
                </Grid.Col>
              </HasPermissionWrapper>
              <HasPermissionWrapper permission="view"
                          resource="financepaymentbatchcategory">
                <Grid.Col md={3} lg={3}>
                  <Card>
                    <Card.Body>
                      <h5>{t("finance.payment_batch_categories.title")}</h5>
                      {t("finance.payment_batch_categories.explanation")}
                      <br /><br />
                      <HomeItemButton linkTitle={linkTitle} link="/finance/paymentbatchcategories" />
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


export default withTranslation()(withRouter(FinanceHome))