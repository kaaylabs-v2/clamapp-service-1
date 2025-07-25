const workOrderService = require('../services/workOrderService');
const { 
  sendSuccess, 
  sendNotFound,
  sendPaginated 
} = require('../utils/response');

const workOrderController = {
  // Get all work orders with filtering, pagination and search
  async getWorkOrders(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search,
        workOrderStatus,
        workOrderType,
        priority,
        division,
        location,
        itemStatus,
        assignedUser,
        customerId,
        productId,
        manufacturer,
        modelNumber,
        serialNumber,
        poNumber,
        rfid,
        hotList,
        readyToBill,
        dateFrom,
        dateTo,
        sortBy = 'WorkOrderID',
        sortOrder = 'desc'
      } = req.query;
      
      const result = await workOrderService.getAllWorkOrders({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        filters: {
          workOrderStatus: workOrderStatus ? parseInt(workOrderStatus) : undefined,
          workOrderType: workOrderType ? parseInt(workOrderType) : undefined,
          priority: priority ? parseInt(priority) : undefined,
          division: division ? parseInt(division) : undefined,
          location: location ? parseInt(location) : undefined,
          itemStatus: itemStatus ? parseInt(itemStatus) : undefined,
          assignedUser: assignedUser ? parseInt(assignedUser) : undefined,
          customerId: customerId ? parseInt(customerId) : undefined,
          productId: productId ? parseInt(productId) : undefined,
          manufacturer,
          modelNumber,
          serialNumber,
          poNumber,
          rfid,
          hotList: hotList === 'true',
          readyToBill: readyToBill === 'true',
          dateFrom,
          dateTo
        },
        sortBy,
        sortOrder
      });
      
      return sendPaginated(res, result.workOrders, {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total
      }, 'Work orders retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work order by ID
  async getWorkOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const workOrder = await workOrderService.getWorkOrderById(id);
      
      if (!workOrder) {
        return sendNotFound(res, 'Work order not found');
      }
      
      return sendSuccess(res, workOrder, 'Work order retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work order comments
  async getWorkOrderComments(req, res, next) {
    try {
      const { id } = req.params;
      const comments = await workOrderService.getWorkOrderComments(id);
      
      return sendSuccess(res, comments, 'Work order comments retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work order status log
  async getWorkOrderStatusLog(req, res, next) {
    try {
      const { id } = req.params;
      const statusLog = await workOrderService.getWorkOrderStatusLog(id);
      
      return sendSuccess(res, statusLog, 'Work order status log retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work order statistics summary
  async getWorkOrderStats(req, res, next) {
    try {
      const stats = await workOrderService.getWorkOrderStats();
      
      return sendSuccess(res, stats, 'Work order statistics retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work orders by status
  async getWorkOrdersByStatus(req, res, next) {
    try {
      const stats = await workOrderService.getWorkOrdersByStatus();
      
      return sendSuccess(res, stats, 'Work orders by status retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work orders by priority
  async getWorkOrdersByPriority(req, res, next) {
    try {
      const stats = await workOrderService.getWorkOrdersByPriority();
      
      return sendSuccess(res, stats, 'Work orders by priority retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  },

  // Get work orders by division
  async getWorkOrdersByDivision(req, res, next) {
    try {
      const stats = await workOrderService.getWorkOrdersByDivision();
      
      return sendSuccess(res, stats, 'Work orders by division retrieved successfully');
      
    } catch (error) {
      next(error);
    }
  }
};

module.exports = workOrderController;