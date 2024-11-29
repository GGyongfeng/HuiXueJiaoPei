const db = require('../../data/db')

class TeacherTutorListQueryBuilder {
  constructor() {
    // 只选择教师端需要展示的字段
    this.sql = `
      SELECT 
        t.id,
        t.tutor_code,
        t.student_gender,
        t.teaching_type,
        t.student_grade,
        t.subjects,
        t.teacher_type,
        t.teacher_gender,
        t.order_tags,
        t.district,
        t.city,
        t.address,
        t.grade_score,
        t.student_level,
        t.tutoring_time,
        t.salary,
        t.requirement_desc
      FROM tutor_orders t
      WHERE 1=1
    `
    this.values = []
  }

  // 添加基础筛选条件（包含默认值）
  addBasicFilters(filters) {
    // 默认条件：未删除、可见、未成交
    this.sql += ` AND t.is_deleted = FALSE`
    this.sql += ` AND t.is_visible = TRUE`
    this.sql += ` AND t.status = '未成交'`

    return this
  }

  // 其他筛选方法与 TutorListQueryBuilder 类似
  addStudentFilters(filters) {
    if (filters.student_grade) {
      this.sql += ` AND t.student_grade = ?`
      this.values.push(filters.student_grade)
    }

    if (filters.student_gender) {
      this.sql += ` AND t.student_gender = ?`
      this.values.push(filters.student_gender)
    }
    return this
  }

  addTeacherFilters(filters) {
    if (filters.teacher_gender) {
      this.sql += ` AND t.teacher_gender = ?`
      this.values.push(filters.teacher_gender)
    }

    if (filters.teacher_type) {
      this.sql += ` AND t.teacher_type = ?`
      this.values.push(filters.teacher_type)
    }
    return this
  }

  addSubjectsFilter(subjects) {
    if (subjects) {
      if (Array.isArray(subjects)) {
        this.sql += ` AND (FIND_IN_SET(?, t.subjects)`
        this.values.push(subjects[0])
        for (let i = 1; i < subjects.length; i++) {
          this.sql += ` OR FIND_IN_SET(?, t.subjects)`
          this.values.push(subjects[i])
        }
        this.sql += `)`
      } else {
        this.sql += ` AND FIND_IN_SET(?, t.subjects)`
        this.values.push(subjects)
      }
    }
    return this
  }

  addLocationFilters(filters) {
    if (filters.district) {
      this.sql += ` AND t.district = ?`
      this.values.push(filters.district)
    }

    if (filters.city) {
      this.sql += ` AND t.city = ?`
      this.values.push(filters.city)
    }
    return this
  }

  addKeywordSearch(keyword) {
    if (keyword) {
      this.sql += ` AND (t.requirement_desc LIKE ?)`  // 教师端只搜索需求描述
      this.values.push(`%${keyword}%`)
    }
    return this
  }

  addPagination(pagination) {
    // 使用 id 降序排序，而不是 created_at
    this.sql += ` ORDER BY t.id DESC`
    
    const page = Math.max(1, parseInt(pagination.page) || 1)
    const pageSize = Math.max(1, parseInt(pagination.pageSize) || 20)
    
    const offset = (page - 1) * pageSize
    this.sql += ` LIMIT ${offset}, ${pageSize}`
    
    return this
  }

  async execute() {
    const countSql = `
      SELECT COUNT(*) as total 
      FROM tutor_orders t 
      WHERE 1=1 
      ${this.sql.split('WHERE 1=1')[1].split('ORDER BY')[0]}
    `
    
    try {
      const [rows, totalResult] = await Promise.all([
        db.query(this.sql, this.values),
        db.query(countSql, this.values)
      ])

      return {
        list: rows,
        total: totalResult[0].total
      }
    } catch (error) {
      console.error('SQL:', this.sql)
      console.error('Values:', this.values)
      throw error
    }
  }
}

module.exports = TeacherTutorListQueryBuilder 