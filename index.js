import React, { useEffect, useState } from 'react'

import Customer from './customer'
import Company from './company'
import Product from './product'

import {
  Layout,
  Grid,
  notification,
  Menu,
  Col,
  Row,
  Button,
  Typography,
  Space,
  Dropdown,
  Affix,
  Modal,
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { encryptText } from 'utils'

import styles from './../UiUxTest/uiuxtest.module.scss'
import { addOrder } from 'apis/order'
import { getAllBranch } from 'apis/branch' 
import './custom-antd_test.css'
const { Header, Content } = Layout
const { useBreakpoint } = Grid

const menu = (
  <Menu>
    <Menu.Item key="1">Tạo đơn hàng</Menu.Item>
    <Menu.Item key="2">Tạo đơn hàng và duyệt</Menu.Item>
  </Menu>
)

const UiUxTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [branch, setBranch] = useState([])

  const [selectCustomer, setSelectedCustomer] = useState({})
  const [selectProduct, setSelectProduct] = useState({})
  const [clearData, setClearData] = useState(false)

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const { xl } = useBreakpoint()

  const _getAllBranch = async () => {
    const res = await getAllBranch()

    try {
      if (res.status === 200) {
        setBranch(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _addOrder = async (data) => {
    setLoading(true)
    const totalDiscount = data.order_details.reduce(
      (value, current) => value + current.discount * current.quantity,
      0
    )
    const totalCost = data.order_details.reduce(
      (value, current) => value + current.price * current.quantity,
      0
    )
    const finalCost = Math.round((totalCost - totalDiscount)/ 1000) * 1000
    const body = {
      ...data,
      branch_id: -1,
      sale_location: branch.length === 1 ? branch[0] : {},
      refund_from_order_id: null,
      is_refund: false,
      payments: [
        {
          name: 'Tiền mặt',
          value: 39000,
          payment_method_id: -1,
        },
      ],
      is_auto_create_shipping: false,
      voucher: 0,
      total_cost: totalCost,
      discount_product: totalDiscount,
      fee_shipping: 0,
      total_tax: 0,
      total_discount: 0,
      final_cost: finalCost,
      customer_paid: 39000,
      customer_debt: 0,
      bill_status: 'COMPLETE',
      ship_status: 'DRAFT',
      note: '',
      tags: [],
      channel: 'POS',
      is_delivery: false,
      list_tax: [],
      fee_shipping: 0,
    }

    const bodyEncryption = encryptText(JSON.stringify(body))
    try {
      const res = await addOrder({ order: bodyEncryption })
      if (res.status === 200) {
        notification.success({ message: 'Tạo đơn hàng thành công', placement: 'top' })
        setClearData(true)
      } else {
        notification.error({
          message: res.data.message || 'Tạo đơn hàng thất bại',
          placement: 'top',
        })
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const createOrder = () => {
    if (Object.keys(selectCustomer).length === 0) {
      notification.warning({ message: 'Vui lòng chọn khách hàng', placement: 'top' })
      return
    }
    if (selectProduct.length === 0) {
      notification.warning({ message: 'Vui lòng chọn sản phẩm', placement: 'top' })
      return
    }
    const orderDetails = selectProduct.map((item) => {
      let formatData = {}
      formatData = {
        ...item,
        quantity: item.sale_quantity,
      }
      return formatData
    })
    const data = {
      customer_info: { ...selectCustomer },
      order_details: orderDetails,
      channel: 'Chi nhánh 1',
      customer_id: 7,
    }
    _addOrder(data)
  }

  const getSelectCustomer = (data) => {
    setSelectedCustomer(data)
  }

  const getSelectProduct = (data) => {
    setSelectProduct(data)
  }

  useEffect(() => {
    _getAllBranch()
  },[])

  return (
    <>
      <Modal
        onCancel={toggleModal}
        maskClosable={false}
        visible={isModalOpen}
        width={640}
        footer={null}
        bodyStyle={{
          backgroundImage: 'url(https://i.ibb.co/JR2wmPv/3686725.jpg)',
          height: 420,
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Row
          align="middle"
          justify="space-between"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Col span={20}>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
              Chỉ với 7 bước nhanh chóng bạn đã có thể tạo đơn và giao hàng
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Text strong>
              Cùng khám phá điều bất ngờ tại cuối hướng dẫn này nhé
            </Typography.Text>
          </Col>
          <br />
          <br />
          <Col span={24}>
            <Button type="primary" size="large" onClick={toggleModal}>
              Xem hướng dẫn
            </Button>
          </Col>
        </Row>
      </Modal>
      <Layout>
        <Affix>
          <Header className={styles['header_style']}>
            <Row justify="space-between">
              <Col>
                <Typography.Text style={{ color: '#7e858f', fontSize: 14 }} strong>Tạo đơn hàng</Typography.Text>
              </Col>
              <Col flex="auto"></Col>
              <Col>
                <Space size="middle">
                  <Button size="large" style={{ color: '#0088fe' , borderColor: "#0088fe"}}>
                    Thoát
                  </Button>
                  <Dropdown.Button
                    icon={<DownOutlined />}
                    type="primary"
                    size="large"
                    overlay={menu}
                    onClick={createOrder}
                    loading={isLoading}
                  >
                    <Typography.Text strong style={{color: "#fff"}}>Tạo đơn hàng (F1)</Typography.Text>
                  </Dropdown.Button>
                </Space>
              </Col>
            </Row>
          </Header>
        </Affix>
        <Content className={styles['content_style']}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={16}>
              <Customer getSelectCustomer={getSelectCustomer} clearData={clearData}/>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={8}
              style={{ paddingTop: !xl ? '3%' : 0, paddingLeft: xl ? '2%' : 0 }}
            >
              <Company />
            </Col>
            <Col span={24}>
              <Product getSelectProduct={getSelectProduct} clearData={clearData}/>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  )
}

export default UiUxTest
