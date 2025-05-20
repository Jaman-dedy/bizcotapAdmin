// components/dashboard/modals/OrderDetailsModal.tsx
import React from 'react';
import {
  Modal, Button, Typography, Descriptions, Tag, Divider,
  Row, Col, Card, Table, Timeline, Avatar, Tooltip, Space
} from 'antd';
import {
  DownloadOutlined, ShoppingOutlined, UserOutlined, ClockCircleOutlined,
  CreditCardOutlined, CarOutlined, CheckCircleOutlined, StopOutlined,
 BarcodeOutlined, GlobalOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import type { Order, OrderItem } from '@/types/order';

const { Title, Text, Link } = Typography;

interface OrderDetailsModalProps {
  visible: boolean;
  order: Order;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  visible,
  order,
  onClose
}) => {
  if (!order) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Tag color="success" className="status-badge">
            <CheckCircleOutlined /> Completed
          </Tag>
        );
      case 'pending':
        return (
          <Tag color="processing" className="status-badge">
            <ClockCircleOutlined /> Pending
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag color="error" className="status-badge">
            <StopOutlined /> Cancelled
          </Tag>
        );
      default:
        return (
          <Tag className="status-badge">
            {status}
          </Tag>
        );
    }
  };

  // Order items table columns
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, item: OrderItem) => (
        <div className="flex items-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={text}
              className="w-10 h-10 object-cover rounded-md mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
              <ShoppingOutlined className="text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">SKU: {item.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
      align: 'right' as const,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <Tag className="quantity-tag">{quantity}</Tag>
      ),
      align: 'center' as const,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, item: OrderItem) => formatCurrency(item.price * item.quantity),
      align: 'right' as const,
    },
  ];

  // Calculate subtotal, tax, shipping, discount, and total
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = order.tax || 0;
  const shipping = order.shipping || 0;
  const discount = order.discount || 0;
  const total = subtotal + tax + shipping - discount;

  return (
    <Modal
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
      width={900}
      title={
        <div className="flex items-center">
          <ShoppingOutlined className="text-blue-500 mr-2" />
          <span>Order Details</span>
        </div>
      }
      centered
      className="order-details-modal"
    >
      <div className="p-2">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-10 -mr-10 opacity-10">
            <ShoppingOutlined className="text-9xl text-black" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <div className="text-sm text-gray-500 mb-1">Order Number</div>
              <Title level={3} className="m-0 flex items-center">
                <BarcodeOutlined className="mr-2 text-gray-400" />
                {order.orderNumber}
                <span className="ml-3">{getStatusBadge(order.status)}</span>
              </Title>
              <Text type="secondary">
                Placed on {formatDate(order.orderDate)}
              </Text>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-500 mb-1">Order Total</div>
              <Title level={3} className="m-0 flex items-center text-blue-600">
                {formatCurrency(order.total)}
              </Title>
              <Text type="secondary">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </Text>
            </div>
          </div>
        </div>

        {/* Order Information Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={12}>
            <Card
              title={
                <div className="flex items-center">
                  <UserOutlined className="text-blue-500 mr-2" />
                  <span>Customer</span>
                </div>
              }
              className="h-full info-card"
              bordered={false}
            >
              <div className="flex items-center mb-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  src={order.customer.avatar}
                  className="bg-blue-100 text-blue-600"
                />
                <div className="ml-4">
                  <div className="text-lg font-medium">{order.customer.name}</div>
                  <Link href={`mailto:${order.customer.email}`} className="text-gray-500">
                    {order.customer.email}
                  </Link>
                  {order.customer.phone && (
                    <div className="text-gray-500 mt-1">{order.customer.phone}</div>
                  )}
                </div>
              </div>

              {order.customer.address && (
                <div>
                  <Divider className="my-3" />
                  <div className="flex items-start">
                    <GlobalOutlined className="text-gray-400 mt-1 mr-2" />
                    <div>
                      <div className="font-medium mb-1">Shipping Address</div>
                      <div className="text-gray-500">
                        {order.customer.address.street}<br />
                        {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zipCode}<br />
                        {order.customer.address.country}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <div className="flex items-center">
                  <InfoCircleOutlined className="text-blue-500 mr-2" />
                  <span>Order Information</span>
                </div>
              }
              className="h-full info-card"
              bordered={false}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="info-item">
                    <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                    <div className="flex items-center">
                      <CreditCardOutlined className="text-blue-500 mr-2" />
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                  </div>
                </Col>

                {order.deliveryMethod && (
                  <Col span={12}>
                    <div className="info-item">
                      <div className="text-sm text-gray-500 mb-1">Delivery Method</div>
                      <div className="flex items-center">
                        <CarOutlined className="text-blue-500 mr-2" />
                        <span className="font-medium">{order.deliveryMethod}</span>
                      </div>
                    </div>
                  </Col>
                )}

                {order.trackingNumber && (
                  <Col span={12}>
                    <div className="info-item">
                      <div className="text-sm text-gray-500 mb-1">Tracking Number</div>
                      <div className="flex items-center">
                        <BarcodeOutlined className="text-blue-500 mr-2" />
                        <span className="font-medium">{order.trackingNumber}</span>
                      </div>
                    </div>
                  </Col>
                )}

                {order.estimatedDelivery && (
                  <Col span={12}>
                    <div className="info-item">
                      <div className="text-sm text-gray-500 mb-1">Estimated Delivery</div>
                      <div className="flex items-center">
                        <ClockCircleOutlined className="text-blue-500 mr-2" />
                        <span className="font-medium">{order.estimatedDelivery}</span>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {order.notes && (
                <>
                  <Divider className="my-3" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Notes</div>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                      {order.notes}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>

        {/* Order Items */}
        <Card
          title={
            <div className="flex items-center">
              <ShoppingOutlined className="text-blue-500 mr-2" />
              <span>Order Items</span>
            </div>
          }
          className="mb-6 items-card"
          bordered={false}
        >
          <Table
            dataSource={order.items}
            columns={columns}
            pagination={false}
            rowKey="id"
            className="items-table"
          />

          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <Text>Subtotal</Text>
                <Text strong>{formatCurrency(subtotal)}</Text>
              </div>

              {tax > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <Text>Tax</Text>
                  <Text>{formatCurrency(tax)}</Text>
                </div>
              )}

              {shipping > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <Text>Shipping</Text>
                  <Text>{formatCurrency(shipping)}</Text>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <Text>Discount</Text>
                  <Text className="text-green-600">-{formatCurrency(discount)}</Text>
                </div>
              )}

              <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                <Text strong className="text-lg">Total</Text>
                <Text strong className="text-lg text-blue-600">{formatCurrency(total)}</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Timeline */}
        <Card
          title={
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <span>Order Timeline</span>
            </div>
          }
          className="timeline-card"
          bordered={false}
        >
          <Timeline mode="left">
            <Timeline.Item
              color="green"
              label={formatDate(order.orderDate)}
            >
              <div className="font-medium">Order Placed</div>
              <div className="text-gray-500">
                Customer placed order #{order.orderNumber}
              </div>
            </Timeline.Item>

            <Timeline.Item
              color="blue"
              label={formatDate(new Date(new Date(order.orderDate).getTime() + 3600000).toString())}
            >
              <div className="font-medium">Payment Confirmed</div>
              <div className="text-gray-500">
                Payment of {formatCurrency(order.total)} received via {order.paymentMethod}
              </div>
            </Timeline.Item>

            {order.status !== 'cancelled' && (
              <>
                <Timeline.Item
                  color={order.status === 'completed' ? 'green' : 'blue'}
                  label={formatDate(new Date(new Date(order.orderDate).getTime() + 86400000).toString())}
                >
                  <div className="font-medium">Order Processed</div>
                  <div className="text-gray-500">
                    Order has been processed and prepared for shipping
                  </div>
                </Timeline.Item>

                {order.trackingNumber && (
                  <Timeline.Item
                    color={order.status === 'completed' ? 'green' : 'gray'}
                    label={formatDate(new Date(new Date(order.orderDate).getTime() + 172800000).toString())}
                  >
                    <div className="font-medium">Order Shipped</div>
                    <div className="text-gray-500">
                      Order has been shipped via {order.deliveryMethod}
                      <div className="mt-1">
                        Tracking: <span className="font-medium">{order.trackingNumber}</span>
                      </div>
                    </div>
                  </Timeline.Item>
                )}

                {order.status === 'completed' && (
                  <Timeline.Item
                    color="green"
                    label={formatDate(new Date(new Date(order.orderDate).getTime() + 432000000).toString())}
                  >
                    <div className="font-medium">Order Delivered</div>
                    <div className="text-gray-500">
                      Order has been delivered successfully
                    </div>
                  </Timeline.Item>
                )}
              </>
            )}

            {order.status === 'cancelled' && (
              <Timeline.Item
                color="red"
                label={formatDate(new Date(new Date(order.orderDate).getTime() + 43200000).toString())}
              >
                <div className="font-medium">Order Cancelled</div>
                <div className="text-gray-500">
                  Order has been cancelled
                  {order.notes && (
                    <div className="mt-1">Reason: {order.notes}</div>
                  )}
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>
      </div>

      {/* Modal Styling */}
      <style jsx global>{`
        .order-details-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .order-details-modal .ant-modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-details-modal .ant-modal-body {
          padding: 24px;
        }

        .order-details-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
          padding: 16px 24px;
        }

        .order-details-modal .ant-card {
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .order-details-modal .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
          padding: 12px 20px;
          font-weight: 600;
        }

        .order-details-modal .ant-card-body {
          padding: 20px;
        }

        .order-details-modal .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
        }

        .order-details-modal .quantity-tag {
          background-color: #f3f4f6;
          color: #374151;
          padding: 2px 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .items-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .items-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(240, 240, 255, 0.5) !important;
        }

        .timeline-card .ant-timeline-item-label {
          width: 170px;
          text-align: right;
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </Modal>
  );
};
