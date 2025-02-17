/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

const urlPrefix = 'https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/example'

const exmapleFirstImgUrl = urlPrefix + '/static/images/firstswiper.jpg'
const exmapleSecondImgUrl = urlPrefix + '/static/images/secondswiper.jpg'

export default {
    name: 'swiper',
    type: 'bk-swiper',
    displayName: '轮播图',
    icon: 'bk-drag-swiper',
    group: '数据',
    order: 1,
    document: 'https://magicbox.bk.tencent.com/magicbox/3.0/swiper',
    events: [
        {
            displayName: '图片索引改变',
            name: 'index-change',
            tips: '图片索引改变时调用该事件函数，事件回调参数 (index: Number)'
        }
    ],
    styles: [
        'position',
        {
            name: 'size',
            exclude: ['maxHeight', 'minHeight']
        },
        'margin',
        'pointer',
        'opacity'
    ],
    renderStyles: {
        width: '600px',
        height: '300px'
    },
    directives: [
        // {
        //     type: 'v-bind',
        //     prop: 'pics',
        //     format: 'variable',
        //     valueTypeInclude: ['array']
        // }
    ],
    groups: [
        { label: '数据源', value: 'dataSource' },
        { label: '轮播设置', value: 'loop' },
        { label: '样式', value: 'style' }
    ],
    props: {
        pics: {
            type: ['srcset', 'remote'],
            remoteValidate (data) {
                if (!Array.isArray(data)) return '返回值需要是数组'
                const errData = data.find((item) => !item.hasOwnProperty('url'))
                if (errData) return '返回值每个元素需要含有url字段'
            },
            displayName: '图片列表',
            tips: '图片列表',
            val: [
                { url: exmapleFirstImgUrl },
                { url: exmapleSecondImgUrl }
            ],
            belongGroup: 'dataSource'
        },
        list: {
            type: 'array',
            val: [],
            displayName: '数据列表',
            tips: '数据列表，配合 slot 使用',
            belongGroup: 'dataSource'
        },
        width: {
            type: 'number',
            val: 600,
            displayName: '宽度',
            tips: '轮播图宽度，如果不传将使用父元素宽度',
            belongGroup: 'style'
        },
        height: {
            type: 'number',
            val: 300,
            displayName: '高度',
            tips: '轮播图高度，如果不传将使用父元素高度',
            belongGroup: 'style'
        },
        'is-loop': {
            type: 'boolean',
            val: true,
            displayName: '是否开启图片轮播',
            tips: '是否开启图片轮播',
            belongGroup: 'loop'
        },
        'loop-time': {
            type: 'number',
            val: 8000,
            displayName: '轮播间隔',
            tips: '轮播间隔',
            belongGroup: 'loop'
        }
    }
}
