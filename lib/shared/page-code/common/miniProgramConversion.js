
const transformTemplates = (isMiniProgram, tag) => {
    if (!isMiniProgram) return tag
    switch (tag) {
        case 'div':
        case 'span':
        case 'p':
        case 'section':
            return 'view'
        case 'img':
            return 'image'
        case 'template':
            return 'block'
    }
}

const transformDirectives = (directive, platform, id, disPlayVal) => {
    const { type, modifiers = [], prop = '' } = directive
    const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
    
    switch (type) {
        case 'v-if':
            return platform === 'miniProgram' ? `wx:if="{{${disPlayVal}}}"` : `v-if="${disPlayVal}"`
        case 'v-for':
            if (platform === 'miniProgram') {
                return `wx:for={{${disPlayVal}}} wx:for-item="{{${id}Item" wx:for-index="${id}Index}}" wx:key="{{${id}Index}}"`
            }
            return `v-for="(${id}Item, ${id}Index) in ${disPlayVal}" :key="${id}Index"`
        case 'v-show':
            return platform === 'miniProgram' ? `hidden="{{!${disPlayVal}}}"` : `v-show="${disPlayVal}"`
        case 'v-bind':
            return platform === 'miniProgram' ? `${prop}="{{${disPlayVal}}}"` : `:${prop}${modifierStr}="${disPlayVal}"`
        case 'v-model':
            return platform === 'miniProgram' ? `model:${prop || 'value'}="{{${disPlayVal}}}"` : `${type}="${disPlayVal}"`
        case 'v-html':
            return platform === 'miniProgram' ? '' : `${type}="${disPlayVal}"` // 小程序中不存在`v-html`指令，这里直接返回`v-html``
        case 'v-bkloading':
            return platform === 'miniProgram' ? '' : `${type}="{ isLoading: ${disPlayVal} }"` // 小程序中不存在`v-bkloading`指令，这里直接返回`v-html``
        case 'v-bk-tooltips':
            return platform === 'miniProgram' ? '' : `${type}="{ content: ${disPlayVal} }"` // 小程序中不存在`v-bk-tooltips`指令，这里直接返回`v-html``
        default:
            return platform === 'miniProgram' ? `${type}${prop ? `:${prop}` : ''}${modifierStr}="{{${disPlayVal}}}"` : `${type}${prop ? `:${prop}` : ''}${modifierStr}="${disPlayVal}"`
    }
}

export {
    transformDirectives,
    transformTemplates
}
