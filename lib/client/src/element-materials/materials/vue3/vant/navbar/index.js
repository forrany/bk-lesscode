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

export default {
    name: 'van-nav-bar',
    type: 'van-nav-bar',
    // bk-drag-custom-comp-default
    icon: 'bk-drag-navbar',
    displayName: '导航栏',
    group: '导航',
    document: 'https://vant-contrib.gitee.io/vant/#/zh-CN/nav-bar',
    events: [
        { name: 'click-left', tips: '点击左侧按钮时触发' },
        { name: 'click-right', tips: '点击右侧按钮时触发' }
    ],
    styles: ['padding', 'margin'],
    renderStyles: {
    },
    groups: [
        { label: '内容', value: 'content' },
        { label: '样式', value: 'style' },
        { label: '其他', value: 'other' }
    ],
    props: {
        title: {
            type: 'string',
            val: '标题',
            displayName: '标题文字',
            tips: '标题',
            belongGroup: 'content'
        },
        'left-text': {
            type: 'string',
            val: '返回',
            displayName: '左侧文案',
            tips: '左侧文案',
            belongGroup: 'content'
        },
        'right-text': {
            type: 'string',
            val: '确认',
            displayName: '右侧文案',
            tips: '右侧文案',
            belongGroup: 'content'
        },
        'left-arrow': {
            type: 'boolean',
            val: false,
            displayName: '左侧是否有箭头',
            tips: '是否显示左侧箭头',
            belongGroup: 'other'
        },
        'border': {
            type: 'boolean',
            val: true,
            displayName: '是否显示边框',
            tips: '是否显示边框',
            belongGroup: 'style'
        },
        'fixed': {
            type: 'boolean',
            val: false,
            displayName: '是否固定在顶部',
            tips: '是否固定在顶部',
            belongGroup: 'other'
        },
        'placeholder': {
            type: 'boolean',
            val: false,
            displayName: '是否生成等高占位元素',
            tips: '固定在顶部时，是否在标签位置生成一个等高的占位元素',
            belongGroup: 'other'
        },
        'z-index': {
            type: ['number', 'string'],
            val: 1,
            displayName: 'zindex层级',
            tips: '导航栏 z-index',
            belongGroup: 'style'
        },
        'safe-area-inset-top': {
            type: 'boolean',
            val: false,
            displayName: '是否开启顶部安全区适配',
            tips: '是否开启顶部安全区适配',
            belongGroup: 'other'
        },
        clickable: {
            type: 'boolean',
            val: true,
            displayName: '是否开启按钮点击反馈',
            tips: '是否开启两侧按钮的点击反馈',
            belongGroup: 'other'
        }
    }
    // slots: {
    //     title: {
    //         name: ['text'],
    //         type: ['text'],
    //         displayName: '自定义标题',
    //         val: ''
    //     },
    //     left: {
    //         name: ['text'],
    //         type: ['text'],
    //         displayName: '自定义左侧区域内容',
    //         val: ''
    //     },
    //     right: {
    //         name: ['text'],
    //         type: ['text'],
    //         displayName: '自定义右侧区域内容',
    //         val: ''
    //     }
    // }
}
