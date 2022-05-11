////////////////////////////////////////////////////////

const SVG_NS = 'http://www.w3.org/2000/svg';

const ORIGIN_USERDEFINED = 0;
const ORIGIN_CENTER = 1;
const ORIGIN_QUAD1  = 2;

class c_scr_ox{
	_element_name = '';
	_element = null;
	
	_element_width  = 0;	
	_element_height = 0;

	_Ox = 0;	//원점O의 scr상 x좌표
	_Oy = 0;	//원점O의 scr상 y좌표	
	
	//화면 확대 축소용
	_vb_scale_factor = 0;
	
	//display상에서... vb = viewBox
	_vb_scale_x = 1.0;
	_vb_scale_y = 1.0;

	//_vb_scale_x = 0.5;
	//_vb_scale_y = 0.5;


	_vb_scale_x_delta = 1.0;
	_vb_scale_y_delta = 1.0;
	
	_vb_width  = 0;
	_vb_height = 0;
	
	_vb_x_min = 0;
	_vb_x_max = 0;
	
	_vb_y_min = 0;
	_vb_y_max = 0;
	
	_vb_curr_oX = 0;
	_vb_curr_oY = 0;

	_vb_curr_oX_delta = 0;
	_vb_curr_oY_delta = 0;
	
	_vb_x_grid_size = 100;	//input parameter로...
	_vb_y_grid_size = 100;
	
	_vb_str = '';	//internal
	
	//카타시안
	_ct_x_min = 0;
	_ct_x_max = 0;
	
	_ct_y_min = 0;
	_ct_y_max = 0;
	
	//좌표 상에서 1은 몇pixel인가?
	_ct_x_pixels = 100;	//조정 가능해야함(customizing section)
	_ct_y_pixels = 100;	//조정 가능해야함(customizing section)
	
	
	//grid 
	grid_garo = [];
	grid_sero = [];	
	
	//
	layer_grid = null;
	layer_axis = null;
	X_axis = null;
	Y_axis = null;
	
	layer_hit_area = null;
	
	layer_bg		= null;
	
	layer_length_arc = null;
	layer_length_feature = null;
	
	layer_angle 	= null; 	//angle layer
	layer_path 		= null;		//선 레이어
	layer_points 	= null;
	
	layer_angle_symbol = null;
	layer_length_symbol = null;
	
	layer_symbol = null;	//점 이름	
	
	layer_tools = null;
	layer_tools_scale = null;
	tool_magnet = null;
	
	//{{
	layer_tools_grid_translate = null;
	tool_grid = null;
	//}}
	
	
	//Event
	wheel_ing = false;	//wheel을 누르고 drag하는 중이면 true, 휠을 누르기 시작하면 true, 휠을 때면 false
	
	mouse_valid = false;	//mouse pointer가 svg위에 올라와 있으면 true
	
	drag_ing = false;
	drag_obj = null;
	
	mouse_pointer_x_bias = 7;	//마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
	mouse_pointer_y_bias = 7;	//마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
	
	magnetic_mode = false;
	//magnetic_mode = true;
	
	grid_mode = true;
	
	debug_cnt = 0;
	
	platform = null;
	
	//{{drag object를 이용하면 됨 - 불필요
	//touch_obj = null;
	//}}
	
	conf = null;
	
	constructor(){
	}
	
	init2(p_config){
		this.conf = p_config;
		
		//		
		this.conf.e_div = document.getElementById( this.conf.inpt_div_name );
		this.conf.e_div.setAttribute('style','background:transparent;');	
		
		//
		this.conf.e_svg = document.createElementNS(SVG_NS,'svg');		
		this.conf.e_svg.setAttribute('xmlns' , SVG_NS);	//namespace 		
		this.conf.e_svg.setAttribute('width' , this.conf.inpt_width  );	
		this.conf.e_svg.setAttribute('height', this.conf.inpt_height );	
		this.conf.e_div.appendChild(this.conf.e_svg);
		
		debugger;
		
		////
		//if( this.platform.desktop){	
		//	this._element_width  = p_width;
		//	this._element_height = p_height;
		//}
		//else{
		//	this._element_width  = 2*p_width;
		//	this._element_height = 2*p_height;			
		//}
		//
		//this._element.setAttribute('width',this._element_width);
		//this._element.setAttribute('height',this._element_height);		
		////
		
		//this._element_name = p_name;
		//this._element = document.getElementById(p_name);
		//
		//this.layer_grid = document.createElementNS(SVG_NS,'g');		
		//	
		//this._element.setAttribute('xmlns',SVG_NS);	//namespace 		
		
		debugger;
			
		//this._element.setAttribute('xmlns',SVG_NS);	//namespace 		
		
	}
	
