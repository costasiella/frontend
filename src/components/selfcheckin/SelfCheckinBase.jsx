import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react";
import SiteWrapperSelfCheckin from "../SiteWrapperSelfCheckin"


function SelfCheckinBase({ t, match, history, children, title, subTitle="" }) {

  return (
    <SiteWrapperSelfCheckin>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={title} subTitle={subTitle} />
            <Grid.Row>
              <Grid.Col md={12}>
                { children }
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapperSelfCheckin>
  )
}


export default withTranslation()(withRouter(SelfCheckinBase))