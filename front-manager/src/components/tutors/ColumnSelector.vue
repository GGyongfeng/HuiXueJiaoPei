<template>
  <el-popover
    placement="bottom"
    :width="300"
    trigger="click"
  >
    <template #reference>
      <el-button type="primary" class="icon-button">
        <el-icon><Setting /></el-icon>
        <span>列设置</span>
      </el-button>
    </template>

    <div class="column-selector">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      
      <el-divider />
      
      <el-checkbox-group 
        v-model="selectedColumns"
        @change="handleCheckedChange"
      >
        <div v-for="item in columnOptions" :key="item.prop" class="column-item">
          <el-checkbox :label="item.prop">
            {{ item.label }}
            <el-tooltip :content="item.comment" placement="right">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Setting, InfoFilled } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import type { TableColumn } from '@/types/tutorMenuList'
import type { TutorType } from '@/types/tutorOrder'

// 列选项定义
const columnOptions: TableColumn[] = [
  { 
    prop: 'tutor_code', 
    label: '订单编号', 
    width: 120,
    visible: true 
  },
  { 
    prop: 'student_gender', 
    label: '学生性别', 
    width: 100,
    visible: true 
  },
  { 
    prop: 'teaching_type', 
    label: '教学类型', 
    width: 120,
    visible: true 
  },
  { 
    prop: 'student_grade', 
    label: '学生年级', 
    width: 100,
    visible: true 
  },
  { 
    prop: 'subjects', 
    label: '补习科目', 
    formatter: (row: TutorType) => Array.isArray(row.subjects) ? row.subjects.join('、') : row.subjects,
    visible: true 
  },
  { 
    prop: 'status', 
    label: '订单状态', 
    width: 100,
    slot: 'status',
    visible: true 
  },
  { 
    prop: 'created_at', 
    label: '创建时间', 
    width: 180,
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
    },
    visible: true 
  },
  // ... 其他列配置
  { 
    prop: 'operation', 
    label: '操作', 
    width: 200,
    fixed: 'right',
    slot: 'operation',
    visible: true 
  }
]

// 默认选中的列
const defaultColumns = [
  'tutor_code',
  'student_grade',
  'subjects',
  'status',
  'created_at'
]

const selectedColumns = ref<string[]>(defaultColumns)
const checkAll = ref(false)
const isIndeterminate = ref(true)

// 全选/取消全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  selectedColumns.value = val ? columnOptions.map(item => item.prop) : []
  isIndeterminate.value = false
  emitChange()
}

// 选择变化
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === columnOptions.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columnOptions.length
  emitChange()
}

const emit = defineEmits<{
  (e: 'change', columns: string[]): void
}>()

// 发送变化事件
const emitChange = () => {
  emit('change', selectedColumns.value)
}
</script>

<style lang="scss" scoped>
.icon-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.column-selector {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
  
  .column-item {
    margin: 8px 0;
    display: flex;
    align-items: center;
    
    .el-icon {
      margin-left: 4px;
      color: #909399;
      cursor: help;
    }
  }
}
</style> 