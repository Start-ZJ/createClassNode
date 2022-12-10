'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '噫~这里什么也没有哦！';
  }
}

module.exports = IndexController;
