import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { get_list_query_variables } from "../tools"
import { DELETE_INVOICE_ITEM, GET_INVOICES_QUERY, GET_INVOICE_QUERY } from "../queries"
import confirm_delete from "../../../../tools/confirm_delete"

import {
  Icon
} from "tabler-react"


function FinanceQuoteItemDelete({t, match, node}) {
  const [deleteQuoteItem] = useMutation(DELETE_INVOICE_ITEM)

    return (
      <button className="icon btn btn-link btn-sm" 
        title={t('general.delete')} 
        href=""
        onClick={() => {
          confirm_delete({
            t: t,
            msgConfirm: t("finance.quotes.item_delete_confirm_msg"),
            msgDescription: <p>{node.productName} <br /> {node.description}</p>,
            msgSuccess: t('finance.quotes.item_deleted'),
            deleteFunction: deleteQuoteItem,
            functionVariables: { 
              variables: {
                input: {
                  id: node.id
                }
              }, 
              refetchQueries: [
                {query: GET_INVOICES_QUERY, variables: get_list_query_variables() },
                {query: GET_INVOICE_QUERY, variables: {id: match.params.id} },
              ]
            }
          })
      }}>
        <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
      </button>
    )
}

export default withTranslation()(withRouter(FinanceQuoteItemDelete))
