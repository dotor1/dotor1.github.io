
//class c_config{
class cConfig{
	///////////////////////////////////////////////////////////////////
	//                                                               //
	//		Pre-condition                                            //
	//                                                               //
	
	const = null;	//constant dictionary
	
	env_config = null;
	
	default_scr_config  = null;

	scr_config_initial_ctcs = null;	//유저가 정의한 config	
	
	
	seStyle = {};	//screen element design
	
	LayerSet = {};
	ToolHitareaSet = {};
	
	CF_ctcs2vbcs = 0;

	Xaxis_grid_size_vbcs = 0;
	Yaxis_grid_size_vbcs = 0;
	
	Xaxis_grid_size_ctcs = 0;
	Yaxis_grid_size_ctcs = 0;
	
	vbcs_scale_factor_initial = 0; //scr object에서 사용
	
	scr_Ox_initial  = 0;
	scr_Oy_initial  = 0;	
	
	div_HtmlElmt_ID = '';
	div_HtmlElmt = null;

	///////////////////////////////////////////////////////////////////
	//                                                               //
	//		control                                                  //
	//                                                               //
	platform = null;

	scr_width  = 0;
	scr_height = 0;
	
	platform_ratio = 0;

	debug_flag = false;		//이름이 debug_flag면 좋겠음	
	
	debug_info = null;
	
	method__________________________(){}
	
	constructor(p_env_config, p_default_scr_config , p_scr_config = {}){	//p_scr_config은 입력을 안 할수 있도록 해야함
		//constant class 정의하기
		this.const = scSCRconst;
		
		this.env_config = p_env_config;
		
		this.default_scr_config  = p_default_scr_config ;
		
		this.scr_config_initial_ctcs = p_scr_config;

		//{{debug. dictionary iteration하는 방법
		//for (const [key, value] of Object.entries(p_scr_config)) {
		//  console.log(key, value);
		//}		
		////debugger;
		////p_scr_config['point_hitarea_radius']	
		//}}
		
		this.init();	
		this.init_scr_design();	//svg element 디자인 <-내가 노리는 지역
		this.init_scr();	//레이어 만들고 붙이기
		this.init_debug();	//{{2022.07.22 - debug info table 만들기
	}
	

