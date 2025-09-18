
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Next로 만드는 블로그 구현순서
1. 메인화면 및 블로그 글 추가삭제 자세히 보기 등 라우팅 주소 구현 및 구조 설정
2. Clerk으로 로그인 시스템 구현 및 OAuth 으로 소셜로그인 시스템 구현하기
3. 사용자 개인화 및 DB 구조설계 및 연동
4. DB 온라인화 및 OpenAI 기술을 활용한 차별화
5. TailwindCSS or Styled-Components 활용한 디자인 (Three.js 활용한 로고)
6. SEO 성능 최적화 및 CI/CD 및 테스트코드 활용


## Next.js에 대한 모든 것

### Image
Next.js의 Image 컴포넌트는 표준 HTML <img> 태그를 확장한 것으로, 이미지를 자동으로 최적화  
이 컴포넌트는 서버 사이드에서 자동으로 이미지 크기를 조정하고, 최적의 포맷을 선택하여 불필요한 데이터 전송을 줄임   
lazy loading이 기본 설정되어 있어 뷰포트에서 벗어난 이미지는 사용자가 스크롤하여 해당 이미지가 필요할 때까지 로드되지 않음. 이러한 기능은 특히 대용량 이미지가 많은 사이트에서 페이지 로드 시간을 크게 단축시킴  

필수 속성 : width, height, alt

### 라우팅
Next.js 라우팅은 폴더,파일구조로 간단하게 만들 수 있다.(예전엔 page 라우터 요즘은 app 라우터)
파일 기반 라우팅을 지원하고 동적 라우팅의 경우 파일명, 폴더명을 []로 감싸주면 된다.  

#### 라우팅 하는법
<a href="/">Home</a> 
순수 HTML 요소로, 페이지는 완전히 새로고침  
페이지를 완전히 새로고침하므로 아래의 <Link> 태그를 사용하는 것이 좋다!  

<Link href="/posts/new">
  <button className="~">글 추가</button>
</Link>
페이지 컴포넌트 간의 연결을 위해 사용  
a 태그를 생성하여 웹 사이트가 크롤링될 수 있고 따라서 SEO에 적합하다.  
페이지를 다시 로드하지 않고 SPA가 동작하는 것처럼 보이게 만든다.  
JS가 로드된 상태에서 선택된 페이지에 필요한 내용만 추가적으로 가져온다.  

#### useRouter 훅 사용
Next.js는 프로그래밍 방식으로 탐색하기 위해 useRouter 훅을 제공한다.  
이는 사용자를 특정 동작 (예: 폼 제출)에 따라 다른 라우트로 리디렉션하고자 할 때 유용하다.  

useRouter 훅은 'router' 객체를 반환하며, 여러 가지 유용한 속성과 메서드를 포함한다.  
'router' 객체의 'push' 메서드를 사용하면 다른 페이지로 이동할 가능

예를 들어, 아래에서 Go Home 버튼을 누르면 홈 페이지로 돌아감  
```tsx
import { useRouter } from 'next/router'

function NavigationButton() {
  const router = useRouter()

  const goToHomePage = () => {
    router.push('/')
  }

  return (
    <button onClick={goToHomePage}>
      Go Home
    </button>
  )
}

export default NavigationButton
```

### API route
