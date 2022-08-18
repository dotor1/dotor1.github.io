
////////////////////////////////////////////////////////
class cCopyright{
	oSCR = null;
	
	seRootLayer = null;
	seL1Layer_transport = null;
	seL2Layer_scale = null;
	seL3Layer_BBox = null;
	seL4Layer_copyrightBox = null;
	seL4Layer_DebugBox     = null;
	seL4Layer_WrapperBox   = null;
	
	copyright_text_set = [ 'DotoryLab','Dotory' ];
	//copyright_text_set = [ 'DotoryLab' ];

	seCopyrightSet = [];
	seDebugBoxSet  = [];
	
	width  = 0;
	height = 0;
	
	space_btw_lines = 10;	//const - note.#871
	margin = 10;			//const - note.#871 
	
	constructor( p_oSCR ){
		this.oSCR = p_oSCR;
		
		//this.build_parts_dataset();
		this.init();
		//this.update_logo();
		
	}
	
	init(){
		this.seRootLayer = this.oSCR.get_layer('Copyright');
		
		this.seL1Layer_transport = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL1Layer_transport.setAttribute('id', this.seRootLayer.id + '_transport');
		this.seL1Layer_transport.setAttribute('transform', 'translate(100,-300)');
		this.seRootLayer.appendChild( this.seL1Layer_transport);

		this.seL2Layer_scale = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL2Layer_scale.setAttribute('id', this.seRootLayer.id + '_scale');
		this.seL2Layer_scale.setAttribute('transform', 'scale(1)');
		this.seL1Layer_transport.appendChild( this.seL2Layer_scale);		

		this.seL3Layer_BBox = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL3Layer_BBox.setAttribute('id', this.seRootLayer.id + '_BBox');
		this.seL2Layer_scale.appendChild( this.seL3Layer_BBox);		
		
		//각 텍스트들의 부모
		this.seL4Layer_CopyrightBox = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL4Layer_CopyrightBox.setAttribute('class','c_copyright_debugbox');
		this.seL4Layer_CopyrightBox.setAttribute('id', this.seRootLayer.id + '_CopyrightBox');
		this.seL3Layer_BBox.appendChild( this.seL4Layer_CopyrightBox);				
		
		//각 텍스트 한줄씩에 대한 아웃라인 박스의 부모 
		this.seL4Layer_DebugBox = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL4Layer_DebugBox.setAttribute('id', this.seRootLayer.id + '_DebugBox');
		this.seL3Layer_BBox.appendChild( this.seL4Layer_DebugBox);				
		
		//여러줄의 텍스트 전체에 대한 아웃라인 박스
		this.seL4Layer_WrapperBox  = document.createElementNS(this.oSCR.const['SVG_NS'],'rect');
		this.seL4Layer_WrapperBox.setAttribute('id', this.seRootLayer.id + '_Wrapperbox');
		this.seL4Layer_WrapperBox.setAttribute('class', 'c_copyright_debugbox' );
		this.seL3Layer_BBox.appendChild( this.seL4Layer_WrapperBox );				
				
		//////////////////////////////////////////////////////////////////////////////////
		
		let y_vbc  = 0;
		
		for (let i = 0; i < this.copyright_text_set.length; i++) {
			let txt = this.copyright_text_set[i];
			
			let seTxt = document.createElementNS(this.oSCR.const['SVG_NS'],'text');
			seTxt.setAttribute('transform', 'translate(0,' + String(y_vbc) + ')');
			seTxt.setAttribute('class','c_copyright');
			seTxt.textContent = txt;
			this.seL4Layer_CopyrightBox.appendChild( seTxt);
			this.seCopyrightSet.push( seTxt );
			
			let info = seTxt.getBBox();
			console.log( info );
			//debugger;
			
			let seRect = document.createElementNS(this.oSCR.const['SVG_NS'],'rect');
			seRect.setAttribute('class','c_copyright_debugbox');
			seRect.setAttribute('transform', 'translate(0,' + String(y_vbc) + ')');
			seRect.setAttribute('x',  String(info.x ) );
			seRect.setAttribute('y',  String(info.y ) );
			seRect.setAttribute('width',  String(info.width ) );
			seRect.setAttribute('height', String(info.height) );			
			this.seL4Layer_DebugBox.appendChild( seRect );
			this.seDebugBoxSet.push( seRect );
			
			y_vbc += info.height + this.space_btw_lines ;
			
			//console.log(txt);
		}		
		
		let info = this.seL3Layer_BBox.getBBox();

		this.width  = info.width;
		this.height = info.height;
		
		this.seL4Layer_WrapperBox.setAttribute('x',  String(info.x ) );
		this.seL4Layer_WrapperBox.setAttribute('y',  String(info.y ) );
		this.seL4Layer_WrapperBox.setAttribute('width',  String(info.width ) );
		this.seL4Layer_WrapperBox.setAttribute('height', String(info.height) );		
		
		//debugger;
		
		//////////////////////////////////////////////////////////////////////


			
			////<path id='arc2' class='bg_red'></path>	
			//this.seParts[part_key] = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
			//this.seParts[part_key].setAttribute('id' , this.seRootLayer.id + '__' + part_key );
			////this.seParts[part_key].setAttribute('visibility','visible');
			//this.seParts[part_key].setAttribute('d' , bezier_str );
			////this.seParts[part_key].setAttribute('class' , 'c_bezier' );	//우선순위 : 여기에 지정한 클래스 css > 바로밑에 stroke
			//this.seParts[part_key].setAttribute('stroke' , part_val.stroke );
			//this.seParts[part_key].setAttribute('stroke-width' , part_val.stroke_width );
			//this.seParts[part_key].setAttribute('stroke-dasharray' , 'none' );
			//this.seParts[part_key].setAttribute('fill' , part_val.fill );
			//
			//
			//this.seL2Layer_scale.appendChild( this.seParts[part_key] );				
			
		
	}
	
