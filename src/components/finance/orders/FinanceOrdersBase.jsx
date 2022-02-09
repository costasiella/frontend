import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Container,
  Grid,
  Page
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"
import FinanceOrdersFilter from "./FinanceOrdersFilter"


const FinanceOrdersBase = ({ t, history, children, refetch }) => (
  <SiteWrapper>
    <div className="my-3 my-md-5">
      <Container>
        <Page.Header title={t("finance.title")}>
          <div className="page-options d-flex">
            <FinanceOrdersFilter refetch={refetch}/>
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

export default withTranslation()(withRouter(FinanceOrdersBase))