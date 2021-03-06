import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Icon,
  Dimmer,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import { get_list_query_variables } from "./tools"

import FinancePaymentBatchCategory from "../../ui/FinancePaymentBatchCategory"
import ContentCard from "../../general/ContentCard"
import FinancePaymentBatchCategoriesBase from "./FinancePaymentBatchCategoriesBase"
import CSLS from "../../../tools/cs_local_storage"

import { GET_PAYMENT_BATCH_CATEGORIES_QUERY, ARCHIVE_PAYMENT_BATCH_CATEGORY } from "./queries"

function FinancePaymentBatchCategories({t, history}) {
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_PAYMENT_BATCH_CATEGORIES_QUERY, {
    variables: get_list_query_variables(),
  })
  const [archivePaymentBatchCategory] = useMutation(ARCHIVE_PAYMENT_BATCH_CATEGORY)

  // TODO: use local storage for archive buttons
  const headerOptions = <Card.Options>
    <Button color={(localStorage.getItem(CSLS.FINANCE_PAYMENT_BATCH_CATEGORIES_SHOW_ARCHIVE) !== "true") ? 
      'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.FINANCE_PAYMENT_BATCH_CATEGORIES_SHOW_ARCHIVE, false)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.current')}
    </Button>
    <Button color={(localStorage.getItem(CSLS.FINANCE_PAYMENT_BATCH_CATEGORIES_SHOW_ARCHIVE) === "true") ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {
              localStorage.setItem(CSLS.FINANCE_PAYMENT_BATCH_CATEGORIES_SHOW_ARCHIVE, true)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.archive')}
    </Button>
  </Card.Options>

  // Loading
  if (loading) return (
    <FinancePaymentBatchCategoriesBase showAdd={true}>
      <ContentCard cardTitle={t('finance.payment_batch_categories.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinancePaymentBatchCategoriesBase>
  )
  // Error
  if (error) return (
    <FinancePaymentBatchCategoriesBase showAdd={true}>
      <ContentCard cardTitle={t('finance.payment_batch_categories.title')}>
        <p>{t('finance.payment_batch_categories.error_loading')}</p>
      </ContentCard>
      </FinancePaymentBatchCategoriesBase>
  )

  let payment_batch_categories = data.financePaymentBatchCategories
  // Empty list
  if (!payment_batch_categories.edges.length) { return (
    <FinancePaymentBatchCategoriesBase showAdd={true}>
      <ContentCard cardTitle={t('finance.payment_batch_categories.title')}
                    headerContent={headerOptions}>
        <p>
          { (localStorage.getItem(CSLS.FINANCE_PAYMENT_BATCH_CATEGORIES_SHOW_ARCHIVE === "true")) ? 
              t("finance.payment_batch_categories.empty_archive") :
              t('finance.payment_batch_categories.empty_list')
          }
        </p>
      </ContentCard>
    </FinancePaymentBatchCategoriesBase>
  )}

  return (
    <FinancePaymentBatchCategoriesBase showAdd={true}>
      <ContentCard cardTitle={t('finance.payment_batch_categories.title')}
        headerContent={headerOptions}
        pageInfo={payment_batch_categories.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: payment_batch_categories.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.financePaymentBatchCategories.edges
            const pageInfo = fetchMoreResult.financePaymentBatchCategories.pageInfo

            return newEdges.length
              ? {
                  // Put the new payment_methods at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  financePaymentBatchCategories: {
                    __typename: previousResult.financePaymentBatchCategories.__typename,
                    edges: [ ...previousResult.financePaymentBatchCategories.edges, ...newEdges ],
                    pageInfo
                  }
                }
              : previousResult
            }
        })
      }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.payment_batch_categories.batch_category_type')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {payment_batch_categories.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  {node.name}
                </Table.Col>
                <Table.Col key={v4()}>
                  <FinancePaymentBatchCategory categoryType={node.batchCategoryType} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/finance/paymentbatchcategories/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <button className="icon btn btn-link btn-sm" 
                      title={t('general.archive')} 
                      onClick={() => {
                        console.log("clicked archived")
                        let id = node.id
                        archivePaymentBatchCategory({ variables: {
                          input: {
                          id,
                          archived: !node.archived
                        }
                      }, refetchQueries: [
                          {query: GET_PAYMENT_BATCH_CATEGORIES_QUERY, variables: get_list_query_variables()}
                      ]}).then(({ data }) => {
                        console.log('got data', data);
                        toast.success(
                          (node.archived) ? t('general.unarchived'): t('general.archived'), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                      }).catch((error) => {
                        toast.error((t('general.toast_server_error')) +  error, {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        console.log('there was an error sending the query', error);
                        })
                      }}>
                    <Icon prefix="fa" name="inbox" />
                  </button>
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </FinancePaymentBatchCategoriesBase>
  )
}



// const FinancePaymentMethods = ({ t, history, archived=false }) => (
//   <SiteWrapper>
//     <div className="my-3 my-md-5">
//       <Container>
//         <Page.Header title={t("finance.title")} />
//         <Grid.Row>
//           <Grid.Col md={9}>
//             <Query query={GET_PAYMENT_METHODS_QUERY} variables={{ archived }}>
//              {({ loading, error, data: {financePaymentMethods: payment_methods}, refetch, fetchMore }) => {
//                 // Loading
//                 if (loading) return (
//                   <ContentCard cardTitle={t('finance.payment_methods.title')}>
//                     <Dimmer active={true}
//                             loader={true}>
//                     </Dimmer>
//                   </ContentCard>
//                 )
//                 // Error
//                 if (error) return (
//                   <ContentCard cardTitle={t('finance.payment_methods.title')}>
//                     <p>{t('finance.payment_methods.error_loading')}</p>
//                   </ContentCard>
//                 )
//                 const headerOptions = <Card.Options>
//                   <Button color={(!archived) ? 'primary': 'secondary'}  
//                           size="sm"
//                           onClick={() => {archived=false; refetch({archived});}}>
//                     {t('general.current')}
//                   </Button>
//                   <Button color={(archived) ? 'primary': 'secondary'} 
//                           size="sm" 
//                           className="ml-2" 
//                           onClick={() => {archived=true; refetch({archived});}}>
//                     {t('general.archive')}
//                   </Button>
//                 </Card.Options>
                
//                 // Empty list
//                 if (!payment_methods.edges.length) { return (
//                   <ContentCard cardTitle={t('finance.payment_methods.title')}
//                                headerContent={headerOptions}>
//                     <p>
//                     {(!archived) ? t('finance.payment_methods.empty_list') : t("finance.payment_methods.empty_archive")}
//                     </p>
                   
//                   </ContentCard>
//                 )} else {   
//                 // Life's good! :)
//                 return (
//                   <ContentCard cardTitle={t('finance.payment_methods.title')}
//                                headerContent={headerOptions}
//                                pageInfo={payment_methods.pageInfo}
//                                onLoadMore={() => {
//                                 fetchMore({
//                                   variables: {
//                                     after: payment_methods.pageInfo.endCursor
//                                   },
//                                   updateQuery: (previousResult, { fetchMoreResult }) => {
//                                     const newEdges = fetchMoreResult.financePaymentMethods.edges
//                                     const pageInfo = fetchMoreResult.financePaymentMethods.pageInfo

//                                     return newEdges.length
//                                       ? {
//                                           // Put the new payment_methods at the end of the list and update `pageInfo`
//                                           // so we have the new `endCursor` and `hasNextPage` values
//                                           financePaymentMethods: {
//                                             __typename: previousResult.financePaymentMethods.__typename,
//                                             edges: [ ...previousResult.financePaymentMethods.edges, ...newEdges ],
//                                             pageInfo
//                                           }
//                                         }
//                                       : previousResult
//                                   }
//                                 })
//                               }} >
//                     <Table>
//                           <Table.Header>
//                             <Table.Row key={v4()}>
//                               <Table.ColHeader>{t('general.name')}</Table.ColHeader>
//                               <Table.ColHeader>{t('finance.code')}</Table.ColHeader>
//                             </Table.Row>
//                           </Table.Header>
//                           <Table.Body>
//                               {payment_methods.edges.map(({ node }) => (
//                                 <Table.Row key={v4()}>
//                                   <Table.Col key={v4()}>
//                                     {node.name}
//                                   </Table.Col>
//                                   <Table.Col key={v4()}>
//                                     {node.code}
//                                   </Table.Col>
//                                   <Table.Col className="text-right" key={v4()}>
//                                     {(node.archived) ? 
//                                       <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
//                                       <Button className='btn-sm' 
//                                               onClick={() => history.push("/finance/paymentmethods/edit/" + node.id)}
//                                               color="secondary">
//                                         {t('general.edit')}
//                                       </Button>
//                                     }
//                                   </Table.Col>
//                                   {(node.systemMethod) ? 
//                                     <Table.Col></Table.Col> :
//                                     <Mutation mutation={ARCHIVE_PAYMENT_METHOD} key={v4()}>
//                                       {(archivePaymentMethod, { data }) => (
//                                         <Table.Col className="text-right" key={v4()}>
//                                           <button className="icon btn btn-link btn-sm" 
//                                             title={t('general.archive')} 
//                                             href=""
//                                             onClick={() => {
//                                               console.log("clicked archived")
//                                               let id = node.id
//                                               archivePaymentMethod({ variables: {
//                                                 input: {
//                                                   id,
//                                                   archived: !archived
//                                                 }
//                                           }, refetchQueries: [
//                                               {query: GET_PAYMENT_METHODS_QUERY, variables: {"archived": archived }}
//                                           ]}).then(({ data }) => {
//                                             console.log('got data', data);
//                                             toast.success(
//                                               (archived) ? t('general.unarchived'): t('general.archived'), {
//                                                 position: toast.POSITION.BOTTOM_RIGHT
//                                               })
//                                           }).catch((error) => {
//                                             toast.error((t('general.toast_server_error')) +  error, {
//                                                 position: toast.POSITION.BOTTOM_RIGHT
//                                               })
//                                             console.log('there was an error sending the query', error);
//                                           })
//                                           }}>
//                                             <Icon prefix="fa" name="inbox" />
//                                           </button>
//                                         </Table.Col>
//                                       )}
//                                     </Mutation>
//                                   }
//                                 </Table.Row>
//                               ))}
//                           </Table.Body>
//                         </Table>
//                   </ContentCard>
//                 )}}
//              }
//             </Query>
//           </Grid.Col>
//           <Grid.Col md={3}>
//             <HasPermissionWrapper permission="add"
//                                   resource="financepaymentmethod">
//               <Button color="primary btn-block mb-6"
//                       onClick={() => history.push("/finance/paymentmethods/add")}>
//                 <Icon prefix="fe" name="plus-circle" /> {t('finance.payment_methods.add')}
//               </Button>
//             </HasPermissionWrapper>
//           </Grid.Col>
//         </Grid.Row>
//       </Container>
//     </div>
//   </SiteWrapper>
// );

export default withTranslation()(withRouter(FinancePaymentBatchCategories))