(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-scroll-list'] = global['vue-scroll-list'] || {}, global['vue-scroll-list'].js = factory());
}(this, (function () { 'use strict';

var component = {
    props: {
        heights: {
            type: Array,
            required: true
        },
        remain: {
            type: Number,
            default: 10
        }
    },
    delta: { // an extra object helping to calculate
        start: 0, // start index
        end: 0, // end index
        total: 0, // all items count
        keeps: 0, // number of item keeping in real dom
        paddingTop: 0, // all padding of top dom
        paddingBottom: 0, // all padding of bottom dom
        reserve: 6 // number of reserve dom for pre-render
    },
    methods: {
        handleScroll: function handleScroll(event) {
            var scrollTop = this.$el.scrollTop;

            this.updateZone(scrollTop);

            this.$emit('scrolling', event);
        },
        findOvers: function findOvers(offset) {
            // compute overs by comparing offset with the height of each item
            // @todo: need to optimize this searching efficiency
            var delta = this.$options.delta;
            var overs = 0;
            var length = this.heights.length;
            var height = this.heights[0];
            var topReserve = Math.floor(delta.reserve / 2);
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
            var delta = this.$options.delta;
            var overs = this.findOvers(offset);

            // scroll to top
            if (!offset && delta.total) {
                this.$emit('toTop');
            }

            var start = overs || 0;
            var end = start + delta.keeps;
            var totalHeight = this.heights.reduce(function (a, b) {
                return a + b;
            });

            // scroll to bottom
            if (offset && offset + this.$el.clientHeight >= totalHeight) {
                start = delta.total - delta.keeps;
                end = delta.total - 1;
                this.$emit('toBottom');
            }

            delta.start = start;
            delta.end = end;

            this.$forceUpdate();
        },
        filter: function filter(slots) {
            var delta = this.$options.delta;

            if (!slots) {
                slots = [];
                delta.start = 0;
            }

            var slotList = slots.filter(function (slot, index) {
                return index >= delta.start && index <= delta.end;
            });
            var topList = this.heights.slice(0, delta.start);
            var bottomList = this.heights.slice(delta.end + 1);
            delta.total = slots.length;
            // consider that the item height may change in any case
            // so we compute paddingTop and paddingBottom every time
            delta.paddingTop = topList.length ? topList.reduce(function (a, b) {
                return a + b;
            }) : 0;
            delta.paddingBottom = bottomList.length ? bottomList.reduce(function (a, b) {
                return a + b;
            }) : 0;

            return slotList;
        }
    },
    beforeMount: function beforeMount() {
        var remains = this.remain;
        var delta = this.$options.delta;

        delta.start = 0;
        delta.end = remains + delta.reserve - 1;
        delta.keeps = remains + delta.reserve;
    },
    render: function render(h) {
        var showList = this.filter(this.$slots.default);
        var delta = this.$options.delta;

        return h('div', {
            class: {
                'scroll-container': true
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
                'padding-top': delta.paddingTop + 'px',
                'padding-bottom': delta.paddingBottom + 'px'
            }
        }, showList)]);
    }
};

return component;

})));
