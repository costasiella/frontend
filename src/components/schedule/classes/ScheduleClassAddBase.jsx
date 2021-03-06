import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react"
import SiteWrapper from "../../SiteWrapper"
import ButtonBack from "../../ui/ButtonBack"


function ScheduleClassAddBase({t, children}) {
  const returnUrl = "/schedule/classes"

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("schedule.title")} subTitle={t("general.classes")}>
            <div className='page-options d-flex'>
              <ButtonBack returnUrl={returnUrl} />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
              {children}
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(ScheduleClassAddBase))