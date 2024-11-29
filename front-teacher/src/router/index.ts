import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useWorktabStore } from '@/store/modules/worktab'
import Home from '@views/index/index.vue'
import { SystemInfo } from '@/config/setting'
import { useUserStore } from '@/store/modules/user'
import { menuService } from '@/api/menuApi'
import { routerMatch } from '@/utils/menu'
import { useMenuStore } from '@/store/modules/menu'
import { useSettingStore } from '@/store/modules/setting'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 顶部进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 600, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  parent: 'body' //指定进度条的父容器
})

// 扩展路由记录类型，添加 hidden 属性
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean         // 是否在菜单中隐藏
}

// 定义系统首页路径
export const HOME_PAGE = '/dashboard/console'

// 定义基础路由（不需要权限的路由）
const routes = [
  {
    path: '/',
    redirect: HOME_PAGE    // 重定向到首页
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '监控中心',
      title_en: 'Dashboard'
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: () => import(`@views/dashboard/console/index.vue`),
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: false
        }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import(`@views/dashboard/analysis/index.vue`),
        meta: {
          title: '分析页',
          title_en: 'Workbench',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    meta: {
      title: '登录',
      notTab: true
    }
  },
  {
    path: '/register',
    component: () => import('@views/register/index.vue'),
    meta: {
      title: '注册',
      notTab: true,
      noLogin: true
    }
  },
  {
    path: '/forget-password',
    component: () => import('@views/forget-password/index.vue'),
    meta: {
      title: '忘记密码',
      notTab: true,
      noLogin: true
    }
  },
  {
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面',
      title_en: 'Exception',
      keepAlive: true
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '403',
          title_en: '403',
          keepAlive: true
        }
      },
      {
        path: '404',
        component: () => import('@views/exception/404.vue'),
        meta: {
          title: '404',
          title_en: '404',
          keepAlive: true
        }
      },
      {
        path: '500',
        component: () => import('@views/exception/500.vue'),
        meta: {
          title: '500',
          title_en: '500',
          keepAlive: true
        }
      }
    ]
  }
] as AppRouteRecordRaw[]

// 创建路由实例
export const router = createRouter({
  history: createWebHashHistory(),  // 使用 hash 模式
  routes: routes,                   // 注册基础路由
  scrollBehavior: () => ({ left: 0, top: 0 }) // 页面切换时滚动到顶部
})

