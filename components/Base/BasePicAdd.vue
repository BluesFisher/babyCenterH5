<template>
    <div class="add-pic-content">
        <textarea :placeholder="placeholder" maxlength="300" @input="textareaInput"></textarea>

        <div class="pic-container">
            <div v-for="(item, index) in eventPic" :key="index"
                :class="usrPicStyle ? usrPicStyle : 'pic-item'">
                <img class="pic-item-img" :src="item" alt="" @click="() => handleShowPic(item)" />
                <img class="delete-icon" src="~/assets/images/common/delete.png"
                    @click="() => deletePic(index)" />

            </div>
            <div v-if="eventPic.length < 9" class="pic-item">
                <img class="pic-item-img" src="~/assets/images/common/add.png" @click="addImage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// const MAX_PIC_NUM = 9;

@Component
export default class BasePicAdd extends Vue {
    $Weui: any;
    $initWxConfig: any;

    @Prop({ default: () => [] }) eventPic!: Array<string>;
    @Prop({ default: '这一刻你想记录的...' }) placeholder!: string;
    @Prop({ default: '' }) usrPicStyle!: string;

    wx: any = null;

    async mounted() {
        // this.wx = await this.$initWxConfig();
    }

    private textareaInput(e) {
        console.log(e.detail.value);
    }

    private deletePic(index: number = 0) {
        this.$Weui.dialog({
            title: '提示',
            content: '确认删除该图片？',
            buttons: [
                {
                    label: '取消',
                    type: 'default'
                },
                {
                    label: '确定',
                    type: 'primary',
                    onClick: () => {
                        this.eventPic.splice(index, 1);
                    }
                }
            ]
        });
    }

    private handleShowPic(item: string) {
        console.log(item);

        // item &&
        //     this.wx.previewImage({
        //         current: item,
        //         urls: this.eventPic
        //     });
    }

    private addImage() {
        // this.wx.chooseImage({
        //     count: MAX_PIC_NUM - this.eventPic.length,
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: (res) => {
        //         this.eventPic = [...this.eventPic, ...res.localIds];
        //     }
        // });
    }
}
</script>

<style lang="less" scoped>
.add-pic-content {
    textarea {
        width: 100%;
        font-size: 28px;
        height: 260px;
        resize: none;
        border: none;
    }

    .pic-container {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 20px;

        .pic-item {
            margin-top: 14px;
            margin-right: 3%;
            width: 31%;
            height: 200px;
            margin-left: 0;
            position: relative;

            &:nth-child(3n) {
                margin-right: 0;
            }

            .pic-item-img {
                height: auto;
                min-height: 100%;
                max-height: 100%;
                width: 100%;
            }

            .delete-icon {
                position: absolute;
                right: -12px;
                top: -12px;
                height: 40px;
                width: 40px;
                z-index: 100;
                background: #fff;
                border-radius: 50%;
            }
        }
    }
}
</style>
