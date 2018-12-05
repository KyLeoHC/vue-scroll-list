'use strict';

var _debounce = function _debounce(fn, wait) {
    var timeoutId = null;
    return function () {
        var _this = this,
            _arguments = arguments;

        var laterFn = function laterFn() {
            fn.apply(_this, _arguments);
        };
        clearTimeout(timeoutId);
        timeoutId = setTimeout(laterFn, wait);
    };
};

var component = {
    props: {
        heights: {
            type: Array
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
        },
        debounce: {
            type: Number
        }
    },
    methods: {
        handleScroll: function handleScroll(event) {
            var scrollTop = this.$el.scrollTop;
            this.scrollTop = scrollTop;
            this.$emit('scrolling', event);
            this.updateZone(scrollTop);
        },
        updateHeightList: function updateHeightList() {
            if (this.heights) {
                this.heightList = this.heights;
            } else {
                var list = this.$slots.default || [];
                if (list.length !== this.heightList.length) {
                    this.heightList = list.map(function (vnode) {
                        return parseInt(vnode.data.attrs['data-height']);
                    });
                }
            }
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
            var heightList = this.heightList;
            var overs = 0;
            var height = heightList[0];
            var topReserve = Math.floor(this.reserve / 2);
            for (var length = heightList.length; overs < length; overs++) {
                if (offset >= height) {
                    height += heightList[overs + 1];
                } else {
                    break;
                }
            }
            return overs > topReserve - 1 ? overs - topReserve : 0;
        },
        updateZone: function updateZone(offset) {
            if (this.enabled) {
                this.updateHeightList();
                var overs = this.findOvers(offset);

                // scroll to top
                if (!offset && this.total) {
                    this.$emit('toTop');
                }

                var start = overs || 0;
                var end = start + this.keeps;
                var totalHeight = this.heightList.reduce(function (a, b) {
                    return a + b;
                });

                // scroll to bottom
                if (offset && offset + this.$el.clientHeight >= totalHeight) {
                    start = this.total - this.keeps;
                    end = this.total - 1;
                    this.$emit('toBottom');
                }

                if (this.start !== start || this.end !== end) {
                    this.start = start;
                    this.end = end;
                    this.$forceUpdate();
                }
            } else {
                this.updateZoneNormally(offset);
            }
        },
        filter: function filter(slots) {
            var _this2 = this;

            this.updateHeightList();
            if (!slots) {
                slots = [];
                this.start = 0;
            }

            var slotList = slots.filter(function (slot, index) {
                return index >= _this2.start && index <= _this2.end;
            });
            var topList = this.heightList.slice(0, this.start);
            var bottomList = this.heightList.slice(this.end + 1);
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
        },
        update: function update() {
            var _this3 = this;

            this.$nextTick(function () {
                _this3.updateZone(_this3.scrollTop);
            });
        }
    },
    beforeCreate: function beforeCreate() {
        // vue won't observe this properties
        Object.assign(this, {
            heightList: [], // list of each item height
            scrollTop: 0, // current scroll position
            start: 0, // start index
            end: 0, // end index
            total: 0, // all items count
            keeps: 0, // number of item keeping in real dom
            paddingTop: 0, // all padding of top dom
            paddingBottom: 0, // all padding of bottom dom
            reserve: 10 // number of reserve dom for pre-render
        });
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
        var debounce = this.debounce;

        return h('div', {
            class: ['scroll-container'],
            style: {
                'display': 'block',
                'overflow-y': 'auto',
                'height': '100%'
            },
            on: { // '&' support passive event
                '&scroll': debounce ? _debounce(this.handleScroll.bind(this), debounce) : this.handleScroll
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
