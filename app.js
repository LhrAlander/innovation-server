const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

// 中间件鉴权
const adminAuth = require('./middleware/auth')

// api接口路由所需
const user = require('./routes/api/user')
const baseInfo = require('./routes/api/baseInfo')
const student = require('./routes/api/student')
const teacher = require('./routes/api/teacher')
const company = require('./routes/api/company')
const category = require('./routes/api/category')
const project = require('./routes/api/project')
const team = require('./routes/api/team')
const award = require('./routes/api/award')
const policy = require('./routes/api/policy')
const dependent = require('./routes/api/dependent')
const notification = require('./routes/api/notification')
const fileSystem = require('./routes/api/fileSystem')
const recruitment = require('./routes/api/recruitment')
const uploads = require('./routes/api/uploads')
const download = require('./routes/api/download')
const login = require('./routes/api/login')

const authJudge = require('./routes/api/authJudge')

const studentBaseInfo = require('./routes/api/studentBaseInfo')
const studentProject = require('./routes/api/studentProject')
const studentTeam = require('./routes/api/studentTeam')
const studentAward = require('./routes/api/studentAward')


const teacherBaseInfo = require('./routes/api/teacherBaseInfo')
const teacherProject = require('./routes/api/teacherProject')
const teacherTeam = require('./routes/api/teacherTeam')
const teacherAward = require('./routes/api/teacherAward')
const teacherUnit = require('./routes/api/teacherUnit')

const frontIndex = require('./routes/api/frontIndex')
const frontProjects = require('./routes/api/frontProjects')
const frontPolicys = require('./routes/api/frontPolicys')
const frontFiles = require('./routes/api/frontFiles')
const frontNotifications = require('./routes/api/frontNotifications')
const frontRecruitments = require('./routes/api/frontRecruitments')
const frontTeams = require('./routes/api/frontTeams')
const frontAwards = require('./routes/api/frontAwards')



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 测试渲染
app.use('/index', (req, res, next) => {
  res.render('index')
})

app.use('/api/front/index', frontIndex)
app.use('/api/front/projects', frontProjects)
app.use('/api/front/policys', frontPolicys)
app.use('/api/front/fileSystems', frontFiles)
app.use('/api/front/notifications', frontNotifications)
app.use('/api/front/recruitments', frontRecruitments)
app.use('/api/front/teams', frontTeams)
app.use('/api/front/awards', frontAwards)
// jwt中间件
app.use(expressJwt({
  secret: "secret"//加密密钥，可换
}).unless({
  path: ["/api/login", "/index", '/api/download', '/api/upload/notification', 
  '/api/upload/fileSystem', '/api/upload/project', '/api/upload/policy', '/api/upload/recruitment',
"/api/front/index"]//添加不需要token的接口
}));

// 未携带token请求接口会出错，触发这个
app.use(function(err, req, res, next) {
  console.log('解析Token错误', err)
  if (err.name === "UnauthorizedError") {
      res.status(401).send(err);
  }
});

app.use('/api/login', login)
app.use('/api/download', download)
app.use('/api/upload', uploads)
app.use('/api/auth', (req, res, next) => {
  if (req.user.type == '管理员') {
    res.send(200)
  }
  else {
    next()
  }
}, authJudge)
app.use(adminAuth.auth)
app.use('/api/user', user)
app.use('/api/baseInfo', baseInfo)
app.use('/api/student', student)
app.use('/api/teacher', teacher)
app.use('/api/company', company)
app.use('/api/category', category)
app.use('/api/project', project)
app.use('/api/team', team)
app.use('/api/award', award)
app.use('/api/policy', policy)
app.use('/api/dependent', dependent)
app.use('/api/notification', notification)
app.use('/api/fileSystem', fileSystem)
app.use('/api/recruitment', recruitment)

app.use('/api/st/baseInfo', studentBaseInfo)
app.use('/api/st/project', studentProject)
app.use('/api/st/team', studentTeam)
app.use('/api/st/award', studentAward)

app.use('/api/th/baseInfo', teacherBaseInfo)
app.use('/api/th/project', teacherProject)
app.use('/api/th/team', teacherTeam)
app.use('/api/th/award', teacherAward)
app.use('/api/th/unit', teacherUnit)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
