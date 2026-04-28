export default async function handler(req, res) {
  // 클라이언트로부터 파라미터 받기
  const { sigungu, bjdong, bun, ji, dongNm } = req.query;
  
  // 환경변수에서 키 가져오기 (인코딩 문제 방지를 위해 다시 한번 처리)
  const serviceKey = process.env.DATA_GO_KR_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
  }

  // 건축물대장 '표제부' 조회 서비스 (가장 일반적인 API)
  const url = 'http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo';
  
  // 파라미터 구성 (공공데이터 포털은 순서와 형식이 매우 까다롭습니다)
  const fullUrl = `${url}?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&platGbCd=0&bun=${bun.padStart(4, '0')}&ji=${ji.padStart(4, '0')}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

  try {
    const apiResponse = await fetch(fullUrl);
    
    // 응답이 오지 않거나 텍스트일 경우를 대비한 처리
    const text = await apiResponse.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: "API 응답이 JSON 형식이 아닙니다.", details: text });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "서버 통신 오류", message: error.message });
  }
}
