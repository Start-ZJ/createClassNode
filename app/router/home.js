'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/home/userRegister', controller.home.userRegister);//用户注册
  router.post('/home/userLogin', controller.home.userLogin);//用户登录
  router.post('/home/userVerificationCodeGeneration', controller.home.userVerificationCodeGeneration);//用户手机验证码获取接口
};
