// // @flow

// import React, {Component } from 'react'
// import { gql } from "@apollo/client"
// import { Query, Mutation } from "@apollo/client";
// import { withTranslation } from 'react-i18next'
// import { withRouter } from "react-router"
// import { Link } from 'react-router-dom'

// import { Formik } from 'formik'
// import { toast } from 'react-toastify'

// import { GET_ACCOUNT_MEMBERSHIPS_QUERY, GET_INPUT_VALUES_QUERY } from './queries'
// import { MEMBERSHIP_SCHEMA } from './yupSchema'
// import AccountMembershipForm from './AccountMembershipForm'

// import {
//   Page,
//   Grid,
//   Icon,
//   Button,
//   Card,
//   Container,
// } from "tabler-react";
// import SiteWrapper from "../../../SiteWrapper"
// import HasPermissionWrapper from "../../../HasPermissionWrapper"
// import { dateToLocalISO } from '../../../../tools/date_tools'

// import ProfileMenu from "../ProfileMenu"


// const CREATE_ACCOUNT_MEMBERSHIP = gql`
//   mutation CreateAccountMembership($input: CreateAccountMembershipInput!) {
//     createAccountMembership(input: $input) {
//       accountMembership {
//         id
//         account {
//           id
//           firstName
//           lastName
//           email
//         }
//         organizationMembership {
//           id
//           name
//         }
//         financePaymentMethod {
//           id
//           name
//         }
//         dateStart
//         dateEnd
//         note     
//       }
//     }
//   }
// `


// class AccountMembershipAdd extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Account membership add props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const history = this.props.history
//     const match = this.props.match
//     const account_id = match.params.account_id
//     const returnUrl = "/relations/accounts/" + account_id + "/memberships"

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//         <Query query={GET_INPUT_VALUES_QUERY} variables = {{archived: false, accountId: account_id}} >
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
//                       <Card.Title>{t('relations.account.memberships.title_add')}</Card.Title>
//                     </Card.Header>
//                       <Mutation mutation={CREATE_ACCOUNT_MEMBERSHIP} onCompleted={() => history.push(returnUrl)}> 
//                       {(createMembership, { data }) => (
//                           <Formik
//                               initialValues={{ 
//                                 organizationMembership: "",
//                                 financePaymentMethod: "",
//                                 dateStart: new Date(),
//                                 note: "",
//                               }}
//                               validationSchema={MEMBERSHIP_SCHEMA}
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

//                                   createMembership({ variables: {
//                                     input: {
//                                       account: account_id, 
//                                       organizationMembership: values.organizationMembership,
//                                       financePaymentMethod: values.financePaymentMethod,
//                                       dateStart: dateToLocalISO(values.dateStart),
//                                       dateEnd: dateEnd,
//                                       note: values.note,
//                                     }
//                                   }, refetchQueries: [
//                                       {query: GET_ACCOUNT_MEMBERSHIPS_QUERY, variables: {archived: false, accountId: account_id}}
//                                   ]})
//                                   .then(({ data }) => {
//                                       console.log('got data', data)
//                                       toast.success((t('relations.account.memberships.toast_add_success')), {
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
//                                 <AccountMembershipForm
//                                   inputData={inputData}
//                                   isSubmitting={isSubmitting}
//                                   setFieldValue={setFieldValue}
//                                   setFieldTouched={setFieldTouched}
//                                   errors={errors}
//                                   values={values}
//                                   returnUrl={returnUrl}
//                                 >
//                                   {console.log(errors)}
//                                 </AccountMembershipForm>
//                               )}
//                           </Formik>
//                       )}
//                       </Mutation>
//                     </Card>
//                   </Grid.Col>
//                   <Grid.Col md={3}>
//                     <HasPermissionWrapper permission="add"
//                                           resource="accountmembership">
//                       <Link to={returnUrl}>
//                         <Button color="primary btn-block mb-6">
//                           <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
//                         </Button>
//                       </Link>
//                     </HasPermissionWrapper>
//                     <ProfileMenu account_id={account_id} activeLink='memberships'/>
//                   </Grid.Col>
//                 </Grid.Row>
//               </Container>
//             )}}
//           </Query>
//         </div>
//     </SiteWrapper>
//     )}
//   }


// export default withTranslation()(withRouter(AccountMembershipAdd))
