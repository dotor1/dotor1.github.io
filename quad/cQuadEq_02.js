////////////////////////////////////////////////////////
//                                                    //
//		2차방정식                                     //
//                                                    //
class cQuadEq{
	debug_flag = true;
	
	a = null;
	b = null;
	c = null;
	
	p = null;
	q = null;
	
	history = null;
	
	//{{2022.08.17 : LaTex highlight
	highlight_now = 0;
	
	highlight(){
		if( this.highlight_now == 0 ){
			return '\\myGreen';
		}
		else{
			return "\\myYellow";
		}
	}	
	
	hightlight_next(){
		this.highlight_now = (this.highlight_now+1) % 2;
	}
	//}}
	
	constructor(){
		//this.init();
	}
	
	init(p_coef_a,p_coef_b,p_coef_c){
		
		let split_a = p_coef_a.split('/');
		
		//console.log('갯수:',split_a.length);
		
		//{{
		//for (let i in split_a ) {
		//	//document.write( '<p>' + jbSplit[i] + '</p>' );
		//	console.log( split_a[i] );
		//}	
		//}}{{
		if( split_a.length == 1){
			if( split_a[0] === '' ){
				this.a = new cFraction( 1 , 1 );
			}
			else{
				this.a = new cFraction( Number(split_a[0]) , 1 );
			}
		}
		else if( split_a.length == 2){
			this.a = new cFraction( Number(split_a[0]) , Number(split_a[1]) );
		}
		else{
			return false;
		}
		//}}
		////////////////////////////////////////////////////////////////
		let split_b = p_coef_b.split('/');
		
		if( split_b.length == 1){
			if( split_b[0] === '' ){
				this.b = new cFraction( 1 , 1 );
			}
			else{
				this.b = new cFraction( Number(split_b[0]) , 1 );
			}			
		}
		else if( split_b.length == 2){
			this.b = new cFraction( Number(split_b[0]) , Number(split_b[1]) );
		}
		else{
			return false;
		}	
		////////////////////////////////////////////////////////////////
		let split_c = p_coef_c.split('/');
		
		if( split_c.length == 1){
			if( split_c[0] === '' ){
				this.c = new cFraction( 0 , 1 );
			}
			else{
				this.c = new cFraction( Number(split_c[0]) , 1 );
			}			
		}
		else if( split_c.length == 2){
			this.c = new cFraction( Number(split_c[0]) , Number(split_c[1]) );
		}
		else{
			return false;
		}				
		////////////////////////////////////////////////////////////////
		this.proc();
		
		return true;
		////////////////////////////////////////////////////////////////
		
		
		//let a = new cFraction(1,2);
		//let a = new cFraction(1,-2);
		//let a = new cFraction(-1,2);
		//let a = new cFraction(-1,-2);
		
		//let a = new cFraction(1,-2);
		//let a = new cFraction(1.0,-2);
		//let a = new cFraction(1.1,-2);
		
		//let a = new cFraction(0,-2);
		
		//let a = new cFraction(1,2);
		//let a = new cFraction(2,1);
		
		//let a = new cFraction(2,-1);

		//step.#0 - 체크용
		//this.a = new cFraction(0,1.234);		
		//this.b = new cFraction(-1,1);		
		//this.c = new cFraction(1,4);		
		
		//step2. 약분체크~step.4까지 체크
		////this.a = new cFraction(-2,4);		
		//this.a = new cFraction(-4,2);		
		//this.b = new cFraction(-2,4);		
		//this.c = new cFraction(1,4);		
		
		//step3. x^2항의 계수가 1이 아닐 때 체크 -> 다시 확인 필요
		//this.a = new cFraction(-1,2);		
		//this.b = new cFraction(-1,1);		
		//this.c = new cFraction(1,4);		
		
		//step3 체크용
		//this.a = new cFraction(-2,1);		
		//this.b = new cFraction(-1,2);		
		//this.c = new cFraction(1,4);		
		
		//step4. 체크용 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(1,4);		
		//this.c = new cFraction(-1,8);				

		//step4. act1a 체크용 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(1,1);		
		//this.c = new cFraction(1,8);	
		
		//step4. act1a 체크용 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(1,1);		
		//this.c = new cFraction(1,4);		

		//step4. act1a 체크용2 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(1,1);		
		//this.c = new cFraction(1,8);		

		
		//step5. 체크용
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-1,1);		
		//this.c = new cFraction(1,1);
		
		//step10. 체크용
		//this.a = new cFraction(2,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(0,1);

		//step20. 체크
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(4,1);
		
		//step30. 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-4,1);

		//step30. act1 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(4,1);
		
		//step30. act2 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(2,1);

		//step30. act3,4 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(4,1);

		//step30. act5 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(8,1);
		
		////////////////////////////////////////////////////

		//step30. case : ±√-5 					//reduce불가형
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(5,1);

