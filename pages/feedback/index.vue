<template>
    <div class="feedback-container">
        <div class="feed-back-type">
            <div class="feed-back-title">请选择您要反馈的问题类型</div>
            <div class="feed-back-type-items">
                <div v-for="(item, index) in feedbackType" :key="index" class="type-item"
                    :style="currentTypeIndex === index ? typeActiveStyle : ''"
                    @click="() => handleFeedbackType(index, item)">
                    {{ item.name }}
                </div>
            </div>
        </div>

        <div class="feed-back-content">
            <div class="feed-back-title">反馈内容</div>
            <div class="feed-back-detail">

                <BasePicAdd :event-pic="eventPic" :placeholder="placeholder"
                    usr-pic-style="feedback-detail-pic" />
            </div>
        </div>

        <div class="feed-back-phone">
            <div class="feed-back-phone-label">联系方式</div>
            <input v-model="phone" class="feed-back-phone-input" placeholder="请输入手机号" />
        </div>

        <div class="feed-back-commit" :style="{'background': (isBtnEnabled ? themeColor : '#ccc')}">
            提交</div>

    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BasePicAdd from '~/components/Base/BasePicAdd.vue';

interface IfeedbackType {
    name: string;
}

const FEEDBACK_TYPE: IfeedbackType[] = [
    {
        name: '新功能建议'
    },
    {
        name: '功能问题'
    },
    {
        name: '性能问题'
    },
    {
        name: '体验问题'
    },
    {
        name: '服务投诉'
    }
];

@Component({
    head() {
        return {
            title: '意见反馈'
        };
    },
    components: {
        BasePicAdd
    }
})
export default class AddEventLog extends Vue {
    $Weui: any;
    $initWxConfig: any;
    // data
    wx: any = null;
    needMenuCenter: boolean = true;
    feedbackType: IfeedbackType[] = FEEDBACK_TYPE;
    currentTypeIndex: number = 0;
    placeholder: string = '请您详细描述一下问题，便于我们更好为您服务';
    eventPic: Array<string> = [
        'https://img.zcool.cn/community/031cbda57c9116b0000018c1b8ad5d9.jpg@520w_390h_1c_1e_1o_100sh.jpg',
        'https://img.zcool.cn/community/04a89b57b2ad120000012e7eddc3d7.jpg@160w_160h_1c_1e_1o_100sh.jpg',
        'https://img.zcool.cn/community/0076a45ab1c754a801218207ce0b56.jpg@160w_160h_1c_1e_1o_100sh.jpg',
        'https://img.zcool.cn/community/01cc2d5c62bcb4a801203d2256331f.jpg@520w_390h_1c_1e_1o_100sh.jpg'
    ];
    phone: string = '';
    themeColor: string = '#80d7fe';

    mounted() {
        const { query } = this.$route;
        console.log('querty', query);

        if (query.themeColor) {
            this.themeColor = '#' + ((query.themeColor as string) || '80d7fe');
        }

        // this.wx = await this.$initWxConfig();
    }

    // computed
    get typeActiveStyle() {
        return `background: ${this.themeColor}; color: #fff`;
    }

    get isBtnEnabled() {
        return /^1\d{10}$/.test(this.phone);
    }

    // methods
    private handleFeedbackType(index: number) {
        this.currentTypeIndex = index;
    }
}
</script>

<style lang="less" src="./index.less" scoped>
</style>
