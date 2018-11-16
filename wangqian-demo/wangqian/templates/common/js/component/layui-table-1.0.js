// layui-table-1.0.js
$(function(){
    let csrftoken = ''
    try {
        csrftoken = document.cookie.match(/csrftoken=\w+/g)[0].replace(/csrftoken=/, '')
    }catch(err) {
        console.log('err', err)
    }
    $.extend(
        {
            commonTableData: function() {
                return {
                    limit: 25,
                    limits: [25],
                    page: true,
                    text: {
                        none: '无数据'
                    },
                    // even: true,
                    loading: true,
                    headers: {
                        'X-CSRFTOKEN': csrftoken
                    },
                    request: {
                        limitName: 'page_size'
                    },
                    response: {
                        statusName: 'code',
                        statusCode: 200,
                        countName: 'count',
                        dataName: 'results'
                    }
                }
            }
        }
    )
})
