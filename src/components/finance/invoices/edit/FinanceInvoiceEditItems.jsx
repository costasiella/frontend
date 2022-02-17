import React, { useState } from 'react'
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify'

import {
  Card,
  Dimmer, 
  Grid, 
} from "tabler-react"

import FinanceInvoiceItemAdd from "./FinanceInvoiceItemAdd"
import { GET_INVOICE_QUERY } from '../queries'

import FinanceInvoiceItemEdit from './FinanceInvoiceItemEdit'


export const UPDATE_INVOICE_ITEM = gql`
  mutation UpdateFinanceInvoiceItem($input: UpdateFinanceInvoiceItemInput!) {
    updateFinanceInvoiceItem(input: $input) {
      financeInvoiceItem {
        id
      }
    }
  }
`

function FinanceInvoiceEditItems ({ t, history, match, refetchInvoice, inputData }) {
  const [ updateItem ] = useMutation(UPDATE_INVOICE_ITEM)
  const [ updating, setUpdating ] = useState(false)

  const updateLineNumber = ({ node_id, line_number }) => {
    setUpdating(true)
    updateItem({ 
      variables: { 
        input: {
          id: node_id,
          lineNumber: line_number
        } 
      },
      refetchQueries: [
        { query: GET_INVOICE_QUERY, variables: { id: inputData.financeInvoice.id }}
      ]
    }).then(({ data }) => {
      console.log('got data', data)
      toast.success((t('finance.invoice.saved_item_sorting')), {
          position: toast.POSITION.BOTTOM_RIGHT
      })
      setTimeout(() => setUpdating(false), 125)
    }).catch((error) => {
      toast.error((t('general.toast_server_error')) +  error, {
          position: toast.POSITION.BOTTOM_RIGHT
      })
      console.log('there was an error sending the query', error)
      setTimeout(() => setUpdating(false), 125)
    })
  }

  const onDragEnd = (result) => {
    // the only one that is required
    console.log('onDragEnd triggered...')
    console.log(result)
    const { draggableId, destination, source, reason } = result
    console.log(source)
    console.log(destination)
    console.log(reason)

    // Nothing to do, nowhere to go...
    console.log("drop cancelled...")
    if (!destination || reason === 'CANCEL') {
      return
    }

    // Moved back to the same spot
    console.log("dropped to the same spot")
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    updateLineNumber({
      node_id: draggableId,
      line_number: destination.index
    })
  }
  // const onDragEnd = useCallback((result) => {
  //   // the only one that is required
  //   console.log('onDragEnd triggered...')
  //   console.log(result)
  //   const { draggableId, destination, source, reason } = result
  //   console.log(source)
  //   console.log(destination)
  //   console.log(reason)

  //   // Nothing to do, nowhere to go...
  //   console.log("drop cancelled...")
  //   if (!destination || reason === 'CANCEL') {
  //     return
  //   }

  //   // Moved back to the same spot
  //   console.log("dropped to the same spot")
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return
  //   }

  //   updateLineNumber({
  //     node_id: draggableId,
  //     line_number: destination.index
  //   })
  // }, []);


  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <Card statusColor="blue">
        <Card.Header>
          <Card.Title>{t('general.items')}</Card.Title>
          <Card.Options>
            <FinanceInvoiceItemAdd />
          </Card.Options>
        </Card.Header>
        <Card.Body>
          <Dimmer active={updating} loader={updating}>
              <Grid.Row className="cs-grid-table-header">
                <Grid.Col md={3} className="cs-grid-table-cell">{t("general.product")}</Grid.Col>
                <Grid.Col md={3} className="cs-grid-table-cell">{t("general.description")}</Grid.Col>
                <Grid.Col md={2} className="cs-grid-table-cell">{t("general.quantity_short_and_price")}</Grid.Col>
                <Grid.Col md={2} className="cs-grid-table-cell">{t("general.tax")}</Grid.Col>
                <Grid.Col md={1} className="cs-grid-table-cell"><span className="float-right">{t("general.total")}</span></Grid.Col>
                <Grid.Col md={1} className="cs-grid-table-cell"></Grid.Col>
              </Grid.Row>
              <Droppable droppableId="invoice_items">
                {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef} 
                      {...provided.droppableProps} 
                    >
                      {inputData.financeInvoice.items.edges.map(({ node }, idx) => (
                        <Draggable 
                          draggableId={node.id}
                          index={idx}
                          key={node.id}
                        >
                          {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                index={node.lineNumber}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                >
                                <FinanceInvoiceItemEdit initialValues={node} inputData={inputData} node={node} />
                              </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                )}
              </Droppable>
          </Dimmer>
        </Card.Body>
      </Card>
    </DragDropContext>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceEditItems))