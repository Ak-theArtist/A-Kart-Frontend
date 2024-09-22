import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import axios from 'axios';
import Item from '../Item/Item';

function NewCollections(props) {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    axios.get(`https://a-kart-backend.onrender.com/auth/newcollections`)
      .then((response) => {
        setNew_collection(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <>
      <hr className='mt-1' />
      <div className='new-collections'>
        <h1 className='animate-right' style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }}>
          New Collections
        </h1>
        <hr />
        <div className="collections">
          {new_collection.map((item) => 
            <Item 
              key={item._id}
              id={item.id} 
              name={item.name} 
              _id={item?._id} 
              image={item.image} 
              image2={item.image2} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NewCollections;
