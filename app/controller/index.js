'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, index';
  }
}

module.exports = IndexController;
