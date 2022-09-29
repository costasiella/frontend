import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  Card
} from "tabler-react"


function CSStoreCard({ t, title, subtitle, price, imgUrl, imgAlt, buttonText, buttonUrl }) {
  return (
      <Card>
        <Card.Body>
          <div className='mb-4 text-center'>
            <img src={imgUrl} alt={imgAlt} />
          </div>
          <Card.Title>{title}</Card.Title>
          <Text className="card-subtitle">{subtitle}</Text>

          <div classname="mt-5 d-flex align-items-center">
            <div className="product-price">
              <strong>{price}</strong>
            </div>
            <div className="ml-auto">
              <Link to={buttonUrl}>
                <Button color="primary">
                  <Icon prefix="fe" name="plus" />
                  {buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
    </Card>
  )
}

export default withTranslation()(CSStoreCard)
