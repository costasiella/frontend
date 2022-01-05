import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react"
import SiteWrapper from "../../../SiteWrapper"
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"


import ShiftEditMenu from './ShiftEditMenu'
import ShiftEditBack from './ShiftEditBack';


function ShiftEditBaseBase({t, match, children, subTitle="", cardTitle="", defaultCard=true, menuActiveLink="", sidebarButton=""}) {
  const classId = match.params.class_id
  
  return (
    <SiteWrapper>
      <Container>
        <Page.Header 
          title={t("schedule.title")} 
          subTitle={subTitle}
        >
          <ShiftEditBack />
        </Page.Header>
        <Grid.Row>
          <Grid.Col md={9}>
            {(!defaultCard) ? children :
              <Card title={cardTitle}>
                {children}
              </Card>
            }
          </Grid.Col>
          <Grid.Col md={3}>
            {sidebarButton}
            <h5>{t('general.menu')}</h5>
            <ShiftEditMenu activeLink={menuActiveLink} classId={classId}/>
          </Grid.Col>
        </Grid.Row>
      </Container>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ShiftEditBaseBase))