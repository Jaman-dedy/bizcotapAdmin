// components/dashboard/OrdersPage.tsx

'use client'

import React, { useState } from 'react';
import {
  Row, Col, Card, Table, Tag, Button, Input,
  Typography, Dropdown, Menu, Space, Avatar,
  Badge, DatePicker, Statistic, Tooltip, Empty, Spin
} from 'antd';
import {
  SearchOutlined, FilterOutlined, DownloadOutlined,
  CalendarOutlined, EllipsisOutlined, EyeOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined,
  DollarOutlined, ShoppingOutlined, InboxOutlined,
  UserOutlined, RightOutlined, BarcodeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { OrderDetailsModal } from './OrderDetailsModal';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Dummy order data
const DUMMY_ORDERS = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    customer: {
      id: '101',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    orderDate: '2025-05-08T14:30:00.000Z',
    status: 'completed',
    items: [
      {
        id: 'PROD-001',
        name: 'Premium Wireless Headphones',
        quantity: 1,
        price: 249.99,
        imageUrl: 'https://placehold.co/100x100/e6f7ff/0050b3?text=Headphones'
      },
      {
        id: 'PROD-002',
        name: 'Smartphone Fast Charger',
        quantity: 2,
        price: 29.99,
        imageUrl: 'https://placehold.co/100x100/f6ffed/52c41a?text=Charger'
      }
    ],
    total: 309.97,
    tax: 25.50,
    shipping: 10.00,
    discount: 0,
    notes: 'Please leave package at front door',
    paymentMethod: 'Credit Card',
    deliveryMethod: 'Express Shipping',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: 'May 11, 2025'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    customer: {
      id: '102',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Park Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'United States'
      }
    },
    orderDate: '2025-05-09T09:15:00.000Z',
    status: 'pending',
    items: [
      {
        id: 'PROD-003',
        name: 'Ultra HD Smart TV 55"',
        quantity: 1,
        price: 799.99,
        imageUrl: 'https://placehold.co/100x100/e6f7ff/0050b3?text=TV'
      }
    ],
    total: 849.99,
    tax: 40.00,
    shipping: 25.00,
    discount: 15.00,
    paymentMethod: 'PayPal',
    deliveryMethod: 'Standard Shipping',
    estimatedDelivery: 'May 15, 2025'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    customer: {
      id: '103',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      address: {
        street: '789 Oak St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      }
    },
    orderDate: '2025-05-09T16:45:00.000Z',
    status: 'cancelled',
    items: [
      {
        id: 'PROD-004',
        name: 'Professional Camera Kit',
        quantity: 1,
        price: 1249.99,
        imageUrl: 'https://placehold.co/100x100/fff0f6/eb2f96?text=Camera'
      },
      {
        id: 'PROD-005',
        name: 'Camera Tripod',
        quantity: 1,
        price: 89.99,
        imageUrl: 'https://placehold.co/100x100/f9f0ff/722ed1?text=Tripod'
      }
    ],
    total: 1367.98,
    tax: 28.00,
    shipping: 0,
    discount: 0,
    notes: 'Customer changed their mind about the purchase',
    paymentMethod: 'Credit Card'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-004',
    customer: {
      id: '104',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      phone: '+1 (555) 234-5678',
      address: {
        street: '321 Elm St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      }
    },
    orderDate: '2025-05-10T08:20:00.000Z',
    status: 'completed',
    items: [
      {
        id: 'PROD-006',
        name: 'Wireless Earbuds',
        quantity: 1,
        price: 129.99,
        imageUrl: 'https://placehold.co/100x100/fcffe6/ad8b00?text=Earbuds'
      },
      {
        id: 'PROD-007',
        name: 'Portable Bluetooth Speaker',
        quantity: 1,
        price: 79.99,
        imageUrl: 'https://placehold.co/100x100/f0f5ff/1d39c4?text=Speaker'
      },
      {
        id: 'PROD-008',
        name: 'Wireless Charging Pad',
        quantity: 2,
        price: 24.99,
        imageUrl: 'https://placehold.co/100x100/e6fffb/006d75?text=Charger'
      }
    ],
    total: 279.96,
    tax: 20.00,
    shipping: 5.00,
    discount: 0,
    paymentMethod: 'Apple Pay',
    deliveryMethod: 'Express Shipping',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: 'May 12, 2025'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-005',
    customer: {
      id: '105',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      phone: '+1 (555) 876-5432',
      address: {
        street: '567 Pine St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'United States'
      }
    },
    orderDate: '2025-05-10T11:30:00.000Z',
    status: 'pending',
    items: [
      {
        id: 'PROD-009',
        name: 'Smart Home Hub',
        quantity: 1,
        price: 199.99,
        imageUrl: 'https://placehold.co/100x100/fff0f6/c41d7f?text=Hub'
      },
      {
        id: 'PROD-010',
        name: 'Smart Light Bulbs (Pack of 3)',
        quantity: 2,
        price: 59.99,
        imageUrl: 'https://placehold.co/100x100/fffbe6/ad5700?text=Bulbs'
      }
    ],
    total: 359.97,
    tax: 30.00,
    shipping: 12.00,
    discount: 25.00,
    paymentMethod: 'Debit Card',
    deliveryMethod: 'Standard Shipping',
    estimatedDelivery: 'May 17, 2025'
  }
];

// Types
type OrderStatus = 'completed' | 'pending' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  notes?: string;
  paymentMethod: string;
  deliveryMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrdersPage: React.FC = () => {
  // States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // For demo purposes, simulate loading
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Statistics calculation
  const orderStats = React.useMemo(() => {
    const stats = DUMMY_ORDERS.reduce((acc, order) => {
      acc.total += 1;
      if (order.status === 'completed') acc.completed += 1;
      else if (order.status === 'pending') acc.pending += 1;
      else if (order.status === 'cancelled') acc.cancelled += 1;

      if (order.status !== 'cancelled') {
        acc.revenue += order.total;
      }

      return acc;
    }, {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
      revenue: 0
    });

    return stats;
  }, []);

  // Filtered orders
  const filteredOrders = React.useMemo(() => {
    return DUMMY_ORDERS.filter(order => {
      // Search term filter
      const searchTermMatch =
        searchTerm === '' ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === 'all' ||
        order.status === statusFilter;

      // Date range filter
      let dateMatch = true;
      if (dateRange) {
        const orderDate = new Date(order.orderDate);
        dateMatch =
          orderDate >= dateRange[0] &&
          orderDate <= dateRange[1];
      }

      return searchTermMatch && statusMatch && dateMatch;
    });
  }, [searchTerm, statusFilter, dateRange]);

  // Handle opening order details
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Status badges
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Tag color="success" className="status-tag">
            <CheckCircleOutlined /> Completed
          </Tag>
        );
      case 'pending':
        return (
          <Tag color="processing" className="status-tag">
            <ClockCircleOutlined /> Pending
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag color="error" className="status-tag">
            <StopOutlined /> Cancelled
          </Tag>
        );
      default:
        return (
          <Tag className="status-tag">
            {status}
          </Tag>
        );
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <div className="flex items-center">
          <BarcodeOutlined className="text-gray-400 mr-2" />
          <div className="font-medium text-gray-800 hover:text-blue-500 cursor-pointer transition-colors"
              onClick={() => handleOpenOrderDetails(record)}>
            {text}
          </div>
        </div>
      ),
      sorter: (a: Order, b: Order) => a.orderNumber.localeCompare(b.orderNumber),
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      render: (_: string, record: Order) => (
        <div className="flex items-center">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className="mr-2 bg-blue-100 text-blue-500"
            src={record.customer.avatar}
          />
          <div>
            <div className="font-medium">{record.customer.name}</div>
            <div className="text-xs text-gray-500">{record.customer.email}</div>
          </div>
        </div>
      ),
      sorter: (a: Order, b: Order) => a.customer.name.localeCompare(b.customer.name),
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text: string) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          <div className="flex items-center">
            <CalendarOutlined className="text-gray-400 mr-2" />
            <span>{new Date(text).toLocaleDateString()}</span>
          </div>
        </Tooltip>
      ),
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => getStatusBadge(status),
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value: string, record: Order) =>
        value === 'all' ? true : record.status === value,
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => (
        <div className="font-medium text-gray-800">
          {formatCurrency(amount)}
        </div>
      ),
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <Badge count={items.length} className="items-badge" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              onClick={() => handleOpenOrderDetails(record)}
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<EyeOutlined />} onClick={() => handleOpenOrderDetails(record)}>
                  View Details
                </Menu.Item>
                <Menu.Item key="2" icon={<DownloadOutlined />}>
                  Download Invoice
                </Menu.Item>
                {record.status === 'pending' && (
                  <>
                    <Menu.Divider />
                    <Menu.Item key="3" icon={<CheckCircleOutlined />}>
                      Mark as Completed
                    </Menu.Item>
                    <Menu.Item key="4" icon={<StopOutlined />} danger>
                      Cancel Order
                    </Menu.Item>
                  </>
                )}
              </Menu>
            }
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <Title level={3} className="m-0 flex items-center">
              <ShoppingOutlined className="mr-2 text-blue-500" /> Orders
            </Title>
            <Text type="secondary">Manage and track all your orders</Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button icon={<ReloadOutlined />} onClick={simulateLoading}>
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} type="primary" ghost>
              Export
            </Button>
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
            >
              New Order
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                <ShoppingOutlined className="text-xl text-blue-500" />
              </div>
              <div>
                <p className="text-gray-500 m-0 text-sm">Total Orders</p>
                <Statistic
                  value={orderStats.total}
                  valueStyle={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.2 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
                <CheckCircleOutlined className="text-xl text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 m-0 text-sm">Completed</p>
                <Statistic
                  value={orderStats.completed}
                  valueStyle={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.2 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mr-4">
                <ClockCircleOutlined className="text-xl text-amber-500" />
              </div>
              <div>
                <p className="text-gray-500 m-0 text-sm">Pending</p>
                <Statistic
                  value={orderStats.pending}
                  valueStyle={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.2 }}
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
                <DollarOutlined className="text-xl text-purple-500" />
              </div>
              <div>
                <p className="text-gray-500 m-0 text-sm">Revenue</p>
                <Statistic
                  value={orderStats.revenue}
                  prefix="$"
                  precision={2}
                  valueStyle={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.2 }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search orders or customers..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              allowClear
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown
              overlay={
                <Menu
                  selectedKeys={[statusFilter]}
                  onClick={({key}) => setStatusFilter(key as OrderStatus | 'all')}
                >
                  <Menu.Item key="all">All</Menu.Item>
                  <Menu.Item key="completed">Completed</Menu.Item>
                  <Menu.Item key="pending">Pending</Menu.Item>
                  <Menu.Item key="cancelled">Cancelled</Menu.Item>
                </Menu>
              }
            >
              <Button icon={<FilterOutlined />}>
                {statusFilter === 'all' ? 'All Statuses' : (
                  statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                )}
                <RightOutlined className="text-xs ml-1" />
              </Button>
            </Dropdown>
            <RangePicker
              placeholder={['Start date', 'End date']}
              className="date-picker"
              onChange={(dates) => {
                if (dates) {
                  setDateRange([dates[0]?.toDate() as Date, dates[1]?.toDate() as Date]);
                } else {
                  setDateRange(null);
                }
              }}
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="orders-table-card border-0 shadow-sm">
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="orderNumber"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="py-6">
                    <p className="text-gray-500 mb-4">No orders found</p>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-md"
                    >
                      Create New Order
                    </Button>
                  </div>
                }
              />
            ),
          }}
          className="orders-table"
        />
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          visible={isDetailsModalOpen}
          order={selectedOrder}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Custom Styling */}
      <style jsx global>{`
        .orders-page {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .orders-table-card {
          border-radius: 12px;
          overflow: hidden;
        }

        .orders-table .ant-table {
          background: #fff;
        }

        .orders-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
        }

        .orders-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(240, 240, 255, 0.5) !important;
        }

        .status-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          font-weight: 500;
          border: none;
          border-radius: 4px;
        }

        .search-input, .date-picker {
          border-radius: 8px;
        }

        .items-badge .ant-badge-count {
          background-color: #6366F1;
        }

        .ant-dropdown-menu {
          border-radius: 8px;
          padding: 6px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

// Simplified mock order details modal component
const OrderDetailsModal = ({ visible, order, onClose }: any) => {
  if (!order) return null;

  return (
    <Modal
      title={`Order #${order.orderNumber}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
        >
          Download Invoice
        </Button>,
      ]}
      width={800}
      centered
      className="order-details-modal"
    >
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 mb-1">Order Status</p>
            <h3 className="text-xl font-bold flex items-center">
              {order.status === 'completed' && <CheckCircleOutlined className="text-green-500 mr-2" />}
              {order.status === 'pending' && <ClockCircleOutlined className="text-amber-500 mr-2" />}
              {order.status === 'cancelled' && <StopOutlined className="text-red-500 mr-2" />}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </h3>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Order Total</p>
            <h3 className="text-xl font-bold text-blue-600">
              ${order.total.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Customer</h4>
        <div className="flex items-center">
          <Avatar src={order.customer.avatar} size={40} />
          <div className="ml-3">
            <div className="font-medium">{order.customer.name}</div>
            <div className="text-gray-500 text-sm">{order.customer.email}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">Order Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking Number:</span>
                <span>{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>

        {order.customer.address && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Shipping Address</h4>
            <div className="text-gray-700">
              {order.customer.address.street}<br />
              {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zipCode}<br />
              {order.customer.address.country}
            </div>
          </div>
        )}
      </div>

      <h4 className="font-medium mb-2">Order Items</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        <ShoppingOutlined className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">SKU: {item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">${item.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-center">{item.quantity}</td>
                <td className="py-4 px-4 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
          </div>

          {order.tax > 0 && (
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          )}

          {order.shipping > 0 && (
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
          )}

          {order.discount > 0 && (
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">-${order.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between py-3 border-t border-gray-300 mt-2">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-details-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
    </Modal>
  );
};

export default OrdersPage;
