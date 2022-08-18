//note. #837 , #833 , #822

const ANGLE_R = 0.3;		//점 반지름 , this.oSCR.oConfig.seStyle['angle_radius']
const ANGLE_TXT_R = 0.4;	// this.oSCR.oConfig.seStyle['angle_symbol_radius']

class cAngle{
	//constant
	DIR_CW  = 1;	//상수로 사용
	DIR_CCW = 0;	//상수로 사용	
	
	//
	DIR     = -1;	//angle arc의 회전방향(-1:undefined)
	
	oSCR = null;	//screen coordinate system(스크린 좌표계)
	oSymbol = null;	//점검완료
	
	seAngle = null;	//점검완료-
	
	name = '';
	
	//
	right_angle_flag = false;	//90도이면 true
	right_ang_len = 0;
	
	bg_obj  = null;
	
	//{{2022.08.04.점검완료
	//선분(segment) - sgmt
	sgmtCP = null;	//note #837
	sgmtCQ = null;
	
	point_C = null;
	point_P = null;
	point_Q = null;
	
	CP_rad  = 0;
	CQ_rad  = 0;
	PCQ_rad = 0;
	
	PCQ_rad_half = 0;
	PCQ_rad_avg = 0;
	PCQ_rad_avg_opposite = 0;
	
	PP_ctc = null;
	PP_vbc = null;
	
	QQ_ctc = null;
	QQ_vbc = null;
	
	right_angle_point_ctc = null;
	right_angle_point_vbc = null;	
	//}}2022.08.04
	
	//{{2022.08.13
	angle_type = -1;	//not defined,예각,직각,둔각
	
	angle_radius_ctcs      = 0;
	angle_text_radius_ctcs = 0;
	//}}
	
	//점검완료 
	constructor(p_line1,p_line2,p_oSCR){
		this.oSCR = p_oSCR;
		
		this.sgmtCP = p_line1;
		this.sgmtCQ = p_line2;
		
		this.point_C = p_line2.get_Point1();	//선분의 1st 점
		this.point_Q = p_line2.get_Point2();	//선분의 2nd 점
		this.point_P = p_line1.get_Point1();
		
		//이름
		this.name = this.point_P.symbol + this.point_C.symbol + this.point_Q.symbol;
		
		//angle shape - arc with 내부색깔 - xls:angle layer
		
		//{{2022.08.13. 스타일 세팅(vbcs -> ctcs) 
		//const ANGLE_R = 0.3		-> this.oSCR.oConfig.seStyle['angle_radius']
		//const ANGLE_TXT_R = 0.4;	-> this.oSCR.oConfig.seStyle['angle_symbol_radius']
		this.angle_radius_ctcs      = this.oSCR.dist_vbcs2ctcs( this.oSCR.oConfig.seStyle['angle_radius']        );
		this.angle_text_radius_ctcs = this.oSCR.dist_vbcs2ctcs( this.oSCR.oConfig.seStyle['angle_symbol_radius'] );		
		//debugger;
		//}}

		//직각 표시할 때, 원에 접하는 사이즈로 만들기 위함(note.#837)
		this.right_ang_len = this.angle_radius_ctcs / Math.sqrt(2);
		
		let ang_layer = this.oSCR.get_layer('Angle');	//<g id="sw_angle" class="c_angle">
	
		this.seAngle = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
		this.seAngle.setAttribute('id', ang_layer.id + '_' + this.name );		
		this.seAngle.setAttribute('class','c_angle');
		ang_layer.appendChild(this.seAngle);
		
		//
		this.oSymbol = new cAngleSymbol();
		this.oSymbol.init( this.oSCR , this );
	}
	
	get_name(){
		return this.name;
	}
	
	hide(){
		this.seAngle.setAttribute('visibility','hidden');
		this.oSymbol.hide();
	}
	
	show(){
		this.seAngle.setAttribute('visibility','visible');
		this.oSymbol.show();
	}	
	
