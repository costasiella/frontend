import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from "../../../tools/cs_local_storage"
import { get_list_query_variables } from './tools'


function getDefaultValue(value) {
  let defaultValue = localStorage.getItem(value)
  console.log(defaultValue)

  if (defaultValue) {
    return defaultValue
  } else {
    console.log('return empty default')
    return ""
  }
}

function updateLocalStorageAndRefetch(key, value, refetch) {
  localStorage.setItem(key, value)
  refetch(get_list_query_variables())
}

const selectClass = "form-control mb-2"


const FinanceQuotesFilter = ({ t, history, data, refetch }) => (
  <div className="mr-2">
    {/* Status */}
    <select 
      className={`${selectClass}`}
      value={getDefaultValue(CSLS.FINANCE_QUOTES_FILTER_STATUS)}
      onChange={ (event) => {
        updateLocalStorageAndRefetch(
          CSLS.FINANCE_QUOTES_FILTER_STATUS,
          event.target.value,
          refetch
        )
      }}
    >
      <option value="" key={v4()}>{t("finance.quotes.status.ALL")}</option>
      <option value="DRAFT" key={v4()}>{t('finance.quotes.status.DRAFT')}</option>
      <option value="SENT" key={v4()}>{t('finance.quotes.status.SENT')}</option>
      <option value="ACCEPTED" key={v4()}>{t('finance.quotes.status.ACCEPTED')}</option>
      <option value="REJECTED" key={v4()}>{t('finance.quotes.status.REJECTED')}</option>
      <option value="CANCELLED" key={v4()}>{t('finance.quotes.status.CANCELLED')}</option>
    </select>
  </div>
);

export default withTranslation()(withRouter(FinanceQuotesFilter))
