////////////////////////////////////////////////////////
//                                                    //
//		무리수                                        //
//                                                    //
class cIrrational{
	reduce_flag         = false;	//루트 벗기기 작업이 가능
	float_flag          = false; 	//실수값(분수 계산없이 루트 벗긴 값이다.)
	perfect_square_flag = false;	//완전제곱형태
	im_flag				= false; 	//허수인지 여부
	im_str				= '';
	
	frac_in  = null;	//
	frac_out = null;	//a root b ->  여기서 a
	
	constructor(p_fraction){
		this.init( p_fraction);
	}
	
	init( p_frac ){
		this.frac_in  = new cFraction( p_frac.nu , p_frac.de);
		this.frac_out = new cFraction( 1 , 1 );	//일단 이걸로 만듬: a root b ->  여기서 a
	}
	
	simplify(){
		//0 체크
		if( this.frac_in.isZero ){
			this.reduce_flag = true;	//입력값에 대한 변형이 있으면 True -> Root 벗겨짐
			this.perfect_square_flag = true;
			return;
		}
		
		//허수체크
		let upnu = this.frac_in.nu;
		let dnde = this.frac_in.de;
		if( !this.frac_in.sign ){	//음수이면...
			this.im_flag = true;	//Root기호 밖으로 튀나가는 것도 없고, Root 기호가 없어지지도 않아서, proc_flag는 살려둔다.
			this.frac_in.init( upnu*-1 , dnde);	//이제부터 frac_in은 무조건 양수, 부호가 있는지는 im_flag로 봐야함
			this.im_str = 'i';
		}
		
		//실수로 된 것들은 루트벗기기 작업이 안되니까....
		if( !this.frac_in.nu_int_flag || !this.frac_in.de_int_flag){
			upnu = this.frac_in.nu / this.frac_in.de;
			this.frac_in.init( 1,1 );
			this.frac_out.init( Math.sqrt( upnu ) , 1 );
            this.reduce_flag = false;
            this.perfect_square_flag = false;
			return;
		}
		
		//분자에 대해서 x^2 * a 꼴이 있는지 확인한다.x가 존재하면 root밖으로 빼야함
		let ret1 = this.check_if_reduce( this.frac_in.nu);
		//ret1 : vald_nu,outt,inn
		let vald_nu = ret1.ret;
		let outt    = ret1.ret_out;
		let inn     = ret1.ret_in;
		
		if( vald_nu ){
			this.frac_out.init( this.frac_out.nu * outt , this.frac_out.de );
			this.frac_in.init( inn, this.frac_in.de);
			this.reduce_flag = true;
		}
		

		let ret2 = this.check_if_reduce(this.frac_in.de);
		let vald_de = ret2.ret;
		outt        = ret2.ret_out;
		inn         = ret2.ret_in;
		
        if( vald_de ){
            this.frac_out.init( this.frac_out.nu , this.frac_out.de * outt )
            this.frac_in.init( this.frac_in.nu, inn )
            this.reduce_flag = true;
		}

		//debugger;
		if( this.frac_in.isOne ){	//if frac_in == 1, root 내부는 1 or -1
			this.perfect_square_flag = true;
			this.reduce_flag = true;
		}
		
	}//simplify
	
	//root 변형이 가능한지 조사
	check_if_reduce(p_num){
		let ret = false;
		let ret_out = 1;
		let ret_in = 1;
		
		//정수에 대해서만...
		if( !scUtil.isInt(p_num)){
			return {
				ret : ret,
				ret_out : ret_out,
				ret_in : ret_in
			}
		}
		
		let val = Number( p_num );
		
		//제곱근 값을 일단 확인
		let squareroot = Math.sqrt( val );
		
		//여기의 실수 최대값을 뽑아낸다.
		let squareroot_int = Math.floor( squareroot );
		
		for(let i=squareroot_int;i>1;i--){
			let rng_pow = Math.pow(i,2);
			
			let tmp = val / rng_pow;
			
			if( scUtil.isInt(tmp)){
				ret     = true;
				ret_out	= Math.sqrt( rng_pow );		
				ret_in  = tmp;
				break;
			}
		}
		
		return {
			ret : ret,
			ret_out : ret_out,
			ret_in : ret_in
		}
		
		//debugger;
	}
	
}