	//{{2022.08.05
	//caller : c_triangle.update()
	//점검완료 #838 , 835
	get_LenthSymbol_dir(){
		
		//{{
		//DIR_CCW = 0;	//상수로 사용			
		//DIR_CW  = 1;	//상수로 사용
		//}}
		
		//LenthSymbol과 angle의 회전방향 상수값을 맞춰 놨음
		const LenthSymbol_DIR_CCW = 0;		
		const LenthSymbol_DIR_CW  = 1;
		
		//DIR : angle의 회전방향
		if( this.DIR == this.DIR_CCW ){
			return LenthSymbol_DIR_CW;
		}
		else if( this.DIR == this.DIR_CW ){
			return LenthSymbol_DIR_CCW;
		}
		else{
			debugger;
		}
		
	}
	//}}2022.08.05

	
	//점검완료 #837 , xls: 'angle.update()'
	update(){
		//각도(degree)
		this.CP_deg  = this.oSCR.normal_degree( this.sgmtCP.get_reverse_degree() );	//각도: -180 ~ +180 도
		this.CQ_deg  = this.oSCR.normal_degree( this.sgmtCQ.get_degree()         );	
		this.PCQ_deg = this.oSCR.normal_degree( this.CP_deg - this.CQ_deg        );
		
		//각도(radian)
		this.CP_rad  = this.oSCR.calc_deg2rad( this.CP_deg  );	//앞에 calc 빼고 싶음
		this.CQ_rad  = this.oSCR.calc_deg2rad( this.CQ_deg  );
		this.PCQ_rad = this.oSCR.calc_deg2rad( this.PCQ_deg );
		
		this.PCQ_rad_half = this.PCQ_rad/2;

		this.PCQ_rad_avg          = this.CQ_rad + this.PCQ_rad_half;	
		this.PCQ_rad_avg_opposite = this.PCQ_rad_avg + Math.PI;			//점의 위치를 잡는데 사용함
		
		
		//Angle Symbol 위치잡기
		//{{2022.08.04
		//point M : angle symbol의 좌표
		//let point_M_ctc = this.oSCR.calc_CircleXY2( this.point_C.ct_x , this.point_C.ct_y ,  ANGLE_TXT_R , this.PCQ_rad_avg);
		let point_M_ctc = this.oSCR.calc_CircleXY2( this.point_C.ct_x , this.point_C.ct_y ,  this.angle_text_radius_ctcs , this.PCQ_rad_avg);
		let point_M_vbc = this.oSCR.ctcs2vbcs(point_M_ctc.x , point_M_ctc.y);	
		
		this.oSymbol.update_angle_symbol_position_vbcs( point_M_vbc.x , point_M_vbc.y );
		
		//}}
		
		////////////////////////////////////////////////////////////////
		//	직각체크 , update angle symbol 
		
		let dp_ang = scUtil.number_for_display( this.oSCR.calc_rad2deg( Math.abs(this.PCQ_rad) ) );	//63.435
		
		let str_dp_ang = String( dp_ang ) + '°';	//'63.435°'
		
		//this.right_angle_flag = false;
		//if( isInt(dp_ang) ){
		if( scUtil.isInt(dp_ang) ){
			if( dp_ang == 90 ){
				this.right_angle_flag = true;
				//str_dp_ang = '직각';
				str_dp_ang = '';
			}
			else{
				this.right_angle_flag = false;
			}
		}
		else{
			this.right_angle_flag = false;
		}
		
		this.oSymbol.update_angle_symbol_text( str_dp_ang );
		
		////////////////////////////////////////////////////////////////
		//	점 PP , QQ , right angle point의 좌표 결정 
		
		let radius_cts = 0;
		
		if( this.right_angle_flag ){
			//debugger;
			radius_cts = this.right_ang_len;
		}
		else{
			//radius_cts = this.angle_radius_ctcs;
			radius_cts = ANGLE_R;
		}
		
		this.PP_ctc = this.oSCR.calc_CircleXY2( this.point_C.ct_x , this.point_C.ct_y , radius_cts , this.CP_rad );
		this.PP_vbc = this.oSCR.ctcs2vbcs( this.PP_ctc.x , this.PP_ctc.y );
		
		this.QQ_ctc = this.oSCR.calc_CircleXY2( this.point_C.ct_x , this.point_C.ct_y , radius_cts , this.CQ_rad );
		this.QQ_vbc = this.oSCR.ctcs2vbcs( this.QQ_ctc.x , this.QQ_ctc.y );

		//right angle point
		this.right_angle_point_ctc = this.oSCR.calc_CircleXY2( this.point_C.ct_x , this.point_C.ct_y , this.angle_radius_ctcs , this.PCQ_rad_avg );
		this.right_angle_point_vbc = this.oSCR.ctcs2vbcs( this.right_angle_point_ctc.x , this.right_angle_point_ctc.y );
		
		////////////////////////////////////////////////////////////////
		//	arc radius 
		
		let angle_radius_vbc = this.oSCR.dist_ctcs2vbcs(this.angle_radius_ctcs);	//0.3 -> 30
		
		////////////////////////////////////////////////////////////////
		//	sweep value of elliptical arc curve 
		
		if( this.PCQ_deg >= 0 ){
			this.DIR = this.DIR_CCW;	//0
		}
		else{
			this.DIR = this.DIR_CW;		//1
		}		
				
		let sweep_val = this.DIR;
		
		////////////////////////////////////////////////////////////////
		//	직각,예각,둔각인지에 따라 arc 스타일(색깔) 결정
		
		if( this.right_angle_flag ){	//직각
			this.seAngle.setAttribute('class','bg_red');
			//{{2022.08.13
			this.angle_type = this.oSCR.const['ANGLE_RIGHT'];
			//}}2022.08.13
		}
		else{
			if( dp_ang<90 ){	//예각
				this.seAngle.setAttribute('class','bg_fill_sky');
				//{{2022.08.13
				this.angle_type = this.oSCR.const['ANGLE_ACUTE'];
				//}}2022.08.13				
			}
			else{				//둔각
				this.seAngle.setAttribute('class','bg_fill_magenta');
				//{{2022.08.13
				this.angle_type = this.oSCR.const['ANGLE_OBTUSE'];
				//}}2022.08.13				
			}
		}
		////////////////////////////////////////////////////////////////
		//	각도를 display하는 shape 만들기
		let arc_str = '';
		
		if( this.right_angle_flag ){
			arc_str = 
				'M ' + String( this.QQ_vbc.x )                + ' ' + String( this.QQ_vbc.y )                + ' ' +
				'L ' + String( this.right_angle_point_vbc.x ) + ' ' + String( this.right_angle_point_vbc.y ) + ' ' + 
				'L ' + String( this.PP_vbc.x )                + ' ' + String( this.PP_vbc.y );
		}
		else{
			arc_str = 
				'M ' + String( this.QQ_vbc.x )    + ' ' + String( this.QQ_vbc.y )   + ' ' +		//시작점 : QQ
				'A ' + String( angle_radius_vbc ) + ' ' + String( angle_radius_vbc) + ',' +		//반지름(X축) , 반지름(Y축) -> 원래 타원그리는 거라 반지름이 2개 필요함
				'0,' +					//회전각도
				'0,' +					//large arc flag
				sweep_val + ',' +		//sweep flag
				String( this.PP_vbc.x ) + ' ' + String( this.PP_vbc.y ) + 	//끝점: PP
				' L ' + String( this.point_C.vb_x ) + ' ' + String( this.point_C.vb_y ) + 			
				' L ' + String( this.QQ_vbc.x )     + ' ' + String( this.QQ_vbc.y ) ;			
		}
		
		////////////////////////////////////////////////////////////////
		this.seAngle.setAttribute('d',arc_str);
		
	}

