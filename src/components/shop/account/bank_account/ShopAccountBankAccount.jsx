import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Grid,
} from "tabler-react";

import CSLS from '../../../../tools/cs_local_storage'
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import { GET_ACCOUNT_BANK_ACCOUNTS, UPDATE_BANK_ACCOUNT } from "./queries"

import ShopAccountProfileBase from "../ShopAccountProfileBase"
import ShopAccountBankAccountForm from "./ShopAccountBankAccountForm"
import { ACCOUNT_BANK_ACCOUNT_SCHEMA } from "./yupSchema"


function ShopAccountBankAccount({t, match, history}) {
  // TODO fetch returnUrl from local storage to see if the user comes from a shop subscription component
  const nextUrl = localStorage.getItem(CSLS.SHOP_ACCOUNT_BANK_ACCOUNT_NEXT)

  // Chain queries. First query user data and then query class attendance for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data } = useQuery(GET_ACCOUNT_BANK_ACCOUNTS, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    },
    fetchPolicy: "network-only"
  })
  const [ updateBankAccount ] = useMutation(UPDATE_BANK_ACCOUNT)

  if (loading || loadingUser || !data) return (
    <ShopAccountProfileBase>
      {t("general.loading_with_dots")}
    </ShopAccountProfileBase>
  )
  if (error || errorUser) return (
    <ShopAccountProfileBase>
      {t("shop.account.bank_account.error_loading_data")}
    </ShopAccountProfileBase>
  )

  const user = dataUser.user
  const bankAccount = data.accountBankAccounts.edges[0].node

  return (
    <ShopAccountProfileBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <Formik
            initialValues={{ 
              number: bankAccount.number,
              holder: bankAccount.holder,
              bic: bankAccount.bic
            }}
            validationSchema={ACCOUNT_BANK_ACCOUNT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                let input_vars = {
                  id: bankAccount.id,
                  number: values.number,
                  holder: values.holder,
                  bic: values.bic
                }

                updateBankAccount({ variables: {
                  input: input_vars
                }, refetchQueries: [
                    // // Refetch list
                    // {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()},
                    // // Refresh local cached results for this account
                    // {query: GET_ACCOUNT_QUERY, variables: {"id": match.params.account_id}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    if (nextUrl) {
                      history.push(nextUrl)
                    }

                    toast.success((t('shop.account.bank_account.toast_edit_success')), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    setSubmitting(false)
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error)
                    setSubmitting(false)
                  })
            }}
            >
            {({ isSubmitting, errors, values }) => (
              <ShopAccountBankAccountForm
                isSubmitting={isSubmitting}
                errors={errors}
                values={values}
                returnUrl={"/shop/account"}
              />
            )}
          </Formik>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountProfileBase>
  )
}


export default withTranslation()(withRouter(ShopAccountBankAccount))