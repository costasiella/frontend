import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
  Dimmer,
  Grid
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage';
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"

import ShopAccountHomeBase from "./ShopAccountHomeBase"
import ShopAccountHomeButton from "./ShopAccountHomeButton"


function ShopAccountHome({t, match, history}) {
  const { loading, error, data } = useQuery(GET_USER_PROFILE)

  // Unset any next link for bank accounts that might have come from /shop/subscription/:id
  localStorage.removeItem(CSLS.SHOP_ACCOUNT_BANK_ACCOUNT_NEXT)


  if (loading) return (
    <ShopAccountHomeBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountHomeBase>
  )
  if (error) return (
    <ShopAccountHomeBase>
      {t("shop.account.error_loading_user_data")}
    </ShopAccountHomeBase>
  )

  const user = data.user

  return (
    <ShopAccountHomeBase subTitle={user.fullName}>
      {(user.instructor || user.employee) ?
        <div>
          <Grid.Row>
            <Grid.Col xs={12} sm={12} md={4} lg={4}>
              <Card>
                <Card.Body>
                  <h5>{t("goto.title")}</h5>
                  {t("shop.account.goto.explanation")}
                  <br /><br />
                  <ShopAccountHomeButton link="/user/welcome" buttonText={t("shop.account.btn_go_to")} />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row> 
          <hr />
        </div>
        : ""
      } 
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.classes.title")}</h5>
              {t("shop.account.classes.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/classes" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.subscriptions.title")}</h5>
              {t("shop.account.subscriptions.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/subscriptions" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.classpasses.title")}</h5>
              {t("shop.account.classpasses.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/classpasses" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.event_tickets.title")}</h5>
              {t("shop.account.event_tickets.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/event_tickets" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
      <hr />
      {/* Administrative stuff below this point, profile, invoices, orders, etc. */}
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.profile.title")}</h5>
              {t("shop.account.profile.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/profile" buttonText={t("shop.account.btn_text_profile_edit")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.bank_account.title")}</h5>
              {t("shop.account.bank_account.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/bank_account" buttonText={t("shop.account.btn_text_bank_account_edit")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.orders.title")}</h5>
              {t("shop.account.orders.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/orders" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.invoices.title")}</h5>
              {t("shop.account.invoices.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/shop/account/invoices" buttonText={t("shop.account.btn_text_view")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.mailing_lists.title")}</h5>
              {t("shop.account.mailing_lists.explanation")}
              <br /><br />
              <ShopAccountHomeButton 
                link="/shop/account/mailing_lists" 
                buttonText={t("shop.account.btn_text_manage")} 
              />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.change_password.title")}</h5>
              {t("shop.account.change_password.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/user/password/change/" buttonText={t("shop.account.btn_text_change_password")} />
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4}>
          <Card>
            <Card.Body>
              <h5>{t("shop.account.sign_out.title")}</h5>
              {t("shop.account.sign_out.explanation")}
              <br /><br />
              <ShopAccountHomeButton link="/user/logout/" buttonText={t("shop.account.btn_text_sign_out")} />
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountHomeBase>
  )
}


export default withTranslation()(withRouter(ShopAccountHome))