	//{{2022.08.13
	cb_screenshot( p_ctx , p_imgcs_scale){

		let QQ_imgc = this.oSCR.vbcs2imgcs( this.QQ_vbc.x , this.QQ_vbc.y , p_imgcs_scale );
		let PP_imgc = this.oSCR.vbcs2imgcs( this.PP_vbc.x , this.PP_vbc.y , p_imgcs_scale );
				
		//if( this.right_angle_flag ){
		if( this.angle_type == this.oSCR.const['ANGLE_RIGHT'] ){
			//직각일 때
			
			let right_angle_point_imgc = this.oSCR.vbcs2imgcs( this.right_angle_point_vbc.x , this.right_angle_point_vbc.y , p_imgcs_scale );
			
			//Style 
			p_ctx.strokeStyle = this.oSCR.get_style('.bg_len_feature','stroke');		//선 색깔
			p_ctx.lineWidth   = this.oSCR.get_style('.bg_len_feature','stroke-width');	//선 두께	
			p_ctx.setLineDash([]);	//실선
			p_ctx.lineCap     = 'butt';				//선 end-point 모양(butt:직각)
			p_ctx.lineJoin    = 'miter';				//선이 꺾일때의 모양

			//Draw
			p_ctx.beginPath();					//		
			
			p_ctx.moveTo(QQ_imgc.x, QQ_imgc.y);					//시작점
			p_ctx.lineTo(right_angle_point_imgc.x, right_angle_point_imgc.y);				//끝점	
			p_ctx.lineTo(PP_imgc.x, PP_imgc.y);				//끝점	

			p_ctx.stroke();					
			
		}
		else{
			//직각이 아닐 때
			p_ctx.lineWidth   = this.oSCR.get_style('.bg_fill_sky','stroke-width');	//선 두께	
			
			//
			let css_class_selector = '';
			if( this.angle_type == this.oSCR.const['ANGLE_ACUTE'] ){
				css_class_selector = '.bg_fill_sky';
			}
			else if( this.angle_type == this.oSCR.const['ANGLE_OBTUSE'] ){
				css_class_selector = '.bg_fill_magenta';
			}
			else{
				debugger;	//프로그램 오류, 이건 안정해질 수가 없음
			}
			
			
			//debugger;
			
			//note.#866
			let stroke_rgb     = this.oSCR.get_style( css_class_selector,'stroke');			//선색
			let stroke_opacity = this.oSCR.get_style( css_class_selector,'stroke-opacity');	//선 투명도
			
			let stroke_rgba    = stroke_rgb.replace(  '(' , 'a(' );
			stroke_rgba        = stroke_rgba.replace( ')' , ',' + stroke_opacity + ')' );
			
			
			let fill_rgb       = this.oSCR.get_style( css_class_selector ,'fill');			//채색
			let fill_opacity   = this.oSCR.get_style( css_class_selector ,'fill-opacity');	//채색 투명도

			let fill_rgba    = fill_rgb.replace(  '(' , 'a(' );
			fill_rgba        = fill_rgba.replace( ')' , ',' + stroke_opacity + ')' );


			p_ctx.strokeStyle = stroke_rgba;	//선색
			//p_ctx.strokeStyle = 'red';
			p_ctx.fillStyle   = fill_rgba;		//채색


			
			//debugger;
			
			
			let O_imgc = this.oSCR.vbcs2imgcs( this.point_C.vb_x , this.point_C.vb_y , p_imgcs_scale );
			let r_vbc  = this.oSCR.dist_ctcs2vbcs( this.angle_radius_ctcs );
			let r_imgc = this.oSCR.dist_vbcs2imgcs( r_vbc , p_imgcs_scale);
			
			//
			let canvs_acr_dir = true;
			
			const canvas_arc_CCW = true;
			const canvas_arc_CW  = false;			
			//debugger;
			
			if( this.PCQ_deg >= 0 ){
				canvs_acr_dir = canvas_arc_CCW;	
			}
			else{
				canvs_acr_dir = canvas_arc_CW;		//1
			}				
			
			let start_angle = this.oSCR.calc_angle_between_2_points( this.point_C.ct_x , this.point_C.ct_y , this.point_Q.ct_x , this.point_Q.ct_y ) ;
			start_angle = this.oSCR.normal_degree2(-start_angle);	//각도가 음수로 나왔더니 arc가 안그려짐,각도를 마이너스 시켜줘야 맞음 
			let start_radian = this.oSCR.calc_deg2rad( start_angle );
			
			let end_angle = this.oSCR.calc_angle_between_2_points( this.point_C.ct_x , this.point_C.ct_y , this.point_P.ct_x , this.point_P.ct_y ) ;
			end_angle = this.oSCR.normal_degree2(-end_angle);
			let end_radian   = this.oSCR.calc_deg2rad( end_angle );			
			
			p_ctx.beginPath();					//		
			p_ctx.arc(O_imgc.x, O_imgc.y, r_imgc , start_radian, end_radian,canvs_acr_dir);
			p_ctx.lineTo(O_imgc.x , O_imgc.y  ); 
			p_ctx.lineTo(QQ_imgc.x, QQ_imgc.y ); 
			p_ctx.fill();	//채색			
			p_ctx.stroke();
			
		}
		
		//symbol text
		this.oSymbol.cb_screenshot( p_ctx , p_imgcs_scale );
		
		
	}
	//}}2022.08.13
	
}
////////////////////////////////////////////////////////
// xls: angle_symbol sheet
class cAngleSymbol{
	