	//init(p_name){
	init(p_name, 
		p_width, 			//가로크기
		p_height, 			//세로크기
		p_pixelsPerOne, 	//좌표계에서 1은, 화면상 몇 픽셀인가
		p_gridSize,			//그리드 크기 : 좌표계상에서의 얼마의 값인가?
		p_scale,			//스케일 
		p_origin_mode,
		p_origin_x,
		p_origin_y){
		
		
		
		//
		this.platform = new c_platform();

		///////////////////////////////
		if( this.platform.desktop){
			this._ct_x_pixels = p_pixelsPerOne;
			this._ct_y_pixels = p_pixelsPerOne;
		}
		else{
			//this._ct_x_pixels = 2*p_pixelsPerOne;
			//this._ct_y_pixels = 2*p_pixelsPerOne;			
			this._ct_x_pixels = p_pixelsPerOne;
			this._ct_y_pixels = p_pixelsPerOne;			
		}
		
		this._vb_x_grid_size = parseInt(this._ct_x_pixels * p_gridSize);
		this._vb_y_grid_size = parseInt(this._ct_y_pixels * p_gridSize);
		
		//console.log('grid x 사이즈 : ', this._vb_x_grid_size);
		//console.log('grid y 사이즈 : ', this._vb_y_grid_size);
		//debugger;
		
		//p_gridSize

		//this._vb_scale_x = p_scale;
		//this._vb_scale_y = p_scale;
		this._vb_scale_x = Math.pow(2,p_scale);
		this._vb_scale_y = Math.pow(2,p_scale);		
		//this._vb_scale_y = 0.25;
		//this._vb_scale_x = 0.25;

		
		///////////////////////////////
		
		this._element_name = p_name;
		this._element = document.getElementById(p_name);
			
		this._element.setAttribute('xmlns',SVG_NS);	//namespace 
		
		//{{
		//this._element_width  = parseInt(this._element.getAttribute('width'));
		//this._element_height = parseInt(this._element.getAttribute('height'));
		//}}{{
			
		if( this.platform.desktop){	
			this._element_width  = p_width;
			this._element_height = p_height;
		}
		else{
			//this._element_width  = 2*p_width;
			//this._element_height = 2*p_height;			
			this._element_width  = p_width;
			this._element_height = p_height;			
		}
		
		this._element.setAttribute('width',this._element_width);
		this._element.setAttribute('height',this._element_height);

		//{{
		//this._Ox = this._element_width / 2;
		//this._Oy = this._element_height / 2;
		//}}{{
		this._Ox = 0;
		this._Oy = 0;
		//}}

		
		if( p_origin_mode == ORIGIN_USERDEFINED){	//원점 수동세팅
			this._vb_curr_oX = p_origin_x;
			this._vb_curr_oY = p_origin_y;						
		}
		else if( p_origin_mode == ORIGIN_CENTER){	//원점은 화면중심
			//{{
			//this._vb_curr_oX = this._Ox;
			//this._vb_curr_oY = this._Oy;			
			//}}{{
			this._vb_curr_oX = this._element_width / 2;
			this._vb_curr_oY = this._element_height / 2;				
			//}}
			
		}
		else if( p_origin_mode == ORIGIN_QUAD1){	//원점을 1사분면기준으로
			this._vb_curr_oX = 0;
			this._vb_curr_oY = this._element_height;					
		}
		//}}
		
		


		//layer 달기
		this.layer_grid = document.createElementNS(SVG_NS,'g');
		this.layer_grid.setAttribute('id','my_grid');
		this.layer_grid.setAttribute('class','c_grid');
		this._element.appendChild(this.layer_grid);

		this.layer_axis = document.createElementNS(SVG_NS,'g');
		this.layer_axis.setAttribute('id','axis');
		this.layer_axis.setAttribute('class','c_axis');
		this._element.appendChild(this.layer_axis);
		
		//this.layer_length_arc = document.createElementNS(SVG_NS,'g');
		//this.layer_length_arc.setAttribute('id','my_length_arc');
		//this.layer_length_arc.setAttribute('class','c_angle');
		//this._element.appendChild(this.layer_length_arc);				
		
		//{{
		this.layer_length_arc = document.createElementNS(SVG_NS,'g');
		this.layer_length_arc.setAttribute('id','my_length_arc');
		this.layer_length_arc.setAttribute('class','bg_len_arc');
		this._element.appendChild(this.layer_length_arc);		

	
		
		//}}		
		
		this.layer_angle = document.createElementNS(SVG_NS,'g');
		this.layer_angle.setAttribute('id','my_angle');
		this.layer_angle.setAttribute('class','c_angle');
		this._element.appendChild(this.layer_angle);		
		
		this.layer_bg = document.createElementNS(SVG_NS,'g');
		this.layer_bg.setAttribute('id','my_bg');
		this.layer_bg.setAttribute('class','c_bg');
		this._element.appendChild(this.layer_bg);				
		
		this.layer_angle_symbol = document.createElementNS(SVG_NS,'g');
		this.layer_angle_symbol.setAttribute('id','my_angle_symbol');
		this.layer_angle_symbol.setAttribute('class','c_angle_symbol');
		this._element.appendChild(this.layer_angle_symbol);						
		
		this.layer_length_symbol = document.createElementNS(SVG_NS,'g');
		this.layer_length_symbol.setAttribute('id','my_length_symbol');
		this.layer_length_symbol.setAttribute('class','c_angle_symbol');
		this._element.appendChild(this.layer_length_symbol);								
		
		this.layer_path = document.createElementNS(SVG_NS,'g');
		this.layer_path.setAttribute('id','my_path');
		this.layer_path.setAttribute('class','c_path');
		this._element.appendChild(this.layer_path);
		
		this.layer_length_feature = document.createElementNS(SVG_NS,'g');
		this.layer_length_feature.setAttribute('id','my_length_feature');
		this.layer_length_feature.setAttribute('class','bg_len_feature');
		this._element.appendChild(this.layer_length_feature);			
		
		this.layer_symbol = document.createElementNS(SVG_NS,'g');	//symbol: 점이름
		this.layer_symbol.setAttribute('id','my_symbol');
		this.layer_symbol.setAttribute('class','c_symbol');
		this._element.appendChild(this.layer_symbol);		
		
		this.layer_points = document.createElementNS(SVG_NS,'g');
		this.layer_points.setAttribute('id','my_points');
		this.layer_points.setAttribute('class','c_points');
		this._element.appendChild(this.layer_points);		
		
		this.layer_hit_area = document.createElementNS(SVG_NS,'g');
		this.layer_hit_area.setAttribute('id','my_hit_area');
		this.layer_hit_area.setAttribute('class','c_point_hit_area');
		this._element.appendChild(this.layer_hit_area);




		//{{tools layer
		this.layer_tools = document.createElementNS(SVG_NS,'g');
		this.layer_tools.setAttribute('id','my_tools');
		this.layer_tools.setAttribute('class','c_tools');
		this._element.appendChild(this.layer_tools);		
		
		this.layer_tools_scale = document.createElementNS(SVG_NS,'g');	//scale 
		
		if( this.platform.desktop ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );		
		}
		else if( this.platform.mobile ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(2*this._vb_scale_x) + ')' );		
		}
		this.layer_tools.appendChild(this.layer_tools_scale);				
		
		//magnet
		this.reg_magnet_icon( this.layer_tools_scale );	// 자석 아이콘 등록
				
		let icon_magnet_hit = document.createElementNS(SVG_NS,'g');
		icon_magnet_hit.setAttribute('transform','translate(5,5)');
		this.layer_tools_scale.appendChild(icon_magnet_hit);				
		
		this.tool_magnet = document.createElementNS(SVG_NS,'rect');
		this.tool_magnet.setAttribute('fill-opacity','0.5');	//fill-opacity:	0;
		this.tool_magnet.setAttribute('x','0');
		this.tool_magnet.setAttribute('y','0');
		this.tool_magnet.setAttribute('width','30');
		this.tool_magnet.setAttribute('height','30');	
		//this.layer_tools.appendChild( this.tool_magnet );
		//this.layer_tools_scale.appendChild( this.tool_magnet );
		icon_magnet_hit.appendChild( this.tool_magnet );
		
		this.tool_magnet.addEventListener('click', (e)=>this.el_magnet_click(e) );
		//}}
		
		//{{grid
		this.reg_grid_icon( this.layer_tools_scale );
		
		this.layer_tools_grid_translate = document.createElementNS(SVG_NS,'g');
		this.layer_tools_grid_translate.setAttribute('transform','translate(5,40)');
		//this.layer_tools.appendChild(this.layer_tools_grid_translate);
		this.layer_tools_scale.appendChild(this.layer_tools_grid_translate); 
		
		this.tool_grid = document.createElementNS(SVG_NS,'rect');
		this.tool_grid.setAttribute('fill-opacity','0.2');	//fill-opacity:	0;
		this.tool_grid.setAttribute('x','0');
		this.tool_grid.setAttribute('y','0');
		this.tool_grid.setAttribute('width','30');
		this.tool_grid.setAttribute('height','30');	
		this.layer_tools_grid_translate.appendChild( this.tool_grid );
		
		this.tool_grid.addEventListener('click', (e)=>this.el_grid_click(e) );
		//}}
		
		
		//
		this.update_viewbox();
		this.update_grid();

		this.X_axis = document.createElementNS(SVG_NS,'line');
		this.X_axis.setAttribute('id','line1');
		//this.X_axis.setAttribute('x1','0');
		//this.X_axis.setAttribute('y1','200');
		//this.X_axis.setAttribute('x2','400');
		//this.X_axis.setAttribute('y2','200');
		this.X_axis.setAttribute('x1',String(this._vb_x_min));
		//this.X_axis.setAttribute('y1',String(this._vb_curr_oY));
		this.X_axis.setAttribute('y1',String(this._Oy));
		
		//this.X_axis.setAttribute('x2',String(this._vb_x_min+this._vb_width ));
		this.X_axis.setAttribute('x2',String(this._vb_x_max ));
		//this.X_axis.setAttribute('y2',String(this._vb_curr_oY));
		this.X_axis.setAttribute('y2',String(this._Oy));
		this.layer_axis.appendChild(this.X_axis);

		this.Y_axis = document.createElementNS(SVG_NS,'line');
		this.Y_axis.setAttribute('id','line2');
		//this.Y_axis.setAttribute('x1','200');
		//this.Y_axis.setAttribute('y1','0');
		//this.Y_axis.setAttribute('x2','200');
		//this.Y_axis.setAttribute('y2','400');
		//this.Y_axis.setAttribute('x1',String(this._vb_curr_oX));
		this.Y_axis.setAttribute('x1',String(this._Ox));
		this.Y_axis.setAttribute('y1',String(this._vb_y_min));
		//this.Y_axis.setAttribute('x2',String(this._vb_curr_oX));
		this.Y_axis.setAttribute('x2',String(this._Ox));
		this.Y_axis.setAttribute('y2',String(this._vb_y_max));
		this.layer_axis.appendChild(this.Y_axis);		
		
	//  = 0;
	//_vb_height = 0;
	//
	// = 0;

		//event 등록
		this._element.addEventListener('wheel',(e)=>this.el_wheel(e) );	//wheel 확대/축소
		
		this._element.addEventListener('mousedown',(e)=>this.el_mousedown(e) );	//wheel 클릭
		this._element.addEventListener('mouseup',(e)=>this.el_mouseup(e) );		//
		this._element.addEventListener('mousemove',(e)=>this.el_mousemove(e) );	//wheel drag	
		
		//this._element.addEventListener('keypress',(e)=>this.el_keypress(e) );	//spacebar
		window.addEventListener('keypress',(e)=>this.el_keypress(e) );
		
		this._element.addEventListener('mouseleave',(e)=>this.el_mouseleave(e) );	//svg가 mouse pointer가 올라올 때		
		this._element.addEventListener('mouseenter',(e)=>this.el_mouseenter(e) );		
		
		
		//cell phone drag evt
		if( this.platform.mobile ){
			//this._element.addEventListener('touchstart', (e)=>this.el_touchstart(e) ); //'점'에서 touch start
			this._element.addEventListener('touchmove', (e)=>this.el_touchmove(e) );
			this._element.addEventListener('touchend', 	(e)=>this.el_touchend(e)  );
		}
		

		
	}
	
	reg_magnet_icon(p_parent){
		let icon_magnet = document.createElementNS(SVG_NS,'g');
		icon_magnet.setAttribute('transform','translate(5,5)');
		p_parent.appendChild(icon_magnet);
		
		let magnet_icon = document.createElementNS(SVG_NS,'path');
		
		let str = 'M 4 15 V 26 H 10 V 15 A 5 5 0 0 1 15 10 V 4 A 11 11 0 0 0 4 15';
		magnet_icon.setAttribute('d',str);
		magnet_icon.setAttribute('stroke','black');
		magnet_icon.setAttribute('fill','red');
		icon_magnet.appendChild(magnet_icon);
		
		let magnet_icon2 = document.createElementNS(SVG_NS,'path');
		str = 'M 15 4 A 11 11 0 0 1 26 15 V 26 H 20 V15 A 5 5 0 0 0 15 10';
		magnet_icon2.setAttribute('d',str);
		magnet_icon2.setAttribute('stroke','black');
		magnet_icon2.setAttribute('fill','blue');
		icon_magnet.appendChild(magnet_icon2);
	}
	
	reg_grid_icon(p_parent){
		let icon_grid = document.createElementNS(SVG_NS,'g');
		icon_grid.setAttribute('transform','translate(5,40)');
		p_parent.appendChild(icon_grid);
		
		//let grid_icon = document.createElementNS(SVG_NS,'line');
		//grid_icon.setAttribute('stroke','black');
		//grid_icon.setAttribute('stroke-width','5');
		//grid_icon.setAttribute('fill','black');
		////grid_icon.setAttribute('class','bg_red');
		//grid_icon.setAttribute('x1',String(4));
		//grid_icon.setAttribute('y1',String(7));
		//grid_icon.setAttribute('x2',String(26));
		//grid_icon.setAttribute('y2',String(25));
		//icon_grid.appendChild(grid_icon);
		
		//let grid_icon = document.createElementNS(SVG_NS,'rect');
		let grid_icon = document.createElementNS(SVG_NS,'line');
		//grid_icon.setAttribute('stroke','black');
		//grid_icon.setAttribute('stroke-width','2');
		//grid_icon.setAttribute('stroke-opacity','1');
		//grid_icon.setAttribute('fill','yellow');
		grid_icon.setAttribute('class','c_grid_icon');
		//grid_icon.setAttribute('x',String(0));
		//grid_icon.setAttribute('y',String(0));
		//grid_icon.setAttribute('width',String(26));
		//grid_icon.setAttribute('height',String(25));
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(8));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(8));
		
		icon_grid.appendChild(grid_icon);		
		
		//
		grid_icon = document.createElementNS(SVG_NS,'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(15));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(15));
		icon_grid.appendChild(grid_icon);		

		grid_icon = document.createElementNS(SVG_NS,'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(4));
		grid_icon.setAttribute('y1',String(22));
		grid_icon.setAttribute('x2',String(26));
		grid_icon.setAttribute('y2',String(22));
		icon_grid.appendChild(grid_icon);	

		grid_icon = document.createElementNS(SVG_NS,'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(8));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(8));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);	

		grid_icon = document.createElementNS(SVG_NS,'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(15));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(15));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);

		grid_icon = document.createElementNS(SVG_NS,'line');
		grid_icon.setAttribute('class','c_grid_icon');
		grid_icon.setAttribute('x1',String(22));
		grid_icon.setAttribute('y1',String(4));
		grid_icon.setAttribute('x2',String(22));
		grid_icon.setAttribute('y2',String(26));
		icon_grid.appendChild(grid_icon);

	}	
	
	el_magnet_click(){
		//debugger;
		//console.log('here');
		
		if( this.magnetic_mode ){
			this.magnetic_mode = false;
			this.tool_magnet.setAttribute('fill-opacity','0.5');	
			//this.layer_tools.setAttribute('class','c_tools');
			
		}
		else{
			this.magnetic_mode = true;
			this.tool_magnet.setAttribute('fill-opacity','0.2');
			//this.layer_tools.setAttribute('class','c_tools_on');
		}
	}
	
	el_grid_click(){
		if( this.grid_mode ){
			this.grid_mode = false;
			this.tool_grid.setAttribute('fill-opacity','0.5');
			this.layer_grid.setAttribute('visibility','hidden');
			this.layer_axis.setAttribute('visibility','hidden');
		}
		else{
			this.grid_mode = true;
			this.tool_grid.setAttribute('fill-opacity','0.2');
			this.layer_grid.setAttribute('visibility','visible');
			this.layer_axis.setAttribute('visibility','visible');
		}
		
	}
	
	update_axis(){
		this.X_axis.setAttribute('x1',String(this._vb_x_min));
		//this.X_axis.setAttribute('y1',String(this._vb_curr_oY));
		this.X_axis.setAttribute('x2',String(this._vb_x_max ));
		//this.X_axis.setAttribute('y2',String(this._vb_curr_oY));
	
		//this.Y_axis.setAttribute('x1',String(this._vb_curr_oX));
		this.Y_axis.setAttribute('y1',String(this._vb_y_min));
		//this.Y_axis.setAttribute('x2',String(this._vb_curr_oX));
		this.Y_axis.setAttribute('y2',String(this._vb_y_max));		
	}
	
	get_hit_layer(){
		return this.layer_hit_area;
	}
	
	get_points_layer(){
		return this.layer_points;
	}
	
	get_layer_symbol(){
		return this.layer_symbol;
	}
	
	get_layer_path(){
		return this.layer_path;
	}
	
	get_layer_angle(){
		return this.layer_angle;
	}
	
	get_layer_bg(){
		return this.layer_bg;
	}

	get_layer_angle_symbol(){
		return this.layer_angle_symbol;
	}
	
	get_layer_length_symbol(){
		return this.layer_length_symbol;
	}
	
	get_layer_length_arc(){
		return this.layer_length_arc;
	}

	get_layer_length_feature(){
		return this.layer_length_feature;
	}
	
	//event listener
	
	//마우스 포인터가 svg 밖으로 나갔을 때
	el_mouseleave(p_event){
		//console.log('mouse leave');
		this.mouse_valid = false;
		
		//drag중이였으면, 'drag종료처리'
		if( this.drag_ing){
			this.drag_ing = false;
			
			this.drag_obj.cb_mouseup();
			this.drag_obj = null;			
		}
	}
	
	//마우스 포인터의 위치가 svg 위에 있지 않을 때
	el_mouseenter(p_event){
		//console.log('mouse enter');
		this.mouse_valid = true;
	}	
	
	//스페이스바 누르면 화면을 정중앙으로
	el_keypress(p_event){
		//(VALD) 마우스 포인터가 svg 상에 있어야만 keyboard event를 동작시킨다
		if( this.mouse_valid == false){
			return;
		}
		
		//스페이스바에만 반응
		if(p_event.keyCode == 32){	
			//console.log( p_event.keyCode );	//space - 32
			p_event.preventDefault();
			
			this._vb_scale_factor = 0;
			this._vb_scale_x = 1.0;
			this._vb_scale_y = 1.0;		
			
			this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );		
			
			//{{
			//this._vb_curr_oX = this._Ox;
			//this._vb_curr_oY = this._Oy;	
			//}}{{
			this._vb_curr_oX = this._element_width / 2;
			this._vb_curr_oY = this._element_height / 2;	
			//}}

			this.update_viewbox();
			this.update_grid();
			this.update_axis();
		}
	}	


	

	
	////{{각 점에서 touchstart 시작시킴
	//el_touchstart(p_event){
	//	console.log( String(this.debug_cnt++) + '] touch - start' );
	//	//console.log( p_event.target );
	//	
	//	let e_id = p_event.target.getAttribute('id');
	//	//console.log( eid );
	//	
	//	if( e_id == 'ha_A'){
	//		this.touch_obj = g_trg.pA;
	//	}
	//	else if( e_id == 'ha_B'){
	//		this.touch_obj = g_trg.pB;
	//	}
	//	else if( e_id == 'ha_C'){
	//		this.touch_obj = g_trg.pC;
	//	}		
	//	
	//	
	//}		
	////}}
	
	el_mousedown(p_event){
		//wheel을 누른 거에만 반응 
		if(p_event.buttons == 4){
			//console.log('wheel 시작');
			p_event.preventDefault();
			this.wheel_ing = true;
			
			//원점과 떨어진 정도 
			//this._vb_curr_oX_delta = p_event.clientX  - this._vb_curr_oX;
			//this._vb_curr_oY_delta = p_event.clientY - this._vb_curr_oY;			
			this._vb_curr_oX_delta = p_event.offsetX  - this._vb_curr_oX;
			this._vb_curr_oY_delta = p_event.offsetY - this._vb_curr_oY;			
			
			
		}
	}
	

	
	el_mouseup(p_event){
		//{{
		//if( this.wheel_ing ){
		//	//console.log('wheel 끝');
		//	p_event.preventDefault();
		//	this.wheel_ing = false;
		//	
		//	this._vb_curr_oX_delta = 0;
		//	this._vb_curr_oY_delta = 0;
		//}}{{
		if( p_event.which==2 ){
			if( this.wheel_ing ){
				console.log('wheel 끝');
				console.log( p_event.which);
				p_event.preventDefault();
				this.wheel_ing = false;
				
				this._vb_curr_oX_delta = 0;
				this._vb_curr_oY_delta = 0;
			}
		}
		//}}

		
		//{{
		//if( this.drag_ing ){
		//	console.log('ing - the end');
		//	console.log( p_event );
		//	this.drag_ing = false;
		//}
		//}}{{
		
		//drag 중이였을 때, 'drag종료처리'
		if( p_event.which == 1 ){	//when mouse left button clicked
			if( this.drag_ing ){
				//debugger;
				console.log('Drag - the end');
				//console.log( p_event );
				this.drag_ing = false;
				
				this.drag_obj.cb_mouseup();
				this.drag_obj = null;
				
				//this.drag_obj.update_position();
			}		
		}
		
		//}}
		
	}
	
	//{{
	//el_touchend_v1(p_event){
	//	console.log( String(this.debug_cnt++) + '] touch - end' );
	//	this.touch_obj = null;
	//}		
	//}}

	el_touchend(p_event){
		if( this.drag_ing ){
			//debugger;
			console.log( String(this.debug_cnt++) + '] touch - end' );
			//console.log( p_event );
			this.drag_ing = false;
			
			this.drag_obj.cb_mouseup();
			this.drag_obj = null;
			
			//this.drag_obj.update_position();
		}		
			
	}		
	
	
	//}}mouse_pointer_vb_xy2로 변경
	//mouse_pointer_vb_xy(p_evt){
	//	let x = p_evt.clientX - this.mouse_pointer_x_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
	//	let y = p_evt.clientY - this.mouse_pointer_y_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
	//	
	//	let vbxy = this.scr_to_vb(x,y);
	//	
	//	return{
	//		x: vbxy.x,
	//		y: vbxy.y
	//	};
	//	
	//}
	//}}
	
	vb2ct(p_vb_x,p_vb_y){
		let ct_x = (p_vb_x - this._Ox)/this._ct_x_pixels;
		let ct_y = (this._Oy - p_vb_y)/this._ct_y_pixels; 
		
		return{
			x: ct_x,
			y: ct_y
		};
	}
	
	vbx2ctx(p_vb_x){
		return p_vb_x / this._ct_x_pixels; 
	}
	
	ctx2vbx(p_ct_x){
		return p_ct_x * this._ct_x_pixels;
	}
	
	magnetic_grid(p_vb_x,p_vb_y){
		let vb_x = p_vb_x; 
		let vb_y = p_vb_y; 
		
		if( this.magnetic_mode ){
			vb_x = Math.round( vb_x / this._vb_x_grid_size) * this._vb_x_grid_size;
			vb_y = Math.round( vb_y / this._vb_y_grid_size) * this._vb_y_grid_size;			
		}
		
		return{
			x: vb_x,
			y: vb_y
		};		
	}
	
	mouse_pointer_vb_xy2(p_evt){
		//let x = p_evt.clientX - this.mouse_pointer_x_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
		//let y = p_evt.clientY - this.mouse_pointer_y_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴

		let x = p_evt.offsetX - this.mouse_pointer_x_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴
		let y = p_evt.offsetY - this.mouse_pointer_y_bias; //마우스 포인터의 위치가 내 생각보다 7씩 크게 나옴

		
		let vbxy = this.scr_to_vb(x,y);
		
		return{
			x: vbxy.x,
			y: vbxy.y
		};
		
	}	
	
	////{{
	//el_touchmove_v1(p_event){
	//	//console.log('el_touchmove');
	//	
	//	if( this.touch_obj == null){
	//		return;
	//	}
	//	p_event.preventDefault();
	//	
	//	let standard_x = document.getElementById('svg_wrapper').offsetLeft;
	//	let standard_y = document.getElementById('svg_wrapper').offsetTop;
	//	//debugger;
	//	
	//	//let offsetX = p_event.touches[0].pageX - p_event.touches[0].target.offsetLeft;     
	//	//let offsetY = p_event.touches[0].pageY - p_event.touches[0].target.offsetTop;
	//
	//	let offsetX = p_event.touches[0].pageX - standard_x;
	//	let offsetY = p_event.touches[0].pageY - standard_y;
	//	
	//	//
	//	console.log( String(this.debug_cnt++) + ' touch - move : ' , offsetX , ' , ' , offsetY);
	//	//
	//	//debugger;
	//			
	//	let vbxy = this.scr_to_vb(offsetX,offsetY);
	//	
	//	//magnetic grid mode인 경우에는 값을 보정
	//	let vb_magnet = this.magnetic_grid( vbxy.x, vbxy.y);
	//	let vb_x = vb_magnet.x;
	//	let vb_y = vb_magnet.y;		
	//	
	//	let ct_xy = this.vb2ct( vb_x, vb_y );
	//	
	//	//let tmp_obj = g_trg.pC;
	//	this.touch_obj.update_position(vb_x,vb_y,ct_xy.x,ct_xy.y);	
	//}	
	////}}
	
	//el_mousemove와 동일로직
	el_touchmove(p_event){
		if( !this.drag_ing){	//drag_ing : point에서 touchstart하는 시점에 등록시킨다.
			return;
		}
		
		p_event.preventDefault();
		
		
		////console.log('el_touchmove');
		//
		//if( this.touch_obj == null){
		//	return;
		//}
		//p_event.preventDefault();
		
		let standard_x = document.getElementById('svg_wrapper').offsetLeft;
		let standard_y = document.getElementById('svg_wrapper').offsetTop;
		
		//debugger;
		
		//let offsetX = p_event.touches[0].pageX - p_event.touches[0].target.offsetLeft;     
		//let offsetY = p_event.touches[0].pageY - p_event.touches[0].target.offsetTop;

		let offsetX = p_event.touches[0].pageX - standard_x;
		let offsetY = p_event.touches[0].pageY - standard_y;
		
		//
		console.log( String(this.debug_cnt++) + ' touch - move : ' , offsetX , ' , ' , offsetY);
		//
		//debugger;
				
		let vbxy = this.scr_to_vb(offsetX,offsetY);
		
		//magnetic grid mode인 경우에는 값을 보정
		let vb_magnet = this.magnetic_grid( vbxy.x, vbxy.y);
		let vb_x = vb_magnet.x;
		let vb_y = vb_magnet.y;		
		
		let ct_xy = this.vb2ct( vb_x, vb_y );
		
		//let tmp_obj = g_trg.pC;
		//this.touch_obj.update_position(vb_x,vb_y,ct_xy.x,ct_xy.y);	
		this.drag_obj.update_position(vb_x,vb_y,ct_xy.x,ct_xy.y);	
	}		
	
	el_mousemove(p_event){
		//{{debug 
		//info_update(String(this.debug_cnt++) + 'mouse move');
		//}}debug 
		
		//drag 중일 때
		if( this.drag_ing){
			// viewbox x,y <- f(mouse pointer x,y on screen)
			
			//let mouse_xy = this.mouse_pointer_vb_xy(p_event);
			let mouse_xy = this.mouse_pointer_vb_xy2(p_event);
			
			let vb_x = mouse_xy.x;
			let vb_y = mouse_xy.y;
			
			//console.log('vbvb : ', vb_x,vb_y);
			//console.log('vb22 : ', mouse_xy.x , mouse_xy.y);
			
			//magnetic grid mode인 경우에는 값을 보정
			let vb_magnet = this.magnetic_grid( vb_x, vb_y);
			vb_x = vb_magnet.x;
			vb_y = vb_magnet.y;
			
			//ct
			let ct_xy = this.vb2ct( vb_x, vb_y );
			
			//call back
			this.drag_obj.update_position(vb_x,vb_y,ct_xy.x,ct_xy.y);	
		}
		//}}drag_ing
		
		//(VALD)
		if( !this.wheel_ing){
			return;
		}
		
		//(VALD) - 땠는데 제대로 동작 안할 때가 있음
		if(p_event.buttons != 4){
			this.wheel_ing = false;
			this._vb_curr_oX_delta = 0;
			this._vb_curr_oY_delta = 0;			
			return;
		}
		
		
		//console.log('drag 중');
		
		//this._vb_curr_oX = p_event.clientX - this._vb_curr_oX_delta;
		//this._vb_curr_oY = p_event.clientY - this._vb_curr_oY_delta;
		//
		//console.log( 'X: ' ,p_event.clientX , p_event.offsetX , p_event.clientX - p_event.offsetX);
		//console.log( 'Y: ' ,p_event.clientY , p_event.offsetY , p_event.clientY - p_event.offsetY);
		
		this._vb_curr_oX = p_event.offsetX - this._vb_curr_oX_delta;
		this._vb_curr_oY = p_event.offsetY - this._vb_curr_oY_delta;
		
		//this._vb_curr_oX = p_event.clientX ;
		//this._vb_curr_oY = p_event.clientY ;		
		//console.log('curr Ox,Oy : ', this._vb_curr_oX , this._vb_curr_oY);
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();		
	}
	
	//mouse wheeel 돌릴 때 
	
	el_wheel(p_event){
		//(VALD)
		if( this.wheel_ing ){
			return;
		}
		
		//휠 처리
		if( p_event.deltaY <0 ){	//wheel - 위로 올릴 때
			p_event.preventDefault();
			//console.log('<0');
			//console.log('clientX,Y : ',p_event.offsetX,p_event.offsetY);
			
			//this.svg_reduce(p_event.clientX,p_event.clientY);
			this.svg_reduce(p_event.offsetX,p_event.offsetY);
		}
		else if( p_event.deltaY>0){	//wheel - 아래로 내릴 때
				
			p_event.preventDefault();
			//console.log('0<');
			//this.svg_enlarge(p_event.clientX,p_event.clientY);
			this.svg_enlarge(p_event.offsetX,p_event.offsetY);
		}
		
	}	
	
	// viewbox x,y <- f( screen x,y )
	scr_to_vb(p_scr_x,p_scr_y){
		let vb_x = this._vb_scale_x * (p_scr_x - this._vb_curr_oX) + this._Ox;
		let vb_y = this._vb_scale_y * (p_scr_y - this._vb_curr_oY) + this._Oy;		
		
		return {
			x: vb_x,
			y: vb_y
		};
	}
	
	//mouse wheel을 위로 올릴 때 - 축소시켜야 함 
	svg_reduce2(p_scr_x,p_scr_y){
		let vb = this.scr_to_vb(p_scr_x,p_scr_y);
		//console.log('scr : ', p_scr_x,p_scr_y);
		//console.log('vb  : ', vb.x, vb.y);

		let delta_x = (p_scr_x - this._vb_curr_oX) * this._vb_scale_x;
		let delta_y = (p_scr_y - this._vb_curr_oY) * this._vb_scale_y;
		//console.log('delta : ', delta_x, delta_y);
		
		this._vb_scale_x += this._vb_scale_x_delta;
		this._vb_scale_y += this._vb_scale_y_delta;
		//console.log('scale : ', this._vb_scale_x, this._vb_scale_y);
		
		this._vb_curr_oX = p_scr_x - (delta_x / this._vb_scale_x);
		this._vb_curr_oY = p_scr_y - (delta_y / this._vb_scale_y);
		
		
		//this._vb_curr_oX = p_event.clientX - this._vb_curr_oX_delta;
		//this._vb_curr_oY = p_event.clientY - this._vb_curr_oY_delta;		
		
		//return;
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();			
	}
	
	//mouse wheel을 위로 올릴 때 - 축소시켜야 함 
	svg_reduce(p_scr_x,p_scr_y){
		//(VALD) - 최대 확대 비율
		if( this._vb_scale_factor >= 3){
			return;
		}
		
		let vb = this.scr_to_vb(p_scr_x,p_scr_y);
		//console.log('scr : ', p_scr_x,p_scr_y);
		//console.log('vb  : ', vb.x, vb.y);

		let delta_x = (p_scr_x - this._vb_curr_oX) * this._vb_scale_x;
		let delta_y = (p_scr_y - this._vb_curr_oY) * this._vb_scale_y;
		//console.log('delta : ', delta_x, delta_y);
		
		this._vb_scale_factor++;
		
		//{{
		//this._vb_scale_x += this._vb_scale_x_delta;
		//this._vb_scale_y += this._vb_scale_y_delta;
		////console.log('scale : ', this._vb_scale_x, this._vb_scale_y);
		//}}{{
		this._vb_scale_x = Math.pow(2,this._vb_scale_factor);
		this._vb_scale_y = this._vb_scale_x;

		//this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );		

		if( this.platform.desktop ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );		
		}
		else if( this.platform.mobile ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(2*this._vb_scale_x) + ')' );		
		}		
		//}}
		
		this._vb_curr_oX = p_scr_x - (delta_x / this._vb_scale_x);
		this._vb_curr_oY = p_scr_y - (delta_y / this._vb_scale_y);
		
		
		//this._vb_curr_oX = p_event.clientX - this._vb_curr_oX_delta;
		//this._vb_curr_oY = p_event.clientY - this._vb_curr_oY_delta;		
		
		//return;
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();			
	}	
	
	//mouse wheel을 아래로 내릴 때 - 확대 , scale_factor값이 작아져야 한다.
	svg_enlarge(p_scr_x,p_scr_y){
		//(VALD) - 최대 확대 비율
		if( this._vb_scale_factor <= -3){
			return;
		}
		//debugger;
		let vb = this.scr_to_vb(p_scr_x,p_scr_y);
		
		let delta_x = (p_scr_x - this._vb_curr_oX) * this._vb_scale_x;
		let delta_y = (p_scr_y - this._vb_curr_oY) * this._vb_scale_x;			
		
		
		this._vb_scale_factor--;
		
		//{{
		//this._vb_scale_x -= this._vb_scale_x_delta;
		//this._vb_scale_y -= this._vb_scale_y_delta;
		//}}{{
		this._vb_scale_x = Math.pow(2,this._vb_scale_factor);
		this._vb_scale_y = this._vb_scale_x
		
		//this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );

		if( this.platform.desktop ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(this._vb_scale_x) + ')' );		
		}
		else if( this.platform.mobile ){
			this.layer_tools_scale.setAttribute('transform','scale(' + String(2*this._vb_scale_x) + ')' );		
		}
		
		//}}
			
		
		this._vb_curr_oX = p_scr_x - (delta_x / this._vb_scale_x);
		this._vb_curr_oY = p_scr_y - (delta_y / this._vb_scale_y);		
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();		
	}		
	
	//mouse wheel을 아래로 내릴 때 - 확대
	svg_enlarge2(p_scr_x,p_scr_y){
		//(VALD) - 최대 확대 비율
		if( this._vb_scale_x <= 1.0 ){
			return;
		}
		let vb = this.scr_to_vb(p_scr_x,p_scr_y);
		
		let delta_x = (p_scr_x - this._vb_curr_oX) * this._vb_scale_x;
		let delta_y = (p_scr_y - this._vb_curr_oY) * this._vb_scale_x;			
		
		this._vb_scale_x -= this._vb_scale_x_delta;
		this._vb_scale_y -= this._vb_scale_y_delta;
		
	
		
		this._vb_curr_oX = p_scr_x - (delta_x / this._vb_scale_x);
		this._vb_curr_oY = p_scr_y - (delta_y / this._vb_scale_y);		
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();		
	}	
	
	el_wheel1(p_event){
		console.log( p_event.clientX, p_event.clientY);
		
		//(VALD)
		if( this.wheel_ing ){
			return;
		}
		
		//휠 처리
		if( p_event.deltaY <0 ){	//wheel - 위로 올릴 때
			p_event.preventDefault();
			//console.log('<0');
			this.svg_reduce();
		}
		else if( p_event.deltaY>0){	//wheel - 아래로 내릴 때
			p_event.preventDefault();
			//console.log('0<');
			this.svg_enlarge();
		}
		
	}
	
	//mouse wheel을 위로 올릴 때 - 축소시켜야 함 
	svg_reduce1(){
		this._vb_scale_x += this._vb_scale_x_delta;
		this._vb_scale_y += this._vb_scale_y_delta;
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();			
	}
	
	//mouse wheel을 아래로 내릴 때 - 확대
	svg_enlarge1(){
		//(VALD) - 최대 확대 비율
		if( this._vb_scale_x <= 1.0 ){
			return;
		}

		this._vb_scale_x -= this._vb_scale_x_delta;
		this._vb_scale_y -= this._vb_scale_y_delta;
		
		this.update_viewbox();
		this.update_grid();
		this.update_axis();		
	}
	
	//_vb_scale_x,_vb_scale_y,_vb_curr_oX,_vb_curr_oY에 대한 변경이 있을 때
	update_viewbox(){
		//screen coordinate
		this._vb_width  = this._element_width  * this._vb_scale_x;
		this._vb_height = this._element_height * this._vb_scale_y;
		
		this._vb_x_min = this._Ox - this._vb_curr_oX * this._vb_scale_x;
		this._vb_y_min = this._Oy - this._vb_curr_oY * this._vb_scale_y;
		
		this._vb_x_max = this._vb_x_min + this._vb_width;
		this._vb_y_max = this._vb_y_min + this._vb_height;
		
		//catesian coordinate
		this.ct_x_min = this._vb_x_min - this._Ox;	
		this.ct_x_max = this.ct_x_min + this._vb_width;	
		
		this.ct_y_max = this._Oy - this._vb_y_min;
		this.ct_y_min = this.ct_y_max - this._vb_height;
		
		//		
		this._vb_str = 
			String(this._vb_x_min) + ' ' + 
			String(this._vb_y_min) + ' ' + 
			String(this._vb_width) + ' ' + 
			String(this._vb_height);
		
		//debug 
		//console.log( this.ct_x_min , '~', this.ct_x_max );
		//console.log( this.ct_y_min , '~', this.ct_y_max );
	
		this._element.setAttribute('viewBox',this._vb_str);	
		this.layer_tools.setAttribute('transform','translate(' + String(this._vb_x_min) +  ',' + String(this._vb_y_min) + ')' )
	}
	
	update_grid(){
		//처리해야함 - 생성자에서 달아줘야 함
		//let tmp_parent = document.getElementById('my_grid');	//전역변수화
		
		let tmp_parent = this.layer_grid;
		//
		
		let grid_x_min = 0;
		let grid_x_max = 0;
		//let grid_x_quotient = 0;	//몫
		let grid_x_cnt = 0;
		
		//카타시안
		//let ct_x_min = this._vb_x_min - this._Ox;	//멤버 변수로 분류해야 할 듯
		//let ct_x_max = ct_x_min + this._vb_width;	//멤버 변수로 분류해야 할 듯
		
		grid_x_min = Math.ceil( this.ct_x_min / this._vb_x_grid_size) * this._vb_x_grid_size;
		grid_x_max = Math.floor( this.ct_x_max / this._vb_x_grid_size) * this._vb_x_grid_size;
		grid_x_cnt = ( grid_x_max - grid_x_min) / this._vb_x_grid_size + 1;
		
		//console.log( grid_x_min , grid_x_max , grid_x_cnt);
		
		//////////////////////////////////////////////////
		//세로 그리드의 부족한 개수
		let delta_sero = grid_x_cnt - this.grid_sero.length;
		
		if( delta_sero>0 ){
			for( let i=0; i< delta_sero; i++){
				//let t = document.createElementNS("http://www.w3.org/2000/svg",'line');
				let t = document.createElementNS(SVG_NS,'line');
				
				//t.setAttribute('style','stroke:rgb(0,0,0);stroke-width:1');
				tmp_parent.appendChild( t );
				this.grid_sero.push( t );			
			}
		}
		else if( delta_sero<0 ){
			for( let i=delta_sero; i< 0; i++){
				let t = this.grid_sero.pop();
				t.remove();
			}			
		}
		//////////////////////////////////////////////////
		for( let i=0; i<this.grid_sero.length; i++){
			let pos_x = (i*this._vb_x_grid_size + grid_x_min ) + this._Ox ;
			
			let t = this.grid_sero[i];
			
			t.setAttribute('x1',pos_x);
			t.setAttribute('y1',this._vb_y_min);
			t.setAttribute('x2',pos_x);
			t.setAttribute('y2',this._vb_y_max);		
		}			
		
		///////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////
		let grid_y_min = 0;
		let grid_y_max = 0;
		let grid_y_cnt = 0;		

		grid_y_min = Math.ceil( this.ct_y_min / this._vb_y_grid_size) * this._vb_y_grid_size;
		grid_y_max = Math.floor( this.ct_y_max / this._vb_y_grid_size) * this._vb_y_grid_size;
		grid_y_cnt = ( grid_y_max - grid_y_min) / this._vb_y_grid_size + 1;
		
		//가로 그리드 - 개수 맞추기
		let delta_garo = grid_y_cnt - this.grid_garo.length;
		//console.log('Grid Y : ',grid_y_min,'~',grid_y_max, ':', grid_y_cnt, ' : ', delta_garo);		
		
		if( delta_garo>0 ){
			for( let i=0; i< delta_garo; i++){
				//let t = document.createElementNS("http://www.w3.org/2000/svg",'line');
				let t = document.createElementNS(SVG_NS,'line');
				
				//t.setAttribute('style','stroke:rgb(0,0,0);stroke-width:1');
				tmp_parent.appendChild( t );
				this.grid_garo.push( t );			
			}
		}
		else if( delta_garo<0 ){
			for( let i=delta_garo; i< 0; i++){
				let t = this.grid_garo.pop();
				t.remove();
			}			
		}		
		//가로 그리드 - 포지셔닝
		for( let i=0; i<this.grid_garo.length; i++){
			let pos_y = -1*(i*this._vb_y_grid_size + grid_y_min ) + this._Oy ;
			//console.log('pos_y : ', pos_y);
			
			let t = this.grid_garo[i];
			
			t.setAttribute('x1',this._vb_x_min);
			t.setAttribute('y1',pos_y);
			t.setAttribute('x2',this._vb_x_max);
			t.setAttribute('y2',pos_y);		
		}			
		
	}
	
	//좌표계x,y -> pixel수를 고려한 x,y좌표계 상에서 
	get_scr_xy(p_x,p_y){	//
		return{
			x: p_x * this._ct_x_pixels,
			y: p_y * this._ct_y_pixels
		};
	}
	
	//viewbox 상에서 x,y 
	get_vb_xy(p_x,p_y){
		return{
			x: p_x + this._Ox,
			y: -p_y + this._Oy
		};		
	}
	
	//p_x : 좌표계상에서의 x위치
	//post-condition: viewbox상에서의 x,y위치
	get_vb_position(p_x,p_y){
		let ret  = this.get_scr_xy(p_x,p_y);
		let ret2 = this.get_vb_xy( ret.x, ret.y);
		
		return{
			x: ret2.x,
			y: ret2.y
		};
	}
	
	register_drag_object(p_obj){
		if(! this.drag_ing ){
			this.drag_ing = true;
			this.drag_obj = p_obj;
			return true;
		}
		else{
			return false;
		}
	}
	
	//마우스 사용가능한지. 점A를 점B위로 드래그중에, 점B의 mouseover가 동작함
	is_mouse_available(){
		return !this.drag_ing;
	}
	
	//두 점사이의 거리를 계산
	calc_distance(p_A,p_B){
		let distance = Math.sqrt( Math.pow((p_B.ct_x - p_A.ct_x),2) + Math.pow((p_B.ct_y - p_A.ct_y),2) );
		//console.log('거리: ',distance);
		return distance;
	}
	
	//두 점 사이의 각도를 계산
	calc_angle(p_A,p_B){
		//p_A를 원점으로 두고,p_B에서 각도를 계산
		let Px = p_B.ct_x - p_A.ct_x;
		let Py = p_B.ct_y - p_A.ct_y;
		
		///////////////////////////////////////////////////////////////////
		//let rad = Math.atan2(y, x); //특이하게 (y,x)로 y가 먼저 나옴
		//let deg = rad * 180 / Math.PI;
		//
		////console.log( Math.atan2(y, x) * 180 / Math.PI );
		//console.log('각도:',deg);
		//return Math.atan2(y, x) * 180 / Math.PI;		
		//////////////////////////////////////////////////////////////////
		let rad = Math.atan2(Py,Px);
		let ang = rad * 180 / Math.PI;
		
		//console.log('각도: ',ang);
		//console.log(Px,Py);		
		return ang;
	}
	
	//두 점 사이의 각도를 계산
	calc_radian(p_A,p_B){
		//p_A를 원점으로 두고,p_B에서 각도를 계산
		let Px = p_B.ct_x - p_A.ct_x;
		let Py = p_B.ct_y - p_A.ct_y;
		
		let rad = Math.atan2(Py,Px);

		return rad;
	}	
	
	//radian을 degree로 
	calc_rad2deg(p_rad){
		let deg = p_rad * 180 / Math.PI;
		return deg;
	}

	//degree를 radian으로
	calc_deg2rad(p_deg){
		let rad = p_deg * Math.PI / 180;
		return rad;
	}
	
	//직각삼각형 빗변 길이 계산
	calc_opposite(p_hypotenuse,p_adjacent){
		let opp = Math.sqrt( Math.pow(p_hypotenuse,2) - Math.pow(p_adjacent,2) );
		console.log('대변: ', opp);
		return opp;
	}
	
	calc_CircleXY(p_r,p_deg){
		let rad = this.calc_deg2rad(p_deg);
		
		return{
			x: Math.cos(rad) * p_r,
			y: Math.sin(rad) * p_r
		};		
	}
	
	calc_CircleXY2(p_Ox,p_Oy,p_r,p_theta){
		let x = p_r * Math.cos(p_theta) + p_Ox;
		let y = p_r * Math.sin(p_theta) + p_Oy;
		
		return{
			x:x,
			y:y
		};
	}
	
	
	print_status(){
		console.log('_vb_x_min', this._vb_x_min);
	}
	
	///////////////////////////////////////////////////////////////////
	//                                                               //
	//	정리완료                                                     //
	//                                                               //
	
	//각도를 0~360사이의 값으로 표현
	normal_degree2(p_degree){
		//모듈러 사용 불가, 음수는 모듈러도 음수가 나옴
		//return p_degree % 360;
		
		let quotient = p_degree / 360; //몫
		let valid_quotient = Math.floor(quotient);
		let valid_deg = valid_quotient * -360 + p_degree;	

		return valid_deg;	
	}

	//각도를 -180~180사이의 값으로 표현
	normal_degree(p_degree){
		let deg = p_degree;
		
		if(deg<0 || deg >=360){
			//console.log('정규화');
			deg = this.normal_degree2(p_degree)
		}
		
		if( deg > 180 ){
			deg += -360
		}
		
		return deg;	
	}	
	
	
}
////////////////////////////////////////////////////////
class c_platform{
	width 	= 0;
	height 	= 0;
	
