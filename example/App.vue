<template>
    <div id="app">
        <h2>vue-scroll-list with infinite data</h2>
        <h3>random height</h3>
        <h4>total: {{count}}</h4>
        <ul>
            <scroll-list :heights="heightList"
                         :remain="10"
                         @toTop="onTop"
                         @toBottom="onBottom"
                         @scrolling="onScroll">
                <li v-for="(item, index) in list"
                    :key="item.index"
                    :style="{height: item.itemHeight + 'px', 'line-height': item.itemHeight + 'px'}">
                    index:{{item.index}} / height:{{item.itemHeight}}
                </li>
            </scroll-list>
        </ul>
    </div>
</template>
<script>
    import scrollList from 'vue-scroll-list';

    export default {
        name: 'app',
        data() {
            return {
                list: [],
                heightList: [],
                count: 0
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
                window.__showScrollEvent && console.log(event);
            },
            createData() {
                let size = window.__createSize || 40;
                this.count += size;
                for (let i = this.count - size; i < this.count; i++) {
                    let itemHeight = Math.round(Math.random() * 100) + 40;
                    this.list.push({
                        index: i,
                        itemHeight: itemHeight
                    });
                    this.heightList.push(itemHeight);
                }
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
    #app {
        text-align: center;
    }

    ul {
        height: 400px;
        padding: 0;
        border: 1px solid #eee;
        -webkit-overflow-scrolling: touch;
    }

    li {
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }

    li:last-child {
        border-bottom: 0;
    }

    .scroll-container {
        transform: translate3d(0, 0, 0);
    }
</style>
