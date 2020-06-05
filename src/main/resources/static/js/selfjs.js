//判断是否可以领取
function HasXunZhang(e) {
    var id=$(e).attr("id");
    var isHasGet=id.split("-")[0];//判断是否可以获取这个勋章
    var xzId=id.split("-")[1];//判断是否可以获取这个勋章
    if(isHasGet=='false'){
        alert("你当前不符合领取条件，请继续加油吧");
        return false;
    }
    if(isHasGet=='true'){
        var mesText=$(e).text();
        if(mesText=='已领取'){
            alert("你已经领取过该勋章，继续加油领取其他勋章吧！");
            return false;
        }
        if(mesText=='未领取'){
            $.get("/getXZ",{"xzId":xzId},function (data) {
                console.log(data)
                alert("领取成功，继续加油！");
                window.location.reload();
            });
        }
    }
}


//点击勋章回显模态框
function getXunzhang(e) {
    var id=$(e).attr("id");
    var xunzhangId=id.split("-")[1];
    var isGetXunzhang=id.split("-")[2];
    $.get("/getXunzhangMes",{"xunzhangId":xunzhangId,"isGetXunzhang":isGetXunzhang},function (data) {
        $("#badgeName").text(data.xunZhang.name);
      $("#getHasCount").text("已经有："+data.getCount+'人获取')
        $("#xunImage").attr('src',data.xunZhang.images);
      $("#jindu_show").css("width",data.jindu+'%');
        $("#jindu_show").text(data.jindu+'%');
        $("#btnName").val(data.btnName);
        $("#btnName").text(data.btnName);
      $("#badgeInfo").text(data.tishiMes);
        $(".getXZ").text(data.btnName);
      $(".getXZ").attr("id",data.isHasXunzhang+'-'+data.xunZhang.id);//判断是否符合领取条件.并且绑定当前勋章id
    });

}



//点击关注
function otherGuanzhu(e) {
    var bozhuId=$(e).attr("id");
    var mes=$(e).val();
    $.get("/NewGuanZhu",{"boZhuId":bozhuId,"judegGuanzhu":mes},function (data) {
        if(data.mes=='已关注'){
            //说明是从未关注到已经关注
            $(e).val("已关注");
            $(e).removeClass("btn btn-danger glyphicon glyphicon-plus");
            $(e).addClass("btn btn-success glyphicon glyphicon-ok");
        }
        if(data.mes=='未关注'){
            //从没从已关注到未关注
            $(e).val("未关注");
            $(e).removeClass("btn btn-success glyphicon glyphicon-ok");
            $(e).addClass("btn btn-danger glyphicon glyphicon-plus");

        }
        console.log(data);
    });

}


//点击更换胸章
function updateChengwei(e) {
    var id=$(e).attr("id");
    //获取勋章id
    var xunzhangId=id.split("-")[0];
    var userId=id.split("-")[1];
    var currentUserId=id.split("-")[2];
    if(userId!=currentUserId){
        return false;
    }
    $.get("/updateChengWei",{"xunzhangId":xunzhangId,"currentUserId":currentUserId},function (date) {
        $("#newChenwei").text('称谓：'+date);
        console.log(date)

    });
    //如果当前资料是本人就允许修改


}


function profileGuanzhu(e) {

    var bozhuId=$(e).attr("id");
    console.log(bozhuId);
}

//删除自己的评论
function delComment(e) {
    if(confirm("确定要删除这个评论吗？与之相关的评论都会删除")){
        var commentId=$(e).attr("id");

        $.get("/delComments",{"commentId":commentId},function (data) {
            console.log(data);
            window.location.reload()
        });
    }
}

//点击加好友
function  addfriend(e) {
    var frienId=$(e).attr("id");
    $.get("/addFriends",{"frienId":frienId},function (data) {

        if(data.satues=='yes'){
            alert("已经添加过该好友");
            return false;
        }else if(data.satues=='no'){
            console.log("添加成功")
            $(e).text("已经发送请求");
        }
    });
}

//对好友申请的判断
function isAgreenFriend(e) {
    var frienId=$(e).attr("id");
    var chioce=$(e).val();
    console.log("请求人的id:"+frienId);
    $.get("/isAgree",{"frienId":frienId,"chioce":chioce},function (data) {
        $("#showMyFriends").hide();
    });

}