
//class c_line{
class cLine{
	
	oSCR = null;	//screen coordinate system(스크린 좌표계) - 점검완료
	
	seLine = null;	//점검완료 
	
	oSymbol = null;
	Q1 = null;	//ctcs 좌표 
	Q2 = null;	//ctcs 좌표
	
	Q1_arc = null;
	Q2_arc = null;
	
	//control
	theta 	= 0;	//점검완료
	degree 	= 0;	//점검완료
	slope	= 0;
	infinite_slope = false;
	y_intercept = 0;	//y절편, x가 0일 때 -> y=ax+b에서 b
	x_intercept = 0;	//x절편, y가 0일 때
	
	domain_lower = 0;	//정의역
	domain_upper = 0;
	
	range_lower = 0;	//치역
	range_upper = 0;
	
	//선분AB를, 선분BA로 계산했을 때
	theta_reverse 	= 0; 	//점검완료
	degree_reverse 	= 0;	//점검완료
	
	//점A는 점B는 반시계 방향임(point A,B)
	pA = null;	
	pB = null;
	
	pM = null;	//선분AB의 중점 - 점검완료
	
	//중점
	ct_Mx = 0;	//중점의 x좌표 ctcs - 점검완료
	ct_My = 0;	//중점의 y좌표 ctcs - 점검완료

	line_name = '';	//선분'AB'에서 'AB' //점검완료
	
	seFeature = null;
	feature_len = 0.1;	//점검완료
	ft_x1 = 0;	//이등변 삼각형에서 선분위에 길이가 같다고 표시하는 빨간선의 좌표 - 점검완료
	ft_x2 = 0;
	ft_y1 = 0;
	ft_y2 = 0;
	distance = 0;
	
	//점검완료
	constructor(p_SCR,p_A,p_B){
		this.oSCR = p_SCR;
		this.pA = p_A;
		this.pB = p_B;
		
		this.Q1 = {x:0,y:0};
		this.Q2 = {x:0,y:0};
				
		//점 글자로 이름을 만듬
		this.line_name = p_A.symbol + p_B.symbol;
	}
	
	//점검완료 - xls:'line정리'
	init(){
		let path_layer = this.oSCR.get_layer('Line');
		
		this.seLine = document.createElementNS(this.oSCR.const['SVG_NS'],'line');	
		this.seLine.setAttribute('id' , path_layer.id + '_' + this.line_name  );
		this.seLine.setAttribute('stroke-width'    , this.oSCR.oConfig.seStyle['line_stroke_width'] ); //conf되는 부분이라 여기에 있는듯
		path_layer.appendChild( this.seLine );
		
		//2등변삼각형,정삼각형 표시
		let feature_layer = this.oSCR.get_layer('Line_Equal_Length_Symbol');	
		
		this.seFeature = document.createElementNS(this.oSCR.const['SVG_NS'],'line');
		feature_layer.appendChild( this.seFeature );
		//this.hide_feature();
		this.hide_equal_length_symbol();
		
		//선길이 표시 
		let length_arc_layer = this.oSCR.get_layer('Line_Length_Arc');		
		
		//<path id='arc2' class='bg_red'></path>	
		this.Q1_arc = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
		this.Q1_arc.setAttribute('id' , length_arc_layer.id + '_' + this.line_name + '_1' );
		this.Q1_arc.setAttribute('stroke-dasharray', String(this.oSCR.oConfig.seStyle['line_arc_stroke_dash1']) + '_' + String(this.oSCR.oConfig.seStyle['line_arc_stroke_dash2']) );
		this.Q1_arc.setAttribute('stroke-width'    , String(this.oSCR.oConfig.seStyle['line_arc_stroke_width']) );
		length_arc_layer.appendChild( this.Q1_arc );				

		//<path id='arc1' class='bg_red'></path>
		this.Q2_arc = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
		this.Q2_arc.setAttribute('id' , length_arc_layer.id + '_' + this.line_name + '_2' );
		this.Q2_arc.setAttribute('stroke-dasharray', String(this.oSCR.oConfig.seStyle['line_arc_stroke_dash1']) + '_' + String(this.oSCR.oConfig.seStyle['line_arc_stroke_dash2']) );
		this.Q2_arc.setAttribute('stroke-width'    , String(this.oSCR.oConfig.seStyle['line_arc_stroke_width'])    );
		length_arc_layer.appendChild( this.Q2_arc );				
		
		//선분의 중점
		this.pM = new cPoint(this.oSCR, 0,0,this.line_name + '_M',false,null);		
		
		this.pM.init();		
		
		this.oSymbol = new cLineSymbol();
		
		this.oSymbol.init( this.oSCR , this );	
		
	}
	
