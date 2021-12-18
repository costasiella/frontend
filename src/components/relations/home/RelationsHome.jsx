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

import RelationsMenu from "../RelationsMenu"


class RelationsHome extends Component {
  constructor(props) {
    super(props)
    console.log("School home props:")
    console.log(props)
  }


  render() {
    const t = this.props.t
    const match = this.props.match
    const history = this.props.history
    const linkTitle = t("general.manage")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("relations.title")} />
            <Grid.Row>
              <Grid.Col md={9}>
                <Grid.Row>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("relations.accounts.title")}</h5>
                        {t("relations.accounts.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/relations/accounts" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  {/* <HasPermissionWrapper permission="view"
                                        resource="business">
                    <Grid.Col md={4} lg={4}>
                      <Link to='/relations/suppliers')}>
                        <StampCard header={<small>{t('relations.suppliers.title')}</small>} footer={t('')} color="blue" icon="package" />
                      </Link>
                    </Grid.Col>
                  </HasPermissionWrapper> */}
                  <HasPermissionWrapper permission="view"
                                        resource="business">
                    <Grid.Col md={4} lg={4}>
                      <Card>
                        <Card.Body>
                          <h5>{t("relations.b2b.title")}</h5>
                          {t("relations.b2b.explanation")}
                          <br /><br />
                          <HomeItemButton linkTitle={linkTitle} link="/relations/b2b" />
                        </Card.Body>
                      </Card>
                    </Grid.Col>
                  </HasPermissionWrapper>
                </Grid.Row>
              </Grid.Col>
              <Grid.Col md={3}>
                <RelationsMenu />
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(RelationsHome))