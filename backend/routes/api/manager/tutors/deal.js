const express = require('express')
const router = express.Router()
const TutorsModel = require('../../../../models/tutorsModel')
const resCode = require('../../../../constants/resCode')

router.put('/:id', async (req, res) => {
  try {
    console.log('=== 开始处理订单状态更新 ===')
    console.log('请求参数:', {
      id: req.params.id,
      body: req.body
    })

    const { id } = req.params
    const { teacherId = null, status = '已成交' } = req.body
    const staffId = req.user?.id || 1
    
    console.log('解析后的参数:', {
      orderId: id,
      teacherId,
      staffId,
      status
    })
    
    // 验证 staffId
    if (!staffId) {
      console.log('验证失败: staffId 为空')
      return res.json({
        code: resCode.INVALID_PARAMS,
        message: '管理员ID不能为空'
      })
    }

    // 如果指定了教师ID，验证教师是否存在
    if (teacherId) {
      const teacherExists = await TutorsModel.checkTeacherExists(teacherId)
      if (!teacherExists) {
        console.log('验证失败: 教师不存在', teacherId)
        return res.json({
          code: resCode.INVALID_PARAMS,
          message: '指定的教师不存在'
        })
      }
    }

    // 根据状态选择不同的处理方法
    let result
    if (status === '已成交') {
      result = await TutorsModel.markAsDeal(id, teacherId, staffId)
    } else {
      result = await TutorsModel.markAsUnDeal(id, staffId)
    }
    
    console.log('Model 更新结果:', result)

    if (result) {
      console.log('更新成功，返回成功响应')
      res.json({
        code: resCode.SUCCESS,
        message: status === '已成交' ? '订单已成交' : '已取消成交'
      })
    } else {
      console.log('更新失败，返回失败响应')
      res.json({
        code: resCode.OPERATION_FAILED,
        message: '更新失败'
      })
    }

  } catch (error) {
    console.error('发生错误:', error)
    console.error('错误堆栈:', error.stack)
    res.json({
      code: resCode.INTERNAL_ERROR,
      message: '服务器错误'
    })
  } finally {
    console.log('=== 订单状态更新处理结束 ===')
  }
})

module.exports = router 