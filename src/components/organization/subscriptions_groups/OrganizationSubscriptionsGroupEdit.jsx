import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SUBSCRIPTION_GROUPS_QUERY, GET_SUBSCRIPTION_GROUP_QUERY, UPDATE_SUBSCRIPTION_GROUP } from './queries'
import { SUBSCRIPTION_GROUP_SCHEMA } from './yupSchema'
import OrganizationSubscriptionGroupForm from './OrganizationSubscriptionsGroupForm'


import {
  Card,
  Dimmer,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationSubscriptionsGroupsBase from './OrganizationSubscriptionsGroupsBase';


function OrganizationSubscriptionGroupEdit({t, match, history}) {
  const id = match.params.id
  const returnUrl = "/organization/subscriptions/groups"
  const cardTitle = t('organization.subscription_groups.title_edit')
  const {loading, error, data} = useQuery(GET_SUBSCRIPTION_GROUP_QUERY, {
    variables: { id: id }
  })
  const [ updateSubscriptionGroup ] = useMutation(UPDATE_SUBSCRIPTION_GROUP)
  
  if (loading) return (
    <OrganizationSubscriptionsGroupsBase returnUrl={returnUrl}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationSubscriptionsGroupsBase>
  )
  // Error
  if (error) return (
    <OrganizationSubscriptionsGroupsBase returnUrl={returnUrl}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.subscription_groups.error_loading')}</p>
      </ContentCard>
    </OrganizationSubscriptionsGroupsBase>
  )

  const initialData = data.organizationSubscriptionGroup;

  return (
    <OrganizationSubscriptionsGroupsBase returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            description: initialData.description,
          }}
          validationSchema={SUBSCRIPTION_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateSubscriptionGroup({ variables: {
              input: {
                id: match.params.id,
                name: values.name,
                description: values.description,
              }
            }, refetchQueries: [
                {query: GET_SUBSCRIPTION_GROUPS_QUERY}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                history.push(returnUrl)
                toast.success((t('organization.subscription_groups.toast_edit_success')), {
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
          {({ isSubmitting, errors, values }) => (
            <OrganizationSubscriptionGroupForm
              isSubmitting={isSubmitting}
              errors={errors}
              returnUrl={returnUrl}
            />
          )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsGroupsBase>
  )
}


// class OrganizationSubscriptionGroupEdit extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Organization subscriptiongroup edit props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const history = this.props.history
//     const id = match.params.id
//     const return_url = "/organization/subscriptions/groups"

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//           <Container>
//             <Page.Header title="Organization" />
//             <Grid.Row>
//               <Grid.Col md={9}>
//               <Card>
//                 <Card.Header>
//                   <Card.Title>{t('organization.subscription_groups.title_edit')}</Card.Title>
//                   {console.log(match.params.id)}
//                 </Card.Header>
//                 <Query query={GET_SUBSCRIPTION_GROUP_QUERY} variables={{ id }} >
//                 {({ loading, error, data, refetch }) => {
//                     // Loading
//                     if (loading) return <p>{t('general.loading_with_dots')}</p>
//                     // Error
//                     if (error) {
//                       console.log(error)
//                       return <p>{t('general.error_sad_smiley')}</p>
//                     }
                    
//                     const initialData = data.organizationSubscriptionGroup;
//                     console.log('query data')
//                     console.log(data)

//                     return (
                      
//                       <Mutation mutation={UPDATE_SUBSCRIPTION_GROUP} onCompleted={() => history.push(return_url)}> 
//                       {(updateSubscriptionGroup, { data }) => (
//                           <Formik
//                               initialValues={{ 
//                                 name: initialData.name, 
//                                 description: initialData.description,
//                               }}
//                               validationSchema={SUBSCRIPTION_GROUP_SCHEMA}
//                               onSubmit={(values, { setSubmitting }) => {
//                                   console.log('submit values:')
//                                   console.log(values)

//                                   updateSubscriptionGroup({ variables: {
//                                     input: {
//                                       id: match.params.id,
//                                       name: values.name,
//                                       description: values.description,
//                                     }
//                                   }, refetchQueries: [
//                                       {query: GET_SUBSCRIPTION_GROUPS_QUERY}
//                                   ]})
//                                   .then(({ data }) => {
//                                       console.log('got data', data)
//                                       toast.success((t('organization.subscription_groups.toast_edit_success')), {
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
//                               {({ isSubmitting, errors, values }) => (
//                                 <OrganizationSubscriptionGroupForm
//                                   isSubmitting={isSubmitting}
//                                   errors={errors}
//                                   return_url={return_url}
//                                 />
//                               )}
//                           </Formik>
//                       )}
//                       </Mutation>
//                       )}}
//                 </Query>
//               </Card>
//               </Grid.Col>
//               <Grid.Col md={3}>
//                 <HasPermissionWrapper permission="change"
//                                       resource="organizationsubscriptiongroup">
//                   <Button color="primary btn-block mb-6"
//                           onClick={() => history.push(return_url)}>
//                     <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
//                   </Button>
//                 </HasPermissionWrapper>
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         </div>
//     </SiteWrapper>
//     )}
//   }


export default withTranslation()(withRouter(OrganizationSubscriptionGroupEdit))