	mobile 	= false;
	desktop = false;
	
	constructor(){
		this.mobile = navigator.userAgentData.mobile;
		this.desktop = !this.mobile;
		
		if(this.desktop){
			this.width  = window.innerWidth;
			this.height = window.innerHeight;
		}
		else if( this.mobile ){
			this.width  = window.screen.width;
			this.height = window.screen.height;			
		}
	}
}

////////////////////////////////////////////////////////

const DELTA_DISTANCE = 15;		//점 반지름
const UPRIGHT = 1;

class c_symbol{
	symbol = '';
	point = null;
	coordinate_obj = null;

//		<!-- text symbol 회전시키기 -->
//		<g transform='translate(200,200)' >
//			<g transform='translate(100,0)' >
//				<g transform='rotate(-90,-100,0)'>
//					<text text-anchor="middle" dominant-baseline="middle" transform='rotate(0)'>D</text>
//				</g>
//			</g>
//		</g>		
	layer_translate 	= null;
	layer_rotate_origin = null;
	layer_rotate 		= null;
	layer_text 			= null;
	
	text_node 			= null;
	
	constructor(){
	}
	
	init(p_symbol,p_coordinate_obj,p_point){
		this.symbol = p_symbol;
		this.point = p_point;
		this.coordinate_obj = p_coordinate_obj;
		
		let layer_symbols = this.coordinate_obj.get_layer_symbol();
		//console.log( layer_symbols );
		
//		<!-- text symbol 회전시키기 -->
//		<g transform='translate(200,200)' >
//			<g transform='translate(100,0)' >
//				<g transform='rotate(-90,-100,0)'>
//					<text text-anchor="middle" dominant-baseline="middle" transform='rotate(0)'>D</text>
//				</g>
//			</g>
//		</g>		

		this.layer_translate = document.createElementNS(SVG_NS,'g');
		this.layer_translate.setAttribute('id','id_' + p_symbol);
		layer_symbols.appendChild( this.layer_translate);
		
		this.layer_rotate_origin = document.createElementNS(SVG_NS,'g');
		this.layer_rotate_origin.setAttribute('transform','translate(' + String(DELTA_DISTANCE) + ',0)');
		this.layer_translate.appendChild(this.layer_rotate_origin);
		
		this.layer_rotate = document.createElementNS(SVG_NS,'g');
		this.layer_rotate_origin.appendChild( this.layer_rotate );
		
		this.layer_text = document.createElementNS(SVG_NS,'text');
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_rotate.appendChild( this.layer_text );
		
		this.text_node = document.createTextNode( p_symbol );
		this.layer_text .appendChild(this.text_node);
		
		//imsi.setAttribute('class','c_imsi');
		//hit_layer.appendChild(imsi);		
		
	//layer_translate 	= null;
	//layer_rotate_origin = null;
	//layer_rotate 		= null;
	//layer_text 			= null;		
		
		
		//this.point = 
	}
	
	hide(){
		this.layer_translate.setAttribute('visibility','hidden');
	}
	
	show(){
		this.layer_translate.setAttribute('visibility','visible');
	}
	
	update_position(p_x,p_y){
		let val = 'translate(' + String(p_x) + ',' + String(p_y) + ')';
		this.layer_translate.setAttribute('transform',val);
	}
	
	update_rotate(p_ang,p_txt_ang=UPRIGHT){
		let ang = -p_ang;
		let txt_ang= 0;
		
		if( p_txt_ang == UPRIGHT){
			txt_ang = -ang;
		}
		
		//<g transform='rotate(-90,-100,0)'>
		//<text text-anchor="middle" dominant-baseline="middle" transform='rotate(0)'>D</text>
		
		let layer_rotate_val = 'rotate(' + String(ang) + ',' + String(-DELTA_DISTANCE) + ',0)';
		this.layer_rotate.setAttribute('transform',layer_rotate_val);
		
		let layer_text_val = 'rotate(' + String(txt_ang) + ')';
		this.layer_text.setAttribute('transform',layer_text_val);
	}
	
}	

////////////////////////////////////////////////////////
class c_line_symbol{
	symbol = '';
	scs_obj = null;
	
	layer_translate 	= null;
	layer_txt_wrapper   = null;
	layer_box_wrapper   = null;
	
	layer_text 			= null;
	text_node 			= null;	
	
	layer_box           = null;
	
	textbox_ct_width  = 0;
	textbox_ct_height = 0;
	
	ct_x = 0;
	ct_y = 0;
	
	ct_x1 = 0;
	ct_x2 = 0;
	ct_y1 = 0;
	ct_y2 = 0;
	
	ct_half_diagonal = 0;
	
	constructor(){
	}
	
	init(p_scs_obj){
		this.scs_obj = p_scs_obj;

		//<g transform="translate(213.5,248)" visibility="visible"> 	; layer_translate
		//	<g>															; layer_txt_wrapper
		//		<text class="c_symbol_text">AB</text>					; layer_text
		//	</g>
		//	
		//	<g>															; layer_box_wrapper
		//		<rect></rect>											; layer_box
		//	</g>
		//</g>
		
		//
		let ls_layer = this.scs_obj.get_layer_length_symbol();	//length symbol layer
		
		this.layer_translate = document.createElementNS(SVG_NS,'g');
		ls_layer.appendChild( this.layer_translate);
		
		this.layer_txt_wrapper = document.createElementNS(SVG_NS,'g');
		this.layer_translate.appendChild( this.layer_txt_wrapper );
		
		this.layer_box_wrapper = document.createElementNS(SVG_NS,'g');
		this.layer_translate.appendChild( this.layer_box_wrapper );
		
		//
		this.layer_text = document.createElementNS(SVG_NS,'text');
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_txt_wrapper.appendChild( this.layer_text );
		
		this.text_node = document.createTextNode( '' );
		this.layer_text.appendChild(this.text_node);		
		
		//
		this.layer_box =  document.createElementNS(SVG_NS,'rect');
		//this.layer_box.setAttribute('class','line_symbol_rect_debug');
		this.layer_box.setAttribute('class','line_symbol_rect');
		this.layer_box_wrapper.appendChild(this.layer_box);		
	}
	
	hide(){
		this.layer_translate.setAttribute('visibility','hidden');
	}
	
	show(){
		this.layer_translate.setAttribute('visibility','visible');
	}	
	
	//update_position 을 먼저 해줘야함( ct_x,ct_y가 먼저 설정되어야 함)
	update_text_v1(p_text){
		//atat.textContent = str_dp_ang;
		//}}{{
		//this.symbol_obj.update_text( str_dp_ang );		
		this.layer_text.textContent = p_text;
		
		//
		let info = this.layer_txt_wrapper.getBBox();
		
		this.textbox_ct_width  = this.scs_obj.vbx2ctx( info.width  );	//20.875
		this.textbox_ct_height = this.scs_obj.vbx2ctx( info.height );	//21.015625
		
		//console.log( this.textbox_ct_width );
		//console.log( this.textbox_ct_height );
		
		let half_width  = this.textbox_ct_width/2;
		let half_height = this.textbox_ct_height/2;
		
		this.ct_half_diagonal = Math.sqrt( Math.pow(half_width,2) + Math.pow(half_height,2) );
		
		this.ct_x1 = this.ct_x - half_width;
		this.ct_x2 = this.ct_x + half_width;
		
		this.ct_y1 = this.ct_y + half_height;
		this.ct_y2 = this.ct_y - half_height;
		
		
		//
		this.layer_box.setAttribute('width',  String(info.width ) );
		this.layer_box.setAttribute('height', String(info.height) );		
		
		this.layer_box.setAttribute('x',  this.scs_obj.ctx2vbx( -half_width  ) );
		this.layer_box.setAttribute('y', this.scs_obj.ctx2vbx( -half_height ) );
	}
	
	update_position_v1(p_x,p_y){
		this.ct_x = p_x;
		this.ct_y = p_y;
		
		let vbxy = this.scs_obj.get_vb_position(p_x,p_y);
		//debugger;
		this.layer_translate.setAttribute('transform','translate(' + String(vbxy.x) + ',' + String(vbxy.y) + ')');
	}
	

	//update_position 을 먼저 해줘야함( ct_x,ct_y가 먼저 설정되어야 함)
	update_text(p_text){
		//atat.textContent = str_dp_ang;
		//}}{{
		//this.symbol_obj.update_text( str_dp_ang );		
		this.layer_text.textContent = p_text;
		
		//
		let info = this.layer_txt_wrapper.getBBox();
		
		this.textbox_ct_width  = this.scs_obj.vbx2ctx( info.width  );	//20.875
		this.textbox_ct_height = this.scs_obj.vbx2ctx( info.height );	//21.015625
		
		//console.log( this.textbox_ct_width );
		//console.log( this.textbox_ct_height );
		
		this.layer_box.setAttribute('width',  String(info.width ) );
		this.layer_box.setAttribute('height', String(info.height) );		
		

	}

	update_position(p_x,p_y){
		this.ct_x = p_x;
		this.ct_y = p_y;
		
		//
		let half_width  = this.textbox_ct_width/2;
		let half_height = this.textbox_ct_height/2;
		
		this.ct_half_diagonal = Math.sqrt( Math.pow(half_width,2) + Math.pow(half_height,2) );
		
		this.ct_x1 = this.ct_x - half_width;
		this.ct_x2 = this.ct_x + half_width;
		
		this.ct_y1 = this.ct_y + half_height;
		this.ct_y2 = this.ct_y - half_height;
		
		
		//
		
		this.layer_box.setAttribute('x',  this.scs_obj.ctx2vbx( -half_width  ) );
		this.layer_box.setAttribute('y', this.scs_obj.ctx2vbx( -half_height ) );
		//
		
		let vbxy = this.scs_obj.get_vb_position(p_x,p_y);
		//debugger;
		this.layer_translate.setAttribute('transform','translate(' + String(vbxy.x) + ',' + String(vbxy.y) + ')');
	}	
	
}	


////////////////////////////////////////////////////////

class c_angle_symbol{
	symbol = '';
	scs_obj = null;
	
	layer_translate 	= null;
	layer_text 			= null;
	text_node 			= null;
	
	constructor(){
	}
	
	init(p_coordinate_obj){
		this.scs_obj = p_coordinate_obj;
		
		let as_layer = this.scs_obj.get_layer_angle_symbol(); //angle symbol layer;
		//console.log( as_layer );
		
		this.layer_translate = document.createElementNS(SVG_NS,'g');
		//this.layer_translate.setAttribute('id','id_' + p_symbol);
		as_layer.appendChild( this.layer_translate);
		
		this.layer_text = document.createElementNS(SVG_NS,'text');
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_translate.appendChild( this.layer_text );
		
		this.text_node = document.createTextNode( '' );
		this.layer_text .appendChild(this.text_node);		
	}
	
	hide(){
		this.layer_translate.setAttribute('visibility','hidden');
	}
	
	show(){
		this.layer_translate.setAttribute('visibility','visible');
	}	
	
	update_vb_xy(p_vb_x,p_vb_y){
		this.layer_translate.setAttribute('transform','translate(' + String(p_vb_x) + ',' + String(p_vb_y) + ')');
	}
	
	update_text(p_text){
		//atat.textContent = str_dp_ang;
		//}}{{
		//this.symbol_obj.update_text( str_dp_ang );		
		this.layer_text.textContent = p_text;
	}
	
}

////////////////////////////////////////////////////////

const HIT_AREA_R = 50;	//반응영역 반지름
const POINT_R = 4;		//점 반지름

class c_point{
	
	ct = null;	//좌표계
	interactive = false;
	
	ct_x = 0;
	ct_y = 0;
	
	vb_x = 0;
	vb_y = 0;
	
	symbol = ''
	symbol_obj = null;
	
	hit_area = null;
	
	drag_ing = false;
	
	imsi = null;
	
	call_back = null;
	
	point_obj = null;
	
	constructor(p_ct, p_ct_x,p_ct_y,p_symbol,p_interactive=false,p_cb=null){
		this.ct     = p_ct;		//좌표계 object
		this.interactive = p_interactive;
		
		this.ct_x   = p_ct_x;	//카테시안 좌표상의 X좌표 	
		this.ct_y   = p_ct_y;
		this.symbol = p_symbol;	//이름
		
		if( p_cb != null){
			this.call_back = p_cb;	//call back routine
		}

	}
	
	init(){
		//symbol object 생성
		//tmp_sym = new c_symbol();
		//tmp_sym.init('A',gscr,point_A);
		//tmp_sym.update_position(200,200);
		//tmp_sym.update_rotate(45,UPRIGHT);		
		this.symbol_obj = new c_symbol();
		this.symbol_obj.init(this.symbol,this.ct,this);
		
		//viewbox상에서의 x,y 위치 
		let vb_xy = this.ct.get_vb_position(this.ct_x,this.ct_y)
		this.vb_x = vb_xy.x;
		this.vb_y = vb_xy.y;
		
		//hit area에 반응영역 달기
		let hit_layer = this.ct.get_hit_layer();
		
		//{{TEST
		//this.hit_area = document.createElementNS(SVG_NS,'circle')
		//this.hit_area.setAttribute('id','testtest');
		////this.hit_area.setAttribute('cx',200);
		////this.hit_area.setAttribute('cy',200);
		//this.hit_area.setAttribute('cx',vb_xy.x);
		//this.hit_area.setAttribute('cy',vb_xy.y);		
		//this.hit_area.setAttribute('r',HIT_AREA_R);
		//hit_layer.appendChild(this.hit_area);
		//}}{{
		
		let imsi = document.createElementNS(SVG_NS,'g');
		this.imsi = imsi;
		imsi.setAttribute('id','my_imsi');
		//imsi.setAttribute('id','ha_' + this.symbol);
		imsi.setAttribute('class','c_imsi');
		hit_layer.appendChild(imsi);

		if( this.interactive ){			
			this.hit_area = document.createElementNS(SVG_NS,'circle')
			//this.hit_area.setAttribute('id','testtest');
			this.hit_area.setAttribute('id','ha_' + this.symbol);

			this.hit_area.setAttribute('cx',0);
			this.hit_area.setAttribute('cy',0);				
			//this.hit_area.setAttribute('cx',vb_xy.x);
			//this.hit_area.setAttribute('cy',vb_xy.y);				
			this.hit_area.setAttribute('r',HIT_AREA_R);
			imsi.appendChild(this.hit_area);			
		}
		
		let garo = document.createElementNS(SVG_NS,'line')
		garo.setAttribute('class','c_imsi');
		garo.setAttribute('x1',-100);
		garo.setAttribute('y1',0);						
		garo.setAttribute('x2',100);						
		garo.setAttribute('y2',0);	
		imsi.appendChild(garo);		

		let sero = document.createElementNS(SVG_NS,'line')
		sero.setAttribute('class','c_imsi');
		sero.setAttribute('x1',0);
		sero.setAttribute('y1',-100);						
		sero.setAttribute('x2',0);						
		sero.setAttribute('y2',100);	
		imsi.appendChild(sero);
		
		this.imsi.setAttribute('transform','translate(' + String(vb_xy.x) +  ',' + String(vb_xy.y) + ')' )
		
		//tmp_sym.update_position(200,200);
		//tmp_sym.update_rotate(45,UPRIGHT);				
		this.symbol_obj.update_position(vb_xy.x,vb_xy.y);
		this.symbol_obj.update_rotate(90,UPRIGHT);
		//}}
		
		//points layer에 point 달기
		let points_layer = this.ct.get_points_layer();		
		this.point_obj = document.createElementNS(SVG_NS,'circle')
		//this.point_obj.setAttribute('cx',0);
		//this.point_obj.setAttribute('cy',0);	
		this.point_obj.setAttribute('cx',vb_xy.x);
		this.point_obj.setAttribute('cy',vb_xy.y);	
		this.point_obj.setAttribute('r',POINT_R);
		points_layer.appendChild(this.point_obj);					
		
		//event listener
		if( this.interactive ){
			this.hit_area.addEventListener('mousedown',(e)=>this.el_mousedown(e) );
			//this.hit_area.addEventListener('mouseup',(e)=>this.el_mouseup(e) );
			//this.hit_area.addEventListener('mousemove',(e)=>this.el_mousemove(e) );
			
			this.hit_area.addEventListener('mouseover',(e)=>this.el_mouseover(e) );
			this.hit_area.addEventListener('mouseout',(e)=>this.el_mouseout(e) );
			
			//{{
			this.hit_area.addEventListener('touchstart',(e)=>this.el_touchstart(e) );	
			//}}
		}
		
		////
		//let xy = this.ct.get_scr_xy(this.ct_x,this.ct_y);
		//console.log( xy );
		//
		////
		//let xy2 = this.ct.get_vb_xy(xy.x, xy.y);
		//console.log( xy2 );
		//
		//console.log( this.ct.get_vb_position(this.ct_x,this.ct_y) );
	}
	
	hide(){
		this.point_obj.setAttribute('visibility','hidden');
		this.symbol_obj.hide();
	}
	
	show(){
		this.point_obj.setAttribute('visibility','visible');
		this.symbol_obj.show();
	}
	
	//장기적 소거목적
	update_position(p_vb_x,p_vb_y,p_ct_x,p_ct_y){
		if(this.drag_ing){
			this.imsi.setAttribute('class','c_pha_draging');
		}
		
		this.vb_x = p_vb_x;
		this.vb_y = p_vb_y;
		
		//console.log('pos: ', p_vb_x, ' , ' , p_vb_y );
		
		this.ct_x = p_ct_x;
		this.ct_y = p_ct_y;
		//console.log('ct: ', p_ct_x, ' , ' , p_ct_y );
		
		//let hit = document.getElementById('testtest');
		//hit.setAttribute('cx',vb_x);
		//hit.setAttribute('cy',vb_y);				
		
		this.imsi.setAttribute('transform','translate(' + String(p_vb_x) +  ',' + String(p_vb_y) + ')' )
		
		this.point_obj.setAttribute('cx',String(p_vb_x));
		this.point_obj.setAttribute('cy',String(p_vb_y));
		
		this.symbol_obj.update_position(p_vb_x,p_vb_y);
		
		//call call-back routine
		if( this.call_back != null ){
			this.call_back(this);
		}		
		
	}	
	