	init(){
		//platform 관련
		this.platform = new cPlatform();
		
		this.debug_flag = this.env_config.debug;		//debug flag	
		this.debug_info = this.env_config.debug_info;	//debug table info
		
		this.div_HtmlElmt_ID = this.env_config.div_ID;
		
		if( this.platform.desktop ){
			this.platform_ratio = 1;
		}
		else{
			this.platform_ratio = this.env_config.mobile_ratio; //mobile기기 기종에 따라서, 결국 달라져야 하는 것은 ratio임
		}
		
		//I/F 
		// _ct_x_pixels, _ct_y_pixels : note.#856
		if( this.platform.desktop ){
			this.CF_ctcs2vbcs = this.env_config.pixelsPerOne;	
		}
		else{
			this.CF_ctcs2vbcs = this.env_config.pixelsPerOne * this.platform_ratio;	//android,iOS,tablet에서는 ratio로 조정을 하기로 함(기기별 설정 필요)
		}
		
		this.Xaxis_grid_size_vbcs = parseInt(this.CF_ctcs2vbcs * this.env_config.Xaxis_grid_size);	//gridSize 기준은 ctcs(env config는 전부 ctcs를 기준으로 함)
		this.Yaxis_grid_size_vbcs = parseInt(this.CF_ctcs2vbcs * this.env_config.Yaxis_grid_size);					
		
		//위에서 parseInt를 하기때문에 이 값을 직접 계산할 수 없음.vbcs는 소수값으로 grid를 세팅하기 좀 그래서.
		this.Xaxis_grid_size_ctcs = this.Xaxis_grid_size_vbcs / this.CF_ctcs2vbcs;
		this.Yaxis_grid_size_ctcs = this.Yaxis_grid_size_vbcs / this.CF_ctcs2vbcs;
		
		this.vbcs_scale_factor_initial = this.env_config.scale;		
		
		if( this.platform.desktop ){
			this.scr_width  = this.env_config.width;
			this.scr_height = this.env_config.height;
		}
		else{
			this.scr_width  = this.env_config.width  * this.platform_ratio;
			this.scr_height = this.env_config.height * this.platform_ratio;						
		}
		
		if( this.env_config.origin_mode == this.const['ORIGIN_USERDEFINED']){	//원점 수동세팅
			this.scr_Ox_initial = this.env_config.origin_x;
			this.scr_Oy_initial = this.env_config.origin_y;
		}
		else if( this.env_config.origin_mode == this.const['ORIGIN_CENTER']){	//원점은 화면중심
			this.scr_Ox_initial = this.scr_width  / 2;
			this.scr_Oy_initial = this.scr_height / 2;							
		}
		else if( this.env_config.origin_mode == this.const['ORIGIN_QUAD1']){	//원점을 1사분면기준으로
			this.scr_Ox_initial = 0;
			this.scr_Oy_initial = this.scr_height;			
		}

	}	
	

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	init_scr(){
		//div element - root		
		this.div_HtmlElmt = document.getElementById( this.div_HtmlElmt_ID );
		this.div_HtmlElmt.setAttribute('style','background:transparent;');	
		
		//svg element - beneath root div element 
		let svg_ID = this.div_HtmlElmt_ID + '_svg';
		
		this.LayerSet['SVG'] = document.createElementNS(this.const['SVG_NS'],'svg');			
		this.LayerSet['SVG'].setAttribute('id' , svg_ID);	
		this.LayerSet['SVG'].setAttribute('xmlns' , this.const['SVG_NS']);	//namespace 	
		
		//{{
		this.LayerSet['SVG'].setAttribute('width' , this.scr_width  );	
		this.LayerSet['SVG'].setAttribute('height', this.scr_height );		
		//}}{{
		//this.LayerSet['SVG'].setAttribute('width' , '900px'  );		
		//this.LayerSet['SVG'].setAttribute('height', '400px' );		
		//}}
		
		this.div_HtmlElmt.appendChild(this.LayerSet['SVG']);		
		
		//Layers
		//{{2022.08.14
		this.LayerSet['Logo']                     = this.layer_attach('Layer_Logo'                     , ''                );	//Logo			
		//}}		
		this.LayerSet['Grid']                     = this.layer_attach('Layer_Grid'                     , 'c_grid'          );	//grid
		this.LayerSet['Axis']                     = this.layer_attach('Layer_Axis'                     , 'c_axis'          );	//axis
		this.LayerSet['Line_Length_Arc']          = this.layer_attach('Layer_Line_Length_Arc'          , 'bg_len_arc'      );	//length_arc 	
		this.LayerSet['Angle']                    = this.layer_attach('Layer_Angle'                    , 'c_angle'         );	//angle 		
		this.LayerSet['Background']               = this.layer_attach('Layer_Background'               , 'c_bg'            );	//bg
		this.LayerSet['Angle_Symbol']             = this.layer_attach('Layer_Angle_Symbol'             , 'c_angle_symbol'  );	//angle_symbol
		this.LayerSet['Line_Symbol']              = this.layer_attach('Layer_Line_Symbol'              , 'c_angle_symbol'  );	//length_symbol		
		this.LayerSet['Line']                     = this.layer_attach('Layer_Line'                     , 'c_path'          );	//path
		this.LayerSet['Line_Equal_Length_Symbol'] = this.layer_attach('Layer_Line_Equal_Length_Symbol' , 'bg_len_feature'  );	//length feature : 이등변삼각형에서 각도 동일할 때, 선분위로 세로선 그음 	
		this.LayerSet['Point_Symbol']             = this.layer_attach('Layer_Point_Symbol'             , 'c_symbol'        );	//point symbol : 점 이름	
		this.LayerSet['Point']                    = this.layer_attach('Layer_Point'                    , 'c_points'        );	//layer - 점		
		this.LayerSet['Hitarea']                  = this.layer_attach('Layer_Hitarea'                  , 'c_point_hit_area');	//hit_area				
		this.LayerSet['Tools']                    = this.layer_attach('Layer_Tools'                    , 'c_tools'         );	//tools			
		//Layers
		//{{2022.08.14
		this.LayerSet['Copyright']                = this.layer_attach('Layer_Copyright'                , ''                );	//DotoryLab
		//}}		
		
		////////////////////////////////////////////////////////////////
		//LayerSet['Tools_Scale'] - layer_tools 밑에 달림 
		this.LayerSet['Tools_Scale'] = document.createElementNS(this.const['SVG_NS'],'g');	//scale 
		this.LayerSet['Tools_Scale'].setAttribute('transform','scale(' + String(1) + ')' );			
		this.LayerSet['Tools'].appendChild(this.LayerSet['Tools_Scale']);			
		
		//Toolbar - magnet - xls.#toolbar 
		this.reg_magnet_icon( this.LayerSet['Tools_Scale'] );	// 자석 아이콘 등록
		this.ToolHitareaSet['Magnet'] = this.tool_hitarea_attach(5);
		
		//Toolbar - Grid
		this.reg_grid_icon( this.LayerSet['Tools_Scale'] );
		this.ToolHitareaSet['Grid'] =  this.tool_hitarea_attach(40);	
		
		//Toolbar - Pan(손바닥)- move view 
		this.ToolHitareaSet['Pan'] =  this.tool_hitarea_attach(75);		//+35
		
		//Toolbar - Screenshot - note.#868
		this.ToolHitareaSet['ScreenShot'] =  this.tool_hitarea_attach(110);	//+35
		
		////////////////////////////////////////////////////////////////
		//X축
		this.LayerSet['X_axis'] = document.createElementNS(this.const['SVG_NS'],'line');
		this.LayerSet['X_axis'].setAttribute('id',this.div_HtmlElmt_ID + '_X_axis');	
		this.LayerSet['Axis'].appendChild(this.LayerSet['X_axis']);	
		
		//Y축
		this.LayerSet['Y_axis'] = document.createElementNS(this.const['SVG_NS'],'line');
		this.LayerSet['Y_axis'].setAttribute('id',this.div_HtmlElmt_ID + '_Y_axis');	
		this.LayerSet['Axis'].appendChild(this.LayerSet['Y_axis']);		

		////////////////////////////////////////////////////////////////
		//	Vertical Grid
		this.LayerSet['Vertical_Grid'] = document.createElementNS(this.const['SVG_NS'],'g');
		this.LayerSet['Vertical_Grid'].setAttribute('id',this.LayerSet['Grid'].id + '_vertical');	
		this.LayerSet['Grid'].appendChild( this.LayerSet['Vertical_Grid'] );	
		
		//	Horizontal Grid
		this.LayerSet['Horizontal_Grid'] = document.createElementNS(this.const['SVG_NS'],'g');
		this.LayerSet['Horizontal_Grid'].setAttribute('id', this.LayerSet['Grid'].id + '_horizontal' );
		this.LayerSet['Grid'].appendChild( this.LayerSet['Horizontal_Grid'] );
	}	
	

