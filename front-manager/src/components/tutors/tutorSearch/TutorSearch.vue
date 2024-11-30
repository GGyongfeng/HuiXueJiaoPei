<template>
  <div class="tutor-search">
    <el-form :model="searchForm" inline>
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
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { tutorQueryParams } from '@/api/model/tutorModel'

const emit = defineEmits<{
  (e: 'search', params: Partial<tutorQueryParams>): void
}>()

const searchForm = ref<Partial<tutorQueryParams>>({
  keyword: '',
  status: undefined
})

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
</script> 