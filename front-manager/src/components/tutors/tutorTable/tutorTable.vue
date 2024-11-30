<template>
  <div class="tutor-table">
    <el-table
      v-loading="loading"
      :data="data"
      :border="config.border"
      :stripe="config.stripe"
      style="width: 100%"
    >
      <template v-for="col in config.columns" :key="col.prop">
        <el-table-column
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :fixed="col.fixed"
        >
          <!-- 使用自定义插槽 -->
          <template #default="scope" v-if="col.slot">
            <slot :name="col.slot" :row="scope.row">
              <!-- 默认插槽内容 -->
              <template v-if="col.slot === 'status'">
                <el-tag :type="scope.row.status === '已成交' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
              <template v-else-if="col.slot === 'operation'">
                <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </slot>
          </template>
          <!-- 使用格式化函数 -->
          <template #default="scope" v-else-if="col.formatter">
            {{ col.formatter?.(scope.row) }}
          </template>
          <!-- 默认显示 -->
          <template #default="scope" v-else>
            {{ scope.row[col.prop] }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    
    <!-- 分页器 -->
    <div class="pagination" v-if="config.showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="config.pageSize"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TutorType } from '@/api/model/tutorModel'
import { DEFAULT_TABLE_CONFIG } from '@/types/tutorList'
import type { TableConfig } from '@/types/tutorList'

// Props 定义
defineProps<{
  loading: boolean
  data: TutorType[]
  total: number
  config?: TableConfig
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'edit', row: TutorType): void
  (e: 'delete', row: TutorType): void
}>()

const currentPage = ref(1)
const config = ref<TableConfig>(DEFAULT_TABLE_CONFIG)

// 事件处理
const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleEdit = (row: TutorType) => {
  emit('edit', row)
}

const handleDelete = (row: TutorType) => {
  emit('delete', row)
}
</script>

<style lang="scss" scoped>
.tutor-table {
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>