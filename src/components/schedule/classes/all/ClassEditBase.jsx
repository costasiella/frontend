// @flow

import React, { Component } from 'react'
import { t } from 'i18next'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { TimeStringToJSDateOBJ } from '../../../../tools/date_tools'

import {
  Page,
  Grid,
  Card,
  Container,
} from "tabler-react"
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import { GET_CLASS_QUERY } from "../queries"

import ClassEditMenu from './ClassEditMenu'
import ClassEditBack from './ClassEditBack'
import ClassEditBaseBase from './ClassEditBaseBase'
import { class_edit_all_subtitle } from "./tools"


function ClassEditBase({t, match, children, menuActiveLink="", defaultCard=true, sidebarButton="", cardTitle=""}) {
  const classId = match.params.class_id
  const { loading, error, data } = useQuery(GET_CLASS_QUERY, { variables: {
    id: classId
  }})

  if (!cardTitle) {
    cardTitle = t('schedule.classes.title_edit')
  }

  if (loading) return (
    <ClassEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      sidebarButton={sidebarButton}
      menuActiveLink={menuActiveLink}
    >
      <p>{t('general.loading_with_dots')}</p>
    </ClassEditBaseBase>
  )

  if (error) return (
    <ClassEditBaseBase 
      cardTitle={cardTitle}
      defaultCard={true}
      sidebarButton={sidebarButton}
      menuActiveLink={menuActiveLink}
    >
      {console.log(error)}
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBaseBase>
  )

  console.log('query data')
  console.log(data)
  const initialValues = data.scheduleItem

  const initialTimeStart = TimeStringToJSDateOBJ(initialValues.timeStart)
  const subTitle = class_edit_all_subtitle({
    t: t,
    location: initialValues.organizationLocationRoom.organizationLocation.name,
    locationRoom: initialValues.organizationLocationRoom.name,
    classtype: initialValues.organizationClasstype.name,
    starttime: initialTimeStart
  })

  return (
    <ClassEditBaseBase 
      subTitle={subTitle}
      cardTitle={cardTitle}
      sidebarButton={sidebarButton}
      defaultCard={defaultCard}
      menuActiveLink={menuActiveLink}
    >
      {children}
    </ClassEditBaseBase>
  )

}


// class ClassEditBase extends Component {
//   constructor(props) {
//     super(props)
//     console.log("Schedule class edit add props:")
//     console.log(props)
//   }

//   render() {
//     const t = this.props.t
//     const match = this.props.match
//     const classId = match.params.class_id
//     const menu_activeLink = this.props.menu_activeLink
//     const default_card = this.props.default_card
//     const sidebar_button = this.props.sidebar_button

//     return (
//       <Query query={GET_CLASS_QUERY} variables = {{id: classId, archived: false}} >
//         {({ loading, error, data, refetch }) => {
//           // Loading
//           if (loading) return (
//             <p>{t('general.loading_with_dots')}</p>
//           )
//           // Error
//           if (error) {
//             console.log(error)
//             return (
//               <p>{t('general.error_sad_smiley')}</p>
//             )
//           }
          
//           console.log('query data')
//           console.log(data)
//           const initialValues = data.scheduleItem

//           const initialTimeStart = TimeStringToJSDateOBJ(initialValues.timeStart)
//           const subtitle = class_edit_all_subtitle({
//             t: t,
//             location: initialValues.organizationLocationRoom.organizationLocation.name,
//             locationRoom: initialValues.organizationLocationRoom.name,
//             classtype: initialValues.organizationClasstype.name,
//             starttime: initialTimeStart
//           })
          
//           return (
//             <Container>
//               <Page.Header 
//                 title={t("schedule.title")} 
//                 subTitle={subtitle}
//               >
//                 <ClassEditBack />
//               </Page.Header>
//               <Grid.Row>
//                 <Grid.Col md={9}>
//                   {!default_card ? this.props.children :
//                     <Card>
//                       <Card.Header>
//                         <Card.Title>{this.props.card_title}</Card.Title>
//                       </Card.Header>
//                       <Card.Body>
//                         {this.props.children}
//                       </Card.Body>
//                     </Card>
//                   }
//                 </Grid.Col>
//                 <Grid.Col md={3}>
//                   {sidebar_button}
//                   <h5>{t('general.menu')}</h5>
//                   <ClassEditMenu activeLink={menu_activeLink} classId={classId}/>
//                 </Grid.Col>
//               </Grid.Row>
//             </Container>
//           )
//         }}
//       </Query>
// )}}

// ClassEditBase.defaultProps = {
//   default_card: true,
//   sidebar_button: "",
//   card_title: t('schedule.classes.title_edit')
// }


export default withTranslation()(withRouter(ClassEditBase))