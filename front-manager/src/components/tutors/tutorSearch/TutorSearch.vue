<template>
  <div class="tutor-search">
    <!-- 桌面版搜索表单 -->
    <el-form :model="searchForm" inline class="desktop-form">
      <el-form-item label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态">
          <el-option label="全部" :value="''" />
          <el-option label="已成交" value="已成交" />
          <el-option label="未成交" value="未成交" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="icon-button" @click="handleSearch">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
        <el-button class="icon-button" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          <span>重置</span>
        </el-button>
        <ColumnSelector @change="$emit('column-change', $event)" />
      </el-form-item>
    </el-form>

    <!-- 移动版搜索按钮 -->
    <div class="mobile-search-btn" @click="showMobileSearch = true">
      <el-button type="primary" circle class="icon-button">
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>

    <!-- 移动版搜索抽屉 -->
    <el-drawer
      v-model="showMobileSearch"
      direction="btt"
      size="70%"
      title="搜索条件"
      class="mobile-search-drawer"
    >
      <el-form :model="searchForm" class="mobile-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" :value="''" />
            <el-option label="已成交" value="已成交" />
            <el-option label="未成交" value="未成交" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" block class="icon-button" @click="handleMobileSearch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button block class="icon-button" @click="handleMobileReset">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
          <ColumnSelector @change="$emit('column-change', $event)" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Setting, Refresh } from '@element-plus/icons-vue'
import type { tutorQueryParams } from '@/types/tutorOrder'
import ColumnSelector from '../ColumnSelector.vue'
import './style.scss'

const emit = defineEmits<{
  (e: 'search', params: Partial<tutorQueryParams>): void
  (e: 'column-change', columns: string[]): void
}>()

const searchForm = ref<Partial<tutorQueryParams>>({
  keyword: '',
  status: undefined
})

const showMobileSearch = ref(false)

const handleSearch = () => {
  const params = { ...searchForm.value }
  emit('search', params)
}

const handleReset = () => {
  searchForm.value = {
    keyword: '',
    status: undefined
  }
  emit('search', {})
}

const handleMobileSearch = () => {
  handleSearch()
  showMobileSearch.value = false
}

const handleMobileReset = () => {
  handleReset()
  showMobileSearch.value = false
}
</script> 