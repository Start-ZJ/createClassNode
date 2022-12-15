'use strict';

const Controller = require('egg').Controller;
const utility = require("utility")//密码加密
const SMSClient = require('@alicloud/sms-sdk');//阿里云的验证码模块
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
  /**
   * @descript 用户验证码生成
   * @params mobile 手机号
   * */
  async userVerificationCodeGeneration(){
    const { ctx } = this;
    const params = ctx.request.body;
    const smsKey = await ctx.service.user.smsKeyFind();
    const smsCode = Math.random().toString().slice(-6);// 生成六位随机验证码
    const accessKeyId = smsKey[0].AccessKeyID;// AccessKey ID
    const secretAccessKey = smsKey[0].AccessKeySecret;// AccessKey Secret
    const signName = '创意班博客验证码'; // 签名名称
    const templateCode = "SMS_154950909";// 短信模板code
    const mobile = params.mobile;//手机号
    const smsClient = new SMSClient({ accessKeyId, secretAccessKey });// 初始化sms_client    
    return
    // 开始发送短信
    smsClient.sendSMS({
      PhoneNumbers: mobile,
      SignName: signName, //签名名称 前面提到要准备的
      TemplateCode: templateCode, //模版CODE  前面提到要准备的
      TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
    }).then(result => {
      console.log("result：", result)
      let { Code } = result;
      if (Code == 'OK') {
        res.json({
          code: 0,
          msg: 'success',
          sms: smsCode
        })
        console.log("result:", result);
      }
    }).catch(err => {
      console.log("报错：", err);
      res.json({
        code: 1,
        msg: 'fail: ' + err.data.Message
      })
    })
    // let backBody = {};
    // if (!!findUser.length) {
    //   backBody = {
    //     code: '1',//'1'->账号重复，'0'->注册成功
    //     message: '注册账号与已有账号重复，请重新输入账号！'
    //   }
    // } else {
    //   const addUser = await ctx.service.user.addUser(params);
    //   const findUserAgain = await ctx.service.user.userLoginFind(params);
    //   if (!!addUser) {
    //     backBody = {
    //       code: '0',
    //       message: '注册成功！',
    //       userData: findUserAgain
    //     }
    //   }
    // }
    // this.ctx.body = backBody
  }
}

module.exports = HomeController;