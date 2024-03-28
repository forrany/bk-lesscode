/**
 * 生成预处理代码，包括页面需要用到的函数、方法等，放在 Page{} 前
 * @param {*} code
 * @returns
 */
export function getPreProceeStr (code) {
    let preCodeStr = ''
    if (code.pageDataVariables.length) {
        preCodeStr += `const pageDataVariables = ${JSON.stringify(code.pageDataVariables)}`
    }
    return preCodeStr
}
