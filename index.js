import React,{useState} from 'react'

import Customer from './customer';
import Company from './company';
import Product from './product';


import { Layout,Grid ,Menu, Col, Row , Button, Typography, Space, Dropdown, Affix, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import styles from './../UiUxTest/uiuxtest.module.scss'
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
  const [isModalOpen, setIsModalOpen] = useState(true)

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const {xl} = useBreakpoint();

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
              <Customer/>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8} style={{paddingTop: !xl ?"3%" : 0, paddingLeft: xl ?"2%" : 0 }}>
              <Company/>
            </Col>
            <Col span={24}>
              <Product/>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  )
}

export default UiUxTest