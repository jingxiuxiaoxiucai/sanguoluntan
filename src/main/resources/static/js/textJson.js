
function textJson() {
    var comContext="测试json";
    var comId=88;
    var conName="马帅";
    $.get("commentTest",{comContext:comContext,comId:comId,comName:conName},function (data) {
        console.log(data);
        alert(data.comContext);

    });
}