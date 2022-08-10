//{{2022.08.07.debugger_enable
let g_debugger_enable = false;
//}}

let gscr = null;
let g_config = null;

//삼각형 클래스
let g_trg = null;


function main(){
	init_scs();
	init_bg();		
	
	//테스트 점
	window.point_test = new cPoint(gscr, 0,0,'T',false,null);	
	window.point_test.init();		
	
	//let A_xy = {x:   1,  	y:1};
	//let B_xy = {x:	 2.5,	y:1.5};
	//
	//let C_xy = {x:	 2, 	y:2};		
	////let C_xy = {x:	 2, 	y:0};		

	//let A_xy = {x:   1,  	y:1};
	//let B_xy = {x:	 3,	    y:2};
	//let C_xy = {x:	 2, 	y:3};		
	
	let A_xy = {x:   1,  	y:1};
	//let B_xy = {x:	 2,	    y:0};
	let B_xy = {x:	 3,	    y:1};
	let C_xy = {x:	 2, 	y:2};			
	
	//let A_xy = {x:   1,  	y:1};
	//let B_xy = {x:	 1,	    y:3};
	//let C_xy = {x:	 0, 	y:2};			
	

	g_trg = new cTriangle(gscr,A_xy.x,A_xy.y,B_xy.x,B_xy.y,C_xy.x,C_xy.y);
	
	//{{debug
	let str = '';
	str += '08:49 ';
	str += '<br>';
	str += 'scr size:' + String(g_config.platform.width) + ' x ' + String(g_config.platform.height);
	str += '<BR>';
	str += 'devicePixelRatio: ' + String(window.devicePixelRatio) ;
		
	info_update(str);	
	//}}debug
	
	window.scrollTo(0, 0);
}	

function init_scs(){

	//{{2022.07.22 디버그 관련 정보들
	let my_debug_info = [
			{h1:'mouse move'		, h2:'pageX / touches[0].pageX'             			 , id:'debug_pageX'},
			{h1:'mobile 마우스포인터',h2:'pageX - offsetLeft / touches[0].pageX - offsetLeft', id:'debug_scr_xy'},
			{h1:'데탑 마우스포인터'	, h2:'offsetX'  , id:'debug_offsetX'},
			{h1:'          '		, h2:'ViewBox XY',id:'debug_vb_xy'},
			{h1:'          '		, h2:'Cartesian', id:'debug_ct'},
			{h1:'offsetLeft'		, h2:''        	, id:'debug_offsetLeft'},
			{h1:'offsetTop' 		, h2:''        	, id:'debug_offsetTop'},
			{h1:'Mobile'    		, h2:''        	, id:'debug_mobile'},
			{h1:'Portrait'  		, h2:''        	, id:'debug_portrait'},
			{h1:'가로x세로' 		, h2:'window.innerWidth', id:'debug_broswer_WH'},
			{h1:'가로x세로' 		, h2:'SCR' 		, id:'debug_SCR_WH'},
			{h1:'가로x세로' 		, h2:'viewbox' 	, id:'debug_viewbox_WH'},
			{h1:'가로x세로' 		, h2:'window.screen', id:'debug_win_scr_WH'},
			{h1:'platform_ratio' 	, h2:'' 		, id:'debug_platform_ratio'},
			{h1:'Grid간격' 			, h2:'' 		, id:'debug_grid'},
			{h1:'devicePixelRatio'	, h2:'window' 	, id:'debug_devicePixelRatio'},
			{h1:'broswer'   		, h2:''        	, id:'debug_broswer'}
			];
	//}}		

	
	//해당 페이지에서 이용하는 세팅
	let env_config={
		div_ID:'sw',

		width:490,
		height:400,
		
		//Debug
		debug:true,
		debug_info:my_debug_info,
		
		//
		pixelsPerOne:100,	//1은 몇 pixel인가
		
		//Grid 
		Xaxis_grid_size:1,		//ctcs기준(ctcs에서, 1unit마다 grid를 그린다)
		Yaxis_grid_size:1,		//ctcs기준 
		
		scale:0,
		
		//origin_mode:ORIGIN_USERDEFINED,	//-> 이거해선, origin_x,origin_y 세팅해줘야함
		//origin_mode:ORIGIN_CENTER,	//origin_x,origin_y 세팅 불필요
		//origin_mode:ORIGIN_QUAD1,	//1사분면
		//}}{{
		origin_mode: scSCRconst['ORIGIN_QUAD1'],		
		//}}
		origin_x:0,
		origin_y:400,		
		
		////////////////////////////////////////////////
		//
		//	이 부분은 자동화 시켜야 함
		//
		mobile_ratio:2,
		
		mobile_flag:false, //이걸 세팅하면 , mobile_width/mobile_height를 이용해서 svg 크기를 만듬		
		mobile_width:400,
		mobile_height:400
		
	}
	
	//반응영역의 크기(desktop기준)
	//{{2022.08.07->ctcs기준으로 값이 변경되어야 함
	//let scr_config={
	//	point_hitarea_radius: 0.25,
	//	//point_hitarea_radius: 0.5,
	//	
	//	///////////////////////////////////////
	//	point_r:4,	//점의 크기
	//	point_symbol_font_size:15,
	//	point_symbol_delta_r:15,	//point symbol - 점이름은 점에서 얼마나 떨어진 거리에 표시되는가
	//	
	//	len_symbol_font_size:15,
	//
	//	//'stroke-dasharray','10 2');
	//	len_arc_stroke_dash1:5,
	//	len_arc_stroke_dash2:1,
	//
	//	//'stroke-width','2');		
	//	len_arc_stroke_width:1,
	//	
	//	arc_symbol_font_size:15,
	//	
	//	line_stroke_width:2
	//	
	//}
	//}}{{
	let scr_config={
		point_hitarea_radius: 0.4
	}		
	//}}
	
	////////////////////////////////////////////////////////////////////
	
	
	//g_config = new cConfig(env_config,scStyleDefault);	//scr_config는 안넣어도됨
	g_config = new cConfig(env_config,scStyleDefault,scr_config);	
	
	gscr = new cSCR();
	gscr.init( g_config );
	
	
}

function init_bg(){
	
	return;
	////////////////////////////////////////////////////////////////////
	
	let bg_layer = gscr.get_layer('Background');	
	

	//<circle id='ccc' cx='200' cy='200' r='100' class='bg_gray' />
	
	let vb_xy = gscr.ctcs2vbcs(0,0);	
	let R_vb  = gscr.get_scr_xy(1,0);
	
	let bg_circle = document.createElementNS(gscr.const['SVG_NS'],'circle')
	bg_circle.setAttribute('class','bg_gray');
	bg_circle.setAttribute('cx',vb_xy.x);
	bg_circle.setAttribute('cy',vb_xy.y);		
	bg_circle.setAttribute('r',R_vb.x);
	bg_layer.appendChild(bg_circle);	

}


function call_back_________________(){}


//debug info 찍기
function info_update(p_text){
	document.getElementById('info').innerHTML = p_text;
}

