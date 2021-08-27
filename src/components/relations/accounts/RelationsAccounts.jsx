// @flow

import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import moment from 'moment'

import {
  Badge,
  Icon,
  Dimmer,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

import CSLS from "../../../tools/cs_local_storage"

import ContentCard from "../../general/ContentCard"
import RelationsAccountsBase from "./RelationsAccountsBase"
import { GET_ACCOUNTS_QUERY, UPDATE_ACCOUNT_ACTIVE, DELETE_ACCOUNT } from "./queries"
import { get_list_query_variables } from "./tools"
import AppSettingsContext from '../../context/AppSettingsContext'

// Set some initial value for isActive, if not found
if (!localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE)) {
  localStorage.setItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE, true) 
} 

const confirm_delete = ({t, msgConfirm, msgDescription, msgSuccess, deleteFunction, functionVariables}) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='custom-ui'>
          <h1>{t('general.confirm_delete')}</h1>
          {msgConfirm}
          {msgDescription}
          <button className="btn btn-link pull-right" onClick={onClose}>{t('general.confirm_delete_no')}</button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteFunction(functionVariables)
                .then(({ data }) => {
                  console.log('got data', data);
                  toast.success(
                    msgSuccess, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error);
                })
              onClose()
            }}
          >
            <Icon name="trash-2" /> {t('general.confirm_delete_yes')}
          </button>
        </div>
      )
    }
  })
}


