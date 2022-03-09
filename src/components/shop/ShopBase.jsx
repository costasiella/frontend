import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapperShop from "../SiteWrapperShop"
import ShopCheckoutProgress from "./ShopCheckoutProgress"
import ButtonBack from '../ui/ButtonBack';

function ShopBase({ t, match, history, children, title, subTitle, returnUrl, pageHeaderOptions="", checkoutProgress=false }) {

  return (
    <SiteWrapperShop>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={title} subTitle={subTitle}>
            <div className="page-options d-flex">
              {/* Back */}
              { (returnUrl) ? <ButtonBack returnUrl={returnUrl} /> : "" }
              { pageHeaderOptions }
            </div>
          </Page.Header>
            <Grid.Row>
              <Grid.Col md={12}>
                {(checkoutProgress) ?
                  <ShopCheckoutProgress checkoutProgress={checkoutProgress} />
                  : "" }
                { children }
              </Grid.Col>
            </Grid.Row>
          </Container>
        </div>
    </SiteWrapperShop>
  )
}


export default withTranslation()(withRouter(ShopBase))