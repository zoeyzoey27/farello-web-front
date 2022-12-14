import React, { useState, useEffect } from 'react'
import { 
    Space, 
    Form, 
    Input, 
    Row, 
    Typography, 
    Button, 
    Upload, 
    Modal, 
    PageHeader,
    Breadcrumb,
    InputNumber,
    Select,
    message, 
} from 'antd'
import { schemaValidate } from '../../../validation/AddProduct'
import { converSchemaToAntdRule } from '../../../validation'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import { MdDeleteOutline } from 'react-icons/md'
import { FiSave } from 'react-icons/fi'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_PRODUCT, GET_CATEGORIES, GET_PRODUCT, UPDATE_PRODUCT } from './graphql'
import moment from 'moment'
import { DATE_TIME_FORMAT, DESC, EDIT, OUT_OF_STOCK, STOCKING } from '../../../constant'
import { uploadButton } from '../AddCategoryForm'
import i18n from '../../../translation'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
})

const AddProductForm = ({action, id, setLoading}) => {
  const children = []
  const { Option } = Select
  const [form] = Form.useForm()
  const [createProduct] = useMutation(CREATE_PRODUCT)
  const [updateProduct] = useMutation(UPDATE_PRODUCT)
  const navigate = useNavigate()
  const { Title } = Typography
  const { TextArea } = Input
  const yupSync = converSchemaToAntdRule(schemaValidate)
  const [fileList, setFileList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const { data: dataProduct } = useQuery(GET_PRODUCT, {
    variables: {
      productId: id
    },
    skip: id === null,
    onCompleted: () => {
      setLoading(false)
    }
  })
   
  const { data } = useQuery(GET_CATEGORIES, {
    variables: {
      categorySearchInput: {},
      skip: null,
      take: null,
      orderBy: {
        createdAt: DESC
      }
    }
  })

  useEffect (() => {
    if (dataProduct) {
      form.setFieldsValue({
        name: dataProduct?.product?.name,
        categoryId: dataProduct?.product?.category?.id,
        description: dataProduct?.product?.description,
        priceIn: dataProduct?.product?.priceIn,
        priceOut: dataProduct?.product?.priceOut,
        priceSale: dataProduct?.product?.priceSale,
        quantity: dataProduct?.product?.quantity,
        colours: dataProduct?.product?.colours,
      })
      const images = dataProduct?.product?.images
      const list = []
      for (let i=0; i<images.length; i++) {
        list.push({
          name: i18n.t('addProduct.image'),
          url: images[i]
        })
        setFileList(list)
      }
    }
  },[dataProduct, form])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  const handleChangeImages = ({ fileList: newFileList }) => setFileList(newFileList)
  const resetFields = () => {
    form.resetFields()
    setFileList([])
  }
  const onFinish = async (values) => {
    setLoading(true)
    const customId = 'SP' + Math.floor(Math.random() * Date.now())
    const fileListData = []
    const files = values.images.fileList
    for (let i=0; i<files.length; i++){
      const file = files[i]
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
        fileListData.push(file.preview)
      }
    }
    createProduct({
      variables: {
        productInput: {
          productId: customId,
          name: values.name,
          priceIn: values.priceIn,
          priceOut: values.priceOut,
          priceSale: values.priceSale,
          quantity: values.quantity,
          colours: values.colours,
          images: fileListData,
          description: values.description,
          categoryId: values.categoryId,
          status: values.quantity > 0 ? STOCKING : OUT_OF_STOCK,
          createdAt: moment().format(DATE_TIME_FORMAT),
          updatedAt: moment().format(DATE_TIME_FORMAT),
        }
      },
      onCompleted: () => {
        message.success(i18n.t('addProduct.message.addSuccessful'))
        resetFields()
        setLoading(false)
      },
      onError: (error) => {
        message.error(`${error.message}`)
        setLoading(false)
      },
    })
  }
  const onUpdate = async (values) => {
    setLoading(true)
    const fileListData = []
    if (values.images && fileList.length>0) {
      const files = values.images.fileList
      for (let i=0; i<files.length; i++){
        const file = files[i]
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
          fileListData.push(file.preview)
        }
        else fileListData.push(file.url)
      }
    }
    await updateProduct({
      variables: {
        updateProductId: id,
        productUpdateInput: {
          name: values.name,
          priceIn: values.priceIn,
          priceOut: values.priceOut,
          priceSale: values.priceSale,
          quantity: values.quantity,
          colours: values.colours,
          categoryId: values.categoryId,
          images: fileListData.length > 0 ? fileListData : dataProduct?.product?.images,
          description: values.description,
          status: values.quantity > 0 ? STOCKING : OUT_OF_STOCK,
          updatedAt: moment().format(DATE_TIME_FORMAT),
        }
      },
      onCompleted: () => {
        navigate("/admin/productManagement")
        message.success(i18n.t('addProduct.message.editingSuccessful'))
        setLoading(false)
      },
      onError: (error) => {
        message.error(`${error.message}`)
        setLoading(false)
      },
    })
  }
  return (
    <Space 
    direction="vertical" 
    size="middle" 
    className="w-full h-full bg-white p-10">
    <PageHeader
        className="p-0"
        backIcon={<LeftOutlined className="mb-3" />}
        onBack={() => navigate('/admin/productManagement')}
        title={
           <Title level={4} className="whitespace-pre-wrap">
              {action === EDIT ? i18n.t('addProduct.title.edit') : i18n.t('addProduct.title.addNew')}
           </Title>
        }
    />
    <Breadcrumb className="text-[1.6rem] mb-5">
      <Breadcrumb.Item 
        onClick={() => navigate('/admin/dashboard')}
        className="hover:text-black cursor-pointer">
        {i18n.t('common.dashboard')}
      </Breadcrumb.Item>
        <Breadcrumb.Item 
           onClick={() => navigate('/admin/productManagement')}
           className="hover:text-black cursor-pointer">
           {i18n.t('addProduct.heading')}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{action === EDIT ? i18n.t('addProduct.title.edit') : i18n.t('addProduct.title.addNew')}</Breadcrumb.Item>
    </Breadcrumb>
    <Row className="text-[1.6rem]">{i18n.t('common.enterInfo')}</Row>
    <Row className="mb-5 text-[1.6rem]">{i18n.t('common.subtitle')}</Row>
    <Form 
        layout='vertical' 
        form={form}
        autoComplete='off'
        onFinish={action === EDIT ? onUpdate : onFinish}>
        <Form.Item
            name="name"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            rules={[yupSync]}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.nameProduct')}
                 <Row className="text-red-500 ml-3">*</Row>
              </Row>
            }>
            <Input size="large" placeholder="Adagio" className="rounded" />
        </Form.Item>
        <Form.Item
            name="categoryId"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            rules={[yupSync]}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.category')}
                 <Row className="text-red-500 ml-3">*</Row>
              </Row>
            }>
            <Select size="large" placeholder={i18n.t('addProduct.glasses')} className="rounded" >
                {
                   data?.categories?.map((item) => (
                      <Option key={item.id} className="text-[1.6rem]">{item.name}</Option>
                   ))
                }
            </Select>
        </Form.Item>
        <Form.Item
            name="priceIn"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.priceIn')}
              </Row>
            }>
            <InputNumber size="large" placeholder="1750000" addonAfter="VND" className="w-full rounded" />
        </Form.Item>
        <Form.Item
            name="priceOut"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            rules={[yupSync]}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.priceOut')}
                 <Row className="text-red-500 ml-3">*</Row>
              </Row>
            }>
            <InputNumber size="large" placeholder="1750000" addonAfter="VND" className="w-full rounded" />
        </Form.Item>
        <Form.Item
            name="priceSale"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.priceSale')}
              </Row>
            }>
            <InputNumber size="large" placeholder="1750000" addonAfter="VND" className="w-full rounded" />
        </Form.Item>
        <Form.Item
            name="quantity"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            rules={[yupSync]}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.quantity')}
                 <Row className="text-red-500 ml-3">*</Row>
              </Row>
            }>
            <InputNumber size="large" placeholder="10" className="w-full rounded" />
        </Form.Item>
        <Form.Item
            name="colours"
            className="w-full md:w-1/2 lg:w-1/3"
            required={false}
            label={
              <Row className="font-semibold text-[1.6rem]">
                {i18n.t('addProduct.color')}
              </Row>
            }>
            <Select
              mode="tags"
              className="w-full"
              size="large"
              placeholder={i18n.t('addProduct.addColor')}>
              {children}
            </Select>
        </Form.Item>
        <Form.Item
            name="images"
            className="w-full"
            required={false}
            rules={fileList.length === 0 ? [yupSync] : false}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.image')}
                 <Row className="text-red-500 ml-3">*</Row>
              </Row>
            }>
             <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleChangeImages}>
                {fileList.length >=5 ? null : uploadButton}
            </Upload>
        </Form.Item>
        <Form.Item
            name="description"
            className="w-full lg:w-[50%]"
            required={false}
            label={
              <Row className="font-semibold text-[1.6rem]">
                 {i18n.t('addProduct.description')}
              </Row>
            }>
            <TextArea placeholder={i18n.t('addProduct.description')} className="resize-none text-[1.6rem] !h-[200px] rounded" />
        </Form.Item>
        <Row className="flex flex-col md:flex-row">
          <Form.Item>
              <Button 
                  size="large" 
                  onClick={resetFields}
                  className="flex items-center justify-center md:mr-5 w-full md:w-[100px] !bg-white !text-colorTheme hover:bg-colorTheme hover:text-white hover:border-colorTheme !border-colorTheme hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                  <MdDeleteOutline className="mr-3 text-[2rem]" />
                  {i18n.t('common.reset')}
              </Button>
          </Form.Item>
          <Form.Item>
              <Button 
                  size="large" 
                  htmlType="submit"
                  className="flex items-center justify-center w-full md:min-w-[100px] !bg-colorTheme !border-colorTheme !text-white hover:bg-colorTheme hover:text-white hover:border-colorTheme hover:opacity-90 !text-[1.6rem] hover:shadow-md rounded">
                  <FiSave className="mr-3 text-[2rem]" />
                  {action === EDIT ? i18n.t('common.saveChange') : i18n.t('common.save')}
              </Button>
          </Form.Item>
        </Row>
    </Form>
    <Modal centered visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel} width={1000}>
        <img src={previewImage} alt="" className="w-full h-full object-contain object-center"/>
    </Modal>
</Space>
  )
}

export default AddProductForm