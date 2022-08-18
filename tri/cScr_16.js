////////////////////////////////////////////////////////
//
//		디버깅 할 때, touch move가 안되면, c_platform에서 userAgentData를 제대로 못 긁어와서 그럼
//		그러니까 이때는 핸드폰으로 테스트하면 제대로 되는 거임
//		디버거에서, G7 핸드폰의 'platform'에 'Android'로 하드코딩하면 잘 됨
//

//note #820,#821, #818 , #813
class cSCR{
	const = null;	//constant class
	
	//{{2022.08.12
	util  = null;
	//}}
	
	////////////////////////////////////////////////////////////////////
	oConfig = null;	
	
	//{{2022.08.14
	oLogo      = null;
	oCopyright = null;
	//}}
	
	////////////////////////////////////////////////////////////////////
	//	화면 확대 축소용
	vbcs_scale_factor = 0;
	vbcs_scale        = 1.0;	//display상에서... vb = viewBox

	////////////////////////////////////////////////////////////////////
	//	ViewBox Coordinate System 
	vbcs_width  = 0;
	vbcs_height = 0;
	
	vbcs_x_min = 0;
	vbcs_x_max = 0;
	
	vbcs_y_min = 0;
	vbcs_y_max = 0;
	
	vbcs_str = '';	//internal - viewbox string
	
	//
	scr_Ox = 0;
	scr_Oy = 0;

	scr_Ox_delta = 0;
	scr_Oy_delta = 0;

	//grid - 각 grid 선들이 들어가 있음
	HorizontalGridSet = [];
	VerticalaGridSet = [];	
	
	////////////////////////////////////////////////////////////////////
	//	Event
	wheel_drag_ing = false;	//wheel을 누르고 drag하는 중이면 true, 휠을 누르기 시작하면 true, 휠을 때면 false
	
	mouse_valid = false;	//mouse pointer가 svg위에 올라와 있으면 true
	
	drag_ing = false;
	drag_obj = null;
	
	////////////////////////////////////////////////////////////////////
	//	Mode
	magnetic_mode = false;
	grid_mode = true;
	pan_mode = false;	//view move
	//pan_mode = true;	//view move
	
	touch_moved = false;	//touch가 발생했고, move가 있었을 때 
	
	debug_cnt = 0;

	//{{2022.08.12
	screenshot_objs = null;
	//}}
	
	//Function List에서 pretty-print 용도
	Method____________________=0;
	
	constructor(){
	}
	
	init(p_oConfig ){
		this.const = scSCRconst;	//constant class
		//둘 다 가능 
		//this.const['SVG_NS']	: 'http://www.w3.org/2000/svg'
		//this.const.SVG_NS		: 'http://www.w3.org/2000/svg'

		//{{2022.08.12
		this.util = scUtil;
		//}}
				
		this.oConfig = p_oConfig;

		//{{2022.08.14
		this.oLogo      = new cLogo( this );
		this.oCopyright = new cCopyright( this );
		//}}
		
		this.update_scale_factor( this.oConfig.vbcs_scale_factor_initial );	
		
		this.scr_Ox  = this.oConfig.scr_Ox_initial;
		this.scr_Oy  = this.oConfig.scr_Oy_initial;
		
		//Toolbar 등록
		
		//이거 하나로 모아야 함 
		//this.oConfig.tool_magnet.addEventListener('click', (e)=>this.el_magnet_click2(e,1) );
		
		//{{2022.08.08
		//this.oConfig.tool_magnet.addEventListener('click', (e)=>this.el_magnet_click(e) );		
		//this.oConfig.tool_grid.addEventListener('click', (e)=>this.el_grid_click(e) );
		//this.oConfig.tool_pan.addEventListener('click', (e)=>this.el_pan_click(e) );
		//}}{{
		this.oConfig.ToolHitareaSet['Magnet'].addEventListener('click', (e)=>this.el_magnet_click(e) );		
		this.oConfig.ToolHitareaSet['Grid'].addEventListener('click', (e)=>this.el_grid_click(e) );
		this.oConfig.ToolHitareaSet['Pan'].addEventListener('click', (e)=>this.el_pan_click(e) );
		//}}
		
		//{{2022.08.13
		this.oConfig.ToolHitareaSet['ScreenShot'].addEventListener('click', (e)=>this.el_Toolbar_Click(e,'ScreenShot') );
		//}}
		
		//Event 등록 
		this.oConfig.LayerSet['SVG'].addEventListener('wheel',(e)=>this.el_wheel(e) );	//wheel 확대/축소
		
		this.oConfig.LayerSet['SVG'].addEventListener('mousedown',(e)=>this.el_mousedown(e) );	//wheel 클릭
		this.oConfig.LayerSet['SVG'].addEventListener('mouseup',(e)=>this.el_mouseup(e) );		//
		this.oConfig.LayerSet['SVG'].addEventListener('mousemove',(e)=>this.el_mousemove(e) );	//wheel drag	
		
		window.addEventListener('keypress',(e)=>this.el_keypress(e) );
		
		this.oConfig.LayerSet['SVG'].addEventListener('mouseleave',(e)=>this.el_mouseleave(e) );	//svg가 mouse pointer가 올라올 때		
		this.oConfig.LayerSet['SVG'].addEventListener('mouseenter',(e)=>this.el_mouseenter(e) );					

		
		//{{2022.07.30 - Grid는 최초상태가 선택된 상태가 되도록 한다.
		this.grid_mode = false;	//최초 상태가 disable이어야, 클릭했을 때 enable이 됨
		
		let tool_grid_click_evt = document.createEvent('Events');
		tool_grid_click_evt.initEvent( 'click' , true, false);
		
		this.oConfig.ToolHitareaSet['Grid'].dispatchEvent( tool_grid_click_evt );		
		//}}2022.07.30
		
		//debugger;
		
		//cell phone drag evt
		if( this.oConfig.platform.mobile ){
			//{{ pan mode 
			//this.oConfig.e_svg.addEventListener('touchstart', (e)=>this.el_touchstart(e) ); //'점'에서 touch start
			//}}{{
			//this.oConfig.e_svg.addEventListener('touchstart', (e)=>this.el_touchstart(e) ); //pan mode
			//}}panmode
			
			this.oConfig.LayerSet['SVG'].addEventListener('touchmove', (e)=>this.el_touchmove(e) );
			this.oConfig.LayerSet['SVG'].addEventListener('touchend', 	(e)=>this.el_touchend(e)  );	
		}
		
		this.update_screen();	

		//{{2022.07.22 - debug info
		let div_offset = this.oConfig.get_div_offset_position();
		
		this.update_debug_info('debug_offsetLeft', div_offset.x );
		this.update_debug_info('debug_offsetTop' , div_offset.y );				

		this.update_debug_info('debug_broswer' , this.oConfig.get_broswer_info() );	
		
		this.update_debug_info('debug_mobile' , this.oConfig.platform.mobile );	
		this.update_debug_info('debug_portrait' , this.oConfig.platform.portrait );	
		this.update_debug_info('debug_broswer_WH' , String(this.oConfig.platform.width) + ' x ' + String(this.oConfig.platform.height)  );	
		this.update_debug_info('debug_SCR_WH' , String(this.oConfig.scr_width) + ' x ' + String(this.oConfig.scr_height)  );	
		this.update_debug_info('debug_win_scr_WH' , String(window.screen.width) + ' x ' + String(window.screen.height)  );	
		this.update_debug_info('debug_platform_ratio' , String(this.oConfig.platform_ratio)  );	
		this.update_debug_info('debug_devicePixelRatio' , String(window.devicePixelRatio) );	
		this.update_debug_info('debug_grid' , String(this.oConfig.Xaxis_grid_size_vbcs) + ' x ' +String(this.oConfig.Yaxis_grid_size_vbcs) );	

	}