function RelationsAccounts({t, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const {loading, error, data, fetchMore, refetch} = useQuery(GET_ACCOUNTS_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })
  const [updateAccountActive] = useMutation(UPDATE_ACCOUNT_ACTIVE)
  const [deleteAccount] = useMutation(DELETE_ACCOUNT)

  if (loading || (data && !data.accounts)) return (
    <RelationsAccountsBase>
      <ContentCard cardTitle={t('relations.accounts.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </RelationsAccountsBase>
  )
  
  if (error) return (
    <RelationsAccountsBase>
      <Container>
        <ContentCard cardTitle={t('relations.accounts.title')}>
          <p>{t('relations.accounts.error_loading')}</p>
        </ContentCard>
      </Container>
    </RelationsAccountsBase>
  )

  const headerOptions = <Card.Options>
    <Button color={(localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE) === "true") ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {
              localStorage.setItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE, true)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.active')}
    </Button>
    <Button color={(localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE) === "false") ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {
              localStorage.setItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE, false)
              refetch(get_list_query_variables())
            }
    }>
      {t('general.deleted')}
    </Button>
  </Card.Options>

  let accounts = data.accounts

  // Empty list
  if (!accounts.edges.length) { return (
    <RelationsAccountsBase refetch={refetch}>
      <ContentCard cardTitle={t('relations.accounts.title')}
                    headerContent={headerOptions}>
        <p>
          {(localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE) === "true") ? t('relations.accounts.empty_list') : t("relations.accounts.empty_archive")}
        </p>
      </ContentCard>
    </RelationsAccountsBase>
  )}

  // Data
  return (
    <RelationsAccountsBase refetch={refetch}>
      <ContentCard 
        cardTitle={t('relations.accounts.title')}
        headerContent={headerOptions}
        pageInfo={data.accounts.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: data.accounts.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accounts.edges
              const pageInfo = fetchMoreResult.accounts.pageInfo 

              return newEdges.length
                ? {
                    // Put the new accounts at the end of the list and update `pageInfo`
                  accounts: {
                    __typename: previousResult.accounts.__typename,
                    edges: [ ...previousResult.accounts.edges, ...newEdges ],
                    pageInfo
                  }
                }
              : previousResult
            }
          })
        }} 
      >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>products</Table.ColHeader>
              {/* <Table.ColHeader>{t('general.info')}</Table.ColHeader> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accounts.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.firstName} {node.lastName} 
                    <div className="text-muted">
                      <a href={`mailto:${node.email}`}>{node.email}</a>
                    </div>
                    {(node.customer) ? <span>
                        <Badge color="primary" className="mr-1">{t("general.customer")}</Badge>
                      </span> : null}
                    {(node.teacher) ? <span>
                        <Badge color="info" className="mr-1">{t("general.teacher")}</Badge>
                      </span> : null}
                    {(node.employee) ? <span>
                        <Badge color="secondary">{t("general.employee")}</Badge>
                      </span> : null}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.subscriptions) ? 
                      // This is a workaround that reserves the array. Not yet figured out how to get the sorting right on subqueries in the backend
                      node.subscriptions.edges.slice(0).reverse().map(({ node: subscription }) => (
                        <div>
                          <small>
                          <Icon name="edit" /> {' '}
                          { subscription.organizationSubscription.name } <br />
                          <div className="text-muted ">
                            <small>
                              { moment(subscription.dateStart).format(dateFormat) } 
                              {(subscription.dateEnd) ? 
                                <span> - {moment(subscription.dateEnd).format(dateFormat)}</span>  
                                : ""
                              }
                            </small>
                          </div>
                          </small>
                        </div>
                      )) 
                      : ""
                    }
                    {(node.classpasses) ? 
                      // This is a workaround that reserves the array. Not yet figured out how to get the sorting right on subqueries in the backend
                      node.classpasses.edges.slice(0).reverse().map(({ node: classpass }) => (
                        <div>
                          <small>
                          <Icon name="credit-card" /> {' '}
                          { classpass.organizationClasspass.name } <br />
                          <div className="text-muted ">
                            <small>
                              { moment(classpass.dateStart).format(dateFormat) } {" - "}
                              { moment(classpass.dateEnd).format(dateFormat)} { " | " }  
                              { t("general.classes_remaining") }: { classpass.classesRemainingDisplay }
                            </small>
                          </div>
                          </small>
                        </div>
                      )) 
                      : ""
                    }
                  </Table.Col>
                  {/* <Table.Col key={v4()}>
                    {(node.customer) ? <span>
                        <Badge color="primary" className="mb-1">{t("general.customer")}</Badge> <br />
                      </span> : null}
                    {(node.teacher) ? <span>
                        <Badge color="info" className="mb-1">{t("general.teacher")}</Badge> <br />
                      </span> : null}
                    {(node.employee) ? <span>
                        <Badge color="secondary" className="mb-1">{t("general.employee")}</Badge> <br />
                      </span> : null}
                  </Table.Col> */}
                  <Table.Col className="text-right" key={v4()}>
                    {(!node.isActive) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Link to={`/relations/accounts/${node.id}/profile`}>
                        <Button className='btn-sm' 
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                      </Link>
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.deactivate')} 
                      href=""
                      onClick={() => {
                        console.log("clicked isActive")
                        let id = node.id
                        let isActive 
                        if (localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE) == "true") {
                          isActive = true
                        } else {
                          isActive = false
                        }

                        updateAccountActive({ variables: {
                          input: {
                            id,
                            isActive: !isActive // invert, as we need the opposite from the list currently displayed
                          }
                    }, refetchQueries: [
                        {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()}
                    ]}).then(({ data }) => {
                      console.log('got data', data);
                      toast.success(
                        (isActive) ? t('relations.accounts.deactivated'): t('relations.accounts.restored'), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                    }).catch((error) => {
                      toast.error((t('general.toast_server_error')) + ': ' +  error, {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                      console.log('there was an error sending the query', error);
                    })
                    }}>
                      {
                        (node.isActive) ?
                          <Icon prefix="fe" name="trash-2" /> :
                          t("general.restore")
                      }
                    </button>
                  </Table.Col>
                  {
                    (node.isActive) ? '' :
                      <Table.Col className="text-right" key={v4()}>
                        <button className="icon btn btn-link btn-sm" 
                          title={t('general.delete')} 
                          href=""
                          onClick={() => {
                            confirm_delete({
                              t: t,
                              msgConfirm: t("relations.accounts.delete_confirm_msg"),
                              msgDescription: <p>{node.first_name} {node.last_name}</p>,
                              msgSuccess: t('relations.accounts.deleted'),
                              deleteFunction: deleteAccount,
                              functionVariables: { variables: {
                                input: {
                                  id: node.id
                                }
                              }, refetchQueries: [
                                {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()}
                              ]}
                            })
                        }}>
                          <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                        </button>
                      </Table.Col>
                  }
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </RelationsAccountsBase>
  )
}


export default withTranslation()(withRouter(RelationsAccounts))