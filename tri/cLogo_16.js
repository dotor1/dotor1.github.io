////////////////////////////////////////////////////////
class cLogo{
	oSCR = null;

	objs = {};
	
	seBezier = null;
	seline1  = null;
	seline2  = null;  
	
	Points_scs = null;
	
	PartSet = null;
	
	seParts = {};
	
	seRootLayer = null;
	seL1Layer_transport = null;
	seL2Layer_scale = null;
	
	constructor( p_oSCR ){
		this.oSCR = p_oSCR;
		
		this.build_parts_dataset();
		this.init();
	}
	
	init(){
		this.seRootLayer = this.oSCR.get_layer('Logo');
		
		this.seL1Layer_transport = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL1Layer_transport.setAttribute('id', this.seRootLayer.id + '_transport');
		this.seRootLayer.appendChild( this.seL1Layer_transport);

		this.seL2Layer_scale = document.createElementNS(this.oSCR.const['SVG_NS'],'g');
		this.seL2Layer_scale.setAttribute('id', this.seRootLayer.id + '_scale');
		this.seL1Layer_transport.appendChild( this.seL2Layer_scale);		
		
		//////////////////////////////////////////////////////////////////////////////////
		
		//////////////////////////////////////////////////////////////////////
						
		for( const [part_key,part_val] of Object.entries( this.PartSet ) ){
			console.log( part_key, part_val );

			let bezier_str = '';
			
			for( const [point_key, point_val] of Object.entries( part_val.scs ) ){
				console.log( point_key, point_val );
				
				let EP_scs = {x:point_val['EP'].x , y:point_val['EP'].y };
				let EP_vbc = this.oSCR.scs2vbcs(  EP_scs.x , EP_scs.y );

				let C1_scs = {x:point_val['C1'].x , y:point_val['C1'].y };
				let C1_vbc = this.oSCR.scs2vbcs(  C1_scs.x , C1_scs.y ); 
				
				let C2_scs = {x:point_val['C2'].x , y:point_val['C2'].y };
				let C2_vbc = this.oSCR.scs2vbcs(  C2_scs.x , C2_scs.y ); 

				if( point_key == 'P1'){
					bezier_str = 'M' + String( EP_vbc.x ) + ',' + String( EP_vbc.y) ;
				}
				else{
					bezier_str = bezier_str + ' ' +
						'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
							  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
							  String( EP_vbc.x ) + ',' + String( EP_vbc.y );				
				}
				
				console.log( bezier_str );
				
			}

			
			//<path id='arc2' class='bg_red'></path>	
			this.seParts[part_key] = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
			this.seParts[part_key].setAttribute('id' , this.seRootLayer.id + '__' + part_key );
			//this.seParts[part_key].setAttribute('visibility','visible');
			this.seParts[part_key].setAttribute('d' , bezier_str );
			//this.seParts[part_key].setAttribute('class' , 'c_bezier' );	//우선순위 : 여기에 지정한 클래스 css > 바로밑에 stroke
			this.seParts[part_key].setAttribute('stroke' , part_val.stroke );
			this.seParts[part_key].setAttribute('stroke-width' , part_val.stroke_width );
			this.seParts[part_key].setAttribute('stroke-dasharray' , 'none' );
			this.seParts[part_key].setAttribute('fill' , part_val.fill );
			//this.seParts[part_key].setAttribute('style' , part_val.fill );
			this.seParts[part_key].style.opacity = '0.2';
			
			
			this.seL2Layer_scale.appendChild( this.seParts[part_key] );				
			
		}		
		
	}
	
