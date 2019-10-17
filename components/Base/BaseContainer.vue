<template>
    <div class="base-container-content">
        <div class="content-header">
            <div class="content-title" :style="{'background': backgroundSelf}">
                {{ title }}
            </div>
        </div>

        <div class="content-detail" :style="{'margin-top': contentHeight + 'px'}">
            <slot name="content-detail"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BaseContainer extends Vue {
    backgroundSelf: string = '#ff85bc';
    contentHeight: number = 0;
    title: string = '140';
}
</script>

<style lang="less" scoped>
.base-container-content {
    position: relative;
    width: 100%;

    .content-header {
        position: fixed;
        top: 0px;
        left: 0;
        width: 100%;

        .content-title {
            font-size: 30px;
            color: #fff;
            line-height: 44px;
            margin-bottom: 20px;
            text-align: center;
        }
    }

    .content-detail {
        margin-top: 140px;
        width: 100%;
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}
</style>
