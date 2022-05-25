
import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import moment from 'moment'

import {
  Dimmer,
  Grid,
  Card,
  Table,
} from "tabler-react"

import { GET_INSIGHT_ACCOUNTS_INACTIVE } from './queries'
import AppSettingsContext from '../../context/AppSettingsContext'
import InsightInactiveAccountsViewBase from './InsightInactiveAccountsViewBase'


function InsightInactiveAccountsView({ t, history, match }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment
  const id = match.params.id

  const { loading, error, data } = useQuery(GET_INSIGHT_ACCOUNTS_INACTIVE, {
    variables: { id: id }
  })
  // const [updateFinancePaymentBatch] = useMutation(UPDATE_PAYMENT_BATCH)

  // Loading
  if (loading) return (
    <InsightInactiveAccountsViewBase>
      <Card title={t("insight.inactive_accounts.card_title")}>
        <Card.Body>
          <Dimmer active={true} loader={true}/>
        </Card.Body>
      </Card>
    </InsightInactiveAccountsViewBase>
  )
  // Error
  if (error) return (
    <InsightInactiveAccountsViewBase>
      <p>{t('insight.inactive_accounts.error_loading')}</p>
    </InsightInactiveAccountsViewBase>
  )

  const insightAccountInactive = data.insightAccountInactive
  console.log(insightAccountInactive)
  const cardTitle = t("insight.inactive_accounts.card_title") + " " + moment(insightAccountInactive.noActivityAfterDate).format(dateFormat)
  const subTitle = t("general.generated on") + " " + moment(insightAccountInactive.createdAt).format(dateTimeFormatMoment)

  if (!insightAccountInactive.accounts.edges.length) return (
    <InsightInactiveAccountsViewBase subTitle={subTitle}>
      <Card title={cardTitle}>
        <Card.Body>
          {t("insight.inactive_accounts.accounts.empty_list")}
        </Card.Body>
      </Card>
    </InsightInactiveAccountsViewBase>
  )

  return (
    <InsightInactiveAccountsViewBase subTitle={subTitle}>
      <Grid.Row>
        <Grid.Col>
          <Card title={cardTitle}>
            {/* <Card.Alert color="primary">
              {t("insight.inactive_accounts.explanation_when_inactive")}
            </Card.Alert> */}
            <small>
              <Table cards >
                <Table.Header>
                  <Table.Row>
                    <Table.ColHeader>
                      {t("general.name")}
                    </Table.ColHeader>
                    <Table.ColHeader>
                      {t("general.email")}
                    </Table.ColHeader>
                    <Table.ColHeader>
                      {t("general.last_login")}
                    </Table.ColHeader>
                    <Table.ColHeader>
                      {t("general.created_at")}
                    </Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {insightAccountInactive.accounts.edges.map(({ node }, index) => (
                    <Table.Row>
                      <Table.Col>
                        {
                          <Link to={`/relations/accounts/${node.account.id}/profile`}>
                            {node.account.fullName}
                          </Link>
                        }
                      </Table.Col>
                      <Table.Col>
                        {node.account.email}
                      </Table.Col>
                      <Table.Col>
                        {moment(node.account.lastLogin).format(dateTimeFormatMoment)}
                      </Table.Col>
                      <Table.Col>
                        {moment(node.account.createdAt).format(dateTimeFormatMoment)}
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </small>
          </Card>
        </Grid.Col>
      </Grid.Row>
      {/* <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ name: '', description: '', executionDate: new Date() }}
          // validationSchema={PAYMENT_BATCH_CATEGORY_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            let input = {
                batchType: batchType.toUpperCase(),
                name: values.name, 
                executionDate: dateToLocalISO(values.executionDate),
                description: values.description,
                note: values.note,
                includeZeroAmounts: values.includeZeroAmounts
            }

            if (categoryType == "category") {
              input.year = values.year
              input.month = values.month
              input.financePaymentBatchCategory = values.financePaymentBatchCategory
            }

            addFinancePaymentBatch({ 
              variables: { input: input }, 
              refetchQueries: [
                {query: GET_PAYMENT_BATCHES_QUERY, variables: get_list_query_variables(batchType)}
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                toast.success((t('finance.payment_batches.toast_add_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
          }}
          >
          {({ isSubmitting, errors, values, setFieldValue, setFieldTouched }) => (
              <FinancePaymentCollectionBatchForm
                inputValues={inputValues}
                create={true}
                invoices={invoices}
                category={category}
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                returnUrl={returnUrl}
              />
          )}
        </Formik>
      </Card> */}
    </InsightInactiveAccountsViewBase>
  )
}

export default withTranslation()(withRouter(InsightInactiveAccountsView))