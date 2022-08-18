
////////////////////////////////////////////////////////
class cCircumcenter{	//외심
	//control
	oSCR = null;
	
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
	
	constructor(p_oSCR,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
		//control
		this.oSCR = p_oSCR;
		
		//
		let r_A = this.calc_rad(p_Cx,p_Cy,p_Ax,p_Ay,p_Bx,p_By);
		let r_B = this.calc_rad(p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy);
		let r_C = this.calc_rad(p_Bx,p_By,p_Cx,p_Cy,p_Ax,p_Ay);
		

		//외심( https://www.vedantu.com/maths/circumcenter-of-triangle )
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
	constructor11(p_CAB,p_ABC,p_BCA,p_oSCR){
		//control
		this.oSCR = p_oSCR;
		
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


		let bg_layer = this.oSCR.get_layer_bg('bg');	

		//<circle id='ccc' cx='200' cy='200' r='100' class='bg_gray' />
		this.bg_circle = document.createElementNS(this.oSCR.const['SVG_NS'],'circle')
		this.bg_circle.setAttribute('id','111111');
		this.bg_circle.setAttribute('class','bg_gray');
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
		
		let vb_xy = this.oSCR.ctcs2vbcs(this.OccX,this.OccY);
		this.Occ.update_position_vbcs(vb_xy.x,vb_xy.y);

		//반지름
		let OA_ct = this.oSCR.dist_on_ctcs(this.Occ.ct_x,this.Occ.ct_y,this.pA.ct_x,this.pA.ct_y);	
		
		//console.log('외심의 반지름ct : ', OA_ct);
		this.radius = OA_ct;	//반지름
		

		let OA_vb = this.oSCR.dist_ctcs2vbcs(OA_ct,0);
		
		//외심원
		this.bg_circle.setAttribute('cx',vb_xy.x);
		this.bg_circle.setAttribute('cy',vb_xy.y);
		this.bg_circle.setAttribute('r',String(OA_vb));
		//}}
		
		
	}
	
}

////////////////////////////////////////////////////////
//class c_triangle{
class cTriangle{
	oSCR = null;

	pA = null;
	pB = null;
	pC = null;
	
	line_AB = null;
	line_BC = null;
	line_CA = null;
	
	AB = null;
	BC = null;
	CA = null;
	
	objs = {};

