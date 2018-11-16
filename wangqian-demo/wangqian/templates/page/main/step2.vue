<template>
   <div>我是组建2
    </div>
</template>

<script>
    import { eventBus } from './eventBus'
    export default {
        name: "stepTwo",
        data: function(){
            let self = this;
            return {
                a: 1,
            }
        },
        props: ['changeNameOrRange'],//监听父组建
        watch: {
            changeNameOrRange: function(){
                if(this.changeNameOrRange == '1'){

                }
            }
        },
        mounted: {},
        methods: {
            // 子组件向父组件通信   
            testClick: function(){
                this.$emit('childEvent');//子组件可以通过$emit触发父组件的自定义事件

                this.$emit('changeAge',this.age);
            },
            changeStepOne: function(){
                eventBus.$emit('send',2)//触发 组件1里的send事件
            }
        }
        
    }

</script>