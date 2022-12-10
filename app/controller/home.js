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
    const findUser = await ctx.service.user.userLoginFind(params);
    let backBody = {};
    if (!!findUser.length) {
      backBody = {
        code: '1',//'1'->账号重复，'0'->注册成功
        message: '注册账号与已有账号重复，请重新输入账号！'
      }
    } else {
      const addUser = await ctx.service.user.addUser(params);
      const findUserAgain = await ctx.service.user.userLoginFind(params);
      if (!!addUser) {
        backBody = {
          code: '0',
          message: '注册成功！',
          userData: findUserAgain
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
    this.ctx.body = backBody
  }
}

module.exports = HomeController;