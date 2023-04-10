import React, { useState } from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Grid,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import { get_list_query_variables } from './tools'


function getDefaultValue(value) {
  let defaultValue = localStorage.getItem(value)
  if (defaultValue) {
    return defaultValue
  } else {
    return ""
  }
}

function updateLocalStorageAndRefetch(key, value, refetch) {
  localStorage.setItem(key, value)
  refetch(get_list_query_variables())
}

const selectClass = "form-control custom-select mb-2"


function FinanceExpensesFilter({ t, history, data, refetch }) {
  let [supplier, setSupplier] = useState(getDefaultValue(CSLS.FINANCE_EXPENSES_FILTER_SUPPLIER))

  return (
    <div className="mb-4">
      <Grid.Row>
        <Grid.Col md={12}>
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
          <h6 className="mt-2 pt-1">{t("general.filter")}</h6>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col lg={3} md={4} s={6} xs={12}>
          {/* Locations */}
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
      </Grid.Row>
    </div>
  )
}

export default withTranslation()(withRouter(FinanceExpensesFilter))