let component = {
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
        handleScroll(e) {
            let scrollTop = this.$refs.container.scrollTop;

            this.updateZone(scrollTop);

            this.onScroll && this.onScroll(e, scrollTop);
        },
        findOvers(offset) {
            let overs = 0;
            for (let length = this.sizeList.length, height = this.sizeList[0]; overs < length; overs++) {
                if (offset > height) {
                    height += this.sizeList[overs + 1];
                } else {
                    break;
                }
            }
            return overs;
        },
        updateZone(offset) {
            let delta = this.$options.delta;
            let overs = this.findOvers(offset);

            if (!offset && delta.total) {
                this.$emit('toTop');
            }

            let start = overs || 0;
            let end = overs ? (overs + delta.keeps) : delta.keeps;
            let isOverflow = delta.total - delta.keeps > 0;

            if (isOverflow && overs + this.remain >= delta.total) {
                end = delta.total;
                start = delta.total - delta.keeps;
                this.$emit('toBottom');
            }

            delta.end = end;
            delta.start = start;

            this.$forceUpdate();
        },
        filter(slots) {
            let delta = this.$options.delta;

            if (!slots) {
                slots = [];
                delta.start = 0;
            }

            let slotList = slots.filter(function (slot, index) {
                return index >= delta.start && index <= delta.end;
            });
            let sliceList = this.sizeList.slice(0, delta.start);

            delta.total = slots.length;
            delta.allPadding = this.sizeList
                .slice(delta.keeps)
                .reduce((a, b) => {
                    return a + b;
                });
            delta.paddingTop = sliceList.length ? sliceList.reduce((a, b) => {
                return a + b;
            }) : 0;

            return slotList;
        }
    },
    beforeMount() {
        let remains = this.remain;
        let delta = this.$options.delta;
        let benchs = Math.round(remains / 2);

        delta.end = remains + benchs;
        delta.keeps = remains + benchs;
    },
    render(h) {
        let showList = this.filter(this.$slots.default);
        let delta = this.$options.delta;

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
        }, [
            h('div', {
                'style': {
                    'display': 'block',
                    'padding-top': delta.paddingTop + 'px',
                    'padding-bottom': delta.allPadding - delta.paddingTop + 'px'
                }
            }, showList)
        ]);
    }
};

export default component;