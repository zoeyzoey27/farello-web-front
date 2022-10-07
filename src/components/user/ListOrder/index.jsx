import React from 'react'
import { Space, Row, Button, Table, Col, Form, Input, Pagination, Breadcrumb, Select } from 'antd'
import { data } from './DataTable'
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS, TOTAL_DEFAULT } from '../../../constant'
import { FiSearch } from 'react-icons/fi'
import { BiDetail } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const ListOrder = () => {
  const navigate = useNavigate()
  const { Option } = Select
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
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
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value) => <Row className={`${value === 'Chờ xác nhận' || value === 'Hủy' ? 'text-red-500' : 'text-green-500'}`}>{value}</Row>,
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
    <Space 
       direction="vertical" 
       size="middle" 
       className="w-full h-full mb-10">
       <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
          <Breadcrumb.Item href="/" className="text-[1.6rem]">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[1.6rem] font-semibold">Danh sách đơn hàng</Breadcrumb.Item>
      </Breadcrumb>
       <Row className="p-10 bg-[#F8F8F8] w-full rounded">
          <Form layout="vertical" autoComplete="off" className="w-full">
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
                  <Form.Item name="address" label={<Row className="font-semibold text-[1.6rem]">Trạng thái</Row>}>
                      <Select size="large" className="rounded w-[220px] self-end mb-10" placeholder="Chờ xác nhận">
                          <Option value={1} className="text-[1.6rem]">Chờ xác nhận</Option>
                          <Option value={2} className="text-[1.6rem]">Đã xác nhận</Option>
                          <Option value={3} className="text-[1.6rem]">Đã đóng gói</Option>
                          <Option value={4} className="text-[1.6rem]">Đã giao cho ĐVVC</Option>
                          <Option value={5} className="text-[1.6rem]">Giao hàng thành công</Option>
                          <Option value={6} className="text-[1.6rem]">Hủy</Option>
                      </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row className="flex flex-col md:flex-row md:justify-end">
                 <Form.Item className="md:mb-0">
                    <Button 
                        size="large" 
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
            <Row className="font-semibold text-red-500 mx-2">3</Row> 
            kết quả
        </Row>
       <Table 
          rowKey="id"
          columns={columns} 
          dataSource={data} 
          bordered 
          pagination={false}
          className="!text-[1.6rem]"
          scroll={{ x: 'max-content' }} />
       <Pagination 
          current={PAGE_DEFAULT} 
          pageSize={PAGE_SIZE_DEFAULT} 
          total={TOTAL_DEFAULT} 
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showSizeChanger
          onChange={() => {}}
          locale={{items_per_page: 'Trang'}}
          className="mt-10 w-full flex justify-center" />
    </Space>
  )
}

export default ListOrder