<template>
   <div>我是组建一
       <div class="contentBlock clearfix">
            <div class="detBlock clearfix">
                <div class="leftTitle">	
                    企业地址：<i>*</i>
                </div>
                <div class="rightBlock">
                    <!-- 省市区vue渲染 -->
                    <select class="provincesSelect" v-model="proSelected" v-on:change="choosePro( proSelected, $event)" >
                        <option v-for="pro in provinces" :value="pro.region_code">{{pro.name}}</option>
                    </select>
                    <select class="citysSelect" v-model="citySelected" v-on:change="chooseCity( citySelected)">
                        <option v-for="city in citys" :value="city.region_code">{{city.name}}</option>
                    </select>
                    <select class="areasSelect" v-model="areaSelected" v-on:change="chooseArea( areaSelected)">
                        <option v-for="area in areas" :value="area.region_code">{{area.name}}</option>
                    </select> 
                    <br>
                    <div class="instructText">
                        <textarea name="" class="info_address" placeholder="请输入详细地址，并确保与营业执照保持一致" v-model="postData['enterprise']['address']"></textarea>
                    </div>
                </div>
            </div>
		</div>

   </div>
</template>

<script>
    import "./step1.less"
    import provinces from '../../commom/js/provinces.js'
    import {axiosRequest} from '../../common/js/component/axios-1.0.js'
    import { eventBus } from './eventBus'
    export default {
        name: "stepOne",
        data: function(){
            let self = this;
            return {
                a: 1,

                proSelected: '',
                citySelected: '',
                areaSelected: '',
                provinces: provinces,
                citys: [],
                areas: []
            }
        },
        props: ['changeNameOrRange'],//监听父组建
        watch: {
            changeNameOrRange: function(){
                if(this.changeNameOrRange == '1'){

                }
            }
        },
        mounted(){
            var self = this;
           eventBus.$on('send', data =>{
               self.name = data;
           })

        //    eventBus.$on('send', () =>{
        //        self.name = 'aaa';
        //    })
        },
        methods: {
            // 子组件向父组件通信   
            testClick: function(){
                this.$emit('childEvent');//子组件可以通过$emit触发父组件的自定义事件

                this.$emit('changeAge',this.age);
            },


            // 省市区---begin
            choosePro: function(selected, event){
                let self = this;
                let params = {
                    url: '/static/area/' + selected + '.json'
                }
                // 拿着选择的省  去请求市
                axiosRequest(params).then((res) => {
                    self.citys = res;
                    self.citySelected = self.citys[0].region_code;
                    self.areas = self.citys[0].subareas;
                    self.areaSelected = self.areas[0].region_code;
                }).catch((err) => {
                })
            },
            chooseCity: function(selected) {
                // 选择市  改变相对应的区
                for(var i in this.citys){	
                    let item = this.citys[i]
                    if(item.region_code == selected) {
                        this.areas = item.subareas;
                        this.areaSelected = this.areas[0].region_code;
                        break;
                    }
                }
            },
            chooseArea: function(selected) {
			    this.areaSelected = selected;
			    this.postData['enterprise']['region_code'] = selected;
            },
            defautlRenderAreas: function() {
                //  默认北京/市辖区/东城区
                let self = this
                let params = {
                    url: '/static/area/11000000.json'
                }
                axiosRequest(params).then((res) => {
                    self.proSelected = 11000000
                    self.citys = res
                    self.citySelected = self.citys[0].region_code
                    self.areas = self.citys[0].subareas
                    self.areaSelected = self.areas[0].region_code
                }).catch((err) => {

                })
            },
            againRenderAreas: function(region_codes) {
                // 比如湖南/长沙/开福区 对应region_codes = ["43000000", "43010000", "43010500"]
                let self = this
                let params = {
                    url: '/static/area/' + region_codes[0] + '.json'
                }
                axiosRequest(params).then((res) => {
                    self.proSelected = region_codes[0];
                    self.citys = res;
                    var index=0;
                    for(let i=0;i<res.length;i++)
                    {
                        if(res[i].region_code==region_codes[1])
                        {
                            index=i;
                            break;
                        }
                    }
                    self.citySelected = region_codes[1];
                    self.areas =res[index].subareas;
                    self.areaSelected = region_codes[2];
                }).catch((err) => {

                })
            },
            //---finish
        }
        
    }

</script>