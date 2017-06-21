# vue-scroll-list
> A vue component support infinite scroll list.Different item height is also supported.

This library is inspired by [vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list).  
note: Vue version >= 2.3 is needed.

## Install

```bash
$ npm install vue-scroll-list --save-dev
```

## Demos
on the road...

## Usage

```html
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
```
You can define the height of container(such as the `ul` tag above) by the css height.  
note: You can run this demo by `npm run dev`.

## Props and Events

Available `Prop` :
*Prop* | *Type* | *Required* | *Description* |
:--- | :--- | :--- | :--- |
| heights | Array | ✓ | A array contains all height of your item. |
| remain | Number | * | The number of item that show in view port.(default `10`) |

Available `Event` :
*Event* | *Description* |
:--- | :--- |
| toTop | An event emit by this library when this list is scrolled on top. |
| toBottom | An event emit by this library when this list is scrolled on bottom. |
| scrolling | An event emit by this library when this list is scrolling. |

## License

[MIT License](https://github.com/KyLeoHC/vue-scroll-list/blob/master/LICENSE)