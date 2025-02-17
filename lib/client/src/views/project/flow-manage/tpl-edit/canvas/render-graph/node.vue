<template>
    <div
        v-if="node.type"
        :class="[
            'graph-node-wrapper',
            node.isDraft ? 'is-draft' : '',
            node.status
        ]">
        <div
            v-if="isCircle"
            class="circle-node">
            <div class="text">
                {{ node.type === 'Start' ? '开始' : '结束' }}
            </div>
        </div>
        <div v-else class="rect-node">
            <div :class="['node-icon-area', viewMode ? 'view-mode' : '']">
                <i :class="['bk-drag-icon', GET_NODE_ICON(node.type)]"></i>
            </div>
            <div class="node-name-area" :title="node.config.name">
                <div class="name-wrapper">
                    <span class="name">{{ node.config.name }}</span>
                    <span v-if="node.sourceManualNode" class="system-add-icon">系统</span>
                </div>
                <p class="desc">
                    <span v-if="node.isDraft" class="config-tips">点击配置</span>
                    <template v-else>
                        <span v-if="node.type === 'Manual'">处理人：{{ processorName }}</span>
                        <span v-if="node.type === 'DataProcessing'">目标表：{{ node.config.tableName }}</span>
                    </template>
                </p>
                <i v-if="!viewMode" class="bk-drag-icon bk-drag-edit node-edit-icon" @click.stop="$emit('click', node)" />
                <i v-else-if="node.status === 'RUNNING'" class="bk-drag-icon bk-drag-sync-pending running-spin"  />
            </div>
        </div>
        <i
            v-if="!viewMode && !['Start', 'End'].includes(node.type)"
            class="bk-icon icon-close node-delete-icon"
            @click.stop="$emit('delete', node)" />
    </div>
</template>
<script>
    import { defineComponent, ref, inject, computed, onMounted } from 'vue'
    import { GET_NODE_ICON } from './constants'

    export default defineComponent({
        name: 'GraphNode',
        props: {
            viewMode: {
                type: Boolean,
                default: false
            }
        },
        setup () {
            const node = ref({})
            const getNode = inject('getNode')

            const isCircle = computed(() => ['Start', 'End'].includes(node.value.type))
            const processorName = computed(() => {
                const typeMap = {
                    ALL: '不限',
                    CREATOR: '提单人'
                }
                if (!isCircle.value && !node.value.isDraft) {
                    const { type, users } = node.value.config.processor
                    return type === 'CUSTOM' ? users : typeMap[type]
                }
                return ''
            })

            onMounted(() => {
                const nodeIns = getNode()
                node.value = nodeIns.getData()
                nodeIns.on('change:data', ({ current }) => {
                    node.value = current
                })
            })

            return {
                node,
                isCircle,
                processorName,
                GET_NODE_ICON
            }
        }
    })
</script>
<style lang="postcss" scoped>
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }

        50% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    .graph-node-wrapper {
        position: relative;
        height: 100%;
        &:hover {
            .node-delete-icon {
                display: block;
            }
        }
        &.is-draft {
            .circle-node {
                .text {
                    background: #e6e7eb;
                    color: #ffffff;
                }
            }
            .rect-node {
                .node-icon-area {
                    background-color: #c4c6cc;
                }
            }
        }
        &.RUNNING {
            cursor: pointer;
            .circle-node {
                .text {
                    background-color: #699df4;
                }
            }
            .rect-node {
                .node-icon-area {
                    background-color: #699df4;
                }
            }
        }
        &.FINISHED {
            .circle-node {
                .text {
                    background-color: #9adc9e;
                }
            }
            .rect-node {
                .node-icon-area {
                    background-color: #9adc9e;
                }
            }
        }
        &.FAILED {
            .circle-node {
                .text {
                    background-color: #ea3636;
                }
            }
            .rect-node {
                .node-icon-area {
                    background-color: #ea3636;
                }
            }
        }
     }
    .circle-node {
        padding: 8px;
        height: 100%;
        border-radius: 50%;
        color: #63656e;
        background-color: #ffffff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
        .text {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            background: #3a84ff;
            font-size: 12px;
            font-weight: bold;
            color: #979ba5;
            border-radius: 50%;
        }
    }
    .rect-node {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        color: #63656e;
        font-size: 14px;
        text-align: center;
        border-radius: 4px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.20);
        overflow: hidden;
        &:hover {
            .node-name-area .node-edit-icon {
                display: block;
            }
        }
        .node-icon-area {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 100%;
            font-size: 18px;
            color: #fff;
            background-color: #3a84ff;
            &.view-mode {
                background-color: #b4becd;
            }
        }
        .node-name-area {
            position: relative;
            width: 190px;
            padding: 6px 16px;
            height: 100%;
            background: #ffffff;
            font-size: 12px;
            text-align: left;
            .name-wrapper {
                display: flex;
                align-items: center;
                color: #63656e;
                font-weight: bold;
                height: 18px;
                line-height: 18px;
                .name {
                    max-width: calc(100% - 40px);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .system-add-icon {
                    padding: 0 4px;
                    line-height: 16px;
                    font-size: 12px;
                    font-weight: normal;
                    background: #f0f1f5;
                    border: 1px solid rgba(151, 155, 165, 0.3);
                    border-radius: 2px;
                    transform: scale(0.83);
                }
            }
            .desc {
                color: #979ba5;
                height: 16px;
                line-height: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                .config-tips {
                    color: #c4c6cc;
                }
            }
            .node-edit-icon {
                display: none;
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 26px;
                color: #63656e;
                cursor: pointer;
                &:hover {
                    color: #3a84ff;
                }
            }
            .running-spin {
                position: absolute;
                right: 8px;
                top: 16px;
                font-size: 16px;
                color: #ff9c01;
                animation: rotate 2s linear infinite;
            }
        }
    }
    .node-delete-icon {
        position: absolute;
        top: -8px;
        right: -4px;
        display: none;
        width: 18px;
        height: 18px;
        line-height: 18px;
        border-radius: 50%;
        background-color: #d8d8d8;
        color: #fff;
        font-size: 18px;
        text-align: center;
        z-index: 2;
        cursor: pointer;
        &:hover {
            background-color: #979ba5;
        }
    }
</style>