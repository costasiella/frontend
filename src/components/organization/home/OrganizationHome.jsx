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
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import HomeItemButton from "../../ui/HomeItemButton"

import OrganizationMenu from "../OrganizationMenu"


class OrganizationHome extends Component {
  constructor(props) {
    super(props)
    console.log("School home props:")
    console.log(props)
  }


  render() {
    const t = this.props.t
    const match = this.props.match
    const history = this.props.history
    const id = match.params.id
    const linkTitle = t("general.manage")

    return (
      <SiteWrapper>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("organization.title")} />
            <Grid.Row>
              <Grid.Col md={9}>
                <Grid.Row>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.organization.title")}</h5>
                        {t("organization.organization.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/edit/T3JnYW5pemF0aW9uTm9kZToxMDA=" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.locations.title")}</h5>
                        {t("organization.locations.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/locations" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.classtypes.title")}</h5>
                        {t("organization.classtypes.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/classtypes" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.classpasses.title")}</h5>
                        {t("organization.classpasses.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/classpasses" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.subscriptions.title")}</h5>
                        {t("organization.subscriptions.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/subscriptions" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  {/* <Grid.Col md={4} lg={4}>
                    <Link to='/organization/appointment_categories'>
                      <StampCard header={<small>{t('organization.appointments.title')}</small>} footer={t('')} color="blue" icon="calendar" />
                    </Link>
                  </Grid.Col> */}
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.levels.title")}</h5>
                        {t("organization.levels.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/levels" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.holidays.title")}</h5>
                        {t("organization.holidays.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/holidays" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.discoveries.title")}</h5>
                        {t("organization.discoveries.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/discoveries" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.languages.title")}</h5>
                        {t("organization.languages.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/languages" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.organization.branding.title")}</h5>
                        {t("organization.organization.branding.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/edit/T3JnYW5pemF0aW9uTm9kZToxMDA=/branding" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <Grid.Col md={4} lg={4}>
                    <Card>
                      <Card.Body>
                        <h5>{t("organization.documents.title")}</h5>
                        {t("organization.documents.explanation")}
                        <br /><br />
                        <HomeItemButton linkTitle={linkTitle} link="/organization/documents/T3JnYW5pemF0aW9uTm9kZToxMDA=" />
                      </Card.Body>
                    </Card>
                  </Grid.Col>
                  <HasPermissionWrapper permission="view"
                                        resource="organizationannouncement">

                    <Grid.Col md={4} lg={4}>
                      <Card>
                        <Card.Body>
                          <h5>{t("organization.announcements.title")}</h5>
                          {t("organization.announcements.explanation")}
                          <br /><br />
                          <HomeItemButton linkTitle={linkTitle} link="/organization/announcements" />
                        </Card.Body>
                      </Card>
                    </Grid.Col>
                  </HasPermissionWrapper>
                </Grid.Row>
              </Grid.Col>
              <Grid.Col md={3}>
                <OrganizationMenu />
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapper>
    )}
  }


export default withTranslation()(withRouter(OrganizationHome))