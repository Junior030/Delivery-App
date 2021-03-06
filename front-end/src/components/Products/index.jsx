import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import contextValue from "../../context/context";
import Utils from "../../utils/functions/index";
import "./products.css";
import { ButtonGroup, Button, Card } from "react-bootstrap";

function Product({ product, setTotalPrice }) {
  const { urlImage, id, name, price } = product;
  const { setCart } = useContext(contextValue);
  const [quantity, setQuantity] = useState(0);

  const setCartManual = (operation) => {
    let local = Utils.getLocalStorage("carrinho") || [];

    const getItem = local.find((car) => id === car.productId);
    if (getItem) {
      getItem.subTotal = Utils.removeMaskNumber(getItem.subTotal);
      getItem.unitPrice = Utils.removeMaskNumber(getItem.unitPrice);
      getItem.quantity = operation;
      getItem.subTotal = operation * getItem.unitPrice;
      getItem.subTotal = Utils.putMaskNumber(getItem.subTotal);
      getItem.unitPrice = Utils.putMaskNumber(getItem.unitPrice);
      local = local.map((prod) => (prod.productId === id ? getItem : prod));
    } else {
      const newObj = {
        productId: id,
        name,
        quantity: operation,
        unitPrice: Utils.putMaskNumber(+price),
        subTotal: Utils.putMaskNumber(operation * +price),
      };
      local = [...local, newObj];
    }
    Utils.setLocalStorage(
      "carrinho",
      local.filter((prod) => prod.quantity !== 0)
    );
    setCart(local);
  };

  useEffect(() => {
    setQuantity(() => {
      const carr = Utils.getLocalStorage("carrinho");
      const idCarr =
        carr && carr.length ? carr.find((x) => x.productId === id) : false;
      return idCarr && idCarr !== quantity ? idCarr.quantity : 0;
    });
    setTotalPrice();
  }, [id, quantity, setTotalPrice]);

  const increment = () => {
    setQuantity((prevQuantity) => {
      const currentQuantity = prevQuantity + 1;
      setCartManual(currentQuantity);
      return currentQuantity;
    });
  };

  const decrement = () => {
    if (quantity !== 0) {
      setQuantity((prevQuantity) => {
        const currentQuantity = prevQuantity - 1;
        setCartManual(currentQuantity);
        return currentQuantity;
      });
    }
  };
  const inputValue = (event) => {
    const { value } = event.target;
    setQuantity(+value);
    setCartManual(+value);
  };

  return (
    <Card className="containerCard mt-5">
      <div className="containerDescription">
        <Card.Title data-testid={ `customer_products__element-card-title-${id}` }>
          {name}
        </Card.Title>
        <Card.Img
          data-testid={ `customer_products__img-card-bg-image-${id}` }
          src={ urlImage }
          alt={ name }
        />
        <Card.Body>
          <div>
            <h4 data-testid={ `customer_products__element-card-price-${id}` }>
              {`R$ ${Utils.putMaskNumber(Number(price))}`}
            </h4>
          </div>
          <ButtonGroup className="containerInput">
            <Button
              type="button"
              data-testid={ `customer_products__button-card-rm-item-${id}` }
              onClick={ () => decrement() }
            >
              -
            </Button>
            <input
              type="text"
              className="form-control"
              id={ `inputQuantity-${id}` }
              data-testid={ `customer_products__input-card-quantity-${id}` }
              onChange={ (e) => inputValue(e) }
              value={ quantity }
            />
            <Button
              type="button"
              data-testid={ `customer_products__button-card-add-item-${id}` }
              onClick={ () => increment() }
            >
              +
            </Button>
          </ButtonGroup>
        </Card.Body>
      </div>
    </Card>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    urlImage: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,

  setTotalPrice: PropTypes.func.isRequired,
};

export default Product;
