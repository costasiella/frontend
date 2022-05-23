import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Page,
  Icon,
  Container,
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"

function InsightInactiveAccountsViewBase({t, history, match, children, subTitle}) {
  const returnUrl = `/insight/inactive_accounts`

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("insight.inactive_accounts.title")} subTitle={subTitle}>
            <div className="page-options d-flex">
                <Link to={returnUrl} 
                      className='btn btn-secondary'>
                  <Icon prefix="fe" name="arrow-left" /> {t('general.back')}
                </Link>
            </div>
          </Page.Header>
          {children}
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(InsightInactiveAccountsViewBase))