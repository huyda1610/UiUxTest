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
  Divider,
} from 'antd'
import {
  InfoCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import { getCustomers, addCustomer, deleteCustomer, updateCustomer } from 'apis/customer'

import dayjs from 'dayjs'

import { removeAccents } from 'utils'

const dateFormat = 'DD-MM-YYYY'

const renderItem = (item) => ({
  value: item.customer_id,
  name: item.last_name,
  phone: item.phone,
  label: (
    <>
      <Row justify="left" style={{ paddingLeft: 15}}>
        <Col span={1}>
          <Avatar size={40} style={{ backgroundColor: '#118cfc' }} icon={<UserOutlined />} />
        </Col>
        <Col span={23}>
          <Row justify="center">
            <Col span={24}>
              <Typography.Text>{item.last_name ? item.last_name : 'Not defined'}</Typography.Text>
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

const Customer = ({ getSelectCustomer, clearData }) => {
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
      const res = await addCustomer({ ...body, first_name: 'Kh??ch h??ng' })
      if (res.status === 200) {
        message.success('Th??m th??nh c??ng')
        formBranch.resetFields()
        toggleModal()
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Th??m th???t b???i')
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
      const res = await updateCustomer(body.customer_id, { ...body, first_name: 'Kh??ch h??ng' })
      if (res.status === 200) {
        message.success(`Thay ?????i th??nh c??ng kh??ch h??ng ${selectedCustomer.last_name}`)
        formBranch.resetFields()
        toggleModal()
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Thay ?????i th???t b???i')
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
        message.success(`Xo?? th??nh c??ng kh??ch h??ng ${body.last_name}`)
        setSelectedCustomer({})
        _getCustomers()
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Xo?? th???t b???i')
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
    formBranch.setFieldsValue({
      ...selectedCustomer,
      birthday: dayjs(selectedCustomer.birthday, dateFormat),
    })
    toggleModal()
  }

  const onDelete = () => {
    _deleteCustomer(selectedCustomer)
  }

  const modalFinish = (values) => {
    isUpdate
      ? _updateCustomer({ ...values, customer_id: selectedCustomer.customer_id })
      : _addCustomer(values)
  }

  useEffect(() => {
    _getCustomers()
  }, [])

  useEffect(() => {
    Object.keys(selectedCustomer).length > 0 &&
      setSelectedCustomer(
        [...customers].find((item) => item.customer_id === selectedCustomer.customer_id)
      )
  }, [customers])

  useEffect(() => {
    clearData && setSelectedCustomer({})
  }, [clearData])

  const options = [
    {
      label: (
        <>
          <Button
            type="text"
            size='large'
            icon={<PlusCircleOutlined style={{ color: '#118cfc' }} />}
            onClick={onCreate}
            style={{ backgroundColor: 'transparent' }}
          >
            <Typography.Text style={{ color: '#118cfc' }}>Th??m m???i kh??ch h??ng</Typography.Text>
          </Button>
        </>
      ),
    },
    ...customers.map((item) => renderItem(item)),
  ]

  return (
    <>
      <Modal
        title={
          <Typography.Title level={4}>{isUpdate ? 'Thay ?????i' : 'Th??m'} kh??ch h??ng</Typography.Title>
        }
        onCancel={toggleModal}
        visible={isModalOpen}
        footer={
          <Row justify="space-between">
            <Col offset={1}>
              <Button
                size="large"
                onClick={() => formBranch.resetFields()}
                danger
                disabled={isUpdate}
              >
                ?????t l???i
              </Button>
            </Col>
            <Col>
              <Space size="middle">
                <Button
                  size="large"
                  onClick={toggleModal}
                  style={{ color: '#0088fe', borderColor: '#0088fe' }}
                >
                  Tho??t
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => formBranch.submit()}
                  loading={isLoading}
                >
                  {isUpdate ? 'Thay ?????i' : 'Th??m'}
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
            rules={[{ required: true, message: 'Vui l??ng nh???p t??n!' }]}
          >
            <Input placeholder="Nh???p t??n" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            required
            rules={[
              { required: true, message: 'Vui l??ng nh???p s??? ??i???n tho???i' },
              { pattern: new RegExp(/^[0-9]*$/), message: 'S??? ??i???n tho???i ch??a ????ng format' },
            ]}
          >
            <Input placeholder="Nh???p s??? ?????n tho???i" />
          </Form.Item>
          <Form.Item label="Type" name="first_name">
            <Select defaultValue="Kh??ch h??ng" disabled>
              <Select.Option value="Kh??ch h??ng">Kh??ch h??ng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            required
            rules={[{ required: true, message: 'Vui l??ng ch???n gi???i t??nh!' }]}
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
            rules={[{ required: true, message: 'Vui l??ng nh???p ng??y th??ng n??m sinh' }]}
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
        title={<Typography.Title level={4}>Th??ng tin kh??ch h??ng</Typography.Title>}
        extra={
          <Checkbox style={{ paddingTop: 5 }}>
            <Space size="large">
              <Typography.Title level={4}>
                PH??T H??NH HO?? ????N ??I???N T???
                <Tooltip title="Tick ch???n ????? ph??t h??nh ho?? ????n ??i???n t???">
                  <InfoCircleOutlined style={{ fontSize: '12px', color: '#64a6fa' }} />
                </Tooltip>
              </Typography.Title>
            </Space>
          </Checkbox>
        }
      >
        {Object.keys(selectedCustomer).length === 0 ? (
          <>
            <AutoComplete
              dropdownMatchSelectWidth={500}
              style={{ width: '100%' }}
              options={options}
              filterOption={(input, option) => {
                return (
                  removeAccents(option?.name ?? '', true)
                    .toLowerCase()
                    .includes(removeAccents(input, true).toLowerCase()) ||
                  removeAccents(option?.phone ?? '', true)
                    .toLowerCase()
                    .includes(removeAccents(input, true).toLowerCase())
                )
              }}
              onSelect={customerOnSelect}
            >
              <Input
                size="large"
                placeholder="T??m theo t??n, S??T, m?? kh??ch h??ng ... (F4)"
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
                  Ch??a c?? th??ng tin kh??ch h??ng
                </Typography.Text>
              }
            />
          </>
        ) : (
          <>
            <Row>
              <Col span={24}>
                <div style={{ borderBottom: '1px solid black' }}>
                  <Row justify="space-between">
                    <Col>
                      <Typography.Title level={4}>
                        <a href="" style={{ color: '#0088ff' }}>
                          {selectedCustomer.last_name}
                        </a>{' '}
                        - {selectedCustomer.phone}{' '}
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={() => setSelectedCustomer({})}
                        />
                      </Typography.Title>
                    </Col>
                    <Col>
                      <Button danger onClick={onDelete}>
                        Xo??
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={24}>
                <Row style={{paddingTop: 10}}>
                  <Col span={17}>
                    <Typography.Title level={5}>
                      TH??NG TIN C?? NH??N <Button type='text'><Typography.Title level={5} style={{color: "#0088ff"}} onClick={onUpdate}>Thay ?????i</Typography.Title></Button>
                    </Typography.Title>
                    {[{title: "Ng??y sinh",value: selectedCustomer.birthday}, {title: "Gi???i t??nh",value: selectedCustomer.gender},
                      {title: "Email",value: selectedCustomer.email ? selectedCustomer.email : "***********"}, {title: "Ng??y t???o t??i kho???n",value: selectedCustomer.create_date},
                      {title: "C???p nh???t sau c??ng",value: selectedCustomer.last_update},
                      ].map((item,index) => (
                        <Row justify='space-between' index={index}>
                          <Col span={6}>
                            <Typography.Text strong>{item.title}: </Typography.Text>
                          </Col>
                          <Col span={18}>
                            {item.value}
                          </Col>
                        </Row>
                      ))
                    }
                  </Col>
                  <Col span={7} style={{border: "1px dashed #bfc2c7", borderRadius: 5}}>
                    {
                      [{title: "N??? ph???i thu",value: 0},{title: "N??? ph???i thu",value: 0},
                      {title: "N??? ph???i thu",value: 0},{title: "N??? ph???i thu",value: 0}
                      ].map((item,index) => (
                        <Row index={index} justify='space-between' style={{padding: 10}}>
                          <Col span={23}>
                            <Typography.Text>{item.title}</Typography.Text>
                          </Col>
                          <Col span={1}>
                            {item.value}
                          </Col>
                        </Row>
                      ))
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </>
  )
}

export default Customer
