const express = require('express');
const router = express.Router();
const { query, param } = require('express-validator');

const workOrderController = require('../../controllers/workOrderController');
const { validate } = require('../../middleware/validator');

// Validation rules for work order queries
const getWorkOrdersValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('workOrderStatus').optional().isInt({ min: 1 }).withMessage('Work order status must be a positive integer'),
  query('workOrderType').optional().isInt({ min: 1 }).withMessage('Work order type must be a positive integer'),
  query('priority').optional().isInt({ min: 1 }).withMessage('Priority must be a positive integer'),
  query('division').optional().isInt({ min: 1 }).withMessage('Division must be a positive integer'),
  query('location').optional().isInt({ min: 1 }).withMessage('Location must be a positive integer'),
  query('itemStatus').optional().isInt({ min: 1 }).withMessage('Item status must be a positive integer'),
  query('assignedUser').optional().isInt({ min: 1 }).withMessage('Assigned user must be a positive integer'),
  query('customerId').optional().isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),
  query('productId').optional().isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  query('manufacturer').optional().trim(),
  query('modelNumber').optional().trim(),
  query('serialNumber').optional().trim(),
  query('poNumber').optional().trim(),
  query('rfid').optional().trim(),
  query('hotList').optional().isBoolean().withMessage('Hot list must be true or false'),
  query('readyToBill').optional().isBoolean().withMessage('Ready to bill must be true or false'),
  query('dateFrom').optional().isISO8601().withMessage('Date from must be a valid date'),
  query('dateTo').optional().isISO8601().withMessage('Date to must be a valid date'),
  query('sortBy').optional().isIn(['WorkOrderID', 'WONumber', 'CreatedDate', 'NeedBy', 'Priority', 'WorkOrderStatus', 'ItemStatus']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  validate
];

const getWorkOrderValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid work order ID is required'),
  validate
];

// Routes
/**
 * @swagger
 * /workorders:
 *   get:
 *     tags: [Work Orders]
 *     summary: Get all work orders
 *     description: Retrieve work orders with optional filtering, pagination, and search
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: workOrderStatus
 *         in: query
 *         description: Filter by work order status
 *         schema:
 *           type: integer
 *         example: 85
 *       - name: workOrderType
 *         in: query
 *         description: Filter by work order type
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: priority
 *         in: query
 *         description: Filter by priority
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: division
 *         in: query
 *         description: Filter by division
 *         schema:
 *           type: integer
 *         example: 100
 *       - name: location
 *         in: query
 *         description: Filter by location
 *         schema:
 *           type: integer
 *         example: 50
 *       - name: itemStatus
 *         in: query
 *         description: Filter by item status
 *         schema:
 *           type: integer
 *         example: 85
 *       - name: assignedUser
 *         in: query
 *         description: Filter by assigned user
 *         schema:
 *           type: integer
 *         example: 123
 *       - name: customerId
 *         in: query
 *         description: Filter by customer ID
 *         schema:
 *           type: integer
 *         example: 456
 *       - name: manufacturer
 *         in: query
 *         description: Filter by manufacturer
 *         schema:
 *           type: string
 *         example: "Fluke"
 *       - name: modelNumber
 *         in: query
 *         description: Filter by model number
 *         schema:
 *           type: string
 *         example: "Model-123"
 *       - name: serialNumber
 *         in: query
 *         description: Filter by serial number
 *         schema:
 *           type: string
 *         example: "SN-456789"
 *       - name: hotList
 *         in: query
 *         description: Filter by hot list status
 *         schema:
 *           type: boolean
 *         example: true
 *       - name: readyToBill
 *         in: query
 *         description: Filter by ready to bill status
 *         schema:
 *           type: boolean
 *         example: false
 *       - name: dateFrom
 *         in: query
 *         description: Filter by start date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *       - name: dateTo
 *         in: query
 *         description: Filter by end date
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-12-31"
 *       - name: sortBy
 *         in: query
 *         description: Sort field
 *         schema:
 *           type: string
 *           enum: [WorkOrderID, WONumber, CreatedDate, NeedBy, Priority, WorkOrderStatus, ItemStatus]
 *         example: "CreatedDate"
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Work orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedWorkOrders'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getWorkOrdersValidation, workOrderController.getWorkOrders);

/**
 * @swagger
 * /workorders/{id}:
 *   get:
 *     tags: [Work Orders]
 *     summary: Get work order by ID
 *     description: Retrieve a specific work order by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/WorkOrderIdParam'
 *     responses:
 *       200:
 *         description: Work order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/WorkOrder'
 *       404:
 *         description: Work order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid work order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getWorkOrderValidation, workOrderController.getWorkOrderById);

/**
 * @swagger
 * /workorders/{id}/comments:
 *   get:
 *     tags: [Work Orders]
 *     summary: Get work order comments
 *     description: Retrieve all comments for a specific work order
 *     parameters:
 *       - $ref: '#/components/parameters/WorkOrderIdParam'
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkOrderComment'
 */
router.get('/:id/comments', getWorkOrderValidation, workOrderController.getWorkOrderComments);

/**
 * @swagger
 * /workorders/{id}/status-log:
 *   get:
 *     tags: [Work Orders]
 *     summary: Get work order status history
 *     description: Retrieve status change history for a specific work order
 *     parameters:
 *       - $ref: '#/components/parameters/WorkOrderIdParam'
 *     responses:
 *       200:
 *         description: Status log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StatusLog'
 */
router.get('/:id/status-log', getWorkOrderValidation, workOrderController.getWorkOrderStatusLog);

/**
 * @swagger
 * /workorders/stats/summary:
 *   get:
 *     tags: [Statistics]
 *     summary: Get work order statistics summary
 *     description: Retrieve overall work order statistics including totals and counts
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/WorkOrderStats'
 */
router.get('/stats/summary', workOrderController.getWorkOrderStats);

/**
 * @swagger
 * /workorders/stats/by-status:
 *   get:
 *     tags: [Statistics]
 *     summary: Get work order count by status
 *     description: Retrieve work order counts grouped by status
 *     responses:
 *       200:
 *         description: Status statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ItemStatus:
 *                             type: integer
 *                             example: 85
 *                           ItemStatusName:
 *                             type: string
 *                             example: "Testing"
 *                           count:
 *                             type: integer
 *                             example: 45
 */
router.get('/stats/by-status', workOrderController.getWorkOrdersByStatus);

/**
 * @swagger
 * /workorders/stats/by-priority:
 *   get:
 *     tags: [Statistics]
 *     summary: Get work order count by priority
 *     description: Retrieve work order counts grouped by priority level
 *     responses:
 *       200:
 *         description: Priority statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           Priority:
 *                             type: integer
 *                             example: 1
 *                           PriorityCode:
 *                             type: string
 *                             example: "High"
 *                           count:
 *                             type: integer
 *                             example: 25
 */
router.get('/stats/by-priority', workOrderController.getWorkOrdersByPriority);

/**
 * @swagger
 * /workorders/stats/by-division:
 *   get:
 *     tags: [Statistics]
 *     summary: Get work order count by division
 *     description: Retrieve work order counts grouped by division
 *     responses:
 *       200:
 *         description: Division statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           Division:
 *                             type: integer
 *                             example: 100
 *                           DivisionName:
 *                             type: string
 *                             example: "Electronics"
 *                           count:
 *                             type: integer
 *                             example: 150
 */
router.get('/stats/by-division', workOrderController.getWorkOrdersByDivision);

module.exports = router; 