	build_parts_dataset(){
	//register_parts(){
		//screen 좌표계 기준
		let Part1_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 94,y:390} },
			P2: { C1:{x: 75 ,y:390}, C2:{x: 20,y:308}, EP:{x: 29,y:272} },
			P3: { C1:{x: 30 ,y:191}, C2:{x: 50,y:151}, EP:{x: 69,y:122} },
			P4: { C1:{x:181 ,y:135}, C2:{x:254,y:165}, EP:{x:318,y:237} },
			P5: { C1:{x:281 ,y:334}, C2:{x:191,y:397}, EP:{x: 94,y:390} }
		};		
		
		//Part.#2
		let Part2_scs = {
			P1: { C1:{x: 30 ,y:191}, C2:{x: 50,y:151}, EP:{x: 69,y:122} },
			P2: { C1:{x:181 ,y:135}, C2:{x:254,y:165}, EP:{x:318,y:237} },
			P3: { C1:{x:361 ,y:241}, C2:{x:395,y:199}, EP:{x:356,y:142} },
			P4: { C1:{x:342 ,y:119}, C2:{x:309,y: 89}, EP:{x:276,y: 65} }, //연결부위
			P5: { C1:{x:253 ,y: 53}, C2:{x:249,y: 51}, EP:{x:229,y: 44} }, //연결부위
			P6: { C1:{x:165 ,y: 29}, C2:{x:119,y: 16}, EP:{x: 71,y: 51} }, 
			P7: { C1:{x: 57 ,y: 58}, C2:{x: 41,y:103}, EP:{x: 69,y:122} }
		};		
		
		//Part.#3
		let Part3_scs = {
			P1: { C1:{x:342 ,y:119}, C2:{x:309,y: 89}, EP:{x:276,y: 65} }, //연결부위
			P2: { C1:{x:253 ,y: 53}, C2:{x:249,y: 51}, EP:{x:229,y: 44} }, //연결부위
			P3: { C1:{x:244 ,y: 38}, C2:{x:232,y: 26}, EP:{x:281,y:  5} }, 
			P4: { C1:{x:294 ,y: 15}, C2:{x:306,y: 22}, EP:{x:303,y: 28} }, 
			P5: { C1:{x:284 ,y: 32}, C2:{x:277,y: 48}, EP:{x:276,y: 65} }, 
		};		

		//Part.#4
		let Part4_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:311,y: 93} }, 
			P2: { C1:{x:347 ,y:119}, C2:{x:342,y:128}, EP:{x:356,y:142} },
			P3: { C1:{x:382 ,y:187}, C2:{x:372,y:235}, EP:{x:318,y:237} },
			P4: { C1:{x:273 ,y:325}, C2:{x:224,y:395}, EP:{x: 94,y:390} },
			P5: { C1:{x:216 ,y:371}, C2:{x:247,y:286}, EP:{x:260,y:280} },
			P6: { C1:{x:295 ,y:239}, C2:{x:278,y:209}, EP:{x:234,y:180} },
			P7: { C1:{x:313 ,y:125}, C2:{x:296,y:137}, EP:{x:311,y: 93} }, 
		};
		
		//Part.#5
		let Part5_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 60,y:107} }, 
			P2: { C1:{x: 99 ,y: 56}, C2:{x:130,y: 49}, EP:{x:200,y: 39} }, 
			P3: { C1:{x:109 ,y: 63}, C2:{x:107,y: 62}, EP:{x: 60,y:107} }, 
		};		
		
		//Part.#6
		let Part6_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 93,y:121} }, 
			P2: { C1:{x:155 ,y: 81}, C2:{x:170,y: 65}, EP:{x:253,y: 60} }, 
			P3: { C1:{x:173 ,y: 77}, C2:{x:181,y: 71}, EP:{x: 93,y:121} }, 
		};	
		
		//Part.#7
		let Part7_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:156,y:132} }, 
			P2: { C1:{x:234 ,y: 87}, C2:{x:233,y: 94}, EP:{x:297,y: 90} }, 
			P3: { C1:{x:236 ,y: 94}, C2:{x:209,y:105}, EP:{x:156,y:132} }, 
		};	
		
		//Part.#8
		let Part8_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:207,y:150} }, 
			P2: { C1:{x:268 ,y:131}, C2:{x:301,y:127}, EP:{x:341,y:131} }, 
			P3: { C1:{x:273 ,y:131}, C2:{x:257,y:140}, EP:{x:207,y:150} }, 
		};

		//Part.#9
		let Part9_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:258,y:181} }, 
			P2: { C1:{x:300 ,y:172}, C2:{x:317,y:165}, EP:{x:361,y:177} }, 
			P3: { C1:{x:309 ,y:169}, C2:{x:314,y:175}, EP:{x:258,y:181} }, 
		};
		
		//Part.#10
		let Part10_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:301,y:214} }, 
			P2: { C1:{x:321 ,y:213}, C2:{x:330,y:213}, EP:{x:348,y:219} }, 
			P3: { C1:{x:330 ,y:216}, C2:{x:331,y:213}, EP:{x:301,y:214} }, 
		};
		
		//Part.#11
		let Part11_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 66,y: 66} }, 
			P2: { C1:{x: 81 ,y:104}, C2:{x: 90,y:108}, EP:{x:122,y:126} }, 
			P3: { C1:{x: 89 ,y:104}, C2:{x: 82,y: 93}, EP:{x: 66,y: 66} }, 
		};
		
		//Part.#12
		let Part12_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:187,y:143} }, 
			P2: { C1:{x:149 ,y:115}, C2:{x:132,y: 91}, EP:{x:108,y: 38} }, 
			P3: { C1:{x:123 ,y: 90}, C2:{x:143,y:117}, EP:{x:187,y:143} }, 
		};
		
		//Part.#13
		let Part13_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:256,y:180} }, 
			P2: { C1:{x:219 ,y:145}, C2:{x:198,y: 96}, EP:{x:190,y: 40} }, 
			P3: { C1:{x:196 ,y:101}, C2:{x:212,y:135}, EP:{x:256,y:180} }, 
		};
		
		//Part.#14
		let Part14_scs = {
			P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:299,y:211} }, 
			P2: { C1:{x:287 ,y:179}, C2:{x:272,y:131}, EP:{x:272,y: 69} }, 
			P3: { C1:{x:268 ,y:125}, C2:{x:279,y:167}, EP:{x:299,y:211} }, 
		};				
		
		//{{
		//this.PartSet = {
		//	Part1 : { scs:Part1_scs , stroke:'rgb(34,26,16)' , stroke_width:'2' , fill:'rgb(196,155,107)' },
		//	Part2 : { scs:Part2_scs , stroke:'rgb(34,26,16)' , stroke_width:'2' , fill:'rgb(151,109,54)'  },
		//	Part3 : { scs:Part3_scs , stroke:'rgb(34,26,16)' , stroke_width:'2' , fill:'rgb(151,109,54)'  },
		//	Part4 : { scs:Part4_scs , stroke:'none'          , stroke_width:'0' , fill:'rgba(0,0,0,0.3)'  },
		//	Part5 : { scs:Part5_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part6 : { scs:Part6_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part7 : { scs:Part7_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part8 : { scs:Part8_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part9 : { scs:Part9_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part10: { scs:Part10_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part11: { scs:Part11_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part12: { scs:Part12_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part13: { scs:Part13_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//	Part14: { scs:Part14_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(34,27,16)'    },
		//}
		//}}
		this.PartSet = {
			Part1 : { scs:Part1_scs , stroke:'rgb(101,96,90)', stroke_width:'2' , fill:'rgb(255,236,188)' ,fill2:'rgb(255,251,241)'  },
			Part2 : { scs:Part2_scs , stroke:'rgb(101,96,90)', stroke_width:'2' , fill:'rgb(232,190,135)' ,fill2:'rgb(250,241,230)'  },
			Part3 : { scs:Part3_scs , stroke:'rgb(101,96,90)', stroke_width:'2' , fill:'rgb(232,190,135)' ,fill2:'rgb(250,241,230)'  },
			Part4 : { scs:Part4_scs , stroke:'none'          , stroke_width:'0' , fill:'rgba(0,0,0,0.1)'  ,fill2:'rgba(185,185,185,0.1)'  },
			Part5 : { scs:Part5_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part6 : { scs:Part6_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part7 : { scs:Part7_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part8 : { scs:Part8_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part9 : { scs:Part9_scs , stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part10: { scs:Part10_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part11: { scs:Part11_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part12: { scs:Part12_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part13: { scs:Part13_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
			Part14: { scs:Part14_scs ,stroke:'none'          , stroke_width:'0' , fill:'rgb(115,108,97)'  ,fill2:'rgb(223,214,203)'  },
		}
		
	}	
	
	//note.#872
	cb_screenshot( p_ctx , p_imgcs_scale){
		////////////////////////////////////////////////////////////////
		let img_width  = this.oSCR.oConfig.scr_width  * p_imgcs_scale;
		let img_height = this.oSCR.oConfig.scr_height * p_imgcs_scale;
		
		let img_shorter = 0;	//width,height중에 짧은 쪽
		if( img_height > img_width ){
			img_shorter = img_width;
		}
		else{
			img_shorter = img_height;
		}
		//debugger;
		let logo_size = img_shorter / 2;
		
		let scaler    = logo_size/400;	//400: 도토리 원본 이미지 크기 400x400 
		
		let trans_x   = (img_width  - logo_size)/2;	//병진이동할 위치
		let trans_y   = (img_height - logo_size)/2;
		
		//debugg
		
		//선 스타일
		//p_ctx.lineWidth   = this.oSCR.oConfig.seStyle['line_arc_stroke_width'];	//선 두께	

		p_ctx.setLineDash([]);
		p_ctx.lineCap  = 'butt';				//선 end-point 모양(butt:직각)
		p_ctx.lineJoin = 'miter';				//선이 꺾일때의 모양				

		//p_ctx.beginPath();					//				
		//////////////////////////////////////////////////////////////////////
		//
		//
		//debugger;
		
		for( const [part_key,part_val] of Object.entries( this.PartSet ) ){
			p_ctx.strokeStyle =  part_val.stroke;	//this.oSCR.get_style('.bg_len_arc','stroke');	//선색			
			p_ctx.fillStyle   =  part_val.fill2;
			//debugger;
			//p_ctx.lineWidth = this.oSCR.get_style('.c_points','stroke-width');	//선 두께	
			
			
			
			
			p_ctx.beginPath();
			
			//this.seParts[part_key].setAttribute('stroke' , part_val.stroke );
			//this.seParts[part_key].setAttribute('stroke-width' , part_val.stroke_width );
			
			
			//console.log( part_key, part_val );

			let bezier_str = '';
			
			for( const [point_key, point_val] of Object.entries( part_val.scs ) ){
				//console.log( point_key, point_val );
				
				//let EP_scs  = {x:point_val['EP'].x , y:point_val['EP'].y };
				//let EP_scs  = {x:point_val['EP'].x * scaler + trans_x , y:point_val['EP'].y * scaler + trans_y };
				let EP_imgc   = {x:point_val['EP'].x * scaler + trans_x , y:point_val['EP'].y * scaler + trans_y };
				//let EP_imgc = this.oSCR.scs2imgcs(  EP_scs.x , EP_scs.y , p_imgcs_scale );

				//let C1_scs  = {x:point_val['C1'].x , y:point_val['C1'].y };
				//let C1_scs  = {x:point_val['C1'].x * scaler + trans_x , y:point_val['C1'].y * scaler + trans_y };
				let C1_imgc   = {x:point_val['C1'].x * scaler + trans_x , y:point_val['C1'].y * scaler + trans_y };
				//let C1_imgc = this.oSCR.scs2imgcs(  C1_scs.x , C1_scs.y , p_imgcs_scale ); 
				
				//let C2_scs  = {x:point_val['C2'].x , y:point_val['C2'].y };
				//let C2_scs  = {x:point_val['C2'].x * scaler + trans_x , y:point_val['C2'].y * scaler + trans_y };
				let C2_imgc   = {x:point_val['C2'].x * scaler + trans_x , y:point_val['C2'].y * scaler + trans_y };
				//let C2_imgc = this.oSCR.scs2imgcs(  C2_scs.x , C2_scs.y , p_imgcs_scale ); 

				if( point_key == 'P1'){
					//bezier_str = 'M' + String( EP_vbc.x ) + ',' + String( EP_vbc.y) ;
					p_ctx.moveTo(EP_imgc.x, EP_imgc.y);					//시작점
				}
				else{
					//bezier_str = bezier_str + ' ' +
					//	'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
					//		  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
					//		  String( EP_vbc.x ) + ',' + String( EP_vbc.y );				
					p_ctx.bezierCurveTo(C1_imgc.x, C1_imgc.y, C2_imgc.x, C2_imgc.y, EP_imgc.x, EP_imgc.y);
				}
				
				console.log( bezier_str );
					
			}

			if( part_val.stroke_width != 0){
				p_ctx.stroke();
			}
			
			p_ctx.fill();
			
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
			////this.seParts[part_key].setAttribute('style' , part_val.fill );
			//this.seParts[part_key].style.opacity = '0.2';
			
		}						
		
		//그리기
		//p_ctx.moveTo(0, 0);					//시작점
		//p_ctx.lineTo(100, 100);				//끝점			
		//p_ctx.arc(Ox, Oy, radius, start_radian, end_radian,dir);
		//
		//
		//////////////////////////////////////////////////////////////////////
		
			
		
	}

	
	//note.#871
	update_scale(){
		//	when scale of SCR is 1, scale of Logo must be 1/2
		//	img size : 400x400
		//	logo size: 200x200
		let scale = this.oSCR.oConfig.platform_ratio*this.oSCR.vbcs_scale / 2 ;	
		
		this.seL2Layer_scale.setAttribute('transform','scale(' + String( scale ) + ')' );		
	}
	
	//note.#871
	update_position(){

		//
		let img_shorter = 0;	//width,height중에 짧은 쪽
		if( this.oSCR.oConfig.scr_height >  this.oSCR.oConfig.scr_width ){
			img_shorter =  this.oSCR.oConfig.scr_width;
		}
		else{
			img_shorter = this.oSCR.oConfig.scr_height;
		}		
		
		let logo_size = img_shorter / 2;
		
		//img size
		//scale : 1 -> 200x200
		//scale : 2 -> 400x400
		let x_vbcs = (this.oSCR.vbcs_width  - logo_size*this.oSCR.vbcs_scale )/2 + this.oSCR.vbcs_x_min;
		let y_vbcs = (this.oSCR.vbcs_height - logo_size*this.oSCR.vbcs_scale )/2 + this.oSCR.vbcs_y_min;
		
		this.seL1Layer_transport.setAttribute('transform','translate(' + String(x_vbcs) +  ',' + String(y_vbcs) + ')' )					
	}
	

	//{{
	//update_logo(){
	//	
	//	
	//	
	//	
	//	return;
	//	
	//	////////////////////////////////////////////////////////////////
	//	for( const [part_key,part_val] of Object.entries( this.PartSet ) ){
	//		console.log( part_key, part_val );
	//
	//		let bezier_str = '';
	//		
	//		for( const [point_key, point_val] of Object.entries( part_val.scs ) ){
	//			console.log( point_key, point_val );
	//			
	//			let EP_scs = {x:point_val['EP'].x , y:point_val['EP'].y };
	//			let EP_vbc = this.oSCR.scs2vbcs(  EP_scs.x , EP_scs.y );
	//
	//			let C1_scs = {x:point_val['C1'].x , y:point_val['C1'].y };
	//			let C1_vbc = this.oSCR.scs2vbcs(  C1_scs.x , C1_scs.y ); 
	//			
	//			let C2_scs = {x:point_val['C2'].x , y:point_val['C2'].y };
	//			let C2_vbc = this.oSCR.scs2vbcs(  C2_scs.x , C2_scs.y ); 
	//
	//			if( point_key == 'P1'){
	//				bezier_str = 'M' + String( EP_vbc.x ) + ',' + String( EP_vbc.y) ;
	//			}
	//			else{
	//				bezier_str = bezier_str + ' ' +
	//					'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
	//						  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
	//						  String( EP_vbc.x ) + ',' + String( EP_vbc.y );				
	//			}
	//			
	//			console.log( bezier_str );
	//			
	//		}
	//
	//		
	//		this.seParts[part_key].setAttribute('d' , bezier_str );
	//	}
	//				
	//}
	//}}
		
	//{{
	//constructor_v3( p_oSCR ){
	//	this.oSCR = p_oSCR;
	//	
	//	//화면 초기화
	//	//this.init();
	//	this.register_parts();
	//	
	//
	//	
	//	////////////////
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	//부모 레이어
	//	let seLayer = this.oSCR.get_layer('Line_Length_Arc');		
	//					
	//	for( const [part_key,part_val] of Object.entries( this.PartSet ) ){
	//		console.log( part_key, part_val );
	//		
	//		let bezier_str = '';
	//		
	//		for( const [point_key, point_val] of Object.entries( part_val.scs ) ){
	//			console.log( point_key, point_val );
	//			
	//			let EP_scs = {x:point_val['EP'].x , y:point_val['EP'].y };
	//			let EP_vbc = this.oSCR.scs2vbcs(  EP_scs.x , EP_scs.y );
	//
	//			let C1_scs = {x:point_val['C1'].x , y:point_val['C1'].y };
	//			let C1_vbc = this.oSCR.scs2vbcs(  C1_scs.x , C1_scs.y ); 
	//			
	//			let C2_scs = {x:point_val['C2'].x , y:point_val['C2'].y };
	//			let C2_vbc = this.oSCR.scs2vbcs(  C2_scs.x , C2_scs.y ); 
	//
	//			if( point_key == 'P1'){
	//				bezier_str = 'M' + String( EP_vbc.x ) + ',' + String( EP_vbc.y) ;
	//			}
	//			else{
	//				bezier_str = bezier_str + ' ' +
	//					'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
	//						  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
	//						  String( EP_vbc.x ) + ',' + String( EP_vbc.y );				
	//			}
	//			
	//			console.log( bezier_str );
	//			
	//		}
	//		
	//		//<path id='arc2' class='bg_red'></path>	
	//		this.seParts[part_key] = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
	//		this.seParts[part_key].setAttribute('id' , seLayer.id + '__' + part_key );
	//		this.seParts[part_key].setAttribute('visibility','visible');
	//		this.seParts[part_key].setAttribute('d' , bezier_str );
	//		//this.seParts[part_key].setAttribute('class' , 'c_bezier' );	//우선순위 : 여기에 지정한 클래스 css > 바로밑에 stroke
	//		this.seParts[part_key].setAttribute('stroke' , part_val.stroke );
	//		this.seParts[part_key].setAttribute('stroke-width' , part_val.stroke_width );
	//		this.seParts[part_key].setAttribute('stroke-dasharray' , 'none' );
	//		this.seParts[part_key].setAttribute('fill' , part_val.fill );
	//		
	//		
	//		seLayer.appendChild( this.seParts[part_key] );				
	//		
	//	}
	//	
	//	//debugger;
	//	//return;
	//	///////////////////////
	//	
	//	
	//}
	//
	//init_v1(){
	//	//////////////////////////////////////////////////////////////////////
	//	//선길이 표시 
	//	let length_arc_layer = this.oSCR.get_layer('Line_Length_Arc');		
	//	
	//	////<path id='arc2' class='bg_red'></path>	
	//	//this.seBezier = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
	//	//this.seBezier.setAttribute('id' , length_arc_layer.id + '__bezier' );
	//	//this.seBezier.setAttribute('visibility','visible');
	//	//this.seBezier.setAttribute('class' , 'c_bezier' );
	//	//length_arc_layer.appendChild( this.seBezier );			
	//}
	//}}
	
	//{{
	//constructor_v2(p_oSCR,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
	//	this.oSCR = p_oSCR;
	//	
	//	/*
	//	//Part.#1
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 94,y:390} },
	//		P2: { C1:{x: 75 ,y:390}, C2:{x: 20,y:308}, EP:{x: 29,y:272} },
	//		P3: { C1:{x: 30 ,y:191}, C2:{x: 50,y:151}, EP:{x: 69,y:122} },
	//		P4: { C1:{x:181 ,y:135}, C2:{x:254,y:165}, EP:{x:318,y:237} },
	//		P5: { C1:{x:281 ,y:334}, C2:{x:191,y:397}, EP:{x: 94,y:390} }
	//	};
	//	*/
	//
	//	/*
	//	//Part.#2
	//	this.Points_scs = {
	//		P1: { C1:{x: 30 ,y:191}, C2:{x: 50,y:151}, EP:{x: 69,y:122} },
	//		P2: { C1:{x:181 ,y:135}, C2:{x:254,y:165}, EP:{x:318,y:237} },
	//		P3: { C1:{x:361 ,y:241}, C2:{x:395,y:199}, EP:{x:356,y:142} },
	//		P4: { C1:{x:342 ,y:119}, C2:{x:309,y: 89}, EP:{x:276,y: 65} }, //연결부위
	//		P5: { C1:{x:253 ,y: 53}, C2:{x:249,y: 51}, EP:{x:229,y: 44} }, //연결부위
	//		P6: { C1:{x:165 ,y: 29}, C2:{x:119,y: 16}, EP:{x: 71,y: 51} }, 
	//		P7: { C1:{x: 57 ,y: 58}, C2:{x: 41,y:103}, EP:{x: 69,y:122} }
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#3
	//	this.Points_scs = {
	//		P1: { C1:{x:342 ,y:119}, C2:{x:309,y: 89}, EP:{x:276,y: 65} }, //연결부위
	//		P2: { C1:{x:253 ,y: 53}, C2:{x:249,y: 51}, EP:{x:229,y: 44} }, //연결부위
	//		P3: { C1:{x:244 ,y: 38}, C2:{x:232,y: 26}, EP:{x:281,y:  5} }, 
	//		P4: { C1:{x:294 ,y: 15}, C2:{x:306,y: 22}, EP:{x:303,y: 28} }, 
	//		P5: { C1:{x:284 ,y: 32}, C2:{x:277,y: 48}, EP:{x:276,y: 65} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#4
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:311,y: 93} }, 
	//		P2: { C1:{x:347 ,y:119}, C2:{x:342,y:128}, EP:{x:356,y:142} },
	//		P3: { C1:{x:382 ,y:187}, C2:{x:372,y:235}, EP:{x:318,y:237} },
	//		P4: { C1:{x:273 ,y:325}, C2:{x:224,y:395}, EP:{x: 94,y:390} },
	//		P5: { C1:{x:216 ,y:371}, C2:{x:247,y:286}, EP:{x:260,y:280} },
	//		P6: { C1:{x:295 ,y:239}, C2:{x:278,y:209}, EP:{x:234,y:180} },
	//		P7: { C1:{x:313 ,y:125}, C2:{x:296,y:137}, EP:{x:311,y: 93} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#5
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 60,y:107} }, 
	//		P2: { C1:{x: 99 ,y: 56}, C2:{x:130,y: 49}, EP:{x:200,y: 39} }, 
	//		P3: { C1:{x:109 ,y: 63}, C2:{x:107,y: 62}, EP:{x: 60,y:107} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#6
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 93,y:121} }, 
	//		P2: { C1:{x:155 ,y: 81}, C2:{x:170,y: 65}, EP:{x:253,y: 60} }, 
	//		P3: { C1:{x:173 ,y: 77}, C2:{x:181,y: 71}, EP:{x: 93,y:121} }, 
	//	};	
	//	*/
	//	
	//	/*
	//	//Part.#7
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:156,y:132} }, 
	//		P2: { C1:{x:234 ,y: 87}, C2:{x:233,y: 94}, EP:{x:297,y: 90} }, 
	//		P3: { C1:{x:236 ,y: 94}, C2:{x:209,y:105}, EP:{x:156,y:132} }, 
	//	};	
	//	*/
	//	
	//	/*
	//	//Part.#8
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:207,y:150} }, 
	//		P2: { C1:{x:268 ,y:131}, C2:{x:301,y:127}, EP:{x:341,y:131} }, 
	//		P3: { C1:{x:273 ,y:131}, C2:{x:257,y:140}, EP:{x:207,y:150} }, 
	//	};
	//	*/
	//
	//	/*
	//	//Part.#9
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:258,y:181} }, 
	//		P2: { C1:{x:300 ,y:172}, C2:{x:317,y:165}, EP:{x:361,y:177} }, 
	//		P3: { C1:{x:309 ,y:169}, C2:{x:314,y:175}, EP:{x:258,y:181} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#10
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:301,y:214} }, 
	//		P2: { C1:{x:321 ,y:213}, C2:{x:330,y:213}, EP:{x:348,y:219} }, 
	//		P3: { C1:{x:330 ,y:216}, C2:{x:331,y:213}, EP:{x:301,y:214} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#11
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x: 66,y: 66} }, 
	//		P2: { C1:{x: 81 ,y:104}, C2:{x: 90,y:108}, EP:{x:122,y:126} }, 
	//		P3: { C1:{x: 89 ,y:104}, C2:{x: 82,y: 93}, EP:{x: 66,y: 66} }, 
	//	};
	//	*/
	//	
	//	/*
	//	//Part.#12
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:187,y:143} }, 
	//		P2: { C1:{x:149 ,y:115}, C2:{x:132,y: 91}, EP:{x:108,y: 38} }, 
	//		P3: { C1:{x:123 ,y: 90}, C2:{x:143,y:117}, EP:{x:187,y:143} }, 
	//	};
	//	*/		
	//	
	//	/*
	//	//Part.#13
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:256,y:180} }, 
	//		P2: { C1:{x:219 ,y:145}, C2:{x:198,y: 96}, EP:{x:190,y: 40} }, 
	//		P3: { C1:{x:196 ,y:101}, C2:{x:212,y:135}, EP:{x:256,y:180} }, 
	//	};
	//	*/
	//	
	//	//Part.#14
	//	this.Points_scs = {
	//		P1: { C1:{x:  0 ,y:  0}, C2:{x:  0,y:  0}, EP:{x:299,y:211} }, 
	//		P2: { C1:{x:287 ,y:179}, C2:{x:272,y:131}, EP:{x:272,y: 69} }, 
	//		P3: { C1:{x:268 ,y:125}, C2:{x:279,y:167}, EP:{x:299,y:211} }, 
	//	};		
	//	
	//	//M94,-10 C75,-10 20,-92 29,-128 C30,-209 50,-249 69,-278
	//	for( const [key,val] of Object.entries( this.Points_scs) ){
	//		console.log( key, val );
	//		//EP 등록
	//		console.log( 'scs  : ', val['EP'].x , val['EP'].y  );
	//		
	//		let x_scs = val['EP'].x;
	//		let y_scs = val['EP'].y;
	//		
	//		let EP_vbc = this.oSCR.scs2vbcs( x_scs , y_scs ); 
	//		console.log( 'vbcs : ', EP_vbc.x , EP_vbc.y  );
	//		
	//		let EP_ctc = this.oSCR.vbcs2ctcs( EP_vbc.x , EP_vbc.y );
	//		console.log( 'ctcs : ', EP_ctc.x , EP_ctc.y  );
	//		
	//		this.objs[key] = new cPoint(this.oSCR, EP_ctc.x , EP_ctc.y, key , false, null );	//call-back
	//		this.objs[key].init();			
	//		
	//		/*
	//		if( key !== 'P1'){
	//			//C1등록 
	//			let obj_key = key + '_C1';
	//			console.log( obj_key );
	//			
	//			x_scs = val['C1'].x;
	//			y_scs = val['C1'].y;
	//			console.log( 'scs  : ', x_scs , y_scs);
	//			
	//			let C1_vbc = this.oSCR.scs2vbcs( x_scs , y_scs ); 
	//			console.log( 'vbcs : ', C1_vbc.x , C1_vbc.y  );
	//			
	//			let C1_ctc = this.oSCR.vbcs2ctcs( C1_vbc.x , C1_vbc.y ); 
	//			console.log( 'ctcs : ', C1_ctc.x , C1_ctc.y  );
	//
	//			this.objs[obj_key] = new cPoint(this.oSCR, C1_ctc.x , C1_ctc.y, obj_key ,true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
	//			this.objs[obj_key].init();				
	//			
	//		}
	//		*/
	//		
	//	}
	//	
	//	let EP_x = 1;
	//	let EP_y = 1;
	//
	//	let C1_x = 1;
	//	let C1_y = 2;		
	//
	//	let C2_x = 2;
	//	let C2_y = 2;		
	//
	//	this.objs['EP'] = new cPoint(this.oSCR, EP_x, EP_y,'EP',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['EP'].init();								
	//
	//	this.objs['C1'] = new cPoint(this.oSCR, C1_x,C1_y,'C1',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C1'].init();								
	//
	//	this.objs['C2'] = new cPoint(this.oSCR, C2_x,C2_y,'C2',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C2'].init();	
	//
	//	//////////////////////////////////////////////////////////////////////
	//	//{{2022.08.12
	//	let screenshot_objs = [];
	//	this.oSCR.register_screenshot_objs( screenshot_objs );
	//	//}}2022.08.12
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	//선길이 표시 
	//	let length_arc_layer = this.oSCR.get_layer('Line_Length_Arc');		
	//	
	//	//<path id='arc2' class='bg_red'></path>	
	//	this.seBezier = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
	//	this.seBezier.setAttribute('id' , length_arc_layer.id + '__bezier' );
	//	this.seBezier.setAttribute('visibility','visible');
	//	this.seBezier.setAttribute('class' , 'c_bezier' );
	//	length_arc_layer.appendChild( this.seBezier );		
	//	
	//	//control point1
	//	this.seLine1 = document.createElementNS(this.oSCR.const['SVG_NS'],'line');
	//	this.seLine1.setAttribute('id' , length_arc_layer.id + '__bezier_c1' );
	//	length_arc_layer.appendChild(this.seLine1);	
	//	
	//	//control point2
	//	this.seLine2 = document.createElementNS(this.oSCR.const['SVG_NS'],'line');
	//	this.seLine2.setAttribute('id' , length_arc_layer.id + '__bezier_c2' );
	//	length_arc_layer.appendChild(this.seLine2);			
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	this.update_bezier();
	//	
	//}
	//}}
	

	
	//{{
	//constructor_v1(p_oSCR,p_Ax,p_Ay,p_Bx,p_By,p_Cx,p_Cy){
	//	let P1_x = 1;
	//	let P1_y = 1;
	//
	//	let P2_x = 2;
	//	let P2_y = 1;
	//
	//	let P3_x = 3;
	//	let P3_y = 1;
	//
	//	let C1_x = 1;
	//	let C1_y = 2;		
	//
	//	let C2_x = 2;
	//	let C2_y = 2;		
	//
	//	let C3_x = 2;
	//	let C3_y = 0;		
	//
	//	let C4_x = 3;
	//	let C4_y = 0;
	//	
	//	this.oSCR = p_oSCR;
	//
	//	this.objs['P1'] = new cPoint(this.oSCR, P1_x,P1_y,'P1',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
	//	this.objs['P1'].init();
	//
	//	this.objs['P2'] = new cPoint(this.oSCR, P2_x,P2_y,'P2',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
	//	this.objs['P2'].init();
	//
	//	this.objs['P3'] = new cPoint(this.oSCR, P3_x,P3_y,'P3',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	//call-back
	//	this.objs['P3'].init();
	//
	//	this.objs['C1'] = new cPoint(this.oSCR, C1_x,C1_y,'C1',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C1'].init();								
	//
	//	this.objs['C2'] = new cPoint(this.oSCR, C2_x,C2_y,'C2',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C2'].init();	
	//
	//	this.objs['C3'] = new cPoint(this.oSCR, C3_x,C3_y,'C3',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C3'].init();	
	//
	//	this.objs['C4'] = new cPoint(this.oSCR, C4_x,C4_y,'C4',true, (p_point,p_x_vbc,p_y_vbc)=>this.call_back_of_drag_object(p_point,p_x_vbc,p_y_vbc) );	
	//	this.objs['C4'].init();	
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	//{{2022.08.12
	//	let screenshot_objs = [];
	//	
	//	screenshot_objs.push( this.objs['P1'] );
	//	screenshot_objs.push( this.objs['P2'] );
	//	screenshot_objs.push( this.objs['C1'] );
	//	screenshot_objs.push( this.objs['C2'] );
	//	
	//	this.oSCR.register_screenshot_objs( screenshot_objs );
	//	//}}2022.08.12
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	//선길이 표시 
	//	let length_arc_layer = this.oSCR.get_layer('Line_Length_Arc');		
	//	
	//	//<path id='arc2' class='bg_red'></path>	
	//	this.seBezier = document.createElementNS(this.oSCR.const['SVG_NS'],'path');
	//	this.seBezier.setAttribute('id' , length_arc_layer.id + '__bezier' );
	//	this.seBezier.setAttribute('visibility','visible');
	//	this.seBezier.setAttribute('class' , 'c_bezier' );
	//	length_arc_layer.appendChild( this.seBezier );		
	//	
	//	//control point1
	//	this.seLine1 = document.createElementNS(this.oSCR.const['SVG_NS'],'line');
	//	this.seLine1.setAttribute('id' , length_arc_layer.id + '__bezier_c1' );
	//	length_arc_layer.appendChild(this.seLine1);	
	//	
	//	//control point2
	//	this.seLine2 = document.createElementNS(this.oSCR.const['SVG_NS'],'line');
	//	this.seLine2.setAttribute('id' , length_arc_layer.id + '__bezier_c2' );
	//	length_arc_layer.appendChild(this.seLine2);			
	//	
	//	//////////////////////////////////////////////////////////////////////
	//	this.update_bezier();
	//	
	//}
	//}}

	//{{
	////{{2022.08.07
	//call_back_of_drag_object(p_obj, p_x_vbc, p_y_vbc){
	//	
	//	//(VALD) 점의 이동에 대해서만 반응함
	//	if( p_obj.constructor.name != 'cPoint'){
	//		return;
	//	}
	//	
	//	//(VALD) : var name = { point_A , point_B , point_C }
	//	let var_name = scUtil.dictionary_search_key_by_value(this.objs, p_obj);
	//	
	//	//this.oSCR.debug_log( scUtil.dictionary_search_key_by_value(this.objs, p_obj) );	//점의 변수명
	//	
	//	//if( var_name != 'point_A' && var_name != 'point_B' && var_name != 'point_C' ){
	//	if( typeof var_name === 'undefined' ){
	//		return;
	//	}
	//	
	//	
	//	//(Logic) 		
	//	
	//	p_obj.update_position_vbcs(p_x_vbc , p_y_vbc);	
	//	
	//	//this.update( p_obj );
	//	this.update_bezier();
	//	
	//	return;
	//	////////////////////////////////////////////////////////////////
	//	
	//	console.log( p_obj.constructor.name , typeof p_obj);	//class name: c_point , typeof : object 
	//	console.log(     );
	//	return;
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
	//	p_obj.update_position_vbcs(p_x_vbc , p_y_vbc);	
	//	this.update( p_obj );
	//}
	////}}2022.08.07
	//}}
	
	//{{
	//update_bezier(){
	//	let last_point_key  = '';
	//	let last_point_vb_x = '';
	//	let last_point_vb_y = '';
	//	
	//	let bezier_str = '';
	//
	//	//M94,-10 C75,-10 20,-92 29,-128 C30,-209 50,-249 69,-278
	//	for( const [key,val] of Object.entries( this.Points_scs) ){
	//		console.log( key, val );
	//		//EP 등록
	//		console.log( 'scs  : ', val['EP'].x , val['EP'].y  );
	//		
	//		let EP_scs = {x:val['EP'].x , y:val['EP'].y };
	//		let EP_vbc = this.oSCR.scs2vbcs(  EP_scs.x , EP_scs.y ); 
	//		let EP_ctc = this.oSCR.vbcs2ctcs( EP_vbc.x , EP_vbc.y );
	//
	//		let C1_scs = {x:val['C1'].x , y:val['C1'].y };
	//		let C1_vbc = this.oSCR.scs2vbcs(  C1_scs.x , C1_scs.y ); 
	//		let C1_ctc = this.oSCR.vbcs2ctcs( C1_vbc.x , C1_vbc.y );				
	//		
	//		let C2_scs = {x:val['C2'].x , y:val['C2'].y };
	//		let C2_vbc = this.oSCR.scs2vbcs(  C2_scs.x , C2_scs.y ); 
	//		let C2_ctc = this.oSCR.vbcs2ctcs( C2_vbc.x , C2_vbc.y );			
	//		
	//		if( key == 'P1'){
	//			bezier_str = 'M' + String( EP_vbc.x ) + ',' + String( EP_vbc.y) ;
	//		}
	//		else{
	//			bezier_str = bezier_str + ' ' +
	//				'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
	//					  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
	//					  String( EP_vbc.x ) + ',' + String( EP_vbc.y );				
	//		}
	//		
	//		last_point_key = key;
	//		last_point_vb_x = EP_vbc.x;
	//		last_point_vb_y = EP_vbc.y;
	//	}
	//	
	//	//
	//	let EP_vbc = {x:this.objs['EP'].vb_x , y:this.objs['EP'].vb_y};
	//	let C1_vbc = {x:this.objs['C1'].vb_x , y:this.objs['C1'].vb_y};
	//	let C2_vbc = {x:this.objs['C2'].vb_x , y:this.objs['C2'].vb_y};
	//
	//	bezier_str = bezier_str + ' ' +
	//		'C' + String( C1_vbc.x ) + ',' + String( C1_vbc.y ) + ' ' +
	//			  String( C2_vbc.x ) + ',' + String( C2_vbc.y ) + ' ' +
	//			  String( EP_vbc.x ) + ',' + String( EP_vbc.y );
	//	
	//	this.seBezier.setAttribute('d',bezier_str);
	//	
	//	//
	//	this.seLine1.setAttribute( 'x1',String(this.objs['C1'].vb_x) );
	//	this.seLine1.setAttribute( 'y1',String(this.objs['C1'].vb_y) );
	//	this.seLine1.setAttribute( 'x2',String(last_point_vb_x ));
	//	this.seLine1.setAttribute( 'y2',String(last_point_vb_y ));
	//	
	//	this.seLine2.setAttribute( 'x1',String(this.objs['C2'].vb_x) );
	//	this.seLine2.setAttribute( 'y1',String(this.objs['C2'].vb_y) );
	//	this.seLine2.setAttribute( 'x2',String(this.objs['EP'].vb_x) );
	//	this.seLine2.setAttribute( 'y2',String(this.objs['EP'].vb_y) );	
	//	
	//	//
	//	let EP_scs = this.oSCR.vbcs2scs( EP_vbc.x , EP_vbc.y );
	//	let C1_scs = this.oSCR.vbcs2scs( C1_vbc.x , C1_vbc.y );
	//	let C2_scs = this.oSCR.vbcs2scs( C2_vbc.x , C2_vbc.y );
	//	
	//	this.oSCR.update_debug_info('debug_bezier_EP', String( EP_scs.x ) + ' , ' + String( EP_scs.y ) ) ;
	//	this.oSCR.update_debug_info('debug_bezier_C1', String( C1_scs.x ) + ' , ' + String( C1_scs.y ) ) ;
	//	this.oSCR.update_debug_info('debug_bezier_C2', String( C2_scs.x ) + ' , ' + String( C2_scs.y ) ) ;
	//	
	//}
	//}}
	
	//{{
	//update_bezier_v1(){
	//	
	//	let bezier_str = '';
	//	bezier_str = 
	//		'M' + String( this.objs['P1'].vb_x ) + ',' + String( this.objs['P1'].vb_y ) + ' ' +
	//		
	//		'C' + String( this.objs['C1'].vb_x ) + ',' + String( this.objs['C1'].vb_y ) + ' ' +
	//		      String( this.objs['C2'].vb_x ) + ',' + String( this.objs['C2'].vb_y ) + ' ' +
	//		      String( this.objs['P2'].vb_x ) + ',' + String( this.objs['P2'].vb_y ) + ' ' +
	//
	//		'C' + String( this.objs['C3'].vb_x ) + ',' + String( this.objs['C3'].vb_y ) + ' ' +
	//		      String( this.objs['C4'].vb_x ) + ',' + String( this.objs['C4'].vb_y ) + ' ' +
	//		      String( this.objs['P3'].vb_x ) + ',' + String( this.objs['P3'].vb_y )           ;
	//		
	//	
	//	this.seBezier.setAttribute('d',bezier_str);
	//	
	//	//
	//	this.seLine1.setAttribute( 'x1',String(this.objs['P1'].vb_x) );
	//	this.seLine1.setAttribute( 'y1',String(this.objs['P1'].vb_y) );
	//	this.seLine1.setAttribute( 'x2',String(this.objs['C1'].vb_x) );
	//	this.seLine1.setAttribute( 'y2',String(this.objs['C1'].vb_y) );
	//	
	//	this.seLine2.setAttribute( 'x1',String(this.objs['P2'].vb_x) );
	//	this.seLine2.setAttribute( 'y1',String(this.objs['P2'].vb_y) );
	//	this.seLine2.setAttribute( 'x2',String(this.objs['C2'].vb_x) );
	//	this.seLine2.setAttribute( 'y2',String(this.objs['C2'].vb_y) );	
	//
	//	//
	//	this.oSCR.update_debug_info('debug_bezier'   , bezier_str ) ;
	//	this.oSCR.update_debug_info('debug_bezier_P1', String(this.objs['P1'].ct_x) + ' , ' + String(this.objs['P1'].ct_y)) ;
	//	this.oSCR.update_debug_info('debug_bezier_P2', String(this.objs['P2'].ct_x) + ' , ' + String(this.objs['P2'].ct_y)) ;
	//	this.oSCR.update_debug_info('debug_bezier_C1', String(this.objs['C1'].ct_x) + ' , ' + String(this.objs['C1'].ct_y)) ;
	//	this.oSCR.update_debug_info('debug_bezier_C2', String(this.objs['C2'].ct_x) + ' , ' + String(this.objs['C2'].ct_y)) ;
	//	
	//}//update
	////}}2022.08.05	
	//}}
	
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
	
	

}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