	update_screen(){
		this.update_viewbox();
		this.update_grid();
		this.update_axis();	

		//{{2022.08.13.debug
		this.screenshot();
		//}}
	}
	
	//note.#815 , #808 , #807 , #806
	//vbcs_scale,vbcs_scale,scr_Ox,scr_Oy에 대한 변경이 있을 때
	update_viewbox(){
		//viewbox coordinate
		this.vbcs_width  = this.oConfig.scr_width  * this.vbcs_scale;
		this.vbcs_height = this.oConfig.scr_height * this.vbcs_scale;
		
		this.vbcs_x_min = -1 * this.scr_Ox * this.vbcs_scale;	//#808
		this.vbcs_y_min = -1 * this.scr_Oy * this.vbcs_scale;
		
		this.vbcs_x_max = this.vbcs_x_min + this.vbcs_width;
		this.vbcs_y_max = this.vbcs_y_min + this.vbcs_height;

		//{{2022.08.07.debugger enable 
		if( g_debugger_enable ){
			debugger;
		}
		//}}
		
		//catesian coordinate
		
		//		
		this.vbcs_str = 
			String(this.vbcs_x_min) + ' ' + 
			String(this.vbcs_y_min) + ' ' + 
			String(this.vbcs_width) + ' ' + 
			String(this.vbcs_height);
		
		this.oConfig.LayerSet['SVG'].setAttribute('viewBox',this.vbcs_str);	
		
		this.oConfig.LayerSet['Tools'].setAttribute('transform','translate(' + String(this.vbcs_x_min) +  ',' + String(this.vbcs_y_min) + ')' )					
		
		//{{2022.08.14
		this.oLogo.update_position();
		this.oCopyright.update_position();
		//}}
		
		this.update_debug_info('debug_viewbox_WH'  , String(this.vbcs_width )   + ' x ' + String(this.vbcs_height) );
	}
	
	//note.#854,#857
	update_grid(){
		//vertical
		
		// cartesian coordinate

		//{{debug 
		//this.scr_Ox = 30;
		//this.scr_Ox = 0;
		//this.scr_Oy = 400;
		//this.update_viewbox();
		
		//this.scr_Ox = 0;
		//this.scr_Oy = 360;
		//this.update_viewbox();		
		
		//debugger;		
		if( g_debugger_enable ){
			debugger;
		}			
		//}}debug 

		let LeftTop_ctc     = this.vbcs2ctcs(this.vbcs_x_min , this.vbcs_y_min);	//LeftTop_ctc = {x: -0.3, y: 4}
		let RightBottom_ctc = this.vbcs2ctcs(this.vbcs_x_max , this.vbcs_y_max);	//RightBottom_ctc = {x: 3.7, y: -0}
		
		let x_min_ctc = LeftTop_ctc.x;
		let x_max_ctc = RightBottom_ctc.x;
		let y_min_ctc = RightBottom_ctc.y;
		let y_max_ctc = LeftTop_ctc.y;
		
		//////////////////////////////////////////////////
		//	vg : vertical grid 
		let vg_x_min_ctc = Math.ceil(  x_min_ctc / this.oConfig.Xaxis_grid_size_ctcs) * this.oConfig.Xaxis_grid_size_ctcs;	
		let vg_x_max_ctc = Math.floor( x_max_ctc / this.oConfig.Xaxis_grid_size_ctcs) * this.oConfig.Xaxis_grid_size_ctcs;	
		let vg_cnt     = ( vg_x_max_ctc - vg_x_min_ctc) / this.oConfig.Xaxis_grid_size_ctcs + 1;			
		
		// vertical grid 개수 맞추기
		let delta_sero = vg_cnt - this.VerticalaGridSet.length;
		
		if( delta_sero>0 ){
			//부족할 때
			for( let i=0; i< delta_sero; i++){
				let t = document.createElementNS(this.const['SVG_NS'],'line');
				this.oConfig.LayerSet['Vertical_Grid'].appendChild( t );  
				this.VerticalaGridSet.push( t );			
			}
		}
		else if( delta_sero<0 ){
			//남을 때
			for( let i=delta_sero; i< 0; i++){
				let t = this.VerticalaGridSet.pop();
				t.remove();
			}			
		}		
		
		// vertical grid 위치 잡기
		for( let i=0; i<this.VerticalaGridSet.length; i++){
			let x_ctc = i*this.oConfig.Xaxis_grid_size_ctcs + vg_x_min_ctc ;	
			let x_vbc = this.ctcs2vbcs( x_ctc , 0 );
			
			let t = this.VerticalaGridSet[i];
			t.setAttribute( 'id' , this.oConfig.LayerSet['Vertical_Grid'].id + '_' + String(i) );
			t.setAttribute( 'x1' , x_vbc.x );
			t.setAttribute( 'y1' , this.vbcs_y_min);
			t.setAttribute( 'x2' , x_vbc.x );
			t.setAttribute( 'y2' , this.vbcs_y_max);		
			
			//{{2022.08.08.실험 - 성공
			//t.style.stroke = 'rgb(255,0,0)';
			//}}
			
		}		
		
		//////////////////////////////////////////////////
		//	hg : horizontal grid		
		let hg_y_min_ctc = Math.ceil(  y_min_ctc / this.oConfig.Yaxis_grid_size_ctcs) * this.oConfig.Yaxis_grid_size_ctcs;	
		let hg_y_max_ctc = Math.floor( y_max_ctc / this.oConfig.Yaxis_grid_size_ctcs) * this.oConfig.Yaxis_grid_size_ctcs;	
		
		let hg_cnt       = ( hg_y_max_ctc - hg_y_min_ctc) / this.oConfig.Yaxis_grid_size_ctcs + 1;					

		// horizontal grid 개수 맞추기
		let delta_garo = hg_cnt - this.HorizontalGridSet.length;
		
		if( delta_garo>0 ){
			//부족할 때
			for( let i=0; i< delta_garo; i++){
				let t = document.createElementNS(this.const['SVG_NS'],'line');	//tmp 
				this.oConfig.LayerSet['Horizontal_Grid'].appendChild( t );
				this.HorizontalGridSet.push( t );			
			}
		}
		else if( delta_garo<0 ){
			//남을 때 
			for( let i=delta_garo; i< 0; i++){
				let t = this.HorizontalGridSet.pop();
				t.remove();
			}			
		}		
		
		//	horizontal grid 위치잡기
		for( let i=0; i<this.HorizontalGridSet.length; i++){
			let hg_y_ctc = i*this.oConfig.Yaxis_grid_size_ctcs + hg_y_min_ctc ;	
			
			let hg_vbc = this.ctcs2vbcs( 0, hg_y_ctc );
			
			let t = this.HorizontalGridSet[i];
			
			t.setAttribute('id' , this.oConfig.LayerSet['Horizontal_Grid'].id + '_' + String(i) );
			t.setAttribute('x1' , this.vbcs_x_min);
			t.setAttribute('y1' , hg_vbc.y);
			t.setAttribute('x2' , this.vbcs_x_max);
			t.setAttribute('y2' , hg_vbc.y);		
		}		
		
		/*
		*/
		
	}
	
