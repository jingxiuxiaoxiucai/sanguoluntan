
var commentId=0;

//点击收藏事情
function SaveQueiosns(e) {
    var quesionId=$(e).attr("id");
    $.get("/savequesion",{"quesionId":quesionId},function (data) {
        if(data.codes=='noLogin'){
            $("#mes").text("");
            $("#mes").text("没有登录，不可收藏");
            return;
        }
        if(data.codes=='isSave'){
            $("#mes").text("");
            $("#mes").text("你已经收藏该博客，如果取消请去收藏中心操作");
            return;
        }
        if(data.codes=='succes'){
            $("#mes").text("");
            $("#likeCount").text("");
            $("#likeCount").prepend(data.likeCount);
            $("#"+quesionId+"").css({ "color": "red" });

        }
        //根据返回的结果判断用户是不是已经收藏
        console.log(data);
    });
}


//d点击获取到字评论信息11---根据点击的字评论id去数据库拉去信息
function openSonComment(e) {

    var fatherId = e.getAttribute("data-id");//父评论的id
    var commentid = $("#comment-" + fatherId);
    commentId = fatherId;
    // commentid.toggleClass("in");//收缩评论
    //获取二级评论状态
    var collapse = e.getAttribute("data-collapse");
    if (collapse) {
        commentid.removeClass("in");
        e.removeAttribute("data-collapse")
        e.classList.remove("comments1")
    } else {
        //如果当前元素内有其他子元素就不把这个增加进去
        if ($("#comment-" + fatherId).children().length != 1) {
            //展开二级评论，拉取数据
            commentid.addClass("in");
            e.setAttribute("data-collapse", "in");  //设置二级评论状态
            e.classList.add("comments1")
            // console.log("父评论的id:"+fatherId);
            //发送请求
        } else {
            //展开二级评论，拉取数据
            commentid.addClass("in");
            e.setAttribute("data-collapse", "in");  //设置二级评论状态
            e.classList.add("comments1")
            // console.log("父评论的id:"+fatherId);
            publicComment(fatherId);
        }

    }
}

    //封装的ajax,
    function publicComment(fatherId) {
        $.get("/getCommentSon", {"fatherId": fatherId}, function (data) {
            console.log(data)
            var commentSons = data.commentsSonDtos;
            if (commentSons.length != 0) {
                for (var i = 0; i < commentSons.length; i++) {
                    $("#comment-" + fatherId).prepend("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 comment_section emptyCometnSon'>" +
                        "<div class='media'>" +
                        "<div class='media-right'>" +
                        "<a href='#'><img style='height: 50px;width: 50px;' src="+commentSons[i].users.avatarUrl+" class='media-object img-rounded'></a>" +
                        "</div>" +
                        "<div class='media-body'><h5 class='media-heading'>用户:" + commentSons[i].users.name + "</h5>" +
                        "回覆内容：" + commentSons[i].content + "<div class='meum'>" +
                        " <span class='pull-right'>"+moment(commentSons[i].gmt_create).calendar()+"</span></div></div></div>" +
                        "</div>");
                }

            }
        });
    }

    //回复子评论
    function commentSons(e) {
        var quesion_id=$("#quesionid").val();//文章的id
        var commentIds=e.getAttribute("data-id");//父评论的id
        var son_content=$("#input-"+commentIds).val();
        if(!son_content){
            alert("请输入内容·在回复");
            return;
        }
        $.ajax({
            type:"POST",
            url:"/commentSon",
            contentType:"application/json",
            data:JSON.stringify({
                "quesion_id":quesion_id,
                "content":son_content,
                "father_id":commentIds
            }),
            success:function (reponse) {
                console.log("shul"+reponse);
                //更新当前的父评论的二级评论的数量
                $("#CommentSonCount-"+commentIds).empty();
                $("#CommentSonCount-"+commentIds).prepend(reponse.listArry[2]);
             //   $("#comment-" + commentIds).prepend  一定要在指定的父类元素后追加这个文本，不然回复的将会覆盖是下面所有评论
              $("#comment-" + commentIds).prepend("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 comment_section emptyCometnSon'>" +
                    "<div class='media'>" +
                    "<div class='media-right'>" +
                    "<a href='#'><img style='height: 50px;width: 50px;' src='"+reponse.listArry[1].avatarUrl+"' class='media-object img-rounded'></a>" +
                    "</div>" +
                    "<div class='media-body'><h5 class='media-heading'>用户:" +reponse.listArry[1].name+ "</h5>" +
                    "回覆内容：" +reponse.listArry[0].content + "<div class='meum'>" +
                    " <span class='pull-right'>"+moment(reponse.listArry[0].gmt_create).calendar() +"</span></div></div></div>" +
                    "</div>");
            },
            dataType:"json"
        });


    }



