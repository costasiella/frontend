import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_QUOTE_GROUPS_QUERY, ADD_QUOTE_GROUP } from './queries'
import { QUOTE_GROUP_SCHEMA } from './yupSchema'

import {
  Card,
} from "tabler-react"

import FinanceQuoteGroupsBase from './FinanceQuoteGroupsBase';
import FinanceQuoteGroupForm from './FinanceQuoteGroupForm'


function FinanceQuoteGroupAdd({ t, history }) {
  const returnUrl = "/finance/quotes/groups"
  const [addQuoteGroup] = useMutation(ADD_QUOTE_GROUP)

  return (
    <FinanceQuoteGroupsBase showEditBack={true}>
      <Card title={t('finance.quote_groups.title_add')}>
        <Formik
          initialValues={{ 
            name: '', 
            displayPublic: true,
            expiresAfterDays: 30,
            prefix: 'QUO',
            prefixYear: true,
            autoResetPrefixYear: true,
            terms: '',
            footer: '',
            code: '' 
          }}
          validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addQuoteGroup({ variables: {
                input: {
                  name: values.name, 
                  displayPublic: values.displayPublic,
                  expiresAfterDays: values.expiresAfterDays,
                  prefix: values.prefix,
                  prefixYear: values.prefixYear,
                  autoResetPrefixYear: values.autoResetPrefixYear,
                  terms: values.terms,
                  footer: values.footer,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_QUOTE_GROUPS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('finance.quote_groups.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, values, errors, setFieldValue, setFieldTouched }) => (
            <FinanceQuoteGroupForm 
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
          )}
        </Formik>
      </Card>
    </FinanceQuoteGroupsBase>
  )
}

export default withTranslation()(withRouter(FinanceQuoteGroupAdd))
