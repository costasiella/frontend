import { gql } from "@apollo/client"


export const GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY = gql`
  query ScheduleEventEarlybirds($before:String, $after:String, $scheduleEvent:ID!) {
    scheduleEventSubscriptionGroupDiscounts(first: 100, before:$before, after:$after, scheduleEvent:$scheduleEvent) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          scheduleEvent {
            id
          }
          organizationSubscriptionGroup {
            id
            name
          }
          discountPercentage
        }
      }
    }
  }
`


export const GET_INPUT_VALUES_QUERY = gql`
  query OrganizationSubscriptionGroups {
    organizationSubscriptionGroups(first: 1000) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
        }
      }
    }
  }
`


export const GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_QUERY = gql`
  query ScheduleEventSubscriptionGroupDiscount($id:ID!) {
    scheduleEventSubscriptionGroupDiscount(id: $id) {
      id
      discountPercentage
      organizationSubscriptionGroup {
        id
        name
      }
    }
    organizationSubscriptionGroups(first: 1000) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
        }
      }
    }
  }
`


export const ADD_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT = gql`
  mutation CreateScheduleEventSubscriptionGroupDiscount($input:CreateScheduleEventSubscriptionGroupDiscountInput!) {
    createScheduleEventSubscriptionGroupDiscount(input: $input) {
      scheduleEventSubscriptionGroupDiscount {
        id
      }
    }
  }
`


export const UPDATE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT = gql`
  mutation UpdateScheduleEventSubscriptionGroupDiscount($input:UpdateScheduleEventSubscriptionGroupDiscountInput!) {
    updateScheduleEventSubscriptionGroupDiscount(input: $input) {
      scheduleEventSubscriptionGroupDiscount {
        id
      }
    }
  }
`


export const DELETE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT   = gql`
  mutation DeleteScheduleEventSubscriptionGroupDiscount($input: DeleteScheduleEventSubscriptionGroupDiscountInput!) {
    deleteScheduleEventSubscriptionGroupDiscount(input: $input) {
      ok
    }
  }
`
