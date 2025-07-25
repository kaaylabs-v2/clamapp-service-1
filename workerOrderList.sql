SELECT DISTINCT 
                  wo.WorkOrderID, wo.OriginalWorkOrderID, wo.WONumber, CONVERT(varchar(50), wo.WONumber) + CASE WHEN isnull(wo.ChildWONumber, 0) > 0 OR
                  isnull(wo.ParentWONumber, 0) > 0 THEN '*' ELSE '' END AS WONumberWithLink, wo.AcctNum, CONVERT(varchar(20), wo.CreatedDate, 101) AS CreatedDateDisplay, wo.CreatedDate, CONVERT(varchar(20), wo.ItemCreatedDate, 101) 
                  AS ItemCreatedDateDisplay, wo.ItemCreatedDate, p.Manufacturer, p.Model AS ModelNumber, p.ProductDescription, p.ProductID, p.DataSheetTemplate, CASE WHEN isnull(p.DataSheetTemplate, '') 
                  = '' THEN '' WHEN isnull(p.DataSheetTemplate, '') = 'METCAL' THEN '' ELSE 'ViewDatasheet.aspx?ProductID=' + CONVERT(varchar(20), p.ProductID) END AS DataSheetTemplateLink, wo.[Desc], wo.WorkOrderStatus, 
                  dbo.getLookup(wo.WorkOrderStatus) AS WorkOrderStatusName, wo.WorkOrderType, dbo.getLookup(wo.WorkOrderType) AS WorkOrderTypeName, wo.Priority, dbo.getLookup(wo.Priority) AS PriorityCode, wo.Division, 
                  dbo.getLookup(wo.Division) AS DivisionName, wo.Location, addr.Abbr AS LocationName, dbo.getLookup(wo.Location) AS LocationNameLong, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(DestLocation, 0)
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 1)) ELSE 0 END AS DestLocation, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(DestLocationNameShort, '')
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 2)) ELSE '' END AS DestLocationName, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(DestLocationNameLong, '')
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 3)) ELSE '' END AS DestLocationNameLong, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(OriginLocation, 0)
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 1)) ELSE 0 END AS OriginLocation, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(OriginLocationNameShort, '')
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 2)) ELSE '' END AS OriginLocationName, CASE WHEN ItemStatus = 236 THEN
                      (SELECT isnull(OriginLocationNameLong, '')
                       FROM      dbo.[f_GetWorkOrderTransitDataLocations](wo.WorkOrderID, 3)) ELSE '' END AS OriginLocationNameLong, wo.CalFreq, wo.EquipmentType, wo.ActionCode, wo.NeedBy, CONVERT(varchar(20), wo.NeedBy, 101) 
                  AS NeedByDisplay, wo.ReportNumber, wo.ItemName AS BatchNumber, cust.CustomerName, wo.ArrivalDate, CONVERT(varchar(20), wo.ArrivalDate, 101) AS ArrivalDateDisplay, wo.ArrivalType, wo.DepartureDate, CONVERT(varchar(20), 
                  wo.DepartureDate, 101) AS DepartureDateDisplay, wo.SerialNumber, wo.ShippedDate, CONVERT(varchar(20), wo.ShippedDate, 101) AS ShippedDateDisplay, wo.CustomerContactID1, wo.CustomerContactID2, wo.CustomerContactID3, 
                  wo.CustomerContactID4, wo.PONumber, wo.TFPONumber, wo.JMPONumber, wo.SONumber, wo.CustID, wo.CustSerial, wo.ItemStatus, CASE WHEN isnull(InvoiceStatus, - 1) > 0 AND 
                  ItemStatus = 93 THEN CASE WHEN InvoiceStatus = 101 AND isnull(SamsaraDocumentSubmitted, 0) > 0 THEN dbo.GetLookup(ItemStatus) + ' (DT - DEL)' WHEN InvoiceStatus = 101 THEN dbo.GetLookup(ItemStatus) 
                  + ' (DT)' ELSE dbo.GetLookup(ItemStatus) + ' (' + substring(dbo.GetLookup(InvoiceStatus), 1, 1) + ')' END ELSE dbo.getLookup(ItemStatus) END AS ItemStatusName, ISNULL
                      ((SELECT TOP (1) ChangeDate
                        FROM      dbo.tblStatusLog
                        WHERE   (WorkOrderID = wo.WorkOrderID) AND (NewStatus = dbo.getLookup(wo.ItemStatus))
                        ORDER BY ChangeDate DESC), NULL) AS ItemStatusDate, ISNULL
                      ((SELECT TOP (1) CONVERT(varchar(20), ChangeDate, 101) AS Expr1
                        FROM      dbo.tblStatusLog
                        WHERE   (WorkOrderID = wo.WorkOrderID) AND (NewStatus = dbo.getLookup(wo.ItemStatus))
                        ORDER BY ChangeDate DESC), '') AS ItemStatusDateDisplay,
                      (SELECT TOP (1) DateEntered
                       FROM      dbo.tblWorkOrderComments
                       WHERE   (WorkOrderID = wo.WorkOrderID)
                       ORDER BY DateEntered DESC) AS LastCommentDate, dbo.FormatDateFour
                      ((SELECT TOP (1) DateEntered
                        FROM      dbo.tblWorkOrderComments
                        WHERE   (WorkOrderID = wo.WorkOrderID)
                        ORDER BY DateEntered DESC)) AS LastCommentDateDisplay, wo.TFItemStatus, dbo.getLookup(wo.TFItemStatus) AS TFItemStatusName, wo.AssignedUser, dbo.getUser(wo.AssignedUser) AS AssignedUserName, wo.LabCodeID, 
                  ISNULL(lc.LabCode, '') AS LabCode,
                      (SELECT TOP (1) ISNULL(Comment, '') AS Expr1
                       FROM      dbo.tblWorkOrderComments
                       WHERE   (WorkOrderID = wo.WorkOrderID) AND (wo.ItemStatus = 85) AND (Comment LIKE 'TO LAB MANAGER%') OR
                                         (WorkOrderID = wo.WorkOrderID) AND (wo.ItemStatus = 98) AND (Comment LIKE 'QA DISAPPROVE%')
                       ORDER BY WorkOrderCommentID DESC) AS Comment, ISNULL(wo.New, 0) AS New, ISNULL(wo.Used, 0) AS Used, ISNULL(wo.Warranty, 0) AS Warranty, ISNULL(wo.ToFactory, 0) AS ToFactory, est.EstimateStatus, ISNULL(wo.ItemType, 
                  '') AS ItemType, pt.DisplayName AS ItemTypeName, CASE WHEN wo.ItemType = 1 THEN 'ESL - Gloves (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLGloves
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 16 THEN 'ITL - Gauges (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblITLGauges
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 4 THEN 'ESL - Sleeves (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLSleeves
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 3 THEN 'ESL - Matting (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLMatting
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 8 THEN 'ESL - Footwear (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLFootwear
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 2 THEN 'ESL - Blankets (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLBlankets
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 6 THEN 'ESL - Line Hoses (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLLineHoses
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 19 THEN 'ESL - Roll Blankets (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLRollBlankets
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 9 THEN 'ESL - CoverUps (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLCoverUps
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 13 THEN 'ESL - Jumpers (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLJumpers
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 7 THEN 'ESL - Grounds (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLGrounds
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 11 THEN 'ESL - Insulated Tools (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLInsTools
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 5 THEN 'ESL - Hotsticks (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLHotsticks
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 12 THEN 'ESL - Bucket Trucks (' + isnull(CONVERT(varchar(20),
                      (SELECT COUNT(*)
                       FROM      tblESLBucketTrucks
                       WHERE   isnull(Cancelled, 0) = 0 AND WorkOrderID = wo.WorkOrderID)), '') + ')' WHEN wo.ItemType = 0 AND p.Manufacturer = 'VARIOUS' AND isnull(wo.qty, 0) > 0 THEN 'SINGLE (' + CONVERT(varchar(20), wo.Qty) 
                  + ')' ELSE 'SINGLE' END AS ItemTypeNameDisplay, wo.RFID, wo.DateTested, CONVERT(varchar(20), wo.DateTested, 101) AS DateTestedDisplay, wo.Uncertainties AS v17025, ISNULL(wo.HotList, 0) AS HotList, CASE WHEN isnull(HotList, 0) 
                  = 0 THEN '' ELSE 'Y' END AS HotListDisplay, wo.VendorRMA, wo.TFClerk, dbo.getUser(wo.TFClerk) AS TFClerkName, cust.SalesCode, sc.SalesCodeName, wo.OverrideCheckout, wo.QuoteID, ISNULL(wo.ToShipping, 0) AS ToShipping, 
                  CASE WHEN isnull(ToShipping, 0) = 0 THEN '' ELSE 'Y' END AS ToShippingDisplay, wo.DT_CollAcct, wo.ToShippingDate, dbo.FormatDate(wo.ToShippingDate) AS ToShippingDateDisplay, woA.Amount, wo.LostEquip, 
                  CASE WHEN isnull(LostEquip, 0) = 0 THEN '' ELSE 'Y' END AS LostEquipDisplay, wo.LostEquipDate, dbo.FormatDate(wo.LostEquipDate) AS LostEquipDateDisplay, wo.ItemNumber, wo.ItemName, cust.IndustryCode, ic.IndustryCodeDesc, 
                  wo.ChildWONumber, wo.ParentWONumber, wo.NoPartialBilling, wo.ShipFromLocation, dbo.getLookup(wo.ShipFromLocation) AS ShipFromLocationName, wo.WaitCustItemStatus, dbo.getLookup(wo.WaitCustItemStatus) 
                  AS WaitCustItemStatusName, wo.WaitCustItemStatusOther, wo.ReturnedItem, CASE WHEN isnull(ReturnedItem, 0) = 1 THEN 'Yes' ELSE 'No' END AS ReturnedItemName, CASE WHEN isnull(cust.HasRotMgmt, 0) 
                  = 1 THEN 'Y' ELSE 'N' END AS HasRotManagement, wo.InvoiceStatus, dbo.getLookup(wo.InvoiceStatus) AS InvoiceStatusName, ISNULL(od.OSProjectNum, '') AS OSProjectNum, ISNULL(cs.Standards, '') AS Standards, 
                  CASE WHEN isnull(wocs.WorkOrderID, - 1) < 1 THEN NULL WHEN isnull(wocs.CompletionDate, '1900-01-01') = '1900-01-01' THEN CONVERT(date, wocs.CertDate) ELSE CONVERT(date, wocs.CompletionDate) END AS CertCompDate, 
                  CASE WHEN isnull(wocs.WorkOrderID, - 1) < 1 THEN NULL WHEN isnull(wocs.CompletionDate, '1900-01-01') = '1900-01-01' THEN CONVERT(varchar(20), CONVERT(date, wocs.CertDate), 101) ELSE CONVERT(varchar(20), CONVERT(date, 
                  wocs.CompletionDate), 101) END AS CertCompDateDisplay, wo.InvoiceNum, dt.DTNum, wo.WaitCustFollowupDate, wo.DelTicketFollowupDate, wo.ARInvToWaitCust, wo.RedTag, wo.SamsaraDocumentSubmitted, wo.ReadyToBill, 
                  CASE WHEN isnull(ReadyToBill, 0) = 1 THEN 'Y' ELSE 'N' END AS ReadyToBillDisplay, wo.ReadyToBillDate, dbo.FormatDate(wo.ReadyToBillDate) AS ReadyToBillDateDisplay, wo.Action
