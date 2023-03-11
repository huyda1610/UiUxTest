import React, { useEffect, useState, useRef } from 'react'

import {
  Card,
  Checkbox,
  Typography,
  Avatar,
  Select,
  Button,
  Col,
  Row,
  Table,
  Empty,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Radio,
  message,
  Popconfirm,
  Tooltip,
  AutoComplete,
  Descriptions,
  Divider
} from 'antd'
import {
  InfoCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  CloseOutlined
} from '@ant-design/icons'

import { getCustomers, addCustomer, deleteCustomer, updateCustomer } from 'apis/customer'

import dayjs from 'dayjs';

import { removeAccents } from 'utils'

const dateFormat = "DD-MM-YYYY"

const renderItem = (item) => ({
  value: item.customer_id,
  name: item.last_name,
  phone: item.phone,
  label: (
    <>
      <Row justify="left" style={{paddingLeft: 15}}>
        <Col span={1}>
          <Avatar
            size={40}
            style={{ backgroundColor: '#118cfc' }}
            icon={<UserOutlined />}
          />
        </Col>
        <Col span={23}>
          <Row justify="center">
            <Col span={24}>
              <Typography.Text>
                {item.last_name ? item.last_name : 'Not defined'}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text strong>{item.phone}</Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  ),
})

const Customer = ({getSelectCustomer}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isLoading, setLoading] = useState(false)
  const [customers, setCustomer] = useState([])
  const [isUpdate, setUpdate] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState({})

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const [formBranch] = Form.useForm()

  getSelectCustomer(selectedCustomer)
  const _getCustomers = async () => {
    try {
      const res = await getCustomers()

      if (res.status === 200) {
        setCustomer(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _addCustomer = async (body) => {
    setLoading(true)
    try {
      const res = await addCustomer({ ...body, first_name: 'Khách hàng' })
      if (res.status === 200) {
        message.success('Thêm thành công')
        formBranch.resetFields()
        toggleModal()
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Thêm thất bại')
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _updateCustomer = async (body) => {
    setLoading(true)
    try {
      const res = await updateCustomer(body.customer_id, { ...body, first_name: 'Khách hàng'  })
      if (res.status === 200) {
        message.success(`Thay đổi thành công khách hàng ${selectedCustomer.last_name}`)
        formBranch.resetFields()
        toggleModal()
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Thay đổi thất bại')
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _deleteCustomer = async (body) => {
    setLoading(true)
    try {
      const res = await deleteCustomer(body.customer_id)
      if (res.status === 200) {
        message.success(`Xoá thành công khách hàng ${body.last_name}`)
        setSelectedCustomer({})
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Xoá thất bại')
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const customerOnSelect = (id) => {
    const selectCustomer = customers.find((item) => item.customer_id === id)
    setSelectedCustomer(selectCustomer)
  }

  const onCreate = () => {
    setUpdate(false)
    formBranch.resetFields()
    toggleModal() 
  }

  const onUpdate = () => {
    setUpdate(true)
    formBranch.setFieldsValue({...selectedCustomer, birthday : dayjs(selectedCustomer.birthday, dateFormat)})
    toggleModal()
  }

  const onDelete = () => {
    _deleteCustomer(selectedCustomer)
  }

  const modalFinish = (values) => {
    isUpdate ? _updateCustomer({...values,customer_id: selectedCustomer.customer_id}) : _addCustomer(values)
  }

  useEffect(() => {
    _getCustomers()
  }, [])

  useEffect(() => {
    Object.keys(selectedCustomer).length > 0 
      && setSelectedCustomer([...customers].find((item) => item.customer_id === selectedCustomer.customer_id))
  }, [customers])



  const options = [
    {
      label: (
        <Button
          type="text"
          icon={<PlusCircleOutlined style={{ color: '#118cfc' }} />}
          onClick={onCreate}
          style={{ backgroundColor: 'transparent' }}
        >
          <Typography.Text style={{ color: '#118cfc' }}>Thêm mới khách hàng</Typography.Text>
        </Button>
      ),
    },
    ...customers.map((item) => (renderItem(item)))
  ]

  return (
    <>
      <Modal
        title={<Typography.Title level={4}>{isUpdate ? "Cập nhật" : "Thêm"} khách hàng</Typography.Title>}
        onCancel={toggleModal}
        visible={isModalOpen}
        footer={
          <Row justify="space-between">
            <Col offset={1}>
              <Button size="large" onClick={() => formBranch.resetFields()} danger disabled={isUpdate}>
                Đặt lại
              </Button>
            </Col>
            <Col>
              <Space size="middle">
                <Button
                  size="large"
                  onClick={toggleModal}
                  style={{ color: '#0088fe', borderColor: '#0088fe' }}
                >
                  Thoát
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => formBranch.submit()}
                  loading={isLoading}
                >
                  {isUpdate ? "Cập nhật" : "Thêm"}
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={modalFinish}
          form={formBranch}
        >
          <Form.Item
            label="Name"
            name="last_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            required
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: new RegExp(/^[0-9]*$/), message: 'Số điện thoại chưa đúng format' },
            ]}
          >
            <Input placeholder="Nhập số đện thoại" />
          </Form.Item>
          <Form.Item label="Type" name="first_name">
            <Select defaultValue="Khách hàng" disabled>
              <Select.Option value="Khách hàng">Khách hàng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            required
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Radio.Group>
              <Radio value="female">Female</Radio>
              <Radio value="male">Male</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthday"
            required
            rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh' }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        headStyle={{
          borderBottom: 'none',
        }}
        bodyStyle={{
          padding: '0px 24px 24px 24px',
        }}
        bordered={false}
        style={{
          width: '100%',
          height: 430,
        }}
        title={<Typography.Title level={4}>Thông tin khách hàng</Typography.Title>}
        extra={
          <Checkbox style={{ paddingTop: 5 }}>
            <Space size='large'>
              <Typography.Title level={4}>
                PHÁT HÀNH HOÁ ĐƠN ĐIỆN TỬ
                <Tooltip title="Tick chọn để phát hành hoá đơn điện tử">
                  <InfoCircleOutlined style={{ fontSize: '12px', color: '#64a6fa' }} />
                </Tooltip>
              </Typography.Title>
            </Space>
          </Checkbox>
        }
      >
        {Object.keys(selectedCustomer).length === 0  ? (
          <>
            <AutoComplete
              dropdownMatchSelectWidth={500}
              style={{ width: '100%' }}
              options= {options}
              filterOption={(input, option) => {
                return removeAccents(option?.name ?? '',true).toLowerCase().includes(
                  removeAccents(input,true).toLowerCase())
                  || removeAccents(option?.phone ?? '',true).toLowerCase().includes(
                    removeAccents(input,true).toLowerCase())
              }}
              onSelect={customerOnSelect}
              >
              <Input 
                size="large" 
                placeholder="Tìm theo tên, SĐT, mã khách hàng ... (F4)" 
                prefix={<SearchOutlined />}
            />
            </AutoComplete>
            <Empty
              image={<IdcardOutlined />}
              imageStyle={{
                fontSize: 120,
                height: '100%',
                color: '#e8e9eb',
              }}
              description={
                <Typography.Text style={{ color: '#c7c8ce' }}>
                  Chưa có thông tin khách hàng
                </Typography.Text>
              }
            />
          </>
        ) : (
          <Descriptions 
            title={
              <>
                <Row justify='space-between'>
                  <Col>
                    <Typography.Title level={4}>
                      <a href=""style={{color: "#0088ff"}}>{selectedCustomer.last_name}</a> - {selectedCustomer.phone} <Button type="text" icon={<CloseOutlined />} onClick={() => setSelectedCustomer({})}/>
                    </Typography.Title>
                  </Col>
                  <Col>
                    <Space>
                      <Button type="primary" onClick={onUpdate}>Cập nhật</Button>
                      <Button danger onClick={onDelete}>Xoá</Button>
                    </Space>
                  </Col>
                </Row>
              </>
            }
            size="large"
            bordered
          >
            <Descriptions.Item label="Birthday">{selectedCustomer.birthday}</Descriptions.Item>
            <Descriptions.Item label="Gender">{selectedCustomer.gender}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedCustomer.email ? selectedCustomer.email : "***********"}</Descriptions.Item>
            <Descriptions.Item label="Create Date">{selectedCustomer.create_date}</Descriptions.Item>
            <Descriptions.Item label="Last Update">{selectedCustomer.last_update}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </>
  )
}

export default Customer
