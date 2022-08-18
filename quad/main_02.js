let g_quad = null;

function main(){
	
	//{{debug 
	g_quad = new cQuadEq();
	//}}{{
	//test_tex();	//텍스 테스트
	//}}
	
}

function el_click(){
	let coef_a = document.getElementById('my_a').value;
	let coef_b = document.getElementById('my_b').value;
	let coef_c = document.getElementById('my_c').value;
	
	g_quad = new cQuadEq();
	if( !g_quad.init( coef_a, coef_b, coef_c) ){
		console.log( '입력값 오류' );
	}
	
}

function test_tex(){
	
	
	//let t = new cFraction(2,1);		//	test.#1. 2
	//let t = new cFraction(-2,1);		//	test.#2. 2
	//let t = new cFraction(1,2);		//	test.#3. 1/2
	let t = new cFraction(-1,2);		//	test.#4. -1/2
	let tex_str = t.get_Tex(3,true);

	
	
	
	////////////////////////////////////////////////////////////////////
	
	//let str3 = '\\begin{equation}\\displaylines{' + str + '\\\\' + str + '} \\end{equation}';	//백슬러시 이스케이프
	
	//	\begin{equation}
	//	\displaylines{ 
	//		x = \color{average} \frac{-b \pm \sqrt{b^2-4ac}}{2a} \\ 
	//		x = \mathcolorbox{yellow}{ \frac{-b \pm \sqrt{b^2-4ac}}{2a} }  \\ 
	//		x = \frac{-b \pm \sqrt{b^2-4ac}}{\mathcolorbox{yellow}{2a}} \\
	//		x = \frac{-b \pm \sqrt{ \mathcolorbox{yellow}{b^2-4ac}}}{2a} \\
	//		x = \frac{-b \mathcolorbox{yellow}{\pm} \sqrt{b^2-4ac}}{2a} \\
	//		x = \frac{ \mathcolorbox{yellow}{-b \pm \sqrt{b^2-4ac}}}{2a} \\
	//		x = \colorbox{yellow}{$\displaystyle \frac{-b \pm \sqrt{b^2-4ac}}{2a} $} \\
	//		x = \frac{-b \pm \sqrt{b^2-4ac}}{2a} \\
	//		x = \frac{-b \pm \sqrt{b^2-4ac}}{2a} \\
	//		한글 = 한글 \label{eq:sample}
	//	}
	//	\end{equation}	
	
	let tex_line = 
		'\\begin{equation}' + 
			'\\displaylines{' +
				tex_str + 
			'}' +
		'\\end{equation}';
		
	//debugger;
	scUtil.update_element_innerHTML('mysol',tex_line);
	MathJax.typeset();
	
	
}

