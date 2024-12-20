import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {

  const url = "https://platterpal-backend.onrender.com";
  const [image, setImage] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());  // To reset image input
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Chicken Dishes"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Chicken Dishes"
        });
        setImage(false);
        setImageKey(Date.now());  // Reset image input by changing key
        toast.success(response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the data.");
    }
  };

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input
            key={imageKey}  // Ensures the input resets when imageKey changes
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id='image'
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name='name'
            placeholder='Type here'
          />
        </div>
        <div className="add-description flex-col">
          <p>Add Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            required
            placeholder='Write content here'
          ></textarea>
        </div>
        <div className="add-cat-price">

          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Chicken Dishes">Chicken Dishes</option>
              <option value="Fish Dishes">Fish Dishes</option>
              <option value="Deserts">Deserts</option>
              <option value="Noodles">Noodles</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name='price'
              placeholder='$20'
            />
          </div>

        </div>
        <button type='submit' className='add-button'>ADD</button>
      </form>

      <ToastContainer />  {/* For displaying toast messages */}
    </div>
  );
};

export default Add;