	//{{2022.08.05
	get_line_name(){
		return this.line_name;
	}
	//}}
	
	//점검완료
	hide(){
		this.seLine.setAttribute('visibility','hidden');
		this.pM.hide();
	}
	
	//점검완료
	show(){
		this.seLine.setAttribute('visibility','visible');
		this.pM.show();
	}	
	
	//중점 보이기 - 점검완료
	show_M(){
		this.pM.show();
	}
	
	//중점 숨기기 - 점검완료 
	hide_M(){
		this.pM.hide();
	}
	
	//점검완료
	show_equal_length_symbol(){
		this.seFeature.setAttribute('visibility','visible');
	}
	
	//점검완료
	hide_equal_length_symbol(){
		this.seFeature.setAttribute('visibility','hidden');
	}	
	
	//점검완료
	update(){
		this.update_internal();
		
		this.seLine.setAttribute('x1',String( this.pA.vb_x));
		this.seLine.setAttribute('y1',String( this.pA.vb_y));
		this.seLine.setAttribute('x2',String( this.pB.vb_x));
		this.seLine.setAttribute('y2',String( this.pB.vb_y));
		
		//중점
		this.pM.update_position_ctcs(this.ct_Mx,this.ct_My);
		
		//이등변삼각형 관련
		let vb_ft1= this.oSCR.ctcs2vbcs( this.ft_x1 , this.ft_y1 );	
		let vb_ft2= this.oSCR.ctcs2vbcs( this.ft_x2 , this.ft_y2 );	
		
		this.seFeature.setAttribute('x1',String( vb_ft1.x ));
		this.seFeature.setAttribute('y1',String( vb_ft1.y ));
		this.seFeature.setAttribute('x2',String( vb_ft2.x ));
		this.seFeature.setAttribute('y2',String( vb_ft2.y ));
		
	}
	
