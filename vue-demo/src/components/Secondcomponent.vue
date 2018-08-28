<template>
    <div id="secondcomponent">
        <h3>{{h1Text}}</h3>
    </div>
</template>

<script>
    export default {
        // 定义 组件名称
        name:'secondcomponent',
        data(){
            return {
                h1Text:"我是第二个组件"
            }
        }
    }
</script>

<style>
    #secondcomponent  h3{
            color:red;
    }
</style>