//提交评论
    function postComment() {
        var quesionid = $("#quesionid").val();//文章的id
        var commetn_content = $("#comment_content").val();//回复内容
        if (!commetn_content) {
            alert("内容不可以为空");
            return;
        }
        $.ajax({
            type: "POST",
            url: "/comments",
            contentType: "application/json",
            data: JSON.stringify({
                "parent_id": quesionid,
                "type": 1,
                "content": commetn_content
            }),
            success: function (reponse) {
                //{code: 200, message: "请求成功"}
                if (reponse.code == 200) {
                    /* $("#comment_text").hide();*/
                    //涮新当前页面
                    window.location.reload();
                } else {
                    if (reponse.code == 203) {
                        var isAccepted = confirm(reponse.message);
                        if (isAccepted) {
                            window.open("https://github.com/login/oauth/authorize?client_id=2ab2e1078934decb1a73&redirect_uri=http://localhost:8087/callbacks&scope=user&state=1")
                            window.localStorage.setItem("closeble", true);
                        }

                    } else {
                        alert(reponse.message);
                    }

                }
            },
            dataType: "json"
        });
    }

    //提交点赞的事件
    function  clickfsUp(e) {
        var quesionid=$("#quesionid").val();//文章的id
        var commentFatherid=$(e).attr("id");//这里获取到是fsUp-19;要拆分
        var fatherId=commentFatherid.split("-")[1];
        //判断当前点击class是点赞还是消除赞）
       var judge= $("#fsUp-"+fatherId).hasClass('judge-fs');
        console.log(judge)
       //为true就是代表存在这个元素
      if(judge){
          //这是点击取消点赞的操作
          $("#fsUp-"+fatherId).removeClass("span-open");
          $("#fsUp-"+fatherId).removeClass("judge-fs");
          $("#fsUp-"+fatherId).addClass("span-close");
          var type="up";//up是点赞加。down是点赞-
          var type_son=0;//这是+1操作
          ajax_fabulous(fatherId,type,type_son,quesionid);
      }else{
        //点击点赞操作
          $("#fsUp-"+fatherId).removeClass("span-close");
          $("#fsUp-"+fatherId).addClass("judge-fs");
          $("#fsUp-"+fatherId).addClass("span-open");
          var type="up";//up是点赞加。down是点赞-
          var type_son=1;//这是+1操作
          ajax_fabulous(fatherId,type,type_son,quesionid);
          //将当前的点赞数回显示在页面

      }


    }
    //提交点赞减1事件
    function clickfsDown(e) {
        var quesionid=$("#quesionid").val();//文章的id
        var commentFatherid=$(e).attr("id");//这里获取到是fsUp-19;要拆分
        var fatherId=commentFatherid.split("-")[1];
        var judge= $("#fsDown-"+fatherId).hasClass('judge-fs');
        if(judge){
            //这是点击取消点赞的操作
            $("#fsDown-"+fatherId).removeClass("span-open");
            $("#fsDown-"+fatherId).removeClass("judge-fs");
            $("#fsDown-"+fatherId).addClass("span-close");
            var type="down";//up是点赞加。down是点赞-
            var type_son=0;//这是+1操作
            ajax_fabulous(fatherId,type,type_son,quesionid);
        }else{
            //点击点赞操作
            $("#fsDown-"+fatherId).removeClass("span-close");
            $("#fsDown-"+fatherId).addClass("judge-fs");
            $("#fsDown-"+fatherId).addClass("span-open");
            var type="down";//up是点赞加。down是点赞-
            var type_son=1;//这是+1操作
            ajax_fabulous(fatherId,type,type_son,quesionid);
            //将当前的点赞数回显示在页面
        }
    }

    //点赞的ajax
function ajax_fabulous(fatherId,type,type_son,quesionid) {
    $.get("/Fabulous", {"fatherId": fatherId,"type":type,"type_son":type_son,"quesionid":quesionid}, function (data) {
        console.log(data)
        if(data.code==2004){
            alert("登录厚才可以进行点赞操作");
            return;
        }
        //用户已经登录
        if(data.code==2005){
            if(data.stause=="up"){
                $("#FabulousUp-"+fatherId).empty();
                $("#FabulousUp-"+fatherId).prepend(data.countfabulou);
            }
            if(data.stause=="down"){
                $("#FabulousDown-"+fatherId).empty();
                $("#FabulousDown-"+fatherId).prepend(data.countfabulou);
            }

        }
    });
}

//动态选择标签
function  selectTags(e) {
    var value=e.getAttribute("data-tags");
    var previous=$("#tag").val();
    //存在就不添加
    if(previous.split(",").indexOf(value)==-1){
        if(previous){
            $("#tag").val(previous+","+value);
        }else{
            $("#tag").val(value);
        }
    }
}
//点击展示的标签库
function showttSelecttag() {
    $("select_tag").show();//展示
}