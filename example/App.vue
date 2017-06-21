<template>
    <div id="app">
        <ul>
            <scroll-list
                    :heights="heightList"
                    :remain="10"
                    @toTop="onTop"
                    @toBottom="onBottom"
                    @scrolling="onScroll">
                <li v-for="(item, index) in list"
                    :key="item.name"
                    :style="{height: item.itemHeight + 'px'}">
                    {{item.name}}/{{item.price}}/{{item.itemHeight}}
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
                console.log('page to top.');
            },
            onBottom() {
                console.log('page to bottom.');
                this.createData();
            },
            onScroll(event) {
                console.log(event);
            },
            createData() {
                let size = 40;
                this.count += size;
                for (let i = this.count - size; i < this.count; i++) {
                    let itemHeight = Math.random() > 0.5 ? 40 : 100;
                    this.list.push({
                        name: 'name-' + i,
                        price: Math.floor(Math.random() * 1000),
                        itemHeight: itemHeight
                    });
                    this.heightList.push(itemHeight);
                }
            }
        },
        created() {
            this.createData();
        }
    };
</script>
<style scoped>
    ul {
        border: 1px solid #eee;
        height: 400px;
    }

    .scroll-container {
        transform: translate3d(0, 0, 0);
    }
</style>
