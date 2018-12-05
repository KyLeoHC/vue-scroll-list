<a href="https://www.npmjs.com/package/vue-scroll-list">
    <img src="https://img.shields.io/npm/v/vue-scroll-list.svg?style=flat" alt="NPM version">
</a>

# vue-scroll-list
> A vue component support infinite scroll list.Different item height is also supported.
 
note: Vue version >= 2.3 is needed.

## Install

```bash
$ npm install vue-scroll-list --save-dev
```

## Demos

[infinite data](http://freeui.org/vue-scroll-list/)

## Usage

```html
<template>
    <div id="app">
        <h2>vue-scroll-list with infinite data</h2>
        <h3>random height</h3>
        <h4>total: {{count}}</h4>
        <div class="wrapper">
            <scroll-list :debounce="50"
                         :remain="10"
                         :enabled="true"
                         :keep="true"
                         @toTop="onTop"
                         @toBottom="onBottom"
                         @scrolling="onScroll">
                <div v-for="(item, index) in list"
                     :key="item.index"
                     :class="['item']"
                     :style="{height: item.itemHeight + 'px', 'line-height': item.itemHeight + 'px'}"
                     v-bind="{'data-height': item.itemHeight}">
                    index:{{item.index}} / height:{{item.itemHeight}}
                </div>
            </scroll-list>
        </div>
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
                    // this.heightList.push(itemHeight);
                }
                console.log('[demo]:' + size + ' items are created.')
            }
        },
        created() {
            window.__createSize = 40;
            window.__stopLoadData = false;
            window.__showScrollEvent = false;
            this.createData();
        }
    };
</script>
<style scoped>
    #app {
        text-align: center;
    }

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
```
You can define the height of container(such as the `ul` tag above) by the css height.  
note: You can run this demo by `npm run dev`.

## Props and Events

Available `Prop` :

*Prop* | *Type* | *Required* | *Description* |
:--- | :--- | :--- | :--- |
| heights | Array | * | An array contains all height of your item.If you want to use `data-height`,please ignore this option. |
| remain | Number | * | The number of item that show in view port.(default `10`) |
| keep | Boolean | * | Work with `keep-alive` component,keep scroll position after activated.(default `false`) |
| enabled | Boolean | * | If you want to render all data directly,please set 'false' for this option.But `toTop`、`toBottom` and `scrolling` event is still available.(default `true`) |

Available `Event` :

*Event* | *Description* |
:--- | :--- |
| toTop | An event emit by this library when this list is scrolled on top. |
| toBottom | An event emit by this library when this list is scrolled on bottom. |
| scrolling | An event emit by this library when this list is scrolling. |

## About heights prop
`heights` property is an array contains all height of your item,but you can tell us then height of each item by setting the `data-height` property.
```html
<div v-for="item in list"
     :key="item.index"
     v-bind="{'data-height': item.itemHeight}">
</div>
```
Sometimes you may need to change the height of each item or filter your item.This may cause some blank problems.So you'd better call `update` function to tell us.
```html
<scroll-list
    ref="vueScrollList"
    :debounce="50"
    :remain="10"
    :enabled="true"
    :keep="true"
    @toTop="onTop"
    @toBottom="onBottom"
    @scrolling="onScroll">
    <div v-for="item in list"
         :key="item.index"
         :class="['item']"
         :style="{height: item.itemHeight + 'px', 'line-height': item.itemHeight + 'px'}"
         v-bind="{'data-height': item.itemHeight}">
        index:{{item.index}} / height:{{item.itemHeight}}
    </div>
</scroll-list>
```
```js
this.$refs.vueScrollList && this.$refs.vueScrollList.update();
```
## License

[MIT License](https://github.com/KyLeoHC/vue-scroll-list/blob/master/LICENSE)
