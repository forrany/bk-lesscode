import { sharedI18n } from '../../../util'
import { transformDirectives } from '../../common/miniProgramConversion'
/**
 * @desc 从renderDivectives属性中解析中设置在组件或布局中的指令
 * @param { CodeModel } code
 * @param { Object } renderDirectives 指令配置
 * @param { Object } componentId 组件id
 * @returns { String }
 */
export default function (code, renderDirectives, componentId) {
    // 过滤出有效的指令
    const exisDirectives = (renderDirectives || []).filter((directive) => (directive.code !== '' && directive.val !== ''))
    // 指令种类划分
    const vueDirectives = []
    const templateDirectives = []
    const propDirectives = []
    const id = componentId.replace(/\-(.)/g, x => (x.slice(1)).toUpperCase())

    exisDirectives.forEach((directive) => {
        const { type, format, code: val, dataSourceType, thirdPartDBName } = directive
        const dataSourceId = (componentId + type).replace(/-(.)/g, (_, c) => c.toUpperCase())
        const displayVal = code.handleUsedVariable(
            format,
            val,
            `${sharedI18n().t('组件')}【${componentId}】${sharedI18n().t('指令')}【${type}】`,
            dataSourceId,
            dataSourceType,
            thirdPartDBName
        )
        const projectType = code.isMiniProgram ? 'miniProgram' : 'web'

        console.log(projectType, 'fuck code')

        // 兼容旧数据，v-model为undefined的情形(v-model不能为undefined)
        if (type === 'v-model' && val === undefined) return

        // 根据类型转换指令的表达式
        const transformedDirective = transformDirectives(directive, projectType, id, displayVal)

        // 根据类型分类
        if (type === 'v-if') {
            const existsVFor = exisDirectives.some((dir) => dir.type === 'v-for');
            (existsVFor ? templateDirectives : vueDirectives).push(transformedDirective)
            return
        } else if (['v-for', 'v-bkloading', 'v-bk-tooltips'].includes(type)) {
            vueDirectives.push(transformedDirective)
            return
        }

        // 保存属性指令
        propDirectives.push(transformedDirective)
    })
    return { vueDirectives, propDirectives, templateDirectives }
}
