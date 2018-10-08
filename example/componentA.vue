<template>
    <div class="wrapper">
        <scroll-list :heights="heightList"
                     :remain="10"
                     :enabled="true"
                     :keep="true"
                     @toTop="onTop"
                     @toBottom="onBottom"
                     @scrolling="onScroll">
            <div v-for="(item, index) in list"
                 :key="item.index"
                 :class="{item: 1}"
                 :style="{height: item.itemHeight + 'px', 'line-height': item.itemHeight + 'px'}">
                index:{{item.index}} / height:{{item.itemHeight}}
            </div>
        </scroll-list>
    </div>
</template>
<script>
    import scrollList from 'vue-scroll-list';

    export default {
        props: {
            count: {
                type: Number,
                require: true,
                default: 0
            }
        },
        data() {
            return {
                list: [],
                heightList: [],
                currentPosition: 0
            };
        },
        components: {
            scrollList
        },
        methods: {
            onTop() {
                console.log('[demo]:page to top.');
            },
            onBottom() {
                console.log('[demo]:page to bottom.');
                !window.__stopLoadData && this.createData();
            },
            onScroll(event) {
                this.currentPosition = event.target.scrollTop;
                window.__showScrollEvent && console.log(event);
            },
            createData() {
                const size = window.__createSize || 40;
                const count = this.count + size;
                for (let i = this.count; i < count; i++) {
                    let itemHeight = Math.round(Math.random() * 100) + 40;
                    this.list.push({
                        index: i,
                        itemHeight: itemHeight
                    });
                    this.heightList.push(itemHeight);
                }
                this.$emit('update:count', count);
                console.log('[demo]:' + size + ' items are created.')
            },
            logSomeInfo() {
                console.log('%cThere are some useful variables in window object:', 'color: green');
                console.log('%c- `__createSize`: the number of items are created every time.', 'color: green');
                console.log('%c- `__stopLoadData`: set true to stop loading data when the page is on bottom.', 'color: green');
                console.log('%c- `__showScrollEvent`: set true to show scroll event.', 'color: green');
            }
        },
        created() {
            window.__createSize = 40;
            window.__stopLoadData = false;
            window.__showScrollEvent = false;
            this.createData();
            this.logSomeInfo();
        }
    };
</script>
<style scoped>


    .wrapper {
        height: 400px;
        padding: 0;
        border: 1px solid #eee;
        -webkit-overflow-scrolling: touch;
    }

    .item {
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }

    .item:last-child {
        border-bottom: 0;
    }

    .scroll-container {
        transform: translate3d(0, 0, 0);
    }
</style>