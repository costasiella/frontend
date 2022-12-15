import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_INPUT_VALUES_QUERY, CREATE_SUBSCRIPTION } from './queries'
import { SUBSCRIPTION_SCHEMA } from './yupSchema'
import OrganizationSubscriptionForm from './OrganizationSubscriptionForm'

import {
  Card,
  Dimmer
} from "tabler-react";
import ContentCard from "../../general/ContentCard"
import OrganizationSubscriptionsBase from "./OrganizationSubscriptionsBase"


function OrganizationSubscriptionAdd({ t, history }) {
  const cardTitle = t('organization.subscriptions.title_add')
  const returnUrl =  "/organization/subscriptions"
  const {loading, error, data} = useQuery(GET_INPUT_VALUES_QUERY)
  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION)

  if (loading) return (
    <OrganizationSubscriptionsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  if (error) return (
    <OrganizationSubscriptionsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  console.log('query data')
  console.log(data)
  const inputData = data

  return (
    <OrganizationSubscriptionsBase showBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
            initialValues={{ 
              displayPublic: true,
              displayShop: true,
              name: "",
              description: "",
              sortOrder: 0,
              minDuration: 1,
              classes: 1,
              subscriptionUnit: "WEEK",
              reconciliationClasses: 0,
              creditValidity: 31,
              unlimited: false,
              termsAndConditions: "",
              organizationMembership: "",
              quickStatsAmount: 0,
              financeGlaccount: "",
              financeCostcenter: ""
            }}
            validationSchema={SUBSCRIPTION_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                createSubscription({ variables: {
                  input: {
                    displayPublic: values.displayPublic,
                    displayShop: values.displayShop,
                    name: values.name,
                    description: values.description,
                    sortOrder: parseInt(values.sortOrder),
                    minDuration: parseInt(values.minDuration),
                    classes: parseInt(values.classes),
                    subscriptionUnit: values.subscriptionUnit,
                    reconciliationClasses: parseInt(values.reconciliationClasses),
                    creditValidity: parseInt(values.creditValidity),
                    unlimited: values.unlimited,
                    termsAndConditions: values.termsAndConditions,
                    quickStatsAmount: values.quickStatsAmount,
                    financeGlaccount: values.financeGlaccount,
                    financeCostcenter: values.financeCostcenter
                  }
                }})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.subscriptions.toast_add_success')), {
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
              <OrganizationSubscriptionForm
                inputData={inputData}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              />
            )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsBase>
  )
}



// class OrganizationSubscriptionAdd extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Organization subscription add props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const history = this.props.history
//     const returnUrl = "/organization/subscriptions"

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//           <Container>
//             <Page.Header title="Organization" />
//             <Grid.Row>
//               <Grid.Col md={9}>

//               </Grid.Col>
//               <Grid.Col md={3}>
//                 <HasPermissionWrapper permission="add"
//                                       resource="organizationsubscription">
//                   <Button color="primary btn-block mb-6"
//                           onClick={() => history.push(returnUrl)}>
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


export default withTranslation()(withRouter(OrganizationSubscriptionAdd))