// ukey_address.js
import provinces from './provinces.js'

// 区域市区
let cityAreas = []
// 最小区域数组
let subareas = []
// 最小区域id
let subRegionCode = null
let regionCodeFlag = true  // 默认加载区
// ukey 地址默认加载
export function ukeyAddressDefault (data) {
    if(!data) return
    let html = data.message + '<a class="see" href="' + data.url + '" target="_blank">查看</a>'
    $('#ukey_promot').html(html)
    // ukey 地址
    $('#ukey-address').removeClass('none')
    subRegionCode = data.region_codes[2]
    renderAreas('#ukey_province', '#ukey_area', 'provinces', 'prov', data.region_codes[0])
    renderAreas('#ukey_city', '#ukey_area', data.region_codes[0], 'city', data.region_codes[1])
    // 收货人
    $('#ukey_consignee').val(data.agent)
    // 手机号
    $('#ukey_tel').val(data.agent_mobile)
    // 详细地址
    $('#ukey_address').val(data.address)
}

    //ukey--区域选择
	$('#ukey_province').change(function() {
	    let id = $(this).val()
	    // 默认显示区
	    regionCodeFlag = true
	    renderAreas('#ukey_city', '#ukey_area', id, 'city')
	})
	$('#ukey_city').change(function() {
	    let id = $(this).val()
	    $.each(cityAreas, function(i, item) {
	        if(item.region_code == id) {
	            subareas = item.subareas
	        }
	    })
	    if(subareas){
	        renderSubAreas('#ukey_area')
	    }
	})
 
    //渲染地址
    let renderAreas = (dom, districtDom, parentId, type, sel) => {
        /*
        @params 说明
        ***
        dom 需要render 的dom对象 prov 、city
        districtDom 需要render的 dom对象区域对象 如district
        parentId 初始化省份id
        type     省份或市区类型
        sel      查找选中项目 可以不传 不传默认undefined
        */
        loadAreas(parentId, (err, areas) => {
            if(err) {
                return 
            }
            let elem = ''
            for(let i = 0; i < areas.length; i++) {
                if(sel == areas[i].region_code) {
                    if(type == 'city') {
                        subareas = areas[i].subareas
                    }
                    elem += '<option value="' + areas[i].region_code + '" selected="selected">' + areas[i].name + '</option>'
                } else {
                    elem += '<option value="' + areas[i].region_code + '">' + areas[i].name + '</option>'
                }
            }
            if(type == 'city') {
                cityAreas = areas
                if(regionCodeFlag) {
                    regionCodeFlag = false
                }
            }
            $(dom).html(elem)
            if(subareas) {
                renderSubAreas(districtDom)
            }
        })
    }

    function renderSubAreas (districtDom) {
        var elem = ''
        if(subareas.length > 0) {
            for(let i = 0; i < subareas.length; i++) {
                if(subRegionCode == subareas[i].region_code) {
                    elem += '<option value="' + subareas[i].region_code + '" selected="selected">' + subareas[i].name + '</option>'
                }else{
                    elem += '<option value="' + subareas[i].region_code + '">' + subareas[i].name + '</option>'
                }
            }
            $(districtDom).html(elem)
        }
    }
    
    //加载地址
    let loadAreas = (id, cb) => {
        if(id == 'provinces') {
            cb(null, provinces)
        }else{
            $.ajax({
                url: '/static/area/'+ id +'.json',
                type: 'GET',
                dataType: 'json'
            }).done(resp => {
                cb(null, resp)
            }).fail(err => {
                if(err.status == 500) {
                    layer.msg('服务器500报错！')
                    return false
                }
                cb(err, null)
            })
        }
    }
    
    $('input, select').on('blur',function(){
        if($(this).val().trim()){
            $(this).removeAttr('style')
        }else{
            $(this).css('border-color', 'red')
        }
    })
    
    export function ukeyBeforeAjax() {
      var flag = true
      if(!$('#ukey_consignee').val().trim()) {
         $('#ukey_consignee').css('border-color', 'red')
         flag = false
      }
      if(!$('#ukey_tel').val().trim()) {
         $('#ukey_tel').css('border-color', 'red')
         flag = false
      }
      if(!$('#ukey_address').val().trim()) {
         $('#ukey_address').css('border-color', 'red')
         flag = false
      }
      if(!flag) {
        layer.msg('请填写红框标出的内容！')
      }else {
        if(!/^1(3|4|5|7|8)\d{9}$/.test($('#ukey_tel').val().trim())) {
            layer.msg('请填写正确的手机号')
            $('#ukey_tel').css('border-color', 'red')
            flag = false
            return flag
        }else {
            flag = true
            return flag
        }
      }
    }



