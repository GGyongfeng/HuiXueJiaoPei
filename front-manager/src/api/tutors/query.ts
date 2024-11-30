import request from '@/utils/http'
import { ElLoading } from 'element-plus'
import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { tutorQueryParams, TutorResponse, TutorType } from '@/types/tutorOrder'
import { BaseResult } from '@/types/axios'

/**
 * 家教订单查询模块
 * 包含所有查询相关的API方法
 */
export const queryApis = {
  /**
   * 获取家教订单列表
   * @param params 查询参数，包含分页、筛选条件等
   * @returns 返回订单列表数据和总数
   */
  getTutorList: async (params: tutorQueryParams) => {
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0)',
      svg: fourDotsSpinnerSvg,
      svgViewBox: '0 0 40 40'
    })

    try {
      const result = await request.get<TutorResponse>({
        url: '/api/manager/tutors/list',
        params
      })
      console.log('请求结果：', result)
      loading.close()
      return result
    } catch (error) {
      console.error('请求错误：', error)
      loading.close()
      throw error
    }
  },

  /**
   * 获取订单详情
   * @param id 订单ID
   * @returns 返回单个订单的详细信息
   */
  getTutorDetail: (id: number) => {
    return request.get<BaseResult & { data: TutorType }>({
      url: `/api/manager/tutors/detail/${id}`
    })
  }
} 