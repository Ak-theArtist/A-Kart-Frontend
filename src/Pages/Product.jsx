import React, { useContext, useEffect, useState } from 'react';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const Product = () => {
  const { allProduct } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const selectedProduct = allProduct?.find((e) => e._id === productId);
    setProduct(selectedProduct);

    window.scrollTo(0, 0);
  }, [allProduct, productId]);

  return product ? (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <RelatedProducts id={product._id} category={product.category} />
    </div>
  ) : null;
}

export default Product;
