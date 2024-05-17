import React, { useEffect, useState } from "react";
import "./style.css";

const LoadMoreButton = () => {
  const [productsData, setProductsData] = useState([]);
  const [noOfClicks, setNoOfClicks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const fetchProductsData = async function () {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${
          noOfClicks === 0 ? 0 : noOfClicks * 20
        }`
      );
      if (!response.ok) {
        throw new Error("Data is not available.");
      }
      const result = await response.json();
      const { products } = result;
      if (products && products.length) {
        setProductsData((prevData) => [...prevData, ...result.products]);
        setLoading(false);
      }
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [noOfClicks]);

  useEffect(() => {
    if (productsData && productsData.length === 100) setDisableButton(true);
  }, [productsData]);

  if (loading) {
    return <div>Loading Data!! Please wait.</div>;
  }

  return (
    <div className="container">
      <h3>Load More Button</h3>
      <div className="main">
        {productsData && productsData.length !== 0
          ? productsData.map(function (item, index) {
              return (
                <div key={`${item}-${index}`} className="item--container">
                  <img
                    src={item.thumbnail}
                    className="thumbnail"
                    alt="thumbnail of a product"
                  ></img>
                  <h3>{item.title}</h3>
                  <p>{`$ ${item.price}`}</p>
                  <p>{`${item.rating} rating`}</p>
                  <p>{`${item.discountPercentage}% discount`}</p>
                  <p>{item.description}</p>
                </div>
              );
            })
          : null}
      </div>
      <button
        disabled={disableButton}
        onClick={() => {
          setNoOfClicks(noOfClicks + 1);
        }}
      >
        Load More Products
      </button>
      {disableButton ? <p> You have reached end of product list </p> : null}
    </div>
  );
};

export default LoadMoreButton;
