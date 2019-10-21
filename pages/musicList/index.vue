
<template>
    <div class="musiclist-container container">
        <audio ref="audio" src="" controls>
            您的浏览器不支持 audio 标签。
        </audio>

        <div v-if="audioList.length > 0" class="base-info-list-content">
            <div v-for="(item, index) in audioList" :key="index" class="list-content-item">
                <div class="audio-list-item-left">
                    <div class="audio-item-title">{{item.title}}</div>
                    <div class="audio-item-author">
                        <span>{{item.author}}</span>
                        <span>{{item.currentTime}}<span
                                v-if="item.duration">/{{item.duration}}</span></span>

                    </div>
                    <div class="audio-item-tips">已经播放{{item.playNum}}次</div>
                </div>
                <div class="audio-list-item-right">
                    <img class="audio-img" :src="item.image" />
                    <div class="audio-control" @click="() => handleAudioCtrl(item, index)">
                        <img :src="item.audioCtrl" />
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import dayjs from 'dayjs';

import PLAY_ICON from '@/assets/images/common/play.png';
import PAUSE_ICON from '@/assets/images/common/pause.png';
import LOADING_GIF from '@/assets/images/common/loading.gif';

const AUDIO_LIST = [
    {
        src: 'http://up_mp4.t57.cn/2017/1/05m/09/298092032442.m4a',
        image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1904174104,1178227250&fm=26&gp=0.jpg',
        audioCtrl: PLAY_ICON,
        title: '拔萝卜',
        author: '儿童歌曲',
        currentSeconds: 0,
        currentTime: '00:00',
        duration: '',
        playNum: 8472
    },
    {
        src: 'http://up_mp4.t57.cn/2017/1/05m/09/298092032442.m4a',
        image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4209281349,2473705813&fm=26&gp=0.jpg',
        audioCtrl: PLAY_ICON,
        title: '此时此刻',
        author: '许巍',
        currentSeconds: 0,
        currentTime: '00:00',
        duration: '',
        playNum: 12
    },

    {
        src: 'http://up_mp4.t57.cn/2018/1/03m/13/396131229550.m4a',
        image:
            'http://img3.imgtn.bdimg.com/it/u=287949954,2623962387&fm=26&gp=0.jpg',
        audioCtrl: PLAY_ICON,
        title: '最美的期待',
        author: '周笔畅',
        currentSeconds: 0,
        currentTime: '00:00',
        duration: '',
        playNum: 121
    }
];

const HAVE_ENOUGH_DATA = 4;

interface Iaudio extends Element {
    src: string;
    readyState: number;
    currentTime: number;
    duration: number;
    ended: boolean;
    play: () => void;
    pause: () => void;
}

@Component({
    head() {
        return {
            title: '宝宝音乐'
        };
    },
    components: {}
})
export default class MusicList extends Vue {
    $Weui: any;
    $initWxConfig: any;
    // data
    wx: any = null;
    themeColor: string = '#80d7fe';
    audioTimer: any = null;
    iconTimer: any = null;
    audioList: any = AUDIO_LIST;
    lastAudioIndex: number | null = null;

    mounted() {
        const { query } = this.$route;
        console.log('querty', query);

        if (query.themeColor) {
            this.themeColor = '#' + ((query.themeColor as string) || '80d7fe');
        }

        // this.wx = await this.$initWxConfig();
    }

    // computed

    // methods
    private setAudioLoad(index = 0) {
        this.iconTimer && clearInterval(this.iconTimer);

        this.iconTimer = setInterval(() => {
            this.audioList[index].audioCtrl = LOADING_GIF;
            const { readyState } = this.$refs.audio as Iaudio;

            if (readyState === HAVE_ENOUGH_DATA) {
                this.audioList[index].audioCtrl = PAUSE_ICON;
                clearInterval(this.iconTimer);
            }
        }, 100);
    }

    private calAudioTime(index, isPlay = true) {
        this.audioTimer && clearInterval(this.audioTimer);
        isPlay &&
            (this.audioTimer = setInterval(() => {
                const { currentTime, duration, ended } = this.$refs
                    .audio as Iaudio;

                if (ended) {
                    clearInterval(this.audioTimer);
                    this.audioList[index].audioCtrl = PLAY_ICON;
                    this.audioList[index].currentTime = '00:00';
                    this.audioList[index].currentSeconds = 0;
                    return;
                }

                this.audioList[index].currentSeconds = currentTime;
                this.audioList[index].currentTime = dayjs
                    .unix(currentTime + 0.5)
                    .format('mm:ss');
                duration &&
                    (this.audioList[index].duration = dayjs
                        .unix(duration + 0.5)
                        .format('mm:ss'));
            }, 1000));
    }

    private initAudio(index, item) {
        const audioRef: Iaudio = this.$refs.audio as Iaudio;

        audioRef.src = item.src;
        audioRef.currentTime = this.audioList[index].currentSeconds;
    }

    private handleAudioCtrl(item, index) {
        // 初始化音频播放
        this.initAudio(index, item);

        // 当点击的是上一次控制的音频
        if (this.lastAudioIndex === index) {
            this.setAudioCtrlIcon(index);
            return;
        }

        // 点击的不是上一次控制的音频
        this.setAudioCtrlIcon(index, true);
    }

    private setAudioCtrlIcon(index = 0, needSetlastCtrl = false) {
        const audioRef: Iaudio = this.$refs.audio as Iaudio;

        if (needSetlastCtrl) {
            if (this.lastAudioIndex !== null) {
                this.audioList[this.lastAudioIndex].audioCtrl = PLAY_ICON;
            }
            this.lastAudioIndex = index;
        }

        if (this.audioList[index].audioCtrl === PLAY_ICON) {
            this.setAudioLoad(index);
            audioRef.play();
            this.calAudioTime(index);
        } else {
            this.audioList[index].audioCtrl = PLAY_ICON;
            audioRef.pause();
            this.calAudioTime(index, false);
        }
    }
}
</script>

<style lang="less" src="./index.less" scoped>
</style>