	constructor(p_oSCR,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
		this.oSCR = p_oSCR;

		this.objs['point_A'] = new cPoint(this.oSCR, p_Ax,p_Ay,'A',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
		this.objs['point_A'].init();

		this.objs['point_B'] = new cPoint(this.oSCR, p_Bx,p_By,'B',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
		this.objs['point_B'].init();

		this.objs['point_C'] = new cPoint(this.oSCR, p_Cx,p_Cy,'C',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
		this.objs['point_C'].init();								
		
		//{{debugger
		this.pT = new cPoint(this.oSCR, 0,0,'T',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
		this.pT.init();					
		//}}
		

		this.line_AB  = new cLine(this.oSCR , this.objs['point_A'],this.objs['point_B']);
		this.line_AB.init();
		//this.line_AB.update();
		this.line_AB.hide_M();
		
		this.line_BC  = new cLine(this.oSCR,this.objs['point_B'],this.objs['point_C']);
		this.line_BC.init();
		//this.line_BC.update();
		this.line_BC.hide_M();

		this.line_CA  = new cLine(this.oSCR,this.objs['point_C'],this.objs['point_A']);
		this.line_CA.init();
		//this.line_CA.update();
		this.line_CA.hide_M();		
		//}}2022.08.07
		

		//각도용 
		this.AB = new cSegment(this.oSCR,this.line_AB,false);
		this.BC = new cSegment(this.oSCR,this.line_BC,false);
		this.CA = new cSegment(this.oSCR,this.line_CA,false);

	
		//////////////////////////////////////////////////////////////////////
		////	각CAB
		this.CAB = new cAngle(this.CA,this.AB,this.oSCR);
		//this.CAB.update();	
		//CAB.hide();
		
		
		this.ABC = new cAngle(this.AB,this.BC,this.oSCR);
		//this.ABC.update();	
		
		this.BCA = new cAngle(this.BC,this.CA,this.oSCR);
		//this.BCA.update();	
		
		//////////////////////////////////////////////////////////////////////
		//{{2022.08.12
		let screenshot_objs = [];
		
		screenshot_objs.push( this.CAB );
		screenshot_objs.push( this.ABC );
		screenshot_objs.push( this.BCA );

		screenshot_objs.push( this.line_AB );
		screenshot_objs.push( this.line_BC );
		screenshot_objs.push( this.line_CA );

		screenshot_objs.push( this.objs['point_A'] );
		screenshot_objs.push( this.objs['point_B'] );
		screenshot_objs.push( this.objs['point_C'] );
		
		this.oSCR.register_screenshot_objs( screenshot_objs );
		//}}2022.08.12
		
		//////////////////////////////////////////////////////////////////////
		//this.update(this.pA);	
		this.update_triangle();
		
		//////////////////////////////////////////////////////////////////////
		//{{2022.08.12.debug- svg screenshot 
		//this.oSCR.screenshot();
		//}}		
		
	}
	
	
	//{{2022.08.05 - 실험, 성공적(정리필요)
	//call_back_of_drag_object(p_obj, p_x_vbc, p_y_vbc){
	//	//debugger;
	//	
	//	console.log( p_obj.constructor.name );	//class name: c_point
	//	console.log(     );
	//	
	//	for (const [key, value] of Object.entries(this.objs)) {
	//		//if( key == p_obj ){
	//			//console.log('오브젝트 : ',key, value, value == p_obj );			//잘 동작 
	//			
	//			//console.log('오브젝트 : ',key, value, Object.is(value, p_obj) );	//잘 동작
	//			
	//		//}
	//	}
	//
	//	//const map = {"first" : "1", "second" : "2"};
	//	//console.log( this.getKeyByValue(this.objs,p_obj));	//잘됨 - undefined			
	//	
	//	//{{
	//	//let tmp = null;
	//	//tmp = this.getKeyByValue(this.objs,p_obj);
	//	//
	//	//typeof만 정상으로 동작함
	//	//console.log( tmp == "undefined",typeof tmp == "undefined" );	//undefined			
	//	//}}
	//	
	//	//if( typeof let tmp = this.getKeyByValue(this.objs,p_obj) == 'undefined'){
	//	//if( typeof (let tmp = this.getKeyByValue(this.objs,p_obj)) === 'undefined'){
	//	//}
	//	let tmp = null;
	//	
	//	//{{잘됨
	//	//console.log( typeof (tmp = this.getKeyByValue(this.objs,p_obj) ) === 'undefined' );	//잘됨
	//	if( typeof (tmp = this.getKeyByValue(this.objs,p_obj) ) === 'undefined' ){
	//		console.log('undefined 입니다');
	//	}
	//	else{
	//		console.log( tmp );
	//	}
	//	//}}잘됨
	//	
	//	
	//	//debugger;
	//	
	//	p_obj.update_position_vbcs(p_x_vbc , p_y_vbc);	
	//	this.update( p_obj );
	//}
	//}}2022.08.05
	
	//{{2022.08.07
	call_back_of_drag_object(p_obj, p_x_vbc, p_y_vbc){
		
		//(VALD) 점의 이동에 대해서만 반응함
		if( p_obj.constructor.name != 'cPoint'){
			return;
		}
		
		//(VALD) : var name = { point_A , point_B , point_C }
		let var_name = scUtil.dictionary_search_key_by_value(this.objs, p_obj);
		
		//this.oSCR.debug_log( scUtil.dictionary_search_key_by_value(this.objs, p_obj) );	//점의 변수명
		
		//if( var_name != 'point_A' && var_name != 'point_B' && var_name != 'point_C' ){
		if( typeof var_name === 'undefined' ){
			return;
		}
		
		
		//(Logic) 		
		
		p_obj.update_position_vbcs(p_x_vbc , p_y_vbc);	
		
		//this.update( p_obj );
		this.update_triangle();
		
		return;
		////////////////////////////////////////////////////////////////
		
		console.log( p_obj.constructor.name , typeof p_obj);	//class name: c_point , typeof : object 
		console.log(     );
		return;
		
		for (const [key, value] of Object.entries(this.objs)) {
			//if( key == p_obj ){
				//console.log('오브젝트 : ',key, value, value == p_obj );			//잘 동작 
				
				//console.log('오브젝트 : ',key, value, Object.is(value, p_obj) );	//잘 동작
				
			//}
		}

		//const map = {"first" : "1", "second" : "2"};
		//console.log( this.getKeyByValue(this.objs,p_obj));	//잘됨 - undefined			
		
		//{{
		//let tmp = null;
		//tmp = this.getKeyByValue(this.objs,p_obj);
		//
		//typeof만 정상으로 동작함
		//console.log( tmp == "undefined",typeof tmp == "undefined" );	//undefined			
		//}}
		
		//if( typeof let tmp = this.getKeyByValue(this.objs,p_obj) == 'undefined'){
		//if( typeof (let tmp = this.getKeyByValue(this.objs,p_obj)) === 'undefined'){
		//}
		let tmp = null;
		
		//{{잘됨
		//console.log( typeof (tmp = this.getKeyByValue(this.objs,p_obj) ) === 'undefined' );	//잘됨
		if( typeof (tmp = this.getKeyByValue(this.objs,p_obj) ) === 'undefined' ){
			console.log('undefined 입니다');
		}
		else{
			console.log( tmp );
		}
		//}}잘됨
		
		
		p_obj.update_position_vbcs(p_x_vbc , p_y_vbc);	
		this.update( p_obj );
	}
	//}}2022.08.07
	
	update_triangle(){
		//debugger;
		this.line_AB.update();
		this.line_BC.update();
		this.line_CA.update();
		
		//debugger;
		this.CAB.update();
		this.ABC.update();
		this.BCA.update();		
		
		this.objs['point_A'].rotate_symbol( this.oSCR.calc_rad2deg(this.CAB.PCQ_rad_avg_opposite ));
		this.objs['point_B'].rotate_symbol( this.oSCR.calc_rad2deg(this.ABC.PCQ_rad_avg_opposite ));
		this.objs['point_C'].rotate_symbol( this.oSCR.calc_rad2deg(this.BCA.PCQ_rad_avg_opposite ));					
		
		
		
		//#835
		//const LenthSymbol_DIR_CW  = 1;
		//const LenthSymbol_DIR_CCW = 0;
		//
		//if( this.CAB.PCQ_rad >= 0 ){
		//	//dir = CW;
		//	dir = LenthSymbol_DIR_CW;
		//}
		//else{
		//	//dir = CCW;
		//	dir = LenthSymbol_DIR_CCW;
		//}		
		
		//debugger;
		this.line_AB.update_symbol( this.CAB.get_LenthSymbol_dir() );
		this.line_BC.update_symbol( this.ABC.get_LenthSymbol_dir() );
		this.line_CA.update_symbol( this.BCA.get_LenthSymbol_dir() );
		
		
		//이등변삼각형 특성표시
		if( this.line_AB.distance == this.line_BC.distance && this.line_AB.distance == this.line_CA.distance){
			//정삼각형
			this.line_AB.show_equal_length_symbol();
			this.line_BC.show_equal_length_symbol();
			this.line_CA.show_equal_length_symbol();
		}
		else{
			//2등변 삼각형
			if(this.line_AB.distance == this.line_BC.distance){
				this.line_AB.show_equal_length_symbol();
				this.line_BC.show_equal_length_symbol();
				this.line_CA.hide_equal_length_symbol();	
			}
			else if(this.line_AB.distance == this.line_CA.distance){
				this.line_AB.show_equal_length_symbol();
				this.line_BC.hide_equal_length_symbol();
				this.line_CA.show_equal_length_symbol();
			}
			else if(this.line_BC.distance == this.line_CA.distance){
				this.line_AB.hide_equal_length_symbol();
				this.line_BC.show_equal_length_symbol();
				this.line_CA.show_equal_length_symbol();									
			}
			else{
				this.line_AB.hide_equal_length_symbol();
				this.line_BC.hide_equal_length_symbol();
				this.line_CA.hide_equal_length_symbol();					
			}
		}
		
		//{{2022.08.13
		this.oSCR.screenshot();
		//}}		
		
		
	}//update
	//}}2022.08.05
	

}

