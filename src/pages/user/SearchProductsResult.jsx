import React, { useState } from 'react'
import { Layout, BackTop, Row, Spin } from 'antd'
import Topbar from '../../components/user/Topbar'
import Footer from '../../components/user/Footer'
import ListProduct from '../../components/user/ListProduct'
import NoData from '../../components/common/NoData'
import { AiOutlineToTop } from 'react-icons/ai'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const { Content} = Layout

const GET_PRODUCTS = gql`
  query Products($productSearchInput: ProductSearchInput, $skip: Int, $take: Int, $orderBy: ProductOrderByInput) {
    products(productSearchInput: $productSearchInput, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      productId
      name
      priceOut
      priceSale
      colours
      images
      status
    }
  }
`

const SearchProductsResult = () => {
  const [searchParams] = useSearchParams()
  const searchCondition = searchParams.get('param')
  const [loading, setLoading] = useState(true)
  const { data } = useQuery(GET_PRODUCTS, {
    variables: {
        productSearchInput: {
          name: searchCondition,
          status: "STOCKING",
        },
        skip: null,
        take: null,
        orderBy: {
          updatedAt: "desc"
        }
    },
    onCompleted: () => {
        setLoading(false)
    }
  })
  return (
    <Spin spinning={loading} size="large">
        <Layout className="layout max-w-screen min-h-screen overflow-x-hidden">
            <Topbar />
            <Content className="px-[20px] md:px-[35px] lg:px-[50px] bg-white">
                {
                    data?.products?.length > 0 ? <ListProduct products={data?.products} /> : <NoData />
                }
            </Content>
            <Footer />
            <BackTop>
                <Row className="w-[40px] h-[40px] rounded-full border-2 border-[#154c79] text-[#154c79] flex justify-center items-center hover:bg-[#154c79] hover:text-white hover:shadow-lg">
                    <AiOutlineToTop className="text-[2rem] font-semibold" />
                </Row>
            </BackTop>
        </Layout>
    </Spin>
  )
}

export default SearchProductsResult