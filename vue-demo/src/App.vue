<template>
  <div id="app">
    <!-- 当前vue定义注册 -->
    <first-component></first-component>
    <!--单独vue定义-->
    <!-- 1 单独vue定义,定义name
    2 App.vue中import引入
    3 component属性中注册
    4 页面中以标签的形式引入 -->
    <secondcomponent></secondcomponent>
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
  import Vue from 'vue'  //已经通过npm install形式安装,即被添加到了项目依赖中,可通过es6的语法引入
  import VueRouter from 'vue-router'
  import secondcomponent from '@/components/Secondcomponent'

  Vue.use(VueRouter)

  export default {
    name: 'App',
    data(){
      return{
        msg:'你好啊'
      }
    },
    // 注册
    components:{secondcomponent}
  }

  Vue.component('first-component',{
    template:"<h1>我是第一个组件</h1>"
  })

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
