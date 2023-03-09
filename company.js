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

const data = [
  {
    branch_id: 'Công ty A',
    user_id: 'Công ty Kho Vận SG',
    source: 'Web',
    delivery_date: '03-06-2022',
    sale_order_code: "XYZ01",
  },
  {
    branch_id: 'Công ty B',
    user_id: 'Công ty Kho Vận SGL',
    source: 'Mobile',
    delivery_date: '16-06-2022',
    sale_order_code: "XYZ02",
  },
  {
    branch_id: 'Công ty C',
    user_id: 'Công ty Kho Vận Oma',
    source: 'Web',
    delivery_date: '08-09-2022',
    sale_order_code: "XYZ03",
  },
  {
    branch_id: 'Công ty D',
    user_id: 'Công ty Kho Vận HCM',
    source: 'Mobile',
    delivery_date: '16-10-1996',
    sale_order_code: "XYZ04",
  },  {
    branch_id: 'Công ty E',
    user_id: 'Công ty Kho Vận Alpha',
    source: 'Web',
    delivery_date: '37-01-2022',
    sale_order_code: "XYZ05",
  },
  {
    branch_id: 'Công ty F',
    user_id: 'Công ty Kho Vận Beta',
    source: 'Other',
    delivery_date: '09-12-2022',
    sale_order_code: "XYZ06",
  },

]
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
          // labelCol={{ span: 4 }}
          // wrapperCol={{ span: 19 }}
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
                defaultValue={data[0].branch_id}
              >
                {data.map((item, index) => (
                  <Select.Option key={index} value={item.branch_id}>
                    {item.branch_id}
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
                defaultValue={data[0].user_id}
              >
                {data.map((item, index) => (
                  <Select.Option key={index} value={item.user_id}>
                    {item.user_id}
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
                defaultValue={data[0].source}
              >
                {data.map((item, index) => (
                  <Select.Option key={index} value={item.source}>
                    {item.source}
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