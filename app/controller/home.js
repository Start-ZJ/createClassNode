'use strict';

const Controller = require('egg').Controller;
const utility = require("utility")//密码加密

class HomeController extends Controller {
  /** 
   * @descript 用户注册接口
   * @params userName 账号
   * @params passWord 密码
   * */
  async userRegister() {
    const { ctx } = this;
    const params = ctx.request.body;
    let md5PassWord = utility.md5(params.passWord);
    params.passWord = md5PassWord;
    let backBody = {
      code: '0',//'0'->账号重复，'1'->注册成功
      message: '注册账号与已有账号重复，请重新输入账号！'
    }
    const findUser = await ctx.service.user.findUser(params);
    if (!findUser.length) {
      const addUser = await ctx.service.user.addUser(params);
      if (addUser.affectedRows === 1) {
        backBody = {
          code: '1',
          message: '账号注册成功！'
        }
      }
    }
    this.ctx.body = backBody
  }
  /**
   * @descript 用户登录接口
   * @params userName 账号
   * @params passWord 密码
   * */
  async userLogin() {
    const { ctx } = this;
    const params = ctx.request.body;
    let md5PassWord = utility.md5(params.passWord);
    params.passWord = md5PassWord;
    const findUser = await ctx.service.user.userLoginFind(params);
    let backBody = {
      code: '1',
      isHaveUser: !!findUser.length,
      userData: findUser
    }
    console.log('findUser---->', backBody)
    this.ctx.body = backBody
  }
}

module.exports = HomeController;