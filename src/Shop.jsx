import "./Shop.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function Item(props) {
  return (
    <div key={props.id}>
      <img src={props.img} width={200} height={200} />
      <br />
      id: {props.id} <br />
      name: {props.name}
      <br />
      price: {props.price}
      <br />
      <button onClick={() => props.callback(props)}>Add cart</button>
      <button onClick={() => props.del_callback(props.id)}>Delete</button>
      <button onClick={() => props.upd_callback(props)}>Update</button>
    </div>
  );
}

export default function Shop() {
  const name_ref = useRef(null);
  const price_ref = useRef(null);
  const img_ref = useRef(null);

  const [products, setProducts] = useState([]);
  const URL = 'https://symmetrical-space-pancake-gwxgjjw5p5j3544-5000.app.github.dev';

  useEffect(() => {
    axios
      .get(URL + '/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const [cart, setCart] = useState([]);
  let total = 0;

  function addCart(item) {
    setCart([
      ...cart,
      { id: item.id, name: item.name, price: item.price, img: item.img },
    ]);
  }

  const productList = products.map((item) => (
    <Item {...item} callback={addCart} del_callback={delProduct} upd_callback={updateProduct}/>
  ));

  const cartList = cart.map((item, index) => (
    <li key={index}>
      {item.id} {item.name} {item.price}{" "}
      <button onClick={() => removeFromCart(index)}>Remove</button>
    </li>
  ));

  for (let i = 0; i < cart.length; i++) total += cart[i].price;

  const ClearCart = () => {
    setCart([]);
  };

  function removeFromCart(index) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function addProduct() {
    const data = {
      name: name_ref.current.value,
      price: price_ref.current.value,
      img: img_ref.current.value,
    };

    if (!data.name || !data.price || !data.img) {
      alert("Please fill in all fields: name, price, and image.");
      return;
    }

    axios
      .post(URL + '/api/addproduct', data)
      .then((response) => {
        setProducts([...products, response.data]); // Add the new product to the list
      })
      .catch((error) => {
        console.error("Error adding product:", error.response ? error.response.data : error.message);
      });
  }

  
  function delProduct(id) {
    axios
      .delete(URL + '/api/delProduct/' + id)
      .then((response) => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  }

  function updateProduct(item) {
    const id = item.id;
    const data = {
      name: item.name,
      price: item.price,
      img: item.img,
    };

    axios
      .put(URL + '/api/updateProduct/' + id, data)
      .then((response) => {
        if (response.data.status) {
          setProducts(products.filter((product) => product.id !== id));
        } else {
          console.error("Failed to update product.");
        }
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  }

  return (
    <>
      <h3>Add New Product</h3>
      <label>name : </label>
      <input type="text" ref={name_ref} />
      <label>price : </label>
      <input type="text" ref={price_ref} />
      <label>img : </label>
      <input type="text" ref={img_ref} />
      <button onClick={addProduct}>Add Product</button>

      <div className="grid-container">{productList}</div>

      <h1>Cart</h1>
      <button onClick={() => ClearCart()}>Clear All</button>
      <ol>{cartList}</ol>
      <h2>Total {total} Baht</h2>
    </>
  );
}
