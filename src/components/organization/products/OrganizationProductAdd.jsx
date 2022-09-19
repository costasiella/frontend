import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
  Dimmer,
} from "tabler-react"

import { GET_ORGANIZATION_PRODUCTS_QUERY, ADD_ORGANIZATION_PRODUCT, GET_INPUT_VALUES_QUERY } from "./queries"
import { PRODUCT_SCHEMA } from './yupSchema'

import OrganizationProductsBase from "./OrganizationProductsBase"
import OrganizationProductForm from './OrganizationProductForm'



function OrganizationProductAdd({ t, history, match }) {
  const returnUrl = `/organization/products/`
  const cardTitle = t("organization.products.add")

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [addOrganizationProduct] = useMutation(ADD_ORGANIZATION_PRODUCT)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }

  if (loading) return (
    <OrganizationProductsBase showBack={true} >
      <Card title={cardTitle}>
        <Card.Body>
          <Dimmer active={true} loader={true} />
        </Card.Body>
      </Card>
    </OrganizationProductsBase>
  )

  if (error) {
    console.log(error)
    return (
      <OrganizationProductsBase showBack={true} >
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </OrganizationProductsBase>
    )
  } 

  return (
    <OrganizationProductsBase showBack={true} >
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: "",
            description: "",
          }}
          validationSchema={ PRODUCT_SCHEMA }
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)
            console.log(fileName)

            let inputVars = {
              name: values.name,
              description: values.description,
              price: values.price,
              financeTaxRate: values.financeTaxRate,
              financeCostcenter: values.financeCostcenter,
              financeGlaccount: values.financeGlaccount,
              imageFileName: fileName,
            }

            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_file = reader_event.target.result
              console.log(b64_enc_file)
              // Add uploaded document b64 encoded blob to input vars
              inputVars.image = b64_enc_file

              addOrganizationProduct({ variables: {
                input: inputVars
              }, refetchQueries: [
                  {query: GET_ORGANIZATION_PRODUCTS_QUERY, variables: {archived: false}}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.products.toast_add_success')), {
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
          {({ isSubmitting, errors, values }) => (
            <OrganizationProductForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              initialData={data}
              inputFileName={inputFileName}
              fileInputLabel={fileInputLabel}
              handleFileInputChange={handleFileInputChange}
              returnUrl={returnUrl}
            />
          )}
        </Formik>
      </Card>
    </OrganizationProductsBase>
  )
}

export default withTranslation()(withRouter(OrganizationProductAdd))