<template>
    <!-- <threeJsShow >

    </threeJsShow> -->
</template>
<style scoped>

</style>
<script>

import threeJsShow from '../components/threeJsShow.vue';
import { materialInfo } from '../lib/material';

export default  {
    name: 'mainPage',
    data() {
        return {

        };
    },
    components:{
        threeJsShow
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
