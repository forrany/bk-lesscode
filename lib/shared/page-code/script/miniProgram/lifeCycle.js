import { getMethodByCode } from '../../common/utils'
import { sharedI18n } from '../../../util'

/**
 * Vue 生命周期转换为小程序的生命周期
 */
const lifeCycleMapping = (life) => {
    switch (life) {
        case 'created':
        case 'beforeMount':
            return 'onLoad'
        case 'mounted':
            return 'onReady'
        case 'beforeDestroy':
        case 'destroyed':
            return 'onUnload'
        case 'beforeUpdate':
        case 'updated':
            return 'onShow'
        case 'activated':
        case 'deactivated':
            return null
    }
}

/**
 * @desc 返回生命周期内容，小程序的生命周期无法与 Vue 完全对应，对齐主要的几个生命周期进行映射，以实现基本功能为主要目标
 * @param { CodeModel } code
 * @returns { String }
 */
export default function (code) {
    const lifeCycle = code.lifeCycle.keys.reduce((prev, cur) => {
        const miniProgramKey = lifeCycleMapping(cur)
        if (miniProgramKey) {
            if (!prev[miniProgramKey]) prev[miniProgramKey] = []
            prev[miniProgramKey].push(cur)
        }
        return prev
    }, {})

    const lifeCycleKeys = Object.keys(lifeCycle) || []

    // 生成使用函数的对象
    const lifeCycleStrObj = {}

    const createLifeCycleFunc = (lifeCycle, code, method) => {
        if (!lifeCycleStrObj[lifeCycle]) lifeCycleStrObj[lifeCycle] = []
        if (!lifeCycleKeys.includes(lifeCycle)) lifeCycleKeys.push(lifeCycle)
        lifeCycleStrObj[lifeCycle][method](code)
    }

    lifeCycleKeys.forEach((key) => {
        lifeCycle[key].forEach(funcPayload => {
            const [method, params] = getMethodByCode(funcPayload, code.funcGroups)
            lifeCycleStrObj[key] = lifeCycleStrObj[key] || []
            if (method.id) {
                if (method.funcCode) code.addUsedFunc(method.funcCode)
                lifeCycleStrObj[key].push(`this.${method.funcName}(${code.getFuncParamStr(method, params, `${sharedI18n().t('页面的')}【${key}】${sharedI18n().t('生命周期')}`, true)})`)
            }
        })
    })
    // 如果使用了远程函数
    if (code.remoteDataStr) {
        createLifeCycleFunc('created', 'await this.initRemoteData()', 'unshift')
    }
    // 移动端导航相关逻辑 #miniProgram-to-do
    // if (code.hasLayout && code.platform !== 'MOBILE') {
    //     createLifeCycleFunc('created', 'this.setNav()', 'push')
    // }

    // 使用h5容器 #miniProgram-to-do
    // if (code.isUseSwiper && code.platform === 'MOBILE') {}

    // 内容不为空的生命周期，写入到页面源码中
    let lifeCycleStr = ''
    lifeCycleKeys.forEach((key) => {
        // 如果是created并且设置了远程函数，则添加async
        const keyStr = (key === 'onLoad' && code.remoteDataStr) ? 'onLoad: async' : `${key}:`

        const curFuncStrList = lifeCycleStrObj[key] || []
        if (curFuncStrList.length > 0) lifeCycleStr += `${keyStr} function() {${curFuncStrList.join('\r\n')}},`
    })
    return lifeCycleStr
}
