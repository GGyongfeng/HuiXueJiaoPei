// 表格列的配置类型
export interface TableColumn {
  prop: string          // 对应数据的字段名
  label: string         // 列标题
  width?: number        // 列宽度
  fixed?: boolean | 'left' | 'right'  // 是否固定列
  formatter?: (row: any) => string    // 格式化函数
  slot?: string         // 自定义插槽名
}

// 表格配置类型
export interface TableConfig {
  columns: TableColumn[]  // 列配置
  showPagination?: boolean  // 是否显示分页
  pageSize?: number        // 每页条数
  border?: boolean         // 是否显示边框
  stripe?: boolean         // 是否显示斑马纹
}

// 默认表格配置
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  columns: [
    {
      prop: 'tutor_code',
      label: '订单编号',
      width: 120
    },
    {
      prop: 'student_grade',
      label: '年级',
      width: 100
    },
    {
      prop: 'subjects',
      label: '科目',
      formatter: (row) => Array.isArray(row.subjects) ? row.subjects.join('、') : row.subjects
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      slot: 'status'  // 使用自定义插槽
    },
    {
      prop: 'created_at',
      label: '创建时间',
      width: 180,
      formatter: (row) => new Date(row.created_at).toLocaleString()
    },
    {
      prop: 'operation',
      label: '操作',
      width: 200,
      fixed: 'right',
      slot: 'operation'
    }
  ],
  showPagination: true,
  pageSize: 20,
  border: true,
  stripe: true
} 