import React, { useState } from 'react'
import { 
    Space,
    Button, 
    Breadcrumb,
    Descriptions,
    Row, 
    Grid,
    Modal 
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'
import EditUserInfo from '../EditUserInfo'
import './style.css'
import { HiOutlineClipboardList } from 'react-icons/hi'
import i18n from '../../../translation'

const UserInformation = ({userInfo}) => {
  const navigate = useNavigate()
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <Space 
        direction="vertical" 
        size="middle" 
        className="w-full h-full bg-white">
        <Breadcrumb className="my-10 px-10 py-2 bg-[#f8f8f8]">
            <Breadcrumb.Item href="/" className="text-[1.6rem]">{i18n.t('common.home')}</Breadcrumb.Item>
            <Breadcrumb.Item className="text-[1.6rem]">
               {i18n.t('userInfo.title')}
            </Breadcrumb.Item>
            <Breadcrumb.Item className="text-[1.6rem] font-semibold">
               {`${userInfo?.fullName} (ID: ${userInfo?.userId})`}
            </Breadcrumb.Item>
         </Breadcrumb>
        <Row className="w-full flex justify-end mb-5">
            <Button 
                size="large" 
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center text-[1.6rem] !text-white !bg-colorTheme !border-colorTheme rounded hover:opacity-90 hover:border-colorTheme hover:bg-colorTheme hover:text-white hover:shadow-md">
                <FiEdit className="mr-3 text-[2rem]" />
                {i18n.t('userInfo.editButton')}
            </Button>
        </Row>
        <Descriptions title={i18n.t('userInfo.infoDetail')} layout={screens.md ? 'horizontal' : 'vertical'} bordered>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.fullName')}</Row>} 
               span={12} 
               className="text-[1.6rem] w-[200px]">
               {userInfo?.fullName}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.id')}</Row>}  
               span={12} 
               className="text-[1.6rem]">
               {`ID: ${userInfo?.userId}`}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.birthday')}</Row>}  
               span={12} 
               className="text-[1.6rem]">
               {userInfo?.birthday}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.email')}</Row>}
               span={12} 
               className="text-[1.6rem]">
               {userInfo?.email}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.phone')}</Row>}
               span={12} 
               className="text-[1.6rem]">
               {userInfo?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.idCard')}</Row>}
               span={12} 
               className="text-[1.6rem]">
               {userInfo?.idCard}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('common.address')}</Row>}
               span={12} 
               className="text-[1.6rem]">
               {userInfo?.address}
            </Descriptions.Item>
            <Descriptions.Item 
               label={<Row className="font-semibold">{i18n.t('userInfo.order')}</Row>}
               span={12} 
               className="text-[1.6rem]">
               <Row 
                 onClick={() => navigate('/listOrderUser')}
                 className="text-blue-500 cursor-pointer flex items-center">
                 <HiOutlineClipboardList className="mr-3 text-[2rem]" />
                 {i18n.t('userInfo.orderList')}
               </Row>
            </Descriptions.Item>
        </Descriptions>
        <Row className="flex justify-end mb-10">
            <Button 
               size="large"
               onClick={() => navigate(`/userDeleteAccount?id=${userInfo?.id}`)}
               className="w-full md:w-fit bg-white text-red-500 border-red-500 rounded hover:text-red-500 hover:bg-white hover:border-red-500 hover:opacity-90 text-[1.6rem] hover:shadow-md">
               {i18n.t('userInfo.deleteAccount')}
            </Button>
        </Row>
        <Modal
            title={i18n.t('userInfo.modalTitle')}
            className="my-20"
            centered
            visible={modalOpen}
            footer={false}
            onCancel={() => setModalOpen(false)}>
            <EditUserInfo />
        </Modal>
    </Space>
  )
}

export default UserInformation