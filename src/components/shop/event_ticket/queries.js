import { gql } from "@apollo/client"


export const GET_SCHEDULE_EVENT_TICKET_QUERY = gql`
  query ScheduleEventTicket($id: ID!) {
    scheduleEventTicket(id:$id) {
      id
      name
      price
      priceDisplay
      totalPrice
      totalPriceDisplay
      description
      isSoldOut
      isEarlybirdPrice
      isSubscriptionDiscountPrice
      ticketScheduleItems(included: true, orderBy: "date_start") {
        pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        }
        edges {
          node {
            id
            included
            scheduleItem {
              name
              dateStart
              timeStart
              timeEnd
              organizationLocationRoom {
                organizationLocation {
                  name
                }
              }
            }
          }
        }
      }
      scheduleEvent {
        id
        name
      }
    }
  }
`
