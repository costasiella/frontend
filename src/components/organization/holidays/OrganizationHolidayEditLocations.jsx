import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'

import { GET_HOLIDAY_LOCATIONS_QUERY, ADD_LOCATION_TO_HOLIDAY, DELETE_LOCATION_FROM_HOLIDAY } from './queries'

import {
  Dimmer,
  Icon,
  Button,
  Card,
  Table,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationHolidaysBase from './OrganizationHolidaysBase';


function OrganizationHolidayEditLocations({ t, match, history }) {
  const holidayId = match.params.id
  let cardTitle = t('organization.holidays.locations.title_edit')
  const { loading, error, data } = useQuery(GET_HOLIDAY_LOCATIONS_QUERY, { 
    variables: { id: holidayId }
  })
  const [ addLocationToHoliday ] = useMutation(ADD_LOCATION_TO_HOLIDAY)
  const [ deleteLocationFromHoliday ] = useMutation(DELETE_LOCATION_FROM_HOLIDAY)

  // Loading
  if (loading) return (
    <OrganizationHolidaysBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationHolidaysBase>
  )
  // Error
  if (error) return (
    <OrganizationHolidaysBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationHolidaysBase>
  )

  console.log('query data')
  console.log(data)
  const locations = data.organizationLocations
  const holiday = data.organizationHoliday

  let holiday_locations = {}
  if (holiday.organizationLocations.edges) {
    holiday.organizationLocations.edges.map(({ node}) => (
      holiday_locations[node.id] = true
    ))
  }

  cardTitle = cardTitle + " - " + holiday.name

  return (
    <OrganizationHolidaysBase showBack={true}>
      <Card title={cardTitle}>
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('')}</Table.ColHeader>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {locations.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {(node.id in holiday_locations) ? 
                      <Icon name="check-circle" className="text-green" /> : <Icon name="x-circle" className="text-red" />
                    }
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  {console.log((node.id in holiday_locations))}
                  {(!(node.id in holiday_locations)) ?
                    // Add
                    <Table.Col className="text-right text-green" key={v4()}>
                      <Button color="link"
                        size="sm"
                        title={t('organization.holiday.locations.add_to_holiday')} 
                        href=""
                        onClick={() => {
                          console.log("clicked add")
                          let locationId = node.id
                          addLocationToHoliday({ variables: {
                            input: {
                              organizationHoliday: holidayId,
                              organizationLocation: locationId
                            }
                      }, refetchQueries: [
                          {query: GET_HOLIDAY_LOCATIONS_QUERY, variables: {"id": holidayId }}
                      ]}).then(({ data }) => {
                        console.log('got data', data);
                        toast.success(t('organization.holiday.locations.added_to_holiday'), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                      }).catch((error) => {
                        toast.error((t('general.toast_server_error')) +  error, {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        console.log('there was an error sending the query', error);
                      })
                      }}>
                        <Icon prefix="fe" name="plus-circle" /> { ' ' }
                        {t('organization.holiday.locations.add_to_holiday')} 
                      </Button>
                    </Table.Col>
                    :
                    // Delete
                    <Table.Col className="text-right text-red" key={v4()}>
                      <Button color="link"
                        size="sm"
                        title={t('organization.holiday.locations.delete_from_holiday')} 
                        href=""
                        onClick={() => {
                          console.log("clicked delete")
                          console.log(node.id)
                          let locationId = node.id
                          deleteLocationFromHoliday({ variables: {
                            input: {
                              organizationHoliday: holidayId,
                              organizationLocation: locationId
                            }
                      }, refetchQueries: [
                          {query: GET_HOLIDAY_LOCATIONS_QUERY, variables: {"id": holidayId }}
                      ]}).then(({ data }) => {
                        console.log('got data', data);
                        toast.success(t('organization.holiday.locations.deleted_from_holiday'), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                      }).catch((error) => {
                        toast.error((t('general.toast_server_error')) +  error, {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        console.log('there was an error sending the query', error);
                      })
                      }}>
                        <Icon prefix="fe" name="minus-circle" /> { ' ' }
                        {t('organization.holiday.locations.delete_from_holiday')}
                      </Button>
                    </Table.Col>
                    }
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Card>
    </OrganizationHolidaysBase>
  )
}

export default withTranslation()(withRouter(OrganizationHolidayEditLocations))