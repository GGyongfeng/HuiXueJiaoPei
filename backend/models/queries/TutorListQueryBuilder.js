const db = require('../../data/db')

/**
 * 家教订单列表查询构建器
 * 用于构建复杂的订单列表查询SQL
 */
class TutorListQueryBuilder {
  /**
   * 初始化查询构建器
   * 设置基础的SELECT语句，包含所有需要的表连接
   */
  constructor() {
    this.sql = `
      SELECT t.*, 
             c.username as created_by_name,
             u.username as updated_by_name,
             d.username as deleted_by_name,
             dt.name as deal_teacher_name,
             ds.username as deal_staff_name
      FROM tutor_orders t
      LEFT JOIN staff c ON t.created_by = c.id
      LEFT JOIN staff u ON t.updated_by = u.id
      LEFT JOIN staff d ON t.deleted_by = d.id
      LEFT JOIN teachers dt ON t.deal_teacher_id = dt.id
      LEFT JOIN staff ds ON t.deal_staff_id = ds.id
      WHERE 1=1
    `
    this.values = []  // 用于存储参数化查询的值
  }

  /**
   * 添加基础筛选条件
   * @param {Object} filters - 筛选条件对象
   * @param {boolean} filters.is_deleted - 是否已删除
   * @param {string} filters.status - 订单状态
   * @returns {TutorListQueryBuilder} 返回this以支持链式调用
   */
  addBasicFilters(filters) {
    if (filters.is_deleted !== undefined) {
      this.sql += ` AND t.is_deleted = ?`
      this.values.push(filters.is_deleted)
    }

    if (filters.status) {
      this.sql += ` AND t.status = ?`
      this.values.push(filters.status)
    }

    return this
  }

  /**
   * 添加学生相关的筛选条件
   * @param {Object} filters - 筛选条件对象
   * @param {string} filters.student_grade - 学生年级
   * @param {string} filters.student_gender - 学生性别
   * @returns {TutorListQueryBuilder}
   */
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

  /**
   * 添加教师相关的筛选条件
   * @param {Object} filters - 筛选条件对象
   * @param {string} filters.teacher_gender - 教师性别要求
   * @param {string} filters.teacher_type - 教师类型
   * @returns {TutorListQueryBuilder}
   */
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

  /**
   * 添加科目筛选条件
   * 支持单个科目或多个科目的查询
   * @param {string|string[]} subjects - 科目或科目数组
   * @returns {TutorListQueryBuilder}
   */
  addSubjectsFilter(subjects) {
    if (subjects) {
      if (Array.isArray(subjects)) {
        // 处理多个科目的情况
        this.sql += ` AND (FIND_IN_SET(?, t.subjects)`
        this.values.push(subjects[0])
        for (let i = 1; i < subjects.length; i++) {
          this.sql += ` OR FIND_IN_SET(?, t.subjects)`
          this.values.push(subjects[i])
        }
        this.sql += `)`
      } else {
        // 处理单个科目的情况
        this.sql += ` AND FIND_IN_SET(?, t.subjects)`
        this.values.push(subjects)
      }
    }
    return this
  }

  /**
   * 添加地区相关的筛选条件
   * @param {Object} filters - 筛选条件对象
   * @param {string} filters.district - 区域
   * @param {string} filters.city - 城市
   * @returns {TutorListQueryBuilder}
   */
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

  /**
   * 添加关键词搜索条件
   * 会在订单编号和需求描述中搜索
   * @param {string} keyword - 搜索关键词
   * @returns {TutorListQueryBuilder}
   */
  addKeywordSearch(keyword) {
    if (keyword) {
      this.sql += ` AND (t.tutor_code LIKE ? OR t.requirement_desc LIKE ?)`
      this.values.push(`%${keyword}%`, `%${keyword}%`)
    }
    return this
  }

  /**
   * 添加订单标签筛选条件
   * 支持单个标签或多个标签的查询
   * @param {string|string[]} orderTags - 订单标签或标签数组
   * @returns {TutorListQueryBuilder}
   */
  addOrderTagsFilter(orderTags) {
    if (orderTags) {
      if (Array.isArray(orderTags)) {
        // 处理多个标签的情况
        this.sql += ` AND (`
        this.sql += orderTags.map(() => `FIND_IN_SET(?, t.order_tags)`).join(' OR ')
        this.sql += `)`
        this.values.push(...orderTags)
      } else {
        // 处理单个标签的情况
        this.sql += ` AND FIND_IN_SET(?, t.order_tags)`
        this.values.push(orderTags)
      }
    }
    return this
  }

  /**
   * 添加分页条件
   * @param {Object} pagination - 分页参数对象
   * @param {number} pagination.page - 页码
   * @param {number} pagination.pageSize - 每页条数
   * @returns {TutorListQueryBuilder}
   */
  addPagination(pagination) {
    this.sql += ` ORDER BY t.id DESC`
    
    const page = Math.max(1, parseInt(pagination.page) || 1)
    const pageSize = Math.max(1, parseInt(pagination.pageSize) || 20)
    
    const offset = (page - 1) * pageSize
    this.sql += ` LIMIT ${offset}, ${pageSize}`
    
    return this
  }

  /**
   * 执行构建好的查询
   * @returns {Promise<Object>} 返回查询结果，包含列表数据和总数
   */
  async execute() {
    // 构建计数查询
    const countSql = `
      SELECT COUNT(*) as total 
      FROM tutor_orders t 
      WHERE 1=1 
      ${this.sql.split('WHERE 1=1')[1].split('ORDER BY')[0]}
    `
    
    // 不再需要从 values 中移除 LIMIT 参数，因为现在直接写在SQL中
    const countValues = [...this.values]

    try {
      const [rows, totalResult] = await Promise.all([
        db.query(this.sql, this.values),
        db.query(countSql, countValues)
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

module.exports = TutorListQueryBuilder 