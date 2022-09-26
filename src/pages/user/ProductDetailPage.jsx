import React from 'react'
import { Layout, Row } from 'antd'
import Topbar from '../../components/user/Topbar';
import Footer from '../../components/user/Footer';
import { useQuery } from '@apollo/client';
import { getProducts, getSingleProduct } from '../../graphqlClient/queries';
import ListProduct from '../../components/user/ListProduct';
import { useSearchParams } from 'react-router-dom';
import ProductDetail from '../../components/user/ProductDetail';

const { Content} = Layout;

const ProductDetailPage = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { data: productData } = useQuery(getSingleProduct, {
      variables: {
          id: id
      },
      skip: id === null
  })
  const { loading, error, data  } = useQuery(getProducts)
  const products = data?.products.filter((item) => item.category.id === productData?.product?.category?.id && item.id !== id);
	if (loading) return <p>Loading....</p>
	if (error) return <p>Error!</p>
  return (
    <Layout className="layout max-w-screen min-h-screen">
       <Topbar />
       <Content className="main-container bg-white">
           <ProductDetail />
           <Row className="title-header">Có thể bạn quan tâm</Row>
           <ListProduct products={products} />
       </Content>
       <Footer />
    </Layout>
  )
}

export default ProductDetailPage