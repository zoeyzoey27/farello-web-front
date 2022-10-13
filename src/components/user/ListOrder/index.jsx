import React, { useState, useEffect } from 'react'
import { Space, Row, Button, Table, Col, Form, Input, Pagination, Breadcrumb, Select, Spin } from 'antd'
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS, SKIP_DEFAULT } from '../../../constant'
import { FiSearch } from 'react-icons/fi'
import { BiDetail } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_ORDERS } from './graphql'
import numberWithCommas from '../../../utils/NumberWithCommas'
import { OrderStatus } from '../../../constant/statusOrder'

const ListOrder = () => {
  const navigate = useNavigate()
  const { Option } = Select
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [dataTable, setDataTable] = useState([])
  const [searchCondition, setSearchCondition] = useState({
    items: {
      userId: localStorage.getItem("id_token")
    },
    pageIndex: PAGE_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
  })
  const { data: dataInit } = useQuery(GET_ORDERS, {
     variables: {
      orderSearchInput: {
        userId: localStorage.getItem("id_token")
      },
      skip: null,
      take: null,
      orderBy: {
        updatedAt: 'desc'
      }
     }
  })
  const { data } = useQuery(GET_ORDERS, {
    variables: {
      orderSearchInput: searchCondition.items,
      skip: searchCondition?.pageSize
      ? searchCondition.pageSize * (searchCondition.pageIndex - 1)
      : SKIP_DEFAULT,
      take: searchCondition?.pageSize || PAGE_SIZE_DEFAULT,
      orderBy: {
        updatedAt: "desc"
      }
    },
    onCompleted: () => {
      setLoading(false)
    }
  })
  const resetFields = () => {
    form.resetFields()
    setSearchCondition({
      items: {
        userId: localStorage.getItem("id_token")
      },
      pageIndex: PAGE_DEFAULT,
      pageSize: PAGE_SIZE_DEFAULT,
    })
  }
  const onSubmit = (values) => {
    setSearchCondition((pre) => ({
     ...pre,
     items: {
       userId: localStorage.getItem("id_token"),
       orderId: values.orderId,
       receiverName: values.name,
       phoneNumber: values.phone,
       email: values.email,
       address: values.address,
       status: values.status
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
       const items = data?.orders?.map((item) => {
           let quantity = 0
           for (let i=0; i<item.products.length; i++) {
             quantity += item.products[i].quantity
           }
           return {
             id: item.id,
             orderId: item.orderId,
             name: item.receiverName,
             email: item.email,
             phone: item.phoneNumber,
             address: item.address,
             totalProduct: quantity,
             totalFee: item.totalPayment,
             status: item.status,
             createdAt: item.createdAt
           }
       })
       setDataTable(items)
    }
 },[data])
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
    },
    {
      title: 'Người nhận',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    },
    {
      title: 'Địa chỉ người nhận',
      dataIndex: 'address',
    },
    {
        title: 'Số lượng sản phẩm',
        dataIndex: 'totalProduct',
    },
    {
        title: 'Tổng đơn hàng',
        dataIndex: 'totalFee',
        render: (value) => <Row>{`${numberWithCommas(value)} VND`}</Row>
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => {
          return (
            <Row className={`${value === 'CANCEL' ? 'text-red-500' : 'text-green-500' }`}>
               {OrderStatus.find(item => item.value === value).name}
            </Row>
          )
        },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
    },
    {
        title: null,
        dataIndex: 'detail',
        render: (_, _record) => (
            <BiDetail 
               onClick={() => navigate(`/orderDetail?id=${_record.id}`)}
               className="text-[2rem] cursor-pointer hover:opacity-80 !text-[#154c79]" />
        ),
        width: '50px',
    },
  ]
  return (
    <Spin spinning={loading} size="large">
      <Space 
       direction="vertical" 
       size="middle" 
       className="w-full h-full mb-10">
       <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
          <Breadcrumb.Item href="/" className="text-[1.6rem]">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[1.6rem] font-semibold">Danh sách đơn hàng</Breadcrumb.Item>
      </Breadcrumb>
       <Row className="p-10 bg-[#F8F8F8] w-full rounded">
          <Form onFinish={onSubmit} form={form} layout="vertical" autoComplete="off" className="w-full">
            <Row gutter={{xs: 0, md: 20, xl: 50}}>
                <Col className="gutter-row" xs={24} md={8}>
                  <Form.Item name="orderId" label={<Row className="font-semibold text-[1.6rem]">Mã đơn hàng</Row>}>
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
                  <Form.Item name="name" label={<Row className="font-semibold text-[1.6rem]">Người nhận</Row>}>
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
                  <Form.Item name="address" label={<Row className="font-semibold text-[1.6rem]">Địa chỉ người nhận</Row>}>
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
                  <Form.Item name="email" label={<Row className="font-semibold text-[1.6rem]">Email người nhận</Row>}>
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
                  <Form.Item name="status" label={<Row className="font-semibold text-[1.6rem]">Trạng thái</Row>}>
                      <Select size="large" className="rounded w-[220px] self-end mb-10" placeholder="Chờ xác nhận">
                          {
                            OrderStatus.map((item) => (
                              <Option key={item.value} value={item.value} className="text-[1.6rem]">
                                {item.name}
                              </Option>
                            ))
                          }
                      </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row className="flex flex-col md:flex-row md:justify-end">
                 <Form.Item className="md:mb-0">
                    <Button 
                        size="large" 
                        onClick={resetFields}
                        className="md:mr-5 w-full md:w-[100px] !bg-inherit !text-black hover:bg-inherit hover:text-black hover:border-inherit !border-inherit hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                        Xóa
                    </Button>
                 </Form.Item>
                 <Form.Item className="mb-0">
                    <Button 
                      size="large"
                      htmlType="submit"
                      className="w-full md:w-[100px] !bg-[#154c79] !text-white hover:bg-[#154c79] !border-[#154c79] hover:text-white hover:border-[#154c79] hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                      Tìm kiếm
                    </Button>
                 </Form.Item>
              </Row>
          </Form>
       </Row>
       <Row className="text-[1.6rem] mt-5 md:mt-0">
            Tổng số 
            <Row className="font-semibold text-red-500 mx-2">{dataInit?.orders?.length}</Row> 
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
          total={dataInit?.orders?.length} 
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showSizeChanger
          onChange={onChangePagination}
          locale={{items_per_page: 'kết quả / trang'}}
          className="mt-10 w-full flex justify-center" />
    </Space>
    </Spin>
  )
}

export default ListOrder