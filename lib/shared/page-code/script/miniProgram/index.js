import getLifeCycles from './lifeCycle'
import handleUsedVarAndFunc from '../vue2/handle-var-and-func'
import getDataStr from './data'
import getPreProcessStr from './pre-process'

export function getMiniProgramScript (code) {
    const preProcessStr = getPreProcessStr(code)
    const lifeCycle = getLifeCycles(code)

    handleUsedVarAndFunc(code)

    const dataStr = getDataStr(code)

    return `${preProcessStr}
    Page({
        ${dataStr}
        ${lifeCycle}
    })`
}
