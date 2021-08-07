// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react"
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"


import ClassEditMenu from './ClassEditMenu'
import ClassEditBack from './ClassEditBack';


function ClassEditBaseBase({t, match, subTitle="", cardTitle="", defaultCard=true, menuActiveLink="", sidebarButton=""}) {
  return (
    <Container>
      <Page.Header 
        title={t("schedule.title")} 
        subTitle={subTitle}
      >
        <ClassEditBack />
      </Page.Header>
      <Grid.Row>
        <Grid.Col md={9}>
          {(!defaultCard) ? children :
            <Card>
              <Card.Header>
                <Card.Title>{this.props.card_title}</Card.Title>
              </Card.Header>
              <Card.Body>
                {this.props.children}
              </Card.Body>
            </Card>
          }
        </Grid.Col>
        <Grid.Col md={3}>
          {sidebarButton}
          <h5>{t('general.menu')}</h5>
          <ClassEditMenu activeLink={menuActiveLink} classId={classId}/>
        </Grid.Col>
      </Grid.Row>
    </Container>
  )
}


export default withTranslation()(withRouter(ClassEditBaseBase))