export default async function handler(req, res) {
    const { sigungu, bjdong, bun, ji, dongNm, serviceKey } = req.query;
    
    // 공공데이터 API 주소 생성
    const url = `https://apis.data.go.kr/1613000/BldrgstService_V2/getBrExposPublctTpInfo?serviceKey=${serviceKey}&sigunguCd=${sigungu}&bjdongCd=${bjdong}&bun=${bun}&ji=${ji}&dongNm=${encodeURIComponent(dongNm)}&_type=json&numOfRows=100`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("공공데이터 서버 응답 에러");
        
        const data = await response.json();
        
        // 브라우저에 결과 반환
        res.status(200).json(data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "API 호출 실패", message: error.message });
    }
}
