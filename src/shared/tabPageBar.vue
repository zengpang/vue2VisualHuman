<template>
    <div class="tabPageBar">
        <header>
            <tabButton :buttonStyle="BtnNewStyle" v-for="(item,index) in tabs" :Content="item.data.key" :key="index" :isSelected="false" />
        </header>
        <slot name="tabPages">

        </slot>
    </div>
</template>
<style scoped>
    .tabPageBar{
      display: flex;
      align-items: center;
      flex-direction: column;
      position: fixed;
      bottom: 20px;
      width: 92.36vw;
      min-height: 240px;
      height: 32.62vh;
      border-radius: 15px;
      background: rgba(25, 69, 104, 1);
   }
   .tabPageBar header{
      width: 86.513vw;
      min-height: 30px;
      height: 4.342vh;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      background: rgba(57, 94, 123, 1);
   }
</style>
<script>
import tabButton from './tabButton.vue';
export default {
    name: 'tabPageBar',
    props:['selected','onUpdateSelected'],
    data() {
        return {
            BtnNewStyle:"",
            tabs:[]
        };
    },
    components:{
        tabButton
    },
    methods: {
       initBar()
       {
         const tabs=this.$slots.tabPages;
         console.log(this.$slots.tabPages);
         if(!tabs) throw new Error("tabPageBar不能为空");
         for (let i = 0; i < tabs.length; i++) {
                
                const tabtype=tabs[i].tag.split('-').slice(-1);
                if(tabtype!='tabPage')
                {
                    throw new Error("tabPageBar不能直接包含除tabPage以外的插件");
                }
                console.log(tabs[i].data.key);
            } 
            
           //按钮初始数量
            const BtnsDefalut=4;
            //按钮数量
            const BtnsNumber=tabs.length;
            const BtnScale=BtnsDefalut/BtnsNumber;
            const BtnWidth='width:'+(19.5)*(BtnScale)+"vw";
            const BtnMarginLeft='margin-left:'+(0.5)*BtnScale+"vw";
            this.BtnNewStyle=BtnWidth+';'+BtnMarginLeft;
            this.tabs=tabs;
       }
    },
    mounted(){
      this.initBar();
    }
}
</script>