		//step30. case : ±√5 					//reduce불가형
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-5,1);
		
		//step30. case	: 1					//reduce형 - 완전제곱꼴
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-1,1);

		//step30. case	: -1				//reduce형 - 완전제곱꼴
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(1,1);		

		//step30. case	: 4				//reduce형 - 완전제곱꼴
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-4,1);	

		//step30. case	: -4				//reduce형 - 완전제곱꼴
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(4,1);	

		//step30. case : 8 			//reduce형 - 완전제곱꼴이 아님
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-8,1);

		//step30. case : -8 			//reduce형 - 완전제곱꼴이 아님
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(8,1);
		
		////////////////////////////////////////////////////
		
		//step40. reduce 불가형 : (x+2)^2 = -2
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(6,1);

		//step40. reduce 불가형 : (x+2)^2 = 2
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(2,1);

		//step40. reduce:O , 완전제곱:X : (x+2)^2 = -8
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(12,1);

		//step40. reduce:O , 완전제곱:X : (x+2)^2 = 8
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(-4,1);

		//step40. reduce:O , 완전제곱:O, 허수항:O	-> (x+2)^2 = -4
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(8,1);

		//step40. reduce:O , 완전제곱:O, 허수항:O	-> (x+2)^2 = -1
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(5,1);

		//step40. reduce:O , 완전제곱:O, 허수항:X	-> (x+2)^2 = 4
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(0,1);
		
		//step40. reduce:O , 완전제곱:O, 허수항:X	-> (x+2)^2 = 1
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(4,1);		
		//this.c = new cFraction(3,1);		
		
		////////////////////////////////////////////////////
		
		//step40. act3 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(-3,1);

		//step40. act4,5 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(12,1);

		//step40. act6 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(0,1);

		//step40. act7 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(8,1);

		//step40. act8 체크 
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-4,1);		
		//this.c = new cFraction(0,1);	
	
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-1,1);		
		//this.c = new cFraction(1,4);		
		
		//일반 문제풀이
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-5,1);		
		//this.c = new cFraction(6,1);			

		//this.a = new cFraction(3,1);		
		//this.b = new cFraction(-7,1);		
		//this.c = new cFraction(2,1);	

		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(2,1);	

		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-6,1);		
		//this.c = new cFraction(-10,1);	
		
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-7,1);		
		//this.c = new cFraction(12,1);	
		
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-2,1);		
		//this.c = new cFraction(-6,1);

		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-16,1);
		
		//this.a = new cFraction(3,1);		
		//this.b = new cFraction(0,1);		
		//this.c = new cFraction(-6,1);
		
		//this.a = new cFraction(3,1);		
		//this.b = new cFraction(-3,1);		
		//this.c = new cFraction(1,1);
		
		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(-3,1);		
		//this.c = new cFraction(1,1);

		//this.a = new cFraction(1,1);		
		//this.b = new cFraction(2,1);		
		//this.c = new cFraction(1,1);

		this.a = new cFraction(1,1);		
		this.b = new cFraction(3,1);		
		this.c = new cFraction(2,1);
		
		//{{debugger
		this.proc();
		//}}debugger;
	}
	
	//2차방정식 풀이
	proc(){
		this.history = [];
		
		//[step-#0] 2차식 맞는지 점검
		let step0_rc = this.step0();
		if( step0_rc['rc'] != 0 ){
			return;
		}
		
		//[step.1] 일단 식을 한 번 출력
		let step1_rc = this.step1();
		if( step1_rc['rc'] != 0 ){
			return;
		}		
		
		//[step.2]상수항에 약분이 가능한 상황인지 체크
		let step2_rc = this.step2();
		if( step2_rc['rc'] != 0 ){
			return;
		}		
		
		//[step.3]x^2항의 계수가 1이 아닐 때
		let step3_rc = this.step3();
		if( step3_rc['rc'] != 0 ){
			return;
		}				

		//[step.4] x^2 + px + q = 0 -> (x+a)^2+b = 0
		let step4_rc = this.step4();
		if( step4_rc['rc'] != 0 ){
			return;
		}	
		
		//[step.5] (x+a)^2+b = 0  -> (x+a)^2 = -b
		let step5_rc = this.step5( step4_rc);
		if( step5_rc['rc'] != 0 ){
			return;
		}	
		
		////////////////////////////////////////////////////////////////
		let ret = {};
		
		//[step.10] x^2 = 0
		if( step5_rc['g'].isZero && step5_rc['h'].isZero ){
			ret = this.step10( step5_rc );
		}
		//[step.20] (x-g)^2 = 0
		else if( !step5_rc['g'].isZero && step5_rc['h'].isZero ){
			ret = this.step20( step5_rc );
		}
		//[step.30] x^2 = h
		else if( step5_rc['g'].isZero && !step5_rc['h'].isZero ){
			ret = this.step30( step5_rc );
		}	
		//[step.40] (x-g)^2 = h
		else if( !step5_rc['g'].isZero && !step5_rc['h'].isZero ){
			ret = this.step40( step5_rc );
		}			
		
		////////////////////////////////////////////////////////////////
		//
		
		this.report_history();
		
	}
	
	report_history(){
		
		let tex_lines = '';
		
		for (let i = 0; i < this.history.length; i++) {
			let item = this.history[i]
			
			let tex_line = '';
			if( i==0 ){
				tex_lines = item.expr + '\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;...\\;\\;' + 'S:' + item.step + '-' + 'A:' + item.act;
			}
			else{
				tex_lines = 
					tex_lines +
					'\\\\' + item.expr +
					'\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;...\\;\\;' + 'S:' + item.step + '-' + 'A:' + item.act;
					
				//줄바꿈 : 원래 2개인데 이스케이프 한 개
			}
			
		}		
		
		//
		//tex_lines = 
		//		'\\begin{equation}' + 
		//			'\\displaylines{' +
		//				tex_lines + 
		//			'}' +
		//		'\\end{equation}';					

		//tex_lines = 
		//		'\\begin{split}' + 
		//				'\\displaylines{' +
		//					tex_lines + 
		//				'}' +
		//		'\\end{split}';	

		tex_lines = 
				'\\begin{align}' + 
						'\\displaylines{' +
							tex_lines + 
						'}' +
				'\\end{align}';	
		
		//debugger;

		scUtil.update_element_innerHTML('mysol',tex_lines);
		MathJax.typeset();		
	}
	
	report_history_v1(){
		
		let tex_lines = '';
		
		for (let i = 0; i < this.history.length; i++) {
			let item = this.history[i]
			
			let tex_line = '';
			if( i==0 ){
				tex_lines = item.expr + '\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;...\\;\\;' + 'S:' + item.step + '-' + 'A:' + item.act;
			}
			else{
				tex_lines = 
					tex_lines +
					'\\\\' + item.expr +
					'\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;...\\;\\;' + 'S:' + item.step + '-' + 'A:' + item.act;
					
				//줄바꿈 : 원래 2개인데 이스케이프 한 개
			}
			
		}		
		
		//
		//tex_lines = 
		//		'\\begin{equation}' + 
		//			'\\displaylines{' +
		//				tex_lines + 
		//			'}' +
		//		'\\end{equation}';					

		tex_lines = 
				'\\begin{align}' + 
					'\\displaylines{' +
						tex_lines + 
					'}' +
				'\\end{align}';	
		
		//debugger;

		scUtil.update_element_innerHTML('mysol',tex_lines);
		MathJax.typeset();		
	}	
	
	//[step-#0] 2차식 맞는지 점검
	step0(){
		let ret = {};

		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#0] 2차식 맞는지 점검');
		
		if( this.a.isZero ){
			this.debug_log('2차 방정식이 아님');
			ret['rc']  = -1;
			ret['msg'] = 'x^2항의 계수가 0으로 2차방정식이 아님';
			
		}
		else{
			this.debug_log('2차 방정식이 맞음');
			ret['rc']  = 0;
		}
		
		return ret;
	}
	
	//[step-#1] 일단 식을 한 번 출력
	step1(){
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#1] display expr - 일단 식을 한 번 찍는다');
		////////////////////////////////////////////////////////////////
		let b_term = '';
		if( !this.b.isZero ){
			b_term = this.b.get_val(4) + 'x';
		}
		////////////////////////////////////////////////////////////////
		
		let act1 = 
			this['a'].get_val(3) + 'x^2' +
			b_term + 
			this['c'].get_val(5) + 
			' = 0';
			
		this.debug_log( act1 );	
		
		////////////////////////////////////////////////////////////////
		//{{Latex.2022.08.17
		let b_term2 = ( this['b'].isZero ? '' : this['b'].get_Tex(4) + 'x' );
		
		let tex_str = 
			this['a'].get_Tex(3) + 'x^2' + 
			b_term2 +
			this['c'].get_Tex(5) + 
			'  = 0';
		this.history.push( {'step':1,'act':1,'expr':tex_str,'comment':''} );   
		//}}Latex.2022.08.17
		////////////////////////////////////////////////////////////////
		ret['rc']  = 0;
		
		return ret;
	}

	//[step-#2] 약분이 가능하면 약분하라
	step2(){
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#2] 약분가능하면 약분');
		
		//작업조건 체크용
		let a_able = this['a'].can_simplify();
		let b_able = this['a'].can_simplify();
		let c_able = this['a'].can_simplify();
		
		//[작업] 약분이 가능하면 약분한다.
		if( a_able || b_able || c_able){
			this.debug_log('[약분]');
			
			if( a_able ){
				this['a'].simplify2();
			}

			if( b_able ){
				this['b'].simplify2();
			}

			if( c_able ){
				this['c'].simplify2();
			}			
			
			//bx항 
			let b_term = '';
			if(!this['b'].isZero ){
				b_term = this['b'].get_val(4) + 'x';	
			}
			
			//결과출력
			let act = 
				this['a'].get_val(3) + 'x^2' +
				b_term +
				this['c'].get_val(5) +
				' = 0';
			this.debug_log( act );

			////////////////////////////////////////////////////////////////
			//{{Latex.2022.08.17
			let b_term2 = ( this['b'].isZero ? '' : this['b'].get_Tex(4) + 'x' );
			
			let tex_str = 
				this['a'].get_Tex(3) + 'x^2' + 
				b_term2 +
				this['c'].get_Tex(5) + 
				'  = 0' ;	//'\\;\\;\\;\\;\\;\\;\\;... s2a1';
			this.history.push( {'step':2,'act':1,'expr':tex_str,'comment':''} );   
			//}}Latex.2022.08.17
			////////////////////////////////////////////////////////////////

			
		}
		else{
			this.debug_log('약분대상 아님');	
		}
		
		ret['rc'] = 0;	//0으로 세팅하면 다음 단계는 무조건 실행
		return ret;
	}

	//[step-#3] ax^2에서 a가 1이 아닐 때, 양변에 1/a 곱하기
	step3(){
		let ret = {};

		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#3] ax^2에서 a가 1이 아닐 때 양변에 1/a 곱하기');
		
		//(VALD)
		if( this['a'].isOne ){
			this.debug_log('ax^2 : a=1 -> 작업불필요');
			
			this['p'] = new cFraction( this['b'].nu , this['b'].de );
			this['q'] = new cFraction( this['c'].nu , this['c'].de );
			
			ret['rc'] = 0;
			return ret;
		}
		
		//	-1/2x^2-x+1/4 = 0
		////////////////////////////////////////////////////////////////
		//	
		//	[action.#1]
		//		-2 x ( -1/2x^2-x+1/4 ) = -2 x 0 
		//		x^2의 계수의 역수를 양변에 곱한다.
		//
		let inv_a = new cFraction( this['a'].de , this['a'].nu );
		
		let b_term = ( this['b'].isZero ? '' : this['b'].get_val(4)+'x' );
		
		let act1 = 
			inv_a.get_val(0) + ' x ( ' +
			this['a'].get_val(3) + 'x^2' + 
			b_term + 
			this['c'].get_val(5) + ' ) = ' +
			inv_a.get_val(0) + 
			' x 0 ' + '   :a1';
			
		this.debug_log( act1 );

		//{{Latex.2022.08.17
		this.hightlight_next();
		
		let b_term2 = ( this['b'].isZero ? '' : this['b'].get_Tex(4) + 'x' );
		
		let tex_str = 
			inv_a.get_Tex(0, this.highlight() ) + ' \\times ( ' +
			this['a'].get_Tex(3) + 'x^2' + 
			b_term2 +
			this['c'].get_Tex(5) + ' )  = ' +
			inv_a.get_Tex(0, this.highlight() ) + ' \\times ' +
			' 0';
		this.history.push( {'step':3,'act':1,'expr':tex_str,'comment':''} );   
		//}}Latex.2022.08.17
		
		////////////////////////////////////////////////////////////////
		//	
		//	[action.#2]
		//	-2·-1/2x^2 + (-2)·(-1)x+(-2)·1/4 = 0
		//			                     
		b_term = '';
		if( !this['b'].isZero ){
			b_term = 
				' + ' +
				inv_a.get_val(1) +
				this['b'].get_val(2) +
				'x';
		}
		
		let c_term = '';
		if( !this['c'].isZero ){
			c_term = 
				'+' + 
				inv_a.get_val(1) + 
				this['c'].get_val(22);
		}
		
		let act2 =
			inv_a.get_val(0) + '\u{B7}' +
			this['a'].get_val(0) + 'x^2' +
			b_term +
			c_term + 
			' = 0' + '   :a2';
		this.debug_log( act2 );
		
		//{{Latex.2022.08.17
		this.hightlight_next();
		
		b_term2 = '';
		if( !this['b'].isZero ){
			b_term2 = 
				' + ' +
				inv_a.get_Tex(1,this.highlight()) +
				this['b'].get_Tex(2) +
				'x';
		}
		
		let c_term2 = '';
		if( !this['c'].isZero ){
			c_term2 = 
				'+' + 
				inv_a.get_Tex(1,this.highlight()) + 
				this['c'].get_Tex(22);
		}		
		
		
		tex_str = 
			inv_a.get_Tex(0, this.highlight() ) + '\\cdot' +
			this['a'].get_Tex(0) + 'x^2' + 
			b_term2 +
			c_term2 + 
			' = 0';
		this.history.push( {'step':3,'act':2,'expr':tex_str,'comment':''} );   
		//}}Latex.2022.08.17		
		
		////////////////////////////////////////////////////////////////
		//	
		//	[action.#3]
		//		x^2+2x-1/2 = 0
		//	
		this['p'] = new cFraction( inv_a.nu * this['b'].nu , inv_a.de * this['b'].de );
		this['q'] = new cFraction( inv_a.nu * this['c'].nu , inv_a.de * this['c'].de );		
		
		this['p'].simplify2();
		this['q'].simplify2();
		
		let p_term = ( this['p'].isZero ? '' : this['p'].get_val(4)+'x' );
		let q_term = ( this['q'].isZero ? '' : this['q'].get_val(5)     );
		
		let act3 = 
			'x^2'  + 
			p_term +
			q_term + 
			' = 0' + '   :a3';
		
		this.debug_log( act3 );
		
		//{{Latex.2022.08.17
		this.hightlight_next();
		
		let p_term2 = ( this['p'].isZero ? '' : this['p'].get_Tex(4,this.highlight()) + 'x' );
		let q_term2 = ( this['q'].isZero ? '' : this['q'].get_Tex(5,this.highlight())       );
		
		tex_str = 
			'x^2' + 
			p_term2 +
			q_term2 + 
			'  = 0';
		this.history.push( {'step':3,'act':3,'expr':tex_str,'comment':''} );   
		//}}Latex.2022.08.17		
		
		////////////////////////////////////////////////////////////////
		ret['rc'] = 0;
		return ret;
		
	}
	
	//[step-#4] x^2 + px + q = 0 -> (x+a)^2+b = 0
	step4(){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#4] x^2 + px + q = 0 -> (x+a)^2 + b = 0');
		
		//vald - p가 0일 때는 할 필요가 없음
		if( this['p'].isZero ){
			this.debug_log('p == 0 -> 작업불필요');
			ret['rc'] = 0;
			ret['a']  = new cFraction(0,1);	//0
			ret['b']  = new cFraction( this['q'].nu , this['q'].de );
			
			return ret;
		}
		
		this.debug_log('작업대상');
		
		//{{2022.08.18.xls: 오류-2022.08.18
		let p_flag = false; 
		if( this['p'].int_flag && (this['p'].int_val == 2 || this['p'].int_val == -2)){
			p_flag = true;	
		}
		//}}2022.08.18
		
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : x의 계수에서 2를 뽑아내기 
		//		x^2 + 2·1/2·(-1)x+1/4 = 0
		//
		let tex_str = '';
		
		let term_q = ( this['q'].isZero ? '' : this['q'].get_val(5) );	//#rule.#5: 상수항 term	
		
		let act1 = 
			'x^2 ' +
			'+ 2' + '\u{B7}' + '1/2' + this['p'].get_val(2) + 'x' +	//rule.#2: term 내부에 낑겨 있음 -> 값이 1일 때는 생략
			term_q + 
			' = 0';
		
		if( !p_flag){
			this.debug_log(act1);
		}

		//{{Latex.2022.08.17
		this.hightlight_next();
		
		let term_q2 = ( this['q'].isZero ? '' : this['q'].get_Tex(5)   );
		
		tex_str = 
			'x^2' + 
			' + ' + this.highlight() + '{2}' + ' \\cdot ' + this.highlight() + '{ \\frac{1}{2} }' + this['p'].get_Tex(2) + 'x' +
			term_q2 + 
			' = 0';
		if( !p_flag ){
			this.history.push( {'step':4,'act':1,'expr':tex_str,'comment':''} );   
		}
		//}}Latex.2022.08.17	
		
		//{{debug.2022.08.17. 다항식 출력관련 테스트 - 큰 의미가 없을 것 같아서 중단
		//let t2u1 = new cFraction(2,1);
		//let t2u2 = new cFraction(1,2);
		//let t2u3 = this['p'];
		//
		//let t2 = new cTerm([t2u1,t2u2,t2u3],1,'x',false);
		//}}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.1a : 중간에 끼어넣음 -> 1이 아닐 때 해야함
		//		x^2 + 2·(-1/2)x+1/4 = 0
		//
		//	만약 전단계가
		//		x^2 + 2·1/2x+1/4 = 0 식으로 나오면 작업할 필요가 없음 
		let s = new cFraction( this['p'].nu , this['p'].de*2);
		s.simplify2();
		
		//if( ! this['p'].isOne ){
		if( ! this['p'].isOne ){
			//{{Latex.2022.08.17
			this.hightlight_next();
			
			term_q2 = ( this['q'].isZero ? '' : this['q'].get_Tex(5)   );
			
			tex_str = 
				'x^2' + 
				' + ' + '2' + ' \\cdot ' + this.highlight() + '{ \\frac{1}{2} }' + this['p'].get_Tex(2,this.highlight()) + 'x' +
				term_q2 + 
				'  = 0';
			if( !p_flag){
				this.history.push( {'step':4,'act':'1a','expr':tex_str,'comment':''} );   
			}
			//}}Latex.2022.08.17			
			
			let act1a = 
				'x^2 ' + 
				'+ 2' + s.get_val(2) + 'x' +	//rule.#2: term 내부에 낑겨 있음
				term_q +
				' = 0' + '   :a1a';;
			
			if( !p_flag){
				this.debug_log(act1a);	
			}

			//{{Latex.2022.08.17
			//this.hightlight_next();
			tex_str = 
				'x^2' + 
				' + 2 ' + s.get_Tex(2,this.highlight()) + 'x' + 
				term_q2 + 
				'  = 0';
			if( !p_flag){
				this.history.push( {'step':4,'act':'1a','expr':tex_str,'comment':''} );   
			}
			//}}Latex.2022.08.17	
			
				
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.2 :  x에서 2를 나눈 계수의 제곱을 더하고 빼고
		//		x^2 + 2·(-1/2)x + (-1/2)^2 - (-1/2)^2+1/4 = 0
		//
		
		//{{2022.08.18.xls: 오류-2022.08.18
		let flag = false;
		let s_tmp = new cFraction(s.nu*s.nu , s.de*s.de);
		if( s_tmp.nu == this['q'].nu && s_tmp.de == this['q'].de ){
			flag = true;
		}
		//}}
		
		let term_ss = s.get_val(7);	//rule.#7: 제곱꼴룰
		
		let act2 = 
			'x^2' +
			' + 2' + s.get_val(2) + 'x'+ //rule.#2: term 내부에 낑겨 있음
			' + ' + term_ss + '^2' +
			' - ' + term_ss + '^2' +
			term_q  +
			' = 0' + '   :a2';;
		
		if(!flag){
			this.debug_log(act2);			
		}

		//{{Latex.2022.08.17
		//this.hightlight_next();
		this.hightlight_next();
		
		let term_ss2 = s.get_Tex(7);
		
		tex_str = 
			'x^2' + 
			' + 2 ' + s.get_Tex(2) + 'x' + 
			this.highlight() + '{ ' + ' + ' + term_ss2 + '^2' + ' }' +
			this.highlight() + '{ ' + ' - ' + term_ss2 + '^2' + ' }' +
			term_q2 +
			'  = 0';
		if(!flag){
			this.history.push( {'step':4,'act':2,'expr':tex_str,'comment':''} );   
		}
		//////
		this.hightlight_next();
		
		term_q2 = ( this['q'].isZero ? '' : this['q'].get_Tex(5, this.highlight() )   );
		
		tex_str = 
			'x^2' + 
			' + 2 ' + s.get_Tex(2) + 'x' + 
			' + ' + term_ss2 + '^2' + 
			this.highlight() + '{ ' + ' - ' + term_ss2 + '^2' + ' }' +
			term_q2 +
			'  = 0';
		if(!flag){
			this.history.push( {'step':4,'act':2,'expr':tex_str,'comment':''} );  		
		}
		
		//}}Latex.2022.08.17	

		////////////////////////////////////////////////////////////////
		//
		//	action.3
		//		x^2 + 2·(-1/2)x + (-1/2)^2  = 0
		//
		let v = new cFraction( s.nu, s.de );
		v.pow2();
		v.multiply_negative1();
		v.add_single( this['q'] );
		
		let term_v = v.get_val(5); 	//rule.#5: 상수항 term
		if( v.isZero ){
			term_v = '';
		}
		
		let act3 = 
			'x^2 ' +
			'+ 2' + s.get_val(2) + 'x' + 	//rule.#2: term 내부에 낑겨 있음
			' + ' + term_ss + '^2 ' +
			term_v + 
			' = 0' + '   :a3';;
		
		if(!flag){		
			this.debug_log(act3);		
		}
		
		//{{Latex.2022.08.17
		//this.hightlight_next();
		
		let term_v2 = ( v.isZero ? '' :  v.get_Tex(5,this.highlight()) );
		
		tex_str = 
			'x^2' + 
			' + 2 ' + s.get_Tex(2) + 'x' + 
			' + ' + term_ss2 + '^2' + 
			term_v2 + 
			'  = 0';
		
		if(!flag){		
			this.history.push( {'step':4,'act':3,'expr':tex_str,'comment':''} );  		
		}
		
		//}}Latex.2022.08.17		
		
		////////////////////////////////////////////////////////////////
		//
		//	action.4
		//		
		//		
		let act4 = 
			'(x ' + s.get_val(5) + ')^2 ' + 	//rule.#5: 상수항 term
			term_v +
			'= 0' + '   :a4';;
		
		this.debug_log(act4);		
		
		//{{Latex.2022.08.17
		this.hightlight_next();
		
		term_v2 = ( v.isZero ? '' :  v.get_Tex(5) );
		
		tex_str = 
			this.highlight() + '{ ' +
			'x^2' + 
			' + 2 ' + s.get_Tex(2) + 'x' + 
			' + ' + term_ss2 + '^2' + ' } '+ 
			term_v2 + 
			'  = 0';
		this.history.push( {'step':4,'act':4,'expr':tex_str,'comment':''} ); 
		///////////////
		
		
		tex_str = 
			this.highlight() + '{ ' +
			'(x' + s.get_Tex(5) + ')^2 ' + ' }' +
			term_v2 + 
			'  = 0';
		this.history.push( {'step':4,'act':4,'expr':tex_str,'comment':''} );  		
		
		//}}Latex.2022.08.17			
		
		////////////////////////////////////////////////////////////////

		ret['a']  = new cFraction( s.nu , s.de );	
		ret['b']  = new cFraction( v.nu , v.de );
		
		ret['rc'] = 0;	//0으로 세팅하면 다음 단계는 무조건 실행
		return ret;
	}
	
	//[step.5] (x+a)^2+b = 0  -> (x+a)^2 = -b
	step5(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-#5] (x+a)^2+b = 0  -> (x+a)^2 = -b');
		////////////////////////////////////////////////////////////////
		//	VALD : b=0이면 해줄 필요가 없음
		if( p['b'].isZero ){
			this.debug_log('b:0 -> 작업대상 아님');
			
			ret['g'] = new cFraction( p['a'].nu , p['a'].de );
			ret['h'] = new cFraction( p['b'].nu , p['b'].de );
			
			ret['rc'] = 0;
			return ret;
		}
		////////////////////////////////////////////////////////////////
		//
		//	(x -1/2)^2 +3/4= 0
		//		
		this.debug_log('작업대상');
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : b를 우변으로 넘기기
		//		
		//	(x-1/2)^2 = -3/4
		//	
		let act1 = '';
		
		let minus_b = new cFraction( p['b'].nu , p['b'].de );
		minus_b.multiply_negative1();
		
		let term_a = p['a'].get_val(5);	//rule.#5: 상수항 term
		
		if( p['a'].isZero ){
			//0이면 term 생략
			
			term_a = '';
			
			act1 = 'x^2 = ' + minus_b.get_val(6);	//rule.#6: 상수항 and 유일항 term
			
		}
		else{
			act1 = 
				'(x' + 	term_a + ')^2 = ' + 
				minus_b.get_val(6);					//rule.#6: 상수항 and 유일항 term 
		}
		
		this.debug_log(act1);

		//{{Latex.2022.08.17
		this.hightlight_next();
		
		let term_a2 = p['a'].get_Tex(5);
		
		let tex_str = '';
		
		if( p['a'].isZero ){
			tex_str = 
				'x^2 = ' + minus_b.get_Tex(6, this.highlight() );	// + '\\;\\;\\;\\;\\;\\;\\;... s5a1';	//rule.#6: 상수항 and 유일항 term
				 
		}
		else{
			tex_str = 
				'(x' + term_a2 + ')^2 = ' + minus_b.get_Tex(6, this.highlight() );	// + '\\;\\;\\;\\;\\;\\;\\;... s5a1';	//rule.#6: 상수항 and 유일항 term
				 
		}
		
		this.history.push( {'step':5,'act':1,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17
		
		////////////////////////////////////////////////////////////////
		ret['g'] = new cFraction( p['a'].nu  , p['a'].de  );
		ret['h'] = new cFraction( minus_b.nu , minus_b.de );
		
		ret['rc'] = 0;
		return ret;

		
	}

	//[[step.10] x^2 = 0 꼴 끝
	step10(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-10] x^2 = 0 ');
		
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : 결과출력
		//
		let act1 = '\u{2234}' + 'x = 0';
		this.debug_log( act1 );
		
		//{{Latex.2022.08.17
		let tex_str = '\\therefore x = 0 \\;\\;\\;\\;\\;\\;\\;... s10a1';
		this.history.push( {'step':10,'act':1,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17
		
		////////////////////////////////////////////////////////////////
		ret['rc'] = 0;
		return ret;
		
	}		
	
	//[[step.20]  (x-g)^2 = 0 끝
	step20(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-20] (x-g)^2 = 0 ');
		
		////////////////////////////////////////////////////////////////
		//
		//	(x -2)^2 = 0
		//	
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : 루트 해제 : (x-g)^2 = 0 -> (x-g) = 0
		//
		//	x -2 = 0
		//
		let term_g = (p['g'].isZero ? '' : p['g'].get_val(5));	//rule.#5: 상수항 term
		
		let act1 = ' x ' + term_g + ' = 0';
		
		this.debug_log( act1 );
		
		//{{Latex.2022.08.17
		let term_g2 = (p['g'].isZero ? '' : p['g'].get_Tex(5));	//rule.#5: 상수항 term
		
		let tex_str = ' x ' + term_g2 + ' = 0';
		this.history.push( {'step':20,'act':1,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17		
		
		////////////////////////////////////////////////////////////////
		//
		//	action.2 : 우변으로 이항
		//
		//	∴ x = 2
		//		
		let neg_g = new cFraction( p['g'].nu , p['g'].de );
		neg_g.multiply_negative1();
		
		let act2 = 
			'\u{2234}' + 
			' x = ' + neg_g.get_val(6);	//rule.#6: 상수항 and 유일항 term
		
		this.debug_log( act2 );
		
		//{{Latex.2022.08.17
		tex_str = '\\therefore x = ' + neg_g.get_Tex(6);	// + '\\;\\;\\;\\;\\;\\;\\;... s20a2';	//rule.#6: 상수항 and 유일항 term
		this.history.push( {'step':20,'act':1,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17	
		
		////////////////////////////////////////////////////////////////
		ret['rc'] = 0;
		return ret;
	}			
	
	//[[step.30]  x^2 = h 형태 : ~2022.08.18
	step30_v1(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-30] x^2 = h (h!=0) ');
		////////////////////////////////////////////////////////////////
		//{{debug
		//p['h'].init( -1,1);
		//debugger;
		//}}debug
		////////////////////////////////////////////////////////////////
		let ir = new cIrrational( p['h'] );
		ir.simplify();
		
		let h_abs = new cFraction( p['h'].nu , p['h'].de );	//h는 abs(p)
		if( !h_abs.sign ){	//음수이면...
			h_abs.init( h_abs.nu * -1 , h_abs.de );
		}
				
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : 허수는 한 번 찍는다
		//		pre  : x^2 = -4
		//		post : x = ±√-4
		//				
		
		//{{Latex.2022.08.17
		let tex_str = '';
		//}}
		
		if( ! p['h'].sign ){	
			let act1 = 'x = ' + '\u{b1}' + '\u{221a}' + p['h'].get_val(6)  + ' :a1';  //rule.#6: 상수항 and 유일항 term
			this.debug_log( act1 );
			
			//{{Latex.2022.08.17
			tex_str = 'x = ' + ' \\pm ' + '\\sqrt{ ' + p['h'].get_Tex(6) + ' }'  ;  //rule.#6: 상수항 and 유일항 term
			this.history.push( {'step':30,'act':1,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17
		}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.2 :  Root에 변형이 불가한 경우 여기까지 하고 끝낸다
		//		pre  : x = ±√-2
		//		post : ∴ x = ±√2i
		//		
		if( ! ir.reduce_flag ){
			let root_str  = '';
			let root_str2 = '';
			
			if( ir.frac_in.isOne ){			//-1은 생략(+-i), 1은 안생략(+-1)
				if( ir.im_flag ){	//-1
					root_str  = ir.im_str;
					root_str2 = ir.im_str;
				}
				else{	//1
					root_str  = '1';
					root_str2 = '1';
				}
			}
			else{
				root_str  = '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str;
				root_str2 = '\\sqrt{ ' + ir.frac_in.get_Tex(6) + ' }' + ir.im_str ;
			}
			
			
			//let act2 = '\u{2234}' + ' x = ' + '\u{b1}' + '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str + ' :a2';  //rule.#6: 상수항 and 유일항 term
			let act2 = '\u{2234}' + ' x = ' + '\u{b1}' + root_str + ' :a2';  //rule.#6: 상수항 and 유일항 term
			this.debug_log( act2 );
			
			//{{Latex.2022.08.17
			//tex_str = '\\therefore x = \\pm \\sqrt{ ' + ir.frac_in.get_Tex(6) + ' }' + ir.im_str ;
			tex_str = '\\therefore x = \\pm ' + root_str2;
			this.history.push( {'step':30,'act':2,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17
			
			ret['rc'] = 0;
			return ret;				
			
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.3 :  Root 변형 전 일단 한 번 프린트
		//		pre  : x = ±√-4
		//		post : x = ±√4i
		//				
		let act3 = 'x = ' + '\u{b1}' + '\u{221a}' + h_abs.get_val(6) + ir.im_str + ' :a3';  //#rule.#6: 상수항 and 유일항 term
		this.debug_log( act3 );

		////////////////////////////////////////////////////////////////
		//
		//	action.4 :  완전제곱꼴 결과 찍고 끝내기
		//		pre  : x = ±√4i
		//		post : ∴x = ±2i
		//			
		if( ir.perfect_square_flag ){
			//(오류) : x = +-1i로 나옴 
			//	허수이고, 값이 1이면 1을 생략해야함
			//{{
			let term_outside_root = ir.frac_out.get_val(6);   //#root 바깥쪽;	

			if ( ir.im_flag && ir.frac_out.int_flag && ir.frac_out.int_val == 1){
				term_outside_root = '';
			}
			//}}			
			
			//{{
			//let act4 = '\u{2234}' + 'x = ' + '\u{b1}' + ir.frac_out.get_val(6) + ir.im_str + ' :a4';  //rule.#6: 상수항 and 유일항 term
			//}}{{
			let act4 = '\u{2234}' + 'x = ' + '\u{b1}' + term_outside_root + ir.im_str + ' :a4';  //rule.#6: 상수항 and 유일항 term
			//}}
			this.debug_log( act4 );
			
			ret['rc'] = 0;
			return ret;				
		}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.5 :  a root b 골로 찍고 끝내기
		//		pre  : x = ±√8i
		//		post : ∴x = ±2√2i
		//				
		let act5 = '\u{2234}' + 'x = ' + '\u{b1}' + ir.frac_out.get_val(6) + '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str + ' :a5';
        //             let act3 = 'x = ' + '\u{b1}'                          + '\u{221a}' + h_abs.get_val(6) + ir.im_str + ' :a3';  //#rule.#6: 상수항 and 유일항 term
		this.debug_log( act5 );		
		
		////////////////////////////////////////////////////////////////
		ret['rc'] = 0;
		return ret;		
	}

	//[[step.30]  x^2 = h 형태 : 2022.08.18~		/ note.#906
	step30(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-30] x^2 = h (h!=0) ');
		////////////////////////////////////////////////////////////////
		//{{debug
		//p['h'].init( -1,1);
		//debugger;
		//}}debug
		////////////////////////////////////////////////////////////////
		let ir = new cIrrational( p['h'] );
		//debugger;		
		ir.simplify();
		
		let h_abs = new cFraction( p['h'].nu , p['h'].de );	//h는 abs(p)
		if( !h_abs.sign ){	//음수이면...
			h_abs.init( h_abs.nu * -1 , h_abs.de );
		}
				
		////////////////////////////////////////////////////////////////
		//
		//	action.1 : 허수는 한 번 찍는다.
		//				무리수 simplify하면... 모양이 변하는데,
		//				simplify로 모양이 변형되기 전에 
		//				현 상황을 출력
		//				simplify : ±√-5 -> ±√5i (root 내부가 양수로 바뀜. 움수는 i가 생김. 양수는 아무것도 안변함)
		//		pre  : x^2 = -4
		//		post : x = ±√-4
		//				
		
		//{{Latex.2022.08.17
		let tex_str = '';
		//}}
		
		if( ! p['h'].sign ){	
			let act1 = 'x = ' + '\u{b1}' + '\u{221a}' + p['h'].get_val(6)  + ' :a1';  //rule.#6: 상수항 and 유일항 term
			this.debug_log( act1 );
			
			//{{Latex.2022.08.17
			tex_str = 'x = ' + ' \\pm ' + '\\sqrt{ ' + p['h'].get_Tex(6) + ' }'  ;  //rule.#6: 상수항 and 유일항 term
			this.history.push( {'step':30,'act':1,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17
		}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.2 :  Root에 변형이 불가한 경우 여기까지 하고 끝낸다
		//		pre  : x = ±√-2
		//		post : ∴ x = ±√2i
		//		
		//debugger;
		if( ! ir.reduce_flag ){
			let root_str  = '';
			let root_str2 = '';
			
			root_str  = '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str;
			root_str2 = '\\sqrt{ ' + ir.frac_in.get_Tex(6) + ' }' + ir.im_str ;
			
			//let act2 = '\u{2234}' + ' x = ' + '\u{b1}' + '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str + ' :a2';  //rule.#6: 상수항 and 유일항 term
			let act2 = '\u{2234}' + ' x = ' + '\u{b1}' + root_str + ' :a2';  //rule.#6: 상수항 and 유일항 term
			this.debug_log( act2 );
			
			//{{Latex.2022.08.17
			//tex_str = '\\therefore x = \\pm \\sqrt{ ' + ir.frac_in.get_Tex(6) + ' }' + ir.im_str ;
			tex_str = '\\therefore x = \\pm ' + root_str2;
			this.history.push( {'step':30,'act':2,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17
			
			ret['rc'] = 0;
			return ret;				
			
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.3 :  reduce(Root 변형 작업)전에  일단 한 번 프린트
		//					이 밑으로는 전부 reduce 대상임
		//		pre  : x = ±√-4
		//		post : x = ±√4i
		//				
		let act3 = 'x = ' + '\u{b1}' + '\u{221a}' + h_abs.get_val(6) + ir.im_str + ' :a3';  //#rule.#6: 상수항 and 유일항 term
		this.debug_log( act3 );

		//{{Latex.2022.08.17
		tex_str = 'x = \\pm \\sqrt{ ' + h_abs.get_Tex(6) + ' }' + ir.im_str;
		this.history.push( {'step':30,'act':3,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17

		////////////////////////////////////////////////////////////////
		//
		//	action.4 :  완전제곱꼴 결과 찍고 끝내기
		//		pre  : x = ±√4i
		//		post : ∴x = ±2i
		//			
		if( ir.perfect_square_flag ){
			//(오류) : x = +-1i로 나옴 
			//	허수이고, 값이 1이면 1을 생략해야함
			//{{
			let term_outside_root = ir.frac_out.get_val(6);   //#root 바깥쪽;	

			if ( ir.im_flag && ir.frac_out.int_flag && ir.frac_out.int_val == 1){
				term_outside_root = '';
			}
			//}}			
			
			//{{
			//let act4 = '\u{2234}' + 'x = ' + '\u{b1}' + ir.frac_out.get_val(6) + ir.im_str + ' :a4';  //rule.#6: 상수항 and 유일항 term
			//}}{{
			let act4 = '\u{2234}' + 'x = ' + '\u{b1}' + term_outside_root + ir.im_str + ' :a4';  //rule.#6: 상수항 and 유일항 term
			//}}
			this.debug_log( act4 );
			
			//{{Latex.2022.08.17
			let term_outside_root2 = ir.frac_out.get_Tex(6);   //#root 바깥쪽;	

			if ( ir.im_flag && ir.frac_out.int_flag && ir.frac_out.int_val == 1){	//-1일 때
				term_outside_root2 = '';
			}			
			
			tex_str = '\\therefore x = \\pm ' + term_outside_root2 + ir.im_str;
			this.history.push( {'step':30,'act':4,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17			
			
			ret['rc'] = 0;
			return ret;				
		}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.5 :  a root b 골로 찍고 끝내기
		//		pre  : x = ±√8i
		//		post : ∴x = ±2√2i
		//				
		let act5 = '\u{2234}' + 'x = ' + '\u{b1}' + ir.frac_out.get_val(6) + '\u{221a}' + ir.frac_in.get_val(6) + ir.im_str + ' :a5';
        //             let act3 = 'x = ' + '\u{b1}'                          + '\u{221a}' + h_abs.get_val(6) + ir.im_str + ' :a3';  //#rule.#6: 상수항 and 유일항 term
		this.debug_log( act5 );		
		
		//{{Latex.2022.08.17                                           
		tex_str = '\\therefore x = \\pm ' + ir.frac_out.get_Tex(6) + ' \\sqrt{ ' + ir.frac_in.get_Tex(6) + ' } ' + ir.im_str;
		this.history.push( {'step':30,'act':5,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17					
		
		////////////////////////////////////////////////////////////////
		ret['rc'] = 0;
		return ret;		
	}
	
	//[[step.40]  (x-g)^2 = h 형태
	step40(p){	
		let ret = {};
		
		this.debug_log('-------------------------------------------');
		this.debug_log('[step-40] (x-g)^2 = h (g,h!=0) ');
		////////////////////////////////////////////////////////////////
		//{{ debug 
		//p['g'].init( -2,1);
		//p['h'].init( -1,1);
		//}}
		////////////////////////////////////////////////////////////////
		let ir = new cIrrational( p['h'] );
		ir.simplify();
		
		let h_abs = new cFraction( p['h'].nu , p['h'].de );
		if( !h_abs.sign ){	//음수이면...
			h_abs.init( h_abs.nu * -1 , h_abs.de );
		}
		
		let neg_g = new cFraction( p['g'].nu*-1 , p['g'].de );

		////////////////////////////////////////////////////////////////
		//
		//	action.1 : 일단 한 번 찍는다.( ^2을 없앤 모양을 / g를 이항하기 전에 / 한 번 출력필요
		//		pre  : (x-2)^2 = -1
		//		post : x -2 = ±√-1
		//				
		let act1 = 
			'x ' + 
			p['g'].get_val(5) +  	//#rule.#5: 상수항
			' = ' +
			'\u{b1}' + '\u{221a}' +	//# +- root
			p['h'].get_val(6) + ' :a1';  	//#rule.#6: 상수항&유일항
		this.debug_log( act1 );		

		//{{Latex.2022.08.17                                           
		let tex_str = 
			'x ' + 
			p['g'].get_Tex(5) +  	//#rule.#5: 상수항
			' = ' +
			'\\pm ' + '\\sqrt{ ' + p['h'].get_Tex(6) + ' }';
			
		this.history.push( {'step':40,'act':1,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17					
			
		////////////////////////////////////////////////////////////////
		//
		//	action.2 : 허수는 한 번 찍는다
		//		pre  : x -2 = ±√-1
		//		post : x -2 = ±√1i
		//				
		if( !p['h'].sign ){
			let act2 = 
				'x ' + 
				p['g'].get_val(5) +   	//#rule.#5: 상수항
				' = ' + 
				'\u{b1}' + '\u{221a}' +	//# +- root
				h_abs.get_val(6) + 		//#rule.#6: 상수항&유일항
				ir.im_str + ' :a2';
			this.debug_log( act2 );		
			
			//{{Latex.2022.08.17                                           
			tex_str =
				'x ' + 
				p['g'].get_Tex(5) +   		//#rule.#5: 상수항
				' = ' + 
				'\\pm ' + '\\sqrt{ ' +		//# +- root
				h_abs.get_Tex(6) + ' }' + 	//#rule.#6: 상수항&유일항
				ir.im_str;
				
			this.history.push( {'step':40,'act':2,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17			
			
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.3 : reduce 불가 -> 종료 :x  = 2 ±√1) -> reduce 불가하지만 완전제곱꼴임(숫자1)
		//		pre  : x -2 = ±√7
		//		post : x  = 2 ±√7
		//						
		if( !ir.reduce_flag && ! ir.perfect_square_flag){
			let act3 = 
				'\u{2234}' + 
				'x ' + 
				' = ' + 
				neg_g.get_val(6) + ' ' +	//#rule.#6: 상수항&유일항
				'\u{b1}' + '\u{221a}' +		//# +- root
				h_abs.get_val(6) + 			//#rule.#6: 상수항&유일항
				ir.im_str + ' :a3';
			this.debug_log( act3 );	

			//{{Latex.2022.08.17                                           
			tex_str =
				'\\therefore ' + 
				'x ' + 
				' = ' + 
				neg_g.get_Tex(6) + ' ' +	//#rule.#6: 상수항&유일항
				'\\pm \\sqrt{ ' + h_abs.get_Tex(6) + ' }' +		//# +- root , //#rule.#6: 상수항&유일항
				ir.im_str;
				
			this.history.push( {'step':40,'act':3,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17	

			ret['rc'] = 0;
			return ret;			
			
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.4 : reduce 가능. 완전제곱꼴 아님,종료조건
		//		pre  : x -2 = ±√8i
		//		post : x -2 = ±2√2i   :a4
		//			     x  = 2 ±2√2i :a5			
		if( !ir.perfect_square_flag ){	
			let act4  = 				// root reduce 
				'x ' +
				p['g'].get_val(5) +   //#rule.#5: 상수항
				' = ' + 
				'\u{b1}' + 	//#+-
				ir.frac_out.get_val(6) +    //#root 바깥쪽
				'\u{221a}' + 				// # root 
				ir.frac_in.get_val(6) + 	// #rule.#6: 상수항&유일항
				ir.im_str + ' :a4';
			this.debug_log( act4 );	
			
			//{{Latex.2022.08.17                                           
			tex_str =
				'x ' +
				p['g'].get_Tex(5) +   		//#rule.#5: 상수항
				' = ' + 
				'\\pm ' + 					//#+-
				ir.frac_out.get_Tex(6) +    //#root 바깥쪽
				' \\sqrt{ ' + 				// # root 
				ir.frac_in.get_Tex(6) + 	// #rule.#6: 상수항&유일항
				' } ' +
				ir.im_str;
				
			this.history.push( {'step':40,'act':4,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17			
			
			let act5  = 
				'\u{2234}' + 
				'x '  + 
				' = ' +
				neg_g.get_val(6) + ' '  + //#rule.#6: 상수항&유일항
				'\u{b1}' + 					// #+-
				ir.frac_out.get_val(6) + 	// #root 바깥쪽
				'\u{221a}' +  				//# root 
				ir.frac_in.get_val(6) + 	//#rule.#6: 상수항&유일항
				ir.im_str + ' :a5';			
			this.debug_log( act5 );
			
			//{{Latex.2022.08.17                                           
			tex_str =
				'\\therefore ' + 
				'x '  + 
				' = ' +
				neg_g.get_Tex(6) + ' '  + //#rule.#6: 상수항&유일항
				'\\pm ' + 					// #+-
				ir.frac_out.get_Tex(6) + 	// #root 바깥쪽
				' \\sqrt{ ' +  				//# root 
				ir.frac_in.get_Tex(6) + 	//#rule.#6: 상수항&유일항
				' } ' +
				ir.im_str;	
				
			this.history.push( {'step':40,'act':5,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17						
			
			ret['rc'] = 0;
			return ret;					
			
		}
		
		////////////////////////////////////////////////////////////////
		//
		//	action.6 : 완전제곱꼴. 일단 한 번 찍는다.(root 표시 날리고)
		//		pre  : x -2 = ±√4 :a1
		//		post : x -2 = ±2  :a6
		//				
		
		
		//(오류) : x-2 = +-1i로 나옴 
		//	허수이고, 값이 1이면 1을 생략해야함
		//{{
		let term_outside_root = ir.frac_out.get_val(6);   //#root 바깥쪽;	
		//{{Latex.2022.08.17 
		let term_outside_root2 = ir.frac_out.get_Tex(6);   //#root 바깥쪽;	
		//}}Latex.2022.08.17
		
		if ( ir.im_flag && ir.frac_out.int_flag && ir.frac_out.int_val == 1){	//-1일 때
			term_outside_root = '';
			//{{Latex.2022.08.17 
			term_outside_root2 = '';
			//}}Latex.2022.08.17
		}
		//}}
		
		
		let act6  = 
			'x ' + 
			p['g'].get_val(5) +  //#rule.#5: 상수항
			' = ' + 
			'\u{b1}' + 	//#+-
			
			//{{
			//ir.frac_out.get_val(6) + //   #root 바깥쪽
			//}}{{
			term_outside_root + 	
			//}}
			
			ir.im_str + '  :a6';		
		
		this.debug_log( act6 );		
		
		//{{Latex.2022.08.17                                           
		tex_str =
			'x ' + 
			p['g'].get_Tex(5) +  //#rule.#5: 상수항
			' = ' + 
			'\\pm ' + 	//#+-
			term_outside_root2 + 	
			ir.im_str;
			
		this.history.push( {'step':40,'act':6,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17								
		
		////////////////////////////////////////////////////////////////
		//
		//	action.7 : 완전제곱꼴, 허수일 때, 종료조건
		//		pre  :  x -2 = ±2i :a6
		//		post : ∴ x  = 2 ±2i  :a7
		//				
		if( ! p['h'].sign ){
			let act7  = 
				'\u{2234}' + ' ' +
				'x '  + 
				' = ' + 
				neg_g.get_val(6) + ' ' + //#rule.#6: 상수항&유일항
				'\u{b1}' +  			 //#+-
				
				//{{
				//ir.frac_out.get_val(6) + //#root 바깥쪽
				//}}{{
				term_outside_root + 	
				//}}
				ir.im_str + '  :a7'
				
			this.debug_log( act7 );	
			
			//{{Latex.2022.08.17                                           
			tex_str =
				'\\therefore ' +
				'x '  + 
				' = ' + 
				neg_g.get_Tex(6) + ' ' + //#rule.#6: 상수항&유일항
				'\\pm ' +  			 //#+-
				term_outside_root2 + 	
				ir.im_str;
				
			this.history.push( {'step':40,'act':7,'expr':tex_str,'comment':''} );  		
			//}}Latex.2022.08.17			
			
			ret['rc'] = 0;
			return ret;				
		}
		////////////////////////////////////////////////////////////////
		//
		//	action.8 : 완전제곱꼴, 허수아닐 때, 종료조건
		//		pre  : x -2 = ±2     :a6 
		//		post :   x  = 2 ±2   :a8
		//	          ∴ x = 4 or 0  :a9
		let act8  = 
			'x '  +
			' = ' +
			neg_g.get_val(6) + ' ' + 	//#rule.#6: 상수항&유일항
			'\u{b1}' + 					//+-
			ir.frac_out.get_val(6) + '  :a8';   //#root 바깥쪽
		this.debug_log( act8 );	
		
		//{{Latex.2022.08.17                                           
		tex_str =
			'x '  +
			' = ' +
			neg_g.get_Tex(6) + ' ' + 	//#rule.#6: 상수항&유일항
			'\\pm ' + 					//+-
			ir.frac_out.get_Tex(6);   	//#root 바깥쪽
			
		this.history.push( {'step':40,'act':8,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17					
		
		//act.9
		let sol1 = new cFraction( ir.frac_out.nu, ir.frac_out.de );
		sol1.add_single( neg_g );

		let sol2 = new cFraction( ir.frac_out.nu, ir.frac_out.de );
		sol2.multiply_negative1();
		sol2.add_single( neg_g );
 		
		let act9 = 
			'\u{2234}' + ' ' + 
			'x = ' +
			sol1.get_val(6) +
			' or ' +
			sol2.get_val(6) + '  :a9';
		this.debug_log( act9 );		
		
		//{{Latex.2022.08.17                                           
		tex_str =
			'\\therefore ' + 
			'x = ' +
			sol1.get_Tex(6) +
			'\\;\\; or \\;\\; ' +
			sol2.get_Tex(6);
			
		this.history.push( {'step':40,'act':9,'expr':tex_str,'comment':''} );  		
		//}}Latex.2022.08.17			
		
		////////////////////////////////////////////////////////////////
		
		ret['rc'] = 0;
		return ret;				
	}
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	debug_log(p_msg){
		//(VALD) debug mode에서만 동장
		if( !this.debug_flag ){	
			return;
		}
		
		console.log( p_msg );
	}

}


























