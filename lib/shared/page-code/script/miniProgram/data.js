/**
 * @desc 返回data内容
 * @param { CodeModel } code
 * @returns { String }
 */
export default function (code) {
    let dataStr = ''
    // 将dataObj中的变量拼接成data字符串
    if (Object.keys(code.dataObj).length || code.pageDataVariables.length) {
        let dataCon = ''
        for (const key in code.dataObj) {
            dataCon += `'${key}': ${code.dataObj[key]},\n`
        }
        dataStr = `data: {
            ${dataCon}
        }`
    }
    return dataStr
}
