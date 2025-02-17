<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div v-if="hasMaterialConfig" :class="{ mt10: keyword.length }">
        <template v-for="(group, indexKey) in propGropuList">
            <div v-if="hasGroupProp(group)" :key="indexKey">
                <div :class="{ 'group-name': true, 'group-name-bt': group.isShow }" @click="toggleShowGroupProp(group, indexKey)">
                    <span>{{ group.label || group.value }}</span>
                    <i
                        :class="{
                            'bk-icon icon-angle-down': true,
                            close: !group.isShow
                        }"
                    ></i>
                </div>
                <div class="group-bt">
                    <div v-if="group.isShow" class="mt10">
                        <template v-for="(item, key) in group.groupProps">
                            <render-prop
                                v-if="item.type !== 'hidden'"
                                :component-type="componentType"
                                :component-id="componentId"
                                :describe="item"
                                :last-value="lastPropVal(key)"
                                :name="key"
                                :key="key"
                                :sync-slot="syncSlot"
                                :last-data-origin="lastProps[item.dataOrigin]"
                                @on-change="handleChange" />
                        </template>
                    </div>
                </div>
            </div>
            <template v-else>
                <template v-if="keyword.length">
                    <render-prop
                        v-if="group.type !== 'hidden'"
                        :component-type="componentType"
                        :component-id="componentId"
                        :describe="group"
                        :last-value="lastPropVal(indexKey)"
                        :name="indexKey"
                        :key="indexKey"
                        :sync-slot="syncSlot"
                        :last-data-origin="lastProps[group.dataOrigin]"
                        @on-change="handleChange" />
                </template>
            </template>
        </template>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'
    import RenderProp from './components/render-prop'
    import useDatasource from '@/hooks/use-datasource'
    import { encodeRegexp } from '../../component/utils'
    import { framework } from 'bk-lesscode-render'
    import { isEmpty } from '@/common/util'
    import { camelCase, paramCase } from 'change-case'

    // 属性类型转为该变量接受的值类型
    const getPropValueType = (type) => {
        const valueMap = {
            'size': 'string',
            'text': 'string',
            'paragraph': 'string',
            'html': 'string',
            'json': 'object',
            'icon': 'string',
            'van-icon': 'string',
            'float': 'number',
            'src': 'string',
            'srcset': 'array',
            // 老数据存在 type = 'hidden' 但是值是 object 的情况
            'hidden': 'object',
            'pagination': 'object'
        }
        return valueMap[type] || type
    }

    export default {
        name: 'modifier-prop',
        components: {
            RenderProp
        },
        props: {
            keyword: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                propsConfig: {},
                lastProps: {}
            }
        },
        computed: {
            hasMaterialConfig () {
                let count = 0
                Object.keys(this.filterPropsConfig).forEach(propName => {
                    if (this.filterPropsConfig[propName]?.type !== 'hidden') {
                        count++
                    }
                })
                return count > 0
            },
            filterPropsConfig () {
                const reg = new RegExp(encodeRegexp(this.keyword), 'i')
                return Object.keys(this.propsConfig).filter(propName => {
                    return reg.test(propName + this.propsConfig[propName].displayName ?? '' + (typeof this.propsConfig[propName].type === 'string' ? `(${getPropValueType(this.propsConfig[propName].type)})` : ''))
                }).reduce((result, key) => {
                    result[key] = this.propsConfig[key]
                    return result
                }, {})
            },
            propGropuList () {
                if (this.keyword.length) {
                    return this.filterPropsConfig
                } else {
                    const groups = this.material.groups || []
                    Object.keys(this.filterPropsConfig).reduce((pre, cur) => {
                        if (this.filterPropsConfig[cur].type === 'hidden') {
                            pre.push(this.filterPropsConfig[cur])
                        } else {
                            const groupVal = this.filterPropsConfig[cur]?.belongGroup || 'common'
                            const groupItem = pre.find(item => item.value === groupVal)
                            if (!pre?.length || !groupItem) {
                                const aGroup = {
                                    value: groupVal,
                                    label: groupVal === 'common' ? '通用属性' : '',
                                    isShow: true,
                                    groupProps: {}
                                }
                                aGroup.groupProps[cur] = this.filterPropsConfig[cur]
                                pre.push(aGroup)
                            }
                            if (groupItem) {
                                groupItem.isShow ??= true
                                groupItem.groupProps ??= {}
                                groupItem.groupProps[cur] = this.filterPropsConfig[cur]
                            }
                        }
                        return pre
                    }, groups)
                    return groups
                }
            },
            hasGroupProp () {
                return (group) => {
                    if (isEmpty(group.groupProps)) {
                        return false
                    }
                    if (!Object.keys(group.groupProps).length) {
                        return false
                    }
                    return true
                }
            },
            lastPropVal () {
                return (key) => {
                    if (!this.lastProps[key]) {
                        // 同一个属性在原有组件和现物料组件的命名方式不一样，需要属性转成短线/驼峰 从而获取原来属性的值
                        return this.lastProps[camelCase(key)] || this.lastProps[paramCase(key)]
                    }
                    return this.lastProps[key]
                }
            }
        },
        created () {
            this.material = {}
            bus.$on('update-chart-options', this.updateChartOptions)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('update-chart-options', this.updateChartOptions)
            })
            this.componentNode = LC.getActiveNode()
            if (this.componentNode) {
                const {
                    type,
                    componentId,
                    material,
                    renderProps
                } = this.componentNode
                this.componentType = type
                this.componentId = componentId
                this.propsConfig = Object.freeze(material.props)
                this.lastProps = Object.freeze(_.cloneDeep(renderProps))
                this.material = material
            }
            const updateCallback = _.debounce((event) => {
                if (event.target.componentId !== this.componentNode.componentId) {
                    return
                }
                this.lastProps = Object.freeze(_.cloneDeep(this.componentNode.renderProps))
            }, 100)

            LC.addEventListener('update', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        },
        methods: {
            // 针对chart类型，将动态返回的remoteOptions与options合并
            updateChartOptions (res) {
                try {
                    if (this.componentNode.renderProps['options']
                        && this.componentNode.renderProps['options'].renderValue
                        && typeof this.componentNode.renderProps['options'].renderValue === 'object') {
                        const options = Object.assign({}, this.componentNode.renderProps['options'].renderValue, res)
                        this.componentNode.renderProps['options'] = {
                            ...this.componentNode.renderProps['options'],
                            val: options
                        }
                        this.componentNode.renderProps['options'].renderValue = options

                        this.$bkMessage({
                            theme: 'success',
                            message: `图表配置已更新，${Object.keys(res).join('、')}选项已被远程数据覆盖`
                        })

                        // this.batchUpdate({
                        //     renderProps: this.componentNode.renderProps
                        // })
                    }
                } catch (error) {
                    this.$bkMessage({
                        theme: 'error',
                        message: error
                    })
                }
            },
            syncOtherProp (propName, propData) {
                // 兼容组件报错
                if (this.componentNode.type === 'bk-date-picker' && propName === 'type') {
                    const propKey = framework === 'vue2' ? 'value' : 'model-value'
                    const valuePropData = this.lastProps[propKey]
                    const value = ['datetimerange', 'daterange'].includes(propData.renderValue) ? [] : ''
                    this.componentNode.setProp(propKey, LC.utils.genPropFormatValue({
                        ...valuePropData,
                        format: 'value',
                        code: value,
                        renderValue: value
                    }))
                }
                // 兼容组件报错
                if (this.componentNode.type === 'bk-time-picker' && propName === 'type') {
                    const propKey = framework === 'vue2' ? 'value' : 'model-value'
                    const valuePropData = this.lastProps[propKey]
                    const value = ['timerange'].includes(propData.renderValue) ? [] : ''
                    this.componentNode.setProp(propKey, LC.utils.genPropFormatValue({
                        ...valuePropData,
                        format: 'value',
                        code: value,
                        renderValue: value
                    }))
                }
            },
            /**
             * 通过 table 的 data 推导出 table 列的配置
             */
            async syncSlot (key) {
                const {
                    format,
                    payload,
                    renderValue = [],
                    valueType
                } = this.componentNode.renderProps[key]

                // 需要同步 prop 配置到 slot 的场景
                // 同时满足下面的条件
                // - prop format 配置为值类型
                if (format !== 'value') {
                    return
                }
                // 同步 table 的 columns
                if (key === 'data'
                    && [
                        'bk-table',
                        'el-table',
                        'folding-table',
                        'search-table',
                        'widget-bk-table',
                        'widget-el-table'
                    ].includes(this.componentType)) {
                    // 默认同步 第一个 slot
                    const slotName = Object.keys(this.material.slots)[0]
                    const slotConfig = this.material.slots[slotName]
                    // 通过值类型计算的 columns
                    const firstValue = renderValue[0] || {}
                    let columns = Object.keys(firstValue)
                    // 通过接口获取 columns
                    if (valueType === 'table-data-source') {
                        const { getTable } = useDatasource()
                        const table = await getTable(
                            this.$route.params.projectId,
                            payload.sourceData?.tableName,
                            payload.sourceData?.dataSourceType,
                            payload.sourceData?.thirdPartDBName
                        )
                        columns = table?.columns?.map(column => column.name) || []
                    }
                    // 获取自定义column配置，这个配置比较复杂不覆盖
                    const renderSlot = this.componentNode.renderSlots[slotName]
                    const slotRenderValue = renderSlot.renderValue || []
                    const customColumns = slotRenderValue.filter(column => column.type === 'customCol')
                    // 返回 columns 的时候根据返回值渲染，否则渲染配置的值
                    const newColumns = columns.length > 0
                        ? columns.map(columnName => ({
                            label: columnName,
                            prop: columnName,
                            sortable: false,
                            type: ''
                        }))
                        : slotConfig.val
                    const slotValue = [
                        ...newColumns,
                        ...customColumns
                    ]
                    this.componentNode.setRenderSlots({
                        format: 'value',
                        component: Array.isArray(slotConfig.name) ? slotConfig.name[0] : slotConfig.name,
                        code: slotValue,
                        valueType: 'table-list',
                        renderValue: slotValue
                    }, slotName)
                }
            },
            /**
             * @desc 更新 prop 配置
             * @param { String } propName
             * @param { Object } propData
             *
             * 更新列配置并同步 slot
             */
            handleChange: _.throttle(function (propName, propData) {
                let result = this.lastProps
                if (!this.lastProps[propName]) {
                    const camelPropName = camelCase(propName)
                    const paramPropName = paramCase(propName)
                    const excludeProp = this.lastProps[camelPropName] ? camelPropName : paramPropName
                    // 同一属性在原来与现在命名不一致时，剔除原有属性
                    result = Object.keys(this.lastProps).reduce((acc, key) => {
                        if (key !== excludeProp) {
                            acc[key] = this.lastProps[key]
                        }
                        return acc
                    }, {})
                }
                this.lastProps = Object.freeze({
                    ...result,
                    [propName]: propData
                })
                
                /** 兼容bkcharts的精细化配置升级，去除了remoteOptions，当修改了options，将remoteOptions置空 */
                const updateBkChartsRemoteOptions = (this.componentNode.type === 'bk-charts' && propName === 'options') ? {
                    remoteOptions: LC.utils.genPropFormatValue({
                        format: 'value',
                        code: {},
                        renderValue: {},
                        payload: {}
                    })
                } : {}

                this.componentNode.setRenderProps({
                    ...this.lastProps,
                    [propName]: propData,
                    ...updateBkChartsRemoteOptions
                })
                this.syncOtherProp(propName, propData)
            }, 60),

            toggleShowGroupProp (group, index) {
                group.isShow = !group.isShow
                this.$forceUpdate()
            }
        }
    }
</script>
<style lang='postcss' scoped>
.group-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 8px 0 12px;
    line-height: 40px;
    cursor: pointer;
    & > span:first-child{
        font-size: 12px;
        font-weight: 700;
        color: #313238;
    }
    .icon-angle-down {
        cursor: pointer;
        font-size: 24px;
        transition: transform 200ms;
        &.close {
            transform: rotate(-90deg);
        }
    }
}
.group-name-bt {
    border-bottom: 1.25px solid #F5F7FA;
}
.group-bt {
    border-bottom: 1.25px solid #EAEBF0;
}
</style>
