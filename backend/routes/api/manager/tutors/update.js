const express = require('express')
const router = express.Router()
const TutorsModel = require('../../../../models/tutorsModel')

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body
    const staffId = req.user.id

    const success = await TutorsModel.update(id, data, staffId)
    
    if (success) {
      res.json({
        code: 0,
        message: '更新成功'
      })
    } else {
      res.json({
        code: 404,
        message: '订单不存在或已被删除'
      })
    }
  } catch (error) {
    console.error('更新家教订单失败:', error)
    res.json({
      code: 500,
      message: '更新失败'
    })
  }
})

module.exports = router 