	//{{2022.08.08 - note.#858
	//init_scr_design_debug(){
	init_scr_design(){
		//this.seStyle[p_key] = this.length_ctcs2vbcs( scStyleDefault[p_key] );
		//this.seStyle[p_key] = this.length_ctcs2vbcs( this.default_scr_config[p_key] );		

		for (const [key, value] of Object.entries(this.default_scr_config)) {
			//console.log(`${key}: ${value}`);
			
			//검색 
			let entry = this.scr_config_initial_ctcs[key];	//user-defined initialization rule set 
			
			if( typeof entry === 'undefined' ){	
				//검색 실패 -> default setting 등록
				this.seStyle[key] = this.length_ctcs2vbcs( this.default_scr_config[key] );
			}
			else{
				//검색 성공 -> 검색결과 등록 
				this.seStyle[key] = parseInt( this.length_ctcs2vbcs(entry) );
			}			
		}
		
	}
	//}}2022.08.08	
	
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//{{2022.07.22 - debug info table 만들기
	init_debug(){
		if( this.debug_flag && this.debug_info.length>0 ){	
			//div
			let div = document.createElement('div');
			div.setAttribute('id' , 'div_debug');	
			
			//table 
			let tb = document.createElement('table');
			div.appendChild(tb);
			
			for( let i=0; i< this.debug_info.length; i++){
				let tr = document.createElement('tr');				
				
				//1st column ; 'h1'에서 'h'는 heading이라는 의미를 부여
				let h1 = document.createElement('td');	
				let h1_txt = document.createTextNode( this.debug_info[i].h1);
				h1.appendChild(h1_txt);
				tr.appendChild(h1);	
				
				//2nd column
				let h2 = document.createElement('td');
				let h2_txt = document.createTextNode( this.debug_info[i].h2);
				h2.appendChild(h2_txt);
				tr.appendChild(h2);				
				
				//3rd column
				let h3 = document.createElement('td');
				
				let p = document.createElement('p');
				p.setAttribute('id' , this.debug_info[i].id );	 
				h3.appendChild(p);
				
				tr.appendChild(h3);
				
				//
				tb.appendChild(tr);
				//console.log( this.debug_info[i].id) ; 
			}
			
			//div(svg용) 바로 뒤에다가 debug div를 단다.
			if( this.div_HtmlElmt.nextElementSibling ){	
				//뒤에 다른 형제가 있을 경우, 그놈 앞에
				this.div_HtmlElmt.parentElement.insertBefore(div,this.div_HtmlElmt.nextElementSibling );		
			}
			else{	
				//뒤에 형제가 없다면,, 유일하거나 가장 마지막이라는 의미이므로, 그냥 젤 뒤에 달면 된다.
				this.div_HtmlElmt.parentElement.appendChild(div);
			}
		}
		
	}
	//}}debug - 2022.07.22 - debug info table 만들기		
	
	
	get_broswer_info(){
		let broswer_info = 'appCodeName: ' + navigator.appCodeName + '<br>' + 
			'appName: ' 	  + navigator.appName + '<br>' + 
			'appVersion: ' 	  + navigator.appVersion + '<br>' + 
			'cookieEnabled: ' + navigator.cookieEnabled + '<br>' + 
			'platform: ' 	  + navigator.platform + '<br>' + 
			'userAgent: ' 	  + navigator.userAgent;
		return broswer_info;
	}
	