	//점검완료 - note #831,#828,#827
	update_internal(){
		//AB, A를 원점으로 B와 X축 사이의 각도를 계산
		this.theta  = this.oSCR.calc_radian(this.pA,this.pB);
		this.degree = this.oSCR.calc_rad2deg( this.theta);
		
		//BA, B를 원점으로 A와 X축 사이의 각도를 계산
		this.degree_reverse = this.degree + 180;
		this.theta_reverse 	= this.oSCR.calc_deg2rad( this.degree_reverse );
		
		//정규화 : 각도를 -180 ~ +180의 값으로 
		this.degree			= this.oSCR.normal_degree( this.degree )	
		this.degree_reverse	= this.oSCR.normal_degree( this.degree_reverse )
		
		this.theta 			= this.oSCR.calc_deg2rad( this.degree )
		this.theta_reverse  = this.oSCR.calc_deg2rad( this.degree_reverse )
		
		
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
		let ft_point1 = this.oSCR.calc_CircleXY2(this.ct_Mx,this.ct_My,this.feature_len, this.theta - Math.PI/2 );	
		this.ft_x1 = ft_point1.x;
		this.ft_y1 = ft_point1.y;
		
		let ft_point2 = this.oSCR.calc_CircleXY2(this.ct_Mx,this.ct_My,this.feature_len, this.theta + Math.PI/2 );	
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
			
			this.x_intercept = dP.ct_x;	//x축과의 교점(절편)
			
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
			this.y_intercept = rP.ct_y - ( this.slope*rP.ct_x);	//b - y절편(x==0)
			this.x_intercept = -this.y_intercept/this.slope;	//x절편(y==0)
			
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
	
	
	//c_triangle.update()에서 p_dir을 결정해서 호출함
	update_symbol(p_dir){
		
		////////////////////////////////////////////////////////////////
		//	rad 결정 - note #850 , #839, #838
		const LenthSymbol_DIR_CW  = 1;
		const LenthSymbol_DIR_CCW = 0;		
		
		let rad = 0;
		
		if( p_dir == LenthSymbol_DIR_CW ){					
			rad = this.theta - Math.PI/2;	//theta:18.43494882292201 degree , rad:
		}
		else if( p_dir == LenthSymbol_DIR_CCW ){
			rad = this.theta + Math.PI/2;
		}
		else{
			debugger;
		}
		
		////////////////////////////////////////////////////////////////
		//	두 점사이의 거리를 계산
		let dist = scUtil.number_for_display( this.oSCR.dist_on_ctcs(this.pA.ct_x,this.pA.ct_y ,this.pB.ct_x,this.pB.ct_y) );	//1.414 , 1.4142135623730951	
		this.distance = dist;

		this.oSymbol.update_text( String(dist) );

		let radius_ctcs = this.distance_between_symbol_and_line();	//#850
		
		//{{2022.08.05.P 좌표 계산
		let P = this.oSCR.calc_CircleXY2(this.ct_Mx,this.ct_My, radius_ctcs , rad );
		
		//{{2022.08.05.debug
		if( window.point_test ){
			if( this.line_name == 'AB'){
				window.point_test.update_position_ctcs( P.x , P.y );
			}
		}
		//}}
		
		this.oSymbol.update_position(P.x,P.y);
		////////////////////////////////////////////////////////////////
		
		//외심 계산.note #851
		let CC = new cCircumcenter(this.oSCR,this.pA.ct_x,this.pA.ct_y, P.x , P.y , this.pB.ct_x , this.pB.ct_y);
		
		//Q1,Q1 좌표 계산
		this.calc_Q1Q2(this.oSymbol, CC);
		
		//arc sweep direction 결정 - xls: 'Line arc 방향'
		const SWEEP_DIR_UNDEFINED = -1;
		const SWEEP_DIR_CW        =  1;	//상수로 사용
		const SWEEP_DIR_CCW       =  0;	//상수로 사용			
		
		let LengthArc_sweep_val = SWEEP_DIR_UNDEFINED;
		if( p_dir == LenthSymbol_DIR_CCW ){
			LengthArc_sweep_val = SWEEP_DIR_CW;
		}		
		else if( p_dir == LenthSymbol_DIR_CW ){
			LengthArc_sweep_val = SWEEP_DIR_CCW;
		}
		else{
			debugger;
		}
		
		let vb_q1= this.oSCR.ctcs2vbcs( this.Q1.x , this.Q1.y );
		let vb_q2= this.oSCR.ctcs2vbcs( this.Q2.x , this.Q2.y );

		//
		let CC_radius_vbcs = this.oSCR.dist_ctcs2vbcs( CC.r );	//외심의 반지름 
		
		//
		let arc_str = '';
		arc_str = 'M ' + String(this.pA.vb_x) + ' ' + String( this.pA.vb_y ) + ' ' +
			'A ' + String( CC_radius_vbcs ) + ' ' + String( CC_radius_vbcs ) + ',' +
			'0,' +
			'0,' +
			LengthArc_sweep_val + ',' +
			String(vb_q1.x) + ' ' + String(vb_q1.y);		
		
		this.Q1_arc.setAttribute('d',arc_str);
		
		//
		arc_str = 'M ' + String(vb_q2.x) + ' ' + String( vb_q2.y ) + ' ' +
			'A ' + String( CC_radius_vbcs ) + ' ' + String( CC_radius_vbcs ) + ',' +
			'0,' +
			'0,' +
			LengthArc_sweep_val + ',' +
			String(this.pB.vb_x) + ' ' + String(this.pB.vb_y);			
		this.Q2_arc.setAttribute('d',arc_str);			
	}	
	
	//{{2022.08.05 - 정리완료(note #849) , #843, #841 근방에 많음
	distance_between_symbol_and_line(){
		let diag   = Math.sqrt((Math.pow(this.oSymbol.textbox_ct_width/2,2) +  Math.pow(this.oSymbol.textbox_ct_height/2,2)),2);
		
		//////////////////////////////////////////////
		let t1 = this.theta;
		
		//1,2사분면의 값 만으로 변경
		//3사분면 -> 2사분면, 4사분면 -> 1사분면
		if( t1 < 0 ){
			t1 = Math.abs( t1 );
		}
		
		//1사분면의 값 만으로 변경
		//2사분면 -> 1사분면
		if( t1 > (Math.PI/2) ){	
			t1 = Math.PI - t1;
		}
		
		//////////////////////////////////////////////
		let t2 = this.calc_rad_2point(0,0,this.oSymbol.textbox_ct_width,this.oSymbol.textbox_ct_height);
		
		let t = t1 + t2;

		//{{debug
		let deg = this.oSCR.calc_rad2deg(t);
		//}}debug
		
		//////////////////////////////////////////////
		
		let ret = diag * Math.sin( t );
		
		//let margin = 0.1;
		//let margin = 0;
		let margin = this.oSymbol.textbox_ct_height;	//note #850
		
		//{{2022.08.05.debug
		//ret = ret + margin;
		//}}
		
		return ret;
	
	}
	//}}
	
	
	//두 점 사이의 각도를 계산, O를 중심으로 X축과 이루는 각도
	calc_rad_2point(p_Ox,p_Oy,p_Qx,p_Qy){
		let Px = p_Qx - p_Ox;
		let Py = p_Qy - p_Oy;
		
		let rad = Math.atan2(Py,Px);
		return rad;
	}		
	
	//note #851 , #844
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
			//debugger;
			//dist1 = dist( vp[0].x, vp[0].y, this.pA.ct_x, this.pA.ct_y);	//dist1 = 1.0759406306710813
			dist1 = this.oSCR.dist_on_ctcs( vp[0].x, vp[0].y, this.pA.ct_x, this.pA.ct_y);
		}
		catch(error){
			//debugger;
		}
		
