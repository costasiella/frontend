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


function ShopClasspassPricingCard({ t, classpass, btnLink, active=false }) {
  // classpass should be an object with at least the following values from an organizationClasspass object:
  // id, name, priceDisplay, unlimited, classes, validity, link
  return (
    <PricingCard active={active}>
      <PricingCard.Category>
        {classpass.name}
      </PricingCard.Category>
      <PricingCard.Price>
        {classpass.priceDisplay}
      </PricingCard.Price>
      <PricingCard.AttributeList>
        <PricingCard.AttributeItem>
          <b>{(classpass.unlimited) ? t('general.unlimited') : classpass.classes }</b> { " " }
          {((classpass.classes !== 1) || (classpass.unlimited))? t('general.classes'): t('general.class')}
        </PricingCard.AttributeItem>
        <PricingCard.AttributeItem>
          {t('general.valid_for')} { " " }
          <b>{classpass.validity}</b> {' '} {classpass.validityUnitDisplay}
        </PricingCard.AttributeItem>
      </PricingCard.AttributeList>
      {(btnLink) ?
        <Link to={btnLink}>
          <PricingCard.Button >
            {t("shop.classpasses.choose")} <Icon name="chevron-right" />
          </PricingCard.Button>
        </Link>
        : ""
      }
    </PricingCard>
  )
}

export default withTranslation()(withRouter(ShopClasspassPricingCard))
