////////////////////////////////////////////////////////
//                                                    //
//		분수                                          //
//                                                    //
class cFraction{
	nu   = 0;	//분자
	de   = 0;	//분모
	
	//부가정보
	sign = true;	//부호
	sign_str = '';
	
	frac_shape = true;	//분수형태인가?(분자가 1이 아닐 때)

	int_flag = false;
	int_val  = 0;
	expr = '';

	isZero = false;
	isOne = false;
	isNegativeOne = false;

	nu_init = 0;			//점검이 완료된 값
	de_init = 0;
	
	gcd	= 0;
							//분모
	de_int_flag = false;	//분모가 정수인가?
	de_int = 0;				//분모가 정수일 때 정수값
	de_expr = '';			//분모의 표현식(string)
	
	
	nu_abs = 0;	//nu의 절대값()
	
	nu_int_flag = false;
	nu_int = 0;
	nu_int_abs = 0;
	nu_expr = '';
	nu_expr_abs = '';

	//{{2022.08.17.Latex highlgiht
	highlight_now = 0;
	//}}
	
//		p_nu : 분자
	//		p_de : 분모
	constructor(p_nu, p_de){
		this.init( p_nu,p_de );
		
		this.nu_init = this.nu;
		this.de_init = this.de;
	}
	
	init(p_nu,p_de){
		let upnu = p_nu;	//분자(위에 있는 분자)
		let dnde = p_de;	//분자(아래 있는 분자)
		
		//sign : 음수일 때, 분자는 음수, 분모는 양수
		//분자 : {음수,양수}
		//분자 : {음수,양수}
		if( (upnu * dnde)<0 ){
			this.sign = false;
			
			this.nu_abs = Math.abs( upnu );
			
			this.nu = this.nu_abs * -1;
			this.de = Math.abs( dnde );
			
		}
		else{
			this.sign = true;
			
			this.nu_abs = Math.abs( upnu );
			
			this.nu = this.nu_abs     ;
			this.de = Math.abs( dnde );
		}
		
		//
		this.generate_profile();
		
		this.expr = this.val();
	}
	
	val(){
		let t_sign = '';
		if( this.sign == false ){
			t_sign = '-';
		}
		
		//표현 - 분수꼴, 정수꼴 
		let t = '';
		
		if( this.frac_shape ){
			t = t_sign + this.nu_expr_abs + '/' + this.de_expr;
		}
		else{
			t = this.nu_expr;
		}
		
		return t;
	}
	
	//약분이 가능한가?
	can_simplify(){
		//(VALD) 약분 불가 -> 약분은 정수에 대해서만 수행
		if( !(this.de_int_flag && this.nu_int_flag)){
			return false;
		}
		
		//(VALD) 분수꼴로 표현이 안됨 -> 대상아님
		if( !this.frac_shape ){
			return false;
		}
		
		//(VALD) 약분 불가 -> 분자가 0
		if( this.int_flag && this.int_val == 0 ){
			return false;
		}
		
		////////////////////////////////////////////////////////////////
		let gcd = this.mygcd( this.nu_int_abs , this.de_int);
		
		if( gcd > 1 ){
			return true;
		}
		
		return false;
	}
	
	mygcd(p_a, p_b){
		while( p_b > 0 ){
			let r = p_a % p_b;
			p_a = p_b;
			p_b = r;
		}
		
		return p_a;
		
	}
	
	//{{
    //// Find GCD of given two given number
	////https://kalkicode.com/extended-euclidean-algorithm-implementation-in-js
    //extended_gcd(a, b)
    //{
    //    // Declare some auxiliary variable
    //    var s = 0;
    //    var r = b;
    //    var old_s = 1;
    //    var old_r = a;
    //    var temp = 0;
    //    var bezout_t = 0;
    //    // When r not equal to zero
    //    while (r != 0)
    //    {
    //        var quotient = parseInt(old_r / r);
    //        temp = r;
    //        r = old_r - quotient * r;
    //        old_r = temp;
    //        temp = s;
    //        s = old_s - quotient * s;
    //        old_s = temp;
    //    }
    //    if (b != 0)
    //    {
    //        bezout_t = parseInt((old_r - old_s * a) / b);
    //    }
    //    // Display given number
    //    console.log("\nGiven (a,b) : " + a + "," + b);
    //    // Displaying the value calculate result
    //    console.log("Bezout coefficients : " + old_s + "," + bezout_t);
    //    console.log("greatest common divisor : " + old_r);
    //}
	//}}
	
	//약분
	simplify2(){
		if( !this.can_simplify ){
			return;
		}
		
		let gcd = this.mygcd( this.nu_int_abs , this.de_int );
			
		if( gcd > 1){
			let upnu = this.nu / gcd;
			let dpde = this.de / gcd;
			
			this.init( upnu , dpde );
		}
			
		
	}
	

