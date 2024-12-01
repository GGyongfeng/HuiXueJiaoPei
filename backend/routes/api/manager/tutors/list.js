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
      order_tags,
      student_level,
      is_visible
    } = req.query

    const processArrayParam = (param) => {
      if (!param) return undefined
      return Array.isArray(param) ? param : [param]
    }

    const filters = {
      keyword,
      status: processArrayParam(status),
      district: processArrayParam(district),
      is_deleted: is_deleted === 'true' ? true : false,
      student_grade: processArrayParam(student_grade),
      student_gender: processArrayParam(student_gender),
      teacher_gender: processArrayParam(teacher_gender),
      teacher_type: processArrayParam(teacher_type),
      subjects: processArrayParam(subjects),
      teaching_type: processArrayParam(teaching_type),
      city: processArrayParam(city),
      order_tags: processArrayParam(order_tags),
      student_level: processArrayParam(student_level),
      is_visible: processArrayParam(is_visible)
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