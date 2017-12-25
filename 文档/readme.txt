1. 修改 utils 目录下的 DBHlper 中的以下代码段
// 连接数据库
const pool = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'innovation_db'
});

其中修改 user字段和password字段为自己MySQL数据库的用户名和密码

2. 复制 文档 目录下的 dbsql.sql 至自己的数据库中完成数据库和表的创建

3. npm install

4. npm start

5. 打开谷歌浏览器的扩展程序界面，将 文档 目录下的Tabbed-PostMan.crx扩展文件安装完成

6. 使用postman进行api测试， 分别测试
    localhost:3000/api/user, 测试数据： userName: '随便'
    localhost:3000/api/deluser, 测试数据: userId: 2015210405043, state: 可用

7. 测试完成后查看user表内容

8. 文件目录结构解释：
    modal：一个js文件对应一张数据库中的表
    controller: 负责处理得到路由后的操作
    dao：负责存储数据库
    utils：存放了全局都需要使用的一些工具，比如数据库的一些操作等

9. 需要了解的技术：
    Promise：http://web.jobbole.com/85297/ http://web.jobbole.com/85454/
    
10. 开发注意事项：
    务必形成视图与数据分离的思想，即dao目录下的文件只操作数据库，controller目录下的文件
    只是获取前端传回来的参数并将dao获取到的数据返回给前端，modal目录下的文件暂时没有用处，
    但是为了日后方便还是需要存放这样一些数据模型