	//{{2022.08.17 : 분수의 LaTex
	//get_hightlight(){
	//	if( this.highlight_now == 0 ){
	//		return "\\myYellow";
	//	}
	//	else{
	//		return '\\myGreen';
	//	}
	//}
	//
	//next_hightlight(){
	//	this.highlgiht_now = (this.highlgiht_now+1) % 2;
	//}
		
	
	get_Tex( p_rule_no , p_highlight = '' ){
		const space = '\\;';
		
		let ret = 0;
		
		//rule.#0: 1st term/표현식
		if( p_rule_no == 0 ){
			ret = this.Tex_Val(0);	//양수:값only, 음수:값,부호
		}
		//rule.#1: 중간term/미지수 있음/1st position/앞 부화와 상관없은 표현식
		else if(p_rule_no == 1 ){
			ret = this.Tex_Val(2);	//양수:값only, 음수:값,부호,괄호
		}
		//rule.#2: term 내부에 낑겨 있음(미지수가 있을 때의 끼인항)
		else if(p_rule_no == 2 ){
			if( this.isOne ){
				ret = '';
			}
			else{
				//ret = '\u{B7}' + this.Tex_Val(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
				ret = '\\cdot ' + space + this.Tex_Val(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
			}
		}		
		//rule.#22: 끼인항(상수항) - 기본적으로 rule2와 같음. 다만 값에 대한 생략은 없음
		else if(p_rule_no == 22 ){
			//ret = '\u{B7}' + this.Tex_Val(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
			ret = '\\cdot ' + space + this.Tex_Val(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
		}			
		//rule.#3: 1st term & 1st position
		else if( p_rule_no == 3){
			if( this.isOne ){
				ret = '';
			}
			else if(this.isNegativeOne){
				ret = this.sign_str;
			}
			else{
				ret = this.Tex_Val(0);	//양수:값only, 음수:값,부호
			}
		}
		//rule.#4: 중간에 낑긴 term & 1st position
		else if(p_rule_no == 4){
			if( this.isOne || this.isNegativeOne ){
				ret = this.sign_str;
			}
			else{
				ret = this.Tex_Val(1);	//양수:값,부호, 음수:값,부호
			}		
		}
		//rule.#5: 상수항 term
		else if(p_rule_no == 5){
			if( this.isZero ){
				ret = '';
			}
			else{
				ret = this.Tex_Val(1);	//양수:값,부호, 음수:값,부호
			}		
		}
		//rule.#6: 상수항 and 유일항 term
		else if(p_rule_no == 6){
			ret = this.Tex_Val(0);	//양수:값only, 음수:값,부호
		}		
		//rule.#7: 제곱꼴룰
		else if(p_rule_no == 7){
			ret = this.Tex_Val(3);	//양수/일반:값only, 양수/분수:값/괄호, 음수(일반/분수):값,부호,괄호
		}			
		else{
			debugger;
		}
		
		//////////////////////////////////////
		
		if( ret != '' && p_highlight != '' ){
			ret = p_highlight + '{' + ret + '}';
		}
		
		return ret;		
		
	}
	//}}
	
	Tex_Val( p_expr_no ){
		let ret = '';
		
		////////////////////////////////////////////////////////////////
		//	양수: 값 only
		//	음수: 값,부호
		if( p_expr_no == 0){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = '\\frac{' + this.nu_expr_abs + '}{' + this.de_expr + '}' ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호
			else{
				//분수표현
				if( this.frac_shape ){
					ret ='- \\frac{' + this.nu_expr_abs + '}{' + this.de_expr + '}' ;
				}
				//일반표현(비분수표현)
				else{
					ret = '-' + this.nu_expr_abs;
				}
			}
		}
		////////////////////////////////////////////////////////////////
		//	양수: 값,부호
		//	음수: 값,부호
		else if( p_expr_no == 1 ){
			//분수표현
			if( this.frac_shape ){
				ret = this.sign_str + '\\frac{' + this.nu_expr_abs + '}{' + this.de_expr + '}' ;
			}
			//일반표현(비분수표현)
			else{
				ret = this.sign_str + this.nu_expr_abs;
			}			
		}
		////////////////////////////////////////////////////////////////
		//	양수: 값 only
		//	음수: 값,부호,괄호
		else if( p_expr_no == 2){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = '\\frac{' + this.nu_expr_abs + '}{' + this.de_expr + '}' ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호,괄호
			else{
				//분수표현
				if( this.frac_shape ){
					ret = '( ' + this.sign_str + ' \\frac{ ' + this.nu_expr_abs + ' }{ ' + this.de_expr + ' } )';
				}
				//일반표현(비분수표현)
				else{
					ret = '(' + this.sign_str + this.nu_expr_abs + ')';
				}
			}
		}	
		////////////////////////////////////////////////////////////////
		//	양수/분수: 값,괄호
		//	양수/일반: 값 only
		//	음수/분수: 값,부호,괄호
		//	음수/일반: 값,부호,괄호
		else if( p_expr_no == 3){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = '(' + ' \\frac{' + this.nu_expr_abs + '}{' + this.de_expr + '} ' + ')' ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호,괄호
			else{
				//분수표현
				if( this.frac_shape ){
					ret = '( ' + this.sign_str + ' \\frac{ ' + this.nu_expr_abs + ' }{ ' + this.de_expr + ' } ' + ')';
				}
				//일반표현(비분수표현)
				else{
					ret = '(' + this.sign_str + this.nu_expr_abs + ')';
				}
			}
		}		
		///////////////////////
		return ret;
		
	}	
	
	get_val( p_rule ){
		let ret = '';
		
		//rule.#0: 1st term/표현식
		if( p_rule == 0 ){
			ret = this.val_if2(0);	//양수:값only, 음수:값,부호
		}
		//rule.#1: 중간term/미지수 있음/1st position/앞 부화와 상관없은 표현식
		else if(p_rule == 1 ){
			ret = this.val_if2(2);	//양수:값only, 음수:값,부호,괄호
		}
		//rule.#2: term 내부에 낑겨 있음(미지수가 있을 때의 끼인항)
		else if(p_rule == 2 ){
			if( this.isOne ){
				ret = '';
			}
			else{
				ret = '\u{B7}' + this.val_if2(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
			}
		}
		//rule.#22: 끼인항(상수항) - 기본적으로 rule2와 같음. 다만 값에 대한 생략은 없음
		else if(p_rule == 22 ){
			ret = '\u{B7}' + this.val_if2(2);	//양수:값only, 음수:값,부호,괄호  , 젤 앞에 ceter dot
		}		
		//rule.#3: 1st term & 1st position
		else if(p_rule == 3){
			if( this.isOne ){
				ret = '';
			}
			else if(this.isNegativeOne){
				ret = this.sign_str;
			}
			else{
				ret = this.val_if2(0);	//양수:값only, 음수:값,부호
			}
		}
		//rule.#4: 중간에 낑긴 term & 1st position
		else if(p_rule == 4){
			if( this.isOne || this.isNegativeOne ){
				ret = this.sign_str;
			}
			else{
				ret = this.val_if2(1);	//양수:값,부호, 음수:값,부호
			}		
		}
		//rule.#5: 상수항 term
		else if(p_rule == 5){
			if( this.isZero ){
				ret = '';
			}
			else{
				ret = this.val_if2(1);	//양수:값,부호, 음수:값,부호
			}		
		}
		//rule.#6: 상수항 and 유일항 term
		else if(p_rule == 6){
			ret = this.val_if2(0);	//양수:값only, 음수:값,부호
		}		
		//rule.#7: 제곱꼴룰
		else if(p_rule == 7){
			ret = this.val_if2(3);	//양수/일반:값only, 양수/분수:값/괄호, 음수(일반/분수):값,부호,괄호
		}			
		else{
			debugger;
		}
		//////////////////////////////////////
		
		return ret;
	}
	
	//note.#902
	val_if2( p_condition ){
		let ret = '';
		
		////////////////////////////////////////////////////////////////
		//	양수: 값 only
		//	음수: 값,부호
		if( p_condition == 0){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = this.nu_expr_abs + '/' + this.de_expr ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호
			else{
				//분수표현
				if( this.frac_shape ){
					ret = this.sign_str + this.nu_expr_abs + '/' + this.de_expr;
				}
				//일반표현(비분수표현)
				else{
					ret = this.sign_str + this.nu_expr_abs;
				}
			}
		}
		////////////////////////////////////////////////////////////////
		//	양수: 값,부호
		//	음수: 값,부호
		else if( p_condition == 1 ){
			//분수표현
			if( this.frac_shape ){
				ret = this.sign_str + this.nu_expr_abs + '/' + this.de_expr;
			}
			//일반표현(비분수표현)
			else{
				ret = this.sign_str + this.nu_expr_abs;
			}			
		}
		////////////////////////////////////////////////////////////////
		//	양수: 값 only
		//	음수: 값,부호,괄호
		else if( p_condition == 2){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = this.nu_expr_abs + '/' + this.de_expr ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호,괄호
			else{
				//분수표현
				if( this.frac_shape ){
					ret = '(' + this.sign_str + this.nu_expr_abs + '/' + this.de_expr + ')';
				}
				//일반표현(비분수표현)
				else{
					ret = '(' + this.sign_str + this.nu_expr_abs + ')';
				}
			}
		}	
		////////////////////////////////////////////////////////////////
		//	양수/분수: 값,괄호
		//	양수/일반: 값 only
		//	음수/분수: 값,부호,괄호
		//	음수/일반: 값,부호,괄호
		else if( p_condition == 3){
			//양수: 값 only
			if( this.sign ){
				//분수표현
				if( this.frac_shape ){
					ret = '(' + this.nu_expr_abs + '/' + this.de_expr + ')' ;
				}
				//일반표현(비분수표현)
				else{
					ret = this.nu_expr_abs;
				}
			}
			//음수: 값,부호,괄호
			else{
				//분수표현
				if( this.frac_shape ){
					ret = '(' + this.sign_str + this.nu_expr_abs + '/' + this.de_expr + ')';
				}
				//일반표현(비분수표현)
				else{
					ret = '(' + this.sign_str + this.nu_expr_abs + ')';
				}
			}
		}		
		///////////////////////
		return ret;
		
	}
	
	//제곱하기
	pow2(){
		let upnu = this.nu * this.nu;
		let dpde = this.de * this.de;
		
		this.init( upnu , dpde );
		this.simplify2();
	}
	
	//-1곱하기
	multiply_negative1(){
		let upnu = this.nu * -1;
		let dpde = this.de;		
		
		this.init( upnu , dpde );
	}
	
	//분수더하기 
	add_single(p_b){
		let b = new cFraction( p_b.nu , p_b.de );

		let upnu = b.nu ;
		let dnde = b.de;			
		
		//분모가 실수이면...
		if( !b.de_int_flag ){
			b.init( upnu / dnde, 1);
		}
		
		///////////////////////////////////////

        let upnu_a = this.nu;
        let dnde_a = this.de;		
		
		//분모가 실수이면...
		if( !this.de_int_flag ){
			this.init( upnu_a / dnde_a, 1);
		}		

		let ret = this.my_lcm( this.de , p_b.de);
		
        upnu = (ret.ret_mul_A * this.nu) +  (ret.ret_mul_B * b.nu);
        dnde = ret.ret_lcm;        		
		
		this.init( upnu, dnde);
		this.simplify2();
		
		///////////////////////////////////////
		
	}
	
	//
	my_lcm( p_a, p_b){
		let gcd = this.mygcd(p_a,p_b);
		
		return {
			ret_lcm : Math.floor( (p_a*p_b)/gcd ) ,
			ret_mul_A: p_b/gcd,
			ret_mul_B: p_a/gcd
		}
	}
	
	//보조정보들
	generate_profile(){
		//1. 분모가 정수형태로 표현되는가?
		this.de_int_flag = scUtil.isInt( this.de );
		
		this.de_int = 0;		//default
		if( this.de_int_flag ){
			this.de_int = this.de;
		}
		
		this.de_expr = String( this.de );
		
		//2. 분자, 정수형태?
		this.nu_int_flag = scUtil.isInt( this.nu );
		this.nu_int     = 0;	//default
		this.nu_int_abs = 0;	//default
		
		if( this.nu_int_flag ){
			this.nu_int     = this.nu;
			this.nu_int_abs = Math.abs( this.nu );
		}
		
		this.nu_expr     = String( this.nu     );
		this.nu_expr_abs = String( this.nu_abs );

		//분자가 0일때 -> 분모를 1로 맞춘다.
		if( this.nu_int_flag && this.nu_int == 0 ){
			this.de = 1;
			this.de_int = 1;
			this.de_int_flag = true;
			this.de_expr = String( this.de);
		}
		
		//분수형태인가?
		this.frac_shape = true;
		if( this.de_int_flag && this.de_int == 1){
			this.frac_shape = false;
		}
		
		//정수인가?
		this.int_flag = false;
		this.int_val  = 0;
		
		if( !this.frac_shape ){	//분모가 정수1일 때
			if( this.nu_int_flag ){	//분자도 정수이면
				this.int_flag = true;
				this.int_val = this.nu_int;
			}
		}
		
		//부호 문자열
		if( this.sign ){
			this.sign_str = '+';
		}
		else{
			this.sign_str = '-';
		}
		
		//자주 사용되는 플래그
        this.isZero = false;
        this.isOne  = false;
        this.isNegativeOne = false;
		
		if( this.int_flag ){
			if( this.int_val == 0 ){
				this.isZero = true;
			}
			else if( this.int_val == 1 ){
				this.isOne = true;
			}
			else if( this.int_val == -1 ){
				this.isNegativeOne = true;
			}
		}
		
	}//generate_profile


			
	
}

