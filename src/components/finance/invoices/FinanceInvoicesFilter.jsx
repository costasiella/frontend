import React, { useState } from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from "moment"
import {
  Grid
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import CSDatePicker from '../../ui/CSDatePicker'
import InputSearch from '../../general/InputSearch'
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


function getDefaultValueDate(lsKey) {
  let dateValue
  if (lsKey === CSLS.FINANCE_INVOICES_FILTER_DATE_FROM) {
    dateValue = new Date(moment().startOf('quarter'))  
  } else {
    dateValue = new Date(moment().endOf('quarter'))  
  }
  
  const lsValue = localStorage.getItem(lsKey)
  if (lsValue) {
    dateValue = new Date(lsValue)
  }

  // TODO: Add a sanity check here. Date until can't be smaller then date from

  return dateValue
}


function updateLocalStorageAndRefetch(key, value, refetch) {
  localStorage.setItem(key, value)
  refetch(get_list_query_variables())

}

const selectClass = "form-control mb-2"


function FinanceInvoicesFilter({ t, history, data, refetch }) {
  let [status, setStatus] = useState(getDefaultValue(CSLS.FINANCE_INVOICES_FILTER_STATUS))
  let [dateFrom, setDateFrom] = useState(getDefaultValueDate(CSLS.FINANCE_INVOICES_FILTER_DATE_FROM))
  let [dateUntil, setDateUntil] = useState(getDefaultValueDate(CSLS.FINANCE_INVOICES_FILTER_DATE_UNTIL))

  return (
    <Grid.Row>
      <Grid.Col lg={5} md={5} s={6} xs={12}>
        {/* Search */}
        <label class="bold">{t("finance.invoices.filter_label_search")}</label>
        <InputSearch 
          initialValueKey={CSLS.FINANCE_INVOICES_FILTER_SEARCH}
          placeholder="Search..."
          onChange={(value) => {
            updateLocalStorageAndRefetch(
              CSLS.FINANCE_INVOICES_FILTER_SEARCH,
              value,
              refetch
            )
          }}
        />
      </Grid.Col>
      <Grid.Col lg={3} md={4} s={6} xs={12}>
        {/* Status */}
        <label class="bold">{t("finance.invoices.filter_label_status")}</label>
        <select 
          className={`${selectClass}`}
          value={status}
          onChange={ (event) => {
            setStatus(event.target.value)
            updateLocalStorageAndRefetch(
              CSLS.FINANCE_INVOICES_FILTER_STATUS,
              event.target.value,
              refetch
            )
          }}
        >
          <option value="" key={v4()}>{t("finance.invoices.statuses.all")}</option>
          <option value="DRAFT" key={v4()}>{t('finance.invoices.statuses.draft')}</option>
          <option value="SENT" key={v4()}>{t('finance.invoices.statuses.sent')}</option>
          <option value="PAID" key={v4()}>{t('finance.invoices.statuses.paid')}</option>
          <option value="OVERDUE" key={v4()}>{t('finance.invoices.statuses.overdue')}</option>
          <option value="CANCELLED" key={v4()}>{t('finance.invoices.statuses.cancelled')}</option>
        </select>
      </Grid.Col>
      <Grid.Col lg={2} md={2} s={6} xs={12}>
        <label class="bold">{t("finance.invoices.filter_label_date_from")}</label>
        <CSDatePicker 
          className="form-control mr-2"
          selected={dateFrom}
          isClearable={false}
          onChange={(date) => {
            let dateStr = moment(date).format('YYYY-MM-DD')
            setDateFrom(date)
            updateLocalStorageAndRefetch(
              CSLS.FINANCE_INVOICES_FILTER_DATE_FROM,
              dateStr,
              refetch
            )
          }}
          placeholderText={t('finance.invoices.filter_label_date_from')}
        />
      </Grid.Col>
      <Grid.Col lg={2} md={2} s={6} xs={12}>
          <label class="bold">{t("finance.invoices.filter_label_date_until")}</label>
          <CSDatePicker 
            className="form-control mr-2"
            selected={dateUntil}
            isClearable={false}
            onChange={(date) => {
              let dateStr = moment(date).format('YYYY-MM-DD')
              setDateUntil(date)
              updateLocalStorageAndRefetch(
                CSLS.FINANCE_INVOICES_FILTER_DATE_UNTIL,
                dateStr,
                refetch
              )
            }}
            placeholderText={t('finance.invoices.filter_label_date_until')}
          />
        </Grid.Col>
    </Grid.Row>
  )
};

export default withTranslation()(withRouter(FinanceInvoicesFilter))