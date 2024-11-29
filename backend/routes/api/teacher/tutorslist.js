const express = require('express')
const router = express.Router()
const TutorsModel = require('../../../models/tutorsModel')

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 20, 
      keyword,
      district,
      student_grade,
      student_gender,
      teacher_gender,
      teacher_type,
      subjects,
      teaching_type,
      city
    } = req.query

    const filters = {
      keyword,
      district,
      student_grade,
      student_gender,
      teacher_gender,
      teacher_type,
      subjects: subjects ? (Array.isArray(subjects) ? subjects : [subjects]) : undefined,
      teaching_type,
      city
    }

    const pagination = {
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 20
    }

    const result = await TutorsModel.getTeacherList(filters, pagination)
    
    res.json({
      code: 0,
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
      code: 500,
      message: '获取列表失败'
    })
  }
})

module.exports = router
