export default async function handler(req, res) {
  const { sigungu, bjdong, bun, ji, dongNm } = req.query;
  const serviceKey = process.env.DATA_GO_KR_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: "Vercel 환경 변수에 DATA_GO_KR_KEY가 없습니다." });
  }

  // 공공데이터포털 표제부 조회 API
  const url = 'http://apis.data.go.kr/1613000/BldRgstService_v2/getBrExposPublctInfo';
  
  // 파라미터 조합
  const queryParams = new URLSearchParams({
    serviceKey: serviceKey, // 환경변수에서 가져온 키 그대로 사용
    sigunguCd: sigungu || '',
    bjdongCd: bjdong || '',
    platGbCd: '0',
    bun: (bun || '').padStart(4, '0'),
    ji: (ji || '').padStart(4, '0'),
    dongNm: dongNm || '',
    _type: 'json',
    numOfRows: '100'
  });

  const fullUrl = `${url}?${queryParams.toString()}`;

  try {
    const response = await fetch(fullUrl);
    const text = await response.text();

    // 만약 API에서 에러(XML 형태 등)를 보냈을 경우를 대비
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (parseError) {
      // JSON 파싱 실패 시 원본 텍스트를 응답 (디버깅 용도)
      res.status(500).json({ 
        error: "API 응답이 JSON이 아닙니다.", 
        details: text.substring(0, 200) 
      });
    }
  } catch (error) {
    res.status(500).json({ error: "서버 통신 중 예외 발생", message: error.message });
  }
}
