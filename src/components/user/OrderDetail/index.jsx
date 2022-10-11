import React, { useState } from 'react'
import { 
    Space, 
    Row, 
    Breadcrumb,
    Descriptions,
    Grid,
    List,
    Button,
    Spin, 
    Modal,
    message
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ORDER_DETAIL, UPDATE_ORDER_STATUS } from './graphql'
import { OrderStatus, OrderStatusDisable } from '../../../constant/statusOrder'
import numberWithCommas from '../../../utils/NumberWithCommas'
import { PaymentMethod } from '../../../constant/paymentMethod'
import CancelOrderReason from '../CancelOrderReason'
import { CancelReasonAdmin, CancelReasonUser } from '../../../constant/cancelReason'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../constant'

const OrderDetail = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const [updateOrder] = useMutation(UPDATE_ORDER_STATUS)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [valueChecked, setValueChecked] = useState("USER_DOES_NOT_WANT_TO_BUY")
  const [valueTextarea, setValueTextarea] = useState("")
  const onChangeRadio = (e) => {
    setValueChecked(e.target.value)
  }
  const onChangeTextarea = (e) => {
    setValueTextarea(e.target.value)
  }
  const { data } = useQuery(GET_ORDER_DETAIL,{
    variables: {
        orderId: id,
    },
    onCompleted: () => {
        setLoading(false)
    }
  })
  const showModal = () => {
    setIsModalOpen(true);
  }
  const handleOk = () => {
    setIsModalOpen(false)
    setLoading(true)
    updateOrder({
        variables: {
            updateOrderStatusId: id,
            orderUpdateInput: {
                status: "CANCEL",
                cancelReason: valueTextarea === "" ? valueChecked : valueTextarea,
                cancelBy: "USER",
                updatedAt: moment().format(DATE_TIME_FORMAT)
            }
        },
        onCompleted: () => {
            setLoading(false)
            message.success("Hủy đơn hàng thành công!")
        },
        onError: (err) => {
            setLoading(false)
            message.error(`${err.message}`)
        }
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <Spin spinning={loading} size="large">
        <Space 
        direction="vertical" 
        size="middle" 
        className="w-full h-full mb-10">
        <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
          <Breadcrumb.Item href="/" className="text-[1.6rem]">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item href="/listOrderUser" className="text-[1.6rem]">Danh sách đơn hàng</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[1.6rem] font-semibold">
              Đơn hàng (ID: {data?.order?.orderId})
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row className="font-semibold text-[1.8rem]">Thông tin khách hàng</Row>
        <Descriptions layout={screens.lg ? 'horizontal' : 'vertical'}>
            <Descriptions.Item label={<Row className="font-semibold text-[1.6rem]">Họ tên</Row>}>
               <Row className="text-[1.6rem]">{data?.order?.receiverName}</Row>
            </Descriptions.Item>
            <Descriptions.Item label={<Row className="font-semibold text-[1.6rem]">Số điện thoại</Row>}>
               <Row className="text-[1.6rem]">{data?.order?.phoneNumber}</Row>
            </Descriptions.Item>
            <Descriptions.Item label={<Row className="font-semibold text-[1.6rem]">Email</Row>}>
              <Row className="text-[1.6rem]">{data?.order?.email}</Row>
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold text-[1.6rem]">Địa chỉ nhận hàng</Row>}
               span={3}>
               <Row className="text-[1.6rem]">{data?.order?.address}</Row>
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold text-[1.6rem]">Phương thức thanh toán</Row>}
               span={3}>
               <Row className="text-[1.6rem]">
                 {data?.order?.paymentMethod && PaymentMethod.find(item => item.value === data?.order?.paymentMethod).name}
               </Row>
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold text-[1.6rem]">Ngày đặt</Row>}
               span={3}>
               <Row className="text-[1.6rem]">
                 {data?.order?.createdAt}
               </Row>
            </Descriptions.Item>
            {
                data?.order?.status === "CANCEL" && (
                    <>
                    <Descriptions.Item 
                        label={<Row className="font-semibold text-[1.6rem]">Ngày hủy</Row>}
                        span={3}>
                        <Row className="text-[1.6rem]">
                            {data?.order?.updatedAt}
                        </Row>
                    </Descriptions.Item>
                    <Descriptions.Item 
                        label={<Row className="font-semibold text-[1.6rem]">Lý do hủy</Row>}
                        span={3}>
                        <Row className="text-[1.6rem]">
                            {data?.order?.cancelBy === "USER" ? (
                                data?.order?.cancelReason && 
                                CancelReasonUser.find(item => item.value ===data?.order?.cancelReason) ?
                                CancelReasonUser.find(item => item.value ===data?.order?.cancelReason).name : 
                                data?.order?.cancelReason
                            ) : (
                                data?.order?.cancelReason && 
                                CancelReasonAdmin.find(item => item.value ===data?.order?.cancelReason) ?
                                CancelReasonAdmin.find(item => item.value ===data?.order?.cancelReason).name : 
                                data?.order?.cancelReason
                            )}
                        </Row>
                    </Descriptions.Item>
                    </>
                )
            }
            <Descriptions.Item label={<Row className="font-semibold text-[1.6rem]">Ghi chú</Row>}>
               <Row className="text-[1.6rem]">{data?.order?.userNote || 'Không'}</Row>
            </Descriptions.Item>
        </Descriptions>
        <hr/>
        <Row className="font-semibold text-[1.8rem]">Thông tin đơn hàng</Row>
        <Row className="flex flex-col w-full">
            <Row className={`text-[1.6rem] self-end mb-10 ${data?.order?.status === 'CANCEL' ? 'text-red-500' : 'text-green-500'}`}>
               {`Trạng thái: ${data?.order?.status && OrderStatus.find(item => item.value === data?.order?.status).name}`}
            </Row>
            <Row className="flex flex-col">
            <List
                header={<Row className="text-[1.6rem] font-semibold">{`Tổng số: ${data?.order?.products?.length}`}</Row>}
                footer={false}
                bordered>
                {
                    data?.order?.products?.map((item) => (
                        <List.Item key={item.id} className="flex flex-col md:flex-row items-start md:justify-between">
                            <Row className="flex flex-col text-[1.6rem]">
                                <Row>{`Tên sản phẩm: ${item.name}`}</Row>
                                <Row>{`Số lượng: ${item.quantity}`}</Row>
                                <Row>{`Màu sắc: ${item.color}`}</Row>
                                <Row>{`Giá tiền: ${item.price && numberWithCommas(item.price)}`}</Row>
                            </Row>
                            <img src={item.imageKey} alt="" className="w-[200px] mt-3 md:mt-0" />
                        </List.Item>
                    ))
                }
            </List> 
            <List
                header={false}
                footer={false}
                className="mt-5"
                bordered>
                <List.Item className="flex items-start justify-between">
                    <Row className="text-[1.6rem]">Đơn hàng:</Row>
                    <Row className="text-[1.6rem]">
                       {data?.order?.totalPaymentWithoutShipment && numberWithCommas(data?.order?.totalPaymentWithoutShipment)}
                    </Row>
                </List.Item>
                <List.Item className="flex items-start justify-between">
                    <Row className="text-[1.6rem]">Ship:</Row>
                    <Row className="text-[1.6rem]">
                       {data?.order?.transferFee && numberWithCommas(data?.order?.transferFee)}
                    </Row>
                </List.Item>
                <List.Item className="flex items-start justify-between">
                    <Row className="text-[2rem] font-semibold uppercase">Tổng đơn:</Row>
                    <Row className="text-[2rem] font-semibold">
                       {data?.order?.totalPayment && numberWithCommas(data?.order?.totalPayment)}
                    </Row>
                </List.Item>
            </List>       
            </Row>
        </Row>
        <Row className="flex w-full justify-end">
           <Button 
              danger 
              size="large" 
              onClick={showModal}
              disabled={OrderStatusDisable.includes(data?.order?.status)}
              className="rounded self-end w-full md:w-fit">
              Hủy đơn hàng
          </Button>
        </Row>
        <Modal 
           title="Hủy đơn hàng" 
           centered 
           visible={isModalOpen} 
           onOk={handleOk} 
           onCancel={handleCancel}>
          <CancelOrderReason  
            valueChecked={valueChecked} 
            onChange={onChangeRadio}
            valueTextarea={valueTextarea}
            onChangeTextarea={onChangeTextarea} />
        </Modal>
    </Space>
    </Spin>
  )
}

export default OrderDetail