<template>
  <div class="tutor-table">
    <el-table v-loading="loading" :data="data" :border="config.border" :stripe="config.stripe" style="width: 100%">
      <!-- 只渲染 visible 为 true 的列 -->
      <template v-for="col in visibleColumns" :key="col.prop">
        <el-table-column :prop="col.prop" :label="col.label" :width="col.width" :fixed="col.fixed">
          <template #default="scope">
            <template v-if="col.slot === 'status'">
              <el-tag :type="scope.row.status === '已成交' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
            <template v-else-if="col.slot === 'operation'">
              <el-button link type="primary" @click="handleEdit(scope.row)" class="icon-button">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)" class="icon-button">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
              <el-button link :type="scope.row.is_visible ? 'info' : 'warning'" @click="handleVisibility(scope.row)"
                class="icon-button">
                <el-icon>
                  <View v-if="scope.row.is_visible" />
                  <Hide v-else />
                </el-icon>
              </el-button>
              <el-button 
                link 
                :type="scope.row.status === '已成交' ? 'success' : 'info'" 
                @click="handleStatus(scope.row)"
                class="icon-button"
              >
                <el-icon>
                  <Select v-if="scope.row.status === '已成交'" />
                  <CircleCheck v-else />
                </el-icon>
              </el-button>
            </template>
            <template v-else-if="col.formatter">
              {{ col.formatter(scope.row) }}
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination" v-if="config.showPagination">
      <el-pagination v-model:current-page="currentPage" :total="total" :page-size="config.pageSize"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TutorType } from '@/types/tutorOrder'
import { DEFAULT_TABLE_CONFIG, type TableConfig } from '@/types/tutorMenuList'
import { Delete, Edit, View, Hide, Select, CircleCheck } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps<{
  loading: boolean
  data: TutorType[]
  total: number
  config?: TableConfig
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'edit', row: TutorType): void
  (e: 'delete', row: TutorType): void
  (e: 'visibility-change', row: TutorType): void
  (e: 'status-change', row: TutorType): void
}>()

const currentPage = ref(1)
const config = computed(() => props.config || DEFAULT_TABLE_CONFIG)

// 计算可见的列
const visibleColumns = computed(() => {
  return config.value.columns.filter(col => col.visible)
})

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

const handleVisibility = (row: TutorType) => {
  emit('visibility-change', row)
}

const handleStatus = (row: TutorType) => {
  emit('status-change', row)
}
</script>

<style lang="scss" scoped>
.tutor-table {
  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .icon-button {
    margin: 0 2px; // 给按钮之间添加间距
  }
}
</style>