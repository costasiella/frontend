import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Container
} from "tabler-react";
import SiteWrapperShop from "../../../SiteWrapperShop"
import ShopAccountBack from "../ShopAccountBack"


function ShopAccountClassesBase({ t, match, history, children, accountName="" }) {
  return (
      <SiteWrapperShop>
        <div className="my-3 my-md-5">
          <Container>
            <Page.Header title={t("shop.account.title")} subTitle={ accountName }>
              <div className="page-options d-flex">
                <ShopAccountBack />
              </div>
            </Page.Header>
            { children }
          </Container>
        </div>
      </SiteWrapperShop>
  )
}

export default withTranslation()(withRouter(ShopAccountClassesBase))