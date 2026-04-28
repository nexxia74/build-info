export default async function handler(req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    // Vercel 환경변수에서 키 가져오기
    const serviceKey = process.env.DATA_GO_KR_KEY;

    if (!serviceKey) return res.status(200).send("Vercel 환경변수에 키가 없습니다.");

    // 번/지 숫자 전처리 (4자리 패딩)
    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');
    
    // [중요] 포털 API는 파라미터 순서와 인코딩에 매우 민감합니다. 
    // URLSearchParams를 쓰지 않고 직접 문자열을 조합하는 것이 가장 확실합니다.
    const url = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&_type=json&numOfRows=100`;

    const response = await fetch(url);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      
      // 동 이름 필터링 로직
      if (dongNm && data.response?.body?.items?.item) {
        const allItems = data.response.body.items.item;
        const itemList = Array.isArray(allItems) ? allItems : [allItems];
        // "101"이 포함된 동(예: 101동, 101호 등)을 유연하게 찾습니다.
        data.response.body.items.item = itemList.filter(item => 
          String(item.dongNm || '').includes(dongNm)
        );
      }
      
      res.status(200).json(data);
    } catch (parseError) {
      // JSON 파싱 실패 시 원문 출력 (에러 원인 파악용)
      res.status(200).send(`API 응답 원문: ${text}`);
    }
  } catch (err) {
    res.status(200).json({ error: "서버 내부 에러", message: err.message });
  }
}
