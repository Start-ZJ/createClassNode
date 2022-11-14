### App
    - controller - 具体的路由业务
    - middleware - 放中间件的地方，具体用途之后再看 
    - public 
    - router - 具体的路由细分
    - service - 一些公共的方法写在这

### MySql
```
    await this.app.mysql.query('sql语句','') // 查询语句
// 查询单条语句 controller
await this.app.mysql.get('表名',{'id':3}); // 表名 + 条件
// 查询多条数据
await this.app.mysql.select('user',{limit:10,orders:[['id','desc']]}); //表名 + 条件
//查询数据总量total
let where = {
  name: '张三',
}
let whereStr = '';
Object.keys(where).map((item, index) =>{
   if(index!==0){
      whereStr = whereStr + ` && ${item} = '${where[item]}'`
   }else{
       whereStr = `WHERE ${item} = '${where[item]}'`
   }
})
const total = await this.app.mysql.query(`SELECT COUNT(*) AS total FROM menu ${whereStr}`, '');
// 通过SQL语句查询数据，查询条件为用户ID
let user_id=3;
await this.app.mysql.query(
    'select * from user where id=?',[user_id]
);
await this.app.mysql.query(
            'update user set username=? where password=?',['jack','123456']

// 增加数据
await this.app.mysql.insert('user',{username:'admin','password':123456});
// 修改数据
await this.app.mysql.update('user',{}) 
// 删除数据
await this.app.mysql.delete('user':{id:'1234'});
```
