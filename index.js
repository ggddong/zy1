$(function(){
	var $li = $('.header li').has('.node');
	console.log($li);
	$li.children().stop().slideUp(0);
	$li.hover(function(){
		$(this).children().stop().slideDown(0);
	},function(){
		$(this).children().stop().slideUp(0);
	})


	// 平滑翻页
	
	//bug快速点击时翻页不正常,解决方法为即使多次点击，但在翻页过程中不理会，可以加一个判断
	var flag = false;//是否正在翻页，默认没有

	

	var $container = $('.imgs');
	var $list = $('.list');
	var $button = $('.button button');
	var $btn = $('.btn');
	var $prevL = $('.btn1');
	var $prevR = $('.btn2');
	var index = 0;//当前下标

	//bug2点击过快后翻页的大小于号会变蓝，解决方法为用图片代替符号或取消选中的默认事件
	$btn.on("selectstart", function () { return false; });

	//自动翻页
	var intervalId = setInterval(function(){
		nextPage(true);
	},3000)

	//鼠标移入清除计时器去后出现翻页按钮，移出重建隐藏
	$container.hover(function(){
		clearInterval(intervalId);
		$btn.css('display','block');
	},function(){
		intervalId = setInterval(function(){
			nextPage(true);
		},3000)
		$btn.css('display','none');
	})

	//点击向右或向左的图标实现平滑翻页
	$prevR.click(function(){
		if(!flag){//不正在翻页，可以翻
			nextPage(true);//向右
		}
	})
	$prevL.click(function(){
		if(!flag){//不正在翻页，可以翻
			nextPage(false);//向左
		}
		/*if($list.position().left >= 0){
			$list.css('left',-3000);
		}*/
		//教训，详情见下面注释
	})

	//点击原点自动翻页
	$button.click(function(){
		var nextPoint = $(this).index();
		if(index != nextPoint){
			nextPage(nextPoint);
		}
	})

	function nextPage(next){
		flag = true;//正在翻页
		var currLeft = $list.position().left;
		var allnext = 0;//总共要翻多少像素
		var offset = 0;//每次翻多少像素
		if(typeof(next) == 'boolean'){//为boolean
			allnext = next?-600:600;
		}else{//为数值型
			allnext = (index - next)*600;//往后翻为负值,所有正常翻要加负号，因此用index - next
		}
		offset = allnext/20;
		var i = 0;
		var timer = setInterval(function(){
			currLeft += offset;
			$list.css('left',currLeft);
			i++;
			if(currLeft <= -3599){//千万注意要加到这，因为setInterval是并行处理的，一开始加到点击事件中死活不对，因为点击事件中的先改变，但timer还没处理完
				//所有又会被改回去。
				$list.css('left',-600);
			}
			if(currLeft >= -1){//因为他是100的滚动的，设1容错，因为浮点数本身就不准
				$list.css('left',-3000);
			}
			if(i == 20){
				clearInterval(timer);
				updatePoints(next);
				flag = false;//翻完了
			}
		},15)
	}

	function updatePoints(next){
		var nextindex = 0;
		if(typeof(next) == 'boolean'){
			if(next){
				nextindex = (index + 1)%5;
			}
			else{
				nextindex = (index + 4 )%5;
			}
		}else{
			nextindex = next;
		}
		//移除当前原点的class
		$button.eq(index).removeClass('btn-check');
		//给下一个原点添加对象
		$button.eq(nextindex).addClass('btn-check');
		index = nextindex;
	}

})