FROM     dbo.tblWorkOrders AS wo WITH (NOLOCK) INNER JOIN
                  dbo.tblCustomers AS cust WITH (NOLOCK) ON cust.AcctNum = wo.AcctNum INNER JOIN
                  dbo.vw_ProductTypes AS pt WITH (NOLOCK) ON pt.ProductTypeID = ISNULL(wo.ItemType, 0) LEFT OUTER JOIN
                  dbo.vw_WorkOrderAmounts AS woA WITH (NOLOCK) ON woA.WorkOrderID = wo.WorkOrderID LEFT OUTER JOIN
                  dbo.vw_OpenCDRs AS cdr WITH (NOLOCK) ON cdr.AcctNum = wo.AcctNum AND cdr.PONumber = wo.PONumber LEFT OUTER JOIN
                  dbo.tblSalesCodes AS sc WITH (NOLOCK) ON sc.SalesCode = cust.SalesCode LEFT OUTER JOIN
                  dbo.vw_Products AS p WITH (NOLOCK) ON p.ProductID = wo.ProductID LEFT OUTER JOIN
                  dbo.tblLabCodes AS lc WITH (NOLOCK) ON lc.LabCodeID = wo.LabCodeID LEFT OUTER JOIN
                  dbo.tblWorkOrderItemEstimates AS est WITH (NOLOCK) ON est.WorkOrderID = wo.WorkOrderID AND est.EstimateStatus <> 221 LEFT OUTER JOIN
                  dbo.tblIndustryCodes AS ic WITH (NOLOCK) ON ic.IndustryCode = cust.IndustryCode LEFT OUTER JOIN
                  dbo.vw_Addresses AS addr WITH (NOLOCK) ON addr.LocationID = wo.Location LEFT OUTER JOIN
                  dbo.tblOnsiteDefaults AS od WITH (NOLOCK) ON od.WONum = wo.WONumber LEFT OUTER JOIN
                  dbo.tblCertSheet AS cs ON cs.WorkOrderID = wo.WorkOrderID LEFT OUTER JOIN
                  dbo.tblWorkOrderCertSheets AS wocs ON wocs.WorkOrderID = wo.WorkOrderID LEFT OUTER JOIN
                  dbo.vw_DTNums AS dt WITH (NOLOCK) ON dt.WorkOrderID = wo.WorkOrderID