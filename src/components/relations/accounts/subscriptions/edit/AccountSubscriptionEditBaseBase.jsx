// @flow

import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import AppSettingsContext from '../../../../context/AppSettingsContext'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import AccountSubscriptionEditTabs from "./AccountSubscriptionEditTabs"

import ProfileCardSmall from "../../../../ui/ProfileCardSmall"
import ProfileMenu from "../../ProfileMenu"
import moment from 'moment'

import ButtonBack from '../../../../ui/ButtonBack'


function AccountSubscriptionEditBaseBase({t, history, match, children, returnUrl, account=null, subscription=null, activeTab}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const cardTitle = (subscription) ? 
    <span className="text-muted">
      - {subscription.organizationSubscription.name + " " + moment(subscription.dateStart).format(dateFormat)} - {subscription.creditTotal} {t("general.credits")}
    </span> : ""

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={(account) ? account.firstName + " " + account.lastName : ""} >
            <div className='page-options d-flex'>
              {(returnUrl) ? <ButtonBack returnUrl={returnUrl} /> : ""}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              <Card>
                <Card.Header>
                  <Card.Title>{t('relations.account.subscriptions.title_edit')} {cardTitle}</Card.Title>
                </Card.Header>
                <AccountSubscriptionEditTabs 
                  account_id={accountId}
                  subscription_id={subscriptionId}
                  active={activeTab}
                />
                {children}
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
              {/* <HasPermissionWrapper permission="change"
                                    resource="accountsubscription">
                <Link to={returnUrl}>
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
                  </Button>
                </Link>
              </HasPermissionWrapper> */}
              <ProfileMenu 
                activeLink='subscriptions'
                accountId={accountId}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditBaseBase))
