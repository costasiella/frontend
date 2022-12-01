import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
  Dimmer,
} from "tabler-react";

import { GET_INPUT_VALUES_QUERY, CREATE_B2B_INVOICE } from './queries'
import B2BInvoiceAddForm from './RelationsB2BInvoiceAddForm'
import RelationsB2BEditBase from '../RelationsB2BEditBase'


function RelationsB2BInvoiceAdd({ t, match, history }) {
  const businessId = match.params.business_id
  const activeLink = "invoices"
  const cardTitle = t('relations.b2b.invoices.title_add')
  const returnUrl = `/relations/b2b/${businessId}/invoices`

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY, {
      variables: {
        business: businessId
      }
    }
  )
  const [createInvoice] = useMutation(CREATE_B2B_INVOICE, {
    // onCompleted = () => history.push('/finance/invoices/edit/')
  }) 

  // Query
  // Loading
  if (loading) {
    return <RelationsB2BEditBase activeLink={activeLink} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer loader={true} active={true} />
          </Card.Body>
        </Card>
      </RelationsB2BEditBase>
  }
  // Error
  if (error) {
    console.log(error)
    return <RelationsB2BEditBase activeLink={activeLink} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </RelationsB2BEditBase>
  }
  
  const business = data.business
  const financeInvoiceGroups = data.financeInvoiceGroups
  const firstInvoiceGroup = financeInvoiceGroups && financeInvoiceGroups.edges && financeInvoiceGroups.edges[0].node.id


  return (
    <RelationsB2BEditBase activeLink={activeLink} pageTitle={business.name} returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{
            financeInvoiceGroup: firstInvoiceGroup,
            summary: ""
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            createInvoice({ variables: {
              input: {
                business: businessId, 
                financeInvoiceGroup: values.financeInvoiceGroup,
                summary: values.summary
              }
            }, refetchQueries: [
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('relations.b2b.invoices.toast_add_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                history.push('/finance/invoices/edit/' + data.createFinanceInvoice.financeInvoice.id)
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
          {({ isSubmitting, errors, values, submitForm, setFieldTouched, setFieldValue }) => (
            <B2BInvoiceAddForm
              inputData={data}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              submitForm={submitForm}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              returnUrl={returnUrl}
            >
            </B2BInvoiceAddForm>   
          )}
        </Formik>
      </Card>
    </RelationsB2BEditBase>

    // <SiteWrapper>
    //   <div className="my-3 my-md-5">
    //     <Container>
    //       <Page.Header title={account.firstName + " " + account.lastName} />
    //       <Grid.Row>
    //           <Grid.Col md={9}>
                
    //           </Grid.Col>
    //           <Grid.Col md={3}>
    //             <ProfileMenu 
    //               activeLink='invoices'
    //               accountId={match.params.account_id}
    //             />
    //           </Grid.Col>
    //         </Grid.Row>
    //       </Container>
    //   </div>
    // </SiteWrapper>
  )
}


export default withTranslation()(withRouter(RelationsB2BInvoiceAdd))
