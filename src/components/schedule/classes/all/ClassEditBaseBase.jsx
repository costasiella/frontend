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
import ClassEditMenu from './ClassEditMenu'


function ClassEditBaseBase({t, match, children, subTitle="", cardTitle="", defaultCard=true, menuActiveLink="", pageHeaderButtonList=""}) {
  const classId = match.params.class_id
  
  return (
    <SiteWrapper>
      <Container>
        <Page.Header 
          title={t("schedule.title")} 
          subTitle={subTitle}
        >
          <div className='page-options d-flex'>
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
            <ClassEditMenu activeLink={menuActiveLink} classId={classId}/>
          </Grid.Col>
        </Grid.Row>
      </Container>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(ClassEditBaseBase))