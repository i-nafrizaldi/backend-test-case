"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRouter = void 0;
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
class MemberRouter {
    constructor() {
        this.memberController = new member_controller_1.MemberController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.memberController.getMemberController);
    }
    getRouter() {
        return this.router;
    }
}
exports.MemberRouter = MemberRouter;
