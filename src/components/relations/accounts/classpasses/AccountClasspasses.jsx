// @flow

import React, { useContext } from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Button,
  Card,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import confirm_delete from "../../../../tools/confirm_delete"

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'

import { GET_ACCOUNT_CLASSPASSES_QUERY, DELETE_ACCOUNT_CLASSPASS } from "./queries"


function AccountClasspasses({t, match}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const accountId = match.params.account_id
  const activeLink = "classpasses"
  const cardTitle = t('relations.account.classpasses.title')
  const sidebarButton = <HasPermissionWrapper 
    permission="add"
    resource="accountclasspass">
      <Link to={`/relations/accounts/${accountId}/classpasses/add`}>
        <Button color="primary btn-block mb-6">
          <Icon prefix="fe" name="plus-circle" /> {t('relations.account.classpasses.add')}
        </Button>
      </Link>
  </HasPermissionWrapper>

  const {loading, error, data, fetchMore} = useQuery(GET_ACCOUNT_CLASSPASSES_QUERY, {
    variables: { accountId: accountId }
  })
  const [deleteAccountClasspass] = useMutation(DELETE_ACCOUNT_CLASSPASS)

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

  const account = data.account
  const accountClasspasses = data.accountClasspasses

  return (
    <RelationsAccountProfileBase 
      user={account}
      activeLink={activeLink}
      sidebarButton={sidebarButton}
    >
      <ContentCard 
        cardTitle={t('relations.account.classpasses.title')}
        pageInfo={accountClasspasses.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: accountClasspasses.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accountClasspasses.edges
              const pageInfo = fetchMoreResult.accountClasspasses.pageInfo

              return newEdges.length
                ? {
                    // Put the new accountClasspasses at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    accountClasspasses: {
                      __typename: previousResult.accountClasspasses.__typename,
                      edges: [ ...previousResult.accountClasspasses.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader>{t('general.classes_remaining')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader> 
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountClasspasses.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.organizationClasspass.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.dateEnd).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    <Link to={`/relations/accounts/${accountId}/classpasses/classes/${node.id}`}>
                      {node.classesRemainingDisplay}
                    </Link>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={"/relations/accounts/" + match.params.account_id + "/classpasses/edit/" + node.id}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("relations.account.classpasses.delete_confirm_msg"),
                          msgDescription: <p>{node.organizationClasspass.name} {node.dateStart}</p>,
                          msgSuccess: t('relations.account.classpasses.deleted'),
                          deleteFunction: deleteAccountClasspass,
                          functionVariables: { variables: {
                            input: {
                              id: node.id
                            }
                          }, refetchQueries: [
                            {query: GET_ACCOUNT_CLASSPASSES_QUERY, variables: { accountId: accountId }} 
                          ]}
                        })
                    }}>
                      <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>    
    </RelationsAccountProfileBase>
  )
}

        
export default withTranslation()(withRouter(AccountClasspasses))