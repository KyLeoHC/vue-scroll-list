<template>
    <div id="app">
        <ul>
            <scroll-list
                    :size-list="heightList"
                    :remain="10"
                    :view-height="400"
                    @toTop="onTop"
                    @toBottom="onBottom">
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
                heightList: []
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
            }
        },
        created() {
            for (let i = 0; i < 40; i++) {
                let itemHeight = Math.random() > 0.5 ? 40 : 100;
                this.list.push({
                    name: 'name-' + i,
                    price: Math.floor(Math.random() * 1000),
                    itemHeight: itemHeight
                });
                this.heightList.push(itemHeight);
            }
        }
    };
</script>
<style scoped>
    ul {
        border: 1px solid #eee;
    }

    .scroll-container {
        transform: translate3d(0, 0, 0);
    }
</style>
