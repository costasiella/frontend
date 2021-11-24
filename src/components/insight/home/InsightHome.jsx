// @flow

import React, {Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Card,
  Page,
  Grid,
  Container,
  StampCard
} from "tabler-react";

import HomeItemButton from "../../ui/HomeItemButton"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"


import InsightMenu from "../InsightMenu"


class InsightHome extends Component {
  constructor(props) {
    super(props)
    console.log("Insight home props:")
    console.log(props)
  }

  render() {
    const t = this.props.t
    const match = this.props.match
    const history = this.props.history
    const linkTitle = t("insight.home.link_view")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("insight.title")} />
            <Grid.Row>
              <Grid.Col md={9}>
                <Grid.Row>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("insight.classpasses.title")}</h5>
                        {t("insight.classpasses.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/insight/classpasses" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("insight.subscriptions.title")}</h5>
                        {t("insight.subscriptions.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/insight/subscriptions" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("insight.revenue.title")}</h5>
                        {t("insight.revenue.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/insight/revenue" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                </Grid.Row>
              </Grid.Col>
              <Grid.Col md={3}>
                <InsightMenu />
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(InsightHome))