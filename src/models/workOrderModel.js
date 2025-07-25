const { db } = require('../config/database');

const WorkOrderModel = {
  // Use the optimized indexed view
  tableName: 'vw_WorkOrderList',

  // Find all work orders with filtering, pagination and search
  async findAll({ limit, offset, search, filters = {}, sortBy = 'WorkOrderID', sortOrder = 'desc' }) {
    let query = db(this.tableName).select('*');

    // Optimized search using indexed columns
    if (search) {
      query = query.where(function() {
        this.where('WONumber', 'like', `%${search}%`)
            .orWhere('CustomerName', 'like', `%${search}%`)
            .orWhere('SerialNumber', 'like', `%${search}%`)
            .orWhere('PONumber', 'like', `%${search}%`)
            .orWhere('Manufacturer', 'like', `%${search}%`)
            .orWhere('ModelNumber', 'like', `%${search}%`);
      });
    }

    // Apply filters using indexed columns
    if (filters.workOrderStatus) {
      query = query.where('WorkOrderStatus', filters.workOrderStatus);
    }

    if (filters.itemStatus) {
      query = query.where('ItemStatus', filters.itemStatus);
    }

    if (filters.priority) {
      query = query.where('Priority', filters.priority);
    }

    if (filters.division) {
      query = query.where('Division', filters.division);
    }

    if (filters.location) {
      query = query.where('Location', filters.location);
    }

    if (filters.assignedUser) {
      query = query.where('AssignedUser', filters.assignedUser);
    }

    if (filters.customerId) {
      query = query.where('CustID', filters.customerId);
    }

    if (filters.manufacturer) {
      query = query.where('Manufacturer', 'like', `%${filters.manufacturer}%`);
    }

    if (filters.serialNumber) {
      query = query.where('SerialNumber', 'like', `%${filters.serialNumber}%`);
    }

    if (filters.hotList !== undefined) {
      query = query.where('HotList', filters.hotList ? 1 : 0);
    }

    if (filters.readyToBill !== undefined) {
      query = query.where('ReadyToBill', filters.readyToBill ? 1 : 0);
    }

    if (filters.dateFrom) {
      query = query.where('CreatedDate', '>=', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.where('CreatedDate', '<=', filters.dateTo);
    }

    // Add sorting
    query = query.orderBy(sortBy, sortOrder);

    // Add pagination
    if (limit) query = query.limit(limit);
    if (offset) query = query.offset(offset);

    return await query;
  },

  // Optimized count query
  async count({ search, filters = {} }) {
    let query = db(this.tableName).count('* as count');

    // Apply same filters as findAll
    if (search) {
      query = query.where(function() {
        this.where('WONumber', 'like', `%${search}%`)
            .orWhere('CustomerName', 'like', `%${search}%`)
            .orWhere('SerialNumber', 'like', `%${search}%`)
            .orWhere('PONumber', 'like', `%${search}%`)
            .orWhere('Manufacturer', 'like', `%${search}%`)
            .orWhere('ModelNumber', 'like', `%${search}%`);
      });
    }

    // Apply filters
    if (filters.workOrderStatus) query = query.where('WorkOrderStatus', filters.workOrderStatus);
    if (filters.itemStatus) query = query.where('ItemStatus', filters.itemStatus);
    if (filters.priority) query = query.where('Priority', filters.priority);
    if (filters.division) query = query.where('Division', filters.division);
    if (filters.location) query = query.where('Location', filters.location);
    if (filters.assignedUser) query = query.where('AssignedUser', filters.assignedUser);
    if (filters.customerId) query = query.where('CustID', filters.customerId);
    if (filters.hotList !== undefined) query = query.where('HotList', filters.hotList ? 1 : 0);
    if (filters.readyToBill !== undefined) query = query.where('ReadyToBill', filters.readyToBill ? 1 : 0);
    if (filters.dateFrom) query = query.where('CreatedDate', '>=', filters.dateFrom);
    if (filters.dateTo) query = query.where('CreatedDate', '<=', filters.dateTo);

    const result = await query.first();
    return parseInt(result.count);
  },

  // Get work order by ID using stored procedure
  async findById(id) {
    const result = await db.raw('EXEC sp_GetWorkOrderDetails ?', [id]);
    return result[0] && result[0][0] ? result[0][0] : null;
  },

  // Get work order comments (optimized)
  async findComments(workOrderId) {
    return await db('vw_WorkOrderComments_Optimized')
      .select('Comment', 'DateEntered', 'UserID')
      .where('WorkOrderID', workOrderId)
      .where('rn', '<=', 10) // Get only top 10 comments
      .orderBy('DateEntered', 'desc');
  },

  // Get work order status log (optimized)
  async findStatusLog(workOrderId) {
    return await db('vw_WorkOrderStatusLog_Optimized')
      .select('NewStatus', 'ChangeDate', 'UserID')
      .where('WorkOrderID', workOrderId)
      .where('rn', '<=', 20) // Get only top 20 status changes
      .orderBy('ChangeDate', 'desc');
  },

  // Optimized statistics using stored procedure
  async getStats() {
    const result = await db.raw('EXEC sp_GetWorkOrderStats');
    return result[0] && result[0][0] ? result[0][0] : {};
  },

  // Optimized grouping queries using stored procedures
  async getByStatus() {
    const result = await db.raw('EXEC sp_GetWorkOrdersByStatus');
    return result[0] || [];
  },

  async getByPriority() {
    const result = await db.raw('EXEC sp_GetWorkOrdersByPriority');
    return result[0] || [];
  },

  async getByDivision() {
    const result = await db.raw('EXEC sp_GetWorkOrdersByDivision');
    return result[0] || [];
  },

  // Get work order with all related data in one call
  async getWorkOrderWithDetails(id) {
    const [workOrder, comments, statusLog, amount] = await Promise.all([
      this.findById(id),
      this.findComments(id),
      this.findStatusLog(id),
      db('vw_WorkOrderAmounts_Optimized').where('WorkOrderID', id).first()
    ]);

    return {
      workOrder,
      comments,
      statusLog,
      amount: amount ? amount.TotalAmount : 0
    };
  }
};

module.exports = WorkOrderModel; 