	update_position2(p_ct_x,p_ct_y){
		if(this.drag_ing){
			this.imsi.setAttribute('class','c_pha_draging');
		}		
		
		let vbxy = this.ct.get_vb_position(p_ct_x,p_ct_y);

		this.vb_x = vbxy.x;
		this.vb_y = vbxy.y;
		
		this.ct_x = p_ct_x;
		this.ct_y = p_ct_y;

		
		this.imsi.setAttribute('transform','translate(' + String(this.vb_x) +  ',' + String(this.vb_y) + ')' )
		
		this.point_obj.setAttribute('cx',String(this.vb_x));
		this.point_obj.setAttribute('cy',String(this.vb_y));
		
		this.symbol_obj.update_position(this.vb_x,this.vb_y);
		
		//call call-back routine
		if( this.call_back != null ){
			this.call_back(this);
		}		
	
	}
	
	
	//마우스가 반응영역위에 올라오면, 색깔로 알려준다.
	el_mouseover(p_event){
		//fill-opacity:	0.3;
		//console.log('mouse over');
		//this.imsi.setAttribute('fill-opacity','0.1');
		//this.imsi.setAttribute('stroke-opacity','0.1');
		
		//마우스가 드래그 중에서 벗어나는 경우가 있음
		if( this.drag_ing ){
			this.imsi.setAttribute('class','c_pha_draging');
		}
		else{
			//{{
			//this.imsi.setAttribute('class','c_pha_mouseover');
			//}}{{
			
			//점A를 드래그하는 중에,
			//마우스 포인터가 점B 위로 올라가면,
			//점B의 mouseover가 동작함 
			//-> 그래서 다른점 드래그 중에는 반응하지 못하도록 함
			if( this.ct.is_mouse_available() ){
				this.imsi.setAttribute('class','c_pha_mouseover');
			}
				
			//}}
		}
		
	}
	
	el_mouseout(p_event){
		//this.imsi.setAttribute('fill-opacity','0');
		//this.imsi.setAttribute('stroke-opacity','0');
		this.imsi.setAttribute('class','c_pha_mouseout');
	}
	
	//drag 중에
	mouse_drag_ing(){
		this.imsi.setAttribute('class','c_pha_draging');
	}
	
	
	//el_mousedown과 동일로직
	el_touchstart(p_event){
		//console.log('[Point] touch - start');
		p_event.preventDefault();
		
		if( this.ct.register_drag_object(this) ){
			this.mouse_drag_ing();
			this.drag_ing = true;
			
			//{{
			//document.getElementById('info').innerText = '18';
			//}}{{
			console.log('[point] - touch start');
			info_update('point mouse down 정상작동');
			//}}
		}		
		
	}

	el_mousedown(p_event){
		if(p_event.buttons == 1){
			p_event.preventDefault();
			
			if( this.ct.register_drag_object(this) ){
				this.mouse_drag_ing();
				this.drag_ing = true;
				
				//{{
				//document.getElementById('info').innerText = '18';
				//}}{{
				console.log('point - mouse down');
				info_update('point mouse down 정상작동');
				//}}
			}

		}
	}		
	
	cb_mouseup(){
		this.drag_ing = false;
		
		if( this.ct.platform.desktop ){
			this.imsi.setAttribute('class','c_pha_mouseover');
		}
		else if( this.ct.platform.mobile ){
			//mobile은 mouse pointer가 없음
			this.imsi.setAttribute('class','c_pha_mouseout');
		}
	}
	
}	

////////////////////////////////////////////////////////

const CW  = 0;
const CCW = 1;

//직선:line, 선분 segment

//forward/reverse
class c_segment{
	scs = null;	//screen coordinate system(스크린 좌표계)
	reverse_flag = false;	
	
	line_obj = null;
	
	pA = null;	
	pB = null;	
	
	constructor(p_scs,p_line,p_reverse_flag){
		this.scs = p_scs;
		this.line_obj = p_line;
		this.reverse_flag = p_reverse_flag;
			
		if( !p_reverse_flag){
			this.pA = p_line.pA;
			this.pB = p_line.pB;
		}
		else{
			this.pA = p_line.pB;
			this.pB = p_line.pA;
		}
	}
	
	get_theta(){
		if( !this.reverse_flag){
			return this.line_obj.theta;
		}
		else{
			return this.line_obj.theta_reverse;
		}
	}
	
	get_degree(){
		if( !this.reverse_flag){
			return this.line_obj.degree;
		}
		else{
			return this.line_obj.degree_reverse;
		}				
	}
	
	get_reverse_degree(){
		if( !this.reverse_flag){
			return this.line_obj.degree_reverse;
		}
		else{
			return this.line_obj.degree;
		}						
	}
	
	get_reverse_theta(){
		if( !this.reverse_flag){
			return this.line_obj.theta_reverse;
		}
		else{
			return this.line_obj.theta;
		}		
	}
	
	
}

class c_line{
	scs = null;	//screen coordinate system(스크린 좌표계)
	
	line_obj = null;
	path_obj = null;
	arc_obj  = null;
	arc_obj2 = null;
	
	symbol_obj = null;
	Q1 = null;
	Q2 = null;
	
	Q1_arc = null;
	Q2_arc = null;
	
	//control
	theta 	= 0;
	degree 	= 0;
	slope	= 0;
	infinite_slope = false;
	y_intercept = 0;	//y절편, x가 0일 때 -> y=ax+b에서 b
	x_intercept = 0;	//x절편, y가 0일 때
	
	domain_lower = 0;	//정의역
	domain_upper = 0;
	
	range_lower = 0;	//치역
	range_upper = 0;
	
	//선분AB를, 선분BA로 계산했을 때
	theta_reverse 	= 0;
	degree_reverse 	= 0;
	
	//점A는 점B는 반시계 방향임(point A,B)
	pA = null;	
	pB = null;
	
	pM = null;
	
	//중점
	ct_Mx = 0;
	ct_My = 0;

	name = '';	//선분'AB'에서 'AB'
	
	feature_obj = null;
	feature_len = 0.1;
	ft_x1 = 0;
	ft_x2 = 0;
	ft_y1 = 0;
	ft_y2 = 0;
	distance = 0;
	
	constructor(p_scs,p_A,p_B){
		this.scs = p_scs;
		this.pA = p_A;
		this.pB = p_B;
		
		this.Q1 = {x:0,y:0};
		this.Q2 = {x:0,y:0};
				
		
		//점 글자로 이름을 만듬
		this.name = p_A.symbol + p_B.symbol;
	}
	
	init(){
		let path_layer = this.scs.get_layer_path();
		
		this.line_obj = document.createElementNS(SVG_NS,'line');
		path_layer.appendChild( this.line_obj );
		
		//2등변삼각형,정삼각형 표시
		let feature_layer = this.scs.get_layer_length_feature();
		this.feature_obj = document.createElementNS(SVG_NS,'line');
		feature_layer.appendChild( this.feature_obj );
		this.hide_feature();
		
		//{{
		//this.path_obj = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.path_obj );
		//
		//this.arc_obj = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.arc_obj );		
		//
		//this.arc_obj2 = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.arc_obj2 );				
		//}}
		
		//
		//선길이 표시 
		let length_arc_layer = this.scs.get_layer_length_arc();
		
		//<path id='arc2' class='bg_red'></path>	
		this.Q1_arc = document.createElementNS(SVG_NS,'path');
		//this.Q1_arc.setAttribute('class','');
		length_arc_layer.appendChild( this.Q1_arc );				

		//<path id='arc1' class='bg_red'></path>
		this.Q2_arc = document.createElementNS(SVG_NS,'path');
		//this.Q2_arc.setAttribute('class','');
		length_arc_layer.appendChild( this.Q2_arc );				
		//
		
		this.pM = new c_point(gscr, 0,0,this.name + '_M',false,null);	
		this.pM.init();		
		
		this.symbol_obj = new c_line_symbol();
		this.symbol_obj.init(this.scs);		
		
	}
	
	hide(){
		this.line_obj.setAttribute('visibility','hidden');
		this.pM.hide();
	}
	
	show(){
		this.line_obj.setAttribute('visibility','visible');
		this.pM.show();
	}	
	
	show_M(){
		this.pM.show();
	}
	
	hide_M(){
		this.pM.hide();
	}
	
	show_feature(){
		this.feature_obj.setAttribute('visibility','visible');
	}
	
	hide_feature(){
		this.feature_obj.setAttribute('visibility','hidden');
	}	
	
	update(){
		this.update_internal();
		
		this.line_obj.setAttribute('x1',String( this.pA.vb_x));
		this.line_obj.setAttribute('y1',String( this.pA.vb_y));
		this.line_obj.setAttribute('x2',String( this.pB.vb_x));
		this.line_obj.setAttribute('y2',String( this.pB.vb_y));
		
		//중점
		//let vbxy = this.scs.get_vb_position(this.ct_Mx,this.ct_My);
		//this.pM.update_position(vbxy.x,vbxy.y,this.ct_Mx,this.ct_My);
		this.pM.update_position2(this.ct_Mx,this.ct_My);
		
		//let path_str = 'M ' + String(this.pA.vb_x) + ' ' + String(this.pA.vb_y) + ' l 0 100';
		//let path_str = 'M 100,200 C 100,100 300,100 300,200';
		//let path_str = 'M 100,200 C 100,100 300,100 300,200';
		//let path_str = 'M 100 200 C 200 150, 200 150, 300 200';
		
		
		//let path_str = 'M 100 200 Q 200 100, 300 200';
		//this.path_obj.setAttribute('d',path_str);
		//
		//let arc_str2 = 'M 100 200 C 130 170, 170 150, 200 150';
		//this.arc_obj2.setAttribute('d',arc_str2);		
		
		
		//let arc_str = 'M 100 200 A 150,150 0 0,0 300 200';
		//this.arc_obj.setAttribute('d',arc_str);		
		
		
		//이등변삼각형 관련
		
		let vb_ft1= this.scs.get_vb_position( this.ft_x1 , this.ft_y1 );	
		let vb_ft2= this.scs.get_vb_position( this.ft_x2 , this.ft_y2 );	
		
		this.feature_obj.setAttribute('x1',String( vb_ft1.x ));
		this.feature_obj.setAttribute('y1',String( vb_ft1.y ));
		this.feature_obj.setAttribute('x2',String( vb_ft2.x ));
		this.feature_obj.setAttribute('y2',String( vb_ft2.y ));
		
	}
	
	update_internal(){
		//AB, A를 원점으로 B와 X축 사이의 각도를 계산
		this.theta  = this.scs.calc_radian(this.pA,this.pB);
		this.degree = this.scs.calc_rad2deg( this.theta);
		
		//BA, B를 원점으로 A와 X축 사이의 각도를 계산
		this.degree_reverse = this.degree + 180;
		this.theta_reverse 	= this.scs.calc_deg2rad( this.degree_reverse );
		
		//정규화
		this.degree			= this.scs.normal_degree( this.degree )
		this.degree_reverse	= this.scs.normal_degree( this.degree_reverse )
		
		this.theta 			= this.scs.calc_deg2rad( this.degree )
		this.theta_reverse  = this.scs.calc_deg2rad( this.degree_reverse )
		
		
		////////////////////////////////////////////////////////////////
		//                                                            //
		//                중점                                        //
		//                                                            //
		this.ct_Mx = (this.pA.ct_x + this.pB.ct_x)/2;		
		this.ct_My = (this.pA.ct_y + this.pB.ct_y)/2;		

		//                                                            //
		//                중점                                        //
		//                                                            //
		////////////////////////////////////////////////////////////////


		////////////////////////////////////////////////////////////////
		//                                                            //
		//                이등변 삼각형 관련                          //
		//                                                            //
		let ft_point1 = this.scs.calc_CircleXY2(this.ct_Mx,this.ct_My,this.feature_len, this.theta - Math.PI/2 );	
		this.ft_x1 = ft_point1.x;
		this.ft_y1 = ft_point1.y;
		
		let ft_point2 = this.scs.calc_CircleXY2(this.ct_Mx,this.ct_My,this.feature_len, this.theta + Math.PI/2 );	
		this.ft_x2 = ft_point2.x;
		this.ft_y2 = ft_point2.y;		

		//                                                            //
		//                이등변 삼각형 관련                          //
		//                                                            //
		////////////////////////////////////////////////////////////////

		
		//기울기 무한대인지 체크
		if( this.degree == 90 || this.degree == -90){
			this.infinite_slope = true;
		}
		else{
			this.infinite_slope = false;
		}
		
		//
		
		if( this.infinite_slope ){
			let uP = null; 	//더 위쪽에 있는 점
			let dP = null;	//더 아래에 있는 점
			
			if( this.pA.ct_y <= this.pB.ct_y){
				dP = this.pA;
				uP = this.pB;
			}
			else{
				dP = this.pB;
				uP = this.pA;
			}			
			
			this.x_intercept = dP.ct_x;
			
			//정의역
			this.domain_lower = this.x_intercept;
			this.domain_upper = this.x_intercept;			
			
			//치역
			this.range_lower = dP.ct_y;
			this.range_upper = uP.ct_y;			
			
		}
		else{	//기울기가 무한대가 아닐 때
			let lP = null;	//더 왼쪽에 있는 점
			let rP = null; 	//더 오른쪽에 있는 점
			
			if( this.pA.ct_x <= this.pB.ct_x){
				lP = this.pA;
				rP = this.pB;
			}
			else{
				lP = this.pB;
				rP = this.pA;
			}
			
			//기울기,y떡
			this.slope = (rP.ct_y - lP.ct_y)/(rP.ct_x - lP.ct_x);
			this.y_intercept = rP.ct_y - ( this.slope*rP.ct_x);	//b
			this.x_intercept = -this.y_intercept/this.slope;
			
			//정의역
			this.domain_lower = lP.ct_x;
			this.domain_upper = rP.ct_x;
			
			//치역
			let y1 = this.slope * lP.ct_x + this.y_intercept;
			let y2 = this.slope * rP.ct_x + this.y_intercept;
			
			if( y1<= y2){
				this.range_lower = y1;
				this.range_upper = y2;
			}
			else{
				this.range_lower = y2;
				this.range_upper = y1;				
			}
		}
		
		//console.log( '세타 : ', this.theta  );		
		//console.log( '각도 : ', this.degree );		
		//console.log( '기울기 무한대 : ', this.infinite_slope );
		//
		//console.log( 'x1 x2 : ', this.pA.ct_x , this.pB.ct_x);
		//console.log( '기울기:', this.slope);
		//console.log( 'Y떡   :', this.y_intercept);
		//console.log( '정의역:', this.domain_lower, this.domain_upper);
		//console.log( '치역:', this.range_lower, this.range_upper);		
		//console.log( 'X떡   :', this.x_intercept);		
		
	}
	
	update_symbol(p_dir){
		////////////////////////////////////////////////////////////////
		let rad = 0;
		
		if( p_dir == CW ){
			rad = this.theta - Math.PI/2;
		}
		else if( p_dir == CCW ){
			rad = this.theta + Math.PI/2;
		}
		else{
			debugger;
		}
		
		////////////////////////////////////////////////////////////////
		
		//두 점사이의 거리를 계산
		let dist = display_number( this.scs.calc_distance(this.pA,this.pB)	);
		this.distance = dist;
		//this.symbol_obj.update_text('ABCD1234');
		this.symbol_obj.update_text( String(dist) );

		//debugger;
		
		//////{{
		//debugger;
		//{{
		//let R = 1;	//이거를 텍스트 길이에 따라서 동적으로 따줘야 함.
		//}}{{
		let diag   = Math.sqrt((Math.pow(this.symbol_obj.textbox_ct_width/2,2) +  Math.pow(this.symbol_obj.textbox_ct_height/2,2)),2)
		let margin = 0.1;
		
		//let R = diag + margin;
		
		let R = this.calc_symbol_len();
		
		//}}
		
		
		//////}}
		
		let P = this.scs.calc_CircleXY2(this.ct_Mx,this.ct_My,R, rad );
		//let P_vbxy = gscr.get_vb_position(P.x,P.y);
		//
		//debugger;
		
		//
		//this.symbol_obj.update_position(P_vbxy.x,P_vbxy.y);
		this.symbol_obj.update_position(P.x,P.y);
		////////////////////////////////////////////////////////////////
		
		let CC = new c_circumcenter2(this.scs,this.pA.ct_x,this.pA.ct_y, P.x , P.y , this.pB.ct_x , this.pB.ct_y);
		
		this.calc_Q1Q2(this.symbol_obj, CC);
		
		let sweep_val = '0';
		if( p_dir == CW ){
			sweep_val = '0';
		}
		else{
			sweep_val = '1';
		}
		
		//
		let vb_q1= this.scs.get_vb_position( this.Q1.x , this.Q1.y );
		let vb_q2= this.scs.get_vb_position( this.Q2.x , this.Q2.y );
		
		let vb_r = this.scs.get_scr_xy( CC.r ,0);
				
		let arc_str = '';
		arc_str = 'M ' + String(this.pA.vb_x) + ' ' + String( this.pA.vb_y ) + ' ' +
			'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
			'0,' +
			'0,' +
			sweep_val + ',' +
			String(vb_q1.x) + ' ' + String(vb_q1.y);		
		
		this.Q1_arc.setAttribute('d',arc_str);
		
		
		arc_str = 'M ' + String(vb_q2.x) + ' ' + String( vb_q2.y ) + ' ' +
			'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
			'0,' +
			'0,' +
			sweep_val + ',' +
			String(this.pB.vb_x) + ' ' + String(this.pB.vb_y);			
		this.Q2_arc.setAttribute('d',arc_str);
	}
	
	calc_symbol_len(){
		//let R = 1;	//이거를 텍스트 길이에 따라서 동적으로 따줘야 함.
		//}}{{
		
		//debugger;
		
		let diag   = Math.sqrt((Math.pow(this.symbol_obj.textbox_ct_width/2,2) +  Math.pow(this.symbol_obj.textbox_ct_height/2,2)),2)

		
		//let R = diag + margin;		
		
		let t1 = this.theta;
				                                                                                  
		let t2 = this.calc_rad_2point(0,0,this.symbol_obj.textbox_ct_width,this.symbol_obj.textbox_ct_height);
				
		let t = 0;
		if( this.slope < 0 ){
			t = Math.PI-t1+t2;
		}
		else{
			t = t1+t2;
		}
		
		//{{debug
		let deg = this.scs.calc_rad2deg(t);
		//}}debug
		
		let ret = Math.abs(diag * Math.sin( t ));
		
		//let margin = 0.1;
		//let margin = 0;
		let margin = this.symbol_obj.textbox_ct_height;
		ret = ret + margin;
		
		return ret;
		
	}
	
	//두 점 사이의 각도를 계산, O를 중심으로 X축과 이루는 각도
	calc_rad_2point(p_Ox,p_Oy,p_Qx,p_Qy){
		let Px = p_Qx - p_Ox;
		let Py = p_Qy - p_Oy;
		
		let rad = Math.atan2(Py,Px);
		return rad;
	}		
	
	calc_Q1Q2(p_symbol,p_CC){
		let Ox = p_CC.Ox;
		let Oy = p_CC.Oy;
		let r  = p_CC.r;		
		
		let x1 = p_symbol.ct_x1;
		let x2 = p_symbol.ct_x2;
		
		let y2 = p_symbol.ct_y2;
		let y1 = p_symbol.ct_y1;

		////////////////////////////////////////////
		let vp = [];	//valid point

		////////////////////////////////////////////////////////////////////
		let det = Math.pow(r,2) - Math.pow( (y1-Oy) , 2);
		
		if( det>=0 ){
			let xx1 = Ox - Math.sqrt(det);
			
			if( x1<= xx1 && xx1<= x2){
				vp.push( {x:xx1,y:y1} );
			}
			
			if( det>0 ){
				let xx2 = Ox + Math.sqrt(det);
				
				if( x1<= xx2 && xx2<= x2){
					vp.push( {x:xx2,y:y1} );
				}	
			}
		}
		
		////////////////////////////////////////////////////////////////////
		det = Math.pow(r,2) - Math.pow( (y2-Oy) , 2);

		if( det>=0 ){
			let xx1 = Ox - Math.sqrt(det);
			
			if( x1<= xx1 && xx1<= x2){
				vp.push( {x:xx1,y:y2} );
			}
			
			if( det>0 ){
				let xx2 = Ox + Math.sqrt(det);
				
				if( x1<= xx2 && xx2<= x2){
					vp.push( {x:xx2,y:y2} );
				}	
			}		
		}
		
		////////////////////////////////////////////////////////////////////
		
		det = Math.pow(r,2) - Math.pow( (x1-Ox) , 2);
		
		let yy1 =  0; 
		let yy2 = 0 ; 
		
		if( det>=0 ){
			yy1 = Oy + Math.sqrt(det );
			
			if( y2<= yy1 && yy1<= y1){
				vp.push( {x:x1,y:yy1} );
			}		
			
			if( det>0){
				yy2 = Oy - Math.sqrt(det );
		
				if( y2<= yy2 && yy2<= y1){
					vp.push( {x:x1,y:yy2} );
				}	
			}
		}
		////////////////////////////////////////////////////////////////////

		det = Math.pow(r,2) - Math.pow( (x2-Ox) , 2);
		
		if( det>=0 ){
			yy1 =  Oy + Math.sqrt(det );
			
			if( y2<= yy1 && yy1<= y1){
				vp.push( {x:x2,y:yy1} );
			}		
			
			if( det>0 ){
				yy2 =  Oy - Math.sqrt(det );
				
				if( y2<= yy2 && yy2<= y1){
					vp.push( {x:x2,y:yy2} );
				}	
							
			}
		}		
		////////////////////////////////////////////////////////////////////
		let dist1 = 0;
		//약간 문제 
		try{
			dist1 = dist( vp[0].x, vp[0].y, this.pA.ct_x, this.pA.ct_y);
		}
		catch(error){
			//debugger;
		}
		let dist2 = dist( vp[1].x, vp[1].y, this.pA.ct_x, this.pA.ct_y);
		
		if( dist1 <= dist2){
			this.Q1.x = vp[0].x;
			this.Q1.y = vp[0].y;

			this.Q2.x = vp[1].x;
			this.Q2.y = vp[1].y;			
		}
		else{
			this.Q1.x = vp[1].x;
			this.Q1.y = vp[1].y;			
			
			this.Q2.x = vp[0].x;
			this.Q2.y = vp[0].y;			
		}
		

	}
}

class c_line_old{
	scs = null;	//screen coordinate system(스크린 좌표계)
	
	line_obj = null;
	path_obj = null;
	arc_obj  = null;
	arc_obj2 = null;
	
	symbol_obj = null;
	Q1 = null;
	Q2 = null;
	
	Q1_arc = null;
	Q2_arc = null;
	
	//control
	theta 	= 0;
	degree 	= 0;
	slope	= 0;
	infinite_slope = false;
	y_intercept = 0;	//y절편, x가 0일 때 -> y=ax+b에서 b
	x_intercept = 0;	//x절편, y가 0일 때
	
	domain_lower = 0;	//정의역
	domain_upper = 0;
	
	range_lower = 0;	//치역
	range_upper = 0;
	
	//점A는 점B는 반시계 방향임(point A,B)
	pA = null;	
	pB = null;
	
	pM = null;
	
	//중점
	ct_Mx = 0;
	ct_My = 0;

	name = '';	//선분'AB'에서 'AB'
	
	constructor(p_scs,p_A,p_B){
		this.scs = p_scs;
		this.pA = p_A;
		this.pB = p_B;
		
		this.Q1 = {x:0,y:0};
		this.Q2 = {x:0,y:0};
				
		
		//점 글자로 이름을 만듬
		this.name = p_A.symbol + p_B.symbol;
	}
	
	init(){
		let path_layer = this.scs.get_layer_path();
		
		this.line_obj = document.createElementNS(SVG_NS,'line');
		path_layer.appendChild( this.line_obj );
		
		//{{
		//this.path_obj = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.path_obj );
		//
		//this.arc_obj = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.arc_obj );		
		//
		//this.arc_obj2 = document.createElementNS(SVG_NS,'path');
		//path_layer.appendChild( this.arc_obj2 );				
		//}}
		
		//
		//선길이 표시 
		let length_arc_layer = this.scs.get_layer_length_arc();
		
		//<path id='arc2' class='bg_red'></path>	
		this.Q1_arc = document.createElementNS(SVG_NS,'path');
		//this.Q1_arc.setAttribute('class','');
		length_arc_layer.appendChild( this.Q1_arc );				

		//<path id='arc1' class='bg_red'></path>
		this.Q2_arc = document.createElementNS(SVG_NS,'path');
		//this.Q2_arc.setAttribute('class','');
		length_arc_layer.appendChild( this.Q2_arc );				
		//
		
		this.pM = new c_point(gscr, 0,0,this.name + '_M',false,null);	
		this.pM.init();		
		
		this.symbol_obj = new c_line_symbol();
		this.symbol_obj.init(this.scs);		
		
	}
	