	update_axis(){
		this.oConfig.LayerSet['X_axis'].setAttribute('x1',String(this.vbcs_x_min));
		this.oConfig.LayerSet['X_axis'].setAttribute('x2',String(this.vbcs_x_max ));
	
		this.oConfig.LayerSet['Y_axis'].setAttribute('y1',String(this.vbcs_y_min));
		this.oConfig.LayerSet['Y_axis'].setAttribute('y2',String(this.vbcs_y_max));					
	}	
		
	
	Event_Listener____________(){}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	el_mousemove(p_event){
		//{{2022.07.22 - debug 정보 찍기
		this.el_mouse_move_debug_info(p_event);
		//}}
		
		////////////////////////////////////////////////////////////////
		//                                                            //
		//	점 drag 중일 때 -> 점 위치이동                            //
		//                                                            //
		////////////////////////////////////////////////////////////////
		if( this.drag_ing){
			//{{debug 
			//if( p_event.offsetX > 190 && p_event.offsetX < 210 && p_event.offsetY > 190 && p_event.offsetY < 210){
			//	debugger;
			//}
			//}}debug 
			
			// viewbox coordinate (x,y) <- f(mouse pointer x,y on screen) 
			//	mouse좌표는 svg html element의 좌측상단을 (0,0)으로 하는 좌표임
			//	나는 이걸 screen 좌표라고 부름 
			
			let mouse_xy = this.scs2vbcs(p_event.offsetX,p_event.offsetY);	//scs 좌표, svg 좌측상단을 (0,0)으로 하는 좌표계 
			
			//magnetic grid mode인 경우에는 값을 보정(magnetic grid mode가 아닌 경우에는 기존값 유지)
			let vbxy = this.vbcs_considering_magnetic_mode( mouse_xy.x, mouse_xy.y);
			
			//call call-back routine
			this.drag_obj.call_back( this.drag_obj,vbxy.x , vbxy.y);	
		}
		
		////////////////////////////////////////////////////////////////
		//                                                            //
		//	wheel draging 중일 때 -> 원점이동                         //
		//                                                            //
		////////////////////////////////////////////////////////////////
		//(VALD)
		if( !this.wheel_drag_ing){
			return;
		}
		//(VALD) - Wheel을 누르고 있지 않다면... / 휠을 땠는데 제대로 동작 안할 때가 있음
		//{{2022.07.26 - buttons -> button 
		//if(p_event.buttons != 4){
		//}}{{
		//if(p_event.button != 1){	//button은 mousedown,mouseup에서만 값이 정상이라고 함
		if(p_event.buttons != 4){	//button은 mousedown,mouseup에서만 값이 정상이라고 함
		//}}
			this.wheel_drag_ing = false;
			this.scr_Ox_delta = 0;
			this.scr_Oy_delta = 0;			
			return;
		}
		
		//(Logic) 원점이동 로직
		this.scr_Ox = p_event.offsetX - this.scr_Ox_delta;
		this.scr_Oy = p_event.offsetY - this.scr_Oy_delta;
		this.update_screen();

	}	

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	el_mouse_move_debug_info(p_event){	//touchmove debug정보도 여기서 처리 
		if( !this.oConfig.debug_flag ){
			return;
		}

		//{{2022.08.10
		let div_offset = this.oConfig.get_div_offset_position();
		let vb_xy = null;
		//}}		
		
		if( this.oConfig.platform.desktop ){
			info_update('mouse move - ' + String(p_event.offsetX) + ' , ' + String(p_event.offsetY) );			
			
			this.update_debug_info('debug_pageX'  , String(p_event.pageX)   + ' , ' + String(p_event.pageY) );
			this.update_debug_info('debug_scr_xy' , String(p_event.pageX - div_offset.x)   + ' , ' + String(p_event.pageY - div_offset.y) );
			this.update_debug_info('debug_offsetX', String(p_event.offsetX) + ' , ' + String(p_event.offsetY) );
			
			vb_xy = this.scs2vbcs(p_event.pageX - div_offset.x, p_event.pageY - div_offset.y);
			
			
		}
		else if( this.oConfig.platform.mobile ){
			this.update_debug_info('debug_pageX'  , scUtil.number_for_display(p_event.touches[0].pageX)   + ' , ' + scUtil.number_for_display(p_event.touches[0].pageY) );
			this.update_debug_info('debug_scr_xy' , scUtil.number_for_display(p_event.touches[0].pageX - div_offset.x)   + ' , ' + scUtil.number_for_display(p_event.touches[0].pageY - div_offset.y) );
			this.update_debug_info('debug_offsetX', p_event.offsetX + ' , ' + p_event.offsetY );

			vb_xy = this.touchevent_mouse_vbxy(p_event);
		}
		else{
			debugger;
		}
		
		this.update_debug_info('debug_vb_xy'  , scUtil.number_for_display(vb_xy.x)   + ' , ' + scUtil.number_for_display(vb_xy.y) );
		
		let ccs_xy = this.vbcs2ctcs( vb_xy.x, vb_xy.y );	//Cartesian coordinate system	
		this.update_debug_info('debug_ct'  , scUtil.number_for_display(ccs_xy.x)   + ' , ' + scUtil.number_for_display(ccs_xy.y) );
	}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	el_mousedown(p_event){
		//debugger;
		
		//when wheel button is clicked,
		//wheel 버튼을 누른 거에만 반응(wheel drag해서 view이동) 
		//{{2022.07.25 -> buttons는 여러 버튼을 동시에 눌렀을 때 동작하는 것 
		//if(p_event.buttons == 4){
		//}}{{
		if(p_event.button == 1){	//휠 버튼 클릭 -> 원점이동모드 	
		//}}
			this.debug_log('scr   [mouse] down - wheel - 원점이동모드 시작');
			p_event.preventDefault();
			this.wheel_drag_ing = true;
			
			//원점과 떨어진 정도 
			this.scr_Ox_delta = p_event.offsetX  - this.scr_Ox;
			this.scr_Oy_delta = p_event.offsetY - this.scr_Oy;			
		}
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	el_mouseup(p_event){

		//{{2022.07.26 -> which는 사용하지 말라고 함 
		//if( p_event.which==2 ){	//which == 2 : wheel button  -> 예전방식
		//}}{{
		if( p_event.button == 1 ){
		//}}
			if( this.wheel_drag_ing ){
				
				this.debug_log('scr   [mouse] up   - wheel - 원점이동모드 완료');
				p_event.preventDefault();
				this.wheel_drag_ing = false;
				
				this.scr_Ox_delta = 0;
				this.scr_Oy_delta = 0;
			}
		}
		//}}

		
		//drag 중이였을 때, 'drag종료처리'
		//{{2022.07.26 -> which는 사용하지 말라고 함 
		//if( p_event.which == 1 ){	//when == 1 : when left button is released
		//}}{{
		if( p_event.button == 0 ){	
		//}} 
			if( this.drag_ing ){
				this.debug_log('scr   [mouse] up   - Drag  - 점 이동모드 완료');

				this.drag_ing = false;
				
				this.drag_obj.cb_mouseup();
				this.drag_obj = null;
			}		
		}
		
	}	
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//마우스 포인터의 위치가 svg 위에 있지 않을 때
	el_mouseenter(p_event){
		this.debug_log('scr   [mouse] enter');
		this.mouse_valid = true;
	}		
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//마우스 포인터가 svg 밖으로 나갔을 때
	el_mouseleave(p_event){
		this.debug_log('scr   [mouse] leave');
		
		this.mouse_valid = false;
		
		//점 이동모드 - drag중이였으면, 'drag종료처리'
		if( this.drag_ing){
			this.drag_ing = false;
			
			this.drag_obj.cb_mouseup(true);
			
			this.drag_obj = null;			
		}
		//원점이동모드 - Wheel drag - 완료 
		else if( this.wheel_drag_ing ){
			this.wheel_drag_ing = false;
			
			this.scr_Ox_delta = 0;
			this.scr_Oy_delta = 0;
		}
		
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//mouse wheeel 돌릴 때 
	//	; 삼각형 확대/축소
	el_wheel(p_event){
		//debugger;
		
		//(VALD) 휠을 클릭한 상태에서, drag하는 중이면 true -> 원점 이동모드
		if( this.wheel_drag_ing ){
			return;
		}
		
		//휠 처리
		if( p_event.deltaY <0 ){	//wheel - 위로 올릴 때, 삼각형 축소
			this.debug_log('scr   [mouse] wheel- 축소(-)');	//돋보기 마이너스
			p_event.preventDefault();
			this.svg_reduce(p_event.offsetX,p_event.offsetY);
		}
		else if( p_event.deltaY>0){	//wheel을 아래로 내릴 때, 오브젝트 확대
			this.debug_log('scr   [mouse] wheel- 확대(+)');	//돋보기 플러스
			p_event.preventDefault();
			this.svg_enlarge(p_event.offsetX,p_event.offsetY);
		}
		
	}		

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//스페이스바 누르면 화면을 정중앙으로 -> 화면, scr을 실행했을 때의 모습으로
	el_keypress(p_event){
		//(VALD) 마우스 포인터가 svg 상에 있어야만 keyboard event를 동작시킨다
		if( this.mouse_valid == false){
			return;
		}
		
		//스페이스바에만 반응 -> Mobile 모드에서는 버튼이 필요함
		if(p_event.keyCode == 32){	//spacebar keyCode: 32
			p_event.preventDefault();

			this.update_scale_factor( this.oConfig.vbcs_scale_factor_initial );	
			
			this.scr_Ox  = this.oConfig.scr_Ox_initial;
			this.scr_Oy  = this.oConfig.scr_Oy_initial;

			this.update_screen();
		}
	}	
	
	//{{2022.08.10 - touch한 마우스 포인터가 DIV 내부에 있는가? note.#860
	is_touch_point_in_the_SCR(p_event){
		let div_offset = this.oConfig.get_div_offset_position();
		
		let scr_x_min = div_offset.x;
		let scr_y_min = div_offset.y;
		
		let scr_x_max = scr_x_min + this.oConfig.scr_width;
		let scr_y_max = scr_y_min + this.oConfig.scr_height;
		
		if( p_event.touches[0].pageX < scr_x_min || p_event.touches[0].pageX > scr_x_max ){
			return false;
		}

		if( p_event.touches[0].pageY < scr_y_min || p_event.touches[0].pageY > scr_y_max ){
			return false;
		}		
		
		return true;
		
	}
	//}}
	
	//점검완료 - mousemove와 동이로직
	el_touchmove(p_event){
		this.el_mouse_move_debug_info(p_event);	//debug
		
		////{{2022.08.10. note.#860 - 효과없음
		//if( !this.is_touch_point_in_the_SCR(p_event) ){
		//	return;
		////}}
		
		//점 이동모드 
		if( this.drag_ing){	//drag_ing : point에서 touchstart하는 시점에 등록시킨다.
			p_event.preventDefault();
			
			let touchXY_scs = this.touchevent_mouse_vbxy(p_event);
			let XY_vbc = this.vbcs_considering_magnetic_mode( touchXY_scs.x, touchXY_scs.y);
			this.drag_obj.call_back( this.drag_obj,  XY_vbc.x , XY_vbc.y );		
		}		
		
		//view move mode -> 장기적으로 버튼으로 교체하는게 좋을 듯 -> 이걸 유지할지 결정을 못함
		if( this.pan_mode ){
			p_event.preventDefault();
			
			let vbxy = this.touchevent_mouse_vbxy(p_event);

			this.scr_Ox = vbxy.x - this.scr_Ox_delta;
			this.scr_Oy = vbxy.y - this.scr_Oy_delta;
			
			this.update_screen();

			//this.touch_moved = true;	//fail		
		}
	}				
	
	
	//점검완료
	el_touchend(p_event){
		
		//move view mode 
		if( this.pan_mode ){
			//debugger;
			//if( this.touch_moved ){		//fail
				p_event.preventDefault();
				
				//{{
				//this.pan_mode  = false;
				let tmp_evt = document.createEvent('Events');
				tmp_evt.initEvent( 'click' , true, false);
				this.oConfig.ToolHitareaSet['Pan'].dispatchEvent( tmp_evt );	
				//}}
				
				this.wheel_drag_ing = false;		

				this.scr_Ox_delta = 0;
				this.scr_Oy_delta = 0;			
		}		
		
		//점 이동모드
		if( this.drag_ing ){
			this.debug_log('scr   [touch] end   - 점 이동모드 완료');		
			
			this.drag_ing = false;
			
			this.drag_obj.cb_mouseup();
			this.drag_obj = null;
		}		
			
	}		
	
	//{{2022.08.13
	el_Toolbar_Click( e , p_which_tool){
		if( p_which_tool === 'ScreenShot' ){
			this.screenshot_download();
		}
	}
	
	//}}2022.08.13
	
	//{{2022.07.29
	el_magnet_click2(p_event,p_test_val){
		debugger;
	}
	//}}

	
	el_magnet_click(){
		if( this.magnetic_mode ){
			this.magnetic_mode = false;
			this.oConfig.ToolHitareaSet['Magnet'].setAttribute('fill-opacity','0.5');			
		}
		else{
			this.magnetic_mode = true;
			this.oConfig.ToolHitareaSet['Magnet'].setAttribute('fill-opacity','0.2');	
		}
	}
	
	el_grid_click(){
		if( this.grid_mode ){
			this.grid_mode = false;

			this.oConfig.ToolHitareaSet['Grid'].setAttribute('fill-opacity','0.5');
			this.oConfig.LayerSet['Grid'].setAttribute('visibility','hidden');	
			this.oConfig.LayerSet['Axis'].setAttribute('visibility','hidden');
		}
		else{
			this.grid_mode = true;

			this.oConfig.ToolHitareaSet['Grid'].setAttribute('fill-opacity','0.2');			
			this.oConfig.LayerSet['Grid'].setAttribute('visibility','visible');	
			this.oConfig.LayerSet['Axis'].setAttribute('visibility','visible');
		}
	}
	
	el_pan_click(p_event){
		p_event.preventDefault();
		
		//{{2022.08.12
		//debugger;
		this.screenshot();
		return;
		//}}
		
		if( this.pan_mode ){
			this.pan_mode = false;
			this.oConfig.ToolHitareaSet['Pan'].setAttribute('fill-opacity','0.5');		
		}
		else{
			this.pan_mode = true;
			this.oConfig.ToolHitareaSet['Pan'].setAttribute('fill-opacity','0.2');		
		}
	}	
		
	Util______________________(){}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////		
	//mouse wheel을 위로 올릴 때 - 축소시켜야 함 
	svg_reduce(p_scr_x,p_scr_y){
		//(VALD) - 최대 확대 비율
		if( this.vbcs_scale_factor >= 3){
			return;
		}
		
		let vb = this.scs2vbcs(p_scr_x,p_scr_y);	
		
		let delta_x = (p_scr_x - this.scr_Ox) * this.vbcs_scale;
		let delta_y = (p_scr_y - this.scr_Oy) * this.vbcs_scale;
		
		this.update_scale_factor( this.vbcs_scale_factor+1 );	
		
		//div element를 기준으로 하는 좌표계상에서, 원점의 위치를 계산
		//screen 상에서 원점의 위치를 먼저 결정한 후에, update_viewbox()를 해야 함
		this.scr_Ox = p_scr_x - (delta_x / this.vbcs_scale);
		this.scr_Oy = p_scr_y - (delta_y / this.vbcs_scale);
		
		this.update_screen();

	}	
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////		
	//note.#812 , #809
	update_scale_factor(pvbcs_scale_factor){
		//scale 조정
		this.vbcs_scale_factor = pvbcs_scale_factor;
		this.vbcs_scale = Math.pow(2,this.vbcs_scale_factor);
		
		//toolbar 크기 조정 
		if( this.oConfig.platform.desktop ){
			this.oConfig.LayerSet['Tools_Scale'].setAttribute('transform','scale(' + String(this.vbcs_scale) + ')' );		
		}
		else if( this.oConfig.platform.mobile ){
			//[중요]
			// desktop은 this.oConfig.platform_ratio=1 이므로,
			// 이 로직으로 다 해결가능
			
			this.oConfig.LayerSet['Tools_Scale'].setAttribute('transform','scale(' + String( this.oConfig.platform_ratio*this.vbcs_scale) + ')' );		
		}
		
		//Logo 크기 조정
		//{{2022.08.14
		this.oLogo.update_scale();
		this.oCopyright.update_scale();
		//}}
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////		
	//mouse wheel을 아래로 내릴 때 - 확대 , scale_factor값이 작아져야 한다.
	svg_enlarge(p_scr_x,p_scr_y){
		//(VALD) - 최대 확대 비율
		if( this.vbcs_scale_factor <= -3){
			return;
		}
		
		let vb = this.scs2vbcs(p_scr_x,p_scr_y);	
		
		let delta_x = (p_scr_x - this.scr_Ox) * this.vbcs_scale;
		let delta_y = (p_scr_y - this.scr_Oy) * this.vbcs_scale;			
		
		this.update_scale_factor( this.vbcs_scale_factor-1 );
		
		this.scr_Ox = p_scr_x - (delta_x / this.vbcs_scale);
		this.scr_Oy = p_scr_y - (delta_y / this.vbcs_scale);		
		
		this.update_screen();
	}			
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	
	//note.#810
	get_layer( p_layer_name ){
		let seLayer = this.oConfig.LayerSet[ p_layer_name ];
		
		//프로그래밍 오류 ->
		if( typeof seLayer === 'undefined'){	// === 3개 짜리는 data type,value 모두 같아야 true 
			debugger;	//layer name 오류 or 미등록 레이어
		}
		
		return seLayer;
	}
	
		
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	Precondition:
	//		vbcs x,y
	//
	//	Postcondition:
	//		vbcs x,y (단, magnetic mode가 적용된)
	vbcs_considering_magnetic_mode(p_vb_x,p_vb_y){
		let vb_x = 0;
		let vb_y = 0;
		
		if( this.magnetic_mode ){	//[할 일] Mobile에서도 정상작동 하려면, Grid Size는 1에 몇 pixel인지를 고려해서 _vb_x_grid_size가 정해졌는지 확인해봐야함
			vb_x = Math.round( p_vb_x / this.oConfig.Xaxis_grid_size_vbcs) * this.oConfig.Xaxis_grid_size_vbcs;
			vb_y = Math.round( p_vb_y / this.oConfig.Yaxis_grid_size_vbcs) * this.oConfig.Yaxis_grid_size_vbcs;
		}
		else{
			vb_x = p_vb_x; 
			vb_y = p_vb_y; 
		}
		
		return{
			x: vb_x,
			y: vb_y
		};		
	}	

	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	scr상에 drag 중인 점이 없다면, drag object에 등록 
	//
	//	점들이 클릭됐을 때 호출
	//
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

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	점 주위에 마우스 포인터를 위치시킬 때
	//		현재 drag가 가능한 상황이라면
	//		점 주위에 오라(aura) 를 만들어 준다.
	//마우스 사용가능한지. 점A를 점B위로 드래그중에, 점B의 mouseover가 동작함
	is_it_possible_to_drag(){
		return !this.drag_ing;
	}	
	

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	mouse move에서 호출
	//		scr상에서 마우스 포인터의 위치에 대한
	//		vb상에서의 좌표를 리턴
	// viewbox x,y <- f( screen x,y )  : 마우스를 svg위에 올릴 때 탄다
		
	//note.#817
	scs2vbcs(p_scr_x,p_scr_y){
		let vb_x = this.vbcs_scale * (p_scr_x - this.scr_Ox);
		let vb_y = this.vbcs_scale * (p_scr_y - this.scr_Oy);		
		
		return {
			x: vb_x,
			y: vb_y
		};
	}		
	
	//{{2022.08.12 - image screenshot 할 때 사용(note.#863)
	vbcs2scs(p_vb_x,p_vb_y){
		let scs_x = p_vb_x / this.vbcs_scale + this.scr_Ox;
		let scs_y = p_vb_y / this.vbcs_scale + this.scr_Oy;		
		
		return {
			x: scs_x,
			y: scs_y
		};
	}
		
	vbcs2imgcs(p_vb_x,p_vb_y,p_imgcs_scale){
		let scs_xy   = this.vbcs2scs( p_vb_x , p_vb_y);
		let imgcs_xy = this.scs2imgcs( scs_xy.x , scs_xy.y , p_imgcs_scale );
		
		return {
			x : imgcs_xy.x,
			y : imgcs_xy.y
		};
	}
	
	scs2imgcs(p_scs_x,p_scs_y,p_imgcs_scale){
		let imgcs_x = p_scs_x * p_imgcs_scale;
		let imgcs_y = p_scs_y * p_imgcs_scale;
		
		return {
			x : imgcs_x,
			y : imgcs_y
		};
	}
	
	dist_vbcs2imgcs(p_vb_len,p_imgcs_scale){
		return p_vb_len / this.vbcs_scale * p_imgcs_scale;
	}
	//}}2022.08.12
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	카테시안 좌표 <- f( viewbox x,y )
	//mouse move에서 탄다
	vbcs2ctcs(p_vb_x,p_vb_y){
			
		//{{2022.08.07.note.#856
		let ct_x = p_vb_x / this.oConfig.CF_ctcs2vbcs     ;
		let ct_y = p_vb_y / this.oConfig.CF_ctcs2vbcs * -1; 
		//}}
		
		return{
			x: ct_x,
			y: ct_y
		};
	}		
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//p_x : Cartesian 좌표계상에서의 x위치
	//post-condition: viewbox상에서의 x,y위치
	//점, 각등에서 자주 호출됨, 유틸성격
	//note.816
	ctcs2vbcs(p_x,p_y){
		//let ret  = this.get_scr_xy(p_x,p_y);
		//let ret2 = this.get_vb_xy( ret.x, ret.y);
		
		//{{2022.08.07.note.#856
		//let vb_x = p_x * this._ct_x_pixels;
		//let vb_y = p_y * this._ct_y_pixels * -1;
		//}}{{
		let vb_x = p_x * this.oConfig.CF_ctcs2vbcs;
		let vb_y = p_y * this.oConfig.CF_ctcs2vbcs * -1;
		//}}
		
		return{
			x: vb_x,
			y: vb_y
		};
	}	
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	//	c_angle.update, c_line.update_symbol에서 사용
	//vbcs상에서의 거리 <- f(ctcs상에서의 거리)
	//	c_line_symbol.update_position 
	dist_ctcs2vbcs(p_ctcs_distance){
		return p_ctcs_distance * this.oConfig.CF_ctcs2vbcs;
	}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	//{{2022.07.29
	dist_vbcs2ctcs(p_vbcs_distance){
		//{{2022.08.07.note.#856
		return p_vbcs_distance / this.oConfig.CF_ctcs2vbcs; 	
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	// 	c_line.update_symbol에서 사용
	//		두 점 사이의 거리(ctcs기준)
	dist_on_ctcs(p_Ax,p_Ay,p_Bx,p_By){
		let distance = Math.sqrt( Math.pow((p_Bx - p_Ax),2) + Math.pow((p_By - p_Ay),2) );
		return distance;		
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//각도를 0~360사이의 값으로 표현
	normal_degree2(p_degree){
		//모듈러 사용 불가, 음수는 모듈러도 음수가 나옴
		//return p_degree % 360;
		
		let quotient = p_degree / 360; //몫
		let valid_quotient = Math.floor(quotient);
		let valid_deg = valid_quotient * -360 + p_degree;	

		return valid_deg;	
	}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//각도를 -180~180사이의 값으로 표현
	normal_degree(p_degree){
		let deg = p_degree;
		
		if(deg<0 || deg >=360){
			deg = this.normal_degree2(p_degree)
		}
		
		if( deg > 180 ){
			deg += -360
		}
		
		return deg;	
	}	
	
	//미사용
	calc_CircleXY(p_r,p_deg){
		let rad = this.calc_deg2rad(p_deg);
		
		return{
			x: Math.cos(rad) * p_r,
			y: Math.sin(rad) * p_r
		};		
	}
	
	//c_line.update_internal에서 사용 
	calc_CircleXY2(p_Ox,p_Oy,p_r,p_theta){
		let x = p_r * Math.cos(p_theta) + p_Ox;
		let y = p_r * Math.sin(p_theta) + p_Oy;
		
		return{
			x:x,
			y:y
		};
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
	debug_log(p_msg){
		//(VALD) debug mode에서만 동장
		if( !this.oConfig.debug_flag ){	
			return;
		}
		
		console.log( p_msg );
	}

	//el_touchmove에서 사용 , el_touchstart에서 사용
	touchevent_mouse_vbxy(p_event){
		let div_offset = this.oConfig.get_div_offset_position();
			
		let offset_x = p_event.touches[0].pageX - div_offset.x;
		let offset_y = p_event.touches[0].pageY - div_offset.y;		

		let vbxy = this.scs2vbcs(offset_x,offset_y);			
		
		return vbxy;
	}	
	
	update_debug_info(p_id,p_text){
		//(VALD) : debug flag가 셋 되었을 때만 작업
		if( !this.oConfig.debug_flag ){	
			return;
		}

		scUtil.update_element_innerHTML( p_id , p_text );
	}	
	
	
	Not_arranged______________(){}	//function list seperator
	
	///////////////////////////////////////////////////////////////////
	//                                                               //
	//	미정리                                                       //
	//                                                               //
	
	//미사용 
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
	//c_line의 update_internal에서 사용 
	calc_radian(p_A,p_B){
		//p_A를 원점으로 두고,p_B에서 각도를 계산
		let Px = p_B.ct_x - p_A.ct_x;
		let Py = p_B.ct_y - p_A.ct_y;
		
		let rad = Math.atan2(Py,Px);

		return rad;
	}	
	
	//{{2022.08.13
	//두 점 사이의 각도를 계산 -> 로직은 calc_radian과 동일
	calc_radian_between_2_points(p_Ox,p_Oy,p_x,p_y){	
		//(p_Ox,p_Oy)를 중심으로 (p_x,p_y)가 이루는 각도를 계산
		let Px = p_x - p_Ox;
		let Py = p_y - p_Oy;
		
		let rad = Math.atan2(Py,Px);

		return rad;

	}
	
	calc_angle_between_2_points(p_Ox,p_Oy,p_x,p_y){	
		//p_A를 원점으로 두고,p_B에서 각도를 계산
		let Px = p_x - p_Ox;
		let Py = p_y - p_Oy;
		
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
	//}}2022.08.13
	
	//{{2022.08.12.note.#863
	register_screenshot_objs(p_obj_set){	//각 점,선,각을 스샷뜨기 위해 등록해놓아야 함
		this.screenshot_objs = p_obj_set;
	}
		
	screenshot(){
		//{{debug 
		//let imgcs_scale = 2;
		let imgcs_scale = 1;
		
		let eCanvas = document.getElementById("sw_canvas");
		eCanvas.width  = this.oConfig.scr_width  * imgcs_scale;
		eCanvas.height = this.oConfig.scr_height * imgcs_scale;
		
		//let x_delta = 0;
		//let y_delta = 400;
		
		//}}debug
		
		let ctx = eCanvas.getContext("2d");
		
		//background
		this.oLogo.cb_screenshot(ctx,imgcs_scale);
		this.oCopyright.cb_screenshot(ctx,imgcs_scale);
		
		//Grid Layer
		if( this.oConfig.LayerSet['Grid'].getAttribute('visibility') === 'visible' ){	//VALD - Grid가 현재 화면에 보이면

			//2-1. 선 스타일
			
			//{{
			//ctx.strokeStyle = 'rgba(0,0,0,1)';	//검정색 - line color, 윤곽선색
			//}}{{
			ctx.strokeStyle = this.get_style('.c_grid','stroke');
			//}}
			
			//{{
			//ctx.lineWidth = 2;					//선 두께
			//}}{{
			ctx.lineWidth = this.dist_vbcs2imgcs( this.get_style('.c_grid','stroke-width') , imgcs_scale);	//선 두께	
			//}}
			
			ctx.lineCap  = 'butt';				//선 end-point 모양(butt:직각)
			ctx.lineJoin = 'miter';				//선이 꺾일때의 모양

			//2-2. 선 그리기
			ctx.beginPath();					//		

			//vertical grid
			for (const [key, elmt] of Object.entries( this.oConfig.LayerSet['Vertical_Grid'].children )) {
				//console.log(`${key}: ${value}`);
				let x1 = Number(elmt.getAttribute('x1'));
				let y1 = Number(elmt.getAttribute('y1'));
				let x2 = Number(elmt.getAttribute('x2'));
				let y2 = Number(elmt.getAttribute('y2'));
				
				let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
				let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
				
				//console.log(start_imgcs.x,start_imgcs.y,end_imgcs.x,end_imgcs.y);
				//debugger;
				
				ctx.moveTo(start_imgcs.x, start_imgcs.y);					//시작점
				ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
				
			}
			
			//horizontal grid 
			for (const [key, elmt] of Object.entries( this.oConfig.LayerSet['Horizontal_Grid'].children )) {
				let x1 = Number(elmt.getAttribute('x1'));
				let y1 = Number(elmt.getAttribute('y1'));
				let x2 = Number(elmt.getAttribute('x2'));
				let y2 = Number(elmt.getAttribute('y2'));
				
				let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
				let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
				
				//console.log(start_imgcs.x,start_imgcs.y,end_imgcs.x,end_imgcs.y);
				//debugger;
				
				ctx.moveTo(start_imgcs.x, start_imgcs.y);					//시작점
				ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
				
			}
			
			ctx.stroke();
			
		}
		
		////////////////////////////////////////////////////////
		//	X,Y축 그리기
		if( this.oConfig.LayerSet['Axis'].getAttribute('visibility') === 'visible' ){	//VALD - Grid가 현재 화면에 보이면

			//2-1. 선 스타일
			
			//{{
			//ctx.strokeStyle = 'rgba(0,0,0,1)';	//검정색 - line color, 윤곽선색
			//}}{{
			ctx.strokeStyle = this.get_style('.c_axis','stroke');
			//}}
			
			//{{
			//ctx.lineWidth = 2;					//선 두께
			//}}{{
			ctx.lineWidth = this.dist_vbcs2imgcs( this.get_style('.c_axis','stroke-width') , imgcs_scale);	//선 두께	
			//}}
			
			ctx.lineCap  = 'butt';				//선 end-point 모양(butt:직각)
			ctx.lineJoin = 'miter';				//선이 꺾일때의 모양

			//2-2. 선 그리기
			ctx.beginPath();					//		
			
			
			
			//X-axis
			let x1 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('x1') );
			let y1 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('y1') );
			let x2 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('x2') );
			let y2 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('y2') );
			
			let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
			let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
			
			ctx.moveTo(start_imgcs.x, start_imgcs.y);			//시작점
			ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
			
			//Y-axis
			x1 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('x1') );
			y1 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('y1') );
			x2 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('x2') );
			y2 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('y2') );
			
			start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
			end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
			
			ctx.moveTo(start_imgcs.x, start_imgcs.y);			//시작점
			ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점				
			
			ctx.stroke();
		}		

