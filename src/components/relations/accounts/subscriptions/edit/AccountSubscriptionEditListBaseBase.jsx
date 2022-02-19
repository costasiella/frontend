import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import AppSettingsContext from '../../../../context/AppSettingsContext'

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import AccountSubscriptionEditTabs from "./AccountSubscriptionEditTabs"
import ContentCard from "../../../../general/ContentCard"

import ButtonBack from '../../../../ui/ButtonBack'
import ProfileCardSmall from "../../../../ui/ProfileCardSmall"
import ProfileMenu from "../../ProfileMenu"
import moment from 'moment'


function AccountSubscriptionEditBaseBase({
  t, 
  history, 
  match, 
  children, 
  account=null, 
  subscription=null, 
  pageInfo, 
  onLoadMore, 
  activeTab,
  returnUrl,
  pageHeaderButtonList=""}
  ){

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
              {pageHeaderButtonList}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              <ContentCard 
                cardTitle={<span>{t('relations.account.subscriptions.title_edit')} {cardTitle}</span>}
                pageInfo={pageInfo}
                onLoadMore={onLoadMore}
                hasCardBody={false}
                cardTabs={<AccountSubscriptionEditTabs 
                  account_id={accountId}
                  subscription_id={subscriptionId}
                  active={activeTab} /> }
              >
                {children}
              </ContentCard>
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
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
