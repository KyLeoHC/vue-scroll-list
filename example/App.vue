<template>
    <div id="app">
        <header>
            <h2>vue-scroll-list with infinite data</h2>
            <h3>random height</h3>
            <h4>total: {{count}}</h4>
        </header>
        <div class="switch-btn"
             @click="view = view === 'componentA' ? 'componentB' : 'componentA'">
            switch view
        </div>
        <keep-alive>
            <component :is="view"></component>
        </keep-alive>
    </div>
</template>
<script>
    import componentA from './componentA';
    import componentB from './componentB';

    export default {
        name: 'app',
        data() {
            return {
                view: 'componentA',
                count: 0
            };
        },
        components: {
            componentA,
            componentB
        }
    };
</script>
<style scoped>
    #app {
        text-align: center;
    }

    .switch-btn {
        margin-bottom: 10px;
    }
</style>
