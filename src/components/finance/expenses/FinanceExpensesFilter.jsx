import React, { useState } from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from "moment"
import {
  Button,
  Grid,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import { get_list_query_variables } from './tools'
import CSDatePicker from '../../ui/CSDatePicker';


function getDefaultValue(lsKey) {
  let defaultValue = localStorage.getItem(lsKey)
  if (defaultValue) {
    return defaultValue
  } else {
    return ""
  }
}

function getDefaultValueDate(lsKey) {
  let dateValue
  if (lsKey == CSLS.FINANCE_EXPENSES_FILTER_DATE_FROM) {
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

const selectClass = "form-control custom-select mb-2"


function FinanceExpensesFilter({ t, history, data, refetch }) {
  let [supplier, setSupplier] = useState(getDefaultValue(CSLS.FINANCE_EXPENSES_FILTER_SUPPLIER))
  let [dateFrom, setDateFrom] = useState(getDefaultValueDate(CSLS.FINANCE_EXPENSES_FILTER_DATE_FROM))
  let [dateUntil, setDateUntil] = useState(getDefaultValueDate(CSLS.FINANCE_EXPENSES_FILTER_DATE_UNTIL))

  return (
    <div className="mb-4">
      {/* Filter */}
      <Grid.Row>
        <Grid.Col lg={3} md={4} s={6} xs={12}>
          {/* Supplier */}
          <label class="bold">{t("finance.expenses.filter_label_supplier")}</label>
          <select 
            className={selectClass}
            value={supplier}
            onChange={ (event) => {
              setSupplier(event.target.value)
              updateLocalStorageAndRefetch(
                CSLS.FINANCE_EXPENSES_FILTER_SUPPLIER,
                event.target.value,
                refetch
              )
            }}
          >
            <option value="" key={v4()}>{t("finance.expenes.filter_all_suppliers")}</option>
            {data.businesses.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </select>
        </Grid.Col>
        <Grid.Col lg={3} md={4} s={6} xs={12}>
          <label class="bold">{t("finance.expenses.filter_label_date_from")}</label>
          <CSDatePicker 
            className="form-control mr-2"
            selected={dateFrom}
            isClearable={false}
            onChange={(date) => {
              let dateStr = moment(date).format('YYYY-MM-DD')
              setDateFrom(date)
              updateLocalStorageAndRefetch(
                CSLS.FINANCE_EXPENSES_FILTER_DATE_FROM,
                dateStr,
                refetch
              )
            }}
            placeholderText={t('finance.expenses.filter_label_date_from')}
          />
        </Grid.Col>
        <Grid.Col lg={3} md={4} s={6} xs={12}>
          <label class="bold">{t("finance.expenses.filter_label_date_until")}</label>
          <CSDatePicker 
            className="form-control mr-2"
            selected={dateUntil}
            isClearable={false}
            onChange={(date) => {
              let dateStr = moment(date).format('YYYY-MM-DD')
              setDateUntil(date)
              updateLocalStorageAndRefetch(
                CSLS.FINANCE_EXPENSES_FILTER_DATE_UNTIL,
                dateStr,
                refetch
              )
            }}
            placeholderText={t('finance.expenses.filter_label_date_until')}
          />
        </Grid.Col>
        <Grid.Col lg={3} md={4} s={6} xs={12}>
          <Button
            className="float-right"
            color="link"
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.FINANCE_EXPENSES_FILTER_SUPPLIER, "")
              setSupplier("")
              refetch(get_list_query_variables())
            }}
          >
            {t("general.reset_filter")}
          </Button>
        </Grid.Col>
      </Grid.Row>
    </div>
  )
}

export default withTranslation()(withRouter(FinanceExpensesFilter))