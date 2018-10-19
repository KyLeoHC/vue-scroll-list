const component = {
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
    data() {
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
        handleScroll(event) {
            const scrollTop = this.$el.scrollTop;
            this.$emit('scrolling', event);
            this.enabled ? this.updateZone(scrollTop) : this.updateZoneNormally(scrollTop);
            this.scrollTop = scrollTop;
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
            let overs = 0;
            let length = this.heights.length;
            let height = this.heights[0];
            let topReserve = Math.floor(this.reserve / 2);
            for (; overs < length; overs++) {
                if (offset >= height) {
                    height += this.heights[overs + 1];
                } else {
                    break;
                }
            }
            return overs > topReserve - 1 ? overs - topReserve : 0;
        },
        updateZone(offset) {
            const overs = this.findOvers(offset);

            // scroll to top
            if (!offset && this.total) {
                this.$emit('toTop');
            }

            let start = overs || 0;
            let end = start + this.keeps;
            let totalHeight = this.heights.reduce((a, b) => {
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
        filter(slots) {
            if (!slots) {
                slots = [];
                this.start = 0;
            }

            const slotList = slots.filter((slot, index) => {
                return index >= this.start && index <= this.end;
            });
            const topList = this.heights.slice(0, this.start);
            const bottomList = this.heights.slice(this.end + 1);
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
        }
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
        this.$el.scrollTop = this.keep ? (this.scrollTop || 1) : 1;
    },
    render(h) {
        const showList = this.enabled ? this.filter(this.$slots.default) : this.$slots.default;

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
