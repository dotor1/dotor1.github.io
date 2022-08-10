//const HIT_AREA_R = 50;	//반응영역 반지름
//const POINT_R = 4;		//점 반지름

//class c_point{
class cPoint{
	
	oSCR = null;	//screen object	== svg element , it's my definition

	interactive_mode = false;	
	
	ct_x = 0;		//ctcs x
	ct_y = 0;		//ctcs y
	
	vb_x = 0;		//vbcs x
	vb_y = 0;		//vbcs y
	
	symbol = ''		//symbol text
	
	oSymbol = null;	
	
	hit_circle = null;	
	
	drag_ing = false;
	
	hit_area = null;	//{십자선,hit_circle}	
	
	call_back = null;
	
	sePoint = null;	//점검완료, points layer에 붙는 점
	
	constructor(p_scr_object, p_ct_x,p_ct_y,p_symbol,p_interactive_mode=false,p_cb=null){

		this.oSCR = p_scr_object;		//좌표계 object	

		this.interactive_mode = p_interactive_mode;
		
		this.ct_x   = p_ct_x;	//카테시안 좌표상의 X좌표 	
		this.ct_y   = p_ct_y;
		this.symbol = p_symbol;	//이름
		
		if( p_cb != null){
			this.call_back = p_cb;	//call back routine
		}

	}
	
	//note.826
	//xls : 'cPoint정리'
	init(){
		
		this.oSymbol = new cPointSymbol();	
		this.oSymbol.init(this.symbol,this.oSCR,this);	
		
		//viewbox상에서의 x,y 위치 
		let vb_xy = this.oSCR.ctcs2vbcs(this.ct_x,this.ct_y)	
		
		this.vb_x = vb_xy.x;
		this.vb_y = vb_xy.y;
		
		//hit area에 반응영역 달기
		let hit_layer = this.oSCR.get_layer('Hitarea');
		
		this.hit_area = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.hit_area.setAttribute('id',this.oSCR.oConfig.div_HtmlElmt_ID + '_ha_' + this.symbol);		
		this.hit_area.setAttribute('class','c_pha_normal');
		hit_layer.appendChild(this.hit_area);			
		
		if( this.interactive_mode ){	
			//xls - 'Point' sheet
			
			//십자선 - 가로
			let cross_len = this.oSCR.oConfig.seStyle['point_hitarea_radius'];	
			let garo = document.createElementNS(this.oSCR.const['SVG_NS'],'line')
			garo.setAttribute('x1',-cross_len);
			garo.setAttribute('y1',0);						
			garo.setAttribute('x2',cross_len);						
			garo.setAttribute('y2',0);	
			this.hit_area.appendChild(garo);		
			
			//십자선 - 세로
			let sero = document.createElementNS(this.oSCR.const['SVG_NS'],'line')
			sero.setAttribute('x1',0);
			sero.setAttribute('y1',-cross_len);						
			sero.setAttribute('x2',0);						
			sero.setAttribute('y2',cross_len);	
			this.hit_area.appendChild(sero);							
			
			//반응영역/
			this.hit_circle = document.createElementNS(this.oSCR.const['SVG_NS'],'circle')	
			this.hit_circle.setAttribute('id', this.oSCR.oConfig.div_HtmlElmt_ID + '_hc_' + this.symbol);	//_hc_: hit circle
			this.hit_circle.setAttribute('cx',0);
			this.hit_circle.setAttribute('cy',0);	
			
			//{{2022.08.08. c_pha 내부에 넣음
			this.hit_circle.setAttribute('r', this.oSCR.oConfig.seStyle['point_hitarea_radius'] );				
			//}}
			
			this.hit_area.appendChild(this.hit_circle);
		}
		
		this.hit_area.setAttribute('transform','translate(' + String(vb_xy.x) +  ',' + String(vb_xy.y) + ')' )

		this.oSymbol.update_position(vb_xy.x,vb_xy.y);
		this.oSymbol.update_rotate(90,UPRIGHT);
		
		//points layer에 point 달기
		let points_layer = this.oSCR.get_layer('Point');		
		
		this.sePoint = document.createElementNS(this.oSCR.const['SVG_NS'],'circle')
		this.sePoint.setAttribute('id',this.oSCR.oConfig.div_HtmlElmt_ID + '_point_' + this.symbol);		
		this.sePoint.setAttribute('cx',vb_xy.x);
		this.sePoint.setAttribute('cy',vb_xy.y);	
		this.sePoint.setAttribute('r', this.oSCR.oConfig.seStyle['point_radius'] );	
		points_layer.appendChild(this.sePoint);					
		
		//event listener
		if( this.interactive_mode ){	
			this.hit_circle.addEventListener('mousedown',(e)=>this.el_mousedown(e) );
			
			this.hit_circle.addEventListener('mouseover',(e)=>this.el_mouseover(e) );
			this.hit_circle.addEventListener('mouseout',(e)=>this.el_mouseout(e) );
			
			this.hit_circle.addEventListener('touchstart',(e)=>this.el_touchstart(e) );					
		}

	}
	