// 定义需要权限的路由
export const roleRoutes: AppRouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    component: Home,
    meta: {
      title: '成员中心'
    },
    children: [
      {
        path: '/user/user',
        name: 'Users',
        component: () => import('@views/user/User.vue'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: '/user/account',
        name: 'Account',
        component: () => import('@views/user/Account.vue'),
        meta: {
          title: '账号管理',
          keepAlive: true
        }
      },
      {
        path: '/user/department',
        name: 'Department',
        component: () => import('@views/user/Department.vue'),
        meta: {
          title: '部门管理',
          keepAlive: true
        }
      },
      {
        path: '/user/role',
        name: 'Role',
        component: () => import('@views/user/Role.vue'),
        meta: {
          title: '角色权限',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Home,
    meta: {
      title: '菜单管理',
      title_en: 'Menu Management'
    },
    children: [
      {
        path: '/menu/menu',
        name: 'Menus',
        component: () => import('@views/menu/Menu.vue'),
        meta: {
          title: '菜单管理',
          title_en: 'Menu Management',
          keepAlive: true
        }
      },
      {
        path: '/menu/permission',
        name: 'Permission',
        component: () => import('@views/menu/Permission.vue'),
        meta: {
          title: '权限控制',
          title_en: 'Permission Control',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/result',
    name: 'Result',
    component: Home,
    meta: {
      title: '结果页面'
    },
    children: [
      {
        path: '/result/success',
        name: 'Success',
        component: () => import('@views/result/Success.vue'),
        meta: {
          title: '成功页'
        }
      },
      {
        path: '/result/fail',
        name: 'Fail',
        component: () => import('@views/result/Fail.vue'),
        meta: {
          title: '失败页'
        }
      }
    ]
  },
  {
    path: '/article',
    component: Home,
    name: 'Article',
    meta: {
      title: '文章管理'
    },
    children: [
      {
        path: '/article/article-publish',
        component: () => import('@views/article/ArticlePublish.vue'),
        meta: {
          title: '文章发布',
          keepAlive: false
        }
      },
      {
        path: '/article/article-list',
        component: () => import('@views/article/ArticleList.vue'),
        meta: {
          title: '文章列表',
          keepAlive: true
        }
      },
      {
        path: '/article/detail',
        component: () => import('@views/article/ArticleDetail.vue'),
        meta: {
          title: '文章详情',
          keepAlive: false,
          notTab: true
        }
      },
      {
        path: '/article/classify',
        component: () => import('@views/article/Classify.vue'),
        meta: {
          title: '文章分类',
          keepAlive: true
        }
      },
      {
        path: '/article/comment',
        component: () => import('@views/article/Comment.vue'),
        meta: {
          title: '留言',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/widgets',
    component: Home,
    name: 'Widgets',
    meta: {
      title: '组件库'
    },
    children: [
      {
        path: '/widgets/icon-list',
        component: () => import('@views/widgets/IconList.vue'),
        meta: {
          title: '图标库',
          keepAlive: true
        }
      },
      {
        path: '/widgets/icon-selector',
        component: () => import('@views/widgets/IconSelector.vue'),
        meta: {
          title: '图标选择器',
          keepAlive: true
        }
      },
      {
        path: '/widgets/notification',
        component: () => import('@views/widgets/Notification.vue'),
        meta: {
          title: '通知',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/message',
    component: Home,
    name: 'Message',
    meta: {
      title: '消息中心'
    },
    children: [
      {
        path: '/message/message',
        component: () => import('@views/message/Index.vue'),
        meta: {
          title: '系统消息',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Home,
    name: 'System',
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: '/system/setting',
        component: () => import('@views/system/Setting.vue'),
        meta: {
          title: '系统设置',
          keepAlive: true
        }
      },
      {
        path: '/system/api',
        name: 'Api',
        component: () => import('@views/system/Api.vue'),
        meta: {
          title: 'API管理'
        }
      },
      {
        path: '/system/log',
        component: () => import('@views/system/Log.vue'),
        meta: {
          title: '系统日志',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/safeguard',
    component: Home,
    name: 'Safeguard',
    meta: {
      title: '运维管理'
    },
    children: [
      {
        path: '/safeguard/server',
        component: () => import('@views/safeguard/Server.vue'),
        meta: {
          title: '服务器管理',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/plan',
    component: Home,
    name: 'Plan',
    meta: {
      title: '版本计划'
    },
    children: [
      {
        path: '/plan/index',
        component: () => import('@views/plan/index.vue'),
        meta: {
          title: '更新计划',
          keepAlive: true
        }
      }
    ]
  }
]

// 合并所有路由
export const allRoutes = roleRoutes

// 路由是否已注册的标志
const isRouteRegistered = ref(false)

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 1. 开始进度条
  if (useSettingStore().showNprogress) {
    NProgress.start()
  }

  const userStore = useUserStore()
  const worktabStore = useWorktabStore()
  const { meta, path, params, query } = to
  const { title, title_en: titleEn, notTab, noLogin } = meta

  // 2. 检查登录状态
  if (!userStore.isLogin && path !== '/login' && !noLogin) {
    userStore.logOut()
    next('/login')  // 重定向到登录页
    return
  }

  // 3. 注册动态路由
  if (!isRouteRegistered.value && userStore.isLogin) {  
    try {
      await registerRoutes()
      next({ ...to, replace: true })  // 重新导航到目标路由
      return
    } catch (error) {
      console.error('路由注册失败:', error) 
      next('/exception/500')  // 出错时导航到500页面
    }
    return
  }

  // 4. 登录页直接通过
  if (to.path === '/login') {
    isRouteRegistered.value = false  // 重置路由注册状态
    next()
    return
  }

  // 5. 404处理
  if (to.matched.length === 0) {
    next('/exception/404')  // 导航到404页面
    return
  }

  // 6. 更新工作台标签页
  if (!notTab) {
    worktabStore.router({
      title: title as string,
      title_en: titleEn as string,
      path,
      params,
      query
    })
  }

  // 7. 设置页面标题
  if (title) {
    document.title = `${title} - ${SystemInfo.name}`
  }

  next()  // 最后允许导航到目标路由
})

// 全局后置守卫
router.afterEach(() => {
  // 结束进度条
  if (useSettingStore().showNprogress) {
    NProgress.done()
  }
})

// 注册动态路由的函数
async function registerRoutes(): Promise<void> {
  try {
    const { menuList, closeLoading } = await menuService.getMenuList()
    
    if (!Array.isArray(menuList) || menuList.length === 0) {
      isRouteRegistered.value = true
      throw new Error('获取菜单列表为空')
    }

    // 存储菜单数据到 store
    useMenuStore().setMenuList(menuList as [])
    
    // 根据菜单数据动态注册路由
    routerMatch(menuList, roleRoutes)
    
    // 标记路由已注册
    isRouteRegistered.value = true
    
    // 关闭加载动画
    closeLoading()
  } catch (error) {
    isRouteRegistered.value = true
    console.error('注册路由失败:', error)
    throw error
  }
}

// 初始化路由的函数
export function initRouter(app: App<Element>) {
  app.use(router)
}