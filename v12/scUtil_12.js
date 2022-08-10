//사용됨
//function isInt(n){
//    return Number(n) === n && n % 1 === 0;
//}
//
////미사용이지만 라이러리성격
//function isFloat(n){
//    return Number(n) === n && n % 1 !== 0;
//}

//static class - oSCR에서 사용됨 
class scUtil{
	//static mouse_wheel_btn = 1;	//static class test
	
	//점검완료
	static isFloat(n){
		return Number(n) === n && n % 1 !== 0;
	}	
	
	//점검완료
	static isInt(n){
		return Number(n) === n && n % 1 === 0;
	}
	
	//점검완료
	static number_for_display(p_num){	//p_num = 3.141592
		
		//if( isInt(p_num) ){
		if( this.isInt(p_num) ){
			//console.log('정수입니다.');
			return p_num;
		}
		
		//console.log('정수 no no no');
		
		let num = p_num;	//num = 3.142, p_num = 3.141592
		
		let int_num = parseInt(num);	//int_num = 3, num = 3.142
		//console.log('정수 : ',int_num);
		
		let str_int = int_num.toString();	//str_int = "3", int_num = 3
		//console.log('str_int : ', str_int);
		
		//let str_int_cnt = str_int.length;
		//console.log('str_int_cnt : ' , str_int_cnt);
		
		let str_num = num.toString();	//str_num = "3.141592", num = 3.142
		//console.log( 'str_num : ', str_num );
		
		//let str_sosubu = str_num.substring(0,str_num.length);
		let str_sosubu = str_num.substring(str_int.length+1,str_num.length);
		//str_sosubu = "141592", str_num = "3.141592", str_int = "3"
		//console.log( 'str_sosubu : ', str_sosubu);
		
		if(str_sosubu.length > 3){
			num = Math.round((num + Number.EPSILON) * 1000) / 1000;	//num = 3.142
			//console.log('변형 : ', num);
		}
		
		return num;

	}	
	//
	
	//점검완료
	//html element id와 값을 입력받아, innerHTML을 변경
	static update_element_innerHTML(p_id,p_text){
		let elmt = document.getElementById(p_id);
		
		if( elmt != null){	
			document.getElementById(p_id).innerHTML = p_text;
		}
		else{
			debugger;	//p_id로 검색되는 엘리먼트가 없는 경우
		}	
	}
	
	//{{2022.08.07 dictionary_search_key_by_value
	static dictionary_search_key_by_value(p_obj, p_value) {
		return Object.keys(p_obj).find(key => p_obj[key] === p_value);
	}	
	
	
}