import React from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import {
  Icon,
} from "tabler-react";


const confirm_action = ({t, msgConfirm, msgDescription, msgSuccess, actionFunction, functionVariables}) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>{t('general.confirm')}</h1>
            {msgConfirm}
            {msgDescription}
            <button className="btn btn-link pull-right" onClick={onClose}>{t('general.confirm_action_no')}</button>
            <button
              className="btn btn-success"
              onClick={() => {
                actionFunction(functionVariables)
                  .then(({ data }) => {
                    console.log('got data', data);
                    toast.success(
                      msgSuccess, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error);
                  })
                onClose()
              }}
            >
              <Icon name="check" /> {t('general.confirm_action_yes')}
            </button>
          </div>
        )
      }
    })
  }

export default confirm_action
