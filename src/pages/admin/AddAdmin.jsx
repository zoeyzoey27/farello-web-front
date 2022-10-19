import React, { useState } from 'react'
import { Layout, Grid, Drawer, BackTop, Row, Spin } from 'antd'
import Topbar from '../../components/admin/Topbar'
import MenuAdmin from '../../components/admin/MenuAdmin'
import AddAdminForm from '../../components/admin/AddAdminForm'
import { AiOutlineToTop } from 'react-icons/ai'
import { useSearchParams } from 'react-router-dom'

const AddAdmin = () => {
  const { useBreakpoint } = Grid
  const { Sider } = Layout
  const screens = useBreakpoint()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(action === 'edit' ? true : false)
  const [ visible, setVisible ] = useState(false)
  const onOpen = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }
  return (
    <Spin spinning={loading} size="large">
      <Layout className="max-w-screen min-h-screen">
      <Topbar onClick={onOpen} />
      <Layout className="w-hull h-full">
      {screens.lg && (
        <Sider
          id="side-bar"
          className="bg-white text-center lg:h-auto lg:relative w-[0px] lg:!min-w-[250px]">
          <MenuAdmin />
        </Sider>
      )}
      {!screens.lg && (
        <Drawer
          title="Menu"
          placement="right"
          width={320}
          onClose={onClose}
          visible={visible}>
          <MenuAdmin />
        </Drawer>
      )}
      <Layout className="m-10">
        <AddAdminForm setLoading={setLoading} action={action} id={id} />
      </Layout>
      </Layout>
      <BackTop>
          <Row className="w-[40px] h-[40px] rounded-full border-2 border-colorTheme text-colorTheme flex justify-center items-center hover:bg-colorTheme hover:text-white hover:shadow-lg">
             <AiOutlineToTop className="text-[2rem] font-semibold" />
          </Row>
       </BackTop>
    </Layout>
    </Spin>
  )
}

export default AddAdmin