	hide(){
		this.line_obj.setAttribute('visibility','hidden');
		this.pM.hide();
	}
	
	show(){
		this.line_obj.setAttribute('visibility','visible');
		this.pM.show();
	}	
	
	show_M(){
		this.pM.show();
	}
	
	hide_M(){
		this.pM.hide();
	}
	
	update(){
		this.update_internal();
		
		this.line_obj.setAttribute('x1',String( this.pA.vb_x));
		this.line_obj.setAttribute('y1',String( this.pA.vb_y));
		this.line_obj.setAttribute('x2',String( this.pB.vb_x));
		this.line_obj.setAttribute('y2',String( this.pB.vb_y));
		
		//중점
		//let vbxy = this.scs.get_vb_position(this.ct_Mx,this.ct_My);
		//this.pM.update_position(vbxy.x,vbxy.y,this.ct_Mx,this.ct_My);
		this.pM.update_position2(this.ct_Mx,this.ct_My);
		
		//let path_str = 'M ' + String(this.pA.vb_x) + ' ' + String(this.pA.vb_y) + ' l 0 100';
		//let path_str = 'M 100,200 C 100,100 300,100 300,200';
		//let path_str = 'M 100,200 C 100,100 300,100 300,200';
		//let path_str = 'M 100 200 C 200 150, 200 150, 300 200';
		
		
		//let path_str = 'M 100 200 Q 200 100, 300 200';
		//this.path_obj.setAttribute('d',path_str);
		//
		//let arc_str2 = 'M 100 200 C 130 170, 170 150, 200 150';
		//this.arc_obj2.setAttribute('d',arc_str2);		
		
		
		//let arc_str = 'M 100 200 A 150,150 0 0,0 300 200';
		//this.arc_obj.setAttribute('d',arc_str);		
	}
	
	update_internal(){
		this.theta  = this.scs.calc_radian(this.pA,this.pB);
		this.degree = this.scs.calc_rad2deg( this.theta);

		////////////////////////////////////////////////////////////////
		//                                                            //
		//                중점                                        //
		//                                                            //
		this.ct_Mx = (this.pA.ct_x + this.pB.ct_x)/2;		
		this.ct_My = (this.pA.ct_y + this.pB.ct_y)/2;		

		//                                                            //
		//                중점                                        //
		//                                                            //
		////////////////////////////////////////////////////////////////
		
		//기울기 무한대인지 체크
		if( this.degree == 90 || this.degree == -90){
			this.infinite_slope = true;
		}
		else{
			this.infinite_slope = false;
		}
		
		//
		
		if( this.infinite_slope ){
			let uP = null; 	//더 위쪽에 있는 점
			let dP = null;	//더 아래에 있는 점
			
			if( this.pA.ct_y <= this.pB.ct_y){
				dP = this.pA;
				uP = this.pB;
			}
			else{
				dP = this.pB;
				uP = this.pA;
			}			
			
			this.x_intercept = dP.ct_x;
			
			//정의역
			this.domain_lower = this.x_intercept;
			this.domain_upper = this.x_intercept;			
			
			//치역
			this.range_lower = dP.ct_y;
			this.range_upper = uP.ct_y;			
			
		}
		else{	//기울기가 무한대가 아닐 때
			let lP = null;	//더 왼쪽에 있는 점
			let rP = null; 	//더 오른쪽에 있는 점
			
			if( this.pA.ct_x <= this.pB.ct_x){
				lP = this.pA;
				rP = this.pB;
			}
			else{
				lP = this.pB;
				rP = this.pA;
			}
			
			//기울기,y떡
			this.slope = (rP.ct_y - lP.ct_y)/(rP.ct_x - lP.ct_x);
			this.y_intercept = rP.ct_y - ( this.slope*rP.ct_x);	//b
			this.x_intercept = -this.y_intercept/this.slope;
			
			//정의역
			this.domain_lower = lP.ct_x;
			this.domain_upper = rP.ct_x;
			
			//치역
			let y1 = this.slope * lP.ct_x + this.y_intercept;
			let y2 = this.slope * rP.ct_x + this.y_intercept;
			
			if( y1<= y2){
				this.range_lower = y1;
				this.range_upper = y2;
			}
			else{
				this.range_lower = y2;
				this.range_upper = y1;				
			}
		}
		
		//console.log( '세타 : ', this.theta  );		
		//console.log( '각도 : ', this.degree );		
		//console.log( '기울기 무한대 : ', this.infinite_slope );
		//
		//console.log( 'x1 x2 : ', this.pA.ct_x , this.pB.ct_x);
		//console.log( '기울기:', this.slope);
		//console.log( 'Y떡   :', this.y_intercept);
		//console.log( '정의역:', this.domain_lower, this.domain_upper);
		//console.log( '치역:', this.range_lower, this.range_upper);		
		//console.log( 'X떡   :', this.x_intercept);		
		
	}
	
	update_symbol(p_dir){
		////////////////////////////////////////////////////////////////
		let rad = 0;
		
		if( p_dir == CW ){
			rad = this.theta - Math.PI/2;
		}
		else if( p_dir == CCW ){
			rad = this.theta + Math.PI/2;
		}
		else{
			debugger;
		}
		
		////////////////////////////////////////////////////////////////
		
		//두 점사이의 거리를 계산
		let dist = display_number( this.scs.calc_distance(this.pA,this.pB)	);
		//this.symbol_obj.update_text('ABCD1234');
		this.symbol_obj.update_text( String(dist) );

		//debugger;
		
		//////{{
		//debugger;
		//{{
		//let R = 1;	//이거를 텍스트 길이에 따라서 동적으로 따줘야 함.
		//}}{{
		let diag   = Math.sqrt((Math.pow(this.symbol_obj.textbox_ct_width/2,2) +  Math.pow(this.symbol_obj.textbox_ct_height/2,2)),2)
		let margin = 0.1;
		
		//let R = diag + margin;
		
		let R = this.calc_symbol_len();
		
		//}}
		
		
		//////}}
		
		let P = this.scs.calc_CircleXY2(this.ct_Mx,this.ct_My,R, rad );
		//let P_vbxy = gscr.get_vb_position(P.x,P.y);
		//
		//debugger;
		
		//
		//this.symbol_obj.update_position(P_vbxy.x,P_vbxy.y);
		this.symbol_obj.update_position(P.x,P.y);
		////////////////////////////////////////////////////////////////
		
		let CC = new c_circumcenter2(this.scs,this.pA.ct_x,this.pA.ct_y, P.x , P.y , this.pB.ct_x , this.pB.ct_y);
		
		this.calc_Q1Q2(this.symbol_obj, CC);
		
		let sweep_val = '0';
		if( p_dir == CW ){
			sweep_val = '0';
		}
		else{
			sweep_val = '1';
		}
		
		//
		let vb_q1= this.scs.get_vb_position( this.Q1.x , this.Q1.y );
		let vb_q2= this.scs.get_vb_position( this.Q2.x , this.Q2.y );
		
		let vb_r = this.scs.get_scr_xy( CC.r ,0);
				
		let arc_str = '';
		arc_str = 'M ' + String(this.pA.vb_x) + ' ' + String( this.pA.vb_y ) + ' ' +
			'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
			'0,' +
			'0,' +
			sweep_val + ',' +
			String(vb_q1.x) + ' ' + String(vb_q1.y);		
		
		this.Q1_arc.setAttribute('d',arc_str);
		
		
		arc_str = 'M ' + String(vb_q2.x) + ' ' + String( vb_q2.y ) + ' ' +
			'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
			'0,' +
			'0,' +
			sweep_val + ',' +
			String(this.pB.vb_x) + ' ' + String(this.pB.vb_y);			
		this.Q2_arc.setAttribute('d',arc_str);
	}
	
	calc_symbol_len(){
		//let R = 1;	//이거를 텍스트 길이에 따라서 동적으로 따줘야 함.
		//}}{{
		
		//debugger;
		
		let diag   = Math.sqrt((Math.pow(this.symbol_obj.textbox_ct_width/2,2) +  Math.pow(this.symbol_obj.textbox_ct_height/2,2)),2)

		
		//let R = diag + margin;		
		
		let t1 = this.theta;
				                                                                                  
		let t2 = this.calc_rad_2point(0,0,this.symbol_obj.textbox_ct_width,this.symbol_obj.textbox_ct_height);
				
		let t = 0;
		if( this.slope < 0 ){
			t = Math.PI-t1+t2;
		}
		else{
			t = t1+t2;
		}
		
		//{{debug
		let deg = this.scs.calc_rad2deg(t);
		//}}debug
		
		let ret = Math.abs(diag * Math.sin( t ));
		
		//let margin = 0.1;
		//let margin = 0;
		let margin = this.symbol_obj.textbox_ct_height;
		ret = ret + margin;
		
		return ret;
		
	}
	
	//두 점 사이의 각도를 계산, O를 중심으로 X축과 이루는 각도
	calc_rad_2point(p_Ox,p_Oy,p_Qx,p_Qy){
		let Px = p_Qx - p_Ox;
		let Py = p_Qy - p_Oy;
		
		let rad = Math.atan2(Py,Px);
		return rad;
	}		
	
	calc_Q1Q2(p_symbol,p_CC){
		let Ox = p_CC.Ox;
		let Oy = p_CC.Oy;
		let r  = p_CC.r;		
		
		let x1 = p_symbol.ct_x1;
		let x2 = p_symbol.ct_x2;
		
		let y2 = p_symbol.ct_y2;
		let y1 = p_symbol.ct_y1;

		////////////////////////////////////////////
		let vp = [];	//valid point

		////////////////////////////////////////////////////////////////////
		let det = Math.pow(r,2) - Math.pow( (y1-Oy) , 2);
		
		if( det>=0 ){
			let xx1 = Ox - Math.sqrt(det);
			
			if( x1<= xx1 && xx1<= x2){
				vp.push( {x:xx1,y:y1} );
			}
			
			if( det>0 ){
				let xx2 = Ox + Math.sqrt(det);
				
				if( x1<= xx2 && xx2<= x2){
					vp.push( {x:xx2,y:y1} );
				}	
			}
		}
		
		////////////////////////////////////////////////////////////////////
		det = Math.pow(r,2) - Math.pow( (y2-Oy) , 2);

		if( det>=0 ){
			let xx1 = Ox - Math.sqrt(det);
			
			if( x1<= xx1 && xx1<= x2){
				vp.push( {x:xx1,y:y2} );
			}
			
			if( det>0 ){
				let xx2 = Ox + Math.sqrt(det);
				
				if( x1<= xx2 && xx2<= x2){
					vp.push( {x:xx2,y:y2} );
				}	
			}		
		}
		
		////////////////////////////////////////////////////////////////////
		
		det = Math.pow(r,2) - Math.pow( (x1-Ox) , 2);
		
		let yy1 =  0; 
		let yy2 = 0 ; 
		
		if( det>=0 ){
			yy1 = Oy + Math.sqrt(det );
			
			if( y2<= yy1 && yy1<= y1){
				vp.push( {x:x1,y:yy1} );
			}		
			
			if( det>0){
				yy2 = Oy - Math.sqrt(det );
		
				if( y2<= yy2 && yy2<= y1){
					vp.push( {x:x1,y:yy2} );
				}	
			}
		}
		////////////////////////////////////////////////////////////////////

		det = Math.pow(r,2) - Math.pow( (x2-Ox) , 2);
		
		if( det>=0 ){
			yy1 =  Oy + Math.sqrt(det );
			
			if( y2<= yy1 && yy1<= y1){
				vp.push( {x:x2,y:yy1} );
			}		
			
			if( det>0 ){
				yy2 =  Oy - Math.sqrt(det );
				
				if( y2<= yy2 && yy2<= y1){
					vp.push( {x:x2,y:yy2} );
				}	
							
			}
		}		
		////////////////////////////////////////////////////////////////////
		
		//약간 문제 
		let dist1 = dist( vp[0].x, vp[0].y, this.pA.ct_x, this.pA.ct_y);
		let dist2 = dist( vp[1].x, vp[1].y, this.pA.ct_x, this.pA.ct_y);
		
		if( dist1 <= dist2){
			this.Q1.x = vp[0].x;
			this.Q1.y = vp[0].y;

			this.Q2.x = vp[1].x;
			this.Q2.y = vp[1].y;			
		}
		else{
			this.Q1.x = vp[1].x;
			this.Q1.y = vp[1].y;			
			
			this.Q2.x = vp[0].x;
			this.Q2.y = vp[0].y;			
		}
		

	}
	
	
}

////////////////////////////////////////////////////////

//const ANGLE_R = 0.3;		//점 반지름
const ANGLE_R = 0.3;		//점 반지름
const ANGLE_TXT_R = 0.4;

class c_angle{
	scs = null;	//screen coordinate system(스크린 좌표계)
	
	l1 = null;	//CCW 회전에서 각이 더 큰 선분
	l2 = null;
	
	l1_theta = 0;
	l2_theta = 0;
	avg_theta = 0;
	
	l1_deg = 0;
	l2_deg = 0;
	avg_deg = 0;
	opposite_avg = 0;
	
	theta = 0;
	deg   = 0;
	
	Ox = 0;
	Oy = 0;
	
	right_angle = false;	//90도이면 true
	right_ang_len = 0;
	
	path_obj = null;
	bg_obj = null;
	
	symbol_obj = null;
	
	constructor(p_line1,p_line2,p_scs){
		this.scs = p_scs;
		
		this.l1 = p_line1;
		this.l2 = p_line2;
		
		this.right_ang_len = ANGLE_R / Math.sqrt(2);
		
		
		let ang_layer = this.scs.get_layer_angle();
		//console.log(ang_layer);
		
		this.path_obj = document.createElementNS(SVG_NS,'path');
		this.path_obj.setAttribute('class','c_angle');
		ang_layer.appendChild(this.path_obj);
		
		////-------------->
		//let bg_layer = this.scs.get_layer_bg();
		//this.bg_obj = document.createElementNS(SVG_NS,'circle');
		//this.bg_obj.setAttribute('class','bg_blue');
		//bg_layer.appendChild( this.bg_obj );
		
		//
		this.symbol_obj = new c_angle_symbol();
		this.symbol_obj.init(this.scs);
		//
		
	}
	
	normal_angle(p_ang){
		let quotient = p_ang / 360; //몫
		let valid_quotient = Math.floor(quotient);
		let valid_deg = valid_quotient * -360 + p_ang;	

		return valid_deg;
	}
	
	normal_rad(p_rad){
		let quotient = p_rad / (2*Math.PI); //몫
		let valid_quotient = Math.floor(quotient);
		let valid_rad = valid_quotient * (-2*Math.PI) + p_rad;	

		return valid_rad;		
	}
	
	normal_sign_rad(p_rad){
		let rad = this.normal_rad(p_rad);
		
		if( rad> Math.PI){
			rad += (-2*Math.PI);
		}
		
		return rad;
	}
	
	hide(){
		this.path_obj.setAttribute('visibility','hidden');
		this.symbol_obj.hide();
	}
	
	show(){
		this.path_obj.setAttribute('visibility','visible');
		this.symbol_obj.show();
	}	
	
	update(){
		//{{
		//this.deg = (this.l1.degree - 180) - this.l2.degree;
		////this.l1_deg = this.l1.degree-180;
		//this.l1_deg = this.normal_angle( this.l1.degree-180);
		//}}{{
		this.deg = this.l1.get_reverse_degree() - this.l2.get_degree();
		
		//normal_angle은 없애고...
		//this.l1_deg = this.normal_angle( this.l1.get_reverse_degree() );
		this.l1_deg = this.scs.normal_degree( this.l1.get_reverse_degree() );
		//}}
		
		//{{
		////this.l2_deg = this.l2.degree;
		////debugger;
		//this.l2_deg = this.normal_angle( this.l2.degree );
		//}}{{
		this.l2_deg = this.scs.normal_degree( this.l2.get_degree() );	
		//}}

		/////////////////////////////////////////////
		//this.avg_deg = (this.l1_deg + this.l2_deg) / 2;
		
		//{{
		//console.log('----------------------------');
		////console.log('각도1 : ',this.l1_deg);
		////console.log('각도2 : ',this.l2_deg);
		//
		//console.log('각도  : ',this.deg);
		//let quotient = this.deg / 360; //몫
		//let valid_quotient = Math.floor(quotient);
		//let valid_deg = valid_quotient * -360 + this.deg;
		//
		//if( valid_deg > 180){
		//	valid_deg += -360
		//}
		//
		////console.log('몫  : ',quotient);
		////console.log('몫  : ',valid_quotient);
		//console.log('유효각도  : ',valid_deg);
		//}}{{
		this.deg = this.scs.normal_degree( this.deg );
		//}}
		
		
		//{{
		//this.l1_theta = this.l1.theta - Math.PI;
		//this.l2_theta = this.l2.theta;
		//}}{{
		
		//{{
		//this.l1_theta = this.normal_rad(this.l1.theta - Math.PI);
		//this.l2_theta = this.normal_rad(this.l2.theta);
		//this.theta = this.normal_sign_rad( this.l1_theta - this.l2_theta );
		//}}{{
		this.l1_theta = this.scs.calc_deg2rad( this.l1_deg );
		this.l2_theta = this.scs.calc_deg2rad( this.l2_deg );
		this.theta    = this.scs.calc_deg2rad( this.deg    );
		//}}
		
		let half_theta = this.theta /2;
		//}}
		
		////console.log('[radian]');
		//console.log('각도1 : ',this.scs.calc_rad2deg(this.l1_theta));
		//console.log('각도2 : ',this.scs.calc_rad2deg(this.l2_theta));
		////console.log('각도  : ',this.theta);		
		//console.log('각도  : ',this.scs.calc_rad2deg( this.theta));

		this.Ox = this.l2.pA.ct_x;
		this.Oy = this.l2.pA.ct_y;
		
		//{{
		//this.avg_theta = (this.l1_theta+this.l2_theta)/2;
		//}}{{
		this.avg_theta = this.l2_theta + half_theta;
		//this.avg_theta = this.l2_theta + half_theta + Math.PI;
		this.opposite_avg = this.avg_theta + Math.PI;
		
		
		//point_A.symbol_obj.update_rotate( this.scs.calc_rad2deg(this.opposite_avg ));
		//debugger;
		
		//}}
		
		
		//console.log(this.scs.calc_rad2deg( this.avg_theta));
		let PM = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_TXT_R,this.avg_theta);
		let PM_vbxy = gscr.get_vb_position(PM.x,PM.y);
		
		//{{
		//point_M.update_position(PM_vbxy.x,PM_vbxy.y, PM.x,PM.y);	
		//}}{{
		//let ang_txt = document.getElementById('xxxx');
		//ang_txt.setAttribute('transform','translate(' + String(PM_vbxy.x) + ',' + String(PM_vbxy.y) + ')');
		//}}{{
		this.symbol_obj.update_vb_xy(PM_vbxy.x,PM_vbxy.y);
		//}}
		
		//{{
		//let atat = document.getElementById('yyyy');
		//}}
		
		//atat.textContent = '1818';
		//atat.textContent = String( this.scs.calc_rad2deg( Math.abs(this.theta) ) );
		
		let dp_ang = display_number( this.scs.calc_rad2deg( Math.abs(this.theta) ) );
		//atat.textContent = display_number( this.scs.calc_rad2deg( Math.abs(this.theta) ) ) + '°';
		
		let str_dp_ang = String( dp_ang ) + '°';
		
		this.right_angle = false;
		
		if( isInt(dp_ang) ){
			if( dp_ang == 90 ){
				this.right_angle = true;
				//str_dp_ang = '직각';
				str_dp_ang = '';
			}
		}
		
		//{{
		//atat.textContent = str_dp_ang;
		//}}{{
		this.symbol_obj.update_text( str_dp_ang );
		//}}
		
		//console.log(ang_txt);

		
		let P1 = null;
		if( this.right_angle ){
			P1 = this.scs.calc_CircleXY2(this.Ox,this.Oy,this.right_ang_len,this.l1_theta);
		}
		else{
			P1 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.l1_theta);
		}
		
		//{{debug
		//console.log(point_P1);
		
		//let vb_xy1 = gscr.get_vb_position(P1.x,P1.y);
		let vb_xy1 = this.scs.get_vb_position(P1.x,P1.y);
		
		//point_P1.update_position(vb_xy1.x,vb_xy1.y, P1.x,P1.y);		
		//}}debug 
		
		let P2 = null;
		if( this.right_angle ){
			P2 = this.scs.calc_CircleXY2(this.Ox,this.Oy,this.right_ang_len,this.l2_theta);
		}
		else{
			P2 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.l2_theta);
		}
		
		//{{debug
		//console.log(point_P1);
		let vb_xy2 = gscr.get_vb_position(P2.x,P2.y);
		//point_P2.update_position(vb_xy2.x,vb_xy2.y, P2.x,P2.y);		
		//}}debug 		

		let P3 = null;
		let P3_vbxy = null;
		if( this.right_angle ){
			P3 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.avg_theta);
			P3_vbxy = this.scs.get_vb_position(P3.x,P3.y);
			//console.log('----------P3---------');
			//console.log(P3);
			//console.log(P3_vbxy);
		}

		
		//{{debug
		//let bg_circle = document.getElementById('a_angle');
		
		let Oxy_vb = gscr.get_vb_position(this.Ox,this.Oy);
		
		//bg_circle.setAttribute('cx',Oxy_vb.x);
		//bg_circle.setAttribute('cy',Oxy_vb.y);
		
		//this.bg_obj.setAttribute('cx',Oxy_vb.x);		//-------------->
		//this.bg_obj.setAttribute('cy',Oxy_vb.y);		//-------------->

		//let R_vb = gscr.get_vb_position(ANGLE_R,0);
		let R_vb = this.scs.get_scr_xy(ANGLE_R,0);
		
		//console.log(R_vb);
		//bg_circle.setAttribute('r',R_vb.x);
		
		//this.bg_obj.setAttribute('r',R_vb.x);		//-------------->
		
		//<!-- magenta CCW:작은거-->	
		//<path id='path1' class='bg5' d='
		//	M 100 200 
		//	A 150 150, 
		//	  0,         
		//	  0,         
		//	  0,			
		//	  300,200'
		//	/>			
		
		let sweep_val = 1;
		//{{
		//if( valid_deg<0 ){
		//}}{{
		if( this.deg<0 ){	
		//}}
			sweep_val = 0;
		}
		
		//let arc = document.getElementById('path1');
		let arc = this.path_obj;
		//debugger;
		
		//let arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
		//	'A ' + String(R_vb.x) + ' ' + String(R_vb.x) + ',' +
		//	'0,' +
		//	'0,' +
		//	'1,' +
		//	String(vb_xy2.x) + ' ' + String(vb_xy2.y) + 
		//	'L ' + String(Oxy_vb.x) + ' ' + String(Oxy_vb.y) ;
		
		if( this.right_angle ){
			//arc.setAttribute('class','bg_red');
			this.path_obj.setAttribute('class','bg_red');
		}
		else{
			if( dp_ang<90 ){
				//arc.setAttribute('class','bg_fill_sky');
				this.path_obj.setAttribute('class','bg_fill_sky');
			}
			else{
				//arc.setAttribute('class','bg_fill_magenta');
				this.path_obj.setAttribute('class','bg_fill_magenta');
			}
		}
		
		let arc_str = '';
		
		if( this.right_angle ){
			arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
				'L ' + String( P3_vbxy.x ) + ' ' + String( P3_vbxy.y ) + ' ' + 
				'L ' + String( vb_xy2.x ) + ' ' + String( vb_xy2.y ) + ' '  + 
				'L ' + String( Oxy_vb.x ) + ' ' + String( Oxy_vb.y ) + ' '  ;
		}
		else{
			arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
				'A ' + String(R_vb.x) + ' ' + String(R_vb.x) + ',' +
				'0,' +
				'0,' +
				sweep_val + ',' +
				String(vb_xy2.x) + ' ' + String(vb_xy2.y) + 
				'L ' + String(Oxy_vb.x) + ' ' + String(Oxy_vb.y) ;		
		}
		//arc.setAttribute('d',arc_str);
		this.path_obj.setAttribute('d',arc_str);
		//let arc_str = 'M ' + String(Oxy_vb.x) + ' ' + String( Oxy_vb.y ) + ' ';
		
		//}}debug
		
	}
	
}

