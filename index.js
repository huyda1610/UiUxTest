import React,{useState} from 'react'

import Customer from './customer';
import Company from './company';
import Product from './product';


import { Layout,Grid,notification ,Menu, Col, Row , Button, Typography, Space, Dropdown, Affix, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import styles from './../UiUxTest/uiuxtest.module.scss'
import { addOrder } from 'apis/order';
import  './custom-antd_test.css'
const { Header, Content, } = Layout;
const { useBreakpoint } = Grid;

const menu = (
  <Menu>
    <Menu.Item key="1">Tạo đơn hàng</Menu.Item>
    <Menu.Item key="2">Tạo đơn hàng và duyệt</Menu.Item>
  </Menu>
);

const UiUxTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [selectCustomer, setSelectedCustomer] = useState({})
  const [selectProduct, setSelectProduct] = useState({})

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const {xl} = useBreakpoint();

  const _addOrder = async (data) => {
    setLoading(true)
    const body = {
      branch_id: -1,
      sale_location: {
        branch_id: -1,
        code: "0000-1",
        name: "Chi nhánh mặc định",
        logo: "https://upsale.com.vn/app/logo.png",
        phone: "",
        email: "",
        fax: "",
        website: "",
        latitude: "",
        longitude: "",
        warehouse_type: "Store",
        address: "",
        ward: "",
        district: "",
        province: "",
        accumulate_point: false,
        use_point: false,
        create_date: "2022-10-23T23:11:04+07:00",
        creator_id: -1,
        last_update: "2023-03-05T12:15:59+07:00",
        updater_id: -1,
        active: true,
        slug_name: "chi-nhanh-mac-dinh",
        slug_warehouse_type: "store",
        slug_address: "",
        slug_ward: "",
        slug_district: "",
        slug_province: "",
        district_id: "2264",
        district_info: {},
        lat: null,
        lng: null,
        province_id: 269,
        province_info: {},
        shop_ghn_id: null,
        slug_province_name: "",
        type: "Store",
        ward_code: 80213,
        ward_info: {}
      },
      refund_from_order_id: null,
      is_refund: false,
      payments:  [
        {
            name: "Tiền mặt",
            value: 39000,
            payment_method_id: -1
        }
      ],
      is_auto_create_shipping: false,
      voucher: "",
      // promotion_id: invoices[indexInvoice].discount
      //   ? invoices[indexInvoice].discount.promotion_id || ''
      //   : '',
      total_cost: "",
      discount_product: 3,
      fee_shipping: 0,
      total_tax: 0,
      total_discount: 0,
      final_cost: 0,
      customer_paid: 39000,
      customer_debt:0,
      bill_status: "COMPLETE",
      ship_status: "DRAFT",
      note: "",
      tags: [],
      channel: "POS",
      is_delivery: false,
      list_tax: [],
      fee_shipping: 0,
    }
    try {
      const res = await addOrder(body)
      if (res.status === 200) {
        notification.success({ message: 'Tạo đơn hàng thành công'})
      } else {
        notification.error({ message: 'Tạo đơn hàng thất bại'})
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const createOrder = () => {
    if (Object.keys(selectCustomer).length === 0) {
      notification.warning({ message: 'Vui lòng chọn khách hàng', placement: "top" })
      return
    }
    if (selectProduct.length === 0) {
      notification.warning({ message: 'Vui lòng chọn sản phẩm' , placement: "top"})
      return
    }
    const data = {
      // customer_info: {...selectCustomer},
      // order_details: [...selectProduct],
      channel: "Chi nhánh 1",
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

  return (
    <>
      <Modal 
        onCancel={toggleModal}
        maskClosable = {false}
        visible={isModalOpen}
        width={640}
        footer={null}
        bodyStyle={{ 
          backgroundImage: "url(https://i.ibb.co/JR2wmPv/3686725.jpg)",
          height: 420,
          backgroundRepeat: "no-repeat" 
        }}
      >
        <Row align="middle" justify="space-between" style={{ display: 'flex', flexDirection: 'column' }}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Col span={20}>
              <Typography.Title level={2} style={{ textAlign: 'center' }}>Chỉ với 7 bước nhanh chóng bạn đã có thể tạo đơn và giao hàng</Typography.Title>
          </Col>
          <Col span={24}>
              <Typography.Text strong>Cùng khám phá điều bất ngờ tại cuối hướng dẫn này nhé</Typography.Text>
          </Col>
          <br />
          <br />
          <Col span={24}>
              <Button type='primary' size='large' onClick={toggleModal}>Xem hướng dẫn</Button>
          </Col>
        </Row>
      </Modal>
      <Layout>
        <Affix>
          <Header className={styles["header_style"]}>
            <Row justify='space-between'>
              <Col>
                <Typography.Text style={{ color:"#999fa6" }}>Tạo đơn hàng</Typography.Text>
              </Col>
              <Col flex="auto"></Col>
              <Col>
                <Space size="middle">
                  <Button size='large' style={{ color: "#0088fe", borderColor: "#0088fe" }}>Thoát</Button>
                  <Dropdown.Button
                    icon={<DownOutlined />}
                    type="primary" 
                    size='large'
                    overlay={menu}
                    style={{ borderRadius: 0 }}
                    onClick={createOrder}
                  >
                    Tạo đơn hàng (F1)
                  </Dropdown.Button>
                </Space>
              </Col>
            </Row>
          </Header>
        </Affix>
        <Content className={styles["content_style"]}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={16}>
              <Customer getSelectCustomer={getSelectCustomer}/>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} style={{paddingTop: !xl ?"3%" : 0, paddingLeft: xl ?"2%" : 0 }}>
              <Company/>
            </Col>
            <Col span={24}>
              <Product getSelectProduct={getSelectProduct}/>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  )
}

export default UiUxTest