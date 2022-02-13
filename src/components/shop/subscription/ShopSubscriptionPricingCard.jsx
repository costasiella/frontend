import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  PricingCard
} from "tabler-react";

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopClasspassPricingCard({ t, subscription, btnLink, active=false, displayCheckoutInfo=false }) {
  // classpass should be an object with at least the following values from an organizationClasspass object:
  // id, name, priceDisplay, unlimited, classes, validity, link
  return (
    <PricingCard active={active}>
      <PricingCard.Category>
        {subscription.name}
      </PricingCard.Category>
      <PricingCard.Price>
        {subscription.priceTodayDisplay}
      </PricingCard.Price>
      <PricingCard.AttributeList>
        <PricingCard.AttributeItem>
          {/* {((subscription.classes != 1) || (subscription.unlimited))? t('general.classes'): t('general.class')} / {t('general.month')} { ": " } */}
          {t('general.classes')} / {t('general.month')} { ": " }
          <b>{(subscription.unlimited) ? t('general.unlimited') : subscription.classes }</b> 
        </PricingCard.AttributeItem>
        <PricingCard.AttributeItem>
          {t('general.min_duration')} { ": " }
          <b>{subscription.minDuration} {(subscription.minDuration === 1) ? t("general.month") : t("general.months")}</b> 
        </PricingCard.AttributeItem>
        {(displayCheckoutInfo) ? 
          <PricingCard.AttributeItem>
            {t("general.first_month")}: <b>{subscription.priceFirstMonthDisplay}</b>
          </PricingCard.AttributeItem>
        : ""}
        {(displayCheckoutInfo && subscription.accountRegistrationFee > 0) ? 
          <PricingCard.AttributeItem>
            {t("general.registration_fee")}: <b>{subscription.accountRegistrationFeeDisplay}</b>
          </PricingCard.AttributeItem>
        : ""}
      </PricingCard.AttributeList>
      {(btnLink) ?
        <Link to={btnLink}>
          <PricingCard.Button >
            {t("shop.subscriptions.choose")} <Icon name="chevron-right" />
          </PricingCard.Button>
        </Link>
        : ""
      }
    </PricingCard>
  )
}

export default withTranslation()(withRouter(ShopClasspassPricingCard))
