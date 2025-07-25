const express = require('express');
const router = express.Router();

// Import your custom route modules here
const workOrderRoutes = require('./api/workOrders');

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: API Information
 *     description: Get API information and available endpoints
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CalmApp API v1"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 status:
 *                   type: string
 *                   example: "Running"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     workOrders:
 *                       type: string
 *                       example: "/workorders"
 *                     health:
 *                       type: string
 *                       example: "/health"
 *                     docs:
 *                       type: string
 *                       example: "/docs"
 *                 documentation:
 *                   type: object
 *                   properties:
 *                     readme:
 *                       type: string
 *                       example: "See README.md for setup instructions"
 *                     workOrders:
 *                       type: string
 *                       example: "Complete work order management API with filtering and search"
 *                 features:
 *                   type: object
 *                   properties:
 *                     filtering:
 *                       type: string
 *                       example: "Filter by status, priority, division, location, manufacturer, etc."
 *                     search:
 *                       type: string
 *                       example: "Search across work order number, customer, serial number, etc."
 *                     pagination:
 *                       type: string
 *                       example: "Paginated results with customizable page size"
 *                     statistics:
 *                       type: string
 *                       example: "Work order statistics and analytics endpoints"
 */
router.get('/', (req, res) => {
  res.json({
    message: 'CalmApp API v1',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      workOrders: '/workorders',
      health: '/health',
      docs: '/docs'
    },
    documentation: {
      readme: 'See README.md for setup instructions',
      workOrders: 'Complete work order management API with filtering and search'
    },
    features: {
      filtering: 'Filter by status, priority, division, location, manufacturer, etc.',
      search: 'Search across work order number, customer, serial number, etc.',
      pagination: 'Paginated results with customizable page size',
      statistics: 'Work order statistics and analytics endpoints'
    }
  });
});

// Add your custom route modules here
router.use('/workorders', workOrderRoutes);

module.exports = router; 