class c_angle_v1{
	scs = null;	//screen coordinate system(스크린 좌표계)
	
	l1 = null;	//CCW 회전에서 각이 더 큰 선분
	l2 = null;
	
	l1_theta = 0;
	l2_theta = 0;
	avg_theta = 0;
	
	l1_deg = 0;
	l2_deg = 0;
	avg_deg = 0;
	opposite_avg = 0;
	
	theta = 0;
	deg   = 0;
	
	Ox = 0;
	Oy = 0;
	
	right_angle = false;	//90도이면 true
	right_ang_len = 0;
	
	path_obj = null;
	bg_obj = null;
	
	symbol_obj = null;
	
	constructor(p_line1,p_line2,p_scs){
		this.scs = p_scs;
		
		this.l1 = p_line1;
		this.l2 = p_line2;
		
		this.right_ang_len = ANGLE_R / Math.sqrt(2);
		
		
		let ang_layer = this.scs.get_layer_angle();
		//console.log(ang_layer);
		
		this.path_obj = document.createElementNS(SVG_NS,'path');
		this.path_obj.setAttribute('class','c_angle');
		ang_layer.appendChild(this.path_obj);
		
		////-------------->
		//let bg_layer = this.scs.get_layer_bg();
		//this.bg_obj = document.createElementNS(SVG_NS,'circle');
		//this.bg_obj.setAttribute('class','bg_blue');
		//bg_layer.appendChild( this.bg_obj );
		
		//
		this.symbol_obj = new c_angle_symbol();
		this.symbol_obj.init(this.scs);
		//
		
	}
	
	normal_angle(p_ang){
		let quotient = p_ang / 360; //몫
		let valid_quotient = Math.floor(quotient);
		let valid_deg = valid_quotient * -360 + p_ang;	

		return valid_deg;
	}
	
	normal_rad(p_rad){
		let quotient = p_rad / (2*Math.PI); //몫
		let valid_quotient = Math.floor(quotient);
		let valid_rad = valid_quotient * (-2*Math.PI) + p_rad;	

		return valid_rad;		
	}
	
	normal_sign_rad(p_rad){
		let rad = this.normal_rad(p_rad);
		
		if( rad> Math.PI){
			rad += (-2*Math.PI);
		}
		
		return rad;
	}
	
	hide(){
		this.path_obj.setAttribute('visibility','hidden');
		this.symbol_obj.hide();
	}
	
	show(){
		this.path_obj.setAttribute('visibility','visible');
		this.symbol_obj.show();
	}	
	
	update(){
		this.deg = (this.l1.degree - 180) - this.l2.degree;
		//this.l1_deg = this.l1.degree-180;
		this.l1_deg = this.normal_angle( this.l1.degree-180);
		
		//this.l2_deg = this.l2.degree;
		//debugger;
		this.l2_deg = this.normal_angle( this.l2.degree );
		
		/////////////////////////////////////////////
		//this.avg_deg = (this.l1_deg + this.l2_deg) / 2;
		
		
		console.log('----------------------------');
		//console.log('각도1 : ',this.l1_deg);
		//console.log('각도2 : ',this.l2_deg);
		
		console.log('각도  : ',this.deg);
		let quotient = this.deg / 360; //몫
		let valid_quotient = Math.floor(quotient);
		let valid_deg = valid_quotient * -360 + this.deg;
		
		if( valid_deg > 180){
			valid_deg += -360
		}
		
		//console.log('몫  : ',quotient);
		//console.log('몫  : ',valid_quotient);
		console.log('유효각도  : ',valid_deg);
		
		
		
		//{{
		//this.l1_theta = this.l1.theta - Math.PI;
		//this.l2_theta = this.l2.theta;
		//}}{{
		this.l1_theta = this.normal_rad(this.l1.theta - Math.PI);
		this.l2_theta = this.normal_rad(this.l2.theta);
		this.theta = this.normal_sign_rad( this.l1_theta - this.l2_theta );
		let half_theta = this.theta /2;
		//}}
		
		//console.log('[radian]');
		console.log('각도1 : ',this.scs.calc_rad2deg(this.l1_theta));
		console.log('각도2 : ',this.scs.calc_rad2deg(this.l2_theta));
		//console.log('각도  : ',this.theta);		
		console.log('각도  : ',this.scs.calc_rad2deg( this.theta));

		this.Ox = this.l2.pA.ct_x;
		this.Oy = this.l2.pA.ct_y;
		
		//{{
		//this.avg_theta = (this.l1_theta+this.l2_theta)/2;
		//}}{{
		this.avg_theta = this.l2_theta + half_theta;
		//this.avg_theta = this.l2_theta + half_theta + Math.PI;
		this.opposite_avg = this.avg_theta + Math.PI;
		
		
		//point_A.symbol_obj.update_rotate( this.scs.calc_rad2deg(this.opposite_avg ));
		//debugger;
		
		//}}
		
		
		//console.log(this.scs.calc_rad2deg( this.avg_theta));
		let PM = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_TXT_R,this.avg_theta);
		let PM_vbxy = gscr.get_vb_position(PM.x,PM.y);
		
		//{{
		//point_M.update_position(PM_vbxy.x,PM_vbxy.y, PM.x,PM.y);	
		//}}{{
		//let ang_txt = document.getElementById('xxxx');
		//ang_txt.setAttribute('transform','translate(' + String(PM_vbxy.x) + ',' + String(PM_vbxy.y) + ')');
		//}}{{
		this.symbol_obj.update_vb_xy(PM_vbxy.x,PM_vbxy.y);
		//}}
		
		//{{
		//let atat = document.getElementById('yyyy');
		//}}
		
		//atat.textContent = '1818';
		//atat.textContent = String( this.scs.calc_rad2deg( Math.abs(this.theta) ) );
		
		let dp_ang = display_number( this.scs.calc_rad2deg( Math.abs(this.theta) ) );
		//atat.textContent = display_number( this.scs.calc_rad2deg( Math.abs(this.theta) ) ) + '°';
		
		let str_dp_ang = String( dp_ang ) + '°';
		
		this.right_angle = false;
		
		if( isInt(dp_ang) ){
			if( dp_ang == 90 ){
				this.right_angle = true;
				//str_dp_ang = '직각';
				str_dp_ang = '';
			}
		}
		
		//{{
		//atat.textContent = str_dp_ang;
		//}}{{
		this.symbol_obj.update_text( str_dp_ang );
		//}}
		
		//console.log(ang_txt);

		
		let P1 = null;
		if( this.right_angle ){
			P1 = this.scs.calc_CircleXY2(this.Ox,this.Oy,this.right_ang_len,this.l1_theta);
		}
		else{
			P1 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.l1_theta);
		}
		
		//{{debug
		//console.log(point_P1);
		
		//let vb_xy1 = gscr.get_vb_position(P1.x,P1.y);
		let vb_xy1 = this.scs.get_vb_position(P1.x,P1.y);
		
		//point_P1.update_position(vb_xy1.x,vb_xy1.y, P1.x,P1.y);		
		//}}debug 
		
		let P2 = null;
		if( this.right_angle ){
			P2 = this.scs.calc_CircleXY2(this.Ox,this.Oy,this.right_ang_len,this.l2_theta);
		}
		else{
			P2 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.l2_theta);
		}
		
		//{{debug
		//console.log(point_P1);
		let vb_xy2 = gscr.get_vb_position(P2.x,P2.y);
		//point_P2.update_position(vb_xy2.x,vb_xy2.y, P2.x,P2.y);		
		//}}debug 		

		let P3 = null;
		let P3_vbxy = null;
		if( this.right_angle ){
			P3 = this.scs.calc_CircleXY2(this.Ox,this.Oy,ANGLE_R,this.avg_theta);
			P3_vbxy = this.scs.get_vb_position(P3.x,P3.y);
			//console.log('----------P3---------');
			//console.log(P3);
			//console.log(P3_vbxy);
		}

		
		//{{debug
		//let bg_circle = document.getElementById('a_angle');
		
		let Oxy_vb = gscr.get_vb_position(this.Ox,this.Oy);
		
		//bg_circle.setAttribute('cx',Oxy_vb.x);
		//bg_circle.setAttribute('cy',Oxy_vb.y);
		
		//this.bg_obj.setAttribute('cx',Oxy_vb.x);		//-------------->
		//this.bg_obj.setAttribute('cy',Oxy_vb.y);		//-------------->

		//let R_vb = gscr.get_vb_position(ANGLE_R,0);
		let R_vb = this.scs.get_scr_xy(ANGLE_R,0);
		
		//console.log(R_vb);
		//bg_circle.setAttribute('r',R_vb.x);
		
		//this.bg_obj.setAttribute('r',R_vb.x);		//-------------->
		
		//<!-- magenta CCW:작은거-->	
		//<path id='path1' class='bg5' d='
		//	M 100 200 
		//	A 150 150, 
		//	  0,         
		//	  0,         
		//	  0,			
		//	  300,200'
		//	/>			
		
		let sweep_val = 1;
		if( valid_deg<0 ){
			sweep_val = 0;
		}
		
		//let arc = document.getElementById('path1');
		let arc = this.path_obj;
		//debugger;
		
		//let arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
		//	'A ' + String(R_vb.x) + ' ' + String(R_vb.x) + ',' +
		//	'0,' +
		//	'0,' +
		//	'1,' +
		//	String(vb_xy2.x) + ' ' + String(vb_xy2.y) + 
		//	'L ' + String(Oxy_vb.x) + ' ' + String(Oxy_vb.y) ;
		
		if( this.right_angle ){
			//arc.setAttribute('class','bg_red');
			this.path_obj.setAttribute('class','bg_red');
		}
		else{
			if( dp_ang<90 ){
				//arc.setAttribute('class','bg_fill_sky');
				this.path_obj.setAttribute('class','bg_fill_sky');
			}
			else{
				//arc.setAttribute('class','bg_fill_magenta');
				this.path_obj.setAttribute('class','bg_fill_magenta');
			}
		}
		
		let arc_str = '';
		
		if( this.right_angle ){
			arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
				'L ' + String( P3_vbxy.x ) + ' ' + String( P3_vbxy.y ) + ' ' + 
				'L ' + String( vb_xy2.x ) + ' ' + String( vb_xy2.y ) + ' '  + 
				'L ' + String( Oxy_vb.x ) + ' ' + String( Oxy_vb.y ) + ' '  ;
		}
		else{
			arc_str = 'M ' + String(vb_xy1.x) + ' ' + String( vb_xy1.y ) + ' ' +
				'A ' + String(R_vb.x) + ' ' + String(R_vb.x) + ',' +
				'0,' +
				'0,' +
				sweep_val + ',' +
				String(vb_xy2.x) + ' ' + String(vb_xy2.y) + 
				'L ' + String(Oxy_vb.x) + ' ' + String(Oxy_vb.y) ;		
		}
		//arc.setAttribute('d',arc_str);
		this.path_obj.setAttribute('d',arc_str);
		//let arc_str = 'M ' + String(Oxy_vb.x) + ' ' + String( Oxy_vb.y ) + ' ';
		
		//}}debug
		
	}
	
}

////////////////////////////////////////////////////////
class c_circumcenter{
	//control
	scs = null;
	
	//각
	aA = null;
	aB = null;
	aC = null;
	
	//선분
	lAB = null;
	lBC = null;
	lCA = null;
	
	//점
	pA = null;
	pB = null;
	pC = null;
	
	//
	bg_circle = null;
	
	Occ = null;
	OxxX = 0;
	OxxY = 0;
	
	//
	radius = 0;	//반지름
	
	constructor(p_CAB,p_ABC,p_BCA,p_scs){
		//control
		this.scs = p_scs;
		
		//각
		this.aA = p_CAB;
		this.aB = p_ABC;
		this.aC = p_BCA;
		
		//선분
		this.lAB = p_CAB.l2;
		this.lBC = p_ABC.l2;
		this.lCA = p_BCA.l2;
		
		//점A
		this.pA = this.lAB.pA;
		this.pB = this.lBC.pA;
		this.pC = this.lCA.pA;

		
		//
		let bg_layer = this.scs.get_layer_bg();

		//<circle id='ccc' cx='200' cy='200' r='100' class='bg_gray' />
		
		//let vb_xy = gscr.get_vb_position(0,0);
		//let R_vb  = gscr.get_scr_xy(1,0);
		
		this.bg_circle = document.createElementNS(SVG_NS,'circle')
		this.bg_circle.setAttribute('id','111111');
		this.bg_circle.setAttribute('class','bg_gray');
		//bg_circle.setAttribute('cx',vb_xy.x);
		//bg_circle.setAttribute('cy',vb_xy.y);		
		//bg_circle.setAttribute('r',R_vb.x);
		bg_layer.appendChild(this.bg_circle);			
		
		//
		this.Occ = new c_point(gscr, 1,1,'Occ',false,null);	
		this.Occ.init();		
	}
	
	update(){
		//외심
		this.OccX = ( this.pA.ct_x * Math.sin( 2*this.aA.theta ) +
					  this.pB.ct_x * Math.sin( 2*this.aB.theta ) +
					  this.pC.ct_x * Math.sin( 2*this.aC.theta ) ) /
				    ( Math.sin( 2*this.aA.theta ) + 
					  Math.sin( 2*this.aB.theta ) +   
					  Math.sin( 2*this.aC.theta ) );
		
		this.OccY = ( this.pA.ct_y * Math.sin( 2*this.aA.theta ) +
				      this.pB.ct_y * Math.sin( 2*this.aB.theta ) +
					  this.pC.ct_y * Math.sin( 2*this.aC.theta ) ) /
				   (  Math.sin( 2*this.aA.theta ) + 
					  Math.sin( 2*this.aB.theta ) +   
					  Math.sin( 2*this.aC.theta ) );
		
		let vb_xy = this.scs.get_vb_position(this.OccX,this.OccY);
		this.Occ.update_position(vb_xy.x,vb_xy.y,this.OccX,this.OccY);

		//반지름
		let OA_ct = this.scs.calc_distance(this.Occ, this.pA);
		//console.log('외심의 반지름ct : ', OA_ct);
		this.radius = OA_ct;	//반지름
		
		let OA_vb = this.scs.get_scr_xy(OA_ct,0);
		//console.log('외심의 반지름vb : ', OA_vb);
		
		//외심원
		//let cccc = document.getElementById('ccc');
		//cccc.setAttribute('cx',point_O.vb_x);
		//cccc.setAttribute('cy',point_O.vb_y);
		//cccc.setAttribute('r',String(OA_vb.x));
		this.bg_circle.setAttribute('cx',vb_xy.x);
		this.bg_circle.setAttribute('cy',vb_xy.y);
		this.bg_circle.setAttribute('r',String(OA_vb.x));
		
		////console.log(cccc);
		//
		////////////////////////////////////////////////
		//
		//
		//gscr.calc_distance(point_A,point_B);
		//gscr.calc_angle(point_A,point_B);
		////console.log('멜롱');
		//
		//
		//let distance = gscr.calc_distance(point_A,point_B);
		//let vb_xy1 = gscr.get_vb_position(-distance/2,0);
		//let vb_xy2 = gscr.get_vb_position(distance/2,0);
		//
		//AA.update_position(vb_xy1.x,200, -distance/2, 0);
		//BB.update_position(vb_xy2.x,200, distance/2, 0);		
		
		
	}
	
}
////////////////////////////////////////////////////////
class c_circumcenter2{
	//control
	scs = null;
	
	//각
	aA = null;
	aB = null;
	aC = null;
	
	//선분
	lAB = null;
	lBC = null;
	lCA = null;
	
	//점
	pA = null;
	pB = null;
	pC = null;
	
	//
	bg_circle = null;
	
	Occ = null;
	OxxX = 0;
	OxxY = 0;
	
	//
	radius = 0;	//반지름
	
	//{{여기는 것이 맞는 것 
	Ox = 0;
	Oy = 0;
	r  = 0;
	//}}
	
	//   X2
	//  /
	// O---X1
	calc_rad(p_X2_x,p_X2_y,p_O_x,p_O_y,p_X1_x,p_X1_y){
		let rX2 = this.calc_rad_2point(p_O_x,p_O_y,p_X2_x,p_X2_y);
		let rX1 = this.calc_rad_2point(p_O_x,p_O_y,p_X1_x,p_X1_y);
		
		let rad = rX2 - rX1;
		return rad;
	}
	
	//두 점 사이의 각도를 계산, O를 중심으로 X축과 이루는 각도
	calc_rad_2point(p_Ox,p_Oy,p_Qx,p_Qy){
		let Px = p_Qx - p_Ox;
		let Py = p_Qy - p_Oy;
		
		let rad = Math.atan2(Py,Px);
		return rad;
	}	
	
	//두 점사이의 거리를 계산
	calc_s(p_Px,p_Py,p_Qx,p_Qy){
		let distance = Math.sqrt( Math.pow((p_Qx - p_Px),2) + Math.pow((p_Qy - p_Py),2) );
		//console.log('거리: ',distance);
		return distance;
	}		
	
	constructor(p_scs,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
		//control
		this.scs = p_scs;
		
		//
		let r_A = this.calc_rad(p_Cx,p_Cy,p_Ax,p_Ay,p_Bx,p_By);
		let r_B = this.calc_rad(p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy);
		let r_C = this.calc_rad(p_Bx,p_By,p_Cx,p_Cy,p_Ax,p_Ay);
		

		//외심
		let Ox = ( p_Ax * Math.sin( 2*r_A ) +
				   p_Bx * Math.sin( 2*r_B ) +
				   p_Cx * Math.sin( 2*r_C ) ) /
			     ( Math.sin( 2*r_A ) + 
				   Math.sin( 2*r_B ) +   
				   Math.sin( 2*r_C ) );
		
		let Oy = ( p_Ay * Math.sin( 2*r_A ) +
				   p_By * Math.sin( 2*r_B ) +
				   p_Cy * Math.sin( 2*r_C ) ) /
				 ( Math.sin( 2*r_A ) + 
				   Math.sin( 2*r_B ) +   
				   Math.sin( 2*r_C ) );
		
		//console.log('******************************');
		//console.log(TCC.OccX,TCC.OccY);
		//console.log(Ox,Oy);
		
		//반지름
		let radiu = this.calc_s(p_Ax,p_Ay,Ox,Oy);
		//console.log(radiu);
		
		//
		this.Ox = Ox;
		this.Oy = Oy;
		
		this.r = radiu;
		
	}
	

	
	//////////////////////////////////////////////////////////
	constructor11(p_CAB,p_ABC,p_BCA,p_scs){
		//control
		this.scs = p_scs;
		
		//각
		this.aA = p_CAB;
		this.aB = p_ABC;
		this.aC = p_BCA;
		
		//선분
		this.lAB = p_CAB.l2;
		this.lBC = p_ABC.l2;
		this.lCA = p_BCA.l2;
		
		//점A
		this.pA = this.lAB.pA;
		this.pB = this.lBC.pA;
		this.pC = this.lCA.pA;

		
		//
		let bg_layer = this.scs.get_layer_bg();

		//<circle id='ccc' cx='200' cy='200' r='100' class='bg_gray' />
		
		//let vb_xy = gscr.get_vb_position(0,0);
		//let R_vb  = gscr.get_scr_xy(1,0);
		
		this.bg_circle = document.createElementNS(SVG_NS,'circle')
		this.bg_circle.setAttribute('id','111111');
		this.bg_circle.setAttribute('class','bg_gray');
		//bg_circle.setAttribute('cx',vb_xy.x);
		//bg_circle.setAttribute('cy',vb_xy.y);		
		//bg_circle.setAttribute('r',R_vb.x);
		bg_layer.appendChild(this.bg_circle);			
		
		//
		this.Occ = new c_point(gscr, 1,1,'Occ',false,null);	
		this.Occ.init();		
	}
	
	update(){
		//외심
		this.OccX = ( this.pA.ct_x * Math.sin( 2*this.aA.theta ) +
					  this.pB.ct_x * Math.sin( 2*this.aB.theta ) +
					  this.pC.ct_x * Math.sin( 2*this.aC.theta ) ) /
				    ( Math.sin( 2*this.aA.theta ) + 
					  Math.sin( 2*this.aB.theta ) +   
					  Math.sin( 2*this.aC.theta ) );
		
		this.OccY = ( this.pA.ct_y * Math.sin( 2*this.aA.theta ) +
				      this.pB.ct_y * Math.sin( 2*this.aB.theta ) +
					  this.pC.ct_y * Math.sin( 2*this.aC.theta ) ) /
				   (  Math.sin( 2*this.aA.theta ) + 
					  Math.sin( 2*this.aB.theta ) +   
					  Math.sin( 2*this.aC.theta ) );
		
		let vb_xy = this.scs.get_vb_position(this.OccX,this.OccY);
		this.Occ.update_position(vb_xy.x,vb_xy.y,this.OccX,this.OccY);

		//반지름
		let OA_ct = this.scs.calc_distance(this.Occ, this.pA);
		//console.log('외심의 반지름ct : ', OA_ct);
		this.radius = OA_ct;	//반지름
		
		let OA_vb = this.scs.get_scr_xy(OA_ct,0);
		//console.log('외심의 반지름vb : ', OA_vb);
		
		//외심원
		//let cccc = document.getElementById('ccc');
		//cccc.setAttribute('cx',point_O.vb_x);
		//cccc.setAttribute('cy',point_O.vb_y);
		//cccc.setAttribute('r',String(OA_vb.x));
		this.bg_circle.setAttribute('cx',vb_xy.x);
		this.bg_circle.setAttribute('cy',vb_xy.y);
		this.bg_circle.setAttribute('r',String(OA_vb.x));
		
		////console.log(cccc);
		//
		////////////////////////////////////////////////
		//
		//
		//gscr.calc_distance(point_A,point_B);
		//gscr.calc_angle(point_A,point_B);
		////console.log('멜롱');
		//
		//
		//let distance = gscr.calc_distance(point_A,point_B);
		//let vb_xy1 = gscr.get_vb_position(-distance/2,0);
		//let vb_xy2 = gscr.get_vb_position(distance/2,0);
		//
		//AA.update_position(vb_xy1.x,200, -distance/2, 0);
		//BB.update_position(vb_xy2.x,200, distance/2, 0);		
		
		
	}
	
}

////////////////////////////////////////////////////////
class c_triangle{
	scs = null;

	pA = null;
	pB = null;
	pC = null;
	
	line_AB = null;
	line_BC = null;
	line_CA = null;
	
	AB = null;
	BC = null;
	CA = null;
	
