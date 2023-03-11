import React, { useState } from 'react'
import { useEffect } from 'react'

import {
  Card,
  Typography,
  Checkbox,
  Space,
  Table,
  Form,
  Input,
  AutoComplete,
  Select,
  DatePicker,
  Image,
  Button,
  Row,
  Col,
  Empty,
  Modal,
  Divider,
  Pagination,
  InputNumber
} from 'antd'

import { SettingOutlined, SearchOutlined, FilterFilled, CloseOutlined } from '@ant-design/icons'

import { formatCash, removeAccents } from 'utils' 

import { getProducts } from 'apis/product'

const renderItem = (item) => ({
  value: item.name,
  id: item.product_id,
  label: (
    <>
      <Row justify="center">
        <Col span={4}>
          <img
            alt={item.name}
            width={'90%'}
            height={'120'}
            src={item.images[0]}
            loading="lazy"
            style={{border: "1px solid #5f73e2"}}
          />
        </Col>
        <Col span={18}>
          <Row justify="center">
            <br />
            <Col span={24}>
              <Typography.Text>
                ID: {item.product_id}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text strong>{item.name}</Typography.Text>
            </Col>
          </Row>
        </Col>
        {/* <Divider/> */}
      </Row>
      
    </>
  ),
})

const Product = ({getSelectProduct}) => {
  const [isLoading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProduct] = useState([])
  const [selectProducts, setSelectProducts] = useState([])
  const [tableData, setTableData] = useState([])
  const [productSearchValue, setProductSearchValue] = useState("")
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(50);
  const itemsPerPage = 10;

  getSelectProduct(tableData)

  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filterProduct = products.filter((item) => !tableData.map((item) => item.product_id).includes(item.product_id))

  const cardData = filterProduct.slice(startIndex,endIndex)
  const _getProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts(paramsFilter)
      if (res.status === 200) {
        const data = res.data.data.map((item) => {
          let formatData = {}
          formatData = {
            ...item,
            tax: Math.floor(Math.random() * 10 + 1),
            discount: Math.floor(Math.random() * 30),
          }
          return formatData
        })
        setProduct(data)
        setTotalItems(data.length)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearCheckBox = (arr) => {
    arr.map ((item) => {
      const check = document.getElementById(`Checkbox ${item.name}`)
      return check && check.checked && check.click()
    })
  }

  const handleClickCard = (name) => {
    document.getElementById(`Checkbox ${name}`).click()
  }

  const cardSelectOnChange = (value) => {
    const check1 = value.filter(elem => !(selectProducts.includes(elem)))
    const check2 = selectProducts.filter(elem => !(value.includes(elem)))
    if (value.length > selectProducts.length) {
      document.getElementById(`Checkbox ${check1}`).click()
    } else {
      document.getElementById(`Checkbox ${check2}`).click()
    }
    setSelectProducts(value)
  }

  const productOnSelect = (value) => {
    const data = products.find((item) => item.name.includes(value))
    const check = tableData.findIndex((item) => item.name.includes(value))
    if (check === -1) {
      setTableData([...tableData,data])
    }
    setProductSearchValue("")
  }

  const checkBoxChange = (e) => {
    let data = [...selectProducts]
    if(e.target.checked) {
      data.push(e.target.value)
    } else {
      data = data.filter((item) => !(removeAccents(item).toLowerCase().includes(
        removeAccents(e.target.value).toLowerCase())))
    }
    setSelectProducts(data)
  }

  const handleClickDone = () => {
    const data = products.filter(item => selectProducts.includes(item.name))
    setTableData([...tableData,...data])
    clearCheckBox(data)
    setSelectProducts([])
    toggleModal()
  }

  const handleClickModal = () => {
    toggleModal()
  }

  const removeTableItem = (id) => {
    const data = [...tableData]
    setTableData(data.filter((item) => item.product_id !== id))
  }

  const quantityChange = (id,value) => {
    const updateTableData = [...tableData].map((item) => {
      if (item.product_id === id) {
        return {...item, sale_quantity: value}
      }
      return item
    })
    setTableData(updateTableData)
  }

  const options = filterProduct.map((item) => (
    renderItem(item)
  ))

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      align: 'center',
      render: (url) => <Image src={url[0]} width={150} height={180} />,
    },
    {
      title: 'Giá bán (vnđ)',
      dataIndex: 'price',
      align: 'center',
      render: (price) => formatCash(price,"."),
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'sale_quantity',
      align: 'center',
      render: (_, record) => <InputNumber value={record.sale_quantity} min={0} onChange={(value) => quantityChange(record.product_id,value)}/>,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      align: 'center',
      render: (discount) => `${discount} %`,
    },
    {
      title: 'Thuế',
      dataIndex: 'tax',
      align: 'center',
      render: (tax) => `${tax} %`,
    },
    {
      title: 'Thành tiền (vnđ)',
      dataIndex: 'total',
      align: 'center',
      render: (_, record) =>
      formatCash(
        (record.price - record.discount * 0.01 * record.price - record.tax * 0.01 * record.price) *
        record.sale_quantity
      , "."),
    },
    {
      align: 'center',
      render: (_, record) =><Button type="text" icon={<CloseOutlined />} onClick={() => removeTableItem(record.product_id)} />,
      width: "5%",
    },
  ]

  useEffect(() => {
    _getProducts()
  }, [])

  return (
    <>
      <Modal
        title={<Typography.Title level={4}>Chọn sản phẩm để bán hàng</Typography.Title>}
        onCancel={toggleModal}
        visible={isModalOpen}
        width={1000}
        footer={
          <Row justify="space-between">
            <Col offset={1}>
              <Typography.Text style={{ color: '#0088fe' }}>
                Bạn đã chọn {selectProducts.length} sản phẩm
              </Typography.Text>
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
                <Button type="primary" size="large" onClick={handleClickDone}>
                  Chọn xong
                </Button>
              </Space>
            </Col>
          </Row>
        }
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={
            <>
              <SearchOutlined /> Tìm kiếm sản phẩm
            </>
          }
          size="large"
          onChange={cardSelectOnChange}
          value={selectProducts}
          filterOption={(input, option) =>
            removeAccents(option?.value ?? '',true).toLowerCase().includes(
              removeAccents(input,true).toLowerCase())
          }
        >
          {filterProduct.map((item, index) => (
            <Select.Option key={index} value={item.name}>
              <Typography.Text strong>{item.name}</Typography.Text>
            </Select.Option>
          ))}
        </Select>
        <Row justify='end' style={{paddingTop: 20}}>
          <Col>
            <Pagination
              size='small'
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onChange={handlePageChange}
            />
          </Col>
        </Row> 
        <Row justify={'center'}>
          {cardData.map((item, key) => {
            return (
              <Col xs={24} sm={16} md={12} lg={8} xl={6} key={key} style={{ padding: '20px' }}>
                <Card
                  hoverable
                  onClick={() => handleClickCard(item.name)}
                  bordered
                  cover={
                    <>
                      <img
                        alt={item.name}
                        width={'100%'}
                        height={'180'}
                        src={item.images[0]}
                        loading="lazy"
                        style={{border: "1px solid #5f73e2"}}
                      />
                      <Checkbox
                        value={item.name}
                        id={`Checkbox ${item.name}`}
                        onChange={checkBoxChange}
                        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                      />
                    </>
                  }
                  style={{borderColor:"#5f73e2"}}
                >
                  <Card.Meta title={item.name} />
                </Card>               
              </Col>
            )
          })}
          {filterProduct.length === 0 && <Empty description="Bạn đã chọn hết sản phẩm"/>}
        </Row>
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
          height: 720,
          marginTop: 30,
        }}
        title={<Typography.Title level={4}>Thông tin sản phẩm</Typography.Title>}
        extra={
          <Space size={16}>
            <Checkbox>
              <Typography.Text>Tách dòng</Typography.Text>
            </Checkbox>
            <Typography.Text>|</Typography.Text>
            <a href="http://localhost:3000/setting" style={{ color: '#0088fe' }}>
              Kiểm tra tồn kho
            </a>
            <Typography.Text>|</Typography.Text>
            <SettingOutlined style={{ fontSize: '26px', color: '#d2d4d7' }} />
          </Space>
        }
      >
        <Row>
          <Col span={16}>
            <Input.Group compact>
              <AutoComplete
                dropdownMatchSelectWidth={500}
                style={{ width: '85%' }}
                options= {options}
                filterOption={(input, option) =>
                  removeAccents(option?.value ?? '',true).toLowerCase().includes(
                    removeAccents(input,true).toLowerCase())
                    || removeAccents(option?.id ?? '',true).includes(input)
                }
                onSelect={productOnSelect}
                onChange={(value) => setProductSearchValue(value)}
                value={productSearchValue}
                notFoundContent = {filterProduct.length === 0 ? "Bạn đã chọn hết sản phẩm" : "Không tìm thấy sản phẩm"}
              >
                <Input 
                  size="large" 
                  placeholder="Tìm theo tên, mã SKU, hoặc quét mã Barcode...(F3)" 
                  prefix={<SearchOutlined />}
                />
              </AutoComplete>
              <Button size="large" style={{ width: '15%' }} onClick={handleClickModal}>
                Chọn nhanh
              </Button>
            </Input.Group>
          </Col>
          <Col span={2} offset={1}>
            <Select
              defaultValue="lucy"
              size="large"
              style={{ width: '100%' }}
              options={[
                {
                  value: 'lucy',
                  label: (
                    <p>
                      <FilterFilled /> (F10)
                    </p>
                  ),
                },
              ]}
            />
          </Col>
          <Col span={4} offset={1}>
            <Select
              defaultValue="Giá bán lẻ"
              size="large"
              style={{ width: '100%' }}
              options={[{ value: 'Giá bán lẻ', label: 'Giá bán lẻ' }]}
            />
          </Col>
        </Row>
        <br />
        {tableData.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{
              fontSize: 80,
              height: '100%',
            }}
            description="Chưa có thông tin sản phẩm"
          >
            <Button size="large" style={{ color: '#0088fe', borderColor: '#0088fe' }}>
              Thêm sản phẩm
            </Button>
          </Empty>
        ) : (
          <Table
            size="small"
            columns={columns}
            dataSource={tableData.map((item, index) => ({ ...item, index: index + 1 }))}
            scroll={{ y: 500, x: 350 }}
            pagination={{
              position: ['bottomLeft'],
              current: paramsFilter.page,
              defaultPageSize: 3,
              pageSizeOptions: [1, 2, 3, 4, 5],
              showQuickJumper: true,
              onChange: (page, pageSize) =>
                setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
              // total: countBusinesses,
            }}
          />
        )}
      </Card>
    </>
  )
}

export default Product
