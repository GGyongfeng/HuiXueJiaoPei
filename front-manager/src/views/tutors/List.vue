<template>
    <div class="tutor-list">
        <div class="table-header">
            <TutorSearch @search="handleSearch" @column-change="handleColumnsChange" />
        </div>
        <TutorTable :loading="loading" :data="tutorList" :total="total" :config="tableConfig" @page-change="handlePageChange" @edit="handleEdit" @delete="handleDelete" @visibility-change="handleVisibilityChange" @status-change="handleStatusChange" />
        <CreateDialog v-model:visible="createVisible" @success="handleSuccess" />
        <EditDialog 
          v-model:visible="editVisible" 
          :data="currentTutor" 
          @success="handleSuccess" 
        />
        <DeleteDialog 
          v-model:visible="deleteVisible" 
          :id="currentId" 
          @success="handleSuccess" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTutorStore } from '@/store/modules/tutor'
import TutorSearch from '@/components/tutors/tutorSearch/tutorSearch.vue'
import TutorTable from '@/components/tutors/tutorTable.vue'
import type { tutorQueryParams, TutorType, TutorResponse } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'
import { CreateDialog, EditDialog, DeleteDialog } from '@/components/tutors/dialogs'
import { DEFAULT_TABLE_CONFIG } from '@/types/tutorMenuList'
import { ElMessageBox, ElMessage } from 'element-plus'
import { mutationApis } from '@/api/tutors/mutation'

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

// 弹窗控制
const createVisible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentTutor = ref<TutorType | undefined>(undefined)
const currentId = ref<number>()

const tableConfig = ref({ ...DEFAULT_TABLE_CONFIG })

// 获取订单列表函数
const fetchTutorList = async () => {
    try {
        const res = await TutorsService.getTutorList(queryParams.value)

        if (res.code === 200) {
            loading.value = true
            // 检查数据赋值
            console.log('总数:', res.data.total)

            // 确保每条数据都有状态值
            tutorList.value = res.data.list.map(item => ({
                ...item,
                status: item.status || '未成交'  // 设置默认状态
            }))
            total.value = res.data.total

            // store 赋值
            tutorStore.setTutorList(tutorList.value)
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

// 成功回调
const handleSuccess = () => {
  fetchTutorList()
}

// 打开编辑弹窗
const handleEdit = (row: TutorType) => {
  currentTutor.value = row
  editVisible.value = true
}

// 打开删除弹窗
const handleDelete = (row: TutorType) => {
  currentId.value = row.id
  deleteVisible.value = true
}

// 处理列变化
const handleColumnsChange = (selectedColumns: string[]) => {
  // 更新列配置
  tableConfig.value.columns = DEFAULT_TABLE_CONFIG.columns
    .filter(col => selectedColumns.includes(col.prop))
}

const handleVisibilityChange = async (row: TutorType) => {
  try {
    await TutorsService.updateTutor({
      ...row,
      is_visible: !row.is_visible
    })
    fetchTutorList()
  } catch (error) {
    console.error('更新可见性失败:', error)
  }
}

const handleStatusChange = async (row: TutorType) => {
  try {
    // 检查当前状态
    console.log('当前状态:', row.status)
    
    const newStatus = row.status === '已成交' ? '未成交' : '已成交'
    console.log('新状态:', newStatus)
    
    // 如果是标记为已成交，才弹窗输入教师ID
    if (newStatus === '已成交') {
      ElMessageBox.prompt('请输入成交教师ID', '标记成交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入有效的教师ID'
      }).then(async ({ value: teacherId }) => {
        await mutationApis.updateOrderDealStatus(row.id!, {
          teacherId: parseInt(teacherId),
          status: newStatus
        })
        ElMessage.success('更新成功')
        fetchTutorList()
      }).catch(() => {
        // 用户取消操作
      })
    } else {
      // 如果是取消成交，直接更新状态
      const confirmResult = await ElMessageBox.confirm(
        '确定要取消该订单的成交状态吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => false)

      if (confirmResult) {
        // 确保发送完整的请求体
        await mutationApis.updateOrderDealStatus(row.id!, {
          status: '未成交',
          teacherId: null,  // 显式设置为 null
        })

        ElMessage.success('更新成功')
        fetchTutorList()
      }
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
  }
}
</script>

<style lang="scss" scoped>
.tutor-list {
    padding: 20px;
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
}
</style>