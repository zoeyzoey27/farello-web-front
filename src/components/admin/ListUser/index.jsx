import React, { useState, useEffect } from 'react'
import { Space, Typography, Row, Button, Table, Col, Form, Input, Pagination, Spin, Breadcrumb } from 'antd'
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS, SKIP_DEFAULT } from '../../../constant'
import { FiSearch} from 'react-icons/fi'
import { GET_USER_LIST } from './graphql'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const ListUser = () => {
  const { Title } = Typography
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dataTable, setDataTable] = useState([])
  const [searchCondition, setSearchCondition] = useState({
    items: {},
    pageIndex: PAGE_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  })
  const { data: dataInit } = useQuery(GET_USER_LIST, {
    variables: {
      userInput: {},
      skip: null,
      take: null,
      orderBy: {
        createdAt: "asc"
      }
    }
  })
  const { data } = useQuery(GET_USER_LIST, {
    variables: {
      userInput: searchCondition.items,
      skip: searchCondition?.pageSize
      ? searchCondition.pageSize * (searchCondition.pageIndex - 1)
      : SKIP_DEFAULT,
      take: searchCondition?.pageSize || PAGE_SIZE_DEFAULT,
      orderBy: {
        createdAt: "desc"
      }
    },
    onCompleted: () => {
      setLoading(false)
    }
  })
  const resetFields = () => {
    form.resetFields()
    setSearchCondition({
      items: {},
      pageIndex: PAGE_DEFAULT,
      pageSize: PAGE_SIZE_DEFAULT,
    })
  }
  const onSubmit = (values) => {
    setSearchCondition((pre) => ({
     ...pre,
     items: {
       userId: values.userId,
       fullName: values.name,
       phoneNumber: values.phone,
       email: values.email,
       address: values.address,
     }
    }))
 }
 const onChangePagination = (page, limit) => {
   setSearchCondition({
     ...searchCondition,
     pageIndex: page,
     pageSize: limit,
   })
 }
 useEffect(() => {
  if (data) {
     const items = data?.users?.map((item) => {
         return {
           userId: item.userId,
           name: item.fullName,
           email: item.email,
           birthday: item.birthday,
           phone: item.phoneNumber,
           idcard: item.idCard,
           address: item.address
         }
     })
     setDataTable(items)
  }
},[data])
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'birthday',
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    },
    {
      title: 'Số CMT/CCCD',
      dataIndex: 'idcard',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    }
  ]
  return (
    <Spin spinning={loading} size="large">
      <Space 
       direction="vertical" 
       size="middle" 
       className="w-full h-full bg-white p-10">
       <Title level={4} className="whitespace-pre-wrap">Quản lý khách hàng</Title>
       <Breadcrumb className="text-[1.6rem] mb-5 px-10 py-2 bg-[#f8f8f8]">
          <Breadcrumb.Item 
            onClick={() => navigate('/admin/dashboard')}
            className="hover:text-black cursor-pointer">
            Bảng điều khiển
          </Breadcrumb.Item>
          <Breadcrumb.Item className="font-semibold">
            Quản lý khách hàng
          </Breadcrumb.Item>
        </Breadcrumb>
       <Row className="p-10 bg-[#F8F8F8] w-full rounded">
          <Form form={form} layout="vertical" autoComplete="off" className="w-full" onFinish={onSubmit}>
            <Row gutter={{xs: 0, md: 20, xl: 50}}>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="userId" label={<Row className="font-semibold text-[1.6rem]">User ID</Row>}>
                      <Input 
                         size="large" 
                         className="rounded"
                         placeholder="Tìm kiếm" 
                         suffix={
                           <FiSearch className="text-[2rem] text-[#c6c6c6]" />
                         } />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="name" label={<Row className="font-semibold text-[1.6rem]">Họ tên</Row>}>
                      <Input 
                         size="large" 
                         className="rounded"
                         placeholder="Tìm kiếm" 
                         suffix={
                           <FiSearch className="text-[2rem] text-[#c6c6c6]" />
                         } />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="email" label={<Row className="font-semibold text-[1.6rem]">Email</Row>}>
                      <Input 
                         size="large" 
                         className="rounded"
                         placeholder="Tìm kiếm" 
                         suffix={
                           <FiSearch className="text-[2rem] text-[#c6c6c6]" />
                         } />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="phone" label={<Row className="font-semibold text-[1.6rem]">Số điện thoại</Row>}>
                      <Input 
                         size="large" 
                         className="rounded"
                         placeholder="Tìm kiếm" 
                         suffix={
                           <FiSearch className="text-[2rem] text-[#c6c6c6]" />
                         } />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="address" label={<Row className="font-semibold text-[1.6rem]">Địa chỉ</Row>}>
                      <Input 
                         size="large" 
                         className="rounded"
                         placeholder="Tìm kiếm" 
                         suffix={
                           <FiSearch className="text-[2rem] text-[#c6c6c6]" />
                         } />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="flex flex-col md:flex-row md:justify-end">
                 <Form.Item className="md:mb-0">
                    <Button 
                        size="large" 
                        onClick={resetFields}
                        className="md:mr-5 w-full md:w-[100px] bg-inherit text-black hover:bg-inherit hover:text-black hover:border-inherit border-inherit hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                        Xóa
                    </Button>
                 </Form.Item>
                 <Form.Item className="mb-0">
                    <Button 
                      size="large"
                      htmlType="submit"
                      className="w-full md:w-[100px] bg-[#154c79] text-white hover:bg-[#154c79] hover:text-white hover:border-[#154c79] hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                      Tìm kiếm
                    </Button>
                 </Form.Item>
              </Row>
          </Form>
       </Row>
       <Row className="text-[1.6rem] mt-5 md:mt-0">
            Tổng số 
            <Row className="font-semibold text-red-500 mx-2">{dataInit?.users?.length}</Row> 
            kết quả
        </Row>
       <Table 
          rowKey="id"
          columns={columns} 
          dataSource={dataTable} 
          bordered 
          pagination={false}
          className="!text-[1.6rem]"
          scroll={{ x: 'max-content' }} />
       <Pagination 
          current={searchCondition?.pageIndex} 
          pageSize={searchCondition?.pageSize} 
          total={dataInit?.users?.length} 
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showSizeChanger
          onChange={onChangePagination}
          locale={{items_per_page: 'kết quả / trang'}}
          className="mt-10 w-full flex justify-center" />
    </Space>
    </Spin>
  )
}

export default ListUser