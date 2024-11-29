import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { MenuListType } from '@/types/menu'
import { ElLoading } from 'element-plus'
import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

// 定义后端返回的响应格式
interface ApiResponse extends BaseResult {
  code: number;
  data: MenuListType[];
  message: string;
}

// 定义返回类型接口
interface MenuResponse {
  menuList: MenuListType[];
  closeLoading: () => void;
}

// 菜单接口
export const menuService = {
  /**
   * 获取菜单列表（实际接口）
   */
  getMenuList() {
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0)',
      svg: fourDotsSpinnerSvg,
      svgViewBox: '0 0 40 40'
    })
    
    const url = '/api/manager/menu/list'
    
    try {
      return new Promise<MenuResponse>((resolve, reject) => {
        
        const requestConfig = {
          url,
          headers: {
            'Content-Type': 'application/json'
          }
        }
        
        request.get<ApiResponse>(requestConfig)
          .then(res => {
            if (res.code === 200) {
              resolve({
                menuList: res.data,
                closeLoading: () => loading.close()
              })
            } else {
              throw new Error(res.message || '获取菜单失败')
            }
          })
          .catch(error => {
            loading.close()
            reject(error)
          })
      })
    } catch (error) {
      loading.close()
      throw error
    }
  }
}