const WorkOrderModel = require('../models/workOrderModel');

const workOrderService = {
  // Get all work orders with filtering, pagination and search
  async getAllWorkOrders(options) {
    const { page, limit, search, filters = {}, sortBy, sortOrder } = options;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Get work orders and total count
    const [workOrders, total] = await Promise.all([
      WorkOrderModel.findAll({ limit, offset, search, filters, sortBy, sortOrder }),
      WorkOrderModel.count({ search, filters })
    ]);
    
    return {
      workOrders,
      total
    };
  },

  // Get work order by ID
  async getWorkOrderById(id) {
    return await WorkOrderModel.findById(id);
  },

  // Get work order comments
  async getWorkOrderComments(workOrderId) {
    return await WorkOrderModel.findComments(workOrderId);
  },

  // Get work order status log
  async getWorkOrderStatusLog(workOrderId) {
    return await WorkOrderModel.findStatusLog(workOrderId);
  },

  // Get work order statistics
  async getWorkOrderStats() {
    const stats = await WorkOrderModel.getStats();
    
    return {
      totalWorkOrders: parseInt(stats.totalWorkOrders) || 0,
      activeWorkOrders: parseInt(stats.activeWorkOrders) || 0,
      completedWorkOrders: parseInt(stats.completedWorkOrders) || 0,
      hotListWorkOrders: parseInt(stats.hotListWorkOrders) || 0,
      readyToBillWorkOrders: parseInt(stats.readyToBillWorkOrders) || 0,
      averageProcessingTime: stats.averageProcessingTime || 0
    };
  },

  // Get work orders by status
  async getWorkOrdersByStatus() {
    return await WorkOrderModel.getByStatus();
  },

  // Get work orders by priority
  async getWorkOrdersByPriority() {
    return await WorkOrderModel.getByPriority();
  },

  // Get work orders by division
  async getWorkOrdersByDivision() {
    return await WorkOrderModel.getByDivision();
  }
};

module.exports = workOrderService; 