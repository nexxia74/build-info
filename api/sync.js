export default async function (req, res) {
  try {
    const { sigungu, bjdong, bun, ji, dongNm } = req.query;
    const serviceKey = process.env.DATA_GO_KR_KEY;

    // 1. 키 확인
    if (!serviceKey) {
      return res.status(200).json({ error: "환경변수 설정이 안 됨" });
    }

    // 2. 주소 조립 (패딩 처리 포함)
    const _bun = (bun || '').padStart(4, '0');
    const _ji = (ji || '').padStart(4, '0');
    
    // 포털 API는 키를 두 번 인코딩하면 안 되므로 그대로 넣습니다.
    const url = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${_bun}&ji=${_ji}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

    // 3. 호출
    const response = await fetch(url);
    const text = await response.text();

    // 4. 결과 반환
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (e) {
      // JSON이 아닐 경우 포털의 에러 메시지(XML)를 그대로 보여줌
      res.status(200).json({ error: "API 응답 에러", details: text });
    }
  } catch (err) {
    res.status(200).json({ error: "서버 내부 로직 에러", message: err.message });
  }
}
