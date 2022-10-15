import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
} from "tabler-react";

import { GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_QUOTE } from './queries'
import AccountQuoteAddForm from './AccountQuoteAddForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'


function AccountQuoteAdd({ t, match, history }) {
  const account_id = match.params.account_id
  const activeLink = "quotes"
  const cardTitle = t('relations.account.quotes.title_add')
  const returnUrl = `/relations/accounts/${account_id}/quotes`

  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY, {
      variables: {
        accountId: account_id
      }
    }
  )
  const [createQuote] = useMutation(CREATE_ACCOUNT_QUOTE, {
    // onCompleted = () => history.push('/finance/quotes/edit/')
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
  const initialBusiness = account.quoteToBusiness ? account.quoteToBusiness.id : null
  const financeQuoteGroups = data.financeQuoteGroups
  const firstQuoteGroup = financeQuoteGroups && financeQuoteGroups.edges && financeQuoteGroups.edges[0].node.id


  return (
    <RelationsAccountProfileBase activeLink={activeLink} user={account} returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{
            financeQuoteGroup: firstQuoteGroup,
            business: initialBusiness,
            summary: ""
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            createQuote({ variables: {
              input: {
                account: account_id, 
                financeQuoteGroup: values.financeQuoteGroup,
                business: (values.business) ? values.business : null,
                summary: values.summary
              }
            }, refetchQueries: [
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('relations.account.quotes.title_add')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                history.push('/finance/quotes/edit/' + data.createFinanceQuote.financeQuote.id)
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
            <AccountQuoteAddForm
              inputData={data}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              submitForm={submitForm}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              returnUrl={returnUrl}
            >
            </AccountQuoteAddForm>   
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
    //               activeLink='quotes'
    //               accountId={match.params.account_id}
    //             />
    //           </Grid.Col>
    //         </Grid.Row>
    //       </Container>
    //   </div>
    // </SiteWrapper>
  )
}


export default withTranslation()(withRouter(AccountQuoteAdd))
