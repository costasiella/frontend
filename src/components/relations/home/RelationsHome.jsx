import React, {Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
  Page,
  Grid,
  Container
} from "tabler-react";
import HomeItemButton from "../../ui/HomeItemButton"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"


class RelationsHome extends Component {
  constructor(props) {
    super(props)
    console.log("School home props:")
    console.log(props)
  }


  render() {
    const t = this.props.t
    const linkTitle = t("general.manage")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("relations.title")} />
            <Grid.Row>
              <Grid.Col md={3} lg={3}>
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
                <Grid.Col md={3} lg={3}>
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
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(RelationsHome))