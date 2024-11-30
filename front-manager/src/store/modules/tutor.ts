import { defineStore } from 'pinia'
import type { TutorType } from '@/types/tutorOrder'

export const useTutorStore = defineStore('tutor', {
  state: () => ({
    currentTutor: null as TutorType | null,  // 当前选中的订单
    tutorList: [] as TutorType[],  // 订单列表
    total: 0,   // 总数
    loading: false  // 加载状态
  }),
  
  actions: {
    setCurrentTutor(tutor: TutorType | null) {
      this.currentTutor = tutor
    },
    
    setTutorList(list: TutorType[]) {
      this.tutorList = list
    },
    
    setTotal(total: number) {
      this.total = total
    },
    
    setLoading(loading: boolean) {
      this.loading = loading
    }
  }
}) 