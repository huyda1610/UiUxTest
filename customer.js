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
  Tooltip
} from 'antd'
import {
  InfoCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
  IdcardOutlined,
} from '@ant-design/icons'

import { getCustomers, addCustomer, deleteCustomer, updateCustomer } from 'apis/customer'

import dayjs from 'dayjs';

const dateFormat = "DD-MM-YYYY"

const Customer = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isLoading, setLoading] = useState(false)
  const [customers, setCustomer] = useState([])
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(false)
  const [isUpdate, setUpdate] = useState(false)
  const [customerId, setCustomerId] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const [formBranch] = Form.useForm()

  const onCreate = () => {
    setUpdate(false)
    formBranch.resetFields()
    toggleModal() 
  }

  const dropdownRender = (menu) => {
    return (
      <div>
        <Button
          type="text"
          icon={<PlusCircleOutlined style={{ color: '#118cfc' }} />}
          onClick={onCreate}
          style={{ backgroundColor: 'transparent' }}
        >
          <Typography.Text style={{ color: '#118cfc' }}>Thêm mới khách hàng</Typography.Text>
        </Button>
        {menu}
      </div>
    )
  }

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
      const res = await updateCustomer(customerId, { ...body, first_name: 'Khách hàng'  })
      if (res.status === 200) {
        message.success(`Thay đổi thành công khách hàng ${body.last_name}`)
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
    const index = tableData.findIndex((item) => item.customer_id === body.customer_id)
    try {
      const res = await deleteCustomer(body.customer_id)
      if (res.status === 200) {
        message.success(`Xoá thành công khách hàng ${body.last_name}`)
        _getCustomers()
        (index !== -1) && setSelectedTags([...selectedTags].slice(index,1))
      } else {
        res.data.message ? message.error(`${res.data.message}`) : message.error('Xoá thất bại')
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    _getCustomers()
  }, [])

  useEffect(() => {
    let data = []
    selectedTags.map((item) => data.push(customers[item]))
    data.sort((a, b) => a.customer_id - b.customer_id)
    setTableData(data)
  }, [selectedTags,customers])

  const modalChange = (values) => {
    isUpdate ? _updateCustomer(values) : _addCustomer(values)
  }

  const onUpdate = (id) => {
    setCustomerId(id)
    const data = customers.find((item) => item.customer_id === id)
    formBranch.setFieldsValue({...data,birthday : dayjs('2015/01/01', dateFormat)})
    setUpdate(true)
    toggleModal()
  }

  const handleDelete = (data) => {
    setCustomerId(data.customer_id)
    _deleteCustomer(data)
  }

  const columns = [
    {
      title: 'Customer Id',
      dataIndex: 'customer_id',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'last_name',
      align: 'center',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'first_name',
      align: 'center',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      align: 'center',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onUpdate(record.customer_id)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xoá khách hàng - Hành động này không thể thay đổi được"
            open={open}
            onConfirm={() => handleDelete(record)}
            okButtonProps={{
              loading: isLoading,
            }}
            onCancel={() => setOpen(false)}
          >
            <Button onClick={() => setOpen(true)} danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Modal
        title={<Typography.Title level={4}>{{isUpdate} ? "Cập nhật" : "Thêm"} khách hàng</Typography.Title>}
        onCancel={toggleModal}
        visible={isModalOpen}
        // width={1000}
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
                  {{isUpdate} ? "Cập nhật" : "Thêm"}
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
          onFinish={modalChange}
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
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={
            <>
              <SearchOutlined /> Tìm theo tên, SĐT, mã khách hàng ... (F4)
            </>
          }
          filterOption={(input, option) =>
            (option?.phone ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.customer_id ?? '').toLowerCase().includes(input.toLowerCase()) || 
            (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={name => setSelectedTags(name)}
          value={selectedTags}
          size="large"
          optionLabelProp="name"
          dropdownRender={dropdownRender}
        >
          {customers.map((item, index) => (
            <Select.Option
              key={index}
              phone={item.phone}
              name={item.last_name}
              id={item.customer_id}
              style={{ width: '20%', backgroundColor: 'transparent' }}
            >
              <Row justify="center">
                <Col xl={24} xxl={6}>
                  <Avatar
                    size={40}
                    style={{ backgroundColor: '#118cfc' }}
                    icon={<UserOutlined />}
                  />
                </Col>
                <Col xl={24} xxl={18}>
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
            </Select.Option>
          ))}
        </Select>
        <br />
        <br />
        {tableData.length === 0 ? (
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
        ) : (
          <Table
            size="small"
            columns={columns}
            dataSource={tableData}
            scroll={{ y: 205, x: 350 }}
          />
        )}
      </Card>
    </>
  )
}

export default Customer