	//{{2022.08.10 - note.859
	get_div_offset_position(){
		
		//div name이 html page내에 있는지 validation 하는 것이 먼저 필요 
		return {
			x : document.getElementById( this.div_HtmlElmt_ID ).offsetLeft,
			y : document.getElementById( this.div_HtmlElmt_ID ).offsetTop
		};
	}
	//}}
	
	//{{2022.08.07
	length_ctcs2vbcs(p_len){
		let len = p_len * this.CF_ctcs2vbcs;
		return len;
	}	
	//}}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	layer_attach(p_id , p_class){
		let layer_obj = document.createElementNS(this.const['SVG_NS'],'g');

		layer_obj.setAttribute('id',this.div_HtmlElmt_ID + '_' + p_id);
		
		if( p_class !== ''){
			layer_obj.setAttribute('class',p_class);
		}
		
		this.LayerSet['SVG'].appendChild(layer_obj);				
		
		return layer_obj;
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	tool_hitarea_attach(p_y){
		let hit_area = document.createElementNS(this.const['SVG_NS'],'g');
		hit_area.setAttribute('transform','translate(5,' + String(p_y) + ')');	
		this.LayerSet['Tools_Scale'].appendChild(hit_area);	
		
		let tool = document.createElementNS(this.const['SVG_NS'],'rect');
		tool.setAttribute('fill-opacity','0.5');	//fill-opacity:	0;
		tool.setAttribute('x','0');
		tool.setAttribute('y','0');
		tool.setAttribute('width','30');
		tool.setAttribute('height','30');	
		hit_area.appendChild( tool );

		return tool;
	}
	
	
	reg_magnet_icon(p_parent){
		let icon_magnet = document.createElementNS(this.const['SVG_NS'],'g');
		icon_magnet.setAttribute('transform','translate(5,5)');
		p_parent.appendChild(icon_magnet);
		
		let magnet_icon = document.createElementNS(this.const['SVG_NS'],'path');	
		
		let str = 'M 4 15 V 26 H 10 V 15 A 5 5 0 0 1 15 10 V 4 A 11 11 0 0 0 4 15';
		magnet_icon.setAttribute('d',str);
		magnet_icon.setAttribute('stroke','black');
		magnet_icon.setAttribute('fill','red');
		icon_magnet.appendChild(magnet_icon);
		
		let magnet_icon2 = document.createElementNS(this.const['SVG_NS'],'path');
		str = 'M 15 4 A 11 11 0 0 1 26 15 V 26 H 20 V15 A 5 5 0 0 0 15 10';
		magnet_icon2.setAttribute('d',str);
		magnet_icon2.setAttribute('stroke','black');
		magnet_icon2.setAttribute('fill','blue');
		icon_magnet.appendChild(magnet_icon2);
	}
	
