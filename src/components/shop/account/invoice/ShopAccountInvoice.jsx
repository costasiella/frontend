import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceInvoicesStatus from "../../../ui/FinanceInvoiceStatus"
import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
  Table,
} from "tabler-react"
import { QUERY_ACCOUNT_INVOICE } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import LoadMoreOnBottomScroll from "../../../general/LoadMoreOnBottomScroll"

import ShopAccountInvoiceBase from "./ShopAccountInvoiceBase"


function ShopAccountInvoice({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const onlinePaymentsAvailable = appSettings.onlinePaymentsAvailable

  const invoiceId = match.params.id

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading, error, data, fetchMore } = useQuery(QUERY_ACCOUNT_INVOICE, {
    variables: {
      id: invoiceId
    },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <ShopAccountInvoiceBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountInvoiceBase>
  )
  if (error) return (
    <ShopAccountInvoiceBase>
      {t("shop.account.invoice.error_loading_data")}
    </ShopAccountInvoiceBase>
  )

  console.log("User data: ###")
  console.log(data)
  const user = data.user
  const invoice = data.financeInvoice

  return (
    <ShopAccountInvoiceBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
            <h4>{t("shop.account.invoice.title")} {invoice.invoiceNumber}</h4>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountInvoiceBase>
  )
}


export default withTranslation()(withRouter(ShopAccountInvoice))