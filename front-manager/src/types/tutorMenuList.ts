import type { TutorType } from './tutorOrder'

// 表格列的配置类型
export interface TableColumn {
  prop: string
  label: string
  width?: number
  fixed?: boolean | 'left' | 'right'
  formatter?: (row: TutorType) => string
  slot?: string   // 可选的插槽名称
  visible?: boolean  // 控制列的显示/隐藏
  comment?: string   // 添加这一行
}

// 默认的列配置
export const DEFAULT_COLUMNS: TableColumn[] = [
  { prop: 'tutor_code', label: '订单编号', width: 120, visible: true },
  { prop: 'student_grade', label: '年级', width: 100, visible: true },
  { prop: 'subjects', label: '科目', visible: true },
  { prop: 'status', label: '状态', width: 100, visible: true, slot: 'status' },
  {
    prop: 'created_at',
    label: '创建时间',
    width: 180,
    visible: true,
    formatter: (row: TutorType) => {
      if (!row.created_at) return ''
      return new Date(row.created_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }
  },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right', slot: 'operation', visible: true }
]

// 表格配置
export interface TableConfig {
  columns: TableColumn[]
  showPagination?: boolean
  pageSize?: number
  border?: boolean
  stripe?: boolean
}

// 导出默认配置
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  columns: DEFAULT_COLUMNS,
  showPagination: true,
  pageSize: 20,
  border: true,
  stripe: true
} 