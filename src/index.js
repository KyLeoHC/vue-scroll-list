const _debounce = function (fn, wait) {
    let timeoutId = null;
    return function () {
        const laterFn = () => {
            fn.apply(this, arguments);
        };
        clearTimeout(timeoutId);
        timeoutId = setTimeout(laterFn, wait);
    };
};

const component = {
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
        },
        step: { // throttle
            type: Number
        }
    },
    methods: {
        handleScroll(event) {
            const scrollTop = this.$el.scrollTop;
            if (!this.ignoreStep && this.step && Math.abs(scrollTop - this.scrollTop) < this.step) return;
            this.ignoreStep = false;
            this.scrollTop = scrollTop;
            this.$emit('scrolling', event);
            this.updateZone(scrollTop);
        },
        updateHeightList() {
            if (this.heights) {
                this.heightList = this.heights;
            } else {
                const list = this.$slots.default || [];
                if (list.length !== this.heightList.length) {
                    this.heightList = list.map(vnode => parseInt(vnode.data.attrs['data-height']));
                }
            }
        },
        updateZoneNormally(offset) {
            // handle the scroll event normally
            const scrollHeight = this.$el.scrollHeight;
            const clientHeight = this.$el.clientHeight;
            if (offset === 0) {
                this.$emit('toTop');
            } else if (offset + clientHeight + 5 >= scrollHeight) {
                this.$emit('toBottom');
            }
        },
        findOvers(offset) {
            // compute overs by comparing offset with the height of each item
            // @todo: need to optimize this searching efficiency
            const heightList = this.heightList;
            let overs = 0;
            let height = heightList[0];
            let topReserve = Math.floor(this.reserve / 2);
            for (let length = heightList.length; overs < length; overs++) {
                if (offset >= height) {
                    height += heightList[overs + 1];
                } else {
                    break;
                }
            }
            return overs > topReserve - 1 ? overs - topReserve : 0;
        },
        updateZone(offset) {
            if (this.enabled) {
                this.updateHeightList();
                const overs = this.findOvers(offset);

                // scroll to top
                if (!offset && this.total) {
                    this.$emit('toTop');
                }

                let start = overs || 0;
                let end = start + this.keeps;
                let totalHeight = this.heightList.reduce((a, b) => {
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
        filter(slots) {
            this.updateHeightList();
            if (!slots) {
                slots = [];
                this.start = 0;
            }

            const slotList = slots.filter((slot, index) => {
                return index >= this.start && index <= this.end;
            });
            const topList = this.heightList.slice(0, this.start);
            const bottomList = this.heightList.slice(this.end + 1);
            this.total = slots.length;
            // consider that the height of item may change in any case
            // so we compute paddingTop and paddingBottom every time
            this.paddingTop = topList.length ? topList.reduce((a, b) => {
                return a + b;
            }) : 0;
            this.paddingBottom = bottomList.length ? bottomList.reduce((a, b) => {
                return a + b;
            }) : 0;

            return slotList;
        },
        update() {
            this.$nextTick(() => {
                this.updateZone(this.scrollTop);
            });
        }
    },
    beforeCreate() {
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
    beforeMount() {
        if (this.enabled) {
            let remains = this.remain;
            this.start = 0;
            this.end = remains + this.reserve - 1;
            this.keeps = remains + this.reserve;
        }
    },
    activated() {
        // while work with keep-alive component
        // set scroll position after 'activated'
        this.ignoreStep = true;
        this.$el.scrollTop = this.keep ? (this.scrollTop || 1) : 1;
    },
    render(h) {
        const showList = this.enabled ? this.filter(this.$slots.default) : this.$slots.default;
        const debounce = this.debounce;

        return h('div', {
            class: ['scroll-container'],
            style: {
                'display': 'block',
                'overflow-y': 'auto',
                'height': '100%'
            },
            on: { // '&' support passive event
                '&scroll': debounce
                    ? _debounce(this.handleScroll.bind(this), debounce)
                    : this.handleScroll
            }
        }, [
            h('div', {
                style: {
                    'display': 'block',
                    'padding-top': this.paddingTop + 'px',
                    'padding-bottom': this.paddingBottom + 'px'
                }
            }, showList)
        ]);
    }
};

export default component;