	reg_grid_icon(p_parent){
		let icon_grid = document.createElementNS(this.const['SVG_NS'],'g');
		icon_grid.setAttribute('transform','translate(5,40)');
		p_parent.appendChild(icon_grid);
		
		let grid_icon = document.createElementNS(this.const['SVG_NS'],'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(8));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(8));
		
		icon_grid.appendChild(grid_icon);		
		
		grid_icon = document.createElementNS(this.const['SVG_NS'],'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(15));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(15));
		icon_grid.appendChild(grid_icon);		
		
		grid_icon = document.createElementNS(this.const['SVG_NS'],'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(22));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(22));
		icon_grid.appendChild(grid_icon);	
		
		grid_icon = document.createElementNS(this.const['SVG_NS'],'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(8));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(8));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);	
		
		grid_icon = document.createElementNS(this.const['SVG_NS'],'line');	
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(15));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(15));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);
		
		grid_icon = document.createElementNS(this.const['SVG_NS'],'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(22));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(22));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);
	}		
	
}


////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

class cPlatform{
	width 	= 0;
	height 	= 0;
	
	mobile 	= false;
	desktop = false;
	
	portrait  = false;	//mobile에서만 의미있음
	landscape = false;	//mobile에서만 의미있음
	
	constructor(){
		
		this.mobile = navigator.userAgentData.mobile;
		this.desktop = !this.mobile;
		
		if(this.desktop){
			this.width  = window.innerWidth;
			this.height = window.innerHeight;
		}
		else if( this.mobile ){
			//{{2022.08.11.잘됨
			//this.width  = window.screen.width;
			//this.height = window.screen.height;			
			//}}{{
			this.width  = window.innerWidth;
			this.height = window.innerHeight;
			//}}
			
			if( this.height > this.landscape ){
				this.portrait  = true;
				this.landscape = false;
			}
			else{
				this.portrait  = false;
				this.landscape = true;				
			}
		}
	}
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

//	unit : vbcs
class scStyleDefault{
	static point_hitarea_radius   = 0.5;
	static point_radius           = 0.04;
	static point_symbol_delta     = 0.15;
	
	static line_stroke_width      = 0.02;
	
	//static line_length_arc_margin = 0.1;	//note.851
	static line_length_arc_margin = 0.2;	//note.851
	
	static line_arc_stroke_dash1  = 0.05;
	static line_arc_stroke_dash2  = 0.01;
	
	static line_arc_stroke_width  = 0.01;
	
	//단위: px -> scale factor 0에서 유효한 값(scale:1)
	static point_symbol_font_size = 0.15;
	static line_symbol_font_size  = 0.15;
	static angle_symbol_font_size = 0.15;
	
	static angle_radius           = 0.3;	//angle의 반지름        ( 중심: 각의 중심점 )
	static angle_symbol_radius    = 0.4;	//angle symbol의 반지름 ( 중심: 각의 중심점 )
	
}


////////////////////////////////////////////////////////
