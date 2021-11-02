// @flow

import React from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_SUBSCRIPTIONS_QUERY, GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_SUBSCRIPTION } from './queries'
import { SUBSCRIPTION_SCHEMA } from './yupSchema'
import AccountSubscriptionForm from './AccountSubscriptionForm'

import {
  Icon,
  Button,
  Card,
} from "tabler-react";
import { dateToLocalISO } from '../../../../tools/date_tools'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'


function AccountSubscriptionAdd({t, history, match}) {
  const accountId = match.params.account_id
  const activeLink = "subscriptions"
  const cardTitle = t('relations.account.subscriptions.title_add')
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const {loading, error, data} = useQuery(GET_INPUT_VALUES_QUERY, {
    variables: { archived: false, accountId: accountId }
  })
  const [createAccountSubscription] = useMutation(CREATE_ACCOUNT_SUBSCRIPTION)
  const sidebarButton = <Link to={returnUrl}>
      <Button color="primary btn-block mb-6">
        <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
      </Button>
    </Link>

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return(
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const inputData = data
  const account = data.account

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      sidebarButton={sidebarButton} 
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={{ 
              organizationSubscription: "",
              financePaymentMethod: "",
              dateStart: new Date(),
              note: "",
              registrationFeePaid: false
            }}
            validationSchema={SUBSCRIPTION_SCHEMA}
            onSubmit={(values, { setSubmitting }, errors) => {
                console.log('submit values:')
                console.log(values)
                console.log(errors)

                
                let dateEnd
                if (values.dateEnd) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }

                createAccountSubscription({ variables: {
                  input: {
                    account: accountId, 
                    organizationSubscription: values.organizationSubscription,
                    financePaymentMethod: values.financePaymentMethod,
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateEnd,
                    note: values.note,
                    registrationFeePaid: values.registrationFeePaid
                  }
                }, refetchQueries: [
                    {query: GET_ACCOUNT_SUBSCRIPTIONS_QUERY, variables: {accountId: accountId}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    const subscriptionId = data.createAccountSubscription.accountSubscription.id
                    history.push(`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}`)
                    toast.success((t('relations.account.subscriptions.toast_add_success')), {
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
            {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
              <AccountSubscriptionForm
                inputData={inputData}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              >
                {console.log(errors)}
              </AccountSubscriptionForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )
}


// class AccountSubscriptionAdd extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Account subscription add props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const history = this.props.history
//     const match = this.props.match
//     const accountId = match.params.accountId
//     const returnUrl = "/relations/accounts/" + accountId + "/subscriptions"

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//         <Query query={GET_INPUT_VALUES_QUERY} variables = {{archived: false, accountId: accountId}} >
//           {({ loading, error, data, refetch }) => {
//             // Loading
//             if (loading) return <p>{t('general.loading_with_dots')}</p>
//             // Error
//             if (error) {
//               console.log(error)
//               return <p>{t('general.error_sad_smiley')}</p>
//             }
            
//             console.log('query data')
//             console.log(data)
//             const inputData = data
//             const account = data.account

//             return (
//               <Container>
//                <Page.Header title={account.firstName + " " + account.lastName} />
//                <Grid.Row>
//                   <Grid.Col md={9}>
//                   <Card>
//                     <Card.Header>
//                       <Card.Title>{t('relations.account.subscriptions.title_add')}</Card.Title>
//                     </Card.Header>
//                       <Mutation mutation={CREATE_ACCOUNT_SUBSCRIPTION} onCompleted={() => history.push(returnUrl)}> 
//                       {(createSubscription, { data }) => (
//                           <Formik
//                               initialValues={{ 
//                                 organizationSubscription: "",
//                                 financePaymentMethod: "",
//                                 dateStart: new Date(),
//                                 note: "",
//                                 registrationFeePaid: false
//                               }}
//                               validationSchema={SUBSCRIPTION_SCHEMA}
//                               onSubmit={(values, { setSubmitting }, errors) => {
//                                   console.log('submit values:')
//                                   console.log(values)
//                                   console.log(errors)

                                  
//                                   let dateEnd
//                                   if (values.dateEnd) {
//                                     dateEnd = dateToLocalISO(values.dateEnd)
//                                   } else {
//                                     dateEnd = values.dateEnd
//                                   }

//                                   createSubscription({ variables: {
//                                     input: {
//                                       account: accountId, 
//                                       organizationSubscription: values.organizationSubscription,
//                                       financePaymentMethod: values.financePaymentMethod,
//                                       dateStart: dateToLocalISO(values.dateStart),
//                                       dateEnd: dateEnd,
//                                       note: values.note,
//                                       registrationFeePaid: values.registrationFeePaid
//                                     }
//                                   }, refetchQueries: [
//                                       {query: GET_ACCOUNT_SUBSCRIPTIONS_QUERY, variables: {accountId: accountId}}
//                                   ]})
//                                   .then(({ data }) => {
//                                       console.log('got data', data)
//                                       toast.success((t('relations.account.subscriptions.toast_add_success')), {
//                                           position: toast.POSITION.BOTTOM_RIGHT
//                                         })
//                                     }).catch((error) => {
//                                       toast.error((t('general.toast_server_error')) +  error, {
//                                           position: toast.POSITION.BOTTOM_RIGHT
//                                         })
//                                       console.log('there was an error sending the query', error)
//                                       setSubmitting(false)
//                                     })
//                               }}
//                               >
//                               {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
//                                 <AccountSubscriptionForm
//                                   inputData={inputData}
//                                   isSubmitting={isSubmitting}
//                                   setFieldValue={setFieldValue}
//                                   setFieldTouched={setFieldTouched}
//                                   errors={errors}
//                                   values={values}
//                                   returnUrl={returnUrl}
//                                 >
//                                   {console.log(errors)}
//                                 </AccountSubscriptionForm>
//                               )}
//                           </Formik>
//                       )}
//                       </Mutation>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col md={3}>
//                     <HasPermissionWrapper permission="add"
//                                           resource="accountsubscription">
//                       <Link to={returnUrl}>
//                         <Button color="primary btn-block mb-6">
//                           <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
//                         </Button>
//                       </Link>
//                     </HasPermissionWrapper>
//                     <ProfileMenu 
//                       activeLink='subscriptions'
//                       accountId={match.params.accountId}
//                     />
//                   </Grid.Col>
//                 </Grid.Row>
//               </Container>
//             )}}
//           </Query>
//         </div>
//     </SiteWrapper>
//     )}
//   }


export default withTranslation()(withRouter(AccountSubscriptionAdd))
