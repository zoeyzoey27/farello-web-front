import React, { useEffect, useState } from 'react'
import { 
    Space, 
    Form, 
    Input, 
    Row, 
    Typography, 
    Button, 
    Select,
    Col,
    message,
    DatePicker, 
    Spin,
    Breadcrumb
} from 'antd'
import { schemaValidate } from '../../../validation/AddAdmin'
import { converSchemaToAntdRule } from '../../../validation'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdDeleteOutline } from 'react-icons/md'
import { FiSave } from 'react-icons/fi'
import axiosClient from '../../../api/axiosClient'
import { ADD_ADMIN, GET_ADMIN, UPDATE_ADMIN_INFO } from './graphql'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { DATE_TIME_FORMAT, convertTimeToString } from '../../../constant'

const AddAdminForm = () => {
  const navigate = useNavigate()
  const [addAdmin] = useMutation(ADD_ADMIN)
  const [updateAdmin] = useMutation(UPDATE_ADMIN_INFO)
  const { Option } = Select
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(action === 'edit' ? true : false)
  const [provinceList, setProvinceList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [communeList, setCommuneList] = useState([])
  const { Title } = Typography
  const yupSync = converSchemaToAntdRule(schemaValidate)

  const { data } = useQuery(GET_ADMIN, {
    variables: {
      adminId: id
    },
    skip: id === null,
    onCompleted: () => {
      setLoading(false)
    }
  })
  const onFinish = (values) => {
    setLoading(true)
    if (values.password !== values.rePassword) {
      message.error('Mật khẩu không khớp!')
    }
    else {
      const province = provinceList.find((item) => item.code === form.getFieldsValue().province).name
      const district = districtList.find((item) => item.code === form.getFieldsValue().district).name
      const commune = communeList.find((item) => item.code === form.getFieldsValue().commune).name
      const adminAddress = `${commune} - ${district} - ${province}`
      const customId = 'NV' + Math.floor(Math.random() * Date.now())
      addAdmin({
        variables: {
          adminRegisterInput: {
            adminId: customId,
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            phoneNumber: values.phone,
            address: adminAddress,
            provinceCode: values.province,
            districtCode: values.district,
            communeCode: values.commune,
            idCard: values.idcard,
            birthday: convertTimeToString(values.birthday),
            status: "AVAILABLE",
            createdAt: moment().format(DATE_TIME_FORMAT),
            updatedAt: moment().format(DATE_TIME_FORMAT),
          },
        },
        onCompleted: () => {
          setLoading(false)
          message.success('Tạo tài khoản thành công!')
          form.resetFields()
        },
        onError: (error) => {
          setLoading(false)
          message.error(`${error.message}`)
        },
      })
    }
  }
  const onUpdate = (values) => {
    setLoading(true)
    const province = provinceList.find((item) => item.code === form.getFieldsValue().province).name
    const district = districtList.find((item) => item.code === form.getFieldsValue().district).name
    const commune = communeList.find((item) => item.code === form.getFieldsValue().commune).name
    const adminAddress = `${commune} - ${district} - ${province}`
    updateAdmin({
      variables: {
        updateAdminId: id,
        adminUpdateInput: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phone,
          address: adminAddress,
          provinceCode: values.province,
          districtCode: values.district,
          communeCode: values.commune,
          idCard: values.idcard,
          birthday: convertTimeToString(values.birthday),
          status: "AVAILABLE",
          updatedAt: moment().format(DATE_TIME_FORMAT),
        },
      },
      onCompleted: () => {
        setLoading(false)
        message.success('Chỉnh sửa thông tin thành công!')
        navigate("/admin/adminList")
      },
      onError: (error) => {
        setLoading(false)
        message.error(`${error.message}`)
      },
    })
  }
  useEffect(() => {
     axiosClient.get('province').then((res) => {
      setProvinceList(res.data.results)
     })
  },[])
  const onChangeProvince = async (value) => {
    await axiosClient.get(`district?province=${value}`).then((res) => {
      setDistrictList(res.data.results)
    })
  }
  const onChangeDistrict = async (value) => {
    await axiosClient.get(`commune?district=${value}`).then((res) => {
      setCommuneList(res.data.results)
    })
  }
  useEffect(() => {
    if (data) {
       form.setFieldsValue({
          fullName: data?.admin?.fullName,
          phone: data?.admin?.phoneNumber,
          email: data?.admin?.email,
          idcard: data?.admin?.idCard,
          province: data?.admin?.provinceCode,
       })
       if (data?.admin?.birthday) {
        form.setFieldsValue({
          birthday: moment(data?.admin?.birthday, "DD/MM/YYYY"),
        })
       }
       onChangeProvince(data?.admin?.provinceCode)
       form.setFieldsValue({
            district: data?.admin?.districtCode,
       })
       onChangeDistrict(data?.admin?.districtCode)
       form.setFieldsValue({
          commune: data?.admin?.communeCode,
       })
    }
  }, [data, form])
  return (
    <Spin spinning={loading} size="large">
      <Space 
        direction="vertical" 
        size="middle" 
        className="w-full h-full bg-white p-10">
        <Title level={4} className="whitespace-pre-wrap">
          {action === 'edit' ? 'Chỉnh sửa thông tin cá nhân' : 'Tạo tài khoản Admin'}
        </Title>
        <Breadcrumb className="text-[1.6rem] mb-5">
              <Breadcrumb.Item 
                onClick={() => navigate('/admin/dashboard')}
                className="hover:text-black cursor-pointer">
                Bảng điều khiển
              </Breadcrumb.Item>
              <Breadcrumb.Item className="font-semibold">
                 {action === 'edit' ? 'Chỉnh sửa thông tin cá nhân' : 'Tạo tài khoản Admin'}
              </Breadcrumb.Item>
          </Breadcrumb>
        <Row className="text-[1.6rem]">Vui lòng nhập thông tin vào các trường bên dưới.</Row>
        <Row className="mb-5 text-[1.6rem]">(*) là thông tin bắt buộc.</Row>
        <Form 
            layout='vertical'
            autoComplete='off' 
            onFinish={action === 'edit' ? onUpdate : onFinish} 
            form={form}>
            <Form.Item
                name="fullName"
                className="w-full md:w-1/2 lg:w-1/3"
                required={false}
                rules={[yupSync]}
                label={
                  <Row className="font-semibold text-[1.6rem]">
                     Họ tên
                     <Row className="text-red-500 ml-3">*</Row>
                  </Row>
                }>
                <Input size="large" placeholder="Admin" className="rounded" />
            </Form.Item>
            <Form.Item
                name="birthday"
                className="w-full md:w-1/2 lg:w-1/3"
                required={false}
                label={
                  <Row className="font-semibold text-[1.6rem]">
                     Ngày sinh
                  </Row>
                }>
                <DatePicker 
                   size="large" 
                   format="DD/MM/YYYY" 
                   placeholder="01/01/1990" 
                   className="w-full" />
            </Form.Item>
            <Form.Item 
              className="mb-0 w-full xl:w-[60%]"
              label={
                  <Row className="font-semibold text-[1.6rem]">
                     Địa chỉ
                     <Row className="text-red-500 ml-3">*</Row>
                  </Row>
                }>
              <Row gutter={{xs: 0, md: 16}}>
                <Col xs={24} md={8}>
                  <Form.Item
                      name="province"
                      required={false}
                      rules={[yupSync]}>
                      <Select
                          showSearch
                          size="large"
                          className="w-full text-[1.6rem]"
                          placeholder="Tỉnh/Thành Phố"
                          optionFilterProp="children"
                          onChange={onChangeProvince}
                          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                          filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                          }>
                          {
                            provinceList.map((item) => (
                              <Option key={item.code} value={item.code} className="text-[1.6rem]">{item.name}</Option>
                            ))
                          }
                        </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="district"
                    required={false}
                    rules={[yupSync]}>
                    <Select
                        showSearch
                        size="large"
                        className="w-full text-[1.6rem]"
                        placeholder="Quận/Huyện"
                        optionFilterProp="children"
                        onChange={onChangeDistrict}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }>
                        {
                          districtList.map((item) => (
                            <Option key={item.code} value={item.code} className="text-[1.6rem]">{item.name}</Option>
                          ))
                        }
                      </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="commune"
                    required={false}
                    rules={[yupSync]}>
                    <Select
                        showSearch
                        size="large"
                        className="w-full text-[1.6rem]"
                        placeholder="Phường/Xã"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                          optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }>
                        {
                          communeList.map((item) => (
                            <Option key={item.code} value={item.code} className="text-[1.6rem]">{item.name}</Option>
                          ))
                        }
                      </Select>
                  </Form.Item>
                </Col>
              </Row>
           </Form.Item>
           <Form.Item
                name="phone"
                className="w-full md:w-1/2 lg:w-1/3"
                required={false}
                rules={[yupSync]}
                label={
                  <Row className="font-semibold text-[1.6rem]">
                     Số điện thoại
                     <Row className="text-red-500 ml-3">*</Row>
                  </Row>
                }>
                <Input size="large" placeholder="0366057503" className="rounded" />
            </Form.Item>
           <Form.Item
                name="email"
                className="w-full md:w-1/2 lg:w-1/3"
                required={false}
                rules={[yupSync]}
                label={
                  <Row className="font-semibold text-[1.6rem]">
                     Email đăng nhập
                     <Row className="text-red-500 ml-3">*</Row>
                  </Row>
                }>
                <Input size="large" placeholder="admin@gmail.com" className="rounded" />
            </Form.Item>
            {
              action !== 'edit' && (
                <>
                <Form.Item
                    name="password"
                    className="w-full md:w-1/2 lg:w-1/3"
                    required={false}
                    rules={[yupSync]}
                    label={
                      <Row className="font-semibold text-[1.6rem]">
                        Mật khẩu
                        <Row className="text-red-500 ml-3">*</Row>
                      </Row>
                    }>
                    <Input.Password size="large" placeholder="admin@123" className="rounded" />
                </Form.Item>
                <Form.Item
                    name="rePassword"
                    className="w-full md:w-1/2 lg:w-1/3"
                    required={false}
                    rules={[yupSync]}
                    label={
                      <Row className="font-semibold text-[1.6rem]">
                        Nhập lại mật khẩu
                        <Row className="text-red-500 ml-3">*</Row>
                      </Row>
                    }>
                    <Input.Password size="large" placeholder="admin@123" className="rounded" />
                </Form.Item>
                </>
              )
            }
            <Form.Item
                name="idcard"
                className="w-full md:w-1/2 lg:w-1/3"
                required={false}
                rules={[yupSync]}
                label={
                  <Row className="font-semibold text-[1.6rem]">
                     Số CMT/CCCD
                     <Row className="text-red-500 ml-3">*</Row>
                  </Row>
                }>
                <Input size="large" placeholder="0123456789" className="rounded" />
            </Form.Item>
            <Row className="flex flex-col md:flex-row !mt-10">
              <Form.Item>
                  <Button 
                      size="large" 
                      onClick={() => form.resetFields()}
                      className="flex items-center justify-center md:mr-5 w-full md:w-[100px] bg-inherit text-black hover:bg-inherit hover:text-black hover:border-inherit border-inherit hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                      <MdDeleteOutline className="mr-3 text-[2rem]" />
                      Xóa
                  </Button>
              </Form.Item>
              <Form.Item>
                  <Button 
                      size="large" 
                      htmlType="submit"
                      className="flex items-center justify-center w-full md:min-w-[100px] bg-[#154c79] text-white hover:bg-[#154c79] hover:text-white hover:border-[#154c79] hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                      <FiSave className="mr-3 text-[2rem]" />
                      {action === 'edit' ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                  </Button>
              </Form.Item>
            </Row>
        </Form>
    </Space>
    </Spin>
  )
}

export default AddAdminForm