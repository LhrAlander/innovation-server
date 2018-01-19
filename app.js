const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer')


const config = require('./config')
// api接口路由所需
const user = require('./routes/api/user')
const baseInfo = require('./routes/api/baseInfo')
const student = require('./routes/api/student')
const teacher = require('./routes/api/teacher')
const company = require('./routes/api/company')
const category = require('./routes/api/category')
const project = require('./routes/api/project')
const uploads = require('./routes/api/uploads')
const download = require('./routes/api/download')


// 设置上传组件的参数
const storage = multer.diskStorage({
  destination: config.uploadPath,
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
}).array('file')

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

app.use('/api/user', user)
app.use('/api/baseInfo', baseInfo)
app.use('/api/student', student)
app.use('/api/teacher', teacher)
app.use('/api/company', company)
app.use('/api/category', category)
app.use('/api/project', project)
app.use('/api/download', download)
app.use('/api/upload', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return next(err)
    }
    else {
      next()
    }
  })
}, uploads)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
