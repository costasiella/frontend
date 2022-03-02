import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { v4 } from 'uuid'

import {
  Card,
  Icon,
  Table,
} from "tabler-react";

import { GET_ORDER_QUERY } from "../queries"
import ShopCheckoutClassInfo from "../class_info/ShopCheckoutClassInfo"


function ShopCheckoutOrderSummary({ t, id, complete=false }) {
  const { loading, error, data } = useQuery(GET_ORDER_QUERY, {
    variables: { id: id }
  })

  if (loading) return (
      t("general.loading_with_dots")
  )
  if (error) return (
      t("shop.checkout.order_summary.error_loading")
  )

  const order = data.financeOrder
  const orderItems = order.items.edges

  let classDate 
  let scheduleItemId
  let item
  for (item of orderItems) {
    let node = item.node
    if (node.scheduleItem) {
      classDate = node.attendanceDate
      scheduleItemId = node.scheduleItem.id
    }
  }


  return (
    <Card title={t("shop.checkout.payment.order_summary")}>
      <div className="table-responsive">
        <Table cards={true}>
          <Table.Header>
            <Table.Row>
              <Table.ColHeader>{t('general.item')}</Table.ColHeader>
              <Table.ColHeader className="text-right">{t('general.price')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orderItems.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {node.productName} <br /> 
                  <span className="text-muted">
                    {node.description}
                  </span>
                </Table.Col>
                <Table.Col className="text-right">{node.totalDisplay}</Table.Col>
              </Table.Row>      
            ))}
            <Table.Row className="bold">
              <Table.Col>
                {t("general.total")}
              </Table.Col>
              <Table.Col className="text-right">
                  {order.totalDisplay}
              </Table.Col>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      {(order.message) || (scheduleItemId && classDate) ? 
        <Card.Body>
          {(order.message) ?
            <span className="text-muted">
              <h5><Icon name="message-square" /> {t("shop.checkout.order_summary.message")}</h5> 
              {/* Order message */}
              {order.message}
              <br /><br />
            </span> 
            : ""
          }
          {(scheduleItemId && classDate) ?
            <ShopCheckoutClassInfo 
              scheduleItemId={scheduleItemId}
              date={classDate}
              complete={complete}
            />
            : ""
          }
        </Card.Body>
        : ""
      }
    </Card>
  )
}


export default withTranslation()(withRouter(ShopCheckoutOrderSummary))
