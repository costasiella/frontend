import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Container
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage'
import SiteWrapperShop from "../../../SiteWrapperShop"
import ShopAccountBack from "../ShopAccountBack"
import ShopAccountProfileBtnDownloadData from './ShopAccountProfileBtnDownloadData'


function ShopAccountProfileBase({ t, match, history, children, accountName="" }) {
  // Fetch back location from localStorage, if no value set, default back to /finance/invoices
  let returnUrl = localStorage.getItem(CSLS.SHOP_ACCOUNT_PROFILE_NEXT)
  if (!returnUrl) {
    returnUrl = "/shop/account"
  }

  return (
    <SiteWrapperShop>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("shop.account.title")} subTitle={ accountName }>
            <div className="page-options d-flex">
              <ShopAccountBack returnUrl={returnUrl} />
              <ShopAccountProfileBtnDownloadData />
            </div>
          </Page.Header>
          { children }
        </Container>
      </div>
    </SiteWrapperShop>
  )
}

export default withTranslation()(withRouter(ShopAccountProfileBase))