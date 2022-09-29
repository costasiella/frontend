import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { GET_ACCOUNT_PRODUCTS_QUERY, GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_PRODUCT } from './queries'
// import { CLASSPASS_SCHEMA } from './yupSchema'
// import AccountClasspassForm from './AccountClasspassForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase';

import {
  Card,
  Dimmer,
  Grid,
} from "tabler-react";

import CSStoreCard from '../../../ui/CSStoreCard'
import LoadMoreOnBottomScroll from '../../../general/LoadMoreOnBottomScroll'


function AccountProductAdd({t, match, history}) {
  const accountId = match.params.account_id
  const activeLink = "products"
  const cardTitle = t('relations.account.products.title_add')
  const returnUrl = `/relations/accounts/${accountId}/products`

  const buttonTextAdd = t("general.add")

  
  const {loading, error, data, fetchMore} = useQuery(GET_INPUT_VALUES_QUERY, { 
    variables: { accountId: accountId }
  })
  const [createAccountProduct] = useMutation(CREATE_ACCOUNT_PRODUCT)

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
      <Card title={cardTitle}>
        <Dimmer loader={true} active={true} />
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )
  
  const organizationProducts = data.organizationProducts
  const account = data.account

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      returnUrl={returnUrl} 
    >
      <Grid.Row>
        <Grid.Col md={12}>
          <h4>{t("relations.account.products.title_add")}</h4>
        </Grid.Col>
      </Grid.Row>

        <LoadMoreOnBottomScroll 
          pageInfo={organizationProducts.pageInfo}
          onLoadMore={() => {
            fetchMore({
              variables: {
                after: organizationProducts.pageInfo.endCursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.organizationProducts.edges
                const pageInfo = fetchMoreResult.organizationProducts.pageInfo

                return newEdges.length
                  ? {
                      // Put the new accountClasspasses at the end of the list and update `pageInfo`
                      // so we have the new `endCursor` and `hasNextPage` values
                      organizationProducts: {
                        __typename: previousResult.organizationProducts.__typename,
                        edges: [ ...previousResult.organizationProducts.edges, ...newEdges ],
                        pageInfo
                      }
                    }
                  : previousResult
              }
            })
          }} 
        >
          <Grid.Row>
            {organizationProducts.edges.map(({ node }) => (
              <Grid.Col md={4}>
                {console.log(node)}
                <CSStoreCard
                  title={node.name}
                  subtitle={node.description}
                  price={node.priceDisplay}
                  imgUrl={node.urlImageThumbnailLarge}
                  imgAlt={node.name}
                  buttonText={buttonTextAdd}
                />
              </Grid.Col>
            ))}
          </Grid.Row>
        </LoadMoreOnBottomScroll>
      {/* <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
          <Formik
            initialValues={{ 
              organizationClasspass: "",
              dateStart: new Date(),
              note: "",
            }}
            validationSchema={CLASSPASS_SCHEMA}
            onSubmit={(values, { setSubmitting }, errors) => {
                console.log('submit values:')
                console.log(values)
                console.log(errors)


                createAccountClasspass({ variables: {
                  input: {
                    account: accountId, 
                    organizationClasspass: values.organizationClasspass,
                    dateStart: dateToLocalISO(values.dateStart),
                    note: values.note,
                  }
                }, refetchQueries: [
                    {query: GET_ACCOUNT_CLASSPASSES_QUERY, variables: { accountId: accountId}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    const classpassId = data.createAccountClasspass.accountClasspass.id
                    history.push(`/relations/accounts/${accountId}/classpasses/edit/${classpassId}`)
                    toast.success((t('relations.account.classpasses.toast_add_success')), {
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
              <AccountClasspassForm
                create={true}
                inputData={inputData}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              >
                {console.log(errors)}
              </AccountClasspassForm>
            )}
          </Formik>
      </Card> */}
    </RelationsAccountProfileBase>
  ) 
}

export default withTranslation()(withRouter(AccountProductAdd))
