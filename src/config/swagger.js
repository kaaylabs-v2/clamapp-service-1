const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CalmApp Work Order API',
    version: '1.0.0',
    description: 'A comprehensive REST API for Work Order management with SQL Server backend',
    contact: {
      name: 'CalmApp API Support',
      email: 'support@calmapp.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
      description: 'Development server'
    },
    {
      url: 'https://api.calmapp.com/api/v1',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Work Orders',
      description: 'Work order management operations'
    },
    {
      name: 'Statistics',
      description: 'Work order statistics and analytics'
    },
    {
      name: 'Health',
      description: 'API health checks'
    }
  ],
  components: {
    schemas: {
      WorkOrder: {
        type: 'object',
        properties: {
          WorkOrderID: {
            type: 'integer',
            description: 'Unique work order identifier',
            example: 12345
          },
          WONumber: {
            type: 'string',
            description: 'Work order number',
            example: 'WO-2024-001'
          },
          WONumberWithLink: {
            type: 'string',
            description: 'Work order number with link indicator',
            example: 'WO-2024-001*'
          },
          AcctNum: {
            type: 'string',
            description: 'Account number',
            example: 'ACC-12345'
          },
          CreatedDate: {
            type: 'string',
            format: 'date-time',
            description: 'Work order creation date',
            example: '2024-01-15T10:30:00Z'
          },
          CreatedDateDisplay: {
            type: 'string',
            description: 'Formatted creation date',
            example: '01/15/2024'
          },
          CustomerName: {
            type: 'string',
            description: 'Customer name',
            example: 'ABC Company'
          },
          WorkOrderStatus: {
            type: 'integer',
            description: 'Work order status code',
            example: 85
          },
          WorkOrderStatusName: {
            type: 'string',
            description: 'Work order status name',
            example: 'In Progress'
          },
          Priority: {
            type: 'integer',
            description: 'Priority code',
            example: 1
          },
          PriorityCode: {
            type: 'string',
            description: 'Priority name',
            example: 'High'
          },
          Division: {
            type: 'integer',
            description: 'Division code',
            example: 100
          },
          DivisionName: {
            type: 'string',
            description: 'Division name',
            example: 'Electronics'
          },
          Location: {
            type: 'integer',
            description: 'Location code',
            example: 50
          },
          LocationName: {
            type: 'string',
            description: 'Location name',
            example: 'Main Lab'
          },
          ItemStatus: {
            type: 'integer',
            description: 'Item status code',
            example: 85
          },
          ItemStatusName: {
            type: 'string',
            description: 'Item status name',
            example: 'Testing'
          },
          Manufacturer: {
            type: 'string',
            description: 'Equipment manufacturer',
            example: 'Fluke'
          },
          ModelNumber: {
            type: 'string',
            description: 'Model number',
            example: 'Model-123'
          },
          SerialNumber: {
            type: 'string',
            description: 'Serial number',
            example: 'SN-456789'
          },
          ProductDescription: {
            type: 'string',
            description: 'Product description',
            example: 'Digital Multimeter'
          },
          PONumber: {
            type: 'string',
            description: 'Purchase order number',
            example: 'PO-2024-001'
          },
          AssignedUser: {
            type: 'integer',
            description: 'Assigned user ID',
            example: 123
          },
          AssignedUserName: {
            type: 'string',
            description: 'Assigned user name',
            example: 'John Doe'
          },
          HotList: {
            type: 'integer',
            description: 'Hot list flag (0 or 1)',
            example: 1
          },
          ReadyToBill: {
            type: 'integer',
            description: 'Ready to bill flag (0 or 1)',
            example: 0
          },
          NeedBy: {
            type: 'string',
            format: 'date',
            description: 'Date needed by',
            example: '2024-02-15'
          }
        }
      },
      WorkOrderComment: {
        type: 'object',
        properties: {
          WorkOrderCommentID: {
            type: 'integer',
            description: 'Comment ID',
            example: 1001
          },
          WorkOrderID: {
            type: 'integer',
            description: 'Work order ID',
            example: 12345
          },
          Comment: {
            type: 'string',
            description: 'Comment text',
            example: 'Equipment arrived and testing started'
          },
          DateEntered: {
            type: 'string',
            format: 'date-time',
            description: 'Comment date',
            example: '2024-01-15T14:30:00Z'
          },
          UserID: {
            type: 'integer',
            description: 'User who added comment',
            example: 123
          }
        }
      },
      StatusLog: {
        type: 'object',
        properties: {
          StatusLogID: {
            type: 'integer',
            description: 'Status log ID',
            example: 5001
          },
          WorkOrderID: {
            type: 'integer',
            description: 'Work order ID',
            example: 12345
          },
          NewStatus: {
            type: 'string',
            description: 'New status',
            example: 'Testing'
          },
          ChangeDate: {
            type: 'string',
            format: 'date-time',
            description: 'Status change date',
            example: '2024-01-15T14:30:00Z'
          },
          UserID: {
            type: 'integer',
            description: 'User who changed status',
            example: 123
          }
        }
      },
      WorkOrderStats: {
        type: 'object',
        properties: {
          totalWorkOrders: {
            type: 'integer',
            description: 'Total work orders',
            example: 1500
          },
          activeWorkOrders: {
            type: 'integer',
            description: 'Active work orders',
            example: 450
          },
          completedWorkOrders: {
            type: 'integer',
            description: 'Completed work orders',
            example: 1050
          },
          hotListWorkOrders: {
            type: 'integer',
            description: 'Hot list work orders',
            example: 25
          },
          readyToBillWorkOrders: {
            type: 'integer',
            description: 'Ready to bill work orders',
            example: 75
          }
        }
      },
      PaginatedWorkOrders: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Work orders retrieved successfully'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/WorkOrder'
            }
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                example: 1
              },
              limit: {
                type: 'integer',
                example: 10
              },
              total: {
                type: 'integer',
                example: 150
              },
              totalPages: {
                type: 'integer',
                example: 15
              },
              hasNext: {
                type: 'boolean',
                example: true
              },
              hasPrev: {
                type: 'boolean',
                example: false
              }
            }
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully'
          },
          data: {
            type: 'object'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Resource not found'
              },
              stack: {
                type: 'string',
                description: 'Error stack trace (development only)'
              }
            }
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          },
          path: {
            type: 'string',
            example: '/api/v1/workorders/999'
          },
          method: {
            type: 'string',
            example: 'GET'
          }
        }
      }
    },
    parameters: {
      WorkOrderIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Work order ID',
        schema: {
          type: 'integer',
          minimum: 1
        },
        example: 12345
      },
      PageParam: {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number for pagination',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1
        },
        example: 1
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of items per page',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10
        },
        example: 10
      },
      SearchParam: {
        name: 'search',
        in: 'query',
        required: false,
        description: 'Search term for work orders',
        schema: {
          type: 'string'
        },
        example: 'Fluke'
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/api/*.js',
    './src/controllers/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 