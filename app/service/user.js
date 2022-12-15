const Service = require('egg').Service;

class UserService extends Service {
  /** @descript 用户添加接口 */
  async addUser(params) {
    const addUser = await this.app.mysql.insert('userbase', {
      userName: params.userName,
      userPassWord: params.passWord
    });
    return addUser;
  }
  /** @descript 用户查询接口 */
  async userLoginFind(params) {
    const findUser = await this.app.mysql.query('select * from userbase where userName=? and userPassWord=?', [params.userName, params.passWord]);
    return findUser;
  }
  /** @descript 查询阿里云验证码的key */
  async smsKeyFind() {
    const findUser = await this.app.mysql.query('select * from AccessKey_List where admin=?', ['StartZJ']);
    return findUser;
  }
}

module.exports = UserService;