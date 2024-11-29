require('dotenv').config();
const express = require('express');
const configureMiddleware = require('./backend/middleware');
const routes = require('./backend/routes');

const app = express();

// 配置中间件
configureMiddleware(app);

// 配置路由
app.use('/', routes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        code: 500,
        data: null,
        message: '服务器内部错误'
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`管理端访问地址: http://localhost:${PORT}/manager`);
    console.log(`教师端访问地址: http://localhost:${PORT}/teacher`);
});



