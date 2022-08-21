import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { v4 } from 'uuid'
import DOMPurify from 'dompurify'
import moment from 'moment'
import {
  Badge,
  Button,
  Card,
  Grid,
  Icon
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import { capitalize } from "../../../tools/string_tools"
import { represent_class_status, get_class_messages } from '../../schedule/classes/tools'
import HasPermissionWrapper from '../../HasPermissionWrapper'
import GET_USER_PROFILE from "../../../queries/system/get_user_profile"
import { GET_BACKEND_ANNOUNCEMENTS_QUERY } from "./queries"
import HomeHomeBase from './HomeHomeBase';


function HomeHome({ t, match }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  // Chain queries. First query user data and then query class attendance for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(GET_BACKEND_ANNOUNCEMENTS_QUERY, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      instructor: dataUser && dataUser.user ? dataUser.user.accountId : null,
      dateFrom: moment().format('YYYY-MM-DD'),
      dateUntil: moment().add(2, 'days').format('YYYY-MM-DD'),
      attendanceCountType: "ATTENDING_AND_BOOKED",
      orderBy: "starttime"
    },
    fetchPolicy: "network-only"
  })

  if (loading || loadingUser ) return (
    <HomeHomeBase>
      {t("general.loading_with_dots")}
    </HomeHomeBase>
  )
  if (error || errorUser ) return (
    <HomeHomeBase>
      {t("home.home.announcements.error_loading")}
    </HomeHomeBase>
  )

  const announcements = data.organizationAnnouncements

  // Empty list
  if (!announcements.edges.length) return (
    <HomeHomeBase>
      {t("home.home.announcements_empty_list")}
    </HomeHomeBase>
  )

  console.log(data)
  let upcomingClasses = false

  { data.scheduleClasses.map(({ classes }) => {
    if (classes.length) {
      upcomingClasses = true
    }
  })}
    

  // Data
  return (
    <HomeHomeBase>
      <h4>{t("organization.announcements.title")}</h4>
      <Grid.Row cards deck>
        {(announcements.edges.length) ? announcements.edges.map(({ node }) => (
          <Grid.Col md={6} key={v4()}>
            <Card title={node.title}>
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(node.content) }}></div>
              </Card.Body>
            </Card> 
          </Grid.Col>
        )) : ""
        }
      </Grid.Row>
      
      { upcomingClasses && <React.Fragment>
        <h4>{t("organization.home.upcoming_classes.title")}</h4>
          { data.scheduleClasses.map(({ date, classes }) => (
            !classes.length ? "" : <React.Fragment key={v4()}>
              <h5>
                {capitalize(moment(date).format("dddd"))} {' '}
                <small className="text-muted">
                      {moment(date).format("LL")} 
                </small>
              </h5>
              {classes.map((
                { scheduleItemId, 
                  frequencyType,
                  date, 
                  status,
                  holiday,
                  holidayName,
                  description,
                  organizationLocationRoom, 
                  organizationClasstype, 
                  organizationLevel,
                  timeStart, 
                  timeEnd,
                  spaces,
                  countAttendance }) => (
                    <Card key={v4()}>
                      <Card.Body>
                        <Grid.Row>
                          <Grid.Col xs={9} sm={9} md={10}>
                            <Grid.Row>
                              <Grid.Col xs={12}>
                                <h5>
                                  {represent_class_status(status)}
                                  <span className='mr-2'>
                                  {/* Class type */}
                                  {organizationClasstype.name} { ' ' }
                                  {/* Start & end time */}
                                  {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                  {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                                  </span>
                                  {organizationLevel && <small className="text-muted">
                                    {organizationLevel.name}
                                  </small>}
                                </h5>
                              </Grid.Col>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Col xs={12}>
                                {/* Location */}
                                <Icon name="home" /> {organizationLocationRoom.organizationLocation.name} 
                                <small className="text-muted"> | {organizationLocationRoom.name}</small>
                              </Grid.Col>
                            </Grid.Row>
                          </Grid.Col>
                          <Grid.Col xs={3} sm={3} md={2}>
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                              <Link className="float-right" to={'/schedule/classes/class/attendance/' + scheduleItemId + '/' + date}>
                                <Button
                                  size="sm"
                                  color="secondary"
                                  icon="check-circle"
                                >
                                    {t("general.attendance")}
                                </Button>
                              </Link>
                            </HasPermissionWrapper>
                          </Grid.Col>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Col xs={9} sm={9} md={10}>
                            <div className="mt-1">
                              {/* <BadgePublic className="mr-2" isPublic={displayPublic} /> */}
                              {(frequencyType === 'SPECIFIC') ? 
                                <Badge color="primary" className="mr-2">{t('general.once')}</Badge> : 
                                null } 
                              {(frequencyType === 'LAST_WEEKDAY_OF_MONTH') ? 
                                <Badge color="success" className="mr-2">{t('general.monthly')}</Badge> : 
                                null } 
                              {(status === "CANCELLED") ? 
                                <Badge color="warning" className="mr-2">{t('general.cancelled')}</Badge> : 
                                null } 
                                <small className="text-muted"><br />{get_class_messages(t, status, description, holiday, holidayName)}</small>
                            </div>
                          </Grid.Col>
                          <Grid.Col xs={3} sm={3} md={2}>
                            {/* Attendance */}
                            <small className='float-right mt-1'><Icon name="users" /> {countAttendance}/{spaces}</small>
                          </Grid.Col>
                        </Grid.Row>
                      </Card.Body>
                    </Card>
                  )
                )}
            </React.Fragment >
          ))}
        </React.Fragment> 
      }  {/* End upcoming classes check */}
    </HomeHomeBase>
  )
}


// class HomeHome extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Home home props:")
//     console.log(props)
//   }


//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const history = this.props.history
//     const id = match.params.id

//     return (
//       <SiteWrapper>
//         <div className="my-3 my-md-5">
//           <Container>
//             <Page.Header title={t("home.title")} />
//             <Grid.Row>
//               <Grid.Col md={9}>
//               <Card>
//                 <Card.Header>
//                   <Card.Title>{t('home.title')}</Card.Title>
//                 </Card.Header>
//                 <Card.Body>
//                     Hello world!
//                 </Card.Body>
//               </Card>
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         </div>
//     </SiteWrapper>
//     )}
//   }


export default withTranslation()(withRouter(HomeHome))