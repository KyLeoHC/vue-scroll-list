(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-scroll-list'] = global['vue-scroll-list'] || {}, global['vue-scroll-list'].js = factory());
}(this, (function () { 'use strict';

var component = {
    props: {
        sizeList: {
            type: Array,
            required: true
        },
        remain: {
            type: Number,
            required: true
        },
        viewHeight: {
            type: Number,
            required: true
        },
        onScroll: Function
    },
    delta: { // an extra object helping to calculate
        start: 0, // start index
        end: 0, // end index
        total: 0, // all items count
        keeps: 0, // number of item keeping in real dom
        allPadding: 0, // all padding of not-render-yet doms
        paddingTop: 0 // container wrapper real padding-top
    },
    methods: {
        handleScroll: function handleScroll(e) {
            var scrollTop = this.$refs.container.scrollTop;

            this.updateZone(scrollTop);

            if (this.onScroll) {
                this.onScroll(e, scrollTop);
            }
        },
        findOvers: function findOvers(offset) {
            var overs = 0;
            for (var length = this.sizeList.length, height = this.sizeList[0]; overs < length; overs++) {
                if (offset > height) {
                    height += this.sizeList[overs + 1];
                } else {
                    break;
                }
            }
            return overs;
        },
        updateZone: function updateZone(offset) {
            var delta = this.$options.delta;
            var overs = this.findOvers(offset);

            if (!offset && delta.total) {
                this.$emit('toTop');
            }

            // need moving items at lease one unit height
            var start = overs || 0;
            var end = overs ? overs + delta.keeps : delta.keeps;
            var isOverflow = delta.total - delta.keeps > 0;

            // avoid overflow range
            if (isOverflow && overs + this.remain >= delta.total) {
                end = delta.total;
                start = delta.total - delta.keeps;
                this.$emit('toBottom');
            }

            delta.end = end;
            delta.start = start;

            // call component to update shown items
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

            delta.total = slots.length;
            delta.allPadding = this.sizeList.slice(delta.keeps).reduce(function (a, b) {
                return a + b;
            });
            var sliceList = this.sizeList.slice(0, delta.start);
            delta.paddingTop = sliceList.length ? sliceList.reduce(function (a, b) {
                return a + b;
            }) : 0;

            return slotList;
        }
    },
    beforeMount: function beforeMount() {
        var remains = this.remain;
        var delta = this.$options.delta;
        var benchs = Math.round(remains / 2);

        delta.end = remains + benchs;
        delta.keeps = remains + benchs;
    },
    render: function render(h, _ref) {
        var props = _ref.props,
            listeners = _ref.listeners;

        var showList = this.filter(this.$slots.default);
        var delta = this.$options.delta;

        return h('div', {
            'ref': 'container',
            'style': {
                'display': 'block',
                'overflow-y': 'auto',
                'height': this.viewHeight + 'px'
            },
            'on': {
                '&scroll': this.handleScroll
            }
        }, [h('div', {
            'style': {
                'display': 'block',
                'padding-top': delta.paddingTop + 'px',
                'padding-bottom': delta.allPadding - delta.paddingTop + 'px'
            }
        }, showList)]);
    }
};

return component;

})));
