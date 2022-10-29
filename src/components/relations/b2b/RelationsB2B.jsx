import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Icon,
  Badge,
  Button,
  Card,
  Table
} from "tabler-react";

import { toast } from 'react-toastify'
import CSLS from "../../../tools/cs_local_storage"
import ContentCard from "../../general/ContentCard"
import RelationsB2BBase from "./RelationsB2BBase"
import { GET_BUSINESSES_QUERY, UPDATE_BUSINESS } from "./queries"
import { get_list_query_variables } from "./tools"
import confirm_delete from "../../../tools/confirm_delete"


const DELETE_BUSINESS = gql`
  mutation DeleteBusiness($input: DeleteBusinessInput!) {
    deleteBusiness(input: $input) {
      ok
    }
  }
`


function RelationsB2B({ t, history }) {
  // Set some initial value for archived, if not found
  if (!localStorage.getItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE)) {
    localStorage.setItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE, false) 
  }

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_BUSINESSES_QUERY, { 
    variables: get_list_query_variables()
  })
  const [updateBusiness] = useMutation(UPDATE_BUSINESS)
  const [deleteBusiness] = useMutation(DELETE_BUSINESS)

  const headerOptions = <Card.Options>
    <Button color={(localStorage.getItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE) === "false") ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE, false)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.current')}
    </Button>
    <Button color={(localStorage.getItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE) === "true") ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {
              localStorage.setItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE, true)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.archive')}
    </Button>
  </Card.Options>

  if (loading) return (
    <RelationsB2BBase refetch={refetch}>
      <ContentCard>
        {t("general.loading_with_dots")}
      </ContentCard>
    </RelationsB2BBase>
  )
  if (error) return (
    <RelationsB2BBase refetch={refetch}>
      <ContentCard cardTitle={t('relations.b2b.title')}>
        <p>{t('relations.b2b.error_loading')}</p>
      </ContentCard>
    </RelationsB2BBase>
  )

  let businesses = data.businesses

  // Empty list
  if (!businesses.edges.length) { return (
    <RelationsB2BBase refetch={refetch}>
      <ContentCard cardTitle={t('relations.b2b.title')}
                   headerContent={headerOptions}>
        <p>
          {(localStorage.getItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE) === "true") ? 
            t('relations.b2b.empty_archive') : 
            t("relations.b2b.empty_list")}
        </p>
      </ContentCard>
    </RelationsB2BBase>
  )}

  return (
    <RelationsB2BBase refetch={refetch}>
      <ContentCard cardTitle={t('relations.b2b.title')}
                    headerContent={headerOptions}
                    hasCardBody={false}
                    pageInfo={businesses.pageInfo}
                    onLoadMore={() => {
                      fetchMore({
                        variables: {
                          after: businesses.pageInfo.endCursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          const newEdges = fetchMoreResult.businesses.edges
                          const pageInfo = fetchMoreResult.businesses.pageInfo 

                          return newEdges.length
                            ? {
                                // Put the new businesses at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                businesses: {
                                  __typename: previousResult.businesses.__typename,
                                  edges: [ ...previousResult.businesses.edges, ...newEdges ],
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
              <Table.ColHeader></Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {data.businesses.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.supplier) ? <span>
                      <Badge color="primary" className="mr-1">{t("general.supplier")}</Badge>
                    </span> : null}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Link to={`/relations/b2b/${node.id}/edit`}>
                        <Button className='btn-sm' 
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                      </Link>
                    }
                    {/* Archive / restore buttons */}
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.archive')} 
                      href=""
                      onClick={() => {
                        let id = node.id
                        let show_archive
                        if (localStorage.getItem(CSLS.RELATIONS_BUSINESSES_SHOW_ARCHIVE) === "true") {
                          show_archive = true
                        } else {
                          show_archive = false
                        }

                        updateBusiness({ variables: {
                          input: {
                            id,
                            archived: !node.archived // invert, as we need the opposite from the list currently displayed
                          }}, 
                          refetchQueries: [
                        {query: GET_BUSINESSES_QUERY, variables: get_list_query_variables()}
                        ]}).then(({ data }) => {
                          toast.success(
                            (!show_archive) ? t('relations.b2b.archived'): t('relations.b2b.restored'), {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                      {
                        (!node.archived) ?
                          <Icon prefix="fa" name="inbox" /> :
                          t("general.restore")
                      }
                    </button>

                  {/* Delete button shown when archived */}
                    {
                      (!node.archived) ? '' :
                        <button className="icon btn btn-link btn-sm" 
                          title={t('general.delete')} 
                          href=""
                          onClick={() => {
                            confirm_delete({
                              t: t,
                              msgConfirm: t("relations.b2b.delete_confirm_msg"),
                              msgDescription: <span><br /><br /><ul><li>{node.name}</li></ul></span>,
                              msgSuccess: t('relations.b2b.deleted'),
                              deleteFunction: deleteBusiness,
                              functionVariables: { variables: {
                                input: {
                                  id: node.id
                                }
                              }, refetchQueries: [
                                {query: GET_BUSINESSES_QUERY, variables: get_list_query_variables()}
                              ]}
                            })
                          }}
                        >
                          <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                        </button>
                    }
                    </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>  
    </RelationsB2BBase>  
  )
}

export default withTranslation()(withRouter(RelationsB2B))
