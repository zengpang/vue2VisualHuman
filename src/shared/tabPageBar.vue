<template>
    <div class="tabPageBar">
        <slot name="tabPages">

        </slot>
    </div>
</template>
<style>

</style>
<script>

export default {
    name: 'tabPageBar',
    props:['selected','onUpdateSelected'],
    data() {
        return {
           
        };
    },
    components:{
        
    },
    methods: {
       initBar()
       {
         const tabs=this.$slots.tabPages;
         console.log(this.$slots.tabPages);
         if(!tabs) throw new Error("tabPageBar不能为空");
         for (let i = 0; i < tabs.length; i++) {
                console.log(tabs[i].tag);
            } 

       }
    },
    mounted(){
      this.initBar();
    }
}
</script>