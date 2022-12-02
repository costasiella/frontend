import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
} from "tabler-react";

import { GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_INVOICE } from './queries'
import AccountInvoiceAddForm from './AccountInvoiceAddForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'


function AccountInvoiceAdd({ t, match, history }) {
  const account_id = match.params.account_id
  const activeLink = "invoices"
  const cardTitle = t('relations.account.invoices.title_add')
  const returnUrl = `/relations/accounts/${account_id}/invoices`

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY, {
      variables: {
        accountId: account_id
      }
    }
  )
  const [createInvoice] = useMutation(CREATE_ACCOUNT_INVOICE, {
    // onCompleted = () => history.push('/finance/invoices/edit/')
  }) 

  // Query
  // Loading
  if (loading) {
    return <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.loading_with_dots')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
  }
  // Error
  if (error) {
    console.log(error)
    return <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
  }
  
  const account = data.account
  const initialBusiness = account.invoiceToBusiness ? account.invoiceToBusiness.id : null
  const financeInvoiceGroups = data.financeInvoiceGroups
  const firstInvoiceGroup = financeInvoiceGroups && financeInvoiceGroups.edges && financeInvoiceGroups.edges[0].node.id


  return (
    <RelationsAccountProfileBase activeLink={activeLink} user={account} returnUrl={returnUrl}>
      <Card title={cardTitle}>
        {/* { account.invoiceToBusiness && 
          <Card.Alert color="primary">
           <b><Icon name="home" /> {account.invoiceToBusiness.name}</b> {' '}
           {t("relations.account.invoices.is_the_default_billing_address_for_this_account")}
          </Card.Alert>
        } */}
        <Formik
          initialValues={{
            financeInvoiceGroup: firstInvoiceGroup,
            business: initialBusiness,
            summary: ""
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            createInvoice({ variables: {
              input: {
                account: account_id, 
                financeInvoiceGroup: values.financeInvoiceGroup,
                business: (values.business) ? values.business : null,
                summary: values.summary
              }
            }, refetchQueries: [
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('relations.account.invoices.toast_title_add')), {
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
            <AccountInvoiceAddForm
              inputData={data}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              submitForm={submitForm}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              returnUrl={returnUrl}
            >
            </AccountInvoiceAddForm>   
          )}
        </Formik>
      </Card>
    </RelationsAccountProfileBase>

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


export default withTranslation()(withRouter(AccountInvoiceAdd))
