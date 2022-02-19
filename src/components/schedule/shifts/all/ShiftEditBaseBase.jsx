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
import ShiftEditMenu from './ShiftEditMenu'


function ShiftEditBaseBase({t, match, children, subTitle="", cardTitle="", defaultCard=true, menuActiveLink="", pageHeaderButtonList=""}) {
  const shiftId = match.params.shift_id
  
  return (
    <SiteWrapper>
      <Container>
        <Page.Header 
          title={t("schedule.title")} 
          subTitle={subTitle}
        >
          <div className="page-options d-flex">
            {pageHeaderButtonList}
          </div>
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
            <ShiftEditMenu activeLink={menuActiveLink} shiftId={shiftId}/>
          </Grid.Col>
        </Grid.Row>
      </Container>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ShiftEditBaseBase))