	symbol = '';
	
	oSCR = null;
	oAngle = null;
	
	layer_translate 	= null;
	layer_text 			= null;
	text_node 			= null;
	
	//{{2022.08.13
	x_vbc = 0;
	y_vbc = 0;
	//}}
	
	constructor(){
	}
	
	//xls - angle symbol
	init(p_oSCR,p_oAngle){
		this.oSCR   = p_oSCR;
		this.oAngle = p_oAngle;

//	as_layer			<g id="sw_angle_symbol" class="c_angle_symbol">
//	layer_translate			<g id="sw_angle_symbol_CAB" transform="translate(216.28380030742477,-136.65544529865113)">
//	layer_text					<text class="c_symbol_text" style="font-size: 15px;">
//	text_node						55.404°
//				</text>
//		</g>

		let as_layer = this.oSCR.get_layer('Angle_Symbol'); //angle symbol layer;	

		this.layer_translate = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_translate.setAttribute('id', as_layer.id + '_' + this.oAngle.get_name() );
		as_layer.appendChild( this.layer_translate);
		
		this.layer_text = document.createElementNS(this.oSCR.const['SVG_NS'],'text');
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_text.style.fontSize = String( this.oSCR.oConfig.seStyle['angle_symbol_font_size']  ) + 'px';	
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
	
	update_angle_symbol_position_vbcs(p_vb_x,p_vb_y){
		//{{2022.08.13 - 현위치 백업
		this.x_vbc = p_vb_x;
		this.y_vbc = p_vb_y;
		//}}
		
		this.layer_translate.setAttribute('transform','translate(' + String(p_vb_x) + ',' + String(p_vb_y) + ')');
	}
	
	update_angle_symbol_text(p_text){
		this.layer_text.textContent = p_text;
	}
	
	//{{2022.08.13
	cb_screenshot( p_ctx , p_imgcs_scale){
		let imgc = this.oSCR.vbcs2imgcs( this.x_vbc , this.y_vbc , p_imgcs_scale );		//image   coordinate - image상에서의 좌표 

		let font_family = this.oSCR.get_style('.c_symbol_text','font-family');	//선 두께	
		let font_size   = this.oSCR.oConfig.seStyle['angle_symbol_font_size'];
		
		//p_ctx.font = "60px serif";
		p_ctx.font = String( this.oSCR.dist_vbcs2imgcs(font_size,p_imgcs_scale) ) + 'px ' + font_family;
		p_ctx.textAlign = "center";
		p_ctx.textBaseline="middle"; 
		//p_ctx.fillStyle = "#FFF";
		//p_ctx.fillStyle = 'black';
		p_ctx.fillStyle = this.oSCR.get_style('.c_symbol_text','fill');	
		p_ctx.fillText(this.layer_text.textContent,imgc.x,imgc.y);		
		
	}
	//}}2022.08.13
	
}
