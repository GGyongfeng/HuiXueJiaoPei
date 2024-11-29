const express = require('express')
const router = express.Router()
const TutorsModel = require('../../../../models/tutorsModel')

router.put('/:id/deal', async (req, res) => {
  try {
    const { id } = req.params
    const { teacherId } = req.body
    const staffId = req.user.id

    const success = await TutorsModel.markAsDeal(id, teacherId, staffId)
    
    if (success) {
      res.json({
        code: 0,
        message: '订单已成交'
      })
    } else {
      res.json({
        code: 404,
        message: '订单不存在或已被删除'
      })
    }
  } catch (error) {
    console.error('更新订单成交状态失败:', error)
    res.json({
      code: 500,
      message: '操作失败'
    })
  }
})

module.exports = router 