		////////////////////////////////////////////////////////
		//	화면상의 각 점,선,면에 대해 call-back실행
		if( this.screenshot_objs !== null ){
			for( let i=0; i<this.screenshot_objs.length; i++){
				
				try{
					this.screenshot_objs[i].cb_screenshot(ctx,imgcs_scale);
				}
				catch(error){
					debugger;	//screen-shot call back이 구현되지 않음
				}				
				
			}
		}
		
		////////////////////////////////////////////////////////
		//4. canvas download 
		
		//{{debug
		return;
		//}}
		
		let filename = '1111.png'
		
		let link=document.createElement("a");
		link.href = eCanvas.toDataURL('image/png');   //function blocks CORS
		//link.download = 'screenshot.png';
		link.download = filename;
		link.click();					
		
	}
	
	screenshot_download(){
		//{{debug 
		let imgcs_scale = 2;
		
		//let eCanvas = document.getElementById("sw_canvas");
		let eCanvas=document.createElement("canvas");
		eCanvas.width  = this.oConfig.scr_width  * imgcs_scale;
		eCanvas.height = this.oConfig.scr_height * imgcs_scale;
		
		//let x_delta = 0;
		//let y_delta = 400;
		
		//}}debug
				
		let ctx = eCanvas.getContext("2d");
		
		//background color 
		//ctx.fillStyle   = 'rgb(252,252,164)';	//옥스포드 노트 색깔
		ctx.fillStyle   = 'rgb(255,255,255)';
		ctx.beginPath();
		ctx.moveTo( 0             , 0              );
		ctx.lineTo( eCanvas.width , 0              );
		ctx.lineTo( eCanvas.width , eCanvas.height );
		ctx.lineTo( 0             , eCanvas.height );
		ctx.lineTo( 0             , 0              );
		ctx.fill();
		
		this.oLogo.cb_screenshot(ctx,imgcs_scale);
		
		
		//Grid Layer
		if( this.oConfig.LayerSet['Grid'].getAttribute('visibility') === 'visible' ){	//VALD - Grid가 현재 화면에 보이면

			//2-1. 선 스타일
			
			//{{
			//ctx.strokeStyle = 'rgba(0,0,0,1)';	//검정색 - line color, 윤곽선색
			//}}{{
			ctx.strokeStyle = this.get_style('.c_grid','stroke');
			//}}
			
			//{{
			//ctx.lineWidth = 2;					//선 두께
			//}}{{
			ctx.lineWidth = this.dist_vbcs2imgcs( this.get_style('.c_grid','stroke-width') , imgcs_scale);	//선 두께	
			//}}
			
			ctx.lineCap  = 'butt';				//선 end-point 모양(butt:직각)
			ctx.lineJoin = 'miter';				//선이 꺾일때의 모양

			//2-2. 선 그리기
			ctx.beginPath();					//		

			//vertical grid
			for (const [key, elmt] of Object.entries( this.oConfig.LayerSet['Vertical_Grid'].children )) {
				//console.log(`${key}: ${value}`);
				let x1 = Number(elmt.getAttribute('x1'));
				let y1 = Number(elmt.getAttribute('y1'));
				let x2 = Number(elmt.getAttribute('x2'));
				let y2 = Number(elmt.getAttribute('y2'));
				
				let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
				let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
				
				//console.log(start_imgcs.x,start_imgcs.y,end_imgcs.x,end_imgcs.y);
				//debugger;
				
				ctx.moveTo(start_imgcs.x, start_imgcs.y);					//시작점
				ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
				
			}
			
			//horizontal grid 
			for (const [key, elmt] of Object.entries( this.oConfig.LayerSet['Horizontal_Grid'].children )) {
				let x1 = Number(elmt.getAttribute('x1'));
				let y1 = Number(elmt.getAttribute('y1'));
				let x2 = Number(elmt.getAttribute('x2'));
				let y2 = Number(elmt.getAttribute('y2'));
				
				let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
				let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
				
				//console.log(start_imgcs.x,start_imgcs.y,end_imgcs.x,end_imgcs.y);
				//debugger;
				
				ctx.moveTo(start_imgcs.x, start_imgcs.y);					//시작점
				ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
				
			}
			
			ctx.stroke();
			
		}
		
		////////////////////////////////////////////////////////
		//	X,Y축 그리기
		if( this.oConfig.LayerSet['Axis'].getAttribute('visibility') === 'visible' ){	//VALD - Grid가 현재 화면에 보이면

			//2-1. 선 스타일
			
			//{{
			//ctx.strokeStyle = 'rgba(0,0,0,1)';	//검정색 - line color, 윤곽선색
			//}}{{
			ctx.strokeStyle = this.get_style('.c_axis','stroke');
			//}}
			
			//{{
			//ctx.lineWidth = 2;					//선 두께
			//}}{{
			ctx.lineWidth = this.dist_vbcs2imgcs( this.get_style('.c_axis','stroke-width') , imgcs_scale);	//선 두께	
			//}}
			
			ctx.lineCap  = 'butt';				//선 end-point 모양(butt:직각)
			ctx.lineJoin = 'miter';				//선이 꺾일때의 모양

			//2-2. 선 그리기
			ctx.beginPath();					//		
			
			
			
			//X-axis
			let x1 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('x1') );
			let y1 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('y1') );
			let x2 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('x2') );
			let y2 =  Number( this.oConfig.LayerSet['X_axis'].getAttribute('y2') );
			
			let start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
			let end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
			
			ctx.moveTo(start_imgcs.x, start_imgcs.y);			//시작점
			ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점	
			
			//Y-axis
			x1 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('x1') );
			y1 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('y1') );
			x2 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('x2') );
			y2 =  Number( this.oConfig.LayerSet['Y_axis'].getAttribute('y2') );
			
			start_imgcs = this.vbcs2imgcs( x1, y1, imgcs_scale);	//시작점(screen 좌표계)
			end_imgcs   = this.vbcs2imgcs( x2, y2, imgcs_scale);
			
			ctx.moveTo(start_imgcs.x, start_imgcs.y);			//시작점
			ctx.lineTo(end_imgcs.x, end_imgcs.y);				//끝점				
			
			ctx.stroke();
		}		

		////////////////////////////////////////////////////////
		//	화면상의 각 점,선,면에 대해 call-back실행
		if( this.screenshot_objs !== null ){
			for( let i=0; i<this.screenshot_objs.length; i++){
				
				try{
					this.screenshot_objs[i].cb_screenshot(ctx,imgcs_scale);
				}
				catch(error){
					debugger;	//screen-shot call back이 구현되지 않음
				}				
				
			}
		}
		
		////////////////////////////////////////////////////////
		//	copyright
		this.oCopyright.cb_screenshot(ctx,imgcs_scale);
		
		////////////////////////////////////////////////////////
		//4. canvas download 
		
		let filename = 'dotori.png'
		
		let link=document.createElement("a");
		link.href = eCanvas.toDataURL('image/png');   //function blocks CORS
		//link.download = 'screenshot.png';
		link.download = filename;
		link.click();					
		
		//debugger;
		link.remove();
		eCanvas.remove() ;
		//debugger;
		
		
	}	
	
	get_style(p_selector,p_property){
		//{{
		//for(let i=0; i< document.styleSheets.length;i++){
		//	let sheet = document.styleSheets[i];
		//	console.log(sheet);
		//}
		//}}
		
		//{{
		//let css = this.util.dictionary_search_by_property_match(document.styleSheets,'title','CSS1');
		//let css_class = this.util.dictionary_search_by_property_match( css.rules,'selectorText','.c_grid');
		//console.log( css_class.style['stroke'] );
		//debugger;
		//}}

		let css = this.util.dictionary_search_by_property_match(document.styleSheets,'title','CSS1');
		let css_class = this.util.dictionary_search_by_property_match( css.rules,'selectorText', p_selector );
		return css_class.style[p_property];
		
	}
	
	//}}2022.08.12
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

class scSCRconst{	//static constant class
	static SVG_NS = 'http://www.w3.org/2000/svg';
	
	static ORIGIN_USERDEFINED = 0;
	static ORIGIN_CENTER = 1;
	static ORIGIN_QUAD1  = 2;
	
	static ANGLE_NOT_DEFINED = -1;
	static ANGLE_ACUTE       =  0;	//예각
	static ANGLE_RIGHT       =  1;	//직각
	static ANGLE_OBTUSE      =  2;	//둔각
}
