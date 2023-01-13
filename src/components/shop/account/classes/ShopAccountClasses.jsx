import React, { useContext } from 'react'
import { useQuery, } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"
import { Link } from 'react-router-dom'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'
import BadgeBookingStatus from '../../../ui/BadgeBookingStatus'

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
} from "tabler-react"

import LoadMoreOnBottomScroll from "../../../general/LoadMoreOnBottomScroll"
import { GET_ACCOUNT_CLASSES_QUERY } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"

import ShopAccountClassesBase from "./ShopAccountClassesBase"


function ShopAccountClasses({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  // Chain queries. First query user data and then query class attendance for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_CLASSES_QUERY, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    },
    fetchPolicy: "network-only"
  })
  // TODO: add cancel class button & query
  // const [ updateOrder ] = useMutation(UPDATE_ORDER)

  if (loading || loadingUser || !data) return (
    <ShopAccountClassesBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountClassesBase>
  )
  if (error || errorUser) return (
    <ShopAccountClassesBase>
      {t("shop.account.classes.error_loading_data")}
    </ShopAccountClassesBase>
  )

  const user = dataUser.user
  const scheduleItemAttendances = data.scheduleItemAttendances

  // Empty list
  if (!scheduleItemAttendances.edges.length) {
    return (
      <ShopAccountClassesBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.classes.title')} >
              <Card.Body>
                {t('shop.account.classes.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </ShopAccountClassesBase>
    )  
  }


  // Populated list
  return (
    <ShopAccountClassesBase accountName={user.fullName}>
      <h4>{t("shop.account.classes.title")}</h4>
      <LoadMoreOnBottomScroll
        // headerContent={headerOptions}
        pageInfo={scheduleItemAttendances.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: scheduleItemAttendances.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.scheduleItemAttendances.edges
              const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo

              return newEdges.length
                ? {
                    // Put the new subscriptions at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    scheduleItemAttendances: {
                      __typename: previousResult.scheduleItemAttendances.__typename,
                      edges: [ ...previousResult.scheduleItemAttendances.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} >
          {/* <Grid.Row> */}
          { scheduleItemAttendances.edges.map(({ node }) => (
            <Card key={v4()}>
              <Card.Body>
                <Grid.Row>
                  <Grid.Col xs={12} md={10}>
                    <div className='mb-xs-3'>
                      <h6>
                        { node.scheduleItem.organizationClasstype.name }
                        <span className='float-xs-right'> <BadgeBookingStatus status={node.bookingStatus} /></span>
                      </h6>
                      <Icon name="clock" /> { moment(node.date).format(dateFormat) } { " " }
                      <span className="text-muted">
                        {moment(node.date + ' ' + node.scheduleItem.timeStart).format(timeFormat)}
                      </span><br />
                      <Icon name="home" /> { node.scheduleItem.organizationLocationRoom.organizationLocation.name } { " " }
                      <span className="text-muted">
                        { node.scheduleItem.organizationLocationRoom.name }
                      </span> 
                    </div>
                  </Grid.Col>
                  <Grid.Col xs={12} md={2}>
                    {(node.bookingStatus !== "CANCELLED") ?
                      <Link to={`/shop/account/class_info/${node.scheduleItem.id}/${node.date}`}>
                        <Button 
                          block
                          outline
                          color="info"
                          size="sm"
                          className=""
                          >
                          {t("general.info")}
                        </Button>
                      </Link>
                      : ""
                    }
                    {((node.bookingStatus !== "CANCELLED") && node.cancellationPossible) ?  
                      <Link to={`/shop/account/class_cancel/${node.scheduleItem.id}/${node.date}/${node.id}`}>
                        <Button 
                          block
                          outline
                          color="warning"
                          size="sm"
                          className="mt-3"
                          >
                          {t("general.cancel")}
                        </Button>
                      </Link>
                      : (node.uncancellationPossible) ? 
                        <Link to={`/shop/account/class_uncancel/${node.scheduleItem.id}/${node.date}/${node.id}`}>
                          <Button 
                            block
                            outline
                            color="primary"
                            size="sm"
                            className="mt-3"
                            >
                            {t("general.book")}
                          </Button>
                        </Link>
                      : ""
                    }
                  </Grid.Col>
                </Grid.Row>
              </Card.Body>
            </Card>
          ))}
      </LoadMoreOnBottomScroll>
    </ShopAccountClassesBase>
  )
}


export default withTranslation()(withRouter(ShopAccountClasses))