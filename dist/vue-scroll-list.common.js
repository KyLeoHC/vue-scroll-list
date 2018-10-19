'use strict';

var component = {
    props: {
        heights: {
            type: Array,
            required: true
        },
        remain: {
            type: Number,
            default: 10
        },
        enabled: {
            type: Boolean,
            default: true
        },
        keep: {
            type: Boolean,
            default: false
        }
    },
    data: function data() {
        return {
            scrollTop: 0,
            start: 0, // start index
            end: 0, // end index
            total: 0, // all items count
            keeps: 0, // number of item keeping in real dom
            paddingTop: 0, // all padding of top dom
            paddingBottom: 0, // all padding of bottom dom
            reserve: 6 // number of reserve dom for pre-render
        };
    },

    methods: {
        handleScroll: function handleScroll(event) {
            var scrollTop = this.$el.scrollTop;
            this.$emit('scrolling', event);
            this.enabled ? this.updateZone(scrollTop) : this.updateZoneNormally(scrollTop);
            this.scrollTop = scrollTop;
        },
        updateZoneNormally: function updateZoneNormally(offset) {
            // handle the scroll event normally
            var scrollHeight = this.$el.scrollHeight;
            var clientHeight = this.$el.clientHeight;
            if (offset === 0) {
                this.$emit('toTop');
            } else if (offset + clientHeight + 5 >= scrollHeight) {
                this.$emit('toBottom');
            }
        },
        findOvers: function findOvers(offset) {
            // compute overs by comparing offset with the height of each item
            // @todo: need to optimize this searching efficiency
            var overs = 0;
            var length = this.heights.length;
            var height = this.heights[0];
            var topReserve = Math.floor(this.reserve / 2);
            for (; overs < length; overs++) {
                if (offset >= height) {
                    height += this.heights[overs + 1];
                } else {
                    break;
                }
            }
            return overs > topReserve - 1 ? overs - topReserve : 0;
        },
        updateZone: function updateZone(offset) {
            var overs = this.findOvers(offset);

            // scroll to top
            if (!offset && this.total) {
                this.$emit('toTop');
            }

            var start = overs || 0;
            var end = start + this.keeps;
            var totalHeight = this.heights.reduce(function (a, b) {
                return a + b;
            });

            // scroll to bottom
            if (offset && offset + this.$el.clientHeight >= totalHeight) {
                start = this.total - this.keeps;
                end = this.total - 1;
                this.$emit('toBottom');
            }

            this.start = start;
            this.end = end;

            this.$forceUpdate();
        },
        filter: function filter(slots) {
            var _this = this;

            if (!slots) {
                slots = [];
                this.start = 0;
            }

            var slotList = slots.filter(function (slot, index) {
                return index >= _this.start && index <= _this.end;
            });
            var topList = this.heights.slice(0, this.start);
            var bottomList = this.heights.slice(this.end + 1);
            this.total = slots.length;
            // consider that the height of item may change in any case
            // so we compute paddingTop and paddingBottom every time
            this.paddingTop = topList.length ? topList.reduce(function (a, b) {
                return a + b;
            }) : 0;
            this.paddingBottom = bottomList.length ? bottomList.reduce(function (a, b) {
                return a + b;
            }) : 0;

            return slotList;
        }
    },
    beforeMount: function beforeMount() {
        if (this.enabled) {
            var remains = this.remain;

            this.start = 0;
            this.end = remains + this.reserve - 1;
            this.keeps = remains + this.reserve;
        }
    },
    activated: function activated() {
        // while work with keep-alive component
        // set scroll position after 'activated'
        this.$el.scrollTop = this.keep ? this.scrollTop || 1 : 1;
    },
    render: function render(h) {
        var showList = this.enabled ? this.filter(this.$slots.default) : this.$slots.default;

        return h('div', {
            class: {
                'scroll-container': 1
            },
            style: {
                'display': 'block',
                'overflow-y': 'auto',
                'height': '100%'
            },
            on: { // '&' support passive event
                '&scroll': this.handleScroll
            }
        }, [h('div', {
            style: {
                'display': 'block',
                'padding-top': this.paddingTop + 'px',
                'padding-bottom': this.paddingBottom + 'px'
            }
        }, showList)]);
    }
};

module.exports = component;