	cb_screenshot( p_ctx , p_imgcs_scale){
		let img_width  = this.oSCR.oConfig.scr_width  * p_imgcs_scale;
		let img_height = this.oSCR.oConfig.scr_height * p_imgcs_scale;		
		
		//this.width는 scale이 1일때의 너비
		let trans_x = img_width  - this.width*p_imgcs_scale  - this.margin*p_imgcs_scale;
		let trans_y = img_height - this.height*p_imgcs_scale - this.margin*p_imgcs_scale;
		//debugger;
		
		let font_family = 'consolas'; //this.oSCR.get_style('.c_copyright','font-family');	//선 두께	
		let font_size = Number(this.oSCR.get_style('.c_copyright','font-size').replace('px','') );	//15px에서 px날리기
		
		p_ctx.font = String( font_size * p_imgcs_scale ) + 'px ' + font_family;
		p_ctx.textAlign    = 'start';
		p_ctx.textBaseline = 'top'; 
		p_ctx.fillStyle = this.oSCR.get_style('.c_copyright','fill');	
		
		
		
		for (let i = 0; i < this.copyright_text_set.length; i++) {
			let txt = this.copyright_text_set[i];
			console.log( txt );
			
			p_ctx.fillText( txt , trans_x , trans_y );			
			trans_y += p_imgcs_scale * (this.margin + this.space_btw_lines);
			
		}
		
		
		//debugger;
		
	}
	
	
	//note.#871
	update_scale(){
		
		let scale = this.oSCR.oConfig.platform_ratio*this.oSCR.vbcs_scale ;	
		
		this.seL2Layer_scale.setAttribute('transform','scale(' + String( scale ) + ')' );		
	}
	
	//note.#871
	update_position(){
		//return;
		
		let x_vbcs = this.oSCR.vbcs_x_max - this.width*this.oSCR.vbcs_scale  - this.margin*this.oSCR.vbcs_scale;
		let y_vbcs = this.oSCR.vbcs_y_max - this.height*this.oSCR.vbcs_scale - this.margin*this.oSCR.vbcs_scale;
		
		this.seL1Layer_transport.setAttribute('transform','translate(' + String(x_vbcs) +  ',' + String(y_vbcs) + ')' )					
	}
	

}