	constructor(p_scs,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
		this.scs = p_scs;
		
		//this.pA = new c_point(this.scs, p_Ax,p_Ay,'A',true,this.update);	//call-back
		//this.pA = new c_point(this.scs, p_Ax,p_Ay,'A',true,()=>this.update());	//call-back
		this.pA = new c_point(this.scs, p_Ax,p_Ay,'A',true,(p_point)=>this.update(p_point));	//call-back
		//(e)=>this.el_mouseout(e)
		this.pA.init();

		//this.pB = new c_point(this.scs, p_Bx,p_By,'B',true,this.update);	//call-back
		this.pB = new c_point(this.scs, p_Bx,p_By,'B',true,(p_point)=>this.update(p_point));	//call-back
		this.pB.init();

		//this.pC = new c_point(this.scs, p_Cx,p_Cy,'C',true,this.update);	
		this.pC = new c_point(this.scs, p_Cx,p_Cy,'C',true,(p_point)=>this.update(p_point));	
		this.pC.init();		
		
		//직선
		this.line_AB  = new c_line(this.scs,this.pA,this.pB);
		this.line_AB.init();
		//this.line_AB.update();
		this.line_AB.hide_M();
		
		this.line_BC  = new c_line(this.scs,this.pB,this.pC);
		this.line_BC.init();
		//this.line_BC.update();
		this.line_BC.hide_M();

		this.line_CA  = new c_line(this.scs,this.pC,this.pA);
		this.line_CA.init();
		//this.line_CA.update();
		this.line_CA.hide_M();		

		//각도용 
		this.AB = new c_segment(this.scs,this.line_AB,false);
		this.BC = new c_segment(this.scs,this.line_BC,false);
		this.CA = new c_segment(this.scs,this.line_CA,false);
	
		//////////////////////////////////////////////////////////////////////
		////	각CAB
		this.CAB = new c_angle(this.CA,this.AB,this.scs);
		//this.CAB.update();	
		//CAB.hide();
		//
		this.ABC = new c_angle(this.AB,this.BC,this.scs);
		//this.ABC.update();	
		
		this.BCA = new c_angle(this.BC,this.CA,this.scs);
		//this.BCA.update();	
		
		//////////////////////////////////////////////////////////////////////
		this.update(this.pA);	
	
	}
	
	
	update(p_point){
		//debugger;
		
		this.line_AB.update();
		this.line_BC.update();
		this.line_CA.update();
				
		this.CAB.update();
		this.ABC.update();
		this.BCA.update();		
				
		this.pA.symbol_obj.update_rotate( this.scs.calc_rad2deg(this.CAB.opposite_avg ));
		this.pB.symbol_obj.update_rotate( this.scs.calc_rad2deg(this.ABC.opposite_avg ));
		this.pC.symbol_obj.update_rotate( this.scs.calc_rad2deg(this.BCA.opposite_avg ));	
		
		
		//
		let dir = -1;
		if( this.CAB.theta >= 0 ){
			dir = CW;
		}
		else{
			dir = CCW;
		}

		this.line_AB.update_symbol(dir);

		//
		if( this.ABC.theta >= 0 ){
			dir = CW;
		}
		else{
			dir = CCW;
		}
		//BC.update_symbol(dir);
		this.line_BC.update_symbol(dir);

		//
		if( this.BCA.theta >= 0 ){
			dir = CW;
		}
		else{
			dir = CCW;
		}
		//CA.update_symbol(dir);	
		//line_AC.update_symbol(dir);	
		this.line_CA.update_symbol(dir);	
		
		//이등변삼각형 특성표시
		if( this.line_AB.distance == this.line_BC.distance && this.line_AB.distance == this.line_CA.distance){
			//정삼각형
			this.line_AB.show_feature();
			this.line_BC.show_feature();
			this.line_CA.show_feature();
		}
		else{
			//2등변 삼각형
			if(this.line_AB.distance == this.line_BC.distance){
				this.line_AB.show_feature();
				this.line_BC.show_feature();
				this.line_CA.hide_feature();
			}
			else if(this.line_AB.distance == this.line_CA.distance){
				this.line_AB.show_feature();
				this.line_BC.hide_feature();
				this.line_CA.show_feature();
			}
			else if(this.line_BC.distance == this.line_CA.distance){
				this.line_AB.hide_feature();
				this.line_BC.show_feature();
				this.line_CA.show_feature();				
			}
			else{
				this.line_AB.hide_feature();
				this.line_BC.hide_feature();
				this.line_CA.hide_feature();				
			}
		}
		
	}//update
	
}

////////////////////////////////////////////////////////
class c_config{
	//제어용
	platform = null;
	
	e_div = null;
	e_svg = null;

	
	//입력받아야 하는
	inpt_div_name = '';
	
	constructor(){
		this.platform = new c_platform();
		info_update('scr size:' + String(this.platform.width) + ' x ' + String(this.platform.height) );
	}
	
}

////////////////////////////////////////////////////////
function c_point2(){
	this.blah = 'blah';
	this.blahblah = 'blahblah';
}

c_point2.prototype = {
	introduce: function(){
		console.log(this.blah);
	}
}	

	

////////////////////////////////////////////////////////

function gvar_________________________(){}

let gscr = null;
let point_A = null;
let point_B = null;
let point_C = null;

let line_AB  = null;
let line_BC  = null;
let line_CA  = null;
let line_AC  = null;


let AB = null;	//line AB 
//let AC = null;  //line AC - 앞에 있는 점이 기준
let CA = null; 
let BC = null;

let CAB = null;
let ABC = null;
let BCA = null;

let point_P = null;
let point_M = null;

//
let AP = null;
let PB = null;
let BA = null;

let BAP = null;
let APB = null;
let PBA = null;

//
let TCC = null;	//외심
//

let point_R1 = null;
let point_R2 = null;
let point_R3 = null;
let point_R4 = null;

let point_Q1 = null;
let point_Q2 = null;

let point_P1 = null;
let point_P2 = null;

let point_O = null;

let gscr2 = null;
let AA=null;
let BB=null;

let g_trg = null;

let g_config = null;

function init_scs(){
	
	let g_config = new c_config();
	g_config.inpt_div_name = 'svg_wrapper';
	g_config.inpt_width    = 400;
	g_config.inpt_height   = 400;
	
	//customzing
	let cstmz = {
		//width:480,
		//height:480,
		width:400,
		height:400,
		//width:800,
		//height:800,
		
		
		pixelsPerOne:100,	//1은 몇 pixel인가
		//pixelsPerOne:80,	//1은 몇 pixel인가
		
		gridSize:1,			//숫자1마다 grid를 그려라.
		scale:0,
		
		//origin_mode:ORIGIN_USERDEFINED,	//-> 이거해선, origin_x,origin_y 세팅해줘야함
		//origin_mode:ORIGIN_CENTER,	//origin_x,origin_y 세팅 불필요
		origin_mode:ORIGIN_QUAD1,
		origin_x:0,
		origin_y:400
	}
	
	//const ORIGIN_USERDEFINED = 0;
	//const ORIGIN_CENTER = 1;	
	
	gscr = new c_scr_ox();
	//{{debug
	//gscr.init2(g_config);
	//}}debug
	
	gscr.init('mysvg',
		cstmz.width,
		cstmz.height,
		cstmz.pixelsPerOne,
		cstmz.gridSize,
		cstmz.scale,
		cstmz.origin_mode,
		cstmz.origin_x,
		cstmz.origin_y
		);	
}

function init_bg(){
	return;
	
	let bg_layer = gscr.get_layer_bg();
	//console.log(bg_layer);
	

	//<circle id='ccc' cx='200' cy='200' r='100' class='bg_gray' />
	
	let vb_xy = gscr.get_vb_position(0,0);
	let R_vb  = gscr.get_scr_xy(1,0);
	
	let bg_circle = document.createElementNS(SVG_NS,'circle')
	bg_circle.setAttribute('class','bg_gray');
	bg_circle.setAttribute('cx',vb_xy.x);
	bg_circle.setAttribute('cy',vb_xy.y);		
	bg_circle.setAttribute('r',R_vb.x);
	bg_layer.appendChild(bg_circle);	
	
	//debugger;
	
}






function initialize_routine(){
	init_scs();
	init_bg();		
	//debugger;
	////let A_xy = {x:	 0, 	y:1};
	//let A_xy = {x:	 0, 	y:Math.sqrt(3)-1};	//정삼각형
	////let A_xy = {x:	 0, 	y:1};		//이등변삼각형 
	//let B_xy = {x:  -1,  	y:-1};
	//let C_xy = {x:	 1,		y:-1};	

	let A_xy = {x:	 2, 	y:2};		
	let B_xy = {x:   1,  	y:1};
	let C_xy = {x:	 3,		y:1};	

	
	g_trg = new c_triangle(gscr,A_xy.x,A_xy.y,B_xy.x,B_xy.y,C_xy.x,C_xy.y);
	
	info_update('0808: ' + String(window.devicePixelRatio));
}	

function initialize_routine_v5(){
	init_scs();
	init_bg();	
	
	////////////////////////////////////////////////////////////////////
	//포인트부터 화면에 안보이는 기능 넣어보자 
	
	
	//교점 찾기용
	//let A_xy = {x:	-0.92, 	y:-0.22};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	

	//let A_xy = {x:	-1, 	y:0};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	 0,		y:1};	

	//let A_xy = {x:	-0.92, 	y:-0.22};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	

	//let A_xy = {x:	-1, 	y:-1};
	//let B_xy = {x:	 1,  	y:-1};
	//let C_xy = {x:	-1,		y:1};	

	//let A_xy = {x:	 0, 	y:-1};
	//let B_xy = {x:  -1,  	y:1};
	//let C_xy = {x:	-1,		y:-1};	

	//let A_xy = {x:	0, 	y:0};
	//let B_xy = {x:	1, 	y:1};

	//let A_xy = {x:	0, 	y:0};
	//let B_xy = {x:-1, 	y:1};

	let A_xy = {x:	 0, 	y:-1};
	let B_xy = {x:  -1,  	y:1};
	let C_xy = {x:	-1,		y:-1};	


	////////////////////////////////////////////////////////////////////
	//	점
	point_A = new c_point(gscr, A_xy.x,A_xy.y,'A',true,cb_point_move);	//call-back
	point_A.init();

	point_B = new c_point(gscr, B_xy.x,B_xy.y,'B',true,cb_point_move);	//call-back
	point_B.init();

	point_C = new c_point(gscr, C_xy.x,C_xy.y,'C',true,cb_point_move);	
	point_C.init();
	
	////////////////////////////////////////////////////////////////////
	
	//{{기존에 AB와, BA가 서로 내부적으로 거의 동일한 데이터를 사용하고 있음에도 불구
	//object가 2개라 낭비인 것 같아서, 직선과  선분으로 기능을 분리하기로 함
	////	선분
	//AB = new c_line_old(gscr,point_A,point_B);
	//AB.init();
	//AB.update();
	//AB.hide_M();
	//}}{{

	//직선
	line_AB  = new c_line(gscr,point_A,point_B);
	line_AB.init();
	line_AB.update();
	line_AB.hide_M();
	
	line_BC  = new c_line(gscr,point_B,point_C);
	line_BC.init();
	line_BC.update();
	line_BC.hide_M();

	//{{
	line_CA  = new c_line(gscr,point_C,point_A);
	line_CA.init();
	line_CA.update();
	line_CA.hide_M();
	//}}{{
	//line_AC  = new c_line(gscr,point_A,point_C);
	//line_AC.init();
	//line_AC.update();
	//line_AC.hide_M();	
	//}}
	
	//각도용 
	AB = new c_segment(gscr,line_AB,false);
	BC = new c_segment(gscr,line_BC,false);
	
	CA = new c_segment(gscr,line_CA,false);
	//CA = new c_segment(gscr,line_AC,true);
	
	//{{
	////for(i=-720;i<-360;i+=30){
	////for(i=-360;i<0;i+=30){
	////for(i=0;i<360;i+=30){
	//for(i=360;i<720;i+=30){
	//	let x=i/1;
	//	console.log(i,x,gscr.normal_degree(i));
	//}
	//}}
	
	
	//}}

	
	////선분 BC
	//BC = new c_line(gscr,point_B,point_C);
	//BC.init();
	//BC.update();
	//BC.hide_M();
	//
	////선분 AC
	//CA = new c_line(gscr,point_C,point_A);
	//CA.init();
	//CA.update();		
	//CA.hide_M();
	
	
	//////////////////////////////////////////////////////////////////////
	////	각CAB
	CAB = new c_angle(CA,AB,gscr);
	CAB.update();	
	//CAB.hide();
	//
	ABC = new c_angle(AB,BC,gscr);
	ABC.update();	
	
	BCA = new c_angle(BC,CA,gscr);
	BCA.update();	
	//	
	//
	//////////////////////////////////////////////////////////////////////
	cb_point_move(point_A);	
	
}	

////////////////////////////////////////////////////////////////////////
//                                                                    //
//	SCS로 보냈음                                                      //

////각도를 0~360사이의 값으로 표현
//function normal_degree2(p_degree){
//	//모듈러 사용 불가, 음수는 모듈러도 음수가 나옴
//	//return p_degree % 360;
//	
//	let quotient = p_degree / 360; //몫
//	let valid_quotient = Math.floor(quotient);
//	let valid_deg = valid_quotient * -360 + p_degree;	
//
//	return valid_deg;	
//}
//
////각도를 -180~180사이의 값으로 표현
//function normal_degree(p_degree){
//	let deg = p_degree;
//	
//	if(deg<0 || deg >=360){
//		//console.log('정규화');
//		deg = normal_degree2(p_degree)
//	}
//	
//	if( deg > 180 ){
//		deg += -360
//	}
//	
//	return deg;	
//}

//                                                                    //
//                                                                    //
////////////////////////////////////////////////////////////////////////

function initialize_routine_v5(){
	init_scs();
	init_bg();	
	
	////////////////////////////////////////////////////////////////////
	//포인트부터 화면에 안보이는 기능 넣어보자 
	
	
	//교점 찾기용
	//let A_xy = {x:	-0.92, 	y:-0.22};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	

	//let A_xy = {x:	-1, 	y:0};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	 0,		y:1};	

	//let A_xy = {x:	-0.92, 	y:-0.22};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	

	let A_xy = {x:	-1, 	y:-1};
	let B_xy = {x:	 1,  	y:-1};
	let C_xy = {x:	-1,		y:1};	

	//let A_xy = {x:	 0, 	y:-1};
	//let B_xy = {x:  -1,  	y:1};
	//let C_xy = {x:	-1,		y:-1};	

	////////////////////////////////////////////////////////////////////
	//	점
	point_A = new c_point(gscr, A_xy.x,A_xy.y,'A',true,cb_point_move);	//call-back
	point_A.init();

	point_B = new c_point(gscr, B_xy.x,B_xy.y,'B',true,cb_point_move);	//call-back
	point_B.init();

	point_C = new c_point(gscr, C_xy.x,C_xy.y,'C',true,cb_point_move);	
	point_C.init();
	
	////////////////////////////////////////////////////////////////////
	//	선분
	AB = new c_line(gscr,point_A,point_B);
	AB.init();
	AB.update();
	AB.hide_M();
	
	//선분 BC
	BC = new c_line(gscr,point_B,point_C);
	BC.init();
	BC.update();
	BC.hide_M();
	
	//선분 AC
	CA = new c_line(gscr,point_C,point_A);
	CA.init();
	CA.update();		
	CA.hide_M();
	
	
	////////////////////////////////////////////////////////////////////
	//	각CAB
	CAB = new c_angle(CA,AB,gscr);
	CAB.update();	
	//CAB.hide();
	
	ABC = new c_angle(AB,BC,gscr);
	ABC.update();	
	
	BCA = new c_angle(BC,CA,gscr);
	BCA.update();	
		
	
	////////////////////////////////////////////////////////////////////
	cb_point_move(point_A);	
	
}	


function initialize_routine_v4(){
	init_scs();
	init_bg();

	//직각삼각형
	//let A_xy = {x:	-1, 	y:-1};
	//let B_xy = {x:	 1,  	y:-1};
	//let C_xy = {x:	-1,		y:1};	

	//삼각형
	//let A_xy = {x:	-1, 	y:-1};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	
	
	//교점 찾기용
	let A_xy = {x:	-0.92, 	y:-0.22};
	let B_xy = {x:	 1,  	y:0};
	let C_xy = {x:	-1,		y:1};	

	////////////////////////////////////////////////////////////////////
	point_A = new c_point(gscr, A_xy.x,A_xy.y,'A',true,cb_point_move);	//call-back
	point_A.init();

	point_B = new c_point(gscr, B_xy.x,B_xy.y,'B',true,cb_point_move);	//call-back
	point_B.init();

	point_C = new c_point(gscr, C_xy.x,C_xy.y,'C',true,cb_point_move);	
	point_C.init();
	
	point_M = new c_point(gscr, 1,1,'M',false,null);	
	point_M.init();	

	point_P = new c_point(gscr, 1,1,'P',false,null);	
	point_P.init();	
	
	////////////////////////////////////////////////////////////////////
	
	//선분 AB
	AB = new c_line(gscr,point_A,point_B);
	AB.init();
	AB.update();
	
	//선분 BC
	BC = new c_line(gscr,point_B,point_C);
	BC.init();
	BC.update();

	//선분 AC
	CA = new c_line(gscr,point_C,point_A);
	CA.init();
	CA.update();	
	
	//{{
	////////////////////////////////////////////////////////////////////
	//각CAB
	//CAB = new c_angle(CA,AB);
	CAB = new c_angle(CA,AB,gscr);
	CAB.update();	
	
	ABC = new c_angle(AB,BC,gscr);
	ABC.update();	
	
	BCA = new c_angle(BC,CA,gscr);
	BCA.update();	
	
	////////////////////////////////////////////////////////////////////
	
	//선분 AP
	AP = new c_line(gscr,point_A,point_P);
	AP.init();
	AP.update();	
	
	PB = new c_line(gscr,point_P,point_B);
	PB.init();
	PB.update();	
	
	BA = new c_line(gscr,point_B,point_A);
	BA.init();
	BA.update();	
	
	
	BAP = new c_angle(BA,AP,gscr);
	BAP.update();	
	
	APB = new c_angle(AP,PB,gscr);
	APB.update();	
	
	PBA = new c_angle(PB,BA,gscr);
	PBA.update();		
	
	
	////////////////////////////////////////////////////////////////////
	//	외심
	TCC = new c_circumcenter(BAP,APB,PBA,gscr);
	TCC.update();
	
	////////////////////////////////////////////////////////////////////
	
	//point_R1 = new c_point(gscr, 1,1,'R1',false,null);	
	//point_R1.init();
	//
	//point_R2 = new c_point(gscr, 1,1,'R2',false,null);	
	//point_R2.init();
	//
	//point_R3 = new c_point(gscr, 1,1,'R3',false,null);	
	//point_R3.init();
	//
	//point_R4 = new c_point(gscr, 1,1,'R4',false,null);	
	//point_R4.init();
	//}}
	
	////////////////////////////////////////////////////////////////////
	
	point_Q1 = new c_point(gscr, 1,1,'Q1',false,null);	
	point_Q1.init();

	point_Q2 = new c_point(gscr, 1,1,'Q2',false,null);	
	point_Q2.init();
	
	////////////////////////////////////////////////////////////////////
	cb_point_move(point_A);		
}

function initialize_routine_v2(){
	init_scs();
	init_bg();

	//직각삼각형
	//let A_xy = {x:	-1, 	y:-1};
	//let B_xy = {x:	 1,  	y:-1};
	//let C_xy = {x:	-1,		y:1};	

	//삼각형
	//let A_xy = {x:	-1, 	y:-1};
	//let B_xy = {x:	 1,  	y:0};
	//let C_xy = {x:	-1,		y:1};	
	
	//교점 찾기용
	let A_xy = {x:	-0.92, 	y:-0.22};
	let B_xy = {x:	 1,  	y:0};
	let C_xy = {x:	-1,		y:1};	

	////////////////////////////////////////////////////////////////////
	point_A = new c_point(gscr, A_xy.x,A_xy.y,'A',true,cb_point_move);	//call-back
	point_A.init();

	point_B = new c_point(gscr, B_xy.x,B_xy.y,'B',true,cb_point_move);	//call-back
	point_B.init();

	point_C = new c_point(gscr, C_xy.x,C_xy.y,'C',true,cb_point_move);	
	point_C.init();
	
	point_M = new c_point(gscr, 1,1,'M',false,null);	
	point_M.init();	

	point_P = new c_point(gscr, 1,1,'P',false,null);	
	point_P.init();	
	
	////////////////////////////////////////////////////////////////////
	
	//선분 AB
	AB = new c_line(gscr,point_A,point_B);
	AB.init();
	AB.update();
	
	//선분 BC
	BC = new c_line(gscr,point_B,point_C);
	BC.init();
	BC.update();

	//선분 AC
	CA = new c_line(gscr,point_C,point_A);
	CA.init();
	CA.update();	
	
	//{{
	////////////////////////////////////////////////////////////////////
	//각CAB
	//CAB = new c_angle(CA,AB);
	CAB = new c_angle(CA,AB,gscr);
	CAB.update();	
	
	ABC = new c_angle(AB,BC,gscr);
	ABC.update();	
	
	BCA = new c_angle(BC,CA,gscr);
	BCA.update();	
	
	////////////////////////////////////////////////////////////////////
	
	//선분 AP
	AP = new c_line(gscr,point_A,point_P);
	AP.init();
	AP.update();	
	
	PB = new c_line(gscr,point_P,point_B);
	PB.init();
	PB.update();	
	
	BA = new c_line(gscr,point_B,point_A);
	BA.init();
	BA.update();	
	
	
	BAP = new c_angle(BA,AP,gscr);
	BAP.update();	
	
	APB = new c_angle(AP,PB,gscr);
	APB.update();	
	
	PBA = new c_angle(PB,BA,gscr);
	PBA.update();		
	
	
	////////////////////////////////////////////////////////////////////
	//	외심
	TCC = new c_circumcenter(BAP,APB,PBA,gscr);
	TCC.update();
	
	////////////////////////////////////////////////////////////////////
	
	//point_R1 = new c_point(gscr, 1,1,'R1',false,null);	
	//point_R1.init();
	//
	//point_R2 = new c_point(gscr, 1,1,'R2',false,null);	
	//point_R2.init();
	//
	//point_R3 = new c_point(gscr, 1,1,'R3',false,null);	
	//point_R3.init();
	//
	//point_R4 = new c_point(gscr, 1,1,'R4',false,null);	
	//point_R4.init();
	//}}
	
	////////////////////////////////////////////////////////////////////
	
	point_Q1 = new c_point(gscr, 1,1,'Q1',false,null);	
	point_Q1.init();

	point_Q2 = new c_point(gscr, 1,1,'Q2',false,null);	
	point_Q2.init();
	
	////////////////////////////////////////////////////////////////////
	cb_point_move(point_A);	
}


