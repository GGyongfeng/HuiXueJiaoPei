<template>
    <div class="tutor-list">
        <TutorSearch @search="handleSearch" />
        <TutorTable :loading="loading" :data="tutorList" :total="total" @page-change="handlePageChange" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTutorStore } from '@/store/modules/tutor'
import TutorSearch from '@/components/tutors/tutorSearch/TutorSearch.vue'
import TutorTable from '@/components/tutors/tutorTable/TutorTable.vue'
import type { tutorQueryParams, TutorType, TutorResponse } from '@/api/model/tutorModel'
import { TutorsService } from '@/api/tutors'

// 使用 store
const tutorStore = useTutorStore()

// 响应式数据
const loading = ref(false)
const tutorList = ref<TutorType[]>([])
const total = ref(0)
const queryParams = ref<tutorQueryParams>({
    page: 1,
    pageSize: 20
})

// 获取订单列表函数
const fetchTutorList = async () => {
    try {
        const res = await TutorsService.getTutorList(queryParams.value)

        if (res.code === 200) {
            loading.value = true
            // 检查数据赋值
            console.log('总数:', res.data.total)

            tutorList.value = res.data.list
            total.value = res.data.total

            // store 赋值
            tutorStore.setTutorList(res.data.list)
            tutorStore.setTotal(res.data.total)
        }
    } catch (error) {
        console.error('获取订单列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 处理搜索
const handleSearch = (params: Partial<tutorQueryParams>) => {
    queryParams.value = {
        ...queryParams.value,
        ...params,
        page: 1
    }
    fetchTutorList()
}

// 处理分页
const handlePageChange = (page: number) => {
    queryParams.value.page = page
    fetchTutorList()
}

// 在组件挂载时执行
onMounted(() => {
    fetchTutorList()  // 页面加载时获取数据
})
</script>

<style lang="scss" scoped>
.tutor-list {
    padding: 20px;
}
</style>