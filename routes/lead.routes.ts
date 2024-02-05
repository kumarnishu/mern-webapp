import express from "express";
import { BulkLeadUpdateFromExcel, ConvertCustomer, CreateLead, DeleteLead, FuzzySearchCustomers, FuzzySearchLeads, GetCustomers, GetLeads, NewRemark, UpdateLead, GetUpdatableLeadFields, UpdateLeadFields, BackUpAllLeads, CreateReferParty, UpdateReferParty, DeleteReferParty, ReferLead, RemoveLeadReferrals, FuzzySearchUseLessLeads, GetUselessLeads, BulkDeleteUselessLeads, ToogleUseless, FuzzySearchRefers, GetRefers, GetPaginatedRefers, AssignRefer, BulkAssignLeads, BulkAssignRefer, GetReminderRemarks, UpdateRemark, DeleteRemark, GetRemarks, CreateBroadcast, UpdateBroadcast, StopBroadcast, StartBroadcast, GetBroadcast, ToogleStatus, GetVisitingCards, GetMyVisitingCards, CreateVisitingCard, UpdateVisitingCard, ReferVisitingCard, AddCommentToCard } from "../controllers/lead.controller";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";

const router = express.Router()
router.route("/useless/leads")
    .get(isAuthenticatedUser, GetUselessLeads)
router.route("/leads")
    .get(isAuthenticatedUser, GetLeads)
    .post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)
router.route("/customers").get(isAuthenticatedUser, GetCustomers)
    .post(isAuthenticatedUser, upload.single('visiting_card'), CreateLead)
router.route("/remarks")
    .get(isAuthenticatedUser, GetRemarks)
router.route("/leads/:id")
    .put(isAuthenticatedUser, upload.single('visiting_card'), UpdateLead)
    .patch(isAuthenticatedUser, ConvertCustomer)
    .delete(isAuthenticatedUser, DeleteLead)
router.route("/assign/refer/:id").patch(isAuthenticatedUser, AssignRefer)
router.route("/toogle/useless/:id").patch(isAuthenticatedUser, ToogleUseless)
router.route("/update/leads/bulk").put(isAuthenticatedUser, upload.single('file'), BulkLeadUpdateFromExcel)
router.route("/remarks/leads/:id").patch(isAuthenticatedUser, NewRemark)
router.route("/remarks/:id").put(isAuthenticatedUser, UpdateRemark)
router.route("/remarks/:id").delete(isAuthenticatedUser, DeleteRemark)
router.route("/search/leads").get(isAuthenticatedUser, FuzzySearchLeads)
router.route("/search/leads/useless").get(isAuthenticatedUser, FuzzySearchUseLessLeads)
router.route("/search/customers").get(isAuthenticatedUser, FuzzySearchCustomers)
router.route("/fields/lead/update").put(isAuthenticatedUser, UpdateLeadFields)
router.route("/lead-updatable-fields").get(isAuthenticatedUser, GetUpdatableLeadFields)
router.route("/backup/leads").get(isAuthenticatedUser, BackUpAllLeads)
router.route("/refers/leads/:id").post(isAuthenticatedUser, ReferLead)
router.route("/refers/leads/:id").patch(isAuthenticatedUser, RemoveLeadReferrals)
router.route("/refers").get(isAuthenticatedUser, GetRefers)
router.route("/refers/paginated").get(isAuthenticatedUser, GetPaginatedRefers)
router.route("/search/refers").get(isAuthenticatedUser, FuzzySearchRefers)
router.route("/refers").post(isAuthenticatedUser, CreateReferParty)
router.route("/refers/:id").put(isAuthenticatedUser, UpdateReferParty)
router.route("/refers/:id").delete(isAuthenticatedUser, DeleteReferParty)
router.route("/bulk/leads/delete").post(isAuthenticatedUser, BulkDeleteUselessLeads)
router.route("/bulk/assign/leads").put(isAuthenticatedUser, BulkAssignLeads)
router.route("/bulk/assign/refers").put(isAuthenticatedUser, BulkAssignRefer)
router.route("/reminder/remarks").get(isAuthenticatedUser, GetReminderRemarks)
router.route("/broadcast").get(isAuthenticatedUser, GetBroadcast)
router.route("/broadcast").post(isAuthenticatedUser, CreateBroadcast)
router.route("/broadcast/:id").put(isAuthenticatedUser, UpdateBroadcast)
router.route("/broadcast/stop/:id").patch(isAuthenticatedUser, StopBroadcast)
router.route("/broadcast/start/:id").patch(isAuthenticatedUser, StartBroadcast)
router.route("/cards/:id").put(isAuthenticatedUser, UpdateVisitingCard)
router.route("/cards").post(isAuthenticatedUser, CreateVisitingCard)
router.route("/cards").get(isAuthenticatedUser, GetVisitingCards)
router.route("/cards/me").get(isAuthenticatedUser, GetMyVisitingCards)
router.route("/toogle/status/card/:id").patch(isAuthenticatedUser, ToogleStatus)
router.route("/refer/card/:id").patch(isAuthenticatedUser, ReferVisitingCard)
router.route("/comment/card/:id").patch(isAuthenticatedUser, AddCommentToCard)

export default router