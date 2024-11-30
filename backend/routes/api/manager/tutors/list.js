const express = require('express')
const router = express.Router()
const TutorsModel = require('../../../../models/tutorsModel')
const resCode = require('../../../../constants/resCode')

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 20, 
      keyword,
      status,
      district,
      is_deleted,
      student_grade,
      student_gender,
      teacher_gender,
      teacher_type,
      subjects,
      teaching_type,
      city,
      order_tags
    } = req.query

    const filters = {
      keyword,
      status: status,
      district,
      is_deleted: is_deleted === 'true' ? true : false,
      student_grade,
      student_gender,
      teacher_gender,
      teacher_type,
      subjects: subjects ? (Array.isArray(subjects) ? subjects : [subjects]) : undefined,
      teaching_type,
      city,
      order_tags: order_tags ? (Array.isArray(order_tags) ? order_tags : [order_tags]) : undefined
    }

    const pagination = {
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20
    }

    const result = await TutorsModel.getList(filters, pagination)
    
    res.json({
      code: resCode.SUCCESS,
      message: '获取成功',
      data: {
        list: result.list,
        total: result.total,
        page: pagination.page,
        pageSize: pagination.pageSize
      }
    })
  } catch (error) {
    console.error('获取家教订单列表失败:', error)
    res.json({
      code: resCode.INTERNAL_ERROR,
      message: '获取列表失败'
    })
  }
})

module.exports = router 