function initialize_routine_v1(){
	gscr = new c_scr_ox();
	gscr.init('mysvg');
	//gscr.update_viewbox();
	//gscr.update_grid();
	
	//[완료] 첨에 화면 만들 때, 그리드 달 곳과, x측.y축 달 곳을 동적으로 생성
	//[완료] action - 원점을 센터로 맞춰주기, 확대/축소도 디폴트로
	//[완료]마우스 스크롤로 화면 scrolling, 확대/축소
	
	//p_C = new c_Point(200,100,50,'C');
	//p_C.call_back = point_callback;
	//p_C.create_reacting_area();
	//p_C.create_circle();	
	//
	//draw_path();	
	
	//정삼각형
	//let B_xy = gscr.calc_CircleXY(1,30);
	//let A_xy = {x:-1*B_xy.x,y:B_xy.y};
	//let C_xy = {x:0,y:-1};
	
	//직각삼각형
	let A_xy = {x:	-1, 	y:-1};
	let B_xy = {x:	1,  	y:-1};
	let C_xy = {x:	-1,		y:1};	
	
	
	//{{
	//point_A = new c_point(gscr, 0,0,'A',cb_point_move);	//call-back
	////point_A = new c_point(gscr, 1,-1,'A');	//no call-back
	//point_A.init();
	//
	//point_B = new c_point(gscr, 1,1,'B',cb_point_move);	//call-back
	//point_B.init();
	//
	//point_C = new c_point(gscr, -1,0,'C',cb_point_move);	
	//point_C.init();
	//}}{{
	point_A = new c_point(gscr, A_xy.x,A_xy.y,'A',true,cb_point_move);	//call-back
	point_A.init();

	point_B = new c_point(gscr, B_xy.x,B_xy.y,'B',true,cb_point_move);	//call-back
	point_B.init();

	point_C = new c_point(gscr, C_xy.x,C_xy.y,'C',true,cb_point_move);	
	point_C.init();
	//}}
	
	point_O = new c_point(gscr, -2,-2,'O',false,null);	
	point_O.init();
	
	point_P1 = new c_point(gscr, -2,-2,'P1',false,null);	
	point_P1.init();

	point_P2 = new c_point(gscr, -2,-2,'P2',false,null);	
	point_P2.init();

	point_M = new c_point(gscr, -2,-2,'M',false,null);	
	point_M.init();
	
	//tmp_sym = new c_symbol();
	//tmp_sym.init('A',gscr,point_A);
	//tmp_sym.update_position(200,200);
	//tmp_sym.update_rotate(45,UPRIGHT);
	
	//선분 AB
	AB = new c_line(gscr,point_A,point_B);
	AB.init();
	AB.update();
	
	//선분 BC
	BC = new c_line(gscr,point_B,point_C);
	BC.init();
	BC.update();

	//선분 AC
	CA = new c_line(gscr,point_C,point_A);
	CA.init();
	CA.update();

	//각CAB
	//CAB = new c_angle(CA,AB);
	CAB = new c_angle(CA,AB,gscr);
	CAB.update();

	//
	//valid_digit_test();	


	
	cb_point_move(point_A);	
	return;	

	
	return;
	
	//111.80339887498948
	
	gscr2 = new c_scr_ox();
	gscr2.init('mysvg2');	
	
	let distance = gscr.calc_distance(point_A,point_B);
	
	AA = new c_point(gscr2, -distance/2, 0,'A',cb_point_move2);	//call-back
	AA.init();

	BB = new c_point(gscr2, distance/2, 0,'B',cb_point_move2);	//call-back
	BB.init();	
	

}	

function call_back_________________(){}

function cb_point_move(p_point){	
	line_AB.update();
	line_BC.update();
	//line_AC.update();
	line_CA.update();
	
	CAB.update();
	ABC.update();
	BCA.update();		
	
	point_A.symbol_obj.update_rotate( gscr.calc_rad2deg(CAB.opposite_avg ));
	point_B.symbol_obj.update_rotate( gscr.calc_rad2deg(ABC.opposite_avg ));
	point_C.symbol_obj.update_rotate( gscr.calc_rad2deg(BCA.opposite_avg ));	
	
	//
	let dir = -1;
	if( CAB.theta >= 0 ){
		dir = CW;
	}
	else{
		dir = CCW;
	}
	
	//AB.update_symbol(dir);
	line_AB.update_symbol(dir);
	//return;

	//
	if( ABC.theta >= 0 ){
		dir = CW;
	}
	else{
		dir = CCW;
	}
	//BC.update_symbol(dir);
	line_BC.update_symbol(dir);

	//
	if( BCA.theta >= 0 ){
		dir = CW;
	}
	else{
		dir = CCW;
	}
	//CA.update_symbol(dir);	
	//line_AC.update_symbol(dir);	
	line_CA.update_symbol(dir);	
	
	return;
	///////////////////////////////
	
	//선분
	AB.update();
	CA.update();
	BC.update();

	//각
	CAB.update();
	ABC.update();
	BCA.update();	

	
	//{{debug - 값과 위치 세팅을 먼저 해놔야 추후 계산이 가능 
	//AB.symbol_obj.update_position(AB.ct_Mx,AB.ct_My);
	//AB.symbol_obj.update_text('AB');
	//
	
	//return;	


	
	////{{
	////console.log('CAB는 null');
	
	point_A.symbol_obj.update_rotate( gscr.calc_rad2deg(CAB.opposite_avg ));
	point_B.symbol_obj.update_rotate( gscr.calc_rad2deg(ABC.opposite_avg ));
	point_C.symbol_obj.update_rotate( gscr.calc_rad2deg(BCA.opposite_avg ));
	//
	////debugger;	
	//

	////////////////////////////////////////////////////////////////////
	
	////
	//let dir = -1;
	//if( CAB.theta >= 0 ){
	//	dir = CW;
	//}
	//else{
	//	dir = CCW;
	//}
	//
	//AB.update_symbol(dir);
	////return;
	//
	////
	//if( ABC.theta >= 0 ){
	//	dir = CW;
	//}
	//else{
	//	dir = CCW;
	//}
	//BC.update_symbol(dir);
	//
	////
	//if( BCA.theta >= 0 ){
	//	dir = CW;
	//}
	//else{
	//	dir = CCW;
	//}
	//CA.update_symbol(dir);
	
	////////////////////////////////////////////////////////////////////

	return;

	////}}
	
	////////////////////////////////////////////////////////////////////
	let M_vbxy = gscr.get_vb_position(AB.ct_Mx,AB.ct_My);
	point_M.update_position(M_vbxy.x,M_vbxy.y,this.ct_Mx,this.ct_My);
	
	
	let radian = 0;
	if(CAB.theta > 0){
		radian = AB.theta - Math.PI/2;
	}
	else{
		radian = AB.theta + Math.PI/2;
	}
	
	let R = 1;

	let P = gscr.calc_CircleXY2(AB.ct_Mx,AB.ct_My,R, radian );
	let P_vbxy = gscr.get_vb_position(P.x,P.y);					
	point_P.update_position(P_vbxy.x,P_vbxy.y,P.x,P.y);
	
	////////////////////////////////////////////////////////////////////
	AP.update();	
	PB.update();	
	BA.update();	
	
	BAP.update();	
	APB.update();	
	PBA.update();		
	
	//외심
	TCC.update();	
	
	////////////////////////////////////////////////////////////////////
	rect_intersect();
	
	////////////////////////////////////////////////////////////////////
	
	//{{debug - 값과 위치 세팅을 먼저 해놔야 추후 계산이 가능 
	//AB.symbol_obj.update_position(AB.ct_Mx,AB.ct_My);
	//AB.symbol_obj.update_text('AB');
	//
	
	//if(CAB.theta > 0){
	//	radian = AB.theta - Math.PI/2;
	//}
	//else{
	//	radian = AB.theta + Math.PI/2;
	//}	
	

	
	////{{debug
	//if( this.name == 'AB'){
	//	
	//	
	//	let R = 1;
	//	let P = this.scs.calc_CircleXY2(this.ct_Mx,this.ct_My,R, (this.theta - Math.PI/2) );
	//	let P_vbxy = gscr.get_vb_position(P.x,P.y);					
	//	point_P.update_position(P_vbxy.x,P_vbxy.y,P.x,P.y);
	//}
	////}}debug	
	
}

function rect_intersect(){
	//<g id='t1' transform='translate(300,100)' >
	//	<g id='t2'>
	//		<text id='tt' text-anchor='middle' dominant-baseline='middle'>ABCD</text>
	//	</g>
	//	
	//	<g id='t3'>
	//		<rect id='t99' x='0' y='0' width='100' height='50' class='c1'/>		
	//	</g>
	//</g>	
	
	let xx = document.getElementById('t1');
	xx.setAttribute('transform','translate(' + String(point_P.vb_x) + ',' + String(point_P.vb_y) + ')' );
	
	let txt_bbox = document.getElementById('t2');
	let w = txt_bbox.getBBox().width;
	let h = txt_bbox.getBBox().height;
	//console.log('w ,h  : ', w,h);
	//console.log('w2,h2 : ', w/gscr._ct_x_pixels,h/gscr._ct_y_pixels);
	
	let half_w = w/2;
	let half_h = h/2;
	//console.log(half_w,half_h);	
	
	let box = document.getElementById('t3');
	box.setAttribute('transform','translate(' + String(-half_w) + ',' + String(-half_h) + ')' );
	
	let b2 = document.getElementById('t99');
	b2.setAttribute('width',String(w));
	b2.setAttribute('height',String(h));	
	
	////////////////////////////////////////////////////////////////////
	console.log('==============================');
	//w ,h  :  77.9375 21.015625
	//w2,h2 :  0.779375 0.21015625
	let width_over_2  = (txt_bbox.getBBox().width  / gscr._ct_x_pixels ) / 2 ;
	let height_over_2 = (txt_bbox.getBBox().height / gscr._ct_y_pixels ) / 2 ;
	//console.log( width_over_2 );
	//console.log( height_over_2 );
	
	let rect_Ox = point_P.ct_x;
	let rect_Oy = point_P.ct_y;
	//console.log( rect_Ox , rect_Oy );
	
	let x1 = rect_Ox - width_over_2;
	let x2 = rect_Ox + width_over_2;
	
	let y2 = rect_Oy - height_over_2;
	let y1 = rect_Oy + height_over_2;
	
	//console.log('x1: ', x1);
	//console.log('x2: ', x2);
	//console.log('y1: ', y1);
	//console.log('y2: ', y2);
	
	//point_R1
	let vbxy = gscr.get_vb_position(x1,y1);
	//point_R1.update_position(vbxy.x,vbxy.y,x1,y1);	
	
	vbxy = gscr.get_vb_position(x1,y2);
	//point_R2.update_position(vbxy.x,vbxy.y,x1,y2);		

	vbxy = gscr.get_vb_position(x2,y2);
	//point_R3.update_position(vbxy.x,vbxy.y,x2,y2);	

	vbxy = gscr.get_vb_position(x2,y1);
	//point_R4.update_position(vbxy.x,vbxy.y,x2,y1);
	
	////////////////////////////////////////////////////////////////////
	let Ox = TCC.OccX;
	let Oy = TCC.OccY;
	let r  = TCC.radius;
	//console.log( Ox, Oy,r);
	
	let vp = [];	//valid point 
	
	////////////////////////////////////////////////////////////////////
	let det = Math.pow(r,2) - Math.pow( (y1-Oy) , 2);
	
	if( det>=0 ){
		let xx1 = Ox - Math.sqrt(det);
		
		if( x1<= xx1 && xx1<= x2){
			vp.push( {x:xx1,y:y1} );
			
			//vbxy = gscr.get_vb_position(xx1,y1);
			//point_Q1.update_position(vbxy.x,vbxy.y,xx1,y1);
		}
		
		if( det>0 ){
			let xx2 = Ox + Math.sqrt(det);
			
			if( x1<= xx2 && xx2<= x2){
				vp.push( {x:xx2,y:y1} );
				
				//vbxy = gscr.get_vb_position(xx2,y1);
				//point_Q2.update_position(vbxy.x,vbxy.y,xx2,y1);
			}	
		}
	}
	
	////////////////////////////////////////////////////////////////////
	det = Math.pow(r,2) - Math.pow( (y2-Oy) , 2);

	if( det>=0 ){
		let xx1 = Ox - Math.sqrt(det);
		
		if( x1<= xx1 && xx1<= x2){
			vp.push( {x:xx1,y:y2} );
			
			//vbxy = gscr.get_vb_position(xx1,y1);
			//point_Q1.update_position(vbxy.x,vbxy.y,xx1,y1);
		}
		
		if( det>0 ){
			let xx2 = Ox + Math.sqrt(det);
			
			if( x1<= xx2 && xx2<= x2){
				vp.push( {x:xx2,y:y2} );
				
				//vbxy = gscr.get_vb_position(xx2,y1);
				//point_Q2.update_position(vbxy.x,vbxy.y,xx2,y1);
			}	
		}		
	}
	
	////////////////////////////////////////////////////////////////////
	
	det = Math.pow(r,2) - Math.pow( (x1-Ox) , 2);
	
	let yy1 =  0; 
	let yy2 = 0 ; 
	
	if( det>=0 ){
		yy1 = Oy + Math.sqrt(det );
		
		if( y2<= yy1 && yy1<= y1){
			vp.push( {x:x1,y:yy1} );
		}		
		
		if( det>0){
			yy2 = Oy - Math.sqrt(det );
	
			if( y2<= yy2 && yy2<= y1){
				vp.push( {x:x1,y:yy2} );
				//vbxy = gscr.get_vb_position(x1,yy2);
				//point_Q1.update_position(vbxy.x,vbxy.y,x1,yy2);
			}	
		}
	}
	////////////////////////////////////////////////////////////////////

	det = Math.pow(r,2) - Math.pow( (x2-Ox) , 2);
	
	if( det>=0 ){
		yy1 =  Oy + Math.sqrt(det );
		
		if( y2<= yy1 && yy1<= y1){
			vp.push( {x:x2,y:yy1} );
			//vbxy = gscr.get_vb_position(xx1,y1);
			//point_Q1.update_position(vbxy.x,vbxy.y,xx1,y1);
		}		
		
		if( det>0 ){
			yy2 =  Oy - Math.sqrt(det );
			
			if( y2<= yy2 && yy2<= y1){
				vp.push( {x:x2,y:yy2} );
				//vbxy = gscr.get_vb_position(x1,yy2);
				//point_Q1.update_position(vbxy.x,vbxy.y,x1,yy2);
			}	
						
		}
	}
	
	////////////////////////////////////////////////////////////////////
	
	let p_list = [];	
	
	p_list.push( point_A );
	p_list.push( point_B );

	let dist1 = dist( vp[0].x, vp[0].y, point_A.ct_x, point_A.ct_y);
	let dist2 = dist( vp[1].x, vp[1].y, point_A.ct_x, point_A.ct_y);
	
	if( dist1 <= dist2){
		let vbvb = gscr.get_vb_position(vp[0].x,vp[0].y);
		point_Q1.update_position(vbvb.x,vbvb.y,vp[0].x,vp[0].y);
		
		vbvb = gscr.get_vb_position(vp[1].x,vp[1].y);
		point_Q2.update_position(vbvb.x,vbvb.y,vp[1].x,vp[1].y);
	}
	else{
		let vbvb = gscr.get_vb_position(vp[1].x,vp[1].y);
		point_Q1.update_position(vbvb.x,vbvb.y,vp[1].x,vp[1].y);
		
		vbvb = gscr.get_vb_position(vp[0].x,vp[0].y);
		point_Q2.update_position(vbvb.x,vbvb.y,vp[0].x,vp[0].y);
	}
	
	////////////////////////////////////////////////////////////////////
	
	let QQ1 = document.getElementById('arc1');
	vb_a = gscr.get_vb_position( point_A.ct_x, point_A.ct_y);
	
	vb_r = gscr.get_scr_xy( TCC.radius ,0);
	
	vb_q1= gscr.get_vb_position( point_Q1.ct_x, point_Q1.ct_y);
	
	
	let sweep_val = '0';
	if(CAB.theta>0){
		sweep_val = '0';
	}
	else{
		sweep_val = '1';
	}
	
	let arc_str = '';
	arc_str = 'M ' + String(vb_a.x) + ' ' + String( vb_a.y ) + ' ' +
		'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
		'0,' +
		'0,' +
		sweep_val + ',' +
		String(vb_q1.x) + ' ' + String(vb_q1.y);
	

	QQ1.setAttribute('d',arc_str);
	
	//
	let QQ2 = document.getElementById('arc2');
	
	vb_q2= gscr.get_vb_position( point_Q2.ct_x, point_Q2.ct_y);
	
	vb_b = gscr.get_vb_position( point_B.ct_x, point_B.ct_y);
	
	arc_str = 'M ' + String(vb_q2.x) + ' ' + String( vb_q2.y ) + ' ' +
		'A ' + String(vb_r.x) + ' ' + String(vb_r.x) + ',' +
		'0,' +
		'0,' +
		sweep_val + ',' +
		String(vb_b.x) + ' ' + String(vb_b.y);	
	
	QQ2.setAttribute('d',arc_str);
	
	////////////////////////////////////////////////////////////////////
	
	return;
	
	//for(i=0;i<vp.length;i++){
	//	let xy = vp[i];
	//	let xyvb = gscr.get_vb_position(xy.x,xy.y);
	//	
	//	if( i== 0){
	//		point_Q1.update_position(xyvb.x,xyvb.y,xy.x,xy.y);
	//	}
	//	else{
	//		point_Q2.update_position(xyvb.x,xyvb.y,xy.x,xy.y);
	//	}
	//	
	//	//let str_point_name = 'point_Q' + String(i);
	//	
	//	//console.log( str_point_name,xy );
	//	//let vbxy = gscr.get_vb_position(x1,yy2);
	//}
	

	
}

function dist(p_x1,p_y1,p_x2,p_y2){
	//두 점사이의 거리를 계산
	let distance = Math.sqrt( Math.pow((p_x2 - p_x1),2) + Math.pow((p_y2 - p_y1),2) );
	//console.log('거리: ',distance);
	return distance;
}

function cb_point_move_v1(p_point){
	//각CAB
	console.log( 'CA : ', CA.degree );
	console.log( '  AC : ', CA.degree - 180 );
	
	console.log( 'AB : ', AB.degree );
	let CAB = (CA.degree - 180) - AB.degree ;
	console.log( '각CAB : ', CAB );
	
	let dp_ang = CAB;
	if( dp_ang < 0){
		dp_ang = Math.abs(dp_ang);
	}
	
	console.log( '각CAB-2 : ', dp_ang );
		
	
	//각ABC
	BA_ang = AB.degree+180;
	BC_ang = BC.degree;
	console.log( 'BA : ', BA_ang );
	console.log( 'BC : ', BC_ang );
	let ABC = BA_ang - BC_ang;
	console.log( '각ABC : ', ABC );
	
	//각BCA
	let CB_ang = BC.degree + 180;
	let CA_ang = CA.degree + 180;
	console.log( 'CB : ', CB_ang );
	console.log( 'CA : ', CA_ang );
	let BCA = CB_ang - CA_ang;
	console.log( '각BCA : ', BCA );
	
	//외심
	let CCCx = ( point_A.ct_x * Math.sin( gscr.calc_deg2rad(2*CAB)) +
	             point_B.ct_x * Math.sin( gscr.calc_deg2rad(2*ABC)) +
                 point_C.ct_x * Math.sin( gscr.calc_deg2rad(2*BCA))  ) /
			   ( Math.sin( gscr.calc_deg2rad(2*CAB)) + 
	             Math.sin( gscr.calc_deg2rad(2*ABC)) +   
				 Math.sin( gscr.calc_deg2rad(2*BCA)) );

	let CCCy = ( point_A.ct_y * Math.sin( gscr.calc_deg2rad(2*CAB)) +
	             point_B.ct_y * Math.sin( gscr.calc_deg2rad(2*ABC)) +
                 point_C.ct_y * Math.sin( gscr.calc_deg2rad(2*BCA))  ) /
			   ( Math.sin( gscr.calc_deg2rad(2*CAB)) + 
	             Math.sin( gscr.calc_deg2rad(2*ABC)) +   
				 Math.sin( gscr.calc_deg2rad(2*BCA)) );

	console.log( '외심x : ' , CCCx.toFixed(20) );
	console.log( '외심y : ' , CCCy.toFixed(20) );
	
	let vb_xy = gscr.get_vb_position(CCCx,CCCy);
	point_O.update_position(vb_xy.x,vb_xy.y, CCCx,CCCy);
	
	//길이
	let OA_ct = gscr.calc_distance(point_O, point_A);
	console.log('외심의 반지름ct : ', OA_ct);
	
	let OA_vb = gscr.get_scr_xy(OA_ct,0);
	console.log('외심의 반지름vb : ', OA_vb);
	
	//외심원
	let cccc = document.getElementById('ccc');
	cccc.setAttribute('cx',point_O.vb_x);
	cccc.setAttribute('cy',point_O.vb_y);
	cccc.setAttribute('r',String(OA_vb.x));

	//console.log(cccc);
	
	//////////////////////////////////////////////
	
	
	gscr.calc_distance(point_A,point_B);
	gscr.calc_angle(point_A,point_B);
	//console.log('멜롱');
	
	
	let distance = gscr.calc_distance(point_A,point_B);
	let vb_xy1 = gscr.get_vb_position(-distance/2,0);
	let vb_xy2 = gscr.get_vb_position(distance/2,0);
	
	AA.update_position(vb_xy1.x,200, -distance/2, 0);
	BB.update_position(vb_xy2.x,200, distance/2, 0);
	
	
}	

function calcAngleDegrees(x, y) {
	let rad = Math.atan2(y, x); //특이하게 (y,x)로 y가 먼저 나옴
	let deg = rad * 180 / Math.PI;
	
	//console.log( Math.atan2(y, x) * 180 / Math.PI );
	console.log('각도:',deg);
  return Math.atan2(y, x) * 180 / Math.PI;
}

function cb_point_move2(p_point){
}
		
function valid_digit_test(){
	console.log('here');
	//let x = display_number(123.1235);
	//let x = display_number(-12345.123456789);
	let x = display_number(-12345.1236);
	console.log(x);

}	

function display_number(p_num){
	if( isInt(p_num) ){
		//console.log('정수입니다.');
		return p_num;
	}
	
	//console.log('정수 no no no');
	
	let num = p_num;
	
	let int_num = parseInt(num);
	//console.log('정수 : ',int_num);
	
	let str_int = int_num.toString();
	//console.log('str_int : ', str_int);
	
	//let str_int_cnt = str_int.length;
	//console.log('str_int_cnt : ' , str_int_cnt);
	
	let str_num = num.toString();
	//console.log( 'str_num : ', str_num );
	
	//let str_sosubu = str_num.substring(0,str_num.length);
	let str_sosubu = str_num.substring(str_int.length+1,str_num.length);
	//console.log( 'str_sosubu : ', str_sosubu);
	
	if(str_sosubu.length > 3){
		num = Math.round((num + Number.EPSILON) * 1000) / 1000;
		//console.log('변형 : ', num);
	}
	
	return num;

}	

function display_number_v3(p_num){
	if( isInt(p_num) ){
		console.log('정수입니다.');
		return p_num.toString();
	}
	
	console.log('정수 no no no');
	
	let num = p_num;
	
	let int_num = parseInt(num);
	console.log('정수 : ',int_num);
	
	let str_int = int_num.toString();
	console.log('str_int : ', str_int);
	
	//let str_int_cnt = str_int.length;
	//console.log('str_int_cnt : ' , str_int_cnt);
	
	let str_num = num.toString();
	console.log( 'str_num : ', str_num );
	
	//let str_sosubu = str_num.substring(0,str_num.length);
	let str_sosubu = str_num.substring(str_int.length+1,str_num.length);
	console.log( 'str_sosubu : ', str_sosubu);
	
	if(str_sosubu.length > 3){
		num = Math.round((num + Number.EPSILON) * 1000) / 1000;
		console.log('변형 : ', num);
	}
	
	return num.toString();	

}	

function display_number_v2(p_num){
	if( isInt(p_num) ){
		console.log('정수입니다.');
		return p_num.toString();
	}
	
	let num = p_num;
	
	let int_num = parseInt(p_num);
	console.log('정수 : ',int_num);
	
	let sosubu = p_num - int_num;
	console.log('소수부 : ',sosubu);
	
	let str_sosubu = sosubu.toString();
	console.log(str_sosubu);
	
	//소수자리수
	let sosu_cnt = 0;
	if( sosubu < 0){
		sosu_cnt = str_sosubu.length-3;	
	}
	else{
		sosu_cnt = str_sosubu.length-2;
	}
	console.log(sosu_cnt);
	
	if(sosu_cnt > 3){
		num = Math.round((num + Number.EPSILON) * 1000) / 1000;
	}
	
	console.log(num);
	return num.toString();
}	

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function info_update(p_text){
	document.getElementById('info').innerText = p_text;
}
