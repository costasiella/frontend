import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { CREATE_QUOTE_ITEM, GET_QUOTE_QUERY } from "../queries"
import { toast } from 'react-toastify'

import {
  Icon
} from "tabler-react"


function FinanceQuoteItemAdd({t, match}) {
  const [ addQuoteItem ] = useMutation(CREATE_QUOTE_ITEM)

    return (
      <button className="btn btn-primary btn-sm" 
        title={t('general.delete')} 
        href=""
        onClick={() => {
          addQuoteItem({ variables: {
            input: {
              financeQuote: match.params.id              
            }
          }, refetchQueries: [
              {query: GET_QUOTE_QUERY, variables: {id: match.params.id}}
          ]})
          .then(({ data }) => {
              console.log('got data', data)
              toast.success((t('finance.quote.toast_add_item_success')), {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
              // setSubmitting(false)
            }).catch((error) => {
              toast.error((t('general.toast_server_error')) +  error, {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
              console.log('there was an error sending the query', error)
              // setSubmitting(false)
            })
      }}>
        <Icon prefix="fe" name="plus" /> { ' ' }
        {t('finance.quote.item_add')}
      </button>
    )
}

export default withTranslation()(withRouter(FinanceQuoteItemAdd))
