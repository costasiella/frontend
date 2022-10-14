import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import {
  Alert,
  Page,
  Grid,
  Icon,
  Button,
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import { GET_QUOTE_QUERY, CANCEL_AND_CREATE_CREDIT_QUOTE } from '../queries'
import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"

import CSLS from "../../../../tools/cs_local_storage"

import FinanceQuoteEditBase from "./FinanceQuoteEditBase"
import FinanceQuoteEditItems from "./FinanceQuoteEditItems"
import FinanceQuoteEditAdditional from "./FinanceQuoteEditAdditional"
import FinanceQuoteEditBalance from "./FinanceQuoteEditBalance"
import FinanceQuoteEditOptions from "./FinanceQuoteEditOptions"
import FinanceQuoteEditOrganization from "./FinanceQuoteEditOrganization"
import FinanceQuoteEditSummary from "./FinanceQuoteEditSummary"
import FinanceQuoteEditTo from "./FinanceQuoteEditTo"

function FinanceQuoteEdit({t, match, history, location}) {
  const id = match.params.id
  const { loading, error, data, refetch } = useQuery(GET_QUOTE_QUERY, {
    variables: {
      id: id
    },
  })

  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)
  
  // Set back location for account profile
  localStorage.setItem(CSLS.RELATIONS_ACCOUNT_PROFILE_RETURN, location.pathname)
  
  // Loading
  if (loading) return <FinanceQuoteEditBase>{t('general.loading_with_dots')}</FinanceQuoteEditBase>
  // Error
  if (error) {
    console.log(error)
    return <FinanceQuoteEditBase>{t('general.error_sad_smiley')}</FinanceQuoteEditBase>
  }

  // Fetch back location from localStorage, if no value set, default back to /finance/quotes
  let returnUrl = localStorage.getItem(CSLS.FINANCE_QUOTES_EDIT_RETURN)
  if (!returnUrl) {
    returnUrl = "/finance/quotes"
  }
  const export_url = "/d/export/quote/pdf/" + id
  const shopAccountQuoteUrl = `${window.location.protocol}//${window.location.host}/#/shop/account/quote/${id}`

  return (
    <FinanceQuoteEditBase>
      <Page.Header title={t('finance.quote.title') + ' #' + data.financeQuote.quoteNumber}>
        <div className="page-options d-flex">
          {/* Back */}
          <Link to={returnUrl} 
                className='btn btn-secondary mr-2'>
              <Icon prefix="fe" name="arrow-left" /> {t('general.back')} 
          </Link>
          {/* Export as PDF */}
          <Button
            color="secondary"
            icon="printer"
            className="mr-2"
            onClick={() => refreshTokenAndOpenExportLinkInNewTab(
              t, doTokenRefresh, history, export_url
            )}
          >
            {t('general.pdf')} 
          </Button>
          {/* Tools */}
        </div>
      </Page.Header>
      <Grid.Row>
        <Grid.Col md={9}>
          <FinanceQuoteEditSummary 
            initialData={data}
          />
        <Alert type="primary">
          <div className="mb-1"><b>{t("finance.quote.account_profile_link")}</b></div>
          {shopAccountQuoteUrl}<br />
          <div className="mt-1"><small><Icon name="info" /> {t("finance.quote.account_profile_link_explanation")}</small></div>
        </Alert>
          <Grid.Row>
            <Grid.Col md={6} ml={0}>
              <FinanceQuoteEditOrganization organization={data.organization} />
            </Grid.Col>
            <Grid.Col md={6} ml={0}>
              <FinanceQuoteEditTo financeQuote={data.financeQuote} />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
        <Grid.Col md={3}>
          <FinanceQuoteEditBalance financeQuote={data.financeQuote} />
          <FinanceQuoteEditOptions initialData={data} />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col md={12}>
          <FinanceQuoteEditItems inputData={data} refetchQuote={refetch} />
          <FinanceQuoteEditAdditional initialData={data} />
        </Grid.Col>
      </Grid.Row>
    </FinanceQuoteEditBase>
  )
}


export default withTranslation()(withRouter(FinanceQuoteEdit))