import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: [],
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductSpecificDetails()
  }

  getFormattedData = fetchedData => ({
    availability: fetchedData.availability,
    brand: fetchedData.brand,
    description: fetchedData.description,
    imageUrl: fetchedData.image_url,
    price: fetchedData.price,
    rating: fetchedData.rating,
    style: fetchedData.style,
    title: fetchedData.title,
    totalReviews: fetchedData.total_reviews,
  })

  getProductSpecificDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProducts: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickIncreaseQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onClickDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderSimilarProductDetails = () => {
    const {similarProducts} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.title}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetailsView = () => {
    const {productData, quantity} = this.state

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      title,
      rating,
      totalReviews,
    } = productData

    return (
      <div className="product-details-container">
        <img src={imageUrl} className="product-image-style" alt="product" />
        <div className="product-details-content">
          <h1 className="product-title">{title}</h1>
          <p className="product-price">Rs {price}/- </p>
          <div className="rating-review-container">
            <div className="rating-star-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="rating-star"
              />
            </div>
            <p className="review">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <p className="availability">
            Available:
            <p className="available-status"> {availability}</p>
          </p>
          <p className="brand">
            Brand:
            <p className="brand-name"> {brand}</p>
          </p>
          <hr className="separator" />
          <div className="quantity-container">
            <button
              type="button"
              className="btn-quantity"
              onClick={this.onClickDecreaseQuantity}
              testid="minus"
            >
              <BsDashSquare className="icons-quantity" />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              type="button"
              className="btn-quantity"
              onClick={this.onClickIncreaseQuantity}
              testid="plus"
            >
              <BsPlusSquare className="icons-quantity" />
            </button>
          </div>
          <button type="button" className="btn-add-cart">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-image"
        alt="failure view"
      />
      <h1 className="not-found-text">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="btn-continue-shopping">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
          {this.renderSimilarProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