	hide(){
		this.sePoint.setAttribute('visibility','hidden');
		this.oSymbol.hide();
	}
	
	show(){
		this.sePoint.setAttribute('visibility','visible');	
		this.oSymbol.show();
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	update_position_vbcs( p_vb_x , p_vb_y ){
		
		//(VALD)
		if(this.drag_ing){
			this.hit_area.setAttribute('class','c_pha_draging');	
		}
		
		//
		let update_flag = false;
		if( p_vb_x != this.vb_x || p_vb_y != this.vb_y){
			update_flag = true;
		}
		
		//x,y
		let ct_xy = this.oSCR.vbcs2ctcs( p_vb_x, p_vb_y );//[여기할차례 - ct없이 mouse_position update 가능	
		
		this.vb_x = p_vb_x;
		this.vb_y = p_vb_y;
		
		this.ct_x = ct_xy.x;
		this.ct_y = ct_xy.y;
		
		//scr object
		this.hit_area.setAttribute('transform','translate(' + String(p_vb_x) +  ',' + String(p_vb_y) + ')' )
		
		this.sePoint.setAttribute('cx',String( p_vb_x ));
		this.sePoint.setAttribute('cy',String( p_vb_y ));
		
		this.oSymbol.update_position( p_vb_x , p_vb_y );
		
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//선분의 중점의 경우, 위치를 업데이트할 때, 이 fm이 사용됨
	update_position_ctcs(p_ct_x,p_ct_y){
		
		if(this.drag_ing){
			this.hit_area.setAttribute('class','c_pha_draging');
		}		
		
		let vbxy = this.oSCR.ctcs2vbcs(p_ct_x,p_ct_y);		

		this.vb_x = vbxy.x;
		this.vb_y = vbxy.y;
		
		this.ct_x = p_ct_x;
		this.ct_y = p_ct_y;

		this.hit_area.setAttribute('transform','translate(' + String(this.vb_x) +  ',' + String(this.vb_y) + ')' )

		this.sePoint.setAttribute('cx',String(this.vb_x));
		this.sePoint.setAttribute('cy',String(this.vb_y));

		this.oSymbol.update_position(this.vb_x,this.vb_y);
		
		//debugger;
		//call call-back routine
		if( this.call_back != null ){
			this.call_back(this);
		}		
	
	}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//symbol을 회전시킨다.
	rotate_symbol(p_angle){
		this.oSymbol.update_rotate( p_angle );
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	
	//xls : Point hitarea
	//마우스가 반응영역위에 올라오면, 색깔로 알려준다.
	// mouse over <-> out
	el_mouseover(p_event){
		this.oSCR.debug_log('point [mouse] over - 점: ' + this.symbol );		
		
		//fill-opacity:	0.3;
		//console.log('mouse over');
		//this.imsi.setAttribute('fill-opacity','0.1');
		//this.imsi.setAttribute('stroke-opacity','0.1');
		
		//마우스가 드래그 중에서 벗어나는 경우가 있음
		if( this.drag_ing ){
			this.hit_area.setAttribute('class','c_pha_draging');
		}
		else{
			//점A를 드래그하는 중에,
			//마우스 포인터가 점B 위로 올라가면,
			//점B의 mouseover가 동작함 
			//-> 그래서 다른점 드래그 중에는 반응하지 못하도록 함
			
			if( this.oSCR.is_it_possible_to_drag() ){		
				this.hit_area.setAttribute('class','c_pha_mouseover');
			}
				
		}
		
	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	//xls : Point hitarea , Point hitarea CSS
	// mouse over <-> out
	el_mouseout(p_event){
		this.oSCR.debug_log('point [mouse] out  - 점: ' + this.symbol );		
		
		//this.imsi.setAttribute('fill-opacity','0');
		//this.imsi.setAttribute('stroke-opacity','0');
		
		this.hit_area.setAttribute('class','c_pha_normal');	
	}		

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	//	점 이동모드 ing = drag ing
	mouse_drag_ing(){
		this.hit_area.setAttribute('class','c_pha_draging');
	}

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	el_mousedown(p_event){
		if(p_event.buttons == 1){
			//{{이 로직은 el_mousedown과 동일하게 맞춰줘야함
			p_event.preventDefault();
			
			if( this.oSCR.register_drag_object(this) ){
				this.mouse_drag_ing();	//점 주위에 오라 만들기 -> drag상태 
				this.drag_ing = true;
				
				this.oSCR.debug_log('point [mouse] down - Drag  - 점 이동모드 시작');		
			}
			//}}

		}
	}		

	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////
	//	caller:
	//		scs's mouse up    (p_outside = false,default)
	//		scs's mouse leave (p_outside = true)
	cb_mouseup(p_outside = false){// p_outside : 마우스로 드래그 중에, 마우스 포인터가 svg외부로 나가는 경우
		this.drag_ing = false;
		
		if( p_outside ){
			//mouse pointer의 위치가 svg 외부로 빠지면,
			//mouseover로 처리하는 건 부적합 하다.(desktop에서)

			this.hit_area.setAttribute('class','c_pha_normal');	
		}
		else{
			
			if( this.oSCR.oConfig.platform.desktop ){	
				this.hit_area.setAttribute('class','c_pha_mouseover');	
			}
			else if( this.oSCR.oConfig.platform.mobile ){	
				//mobile은 mouse pointer가 없음
				
				this.hit_area.setAttribute('class','c_pha_normal');	
			}
		}

	}
	
	////////////////////////////////////////////////////////////////////
	//                                                                //
	//	점검 완료                                                     //
	//                                                                //
	////////////////////////////////////////////////////////////////////	
	//el_mousedown과 동일로직
	el_touchstart(p_event){
		p_event.preventDefault();
		
		//{{이 로직은 el_mousedown과 동일하게 맞춰줘야함
		if( this.oSCR.register_drag_object(this) ){	
			this.mouse_drag_ing();	//점 주위에 오라 만들기
			this.drag_ing = true;
			
			this.oSCR.debug_log('point [touch] start - 점 이동모드 시작');		
		}		
		//}}
	}	
	
}	

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////

const DELTA_DISTANCE = 15;		//점 반지름
const UPRIGHT = 1;

class cPointSymbol{
	symbol = '';
	point  = null;
	oSCR   = null;

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
	
	//xls : 'point symbol 정리'
	init(p_symbol,p_oSCR,p_point){
		this.symbol = p_symbol;
		this.point = p_point;
		this.oSCR = p_oSCR;
		
		//{{
		//let layer_symbols = this.oSCR.get_layer('point_symbol');	
		//}}{{
		let layer_symbols = this.oSCR.get_layer('Point_Symbol');	
		//}}
		
		
//		<!-- text symbol 회전시키기 -->
//		<g transform='translate(200,200)' >
//			<g transform='translate(100,0)' >
//				<g transform='rotate(-90,-100,0)'>
//					<text text-anchor="middle" dominant-baseline="middle" transform='rotate(0)'>D</text>
//				</g>
//			</g>
//		</g>		
		
		this.layer_translate = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		
		this.layer_translate.setAttribute('id', this.oSCR.oConfig.div_HtmlElmt_ID + '_sb_' + p_symbol);
		layer_symbols.appendChild( this.layer_translate);
		
		this.layer_rotate_origin = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_rotate_origin.setAttribute('transform','translate(' + String( this.oSCR.oConfig.seStyle['point_symbol_delta'] ) + ',0)');
		this.layer_translate.appendChild(this.layer_rotate_origin);
		
		this.layer_rotate = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_rotate_origin.appendChild( this.layer_rotate );
		
		this.layer_text = document.createElementNS(this.oSCR.const['SVG_NS'],'text');	
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_text.style.fontSize = String( this.oSCR.oConfig.seStyle['point_symbol_font_size'] ) + 'px';
		this.layer_rotate.appendChild( this.layer_text );
		
		this.text_node = document.createTextNode( p_symbol );
		this.layer_text.appendChild(this.text_node);
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
		//{{2022.08.04
		//if( p_ang === null || p_ang === NaN ){
		//		debugger;
		//}
		
		//NaN check
		if( Number.isNaN(p_ang) ){
			debugger;
		}
		//}}
		
		let ang = -p_ang;
		let txt_ang= 0;
		
		if( p_txt_ang == UPRIGHT){
			txt_ang = -ang;
		}
		
		//<g transform='rotate(-90,-100,0)'>
		//<text text-anchor="middle" dominant-baseline="middle" transform='rotate(0)'>D</text>
		
		let layer_rotate_val = 'rotate(' + String(ang) + ',' + String( -this.oSCR.oConfig.seStyle['point_symbol_delta'] ) + ',0)';	
		
		try{
			if( layer_rotate_val == 'rotate(NaN,-15,0)'){
				debugger;
			}
			
			this.layer_rotate.setAttribute('transform',layer_rotate_val);	
		}
		catch(error){
			debugger;
		}
		
		let layer_text_val = 'rotate(' + String(txt_ang) + ')';
		this.layer_text.setAttribute('transform',layer_text_val);
	}
	
}	