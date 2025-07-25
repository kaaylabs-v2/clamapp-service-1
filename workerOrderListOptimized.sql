
-- Create the optimized indexed view
CREATE VIEW dbo.vw_WorkOrderList_Optimized  AS
SELECT 
    wo.WorkOrderID,
    wo.OriginalWorkOrderID,
    wo.WONumber,
    wo.WONumberWithLink,
    wo.AcctNum,
    wo.CreatedDate,
    wo.CreatedDateDisplay,
    wo.ItemCreatedDate,
    wo.ItemCreatedDateDisplay,
    wo.WorkOrderStatus,
    wo.WorkOrderType,
    wo.Priority,
    wo.Division,
    wo.Location,
    wo.ItemStatus,
    wo.AssignedUser,
    wo.CustID,
    wo.ProductID,
    wo.NeedBy,
    wo.NeedByDisplay,
    wo.ReportNumber,
     wo.ItemName AS BatchNumber,
    wo.ArrivalDate,
    wo.ArrivalDateDisplay,
    wo.ArrivalType,
    wo.DepartureDate,
    wo.DepartureDateDisplay,
    wo.SerialNumber,
    wo.ShippedDate,
    wo.ShippedDateDisplay,
    wo.CustomerContactID1,
    wo.CustomerContactID2,
    wo.CustomerContactID3,
    wo.CustomerContactID4,
    wo.PONumber,
    wo.TFPONumber,
    wo.JMPONumber,
    wo.SONumber,
    wo.CustSerial,
    wo.TFItemStatus,
    wo.LabCodeID,
    wo.New,
    wo.Used,
    wo.Warranty,
    wo.ToFactory,
    wo.ItemType,
    wo.RFID,
    wo.DateTested,
    wo.DateTestedDisplay,
    wo.Uncertainties,
    wo.HotList,
    wo.HotListDisplay,
    wo.VendorRMA,
    wo.TFClerk,
    -- wo.SalesCode,
    wo.OverrideCheckout,
    wo.QuoteID,
    wo.ToShipping,
    wo.ToShippingDisplay,
    wo.DT_CollAcct,
    wo.ToShippingDate,
    wo.LostEquip,
    wo.LostEquipDisplay,
    wo.LostEquipDate,
    wo.ItemNumber,
    wo.ItemName,
    -- wo.IndustryCode,
    wo.ChildWONumber,
    wo.ParentWONumber,
    wo.NoPartialBilling,
    wo.ShipFromLocation,
    wo.WaitCustItemStatus,
    wo.WaitCustItemStatusOther,
    wo.ReturnedItem,
    wo.ReturnedItemName,
    -- Handle HasRotManagement directly in the view
    CASE WHEN ISNULL(cust.HasRotMgmt, 0) = 1 THEN 'Y' ELSE 'N' END AS HasRotManagement,
    wo.InvoiceStatus,
    -- wo.OSProjectNum,
    -- wo.Standards,
    -- wo.CertCompDate,
    -- wo.CertCompDateDisplay,
    wo.InvoiceNum,
    -- wo.DTNum,
    wo.WaitCustFollowupDate,
    wo.DelTicketFollowupDate,
    wo.ARInvToWaitCust,
    wo.RedTag,
    wo.SamsaraDocumentSubmitted,
    wo.ReadyToBill,
    wo.ReadyToBillDisplay,
    wo.ReadyToBillDate,
    wo.Action,
    -- Customer data
    cust.CustomerName,
    cust.HasRotMgmt,
    -- Product data
    p.Manufacturer,
    p.Model AS ModelNumber,
    p.ProductDescription,
    p.DataSheetTemplate,
    -- Location data
    addr.Abbr AS LocationName,
    -- addr.Name AS LocationNameLong,
    -- User data
    -- u1.UserName AS AssignedUserName,
    -- u2.UserName AS TFClerkName,
    -- Sales and Industry codes
    sc.SalesCodeName,
    ic.IndustryCodeDesc,
    -- Lab codes
    lc.LabCode,
    -- Product types
    pt.DisplayName AS ItemTypeName,
    -- Work order amounts
    ISNULL(woA.Amount, 0) AS Amount,
    -- Estimate status
    est.EstimateStatus,
    -- Status and comment dates
    sl.LastStatusDate,
    sl.LastStatusDateDisplay,
    wc.LastCommentDate,
    wc.LastCommentDateDisplay,
    wc.LastComment
