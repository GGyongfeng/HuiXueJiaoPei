const db = require('../data/db')
const TutorListQueryBuilder = require('./queries/TutorListQueryBuilder')
const TeacherTutorListQueryBuilder = require('./queries/TeacherTutorListQueryBuilder')

class TutorsModel {
  // 检查 tutor_code 是否已存在
  static async checkTutorCodeExists(tutorCode) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM tutor_orders 
      WHERE tutor_code = ?
    `
    const result = await db.query(sql, [tutorCode])
    return result[0].count > 0
  }

  // 创建家教订单
  static async create(data, staffId) {
    // 首先检查 tutor_code 是否已存在
    const exists = await this.checkTutorCodeExists(data.tutor_code)
    if (exists) {
      throw new Error('订单编号已存在')
    }

    const sql = `
      INSERT INTO tutor_orders (
        tutor_code, student_gender, teaching_type, student_grade,
        subjects, teacher_type, teacher_gender, order_tags,
        district, city, address, grade_score, student_level,
        tutoring_time, salary, requirement_desc, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const values = [
      data.tutor_code,
      data.student_gender,
      data.teaching_type,
      data.student_grade,
      data.subjects.join(','),
      data.teacher_type || '无',
      data.teacher_gender || '无',
      data.order_tags ? data.order_tags.join(',') : null,
      data.district,
      data.city || '天津',
      data.address,
      data.grade_score,
      data.student_level,
      data.tutoring_time,
      data.salary,
      data.requirement_desc,
      staffId
    ]

    const result = await db.query(sql, values)
    return result.insertId
  }

  // 更新家教订单
  static async update(id, data, staffId) {
    const updates = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'subjects' || key === 'order_tags') {
          updates.push(`${key} = ?`)
          values.push(Array.isArray(value) ? value.join(',') : value)
        } else {
          updates.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    values.push(staffId)
    values.push(id)

    const sql = `
      UPDATE tutor_orders 
      SET ${updates.join(', ')}, updated_by = ?
      WHERE id = ? AND is_deleted = FALSE
    `

    const result = await db.query(sql, values)
    return result.affectedRows > 0
  }

  // 软删除家教订单
  static async delete(id, staffId) {
    const sql = `
      UPDATE tutor_orders 
      SET is_deleted = TRUE, 
          deleted_by = ?, 
          deleted_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_deleted = FALSE
    `
    const result = await db.query(sql, [staffId, id])
    return result.affectedRows > 0
  }

  // 获取家教订单列表
  static async getList(filters = {}, pagination = {}) {
    const query = new TutorListQueryBuilder()
    
    return await query
      .addBasicFilters(filters)
      .addStudentFilters(filters)
      .addTeacherFilters(filters)
      .addSubjectsFilter(filters.subjects)
      .addLocationFilters(filters)
      .addKeywordSearch(filters.keyword)
      .addOrderTagsFilter(filters.order_tags)
      .addPagination(pagination)
      .execute()
  }

  // 获取单个家教订单详情
  static async getById(id) {
    const sql = `
      SELECT t.*, 
             c.name as created_by_name,
             u.name as updated_by_name,
             d.name as deleted_by_name,
             dt.name as deal_teacher_name,
             ds.name as deal_staff_name
      FROM tutor_orders t
      LEFT JOIN staff c ON t.created_by = c.id
      LEFT JOIN staff u ON t.updated_by = u.id
      LEFT JOIN staff d ON t.deleted_by = d.id
      LEFT JOIN teachers dt ON t.deal_teacher_id = dt.id
      LEFT JOIN staff ds ON t.deal_staff_id = ds.id
      WHERE t.id = ? AND t.is_deleted = FALSE
    `
    const rows = await db.query(sql, [id])
    return rows[0]
  }

  // 更新订单状态为已成交
  static async markAsDeal(id, teacherId, staffId) {
    const sql = `
      UPDATE tutor_orders 
      SET status = '已成交',
          deal_time = CURRENT_TIMESTAMP,
          deal_teacher_id = ?,
          deal_staff_id = ?,
          updated_by = ?
      WHERE id = ? AND is_deleted = FALSE
    `
    const result = await db.query(sql, [teacherId, staffId, staffId, id])
    return result.affectedRows > 0
  }

  // 获取教师端家教订单列表
  static async getTeacherList(filters = {}, pagination = {}) {
    const query = new TeacherTutorListQueryBuilder()
    
    return await query
      .addBasicFilters(filters)
      .addStudentFilters(filters)
      .addTeacherFilters(filters)
      .addSubjectsFilter(filters.subjects)
      .addLocationFilters(filters)
      .addKeywordSearch(filters.keyword)
      .addPagination(pagination)
      .execute()
  }
}

module.exports = TutorsModel
