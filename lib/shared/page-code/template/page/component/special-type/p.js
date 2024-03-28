/**
 * @desc 生成p段落组件源码
 * @param { CodeModel } code
 * @param { Object } item 当前组件配置
 * @param { Object } payload { vueDirective, propDirective, itemProps, itemClass, itemEvents, slotStr, css, alignStr }
 * @returns { String }
 */
import { transformTemplates } from '../../../../common/miniProgramConversion'
export default function generateP (code, item, { vueDirective, propDirective, itemProps, itemClass, itemEvents, slotStr, css, alignStr = ' ' }) {
    const divTag = transformTemplates(code.isMiniProgram, 'div')
    
    // premitter 格式化代码，但是格式化代码带来的问题是，会把 p 标签内部的 inntertext 也做换行，这就导致最终 p 标签效果和预期效果不一致
    let componentCode = ''
    if (css) {
        // eslint-disable 要在 prettier-ignore 前面
        componentCode = `
            <${divTag}${alignStr}style="${css}" ${vueDirective}>
                <!-- eslint-disable -->
                <!-- prettier-ignore -->
                <${item.type} ${itemProps} ${itemClass} ${itemEvents} ${propDirective}
                    >${slotStr}
                </${item.type}>
                <!-- eslint-enable -->
            </${divTag}>`
    } else {
        // eslint-disable 要在 prettier-ignore 前面
        componentCode += `
            <!-- eslint-disable -->
            <!-- prettier-ignore -->
            <${item.type}${alignStr}${itemClass} ${itemProps}${itemEvents} ${vueDirective} ${propDirective}
                >${slotStr}</${item.type}>
            <!-- eslint-enable -->`
    }
    return componentCode
}
