import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, imageUrl, brand, price, rating} = productDetails
  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        className="similar-product-img"
        alt="similar product"
      />
      <h1 className="title">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="price">Rs {price}/- </p>
        <div className="rating-review-container">
          <div className="rating-star-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="rating-star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
