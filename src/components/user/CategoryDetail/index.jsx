import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Row, Breadcrumb } from 'antd'
import { useQuery } from '@apollo/client'
import { GET_CATEGORY } from './graphql'
import i18n from '../../../translation'

const CategoryDetail = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { data } = useQuery(GET_CATEGORY, {
    variables: {
      categoryId: id
    },
    skip: id === null
  })
  return (
    <Row className="flex flex-col">
      <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
          <Breadcrumb.Item href="/" className="text-[1.6rem]">{i18n.t('common.home')}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[1.6rem] font-semibold">{data?.category?.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="flex flex-col md:flex-row items-center justify-between my-10 w-full md:h-[300px] !lg:px-[50px]">
          <Row className="flex flex-col bg-[#f8f8f8] flex-1 h-full p-10">
              <Row className="text-[2.2rem] font-semibold block mb-5">{data?.category?.name}</Row>
              <Row className="text-[1.6rem] text-justify">{data?.category?.description}</Row>
          </Row>
          <img src={data?.category?.imageKey} alt='' className="h-[300px] object-cover object-center" />
      </Row>
    </Row>
  )
}

export default CategoryDetail