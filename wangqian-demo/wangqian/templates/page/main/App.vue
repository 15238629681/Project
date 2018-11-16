<template>
    <div id="app">
        <!-- (1)子组建 使用 父组建的变量changeNameOrRange -->
        <!--(2) childEvent 子组建向父组件传递的自定义事件  changeName执行的事件 -->
        <step-one v-show="name=='true'" :changeNameOrRange="changeNameOrRange" @childEvent = "changeName" v-on:changeAge="changeAge($event)"></step-one>
        <!-- 这种通信的前提是 组件一的dom元素在父组件中是存在的 应该使用v-show而不是v-if -->

    </div>
</template>

<script>
    import stepOne from './step1.vue'
    import stepTwo from './step2'

    export default {
       name: 'App',
       data: function() {
           return {
               a: 1
           }
       },
       components: {  //引入的组建列表
           stepOne
       },
       methods: {
           changeName: function(){
               this.name = '我就是改个名字';
           },
           chageAge: function(parm){
               this.age = parm;
           }
       }
        
    }

</script>