'use strict';
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;//故名思意 异步二进制 写入流
const sendToWormhole = require('stream-wormhole');//管道读入一个虫洞。
const utility = require("utility")//密码加密
const md5 = utility.md5;

class UploadController extends Controller {
  async addFile() {
    const ctx = this.ctx;
    //egg-multipart 已经帮我们处理文件二进制对象
    // node.js 和 php 的上传唯一的不同就是 ，php 是转移一个 临时文件
    // node.js 和 其他语言（java c#） 一样操作文件流
    const stream = await ctx.getFileStream();
    const filename = md5(stream.filename) + path//新建一个文件名
      .extname(stream.filename)
      .toLocaleLowerCase();
    //文件生成绝对路径
    //当然这里这样是不行的，因为你还要判断一下是否存在文件路径
    const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
    const writeStream = fs.createWriteStream(target);//生成一个文件写入 文件流
    try {//异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {//如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    }
    const port = 'http://127.0.0.1:7001';
    ctx.body = {//文件响应
      url: `${port}/public/uploads/${filename}`
    };
  }
}

module.exports = UploadController;