		let dist2 = 0;
		
		try{
			//dist2 = dist( vp[1].x, vp[1].y, this.pA.ct_x, this.pA.ct_y);
			dist2 = this.oSCR.dist_on_ctcs( vp[1].x, vp[1].y, this.pA.ct_x, this.pA.ct_y);
		}
		catch(error){
			//debugger;
		}
		
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



////////////////////////////////////////////////////////
class cLineSymbol{
	
	symbol = '';
	oSCR = null;
	oLine = null; // 2022.08.05. 직선object. 점검완료
	
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

	//note.840
	init( p_oSCR, p_oLine ){	
		this.oSCR = p_oSCR;

		this.oLine = p_oLine;

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
		let ls_layer = this.oSCR.get_layer('Line_Symbol');	//length symbol layer	
		
		this.layer_translate = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_translate.setAttribute('id', ls_layer.id + '_' + this.oLine.get_line_name() );				
		ls_layer.appendChild( this.layer_translate);
		
		this.layer_txt_wrapper = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_translate.appendChild( this.layer_txt_wrapper );
		
		this.layer_box_wrapper = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.layer_translate.appendChild( this.layer_box_wrapper );
		
		this.layer_text = document.createElementNS(this.oSCR.const['SVG_NS'],'text');
		this.layer_text.setAttribute('class','c_symbol_text');
		this.layer_text.style.fontSize = String( this.oSCR.oConfig.seStyle['line_symbol_font_size']  ) + 'px';
		this.layer_txt_wrapper.appendChild( this.layer_text );
		
		this.text_node = document.createTextNode( '' );
		this.layer_text.appendChild(this.text_node);		
		
		this.layer_box =  document.createElementNS(this.oSCR.const['SVG_NS'],'rect');
		this.layer_box.setAttribute('class','line_symbol_rect');
		this.layer_box_wrapper.appendChild(this.layer_box);		
	}
	
	hide(){
		this.layer_translate.setAttribute('visibility','hidden');
	}
	
	show(){
		this.layer_translate.setAttribute('visibility','visible');
	}	
	
	//update_position 을 먼저 해줘야함( ct_x,ct_y가 먼저 설정되어야 함) - note #840
	update_text(p_text){
		this.layer_text.textContent = p_text;
		
		//
		let info = this.layer_txt_wrapper.getBBox();
		
		this.textbox_ct_width  = this.oSCR.dist_vbcs2ctcs( info.width  );	//45.203125, 0.45203125
		this.textbox_ct_height = this.oSCR.dist_vbcs2ctcs( info.height );	//15, 0.15
		
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
		this.layer_box.setAttribute('x',  this.oSCR.dist_ctcs2vbcs( -half_width  ) );	//-0.226015625, -22.6015625
		this.layer_box.setAttribute('y', this.oSCR.dist_ctcs2vbcs( -half_height ) );	//-0.075 , -7.5			

		let vbxy = this.oSCR.ctcs2vbcs(p_x,p_y);	
		this.layer_translate.setAttribute('transform','translate(' + String(vbxy.x) + ',' + String(vbxy.y) + ')');
	}	
	
}	



////////////////////////////////////////////////////////


//직선:line, 선분 segment

//forward/reverse
//class c_segment{
class cSegment{
	oSCR = null;	//screen coordinate system(스크린 좌표계)
	reverse_flag = false;	
	
	line_obj = null;
	
	pA = null;	
	pB = null;	
	
	constructor(p_oSCR,p_line,p_reverse_flag){
		this.oSCR = p_oSCR;
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
	
	//{{2022.08.04
	get_Point1(){
		if( !this.reverse_flag ){	//보통
			return this.pA;
		}
		else{					//reverse flag가 true일 때
			return this.pB;
		}		
	}
	
	get_Point2(){
		if( !this.reverse_flag){	//보통
			return this.pB;
		}
		else{					//reverse flag가 true일 때
			return this.pA;
		}		
	}	
	
	//}}
	
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
