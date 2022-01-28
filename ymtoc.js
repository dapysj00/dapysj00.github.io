document.addEventListener('DOMContentLoaded', function() {
  try {
    const check = document.querySelector('.contents_style');  // 기본스킨 여부 체크
    const madeCheck = document.getElementById('toc-ym');  //이미 포스팅안에 서식으로 들어가 있는지 체크
    if(check && (!madeCheck)){
      htmlTableOfContents();
    } else {
      return false;
    }
    
  }
  catch(err){
    // console.log(`Error: ${err.message}`)
    console.log('');
  }
});                        

function htmlTableOfContents(documentRef) {
  var documentRef = documentRef || document;

  const tocBox = document.createElement('div');  //목차가 들어갈 div 생성을 위한 변수 tocBox
  tocBox.setAttribute('id','toc-ym');  // 목차가 들어갈 div에 id="toc-ym" 속성 설정

  const blogText = document.querySelector('.contents_style');  // 티블의 body안에서 글 전체의 HTML을 담기 위한 변수 blogText
 
  // 글 가운데서 p태그안에 [[나의목차]] 라고 씌여진 부분을 찾아내서 그 태그를 matchingElement 변수에 저장한다.
  var xpath = "//p[contains(text(),'[[나의목차]]')]";
  var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
  let tocWhere ;  // 글 본문에서 id="toc-where-ym" 을 찾아서 있으면 그걸 넣고 없으면, 글의 첫번째 요소를 찾아서 넣을 값을 저장하는 변수


  if (matchingElement){
    tocWhere = matchingElement;  // 글 본문에서 id="toc-where-ym" 를 찾아서 있다면 tocWhere 값 저장
    tocWhere.textContent='';
    tocWhere.appendChild(tocBox); //
  } else {
    tocWhere = blogText.firstElementChild;  // 목차가 들어갈 위치의 기준점을 위해서 글 전체 중에서 첫번째 요소 선택 변수 toWhere에 저장
    if ( tocWhere.classList.contains('tt_adsense_top') || tocWhere.classList.contains('revenue_unit_wrap')){
      blogText.insertBefore(tocBox, tocWhere.nextSibling); //애드센스코드 있다면 그 밑에 삽입(insertBefore) 즉 첫번째가 애드센스코드니까 두번째 요소 바로 앞에 삽입
    } else {
      tocWhere.parentNode.insertBefore(tocBox, tocWhere); // 그렇지 않으면 맨 앞에 삽입 위의 주석과 같은 말
    }
  }

  const tocList = document.getElementById('toc-ym');
  const hd = [].slice.call(blogText.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  // 제목으로 설정했으나 비어있는 태그, 카테고리 다른글의 h태그 제거
  const headings =[];
  for(i = 0; i < hd.length; i++) {
    if( hd[i].outerText.trim() === '' ){
      continue;
    } else if( hd[i].classList.contains('title') ){
      continue;
    } else if(hd[i].parentNode.classList.contains('another_category')){
      continue;
    } else{
      headings.push(hd[i]);
    }
  }

  headings.forEach(function (heading, index) {
      var ref = "toc" + index;
      if ( heading.hasAttribute( "id" ) ) 
          ref = heading.getAttribute( "id" );
      else
          heading.setAttribute( "id", ref );

      var link = documentRef.createElement( "a" );
      link.setAttribute( "href", "#"+ ref );
      link.textContent = "• " + heading.textContent;

      var div = documentRef.createElement( "div" );
      div.setAttribute( "class", heading.tagName.toLowerCase() );
      div.appendChild( link );
      tocList.appendChild( div );
  });

  const style = `
    #toc-ym div.h1 { margin-left: 0em }
    #toc-ym div.h2 { margin-left: 0.5em }
    #toc-ym div.h3 { margin-left: 1em }
    #toc-ym div.h4 { margin-left: 1.5em }
    #toc-ym div.h5 { margin-left: 2em }
    #toc-ym div.h6 { margin-left: 2.5em }
    
    #toc-ym {
      margin: 30px 0px 30px 0px;
      padding: 20px 20px 10px 15px;
      border: 1px solid #dadada;
      background-color: #ffffff;
    }
    #toc-ym::before {
      content: "목  차";
      display: block;
      width: 120px;
      background-color: rgb(255, 255, 255);
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin: -40px auto 0px;
      padding: 5px 0px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(218, 218, 218);
      border-image: initial;
    }
    #toc-ym div{
      margin: 5px 0px;
    }
    #toc-ym div:first-child{
      margin-top: 15px;
    }
    #toc-ym div:last-child{
      margin-bottom: 15px;
    }
    #toc-ym div a {
      text-decoration: none;
      color: #337ab7;
      transition: all ease 0.2s;
    }
    #toc-ym div a:hover {
      
      color: #333333;
      background-color: #ecc7ff;
      
    }
    /*
    .contents_style h3{
      margin-bottom:7px;
      padding: 10px 15px;
      border-left: 5px solid #757575;
      background-color: #e5e5e5;
      font-weight: 500;
      color: #000000 !important;
    }
    */
    `;
    const tocStyle = document.createElement('style');
    tocStyle.innerHTML =style;
    blogText.insertBefore(tocStyle, tocWhere);
}
