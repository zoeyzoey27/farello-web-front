import React, { useEffect, useState } from 'react'
import { Layout, BackTop, Row, Spin, Breadcrumb } from 'antd'
import Topbar from '../../components/user/Topbar'
import Footer from '../../components/user/Footer'
import { useQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import NoData from '../../components/common/NoData'
import { AiOutlineToTop } from 'react-icons/ai'
import { gql } from '@apollo/client'
import ListPostsByCategory from '../../components/user/ListPostsByCategory'
import i18n from '../../translation'
import { DESC } from '../../constant'

const { Content} = Layout
const GET_POSTS = gql`
 query Posts($postSearchInput: PostSearchInput, $skip: Int, $take: Int, $orderBy: OrderByInputByTime) {
    posts(postSearchInput: $postSearchInput, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      postId
      title
      category {
        id
        title
      }
      imageKey
      createdAt
    }
  }
`

const Posts = () => {
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const title = searchParams.get('title')
  const { data } = useQuery(GET_POSTS, {
    variables: {
        postSearchInput: {
            categoryId: id,
        },
        skip: null,
        take: null,
        orderBy: {
          createdAt: DESC
        }
    },
    onCompleted: () => {
        setLoading(false)
    }
  })
  useEffect(() => {
    data ? setLoading(false) : setLoading(true)
  }, [id, data])
  return (
    <Spin spinning={loading} size="large">
      <Layout className="layout max-w-screen min-h-screen overflow-x-hidden">
       <Topbar />
       <Content className="px-[20px] md:px-[35px] lg:px-[50px] bg-white">
          <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
            <Breadcrumb.Item href="/" className="text-[1.6rem]">{i18n.t('common.home')}</Breadcrumb.Item>
            <Breadcrumb.Item className="text-[1.6rem] font-semibold">
                {`${i18n.t('postCategory.heading')}: ${title}`}
            </Breadcrumb.Item>
          </Breadcrumb> 
          {data?.posts?.length > 0 ? <ListPostsByCategory posts={data?.posts} /> : <NoData />}
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

export default Posts