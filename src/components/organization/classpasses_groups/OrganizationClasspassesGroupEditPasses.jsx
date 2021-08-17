// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'

import { GET_CLASSPASS_GROUP_PASSES_QUERY, ADD_CARD_TO_GROUP, DELETE_CARD_FROM_GROUP } from './queries'

import {
  Dimmer,
  Alert,
  Icon,
  Button,
  Card,
  Table,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasspassesGroupsBase from './OrganizationClasspassesGroupsBase';


function OrganizationClasspassGroupEditPasses({ t, match, history }) {
  const groupId = match.params.id
  const returnUrl = "/organization/classpasses/groups"
  const cardTitle = t('organization.classpass_group_classpasses.title_edit')
  const { loading, error, data } = useQuery(GET_CLASSPASS_GROUP_PASSES_QUERY, { 
    variables: { id: groupId }
  })
  const [ addCardToGroup ] = useMutation(ADD_CARD_TO_GROUP)
  const [ deleteCardFromGroup ] = useMutation(DELETE_CARD_FROM_GROUP)

  // Loading
  if (loading) return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasspassesGroupsBase>
  )
  // Error
  if (error) return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasspassesGroupsBase>
  )

  console.log('query data')
  console.log(data)
  const passes = data.organizationClasspasses
  const group = data.organizationClasspassGroup

  let group_passes = {}
  if (group.organizationClasspasses.edges) {
    group.organizationClasspasses.edges.map(({ node}) => (
      group_passes[node.id] = true
    ))
  }

  return (
    <OrganizationClasspassesGroupsBase showBack={true}>
      <Card title={cardTitle}>
        <Card.Body>
          <Alert type="primary">
            <strong>{t('general.group')}</strong> {group.name}
          </Alert>
          <Table>
            <Table.Header>
              <Table.Row key={v4()}>
                <Table.ColHeader>{t('')}</Table.ColHeader>
                <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                <Table.ColHeader>{t('')}</Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {passes.edges.map(({ node }) => (
                  <Table.Row key={v4()}>
                    <Table.Col key={v4()}>
                      {(node.id in group_passes) ? 
                        <Icon name="check-circle" className="text-green" /> : <Icon name="x-circle" className="text-red" />
                      }
                    </Table.Col>
                    <Table.Col key={v4()}>
                      {node.name}
                    </Table.Col>
                    {console.log((node.id in group_passes))}
                    {(!(node.id in group_passes)) ?
                      // Add
                      <Table.Col className="text-right text-green" key={v4()}>
                        <Button color="link"
                          size="sm"
                          title={t('general.add_to_group')} 
                          href=""
                          onClick={() => {
                            console.log("clicked add")
                            let pass_id = node.id
                            addCardToGroup({ variables: {
                              input: {
                                organizationClasspass: pass_id,
                                organizationClasspassGroup: groupId
                              }
                        }, refetchQueries: [
                            {query: GET_CLASSPASS_GROUP_PASSES_QUERY, variables: {"id": groupId }}
                        ]}).then(({ data }) => {
                          console.log('got data', data);
                          toast.success(t('general.added_to_group'), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) + ': ' +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                          <Icon prefix="fe" name="plus-circle" /> { ' ' }
                          {t('general.add_to_group')} 
                        </Button>
                      </Table.Col>
                      :
                      // Delete
                      <Table.Col className="text-right text-red" key={v4()}>
                        <Button color="link"
                          size="sm"
                          title={t('general.delete_from_group')} 
                          href=""
                          onClick={() => {
                            console.log("clicked delete")
                            console.log(node.id)
                            let pass_id = node.id
                            deleteCardFromGroup({ variables: {
                              input: {
                                organizationClasspass: pass_id,
                                organizationClasspassGroup: groupId
                              }
                        }, refetchQueries: [
                            {query: GET_CLASSPASS_GROUP_PASSES_QUERY, variables: {"id": groupId }}
                        ]}).then(({ data }) => {
                          console.log('got data', data);
                          toast.success(t('general.deleted_from_group'), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) + ': ' +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                          <Icon prefix="fe" name="minus-circle" /> { ' ' }
                          {t('general.delete_from_group')}
                        </Button>
                      </Table.Col>
                      }
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </OrganizationClasspassesGroupsBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasspassGroupEditPasses))