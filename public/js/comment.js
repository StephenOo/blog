$(function(){
	//评论提交按钮
	$("#messageBtn").click(function(){
		if(!$("#messageContent").val()){
			alert("评论内容不能为空");
			return;
		}
		$.ajax({
			type: "post",
			url: "/api/comment/post",
			data: {
				//文章id
				contentid: $("#contentid").val(),
				//评论内容
				content: $("#messageContent").val()
			},
			success: function(resData){
				if(!resData.code){
					
					$("#messageContent").val("");
					//通过传输过来的数据，加载评论
					renderComment(resData.data.comments);
				}
			}
		})
	})
	function renderComment(comments){
		var html = "";
		comments.reverse(); //逆序 
		for(var i = 0; i < comments.length; i++){
			html += `<div class="messageBox">
                <p class="name clear">
                    <span class="fl">${comments[i].username}</span>
                    <span class="fr">${comments[i].postTime}</span>
                </p>
                <p>${comments[i].content}</p>
            </div>`
		}
		$(".messageList").html(html);
	}
})












