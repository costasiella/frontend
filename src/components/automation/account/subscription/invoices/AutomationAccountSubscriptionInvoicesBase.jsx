import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import {
  Button,
  Page,
  Grid,
  Container,
} from "tabler-react";

import SiteWrapper from "../../../../SiteWrapper"
import AutomationBack from "../../../AutomationBack"

function AutomationAccountSubscriptionInvoicesBase({t, history, match, children, showNewTask=false, returnUrl="/automation"}) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('automation.title')} >
            <div className="page-options d-flex">
              <AutomationBack returnUrl={returnUrl} />
              {(showNewTask) ?
                <Link to={"/automation/account/subscriptions/invoices/add"}>
                  <Button color="primary" className='ml-2' >
                  {t('general.new_task')}
                  </Button>
                </Link>
                : "" }
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

export default withTranslation()(withRouter(AutomationAccountSubscriptionInvoicesBase))