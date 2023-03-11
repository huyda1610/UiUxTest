import React from 'react'

import { 
  Card, 
  Typography,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
} from 'antd';
import { SettingOutlined  } from '@ant-design/icons';

import { Scrollbars } from 'rc-scrollbars';

const dataBranch = ['Công ty A','Công ty B','Công ty C','Công ty D', 'Công ty E','Công ty F']

const dataUser = ['Công ty Kho Vận SG','Công ty Kho Vận SGL','Công ty Kho Vận Oma','Công ty Kho Vận HCM','Công ty Kho Vận Alpha','Công ty Kho Vận Beta']

const dataSource = ['Web','Mobile','Other']

const Company = () => {
  return (
    <Card
      headStyle={{
        borderBottom: "none"
      }}
      bodyStyle={{
        padding: "0px 24px 24px 24px"
      }}
      bordered = {false}
      style={{
        width: '100%',
        height: 430,
        marginRight: 30
        
      }}
      title={<Typography.Title level={4}>Thông tin bổ sung</Typography.Title>}
      extra={
        <SettingOutlined style={{ fontSize: '35px', color: '#d2d4d7' }}/>
      }
    >
      <Scrollbars style={{ height: '330px' }}>
        <Form style={{ width: '100%' }} layout="vertical" size="large">
        <Row
          style={{
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: "2%"
          }}
        >
          <Col span={6}>
            <Typography.Title level={5} style={{marginBottom: 0}}>Bán tại</Typography.Title>
          </Col>
          <Form.Item style={{ marginBottom: 0 }} name="branch_id">
            <Col span={18}>
              <Select
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size='large'
                style={{ width: 370 }}
                defaultValue={dataBranch[0]}
              >
                {dataBranch.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Form.Item>
        </Row>
        <Row
          style={{
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: "2%"
          }}
        >
          <Col span={6}>
            <Typography.Title level={5} style={{marginBottom: 0}}>Bán bởi</Typography.Title>
          </Col>
          <Form.Item style={{ marginBottom: 0 }} name="user_id">
            <Col span={10}>
              <Select
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size='large'
                style={{ width: 370 }}
                defaultValue={dataUser[0]}
              >
                {dataUser.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Form.Item>
        </Row>
        <Row
          style={{
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: "2%"
          }}
        >
          <Col span={6}>
            <Typography.Title level={5} style={{marginBottom: 0}}>Nguồn</Typography.Title>
          </Col>
          <Form.Item style={{ marginBottom: 0 }} name="source">
            <Col span={10}>
              <Select
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size='large'
                style={{ width: 370 }}
                defaultValue={dataSource[0]}
              >
                {dataSource.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Form.Item>
        </Row>
        <Row
          style={{
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: "2%"
          }}
        >
          <Col span={6}>
            <Typography.Title level={5} style={{marginBottom: 0}}>Hẹn giao</Typography.Title>
          </Col>
          <Form.Item style={{ marginBottom: 0 }} name="delivery_date">
            <Col span={10}>
              <DatePicker style={{ width: 370 }} format={"DD-MM-YYYY"}/>
            </Col>
          </Form.Item>
        </Row>
        <Row
          style={{
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: "2%"
          }}
        >
          <Col span={6}>
            <Typography.Title level={5} style={{marginBottom: 0}}>Mã đơn</Typography.Title>
          </Col>
          <Form.Item style={{ marginBottom: 0 }} name="sale_order_code">
            <Col span={10}>
              <Input style={{ width: 370 }}/>
            </Col>
          </Form.Item>
        </Row>
        </Form>
      </Scrollbars>

    </Card>
  )
}

export default Company