FROM dbo.tblWorkOrders wo
INNER JOIN dbo.tblCustomers cust ON cust.AcctNum = wo.AcctNum
LEFT JOIN dbo.vw_Products p ON p.ProductID = wo.ProductID
LEFT JOIN dbo.vw_Addresses addr ON addr.LocationID = wo.Location
LEFT JOIN dbo.tblUsers u1 ON u1.UserID = wo.AssignedUser
LEFT JOIN dbo.tblUsers u2 ON u2.UserID = wo.TFClerk
LEFT JOIN dbo.tblSalesCodes sc ON sc.SalesCode = cust.SalesCode
LEFT JOIN dbo.tblIndustryCodes ic ON ic.IndustryCode = cust.IndustryCode
LEFT JOIN dbo.tblLabCodes lc ON lc.LabCodeID = wo.LabCodeID
LEFT JOIN dbo.vw_ProductTypes pt ON pt.ProductTypeID = ISNULL(wo.ItemType, 0)
LEFT JOIN dbo.vw_WorkOrderAmounts woA ON woA.WorkOrderID = wo.WorkOrderID
LEFT JOIN dbo.tblWorkOrderItemEstimates est ON est.WorkOrderID = wo.WorkOrderID AND est.EstimateStatus <> 221
LEFT JOIN dbo.tblOnsiteDefaults od ON od.WONum = wo.WONumber
LEFT JOIN dbo.tblCertSheet cs ON cs.WorkOrderID = wo.WorkOrderID
LEFT JOIN dbo.tblWorkOrderCertSheets wocs ON wocs.WorkOrderID = wo.WorkOrderID
LEFT JOIN dbo.vw_DTNums dt ON dt.WorkOrderID = wo.WorkOrderID
-- Subquery for last status date
LEFT JOIN (
    SELECT 
        WorkOrderID,
        MAX(ChangeDate) as LastStatusDate,
        MAX(CONVERT(varchar(20), ChangeDate, 101)) as LastStatusDateDisplay
    FROM dbo.tblStatusLog
    GROUP BY WorkOrderID
) sl ON sl.WorkOrderID = wo.WorkOrderID
-- Subquery for last comment
LEFT JOIN (
    SELECT 
        WorkOrderID,
        MAX(DateEntered) as LastCommentDate,
        MAX(dbo.FormatDateFour(DateEntered)) as LastCommentDateDisplay,
        MAX(CASE WHEN Comment LIKE 'TO LAB MANAGER%' 
                 OR Comment LIKE 'QA DISAPPROVE%' 
                 THEN Comment ELSE '' END) as LastComment
    FROM dbo.tblWorkOrderComments
    GROUP BY WorkOrderID
) wc ON wc.WorkOrderID = wo.WorkOrderID;


-- Create unique clustered index on the view
CREATE UNIQUE CLUSTERED INDEX IX_vw_WorkOrderList_Optimized_WorkOrderID 
ON dbo.vw_WorkOrderList_Optimized (WorkOrderID);

PRINT 'Created clustered index on vw_WorkOrderList_Optimized';

-- Create additional indexes for common query patterns
CREATE NONCLUSTERED INDEX IX_vw_WorkOrderList_Optimized_WONumber 
ON dbo.vw_WorkOrderList_Optimized (WONumber);

CREATE NONCLUSTERED INDEX IX_vw_WorkOrderList_Optimized_Status 
ON dbo.vw_WorkOrderList_Optimized (WorkOrderStatus, Priority);

CREATE NONCLUSTERED INDEX IX_vw_WorkOrderList_Optimized_Customer 
ON dbo.vw_WorkOrderList_Optimized (AcctNum, CustomerName);

CREATE NONCLUSTERED INDEX IX_vw_WorkOrderList_Optimized_Date 
ON dbo.vw_WorkOrderList_Optimized (CreatedDate, NeedBy);

PRINT 'Created additional indexes on vw_WorkOrderList_Optimized';