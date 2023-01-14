<template>
    <div class="mainPage">
        <!-- <threeJsShow>

        </threeJsShow> -->
        <tabPageBar>
           
                <tabPage slot="tabPages"></tabPage>
                <tabPage slot="tabPages"></tabPage>
                <tabPage slot="tabPages"></tabPage>
            
        </tabPageBar>
    </div>
</template>
<style scoped>

</style>
<script>

import threeJsShow from '../components/threeJsShow.vue';

import { materialInfo } from '../lib/material';
import tabPage from '../shared/tabPage.vue';
import tabPageBar from '../shared/tabPageBar.vue';
import Vue from 'vue'

export default {
    name: 'mainPage',
    data() {
        return {
            neurogen:new Vue()
        };
    },
    components: {
        threeJsShow,
        tabPageBar,
        tabPage
    },
    methods: {
        //    Test(){
        //      console.log(materialInfo.bodyMatInfo._mainColor);
        //    }
    },
    mounted() {
        // this.Test();
    }
}
</script>
