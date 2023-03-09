import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
  Dimmer
} from "tabler-react";

import { dateToLocalISO } from '../../../tools/date_tools'
import { GET_EXPENSES_QUERY, GET_INPUT_VALUES_QUERY, CREATE_FINANCE_EXPENSE } from './queries'
import { EXPENSE_SCHEMA } from './yupSchema'
import FinanceExpenseForm from './FinanceExpenseForm'
import FinanceExpensesBase from './FinanceExpensesBase';


function FinanceExpenseAdd({t, match, history}) {
  const cardTitle = t('finance.expenses.title_add')
  const returnUrl = `/finance/expenses`
  
  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [createFinanceExpense] = useMutation(CREATE_FINANCE_EXPENSE)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }

  if (loading) return(
    <FinanceExpensesBase returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Dimmer loader={true} active={true} />
      </Card>
    </FinanceExpensesBase>
  )

  if (error) return (
    <FinanceExpensesBase returnUrl={returnUrl}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </FinanceExpensesBase>
  )
  
  const inputData = data

  return (
    <FinanceExpensesBase
      returnUrl={returnUrl} 
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ 
            description: ""
          }}
          validationSchema={EXPENSE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)
            console.log(fileName)
  
            let inputVars = {
              date: dateToLocalISO(values.date),
              summary: values.summary,
              description: values.description,
              amount: values.amount,
              tax: values.tax,
              percentage: values.percentage,
              supplier: values.supplier,
              financeGlaccount: values.financeGlaccount,
              financeCostcenter: values.financeCostcenter,
              documentFileName: fileName,
            }
  
            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_file = reader_event.target.result
              console.log(b64_enc_file)
              // Add uploaded document b64 encoded blob to input vars
              inputVars.document = b64_enc_file
  
              createFinanceExpense({ variables: {
                input: inputVars
              }, refetchQueries: [
                  {query: GET_EXPENSES_QUERY}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('finance.expenses.toast_add_success')), {
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
            }
            
            let file = inputFileName.current.files[0]
            if (file && file.size < 5242880) {
              reader.readAsDataURL(file)
            } else if (file && file.size > 5242880) { 
              toast.error(t("error_messages.selected_file_exceeds_max_filesize"), {
                position: toast.POSITION.BOTTOM_RIGHT
              })
              setSubmitting(false)
            } else {
              toast.error(t("general.please_select_a_file"), {
                position: toast.POSITION.BOTTOM_RIGHT
              })
              setSubmitting(false)
            }
          }}
          >
          {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
            <FinanceExpenseForm
              inputData={inputData}
              isSubmitting={isSubmitting}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              errors={errors}
              values={values}
              inputFileName={inputFileName}
              fileInputLabel={fileInputLabel}
              handleFileInputChange={handleFileInputChange}
              returnUrl={returnUrl}
            >
              {console.log(errors)}
            </FinanceExpenseForm>
          )}
        </Formik>
      </Card>
    </FinanceExpensesBase>
  ) 
}

export default withTranslation()(withRouter(FinanceExpenseAdd))
