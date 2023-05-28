import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Container,
  Page
} from "tabler-react"

import SiteWrapper from '../../SiteWrapper'
import InsightBackHome from '../InsightBackHome'


function InsightInstructorClassesMonthBase({t, history, children}) {

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("insight.title")}>
            <div className="page-options d-flex">
              <InsightBackHome />
            </div>
          </Page.Header>
          {children}
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(InsightInstructorClassesMonthBase))