import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import ShopClassBookedBase from "./ShopClassBookedBase"
import { GET_CLASS_QUERY } from "../../queries"
import { DisplayClassInfo } from "../../tools"


function ShopClassBook({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const { loading, error, data } = useQuery(
    GET_CLASS_QUERY, {
      variables: {
        scheduleItemId: schedule_item_id,
        date: class_date,
      }
    }
  )

  // Loading
  if (loading) return (
    <ShopClassBookedBase>
      <Dimmer active={true} loader={true} />
    </ShopClassBookedBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <ShopClassBookedBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ShopClassBookedBase>
    )
  }
  
  console.log(data)
  // TODO: display class info in a card

  
  return (
    <ShopClassBookedBase>
      <Grid.Row cards deck>
        <Grid.Col xs={12} sm={12} md={6} lg={6}>
          <Card title={t("shop.classes.booked.class")}>
            <Card.Body>
              {t("shop.classes.booked.class_explanation")} <br /><br />
              <DisplayClassInfo 
                t={t} 
                classDate={class_date}
                classData={data.scheduleClass} 
                dateFormat={dateFormat} 
                timeFormat={timeFormat}
              />
            </Card.Body>
            <Card.Footer>
              <Link to={"/shop/account"}>
                <Button
                  outline
                  block
                  color="success"
                >
                  {t("shop.classes.booked.to_profile")} <Icon name="chevron-right" />
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </ShopClassBookedBase>
  )
}


export default withTranslation()(withRouter(ShopClassBook))

