import { gql } from "@apollo/client"


export const GET_INSIGHT_CLASSPASSES_QUERY = gql`
query InsightAccountClasspasses($year: Int!) {
  insightAccountClasspasses(year: $year) {
    year
    months {
      month
      sold
      active
    }
  }
}
`
