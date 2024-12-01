const db = require('../../data/db')
const { FILTER_FIELDS } = require('../../types/filters')

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
   * 添加通用筛选条件
   * @param {Object} filters - 筛选条件对象
   * @returns {TutorListQueryBuilder}
   */
  addFilters(filters) {
    FILTER_FIELDS.forEach(field => {
      if (filters[field] && filters[field].length > 0) {
        if (field === 'subjects' || field === 'order_tags') {
          // 特殊处理 FIND_IN_SET 的字段
          this.sql += ` AND (`
          this.sql += filters[field].map(() => `FIND_IN_SET(?, t.${field})`).join(' OR ')
          this.sql += `)`
          this.values.push(...filters[field])
        } else {
          // 普通 IN 查询
          this.sql += ` AND t.${field} IN (${filters[field].map(() => '?').join(',')})`
          this.values.push(...filters[field])
        }
      }
    })
    return this
  }

  /**
   * 添加地区相关的筛选条件
   * @param {Object} filters - 筛选条件对象
   * @param {string[]} filters.district - 区域
   * @param {string[]} filters.city - 城市
   * @returns {TutorListQueryBuilder}
   */
  addLocationFilters(filters) {
    if (filters.district && filters.district.length > 0) {
      this.sql += ` AND t.district IN (${filters.district.map(() => '?').join(',')})`
      this.values.push(...filters.district)
    }

    if (filters.city && filters.city.length > 0) {
      this.sql += ` AND t.city IN (${filters.city.map(() => '?').join(',')})`
      this.values.push(...filters.city)
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
   * 添加教学类型筛选条件
   * @param {Object} filters - 筛选条件对象
   * @returns {TutorListQueryBuilder}
   */
  addTeachingTypeFilter(filters) {
    if (filters.teaching_type && filters.teaching_type.length > 0) {
      this.sql += ` AND t.teaching_type IN (${filters.teaching_type.map(() => '?').join(',')})`
      this.values.push(...filters.teaching_type)
    }
    return this
  }

  /**
   * 添加学生水平筛选条件
   * @param {Object} filters - 筛选条件对象
   * @returns {TutorListQueryBuilder}
   */
  addStudentLevelFilter(filters) {
    if (filters.student_level && filters.student_level.length > 0) {
      this.sql += ` AND t.student_level IN (${filters.student_level.map(() => '?').join(',')})`
      this.values.push(...filters.student_level)
    }
    return this
  }

  /**
   * 添加可见状态筛选条件
   * @param {Object} filters - 筛选条件对象
   * @returns {TutorListQueryBuilder}
   */
  addVisibilityFilter(filters) {
    if (filters.is_visible && filters.is_visible.length > 0) {
      this.sql += ` AND t.is_visible IN (${filters.is_visible.map(() => '?').join(',')})`
      this.values.push(...filters.is_visible)
    }
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