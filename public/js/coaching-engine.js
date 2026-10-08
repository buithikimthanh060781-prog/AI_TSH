/**
 * ============================================================================
 * POSITION-AWARE NUMEROLOGY COACHING ENGINE HOÀN CHỈNH
 * File: js/coaching-engine.js
 * ============================================================================
 * 
 * Kiến trúc 4 tầng:
 * - TẦNG 1: CORE PROFILE (Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Ngày sinh, Thái độ, TDLT, Cân bằng, Đam mê, SMTT)
 * - TẦNG 2: DEVELOPMENT (Trưởng thành, Chỉ số thiếu, LK ĐĐ-SM, LK NC-LH, Nợ nghiệp)
 * - TẦNG 3: LIFE STAGES (4 Chặng đỉnh cao & 4 Thử thách + Tương tác Chặng/Thử thách)
 * - TẦNG 4: TIME CYCLES (Năm cá nhân, Tháng cá nhân, Ngày cá nhân + Timeline Coaching)
 * 
 * Nguyên tắc bất di bất dịch:
 * - Cùng một con số nhưng ở các vị trí khác nhau có vai trò, câu hỏi và luận giải hoàn toàn khác nhau.
 * - Giữ nguyên 100% thuật toán tính 23 chỉ số hiện tại (không tính lại).
 * - 100% Client-side JavaScript thuần, không API key, không thư viện ngoài.
 * 
 * Public API:
 * - window.NumerologyCoaching.generate(currentResult, options)
 * - window.NumerologyCoaching.renderHTML(coaching)
 * - window.NumerologyCoaching.validate(coaching)
 * - window.NumerologyCoaching.profiles
 * - window.NumerologyCoaching.positionProfiles
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NumerologyCoaching = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ==========================================================================
  // I. TẦNG NGUYÊN LIỆU: NUMBER PROFILES (Trường Năng Lượng Gốc 1..9, 11, 22, 33)
  // ==========================================================================
  const PROFILES = {
    1: {
      number: 1,
      archetype: 'Nhà Tiên Phong Độc Lập',
      keyword: 'Khởi xướng, Tự chủ, Quyết đoán, Bản lĩnh dẫn đầu',
      element: 'Lửa',
      energy: 'Năng lượng dương chủ động, khát vọng khẳng định bản thân và khai phá lối đi riêng.',
      strengths: [
        'Ý chí kiên định, dám nghĩ dám làm và tinh thần tiên phong không ngại khó.',
        'Khả năng ra quyết định nhanh chóng, độc lập và chịu trách nhiệm với lựa chọn cá nhân.',
        'Tinh thần tự lực cánh sinh, không muốn dựa dẫm hay phụ thuộc vào người khác.'
      ],
      shadows: [
        'Dễ rơi vào cái bẫy cô lập, độc đoán hoặc khó lắng nghe góc nhìn của tập thể.',
        'Xu hướng sốt ruột, nóng vội khi người khác không theo kịp tốc độ của mình.',
        'Khó khăn trong việc nhờ cậy sự giúp đỡ vì sợ bị đánh giá là yếu kém.'
      ],
      growthLessons: [
        'Học cách lãnh đạo bằng sự truyền cảm hứng thay vì áp đặt ý chí.',
        'Nhận thức rằng độc lập không đồng nghĩa với đơn độc; biết đồng hành là sức mạnh lớn nhất.'
      ],
      microAction: 'Áp dụng nguyên tắc "Lắng nghe trước khi chỉ đạo": Hãy để người khác nói trọn vẹn quan điểm trước khi đưa ra kết luận.'
    },

    2: {
      number: 2,
      archetype: 'Sứ Giả Hòa Giải & Thấu Cảm',
      keyword: 'Kết nối, Lắng nghe, Hòa ái, Trực giác ngoại cảm',
      element: 'Nước',
      energy: 'Năng lượng âm mềm mại, có khả năng dung dưỡng, kết nối và cảm nhận tinh tế.',
      strengths: [
        'Khả năng thấu cảm sâu sắc, cảm nhận tinh tế năng lượng và cảm xúc của người đối diện.',
        'Tài năng ngoại giao, hòa giải xung đột và tạo dựng môi trường gắn kết hòa bình.',
        'Kiên nhẫn, trung thành và là người đồng hành đáng tin cậy trong các mối quan hệ.'
      ],
      shadows: [
        'Dễ bị tổn thương bởi lời nói vô tình, hay suy nghĩ quá nhiều và giữ ấm ức trong lòng.',
        'Xu hướng do dự, sợ mâu thuẫn nên thường né tránh đối đầu hoặc cam chịu thiệt thòi.',
        'Dễ đánh mất chính kiến cá nhân để làm hài lòng người khác.'
      ],
      growthLessons: [
        'Rèn luyện tính quyết đoán và học cách nói "Không" với những yêu cầu vượt quá giới hạn.',
        'Thiết lập ranh giới cảm xúc lành mạnh để không hấp thụ năng lượng tiêu cực từ môi trường.'
      ],
      microAction: 'Thực hành "Ranh giới 3 giây": Khi ai đó nhờ vả, hãy dừng lại 3 giây tự hỏi "Mình có thực sự thoải mái làm điều này không?" trước khi gật đầu.'
    },

    3: {
      number: 3,
      archetype: 'Người Truyền Cảm Hứng & Biểu Đạt',
      keyword: 'Sáng tạo, Hoạt ngôn, Lạc quan, Tỏa sáng tinh thần',
      element: 'Gió',
      energy: 'Năng lượng tươi vui, phóng khoáng, khát khao bộc lộ cảm xúc và truyền lửa tích cực.',
      strengths: [
        'Tư duy sáng tạo dồi dào, khả năng biến ý tưởng thành ngôn từ, hình ảnh hoặc câu chuyện cuốn hút.',
        'Tính cách hoạt bát, khiếu hài hước tự nhiên, dễ lan tỏa niềm vui và sự lạc quan cho đám đông.',
        'Khả năng thích ứng giao tiếp linh hoạt, dễ hòa nhập trong nhiều môi trường khác nhau.'
      ],
      shadows: [
        'Dễ bị phân tán nguồn lực, làm việc theo cảm hứng thất thường, đầu voi đuôi chuột.',
        'Xu hướng né tránh những cuộc đối thoại nghiêm túc bằng vẻ ngoài đùa cợt hoặc hời hợt.',
        'Nhạy cảm với sự chỉ trích, dễ xuống tinh thần khi không nhận được sự công nhận.'
      ],
      growthLessons: [
        'Học cách đưa sự sáng tạo vào kỷ luật thực thi đều đặn mỗi ngày.',
        'Chuyển hóa cảm xúc bề nổi thành chiều sâu nhận thức và lời nói có trọng lượng.'
      ],
      microAction: 'Kỹ thuật "Pomodoro 25 phút sáng tạo": Đặt chuông 25 phút tập trung làm trọn vẹn 1 ý tưởng mà không mở mạng xã hội.'
    },

    4: {
      number: 4,
      archetype: 'Kiến Trúc Sư Nền Tảng & Kỷ Luật',
      keyword: 'Trật tự, Thực tế, Kiên định, Hệ thống vững chắc',
      element: 'Đất',
      energy: 'Năng lượng quy chuẩn, vững chãi, hướng tới sự ổn định, an toàn và kết quả đo đếm được.',
      strengths: [
        'Tư duy logic, chặt chẽ, có năng lực tổ chức, lập quy trình và quản trị chi tiết xuất sắc.',
        'Tính kiên nhẫn cao, đáng tin cậy, làm việc có phương pháp và kiên trì theo đuổi mục tiêu.',
        'Xem trọng sự trung thực, chuẩn mực đạo đức và các giá trị thực tế bền vững.'
      ],
      shadows: [
        'Xu hướng bảo thủ, cứng nhắc, khó chấp nhận sự thay đổi đột ngột hoặc các ý tưởng phá cách.',
        'Dễ bị sa lầy vào tiểu tiết, nhìn thấy rủi ro nhiều hơn cơ hội, khiến bản thân căng thẳng.',
        'Đôi khi quá nghiêm khắc với bản thân và người khác, thiếu sự linh hoạt và mềm mỏng.'
      ],
      growthLessons: [
        'Học cách đón nhận sự linh hoạt và hiểu rằng sự không hoàn hảo cũng là một phần của tự nhiên.',
        'Mở rộng góc nhìn để nhìn thấy bức tranh toàn cảnh thay vì chỉ chăm chú vào quy trình.'
      ],
      microAction: 'Thực hành "Khoảng hở linh hoạt": Trong lịch làm việc mỗi ngày, hãy để trống 30 phút cho những việc phát sinh ngoài dự kiến.'
    },

    5: {
      number: 5,
      archetype: 'Nhà Thám Hiểm Tự Do & Đột Phá',
      keyword: 'Linh hoạt, Thích ứng, Trải nghiệm, Đổi mới tiến bộ',
      element: 'Gió / Lửa',
      energy: 'Năng lượng biến chuyển nhanh, khao khát tự do khám phá và phá vỡ các giới hạn gò bó.',
      strengths: [
        'Khả năng thích ứng siêu việt với biến động, dễ dàng xoay chuyển tình thế trong nghịch cảnh.',
        'Tư duy mở, cấp tiến, không ngại thử nghiệm cái mới và sở hữu nguồn năng lượng sống dồi dào.',
        'Sức hút cá nhân tự nhiên, giao thiệp rộng và khả năng kết nối đa dạng tầng lớp.'
      ],
      shadows: [
        'Dễ chán nản trước các công việc lặp đi lặp lại, thiếu kiên nhẫn để đào sâu vào chuyên môn.',
        'Dễ bốc đồng, bị cám dỗ bởi sự tự do nhất thời dẫn đến lãng phí thời gian và nguồn lực.',
        'Xu hướng cả thèm chóng chán, bắt đầu nhiều việc nhưng khó duy trì cam kết dài hạn.'
      ],
      growthLessons: [
        'Nhận thức sâu sắc rằng tự do chân chính chỉ có được khi có sự tự kỷ luật (Self-discipline).',
        'Học cách Neo giữ tâm trí vào các giá trị cốt lõi thay vì chạy theo cảm giác hưng phấn bên ngoài.'
      ],
      microAction: 'Quy tắc "Tạm dừng 5 giây": Trước khi đưa ra phản ứng tức thời hoặc muốn hủy bỏ một kế hoạch, hãy hít thở sâu 5 giây để lý trí bắt kịp cảm xúc.'
    },

    6: {
      number: 6,
      archetype: 'Người Chăm Sóc & Trách Nhiệm Yêu Thương',
      keyword: 'Bảo bọc, Trách nhiệm, Thẩm mỹ, Chữa lành mái ấm',
      element: 'Đất / Nước',
      energy: 'Năng lượng ấm áp, hướng về mái ấm, sự chở che, công bằng và gắn kết gia đình - tập thể.',
      strengths: [
        'Trái tim nhân hậu, bản năng chăm sóc, nuôi dưỡng và bảo vệ người thân yêu vô điều kiện.',
        'Tinh thần trách nhiệm rất cao, luôn là chỗ dựa tinh thần vững chãi cho bạn bè và đồng nghiệp.',
        'Gu thẩm mỹ tinh tế, có khiếu bài trí không gian sống hài hòa, ấm cúng và đầy tính nghệ thuật.'
      ],
      shadows: [
        'Xu hướng ôm đồm, lo lắng thái quá và can thiệp sâu vào cuộc sống của người khác dưới danh nghĩa yêu thương.',
        'Dễ rơi vào vai "nạn nhân" hoặc thất vọng, tủi thân khi người khác không đáp lại tương xứng.',
        'Khó chấp nhận sự không hoàn hảo ở người thân, dễ biến sự chăm sóc thành sự kiểm soát.'
      ],
      growthLessons: [
        'Học cách tôn trọng hành trình và bài học trưởng thành riêng của người khác mà không can thiệp.',
        'Yêu thương bản thân trước tiên; không hy sinh đến mức làm kiệt quệ năng lượng của chính mình.'
      ],
      microAction: 'Thực hành "Ủy quyền trọn vẹn": Hãy bàn giao 1 việc chăm sóc gia đình/nhóm cho người khác và hoàn toàn không nhắc nhở hay can thiệp vào cách họ làm.'
    },

    7: {
      number: 7,
      archetype: 'Nhà Tư Tưởng & Chiêm Nghiệm Trí Tuệ',
      keyword: 'Chân lý, Chiều sâu, Tĩnh lặng, Trực giác tri thức',
      element: 'Nước / Khí',
      energy: 'Năng lượng hướng nội, truy cầu bản chất sâu xa của cuộc sống, tri thức và quy luật vũ trụ.',
      strengths: [
        'Khả năng quan sát sắc bén, tư duy phản biện độc lập và năng lực tự học, nghiên cứu chuyên sâu.',
        'Trực giác nhạy bén, có khả năng nhìn thấu bản chất vấn đề xuyên qua những hiện tượng bề mặt.',
        'Nội lực tinh thần mạnh mẽ, coi trọng sự thật, tính trung thực và các giá trị tri thức uyên bác.'
      ],
      shadows: [
        'Xu hướng thu mình, khép kín, đa nghi và khó mở lòng tin tưởng hoàn toàn vào người khác.',
        'Dễ rơi vào trạng thái suy nghĩ quá mức (Overthinking), phân tích quá độ dẫn đến tê liệt hành động.',
        'Đôi khi tỏ ra xa cách, lạnh lùng hoặc xem thường những quan điểm thiếu tính học thuật.'
      ],
      growthLessons: [
        'Học cách tin tưởng vào dòng chảy cuộc sống và kết nối trái tim song song với trí tuệ lý trí.',
        'Chia sẻ những tri thức đúc kết được cho cộng đồng thay vì giữ riêng trong tháp ngà cô độc.'
      ],
      microAction: 'Thực hành "Xả tâm trí cuối ngày": Dành 15 phút viết tự do ra giấy mọi suy nghĩ đang trăn trở, sau đó gấp sổ lại để tâm trí được nghỉ ngơi hoàn toàn.'
    },

    8: {
      number: 8,
      archetype: 'Nhà Điều Hành & Hiện Thực Hóa Thành Tựu',
      keyword: 'Quyền lực, Tài chính, Điều hành, Hiệu quả thực tế',
      element: 'Đất / Kim',
      energy: 'Năng lượng quy mô, định hướng kết quả rõ ràng, làm chủ nguồn lực vật chất và tổ chức.',
      strengths: [
        'Tầm nhìn thực tế sắc bén, bản lĩnh thương trường, nhạy bén với cơ hội tài chính và kinh doanh.',
        'Năng lực lãnh đạo, tổ chức bộ máy và quản trị nguồn lực hướng tới hiệu suất tối đa.',
        'Sức bật lớn sau thất bại, kiên cường vượt qua nghịch cảnh và xem khó khăn là bàn đạp thành công.'
      ],
      shadows: [
        'Dễ bị cuốn vào vòng xoáy công việc, tiền bạc, địa vị mà bỏ quên đời sống cảm xúc và sức khỏe.',
        'Xu hướng kiểm soát gắt gao, khắt khe với cấp dưới và đo lường mọi giá trị bằng hiệu quả vật chất.',
        'Khó bộc lộ sự yếu đuối, luôn mang chiếc mặt nạ mạnh mẽ khiến bản thân chịu nhiều áp lực thầm kín.'
      ],
      growthLessons: [
        'Hiểu rằng thành công đích thực là sự cân bằng giữa tài chính, mối quan hệ và an lạc nội tâm.',
        'Sử dụng quyền lực và nguồn lực như công cụ để nâng đỡ và trao quyền cho người khác cùng thịnh vượng.'
      ],
      microAction: 'Thực hành "Giao tiếp trắc ẩn": Khi đánh giá công việc, hãy dành 2 phút hỏi thăm chân thành về cảm xúc và đời sống của cộng sự trước khi bàn đến số liệu.'
    },

    9: {
      number: 9,
      archetype: 'Người Phụng Sự & Khai Sáng Nhân Đạo',
      keyword: 'Bao dung, Lý tưởng, Phụng sự, Trực giác toàn cầu',
      element: 'Lửa / Nước',
      energy: 'Năng lượng tâm thức bao la, vượt trên cái tôi cá nhân, hướng tới lợi ích cộng đồng nhân loại.',
      strengths: [
        'Lòng trắc ẩn rộng lớn, tư duy nhân văn sâu sắc, luôn trăn trở cống hiến cho những lý tưởng cao đẹp.',
        'Tầm nhìn vĩ mô, khả năng truyền cảm hứng, thu hút lòng tin nhờ sự chính trực và tấm lòng vị tha.',
        'Tâm thế cởi mở, không định kiến, dễ tha thứ và có năng khiếu nghệ thuật, tâm lý bẩm sinh.'
      ],
      shadows: [
        'Dễ bị lý tưởng hóa thực tế, thiếu thực tế trong quản lý tài chính và kế hoạch triển khai cụ thể.',
        'Khó buông bỏ quá khứ, hay mang gánh nặng tâm lý của người khác khiến bản thân dễ kiệt sức.',
        'Đôi khi nghiêm khắc với những tiêu chuẩn đạo đức cao thượng khiến người xung quanh thấy áp lực.'
      ],
      growthLessons: [
        'Học cách Buông bỏ những điều không thể thay đổi và chấp nhận tính bất toàn của con người.',
        'Xây dựng nền tảng tài chính và thực tế vững vàng làm bệ đỡ vững chắc cho các dự án phụng sự.'
      ],
      microAction: 'Thực hành "Buông bỏ 1 kỳ vọng": Viết ra 1 việc mà bạn đang thất vọng về ai đó, nhận diện rằng họ có giới hạn riêng, và chủ động tha thứ trong tâm trí.'
    },

    11: {
      number: 11,
      archetype: 'Ngọn Hải Đăng Trực Giác & Khai Sáng',
      keyword: 'Trực giác cao độ, Thấu cảm tâm linh, Cảm hứng tinh thần',
      element: 'Ánh sáng / Khí',
      energy: 'Master Number sở hữu trực giác sắc bén của số 11 và sự thấu cảm hòa hợp của số 2.',
      strengths: [
        'Trực giác tâm linh cực kỳ chuẩn xác, cảm nhận năng lượng và tương lai trước khi sự việc xảy ra.',
        'Khả năng truyền cảm hứng mạnh mẽ, đánh thức tiềm năng tinh thần của người khác một cách tự nhiên.',
        'Tâm hồn thanh khiết, kết nối sâu sắc với các giá trị chân lý và đạo đức cao quý.'
      ],
      shadows: [
        'Hệ thần kinh nhạy cảm cao độ, dễ bị choáng ngợp bởi năng lượng tiêu cực hoặc đám đông náo động.',
        'Hay hoài nghi năng lực của chính mình, dao động giữa lý tưởng vĩ đại và nỗi sợ thất bại đời thường.',
        'Dễ căng thẳng tinh thần, mất ngủ hoặc lo âu nếu không có khoảng thời gian tĩnh lặng tái tạo.'
      ],
      growthLessons: [
        'Học cách tiếp đất (Grounding) để đưa những linh cảm trực giác thành hành động cụ thể trong đời sống.',
        'Bảo vệ năng lượng cá nhân, rèn luyện sự bình an nội tại trước những xáo động ngoại cảnh.'
      ],
      microAction: 'Bài tập "Tiếp đất 5 phút": Đi chân trần trên cỏ hoặc ngồi tĩnh lặng hít thở sâu, hình dung năng lượng kết nối từ lòng bàn chân vững chãi vào lòng đất.'
    },

    22: {
      number: 22,
      archetype: 'Kiến Tạo Bậc Thầy & Xây Dựng Hệ Thống',
      keyword: 'Tầm nhìn vĩ mô, Kiến tạo thực tế, Hệ thống di sản',
      element: 'Đất / Kim tinh hoa',
      energy: 'Master Number quyền lực nhất: Kết hợp trực giác vĩ đại của số 11 với tính kỷ luật nền tảng của số 4.',
      strengths: [
        'Khả năng nhìn thấy bức tranh lớn cấp tiến và đồng thời biết cách xây từng viên gạch để hiện thực hóa.',
        'Năng lực biến những ý tưởng trừu tượng, phức tạp thành các tổ chức, hệ sinh thái hoặc công trình thực tế.',
        'Ý chí thép, tinh thần phụng sự lớn lao và khát vọng để lại di sản trường tồn cho thế hệ sau.'
      ],
      shadows: [
        'Áp lực trách nhiệm đè nặng khủng khiếp; cảm giác một mình phải gánh vác cả thế giới.',
        'Hội chứng cầu toàn cực đoan: Sợ sai sót, khó lòng ủy quyền cho người khác vì sợ họ làm hỏng việc.',
        'Dễ rơi vào khủng hoảng hiện sinh nếu cảm thấy tài năng của mình bị lãng phí trong môi trường nhỏ hẹp.'
      ],
      growthLessons: [
        'Học cách kiên nhẫn với tốc độ của cộng sự; một hệ thống vĩ đại cần sự chung tay của cả tập thể.',
        'Chia nhỏ các đại công trình thành các cột mốc khả thi và trân trọng từng bước tiến khiêm tốn mỗi ngày.'
      ],
      microAction: 'Thực hành "Ủy quyền 3 cấp độ": Chọn 1 khâu quan trọng, hướng dẫn kỹ lưỡng cho cộng sự và chấp nhận họ hoàn thành ở mức 80% tiêu chuẩn của bạn để họ học hỏi.'
    },

    33: {
      number: 33,
      archetype: 'Bậc Thầy Chữa Lành & Tình Thương Phổ Quát',
      keyword: 'Tình yêu vô điều kiện, Nâng đỡ tinh thần, Chữa lành xã hội',
      element: 'Nước / Ánh sáng',
      energy: 'Master Number biểu trưng cho tình mẫu tử tâm linh, tình yêu thương vị tha và năng lực chữa lành.',
      strengths: [
        'Trái tim ấm áp lạ kỳ, có năng lực chữa lành vết thương tâm hồn của người khác bằng sự hiện diện.',
        'Khả năng nâng đỡ tinh thần tập thể, là ngọn đuốc sưởi ấm trong những giai đoạn khó khăn nhất.',
        'Sống mẫu mực, tràn đầy sự hy sinh cao cả vì hạnh phúc của tha nhân.'
      ],
      shadows: [
        'Dễ gánh vác quá nhiều nỗi đau của thế gian dẫn đến kiệt quệ thể xác và tâm hồn (Savior Complex).',
        'Có xu hướng bao bọc quá mức khiến người khác trở nên ỷ lại và không tự chịu trách nhiệm về cuộc đời họ.',
        'Quên mất việc chăm sóc chính bản thân mình.'
      ],
      growthLessons: [
        'Học cách chữa lành chính mình trước khi dang tay cứu giúp người khác.',
        'Nhận thức rằng tôn trọng nỗi đau của người khác cũng là một phần của tình yêu thương trí tuệ.'
      ],
      microAction: 'Thực hành "Tự ôm ấp chính mình": Mỗi tối trước khi ngủ, đặt tay lên ngực và gửi lời cảm ơn tới cơ thể cùng trái tim đã nỗ lực phụng sự suốt ngày dài.'
    }
  };

  // ==========================================================================
  // II. TẦNG BỘ LỌC VỊ TRÍ: POSITION PROFILES (23 Chỉ Số & Các Chỉ Số Thời Gian)
  // ==========================================================================
  const POSITION_PROFILES = {
    // --- TẦNG 1: CORE PROFILE ---
    duongDoi: {
      key: 'duongDoi',
      name: 'Đường đời',
      tier: 'CORE',
      role: 'Con đường phát triển dài hạn',
      question: 'Tôi đang học cách sống và tiến hóa như thế nào?',
      focus: 'Hành trình dài hạn, các trải nghiệm cần tích lũy và bài học tiến hóa chủ đạo của kiếp sống.'
    },
    suMenh: {
      key: 'suMenh',
      name: 'Sứ mệnh',
      tier: 'CORE',
      role: 'Hướng đóng góp & Giá trị tạo ra',
      question: 'Tôi có xu hướng tạo giá trị gì cho thế giới?',
      focus: 'Phương thức cống hiến, trách nhiệm xã hội và di sản thực tế bạn mang đến cho cộng đồng.'
    },
    linhHon: {
      key: 'linhHon',
      name: 'Linh hồn',
      tier: 'CORE',
      role: 'Nhu cầu nội tâm sâu thẳm',
      question: 'Điều gì thực sự thúc đẩy và nuôi dưỡng tôi từ bên trong?',
      focus: 'Động lực vô thức, khao khát của trái tim và điều mang lại cảm giác thỏa nguyện đích thực.'
    },
    nhanCach: {
      key: 'nhanCach',
      name: 'Nhân cách',
      tier: 'CORE',
      role: 'Ấn tượng & Biểu hiện bên ngoài',
      question: 'Người khác có thể cảm nhận phong thái của tôi như thế nào?',
      focus: 'Hình ảnh xã hội, phong cách giao tiếp, lăng kính người ngoài nhìn vào bạn.'
    },
    ngaySinh: {
      key: 'ngaySinh',
      name: 'Ngày sinh',
      tier: 'CORE',
      role: 'Năng khiếu tự nhiên bẩm sinh',
      question: 'Tôi có năng lực tự nhiên nào dễ bộc lộ nhất?',
      focus: 'Công cụ hỗ trợ bẩm sinh, tài năng đặc thù mang theo để khởi động hành trình sống.'
    },
    thaiDo: {
      key: 'thaiDo',
      name: 'Thái độ',
      tier: 'CORE',
      role: 'Cách phản ứng & Tiếp cận ban đầu',
      question: 'Tôi thường tiếp cận tình huống mới và đối diện khó khăn như thế nào?',
      focus: 'Bản năng phản xạ tức thời, lăng kính đầu tiên khi đón nhận thông tin hoặc thử thách bất ngờ.'
    },
    tuDuyLyTri: {
      key: 'tuDuyLyTri',
      name: 'Tư duy lý trí',
      tier: 'CORE',
      role: 'Phương thức tư duy & Xử lý thông tin',
      question: 'Tôi xử lý, phân tích và đưa ra quyết định bằng lý trí như thế nào?',
      focus: 'Cơ chế phân tích logic, bộ lọc dữ liệu và cách giải quyết bài toán thực tế.'
    },
    canBang: {
      key: 'canBang',
      name: 'Cân bằng',
      tier: 'CORE',
      role: 'Điểm tựa phục hồi & Cân bằng cảm xúc',
      question: 'Tôi cần làm gì để lấy lại trạng thái an định khi gặp khủng hoảng hoặc áp lực?',
      focus: 'Cách thức tự xoa dịu, tái tạo năng lượng và cân bằng tâm trí khi chông chênh.'
    },
    damMe: {
      key: 'damMe',
      name: 'Đam mê',
      tier: 'CORE',
      role: 'Nguồn hứng khởi & Thôi thúc tự nhiên',
      question: 'Điều gì dễ kích hoạt trạng thái say mê và năng lượng dồi dào trong tôi?',
      focus: 'Sở thích, nguồn cảm hứng bất tận giúp bạn làm việc say sưa và đạt trạng thái dòng chảy (flow).'
    },
    sucManhTiemThuc: {
      key: 'sucManhTiemThuc',
      name: 'Sức mạnh tiềm thức',
      tier: 'CORE',
      role: 'Nguồn lực tiềm ẩn & Điểm tựa trực giác',
      question: 'Nguồn lực nào có thể được huy động khi gặp thử thách lớn?',
      focus: 'Nội lực sâu kín dưới tầng ý thức giúp bạn bật dậy sau những thử thách lớn.'
    },

    // --- TẦNG 2: DEVELOPMENT ---
    truongThanh: {
      key: 'truongThanh',
      name: 'Trưởng thành',
      tier: 'DEVELOPMENT',
      role: 'Hướng phát triển trưởng thành',
      question: 'Tôi có xu hướng chuyển hóa thành người như thế nào sau tuổi 30-35?',
      focus: 'Sự đơm hoa kết trái của trí tuệ sau khi tích lũy trải nghiệm và năng lực làm chủ cuộc đời.'
    },
    chiSoThieu: {
      key: 'chiSoThieu',
      name: 'Chỉ số thiếu',
      tier: 'DEVELOPMENT',
      role: 'Vùng năng lượng cần chủ động rèn luyện',
      question: 'Năng lượng nào cần được chủ động bổ khuyết để bản thân trở nên hoàn thiện?',
      focus: 'Những bài tập rèn luyện hàng ngày nhằm bồi đắp những mảnh ghép còn thiếu.'
    },
    lkDuongDoiSuMenh: {
      key: 'lkDuongDoiSuMenh',
      name: 'Liên kết Đường đời – Sứ mệnh',
      tier: 'DEVELOPMENT',
      role: 'Cầu nối giữa Con đường & Đóng góp',
      question: 'Con đường phát triển cá nhân có hỗ trợ hay tạo xung đột với hướng đóng góp xã hội?',
      focus: 'Sự đồng điệu giữa việc rèn luyện bản thân và việc tạo ra giá trị cho cuộc đời.'
    },
    lkNhanCachLinhHon: {
      key: 'lkNhanCachLinhHon',
      name: 'Liên kết Nhân cách – Linh hồn',
      tier: 'DEVELOPMENT',
      role: 'Cầu nối Bên ngoài ↔ Bên trong',
      question: 'Hình ảnh xã hội bên ngoài có phản ánh trung thực nhu cầu tâm hồn bên trong không?',
      focus: 'Sự thống nhất giữa cái tôi biểu hiện và con người chân thật bên trong.'
    },
    noNghiep: {
      key: 'noNghiep',
      name: 'Nợ nghiệp',
      tier: 'DEVELOPMENT',
      role: 'Bài học phát triển tâm thức',
      question: 'Thói quen tiềm thức nào cần được soi sáng và chuyển hóa?',
      focus: 'Sự tỉnh thức trước những bài học lặp lại để chuyển hóa thành trí tuệ vượt bậc.'
    },

    // --- TẦNG 3: LIFE STAGES (CHẶNG & THỬ THÁCH) ---
    chang1: { key: 'chang1', name: 'Chặng 1', tier: 'STAGE', role: 'Chủ đề đỉnh cao giai đoạn thiếu niên - lập thân', question: 'Giai đoạn này vũ trụ tạo bối cảnh để tôi rèn luyện năng lượng gì?' },
    chang2: { key: 'chang2', name: 'Chặng 2', tier: 'STAGE', role: 'Chủ đề đỉnh cao giai đoạn xây dựng sự nghiệp', question: 'Trọng tâm phát triển và cơ hội thăng tiến của chặng này là gì?' },
    chang3: { key: 'chang3', name: 'Chặng 3', tier: 'STAGE', role: 'Chủ đề đỉnh cao giai đoạn khẳng định vị thế & chín muồi', question: 'Thời kỳ này tôi được thôi thúc tạo ra thành tựu gì?' },
    chang4: { key: 'chang4', name: 'Chặng 4', tier: 'STAGE', role: 'Chủ đề đỉnh cao giai đoạn viên mãn & truyền thừa di sản', question: 'Giai đoạn hậu vận hướng tới sự an lạc và đúc kết giá trị gì?' },
    thuThach1: { key: 'thuThach1', name: 'Thử thách 1', tier: 'STAGE', role: 'Bài toán phát triển Chặng 1', question: 'Trở ngại tâm lý cần vượt qua trong chặng đầu đời?' },
    thuThach2: { key: 'thuThach2', name: 'Thử thách 2', tier: 'STAGE', role: 'Bài toán phát triển Chặng 2', question: 'Ngưỡng cản cần chuyển hóa trong chặng thứ hai?' },
    thuThach3: { key: 'thuThach3', name: 'Thử thách 3', tier: 'STAGE', role: 'Bài toán phát triển Chặng 3', question: 'Bài tập tinh thần cần vượt qua trong chặng thứ ba?' },
    thuThach4: { key: 'thuThach4', name: 'Thử thách 4', tier: 'STAGE', role: 'Bài toán phát triển Chặng 4', question: 'Khúc mắc cần giải tỏa để đạt tới sự viên mãn?' },

    // --- TẦNG 4: TIME CYCLES ---
    namCaNhan: {
      key: 'namCaNhan',
      name: 'Năm cá nhân',
      tier: 'TIME',
      role: 'Chủ đề phát triển của năm',
      question: 'Năm nay vũ trụ mời gọi tôi tập trung vào điều gì?',
      focus: 'Chiến lược hành động và định hướng ưu tiên phù hợp với mùa vụ năng lượng 1-9.'
    },
    thangCaNhan: {
      key: 'thangCaNhan',
      name: 'Tháng cá nhân',
      tier: 'TIME',
      role: 'Trọng tâm hành động trong tháng',
      question: 'Tháng này tôi nên ưu tiên điều gì trong bối cảnh của năm?',
      focus: 'Nhịp điệu trung hạn, sự phối hợp giữa bài học năm và hành động cụ thể tháng.'
    },
    ngayCaNhan: {
      key: 'ngayCaNhan',
      name: 'Ngày cá nhân',
      tier: 'TIME',
      role: 'Nhịp năng lượng trong ngày',
      question: 'Hôm nay tôi nên chú ý điều gì để đồng điệu với tháng và năm?',
      focus: 'Sự chánh niệm trong từng khoảnh khắc và bước đi vi mô mỗi ngày.'
    }
  };

  // ==========================================================================
  // III. MATRIX DIỄN GIẢI POSITION-AWARE CHO TỪNG CON SỐ TẠI TỪNG VỊ TRÍ
  // (Đảm bảo 100% CÙNG MỘT SỐ ở các vị trí khác nhau có lời văn & góc nhìn khác nhau)
  // ==========================================================================
  const POSITION_FACETS = {
    // 1. ĐƯỜNG ĐỜI (Life Path): Con đường tiến hóa & bài học dài hạn
    duongDoi: {
      1: {
        meaning: 'Hành trình cuộc đời bạn là con đường rèn luyện tính độc lập, tự chủ và bản lĩnh tiên phong. Bạn học bài học về việc đứng vững trên đôi chân của mình, dám đưa ra quyết định đầu tiên và dẫn dắt người khác bằng tấm gương tự lực.',
        positive: 'Khả năng khai phá lối đi riêng, sự kiên định trước sóng gió và tinh thần dám chịu trách nhiệm 100% về số phận.',
        shadow: 'Dễ rơi vào cảm giác đơn độc, bảo thủ hoặc cố chấp không chịu đón nhận ý kiến đóng góp.',
        observation: 'Quan sát xem bạn có đang ôm đồm mọi việc một mình vì sợ người khác làm chậm hơn bạn hay không.',
        action: 'Tập trao quyền: Trong mỗi dự án, hãy giao trọn vẹn 1 phần việc cho người khác và chỉ theo dõi kết quả cuối cùng.'
      },
      2: {
        meaning: 'Hành trình cuộc đời bạn là con đường học cách lắng nghe, hợp tác và trở thành nhịp cầu hòa giải. Bạn tiến hóa thông qua nghệ thuật kết nối, xây dựng các mối quan hệ hòa ái và rèn luyện trực giác thấu cảm tinh tế.',
        positive: 'Tài năng ngoại giao tự nhiên, khả năng xoa dịu căng thẳng và tạo dựng sự gắn kết bền vững cho tập thể.',
        shadow: 'Dễ thỏa hiệp quá mức, né tránh đối đầu hoặc kìm nén cảm xúc cá nhân vì sợ làm mất lòng người khác.',
        observation: 'Quan sát xem bạn có đang nói "Có" khi trong lòng thực sự muốn nói "Không" hay không.',
        action: 'Thiết lập ranh giới: Tập từ chối những lời nhờ vả làm kiệt sức bạn với thái độ hòa nhã nhưng dứt khoát.'
      },
      3: {
        meaning: 'Hành trình cuộc đời bạn là con đường của sự biểu đạt, sáng tạo và lan tỏa niềm vui sống. Bạn học cách chuyển hóa tư tưởng và cảm xúc thành ngôn từ, nghệ thuật hoặc các giải pháp truyền cảm hứng lay động lòng người.',
        positive: 'Tư duy sáng tạo dồi dào, khả năng giao tiếp duyên dáng và tinh thần lạc quan truyền lửa cho cộng đồng.',
        shadow: 'Dễ làm việc tùy hứng, phân tán năng lượng vào quá nhiều mối bận tâm và khó duy trì kỷ luật dài hạn.',
        observation: 'Quan sát xem bạn có đang bắt đầu rất nhiều dự án nhưng lại bỏ dở giữa chừng khi cảm hứng ban đầu qua đi.',
        action: 'Quy tắc một việc: Chọn 1 ý tưởng quan trọng nhất và cam kết làm việc 30 phút mỗi ngày cho đến khi hoàn thành.'
      },
      4: {
        meaning: 'Hành trình cuộc đời bạn là con đường xây dựng nền tảng vững chắc, trật tự và kỷ luật thực thi bền bỉ. Bạn tiến hóa thông qua việc thiết lập các quy trình bài bản, tạo dựng sự an toàn và biến ý tưởng thành kết quả đo đếm được.',
        positive: 'Độ tin cậy tuyệt đối, tư duy logic thực tế và năng lực quản trị công việc bền bỉ như kim tự tháp.',
        shadow: 'Dễ trở nên cứng nhắc, bảo thủ, nhìn thấy rủi ro nhiều hơn cơ hội và ngại đón nhận những thay đổi mới.',
        observation: 'Quan sát xem bạn có đang khó chịu quá mức khi kế hoạch không diễn ra đúng 100% như dự tính.',
        action: 'Khoảng hở linh hoạt: Dành ra 20% thời gian trong tuần để thử nghiệm cách làm mới mà không bị gò bó vào quy trình cũ.'
      },
      5: {
        meaning: 'Hành trình cuộc đời bạn là con đường của sự khai phóng, trải nghiệm đa chiều và dũng cảm đón nhận đổi mới. Bạn học bài học về sự tự do thông qua việc không ngừng mở rộng ranh giới trải nghiệm nhưng vẫn giữ vững định hướng cốt lõi.',
        positive: 'Bản lĩnh thích ứng phi thường trước mọi biến cố cuộc đời; khả năng khai mở những chân trời mới.',
        shadow: 'Dễ bị phân tán nguồn lực, sống phụ thuộc vào cảm xúc hưng phấn nhất thời hoặc cả thèm chóng chán.',
        observation: 'Quan sát xem bạn có đang vội vã từ bỏ một mục tiêu quan trọng chỉ vì cảm thấy nó bắt đầu trở nên lặp lại và nhàm chán.',
        action: 'Thiết lập cấu trúc linh hoạt: Lên khung cố định cho 2-3 việc trọng tâm mỗi ngày, sau đó giữ khoảng tự do cho trải nghiệm mới.'
      },
      6: {
        meaning: 'Hành trình cuộc đời bạn là con đường của tình yêu thương, sự chăm sóc và trách nhiệm phụng dưỡng gia đình - cộng đồng. Bạn tiến hóa thông qua việc tạo dựng mái ấm bình yên, chữa lành tổn thương và gìn giữ sự hài hòa.',
        positive: 'Trái tim bao dung, tinh thần cống hiến quên mình và năng lực kiến tạo môi trường sống ấm áp, đầy tính thẩm mỹ.',
        shadow: 'Dễ can thiệp quá sâu vào cuộc sống của người khác, ôm đồm trách nhiệm và tự biến mình thành nạn nhân kiệt quệ.',
        observation: 'Quan sát xem bạn có đang cảm thấy tủi thân vì cho đi quá nhiều mà không nhận lại được sự công nhận tương xứng.',
        action: 'Chăm sóc bản thân trước: Dành ít nhất 30 phút mỗi ngày để nuông chiều sức khỏe và cảm xúc của chính mình.'
      },
      7: {
        meaning: 'Hành trình cuộc đời bạn là con đường truy cầu chân lý, đào sâu tri thức và chiêm nghiệm tâm thức. Bạn tiến hóa thông qua việc học tập độc lập, trải nghiệm thử thách để đúc kết thành trí tuệ uyên thâm soi sáng nhân sinh.',
        positive: 'Tư duy phản biện sắc bén, khả năng nhìn thấu bản chất vấn đề và chiều sâu tâm linh, tri thức uyên bác.',
        shadow: 'Dễ khép kín, đa nghi, cô lập bản thân trong tháp ngà lý thuyết và suy nghĩ quá nhiều dẫn đến bất an.',
        observation: 'Quan sát xem bạn có đang dựng lên bức tường ngăn cách cảm xúc với những người xung quanh vì sợ bị tổn thương.',
        action: 'Mở lòng chia sẻ: Hãy mang những hiểu biết sâu sắc của bạn ra trao đổi và lắng nghe góc nhìn đời thường của người khác.'
      },
      8: {
        meaning: 'Hành trình cuộc đời bạn là con đường của sự làm chủ nguồn lực vật chất, quyền lực điều hành và hiện thực hóa thành tựu. Bạn học bài học về việc sử dụng sức mạnh tài chính và tổ chức như một phương tiện công chính để nâng đỡ cuộc sống.',
        positive: 'Bản lĩnh thương trường, tầm nhìn chiến lược thực tế và năng lực quản trị quy mô hướng tới hiệu suất cao.',
        shadow: 'Dễ bị cuốn vào tham vọng vật chất, kiểm soát khắt khe và đo lường mọi giá trị bằng tiền bạc hay danh vị.',
        observation: 'Quan sát xem bạn có đang hy sinh thời gian bên gia đình và sức khỏe để đổi lấy những con số trên báo cáo tài chính.',
        action: 'Lãnh đạo bằng sự trắc ẩn: Khi đưa ra quyết định kinh doanh, hãy cân nhắc thêm yếu tố hạnh phúc và sự phát triển của con người.'
      },
      9: {
        meaning: 'Hành trình cuộc đời bạn là con đường của lòng bao dung, lý tưởng nhân đạo và phụng sự đại chúng. Bạn tiến hóa thông qua việc buông bỏ cái tôi cá nhân nhỏ hẹp, mở rộng trái tim vị tha và cống hiến cho những giá trị tiến bộ của nhân loại.',
        positive: 'Lòng trắc ẩn bao la, tầm nhìn vĩ mô và sức hút tự nhiên từ một nhân cách chính trực, cao đẹp.',
        shadow: 'Dễ rơi vào trạng thái lý tưởng hóa xa vời, khó tha thứ cho những khiếm khuyết đời thường và hay gánh vác nỗi buồn thiên hạ.',
        observation: 'Quan sát xem bạn có đang thất vọng vì mọi người xung quanh không sống theo những tiêu chuẩn đạo đức cao của bạn.',
        action: 'Thực tế hóa lý tưởng: Gắn mỗi ước mơ cao đẹp với một kế hoạch hành động cụ thể, bắt đầu từ việc giúp đỡ một người ngay trước mắt.'
      },
      11: {
        meaning: 'Hành trình cuộc đời bạn là con đường của ngọn hải đăng trực giác và sự thức tỉnh tâm linh. Bạn được mời gọi trở thành người truyền cảm hứng, kết nối tinh tế giữa thế giới ý niệm cao cả với đời sống thực tại.',
        positive: 'Trực giác siêu nhạy, khả năng thấu cảm tâm linh và năng lực đánh thức tiềm năng tinh thần của người khác.',
        shadow: 'Hệ thần kinh nhạy cảm cao độ, dễ bị stress, lo âu và dao động giữa lý tưởng vĩ đại và nỗi sợ hãi đời thường.',
        observation: 'Quan sát xem bạn có đang để những suy nghĩ lo âu thái quá làm phân tán năng lượng hành động trong hiện tại.',
        action: 'Tiếp đất mỗi ngày: Dành 10 phút tập thể dục, đi bộ ngoài thiên nhiên hoặc hít thở sâu để đưa tâm trí về với thực tại.'
      },
      22: {
        meaning: 'Hành trình cuộc đời bạn là con đường của Kiến Trúc Sư Bậc Thầy: Biến những tầm nhìn vĩ mô thành các công trình, hệ thống hoặc tổ chức có sức ảnh hưởng trường tồn. Bạn học cách kết hợp trực giác lớn với kỷ luật thép.',
        positive: 'Tầm nhìn thực tế vĩ đại, năng lực kiến tạo hệ sinh thái bền vững và khát vọng để lại di sản phục vụ muôn người.',
        shadow: 'Áp lực trách nhiệm đè nặng khủng khiếp; hội chứng cầu toàn và xu hướng tự làm tất cả vì sợ người khác không đạt chuẩn.',
        observation: 'Quan sát xem bạn có đang tự vắt kiệt sức lực của mình dưới áp lực của những mục tiêu quá lớn.',
        action: 'Chia nhỏ đại công trình: Lập kế hoạch theo từng giai đoạn 3 tháng và kiên nhẫn xây dựng từng viên gạch nền tảng cùng cộng sự.'
      },
      33: {
        meaning: 'Hành trình cuộc đời bạn là con đường của bậc thầy nâng đỡ và chữa lành tình thương phổ quát. Bạn học bài học về tình yêu thương vô điều kiện và phụng sự nhân loại bằng tấm lòng vị tha cao cả.',
        positive: 'Năng lực chữa lành tâm hồn, sự ấm áp bao dung và khả năng dẫn dắt tinh thần tập thể hướng tới sự an lạc.',
        shadow: 'Dễ rơi vào hội chứng người cứu rỗi (Savior Complex), hy sinh bản thân quá mức và can thiệp vào bài học của người khác.',
        observation: 'Quan sát xem bạn có đang kiệt quệ vì gánh vác quá nhiều nỗi đau và vấn đề của người khác.',
        action: 'Chữa lành chính mình: Nhận thức rằng việc bạn an vui, trọn vẹn chính là món quà chữa lành lớn nhất cho thế giới.'
      }
    },

    // 2. SỨ MỆNH (Destiny): Hướng đóng góp & dấu ấn tạo giá trị
    suMenh: {
      1: {
        meaning: 'Sứ mệnh của bạn là trở thành người tiên phong khai mở, dẫn đầu và thúc đẩy những sáng kiến mới. Thế giới cần bạn ở vai trò người đứng mũi chịu sào, dám mở đường và truyền bản lĩnh tự lập cho cộng đồng.',
        positive: 'Năng lực khởi xướng dự án xuất sắc, tinh thần dám nghĩ dám làm mang lại luồng sinh khí mới cho tổ chức.',
        shadow: 'Dễ áp đặt cách làm của mình lên người khác hoặc mất kiên nhẫn khi phải hướng dẫn người chưa có kinh nghiệm.',
        action: 'Tạo giá trị: Hãy đảm nhận vai trò khởi động các dự án mới, sau đó chuyển giao cho đội ngũ vận hành.'
      },
      2: {
        meaning: 'Sứ mệnh của bạn là trở thành sứ giả hòa bình, xây dựng cầu nối hợp tác và dung dưỡng sự gắn kết. Bạn tạo ra giá trị thông qua việc lắng nghe, đàm phán tế nhị và tạo môi trường làm việc hòa hợp.',
        positive: 'Tài năng kết nối con người, kiến tạo văn hóa đồng thuận và phát huy sức mạnh tập thể.',
        shadow: 'Ngại đưa ra các quyết định khó khăn mang tính cắt giảm hoặc kỷ luật vì sợ làm mất hòa khí.',
        action: 'Tạo giá trị: Đóng vai trò cố vấn, hòa giải hoặc chuyên gia xây dựng mối quan hệ chiến lược.'
      },
      3: {
        meaning: 'Sứ mệnh của bạn là truyền cảm hứng, lan tỏa thông điệp tích cực và làm đẹp cuộc đời bằng sự sáng tạo. Bạn cống hiến cho xã hội thông qua ngôn từ, nghệ thuật, giảng dạy hoặc các phương tiện truyền thông giàu cảm xúc.',
        positive: 'Khả năng khuấy động tinh thần đám đông, biến những nội dung khô khan thành câu chuyện đầy cuốn hút.',
        shadow: 'Dễ bị cuốn vào việc tìm kiếm sự tán thưởng bề nổi mà quên đi chiều sâu thực chất của giá trị.',
        action: 'Tạo giá trị: Sử dụng giọng nói, bài viết hoặc tác phẩm của bạn để nâng đỡ tinh thần người khác mỗi tuần.'
      },
      4: {
        meaning: 'Sứ mệnh của bạn là kiến tạo trật tự, chuẩn hóa quy trình và xây dựng nền tảng vững chắc cho tổ chức. Thế giới cần bạn ở vai trò người thiết lập hệ thống, quản trị chất lượng và đảm bảo sự vận hành ổn định.',
        positive: 'Khả năng biến sự hỗn loạn thành trật tự ngăn nắp, tạo lập các chuẩn mực bền vững cho tương lai.',
        shadow: 'Dễ tạo ra các thủ tục rườm rà, quan liêu làm kìm hãm sự sáng tạo của người khác.',
        action: 'Tạo giá trị: Đóng gói các tài liệu, quy trình làm việc chuẩn (SOP) giúp đồng nghiệp làm việc dễ dàng hơn.'
      },
      5: {
        meaning: 'Sứ mệnh của bạn là trở thành chất xúc tác cho sự đổi mới, kết nối văn hóa và thúc đẩy tiến bộ xã hội. Bạn tạo giá trị bằng việc phá vỡ các rào cản cũ kỹ, đưa vào những phương pháp tiên tiến và kết nối các nguồn lực.',
        positive: 'Năng lực đổi mới tư duy, truyền bá ý tưởng tiến bộ và khơi dậy tinh thần dám thử nghiệm trong tổ chức.',
        shadow: 'Dễ tạo ra quá nhiều xáo trộn không cần thiết khiến những người yêu thích sự ổn định cảm thấy bất an.',
        action: 'Tạo giá trị: Đề xuất các giải pháp cải tiến linh hoạt trong công việc và tiên phong thử nghiệm cái mới.'
      },
      6: {
        meaning: 'Sứ mệnh của bạn là phụng dưỡng, bảo bọc và nâng cao chất lượng cuộc sống cho gia đình và cộng đồng. Bạn cống hiến qua việc tạo dựng môi trường yêu thương, chăm sóc sức khỏe, giáo dục hoặc làm đẹp không gian sống.',
        positive: 'Sự tận tụy chăm sóc, khả năng chữa lành vết thương và lan tỏa tình người ấm áp đến những người xung quanh.',
        shadow: 'Xu hướng kiểm soát thái quá và kỳ vọng người khác phải tuân theo tiêu chuẩn hạnh phúc của bạn.',
        action: 'Tạo giá trị: Tham gia hoặc khởi xướng các hoạt động thiện nguyện, chăm sóc người yếu thế trong cộng đồng.'
      },
      7: {
        meaning: 'Sứ mệnh của bạn là người truy tầm tri thức, nghiên cứu chuyên sâu và truyền trao sự thông thái. Thế giới cần bạn ở vai trò nhà tư tưởng, chuyên gia phân tích hoặc người dẫn đường bằng chân lý khoa học và tâm thức.',
        positive: 'Khả năng đúc kết những nguyên lý phức tạp thành tri thức ứng dụng, nâng cao tầm hiểu biết của xã hội.',
        shadow: 'Có xu hướng giữ tri thức cho riêng mình hoặc truyền đạt với thái độ cao ngạo, xa cách.',
        action: 'Tạo giá trị: Viết lách, giảng dạy hoặc chia sẻ những đúc kết chuyên môn của bạn cho những người đang tìm đường.'
      },
      8: {
        meaning: 'Sứ mệnh của bạn là kiến tạo sự thịnh vượng, điều hành nguồn lực và hiện thực hóa các mục tiêu kinh tế lớn. Bạn cống hiến bằng việc tạo công ăn việc làm, xây dựng doanh nghiệp vững mạnh và thúc đẩy dòng chảy tài chính đạo đức.',
        positive: 'Năng lực tạo ra của cải vật chất, điều phối bộ máy hiệu quả và tạo bệ phóng phát triển cho nhiều người.',
        shadow: 'Dễ xem trọng lợi nhuận hơn con người, tạo áp lực quá tải lên cấp dưới.',
        action: 'Tạo giá trị: Sử dụng nguồn lực tài chính và ảnh hưởng của bạn để đầu tư vào các dự án mang lại giá trị bền vững.'
      },
      9: {
        meaning: 'Sứ mệnh của bạn là cống hiến cho các lý tưởng nhân văn, xóa bỏ định kiến và phụng sự đại chúng. Bạn tạo dấu ấn bằng việc đấu tranh cho sự công bằng, nâng đỡ tinh thần và lan tỏa tình yêu thương không biên giới.',
        positive: 'Trái tim vì cộng đồng, khả năng thu hút sự ủng hộ của đông đảo quần chúng nhờ sự chính trực.',
        shadow: 'Dễ rơi vào trạng thái nói nhiều hơn làm nếu thiếu kế hoạch tài chính và hành động thực tế.',
        action: 'Tạo giá trị: Gắn công việc hàng ngày của bạn với một mục tiêu phát triển bền vững hoặc nâng đỡ cộng đồng.'
      },
      11: {
        meaning: 'Sứ mệnh của bạn là người truyền bá cảm hứng tâm linh, nâng cao nhận thức và làm cầu nối tinh thần cho thế hệ mới. Bạn mang đến ánh sáng thấu hiểu và xoa dịu những hoang mang của thời đại.',
        positive: 'Khả năng đánh thức niềm tin và trực giác trong lòng người khác, mở ra những góc nhìn cao đẹp.',
        shadow: 'Dễ cảm thấy bất lực khi đối diện với mặt tối của thực tại xã hội.',
        action: 'Tạo giá trị: Thực hành làm gương sống chân thật và truyền cảm hứng qua lối sống tỉnh thức mỗi ngày.'
      },
      22: {
        meaning: 'Sứ mệnh của bạn là nhà kiến tạo vĩ mô: Xây dựng các thiết chế, tổ chức hoặc công trình có sức ảnh hưởng sâu rộng đến đời sống của hàng ngàn con người. Bạn để lại di sản thực tế trường tồn.',
        positive: 'Năng lực biến những giấc mơ nhân loại thành hệ thống vận hành thực tế và hiệu quả.',
        shadow: 'Áp lực khủng khiếp của sứ mệnh lớn khiến bạn dễ rơi vào trầm cảm hoặc xa rời đời sống cá nhân.',
        action: 'Tạo giá trị: Tập trung xây dựng một mô hình giải pháp có thể nhân bản và chuyển giao cho thế hệ sau.'
      },
      33: {
        meaning: 'Sứ mệnh của bạn là ngọn đuốc sưởi ấm, phụng sự tình thương và chữa lành nỗi đau nhân thế. Bạn tạo dấu ấn bằng sự hiện diện từ bi và khả năng nâng đỡ tinh thần cho những tâm hồn tổn thương.',
        positive: 'Sức mạnh chữa lành bằng tình thương chân thật, đem lại sự an vui và tái sinh niềm tin cho con người.',
        shadow: 'Dễ gánh vác quá nhiều nỗi đau dẫn đến kiệt quệ năng lượng của bản thân.',
        action: 'Tạo giá trị: Lan tỏa sự tử tế qua các hành động chăm sóc thiết thực và lắng nghe sâu mỗi ngày.'
      }
    },

    // 3. LINH HỒN (Soul Urge): Khát khao nội tâm & điều mang lại cảm giác thỏa nguyện
    linhHon: {
      1: {
        meaning: 'Nội tâm bạn khao khát sâu sắc sự tự do quyết định và được công nhận như một cá nhân độc lập, xuất sắc. Bạn chỉ thực sự hạnh phúc khi được tự mình làm chủ cuộc chơi và không bị ai áp đặt.',
        positive: 'Lòng tự trọng cao, nguồn động lực tự thân mãnh liệt không cần ai phải thúc giục.',
        shadow: 'Nỗi sợ vô thức về việc bị kiểm soát hoặc bị coi là kẻ tầm thường khiến bạn dễ gồng mình căng thẳng.',
        observation: 'Quan sát xem bạn có đang phòng thủ thái quá khi ai đó đưa ra lời khuyên chân thành.',
        action: 'Nuôi dưỡng linh hồn: Dành cho mình một khoảng không gian riêng nơi bạn hoàn toàn tự do làm theo ý mình.'
      },
      2: {
        meaning: 'Nội tâm bạn khao khát sự thấu hiểu, gắn kết chân thành và cảm giác bình yên trong các mối quan hệ. Bạn cảm thấy ấm áp và hạnh phúc nhất khi được yêu thương, lắng nghe và ở bên cạnh người bạn tri kỷ.',
        positive: 'Tâm hồn nhạy cảm, giàu lòng trắc ẩn và khả năng cảm nhận vẻ đẹp tinh tế của cuộc sống.',
        shadow: 'Nỗi sợ bị bỏ rơi hoặc sợ cô đơn khiến bạn dễ bám víu cảm xúc hoặc chịu đựng sự bất công để giữ hòa khí.',
        observation: 'Quan sát xem bạn có đang hạ thấp nhu cầu của mình để làm vừa lòng người khác hay không.',
        action: 'Nuôi dưỡng linh hồn: Tự dành cho mình những buổi hẹn hò một mình trong không gian yên tĩnh và dịu êm.'
      },
      3: {
        meaning: 'Nội tâm bạn khao khát được tự do bộc lộ cảm xúc, được cười đùa, sáng tạo và nhận được sự hưởng ứng từ người xung quanh. Sự buồn tẻ và những quy tắc cứng nhắc là liều thuốc độc cho tâm hồn bạn.',
        positive: 'Tâm hồn trẻ thơ trong trẻo, khả năng tự tạo niềm vui và nhìn thấy mặt tích cực trong nghịch cảnh.',
        shadow: 'Dễ cảm thấy cô đơn tột cùng sau những cuộc vui ồn ào nếu không tìm được người thực sự hiểu chiều sâu của mình.',
        observation: 'Quan sát xem bạn có đang dùng vẻ ngoài hóm hỉnh để che đậy nỗi buồn thầm kín bên trong.',
        action: 'Nuôi dưỡng linh hồn: Viết nhật ký, vẽ tranh hoặc ca hát tự do mỗi tuần mà không cần ai chấm điểm.'
      },
      4: {
        meaning: 'Nội tâm bạn khao khát sự an toàn, trật tự, rõ ràng và ổn định. Bạn cảm thấy an tâm và thư thái nhất khi mọi thứ trong cuộc sống có kế hoạch, đồ đạc ngăn nắp và tương lai được chuẩn bị chu đáo.',
        positive: 'Nội tâm vững vàng, coi trọng sự chính trực và có khả năng kiên trì vượt qua mọi thăng trầm.',
        shadow: 'Dễ rơi vào trạng thái lo âu, căng thẳng tột độ khi xuất hiện những biến động bất ngờ nằm ngoài dự kiến.',
        observation: 'Quan sát xem bạn có đang cố gắng kiểm soát mọi thứ quá mức đến mức không thể thư giãn.',
        action: 'Nuôi dưỡng linh hồn: Thiết lập một góc làm việc thật ngăn nắp và thực hành bài tập buông lỏng kiểm soát 15 phút mỗi ngày.'
      },
      5: {
        meaning: 'Nội tâm bạn khao khát sự tự do tuyệt đối, không gian phiêu lưu và sự linh hoạt đổi mới. Bạn cảm thấy ngột ngạt khi bị giam cầm trong những lịch trình đơn điệu và luôn thôi thúc khám phá điều mới mẻ.',
        positive: 'Tâm hồn rộng mở, dũng cảm khám phá và tràn đầy sự tò mò say mê với cuộc đời.',
        shadow: 'Dễ cảm thấy bồn chồn, bất an nếu phải ở một chỗ quá lâu; dễ nhầm lẫn giữa tự do với sự trốn tránh cam kết.',
        observation: 'Quan sát xem bạn có đang muốn bỏ chạy khỏi một mối quan hệ hay công việc chỉ vì nó đòi hỏi sự kiên nhẫn.',
        action: 'Nuôi dưỡng linh hồn: Lên kế hoạch cho một chuyến đi ngắn hoặc thử một trải nghiệm hoàn toàn mới mỗi tháng.'
      },
      6: {
        meaning: 'Nội tâm bạn khao khát được yêu thương, chăm sóc và chở che cho những người thân yêu. Bạn tìm thấy sự thỏa nguyện sâu xa khi mái ấm gia đình hạnh phúc và những người xung quanh cảm thấy bình an.',
        positive: 'Trái tim ấm áp, bản năng nuôi dưỡng dịu dàng và lòng tận tụy vô bờ bến với tổ ấm.',
        shadow: 'Nỗi lo sợ thường trực về việc người thân gặp chuyện chẳng lành, dễ sinh tâm lý bảo bọc kiểm soát.',
        observation: 'Quan sát xem bạn có đang quên mất bản thân mình để chăm lo cho mọi người xung quanh hay không.',
        action: 'Nuôi dưỡng linh hồn: Tự thưởng cho bản thân một buổi thư giãn spa, đọc sách hoặc nghe nhạc mà không phải lo việc nhà.'
      },
      7: {
        meaning: 'Nội tâm bạn khao khát sự tĩnh lặng, riêng tư và không gian để đào sâu vào các câu hỏi triết lý lớn của cuộc đời. Bạn cần những khoảng lặng một mình để nạp lại năng lượng và kết nối với bản thể sâu xa.',
        positive: 'Chiều sâu tâm linh uyên bác, trực giác bén nhạy và khả năng tìm thấy sự an lạc trong cô độc thanh khiết.',
        shadow: 'Dễ cảm thấy bị kiệt quệ nếu phải giao tiếp xã hội liên tục; dễ hoài nghi và xa cách với thế giới.',
        observation: 'Quan sát xem bạn có đang tự cô lập mình quá mức khiến người thân cảm thấy khó tiếp cận bạn.',
        action: 'Nuôi dưỡng linh hồn: Dành riêng 1 buổi tối mỗi tuần trong tĩnh lặng hoàn toàn, đọc sách hoặc thiền định.'
      },
      8: {
        meaning: 'Nội tâm bạn khao khát sự tự chủ về tài chính, quyền lực điều hành và khả năng tự quyết số phận mình. Bạn muốn nắm giữ nguồn lực đủ lớn để bảo vệ gia đình và hiện thực hóa các tham vọng lớn.',
        positive: 'Khát vọng vươn lên mạnh mẽ, lòng tự tôn kiên cường và ý chí không bao giờ chấp nhận đầu hàng số phận.',
        shadow: 'Nỗi sợ sâu kín về sự bất lực, nghèo túng hoặc bị người khác lấn lướt khiến bạn dễ tạo vỏ bọc lạnh lùng.',
        observation: 'Quan sát xem bạn có đang đo lường giá trị của bản thân chỉ qua số dư tài khoản ngân hàng.',
        action: 'Nuôi dưỡng linh hồn: Thực hành bài tập cảm nhận sự đủ đầy từ bên trong, nhận diện những giá trị vô hình không thể mua bằng tiền.'
      },
      9: {
        meaning: 'Nội tâm bạn khao khát được sống vì một lý tưởng cao đẹp, được phụng sự và góp phần chữa lành thế giới. Bạn cảm thấy có ý nghĩa nhất khi biết rằng sự tồn tại của mình đã làm vơi bớt nỗi khổ của một ai đó.',
        positive: 'Tâm hồn thánh thiện, lòng vị tha bao dung và khả năng thấu cảm với nỗi đau của nhân loại.',
        shadow: 'Dễ cảm thấy lạc lõng, thất vọng sâu sắc khi thực tế xã hội quá trần trụi và toan tính.',
        observation: 'Quan sát xem bạn có đang ôm giữ quá nhiều nỗi buồn của người khác khiến năng lượng của mình bị chìm đắm.',
        action: 'Nuôi dưỡng linh hồn: Tham gia một dự án thiện nguyện nhỏ hoặc viết nhật ký biết ơn những điều tử tế quanh bạn.'
      },
      11: {
        meaning: 'Nội tâm bạn khao khát sự thanh khiết tâm linh, sự thấu cảm tinh thần và những mối liên kết linh hồn sâu sắc. Bạn muốn sống chân thật tuyệt đối với trực giác và các giá trị đạo đức cao thượng.',
        positive: 'Sự nhạy cảm giác quan thứ sáu, tâm hồn trong sáng như gương và kết nối tinh tế với vũ trụ.',
        shadow: 'Dễ bị tổn thương sâu sắc bởi những lời nói thô bạo hoặc sự giả tạo trong môi trường sống.',
        observation: 'Quan sát xem bạn có đang bị quá tải bởi những xung động năng lượng tiêu cực xung quanh.',
        action: 'Nuôi dưỡng linh hồn: Tạo một góc thiền hoặc không gian thanh tịnh với nến thơm, âm nhạc tĩnh lặng để thanh lọc tâm trí.'
      },
      22: {
        meaning: 'Nội tâm bạn mang khát vọng kiến tạo phi thường: Muốn xây dựng một điều gì đó mang tầm vóc lịch sử cho cộng đồng. Bạn không thỏa mãn với những mục tiêu nhỏ hẹp mà luôn hướng tới tầm nhìn vĩ mô.',
        positive: 'Ý chí kiên định phi thường, lý tưởng xây dựng di sản và niềm tin vào khả năng biến điều không thể thành có thể.',
        shadow: 'Cảm giác sốt ruột và thất vọng tột độ khi nguồn lực thực tế chưa đáp ứng được tầm nhìn khổng lồ trong đầu.',
        observation: 'Quan sát xem bạn có đang tự trừng phạt bản thân vì chưa đạt được những thành tựu vĩ đại như mong đợi.',
        action: 'Nuôi dưỡng linh hồn: Học cách trân trọng từng bước tiến nhỏ mỗi ngày và ghi nhận nỗ lực của chính mình.'
      },
      33: {
        meaning: 'Nội tâm bạn khao khát được yêu thương và chở che vô điều kiện, muốn làm vơi đi gánh nặng của những người cùng khổ. Bạn tìm thấy sự bình an tối thượng khi trái tim được rộng mở phụng sự.',
        positive: 'Tình mẫu tử tâm linh rộng lớn, năng lực chữa lành tự nhiên bằng sự lắng nghe và tình thương chân thật.',
        shadow: 'Dễ quên mất chính mình, tự hủy hoại sức khỏe vì mải lo cho người khác.',
        action: 'Nuôi dưỡng linh hồn: Hãy ôm lấy đứa trẻ bên trong bạn và tự nói lời yêu thương với chính cơ thể mình mỗi ngày.'
      }
    },

    // 4. NHÂN CÁCH (Personality): Ấn tượng bên ngoài & phong thái giao tiếp
    nhanCach: {
      1: {
        meaning: 'Người khác thường cảm nhận ở bạn ấn tượng của sự mạnh mẽ, tự tin, độc lập và quyết đoán. Bạn toát lên phong thái của một người dẫn đầu có chính kiến rõ ràng, không dễ bị chi phối hay lấn lướt.',
        positive: 'Tạo cảm giác an tâm, tin cậy về năng lực giải quyết vấn đề và sự dứt khoát trong hành động.',
        shadow: 'Đôi khi có thể bị người khác nhìn nhận là lạnh lùng, khó gần, độc đoán hoặc hơi kiêu ngạo.',
        observation: 'Quan sát ngôn ngữ cơ thể của bạn: Liệu bạn có đang vô tình tạo khoảng cách với người đối diện.',
        action: 'Điều chỉnh phong thái: Nở nụ cười ấm áp hơn và chủ động đặt câu hỏi thăm hỏi người khác trước khi bàn công việc.'
      },
      2: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái dịu dàng, lịch thiệp, dễ mến và thấu hiểu. Bạn tạo cho người đối diện cảm giác an toàn, dễ chịu và sẵn sàng tâm sự những điều thầm kín.',
        positive: 'Khả năng thu hút lòng tin nhờ sự chân thành, khiêm nhường và lắng nghe tinh tế.',
        shadow: 'Đôi khi có thể bị nhìn nhận là thiếu quyết đoán, yếu đuối hoặc quá rụt rè trước đám đông.',
        observation: 'Quan sát xem bạn có đang hạ giọng quá nhỏ hoặc né tránh giao tiếp bằng ánh mắt khi phát biểu.',
        action: 'Điều chỉnh phong thái: Tập đứng thẳng lưng, nhìn thẳng vào mắt người đối diện và nói với âm lượng rõ ràng, tự tin.'
      },
      3: {
        meaning: 'Người khác thường cảm nhận ở bạn ấn tượng của sự tươi vui, hoạt bát, hóm hỉnh và tràn đầy năng lượng sống. Bạn là thỏi nam châm thu hút sự chú ý trong các buổi gặp gỡ nhờ khiếu ăn nói duyên dáng.',
        positive: 'Mang lại bầu không khí vui vẻ, dễ hòa đồng và tạo cảm giác thân thiện ngay từ lần gặp đầu tiên.',
        shadow: 'Đôi khi có thể bị đánh giá là hơi hời hợt, nói nhiều hơn làm hoặc thiếu sự nghiêm túc đúng lúc.',
        observation: 'Quan sát xem bạn có đang ngắt lời người khác để kể câu chuyện của mình hay không.',
        action: 'Điều chỉnh phong thái: Thực hành lắng nghe trọn vẹn và dừng lại 3 giây trước khi tung ra câu đùa tiếp theo.'
      },
      4: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái chững chạc, nghiêm túc, đáng tin cậy và có tổ chức. Cách ăn mặc chỉn chu, lời nói chắc nịch tạo nên hình ảnh của một chuyên gia bài bản.',
        positive: 'Tạo dựng uy tín vững chắc, được đồng nghiệp và đối tác tin tưởng giao phó các trọng trách quan trọng.',
        shadow: 'Đôi khi tạo cảm giác cứng nhắc, khó tính, thiếu tính hài hước và quá nguyên tắc.',
        observation: 'Quan sát nét mặt của bạn: Liệu bạn có đang hay cau mày hoặc tỏ vẻ nghiêm nghị quá mức.',
        action: 'Điều chỉnh phong thái: Thả lỏng cơ mặt, cởi mở đón nhận các câu chuyện vui đùa nhẹ nhàng ngoài giờ làm việc.'
      },
      5: {
        meaning: 'Người khác thường cảm nhận ở bạn một nguồn năng lượng sống động, phóng khoáng, trẻ trung và sức hút tự nhiên. Bạn tạo ấn tượng là người cởi mở, dễ gần, thích phiêu lưu và không thích bị đóng khung.',
        positive: 'Dễ kết nối xã hội, mang lại luồng gió mới tươi vui, truyền cảm hứng đổi mới cho tập thể.',
        shadow: 'Đôi khi bị người khác hiểu lầm là thiếu cam kết, khó đoán định hoặc quá tùy hứng trong công việc.',
        observation: 'Quan sát xem bạn có đang dễ thất hứa các cuộc hẹn nhỏ vì mải chạy theo việc phát sinh khác.',
        action: 'Điều chỉnh phong thái: Thực hành giao tiếp cam kết: Khi hứa hẹn điều gì, hãy xác nhận rõ mốc thời gian và chủ động cập nhật.'
      },
      6: {
        meaning: 'Người khác thường cảm nhận ở bạn hình ảnh ấm áp, chu đáo, đáng tin cậy và tràn đầy tình mẫu tử/phụ tử. Bạn toát lên vẻ đẹp hài hòa, gu thẩm mỹ tinh tế và sự quan tâm chân thành đến người xung quanh.',
        positive: 'Tạo cảm giác như được trở về nhà, được chở che và chăm sóc bằng tình cảm chân thật.',
        shadow: 'Đôi khi có thể bị nhìn nhận là hay lo chuyện bao đồng, thích kiểm soát hoặc can thiệp sâu vào việc riêng của người khác.',
        observation: 'Quan sát xem bạn có đang đưa ra lời khuyên khi đối phương chưa hề yêu cầu sự giúp đỡ.',
        action: 'Điều chỉnh phong thái: Hãy là bờ vai lắng nghe im lặng trước khi vội vã đưa ra giải pháp hay sự chăm sóc.'
      },
      7: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái trầm tĩnh, đăm chiêu, bí ẩn và có chiều sâu tri thức. Bạn tạo ấn tượng là người thông minh, quan sát sắc sảo và không dễ bị lôi kéo bởi những trào lưu bề nổi.',
        positive: 'Khí chất thông thái uyên bác, tạo sự kính nể và tôn trọng tự nhiên từ những người xung quanh.',
        shadow: 'Đôi khi tạo cảm giác lạnh lùng, xa cách, khó gần hoặc kiêu kỳ khiến người khác e dè không dám tiếp cận.',
        observation: 'Quan sát xem bạn có đang giữ im lặng quá lâu trong các cuộc trò chuyện thân mật.',
        action: 'Điều chỉnh phong thái: Chủ động chia sẻ một góc nhìn ấm áp hoặc một lời khen chân thành để rút ngắn khoảng cách xã hội.'
      },
      8: {
        meaning: 'Người khác thường cảm nhận ở bạn ấn tượng của sự quyền lực, sang trọng, tự tin và có năng lực điều hành vượt trội. Bạn toát lên khí chất của một người thành đạt, thực tế và có sức ảnh hưởng lớn.',
        positive: 'Tạo niềm tin mạnh mẽ về năng lực lãnh đạo, sự đàng hoàng và bản lĩnh giải quyết các bài toán lớn.',
        shadow: 'Đôi khi tạo cảm giác áp đảo, khắt khe, thực dụng hoặc khiến người khác cảm thấy bị lép vế.',
        observation: 'Quan sát giọng điệu của bạn: Liệu bạn có đang ra lệnh thay vì đưa ra lời đề nghị hợp tác.',
        action: 'Điều chỉnh phong thái: Sử dụng ngôn từ mang tính ghi nhận và trao quyền nhiều hơn khi giao tiếp với cộng sự.'
      },
      9: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái bao dung, đĩnh đạc, ấm áp và có tinh thần thượng võ. Bạn toát lên sức hút của một người giàu lòng nhân ái, hiểu biết rộng và không so đo tính toán thiệt hơn.',
        positive: 'Thu hút sự kính trọng và quý mến từ đa dạng tầng lớp xã hội nhờ tấm lòng rộng mở.',
        shadow: 'Đôi khi tạo cảm giác hơi xa cách kiểu "thầy đời" hoặc bị người khác lợi dụng sự cả nể, hào phóng.',
        observation: 'Quan sát xem bạn có đang nhận lời giúp đỡ tất cả mọi người đến mức không còn thời gian cho chính mình.',
        action: 'Điều chỉnh phong thái: Rèn luyện sự hào phóng đi đôi với sự tỉnh táo và ranh giới rõ ràng.'
      },
      11: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái thanh tao, nhạy cảm, tinh tế và phảng phất sự bí ẩn tâm linh. Bạn có ánh mắt sáng, trực giác sắc sảo và khả năng thấu hiểu người khác qua từng cử chỉ nhỏ.',
        positive: 'Tạo cảm giác được soi sáng, truyền cảm hứng và đánh thức niềm tin tinh thần mạnh mẽ.',
        shadow: 'Đôi khi tạo cảm giác mỏng manh, căng thẳng hoặc quá nhạy cảm trước những lời nói đùa vô hại.',
        action: 'Điều chỉnh phong thái: Giữ tư thế vững chãi, hơi thở đều đặn để tạo sự tiếp đất ổn định khi giao tiếp.'
      },
      22: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái của một nhà lãnh đạo tầm cỡ: Vừa có tầm nhìn bao quát sâu rộng, vừa có sự thực tế sắc sảo và ý chí sắt đá. Bạn toát lên uy lực kiến tạo phi thường.',
        positive: 'Tạo niềm tin tuyệt đối vào khả năng hiện thực hóa những mục tiêu vĩ đại nhất của tập thể.',
        shadow: 'Đôi khi tạo ra áp lực khủng khiếp cho người xung quanh vì tiêu chuẩn công việc quá cao.',
        action: 'Điều chỉnh phong thái: Học cách ghi nhận những nỗ lực từng bước của đội ngũ thay vì chỉ nhìn vào đích đến cuối cùng.'
      },
      33: {
        meaning: 'Người khác thường cảm nhận ở bạn phong thái từ ái, ấm áp dịu dàng như một người thầy tâm linh hoặc người mẹ hiền. Sự hiện diện của bạn tự nhiên mang lại cảm giác bình yên và chữa lành.',
        positive: 'Năng lực xoa dịu những căng thẳng xã hội, truyền lan tình thương yêu và sự đoàn kết tự nhiên.',
        shadow: 'Dễ bị người khác tìm đến để trút bỏ rác cảm xúc khiến bạn bị quá tải năng lượng.',
        action: 'Điều chỉnh phong thái: Giữ tấm lòng từ bi nhưng có ranh giới bảo vệ trường năng lượng cá nhân.'
      }
    },

    // 5. TRƯỞNG THÀNH (Maturity): Hướng đơm hoa kết trái của cuộc đời sau 30-35 tuổi
    truongThanh: {
      1: {
        meaning: 'Khi bước vào giai đoạn trưởng thành (sau 30-35 tuổi), năng lượng của bạn sẽ hội tụ mạnh mẽ vào bản lĩnh độc lập và năng lực lãnh đạo tự thân. Bạn không còn tìm kiếm sự chấp thuận bên ngoài mà tự tin trở thành người làm chủ hoàn toàn cuộc đời mình.',
        positive: 'Sự tự tin vững chắc, bản lĩnh đứng đầu và năng lực khai phá những nấc thang sự nghiệp riêng biệt.',
        shadow: 'Nguy cơ trở nên độc đoán hơn nếu không học được bài học khiêm nhường trong giai đoạn tuổi trẻ.',
        action: 'Chuyển hóa trưởng thành: Tự mình khởi nghiệp hoặc chủ động dẫn dắt một dự án độc lập mang dấu ấn cá nhân.'
      },
      2: {
        meaning: 'Khi trưởng thành, bạn sẽ ngày càng nhận ra sức mạnh to lớn của sự thấu cảm, kết nối và trí tuệ hòa giải. Bạn trở thành bậc thầy về ngoại giao, xây dựng liên minh và kết nối con người bằng sự chân thành.',
        positive: 'Khả năng dung hòa các mối quan hệ phức tạp, sống an lạc và tạo dựng một vòng tròn bạn bè tri kỷ bền vững.',
        shadow: 'Dễ rơi vào sự phụ thuộc cảm xúc vào bạn đời hoặc đối tác nếu không giữ được cái tôi tự chủ.',
        action: 'Chuyển hóa trưởng thành: Đóng vai trò cố vấn chiến lược, xây dựng các mối quan hệ đối tác dựa trên nguyên tắc đôi bên cùng có lợi.'
      },
      3: {
        meaning: 'Khi trưởng thành, khả năng biểu đạt và sáng tạo của bạn sẽ kết hợp với kinh nghiệm sống để tạo nên những tác phẩm hoặc thông điệp có chiều sâu lay động lòng người. Bạn tỏa sáng bằng trí tuệ lạc quan và sự duyên dáng chín muồi.',
        positive: 'Khả năng truyền cảm hứng sâu sắc, biến trải nghiệm thăng trầm thành những bài học tươi vui cho cuộc sống.',
        shadow: 'Nguy cơ lãng phí tài năng vào những thú vui bề nổi nếu thiếu kỷ luật tập trung.',
        action: 'Chuyển hóa trưởng thành: Viết sách, giảng dạy hoặc xuất bản những công trình sáng tạo đúc kết từ cuộc đời bạn.'
      },
      4: {
        meaning: 'Khi trưởng thành, bạn sẽ xây dựng được một nền tảng vững như bàn thạch về cả tài chính, sự nghiệp và trật tự gia đình. Bạn trở thành chỗ dựa đáng tin cậy nhất cho tập thể và là người kiến tạo các quy chuẩn bền vững.',
        positive: 'Sự ổn định kiên cố, uy tín nghề nghiệp đỉnh cao và khả năng quản trị tài sản xuất sắc.',
        shadow: 'Nguy cơ bảo thủ hóa, đóng kín tư duy trước các xu hướng mới của thế hệ trẻ.',
        action: 'Chuyển hóa trưởng thành: Xây dựng các hệ thống tài sản tạo dòng tiền bền vững và chuyển giao quy trình cho cấp dưới.'
      },
      5: {
        meaning: 'Sau tuổi 30-35, năng lực thích ứng và tư duy cấp tiến của bạn sẽ chín muồi để chuyển hóa thành sự thông thái tự do thực thụ. Bạn học được cách bứt phá khỏi những khuôn mẫu định kiến cũ kỹ mà không cần nổi loạn hay làm tổn thương người khác.',
        positive: 'Sự tự do nội tâm vững chắc, làm chủ cuộc đời mà không bị ràng buộc bởi sự phán xét của xã hội.',
        shadow: 'Cảm giác sốt ruột nếu sự nghiệp bị đóng băng trong môi trường bảo thủ; nguy cơ xáo trộn cuộc sống đột ngột.',
        action: 'Chuyển hóa trưởng thành: Chủ động làm mới sự nghiệp: Tìm kiếm các dự án mang tính đột phá hoặc đổi mới phương pháp làm việc định kỳ.'
      },
      6: {
        meaning: 'Khi trưởng thành, trái tim bạn sẽ mở rộng để ôm trọn trách nhiệm yêu thương mái ấm và cộng đồng. Bạn tìm thấy niềm hạnh phúc viên mãn trong việc nuôi dạy con cái, chăm sóc gia đình và xây dựng không gian sống an lành.',
        positive: 'Tình yêu thương chín muồi, mái ấm gia đình hạnh phúc và sự kính trọng từ thế hệ con cháu.',
        shadow: 'Khó khăn trong việc buông tay để con cái tự lập, dễ can thiệp sâu vào cuộc sống của người thân.',
        action: 'Chuyển hóa trưởng thành: Học cách yêu thương có trí tuệ: Trao quyền tự do cho người thân tự chịu trách nhiệm về số phận họ.'
      },
      7: {
        meaning: 'Khi trưởng thành, bạn sẽ đạt tới độ chín về trí tuệ, chiêm nghiệm và chiều sâu tâm linh. Những trải nghiệm thăng trầm trước đó chuyển hóa thành sự thông thái giúp bạn nhìn thấu quy luật vận hành của cuộc đời.',
        positive: 'Sự an lạc nội tại, năng lực nghiên cứu uyên thâm và trở thành người thầy tinh thần đáng kính.',
        shadow: 'Nguy cơ thu mình vào ốc đảo cô độc, thờ ơ với đời sống xã hội thực tế.',
        action: 'Chuyển hóa trưởng thành: Đúc kết các bài học cuộc đời thành sách hoặc tài liệu hướng dẫn cho thế hệ đi sau.'
      },
      8: {
        meaning: 'Khi trưởng thành, năng lực quản trị tài chính và hiện thực hóa thành tựu của bạn sẽ đạt tới đỉnh cao. Bạn nắm giữ các nguồn lực vững mạnh và học được cách sử dụng quyền lực để tạo phúc lợi cho xã hội.',
        positive: 'Thành tựu vật chất vững chắc, vị thế xã hội cao quý và khả năng điều hành bộ máy quy mô lớn.',
        shadow: 'Nguy cơ bị cuốn vào lòng tham quyền lực hoặc cô độc trên đỉnh danh vọng.',
        action: 'Chuyển hóa trưởng thành: Chuyển dịch từ việc tích lũy tài sản cá nhân sang việc đầu tư phụng sự xã hội và thiện nguyện có chiến lược.'
      },
      9: {
        meaning: 'Khi trưởng thành, lòng bao dung và tầm nhìn nhân loại của bạn sẽ nở hoa trọn vẹn. Bạn không còn bận tâm về danh lợi cá nhân nhỏ hẹp mà cống hiến trọn vẹn tâm sức cho những lý tưởng phụng sự cao cả.',
        positive: 'Nhân cách cao thượng, sự thanh thản tâm hồn và di sản nhân văn để lại cho đời.',
        shadow: 'Dễ cảm thấy mỏi mệt nếu không biết buông xả những kỳ vọng vào con người.',
        action: 'Chuyển hóa trưởng thành: Tham gia các quỹ phát triển giáo dục, môi trường hoặc giúp đỡ cộng đồng một cách bền vững.'
      },
      11: {
        meaning: 'Khi trưởng thành, trực giác và ánh sáng tâm linh của bạn sẽ được kích hoạt ở tầm mức cao, giúp bạn trở thành ngọn đuốc soi sáng tinh thần cho cộng đồng.',
        positive: 'Khả năng kết nối tâm thức tinh tế, truyền cảm hứng sống tỉnh thức cho nhiều người.',
        shadow: 'Căng thẳng tinh thần nếu không cân bằng được đời sống thực tế với thế giới ý niệm.',
        action: 'Chuyển hóa trưởng thành: Thực hành chia sẻ các bài học về nhận thức và phát triển bản thân cho những người hữu duyên.'
      },
      22: {
        meaning: 'Khi trưởng thành, tầm nhìn và năng lực kiến tạo của bạn sẽ hội tụ đỉnh cao để xây dựng những công trình hoặc tổ chức có quy mô lớn lao, tạo nền tảng cho sự phát triển của nhiều thế hệ.',
        positive: 'Năng lực biến những đại ý tưởng thành hiện thực di sản có sức ảnh hưởng sâu rộng.',
        shadow: 'Áp lực khủng khiếp của trách nhiệm nếu không biết đào tạo đội ngũ kế thừa.',
        action: 'Chuyển hóa trưởng thành: Đào tạo thế hệ kế thừa và xây dựng cơ chế quản trị bền vững không phụ thuộc vào cá nhân bạn.'
      },
      33: {
        meaning: 'Khi trưởng thành, bạn đạt tới cảnh giới của tình yêu thương vị tha và năng lực chữa lành xã hội, mang lại sự ấm áp và bình yên cho muôn người.',
        positive: 'Trái tim từ bi vô lượng, sự an lạc tâm hồn và khả năng nâng đỡ tinh thần tập thể.',
        shadow: 'Dễ kiệt quệ thể xác nếu không biết chăm sóc sức khỏe bản thân.',
        action: 'Chuyển hóa trưởng thành: Dành thời gian dưỡng tâm, thiền định và lan tỏa tình yêu thương một cách tự nhiên.'
      }
    },

    // 6. NGÀY SINH (Birth Day): Năng khiếu tự nhiên bẩm sinh
    ngaySinh: {
      1: { meaning: 'Năng khiếu bẩm sinh về tính tự lập, khởi xướng nhanh và bản lĩnh đối đầu trực diện với thử thách mà không sợ hãi.' },
      2: { meaning: 'Năng khiếu bẩm sinh về trực giác thấu cảm, lắng nghe tinh tế và khả năng cảm nhận bầu không khí cảm xúc của người khác.' },
      3: { meaning: 'Năng khiếu bẩm sinh về ngôn từ, khiếu hài hước, tư duy sáng tạo hình ảnh và khả năng kết nối bạn bè nhanh chóng.' },
      4: { meaning: 'Năng khiếu bẩm sinh về sự cẩn trọng, tổ chức đồ đạc ngăn nắp, làm việc có phương pháp và ghi nhớ chi tiết logic.' },
      5: { meaning: 'Năng khiếu bẩm sinh về sự thích ứng linh hoạt, phản xạ nhanh trước tình huống bất ngờ và tinh thần dám thử cái mới.' },
      6: { meaning: 'Năng khiếu bẩm sinh về khiếu thẩm mỹ, sự khéo léo trong chăm sóc người khác và năng lực tạo dựng không gian ấm cúng.' },
      7: { meaning: 'Năng khiếu bẩm sinh về khả năng tự học, quan sát sâu sắc bản chất sự việc và tư duy phản biện độc lập sắc bén.' },
      8: { meaning: 'Năng khiếu bẩm sinh về khả năng đánh giá giá trị thực tế, nhạy bén với cơ hội tài chính và tư duy tổ chức công việc.' },
      9: { meaning: 'Năng khiếu bẩm sinh về lòng trắc ẩn, trực giác tâm lý và khả năng thấu hiểu cảm xúc của những người yếu thế.' },
      11: { meaning: 'Năng khiếu bẩm sinh về giác quan thứ sáu nhạy bén, trực giác tâm linh và khả năng truyền cảm hứng tinh thần.' },
      22: { meaning: 'Năng khiếu bẩm sinh về tư duy cấu trúc vĩ mô, biến ý tưởng phức tạp thành kế hoạch hành động thực tế khả thi.' }
    },

    // 7. THÁI ĐỘ (Attitude): Phản ứng ban đầu trước tình huống mới
    thaiDo: {
      1: { meaning: 'Khi gặp tình huống mới hoặc khủng hoảng, bạn có xu hướng lập tức nắm quyền chủ động, tự mình ra quyết định và hành động ngay thay vì chờ đợi.' },
      2: { meaning: 'Khi gặp sự việc mới, bạn thường tiếp cận với tâm thế quan sát, hòa nhã, lắng nghe ý kiến mọi người và tìm kiếm giải pháp đồng thuận hòa bình.' },
      3: { meaning: 'Khi tiếp cận tình huống mới, bạn phản ứng bằng sự lạc quan, hóm hỉnh, tìm cách giải tỏa căng thẳng bằng nụ cười và góc nhìn tươi sáng.' },
      4: { meaning: 'Khi gặp vấn đề mới, bạn lập tức phân tích logic, kiểm tra dữ liệu thực tế, tìm kiếm quy trình chuẩn và xây dựng kế hoạch thận trọng.' },
      5: { meaning: 'Khi đối diện với thay đổi hoặc thử thách mới, bạn phản ứng rất nhanh, hào hứng đón nhận như một cuộc phiêu lưu và tìm cách xoay chuyển tình thế linh hoạt.' },
      6: { meaning: 'Khi có biến cố xảy ra, phản xạ đầu tiên của bạn là bảo vệ, chở che và quan tâm đến sự an toàn, cảm xúc của những người thân yêu trước tiên.' },
      7: { meaning: 'Khi gặp sự việc mới, bạn thường lùi lại một bước để quan sát tĩnh lặng, hoài nghi lành mạnh và suy ngẫm thấu đáo trước khi đưa ra nhận định.' },
      8: { meaning: 'Trước một bài toán mới, bạn tiếp cận với tâm thế thực tế: Đo lường rủi ro, đánh giá nguồn lực tài chính và định hướng giải pháp mang lại kết quả cao nhất.' },
      9: { meaning: 'Khi đối diện với tình huống mới, bạn nhìn nhận từ bức tranh tổng thể rộng lớn, tiếp cận bằng sự bao dung và luôn hướng tới lợi ích của tập thể.' }
    },

    // 8. TƯ DUY LÝ TRÍ (Rational Thinking): Cách xử lý & phân tích thông tin
    tuDuyLyTri: {
      1: { meaning: 'Tư duy nhanh gọn, độc lập và hướng tới hành động. Bạn thích tự mình phân tích và đưa ra quyết định dứt khoát không dài dòng.' },
      2: { meaning: 'Tư duy dựa trên sự thấu hiểu đa chiều, cân nhắc cảm xúc và tác động của quyết định lên các mối quan hệ liên quan.' },
      3: { meaning: 'Tư duy sáng tạo liên tưởng, thích động não (brainstorm) các ý tưởng mới lạ và giải quyết vấn đề qua ngôn từ sinh động.' },
      4: { meaning: 'Tư duy logic tuyến tính, chặt chẽ, dựa trên số liệu thực tế, bằng chứng xác thực và quy trình đã được kiểm chứng.' },
      5: { meaning: 'Tư duy đa chiều, thích ứng nhanh, kết nối các lĩnh vực khác nhau và tìm kiếm những giải pháp đột phá ngoài khuôn khổ.' },
      6: { meaning: 'Tư duy hướng về con người và trách nhiệm, luôn cân nhắc tính đạo đức, sự hài hòa và phúc lợi của gia đình/tập thể.' },
      7: { meaning: 'Tư duy đào sâu bản chất, phản biện triết lý, không chấp nhận những kết luận hời hợt và luôn truy tìm nguyên nhân gốc rễ.' },
      8: { meaning: 'Tư duy chiến lược thực chiến, định hướng kết quả rõ ràng, nhạy bén với hiệu quả chi phí và khả năng mở rộng quy mô.' },
      9: { meaning: 'Tư duy nhân văn vĩ mô, có xu hướng nhìn sự việc trong bức tranh toàn cầu và hướng tới những giá trị cống hiến lâu dài.' }
    },

    // 9. CÂN BẰNG (Balance): Cách phục hồi khi gặp áp lực
    canBang: {
      1: { meaning: 'Khi mất cân bằng hoặc chịu áp lực, bạn cần không gian riêng để tự làm chủ lại cảm xúc, xác lập lại mục tiêu độc lập và tự quyết định bước đi tiếp theo.' },
      2: { meaning: 'Khi gặp khủng hoảng, bạn lấy lại cân bằng tốt nhất qua việc chia sẻ với một người bạn tri kỷ biết lắng nghe trong không gian hòa bình, không xung đột.' },
      3: { meaning: 'Khi căng thẳng, bạn cần giải tỏa năng lượng bằng việc trò chuyện vui vẻ, viết lách sáng tạo, ca hát hoặc tham gia các hoạt động giải trí nhẹ nhàng.' },
      4: { meaning: 'Khi tâm trí rối bời, cách tốt nhất để bạn lấy lại cân bằng là dọn dẹp lại phòng ốc, lên danh sách việc cần làm cụ thể và từng bước đưa cuộc sống về trật tự.' },
      5: { meaning: 'Khi cảm thấy ngột ngạt hoặc bế tắc, bạn cần thay đổi môi trường ngay: Đi dạo ngoài trời, tập thể thao hoặc làm một điều gì đó mới lạ để xả năng lượng.' },
      6: { meaning: 'Khi chông chênh, bạn tìm lại sự an định thông qua việc chăm sóc mái ấm, nấu một bữa ăn ngon hoặc kết nối tình cảm ấm áp bên người thân.' },
      7: { meaning: 'Khi gặp biến cố, bạn bắt buộc phải có thời gian tĩnh lặng một mình: Tắt điện thoại, hòa mình vào thiên nhiên, thiền định hoặc đọc sách để phục hồi.' },
      8: { meaning: 'Khi áp lực tài chính hoặc công việc bủa vây, bạn lấy lại phong độ bằng cách rà soát lại số liệu thực tế, tái cấu trúc kế hoạch và hành động cụ thể.' },
      9: { meaning: 'Khi cảm thấy thất vọng, bạn tìm lại an lạc bằng việc buông bỏ những điều không thể thay đổi, nuôi dưỡng lòng tha thứ và giúp đỡ một người khác.' }
    },

    // 10. CHẶNG ĐỈNH CAO (Pinnacle Stages): Luận giải bối cảnh phát triển theo thời gian
    chang: {
      1: {
        theme: 'Giai đoạn khởi lập - Tiên phong - Độc lập tự chủ',
        guidance: 'Giai đoạn này vũ trụ mời gọi bạn bước ra khỏi vùng an toàn, đứng vững trên đôi chân của mình và dũng cảm theo đuổi con đường riêng. Đây là thời kỳ của những sự khởi đầu mới, xây dựng sự tự tin và rèn luyện bản lĩnh dẫn đầu.',
        opportunity: 'Thời cơ vàng để khởi nghiệp, tự mình đứng tên phụ trách các dự án lớn và khẳng định vị thế cá nhân.',
        challenge: 'Cảm giác đơn độc, áp lực phải tự gánh vác mọi rủi ro và bài học vượt qua nỗi sợ thất bại.',
        action: 'Dám đưa ra quyết định độc lập và kiên định với tầm nhìn của chính mình dù người khác chưa hiểu.'
      },
      2: {
        theme: 'Giai đoạn hòa hợp - Hợp tác - Kết nối liên minh',
        guidance: 'Giai đoạn này không phải là lúc hành động vội vã một mình, mà là thời kỳ của sự kiên nhẫn, ngoại giao và phát triển các mối quan hệ đối tác bền vững. Bạn học cách hòa nhập, lắng nghe và tôn trọng sự gắn kết.',
        opportunity: 'Xây dựng được các mối quan hệ tri kỷ, liên minh chiến lược và môi trường làm việc hòa ái, thịnh vượng chung.',
        challenge: 'Sự nhạy cảm cảm xúc quá mức, dễ bị tổn thương hoặc do dự chần chừ trong các quyết định quan trọng.',
        action: 'Học cách đồng hành và tin tưởng cộng sự, rèn luyện nghệ thuật thương lượng đôi bên cùng có lợi.'
      },
      3: {
        theme: 'Giai đoạn tỏa sáng - Sáng tạo - Lan tỏa cảm hứng',
        guidance: 'Đây là giai đoạn thăng hoa của trí tưởng tượng, năng khiếu biểu đạt và niềm vui sống. Bạn được khuyến khích thể hiện tài năng nghệ thuật, chia sẻ câu chuyện của mình và truyền lửa tích cực cho xã hội.',
        opportunity: 'Tỏa sáng trước công chúng, xuất bản các tác phẩm sáng tạo, mở rộng mạng lưới giao thiệp và tận hưởng niềm vui.',
        challenge: 'Sự phân tán năng lượng, chi tiêu tùy hứng và làm việc theo cảm xúc thất thường.',
        action: 'Đưa sự sáng tạo vào kỷ luật thực thi đều đặn; biến các ý tưởng thú vị thành sản phẩm hoàn chỉnh.'
      },
      4: {
        theme: 'Giai đoạn xây móng - Kỷ luật - Thiết lập nền tảng bền vững',
        guidance: 'Đây là thời kỳ đòi hỏi sự chăm chỉ, kiên định, thực tế và tôn trọng trật tự. Bạn được mời gọi xây dựng nền móng kiên cố cho sự nghiệp, gia đình và tài chính thông qua quy trình bài bản.',
        opportunity: 'Tích lũy tài sản vững chắc, tạo dựng uy tín nghề nghiệp trường tồn và bộ máy vận hành ổn định.',
        challenge: 'Cảm giác gò bó, khối lượng công việc nặng nề và sự căng thẳng trước những chi tiết tiểu tiết.',
        action: 'Làm việc có phương pháp, kiên trì tích lũy từng viên gạch và không được nóng vội tìm đường tắt.'
      },
      5: {
        theme: 'Giai đoạn bứt phá - Đổi mới - Mở rộng trải nghiệm',
        guidance: 'Giai đoạn này mang năng lượng của sự giải phóng, xoay chuyển và đa dạng hóa. Vũ trụ thúc đẩy bạn phá vỡ những chiếc lồng cũ kỹ để đón nhận những cơ hội mới, đi xa hơn và nâng cấp tầm nhìn.',
        opportunity: 'Đột phá quy mô, đi du lịch, học hỏi lĩnh vực mới và mở rộng mạng lưới xã hội đa quốc gia.',
        challenge: 'Sự xáo trộn cuộc sống, cám dỗ buông thả và nguy cơ mất phương hướng vì quá nhiều ngã rẽ.',
        action: 'Chủ động đón nhận sự thay đổi nhưng neo chặt mục tiêu dài hạn; rèn luyện khả năng thích ứng linh hoạt.'
      },
      6: {
        theme: 'Giai đoạn yêu thương - Trách nhiệm - Xây đắp mái ấm',
        guidance: 'Thời kỳ này đặt trọng tâm vào gia đình, hôn nhân, con cái và trách nhiệm phụng dưỡng cộng đồng. Bạn được mời gọi trở thành điểm tựa yêu thương ấm áp, chữa lành và tạo dựng sự hòa thuận.',
        opportunity: 'Hôn nhân viên mãn, gia đình hòa thuận, sự nghiệp phát triển ổn định gắn liền với cái tâm lương thiện.',
        challenge: 'Gánh nặng trách nhiệm gia đình đè nặng, dễ lo lắng thái quá và hy sinh bản thân quá mức.',
        action: 'Yêu thương đi đôi với ranh giới; học cách chăm sóc bản thân song song với việc chăm lo cho người thân.'
      },
      7: {
        theme: 'Giai đoạn chiêm nghiệm - Tri thức - Tĩnh lặng tâm thức',
        guidance: 'Đây là thời kỳ bạn được kêu gọi quay về bên trong để học tập, nghiên cứu chuyên sâu và thức tỉnh tâm linh. Cuộc sống có thể tạo ra những khoảng lặng để bạn tái định nghĩa lại hệ giá trị cốt lõi của đời mình.',
        opportunity: 'Đạt tới đỉnh cao về trí tuệ chuyên môn, đúc kết các công trình nghiên cứu và tìm thấy sự bình an nội tại.',
        challenge: 'Cảm giác cô độc, sự thử thách về niềm tin và nguy cơ khép kín trước thế giới xung quanh.',
        action: 'Dành thời gian học hỏi, đọc sách, tĩnh tâm và chuyển hóa những trải nghiệm thành sự thông thái.'
      },
      8: {
        theme: 'Giai đoạn gặt hái - Thành tựu - Làm chủ nguồn lực',
        guidance: 'Thời kỳ thu hoạch lớn về tài chính, quyền lực và vị thế xã hội. Những nỗ lực trước đây của bạn sẽ chuyển hóa thành thành quả vật chất cụ thể nếu bạn làm việc chính trực và có tầm nhìn điều hành.',
        opportunity: 'Gặt hái tài chính vượt bậc, thăng tiến vị trí lãnh đạo cấp cao và sở hữu các tài sản giá trị.',
        challenge: 'Cám dỗ của lòng tham, xung đột pháp lý hoặc áp lực khủng khiếp từ việc quản trị dòng tiền.',
        action: 'Quản trị nguồn lực với cái tâm chính trực; chia sẻ lợi ích công bằng và phụng sự xã hội.'
      },
      9: {
        theme: 'Giai đoạn hoàn tất - Bao dung - Phụng sự nhân văn',
        guidance: 'Giai đoạn khép lại một chu kỳ tiến hóa lớn để chuẩn bị bước sang nấc thang mới. Đây là thời kỳ của sự buông bỏ những điều lỗi thời, mở rộng lòng vị tha và cống hiến cho những lý tưởng cao đẹp.',
        opportunity: 'Được xã hội tôn vinh, hoàn thành các tâm nguyện lớn vì cộng đồng và đạt tới sự thanh thản tâm hồn.',
        challenge: 'Sự chia ly, mất mát những điều không còn phù hợp và nỗi buồn tiếc nuối quá khứ.',
        action: 'Học cách buông xả với lòng biết ơn; mở rộng trái tim phụng sự mà không mong cầu đền đáp.'
      },
      11: {
        theme: 'Giai đoạn ngọn hải đăng - Khai sáng trực giác',
        guidance: 'Thời kỳ kích hoạt năng lượng tâm linh và trực giác cao độ. Bạn được đặt vào vị trí người truyền cảm hứng, kết nối tâm thức và soi đường cho người khác bằng sự thấu hiểu sâu sắc.',
        opportunity: 'Trở thành người dẫn dắt tinh thần, tạo ra sức ảnh hưởng chuyển hóa nhận thức mạnh mẽ.',
        challenge: 'Căng thẳng hệ thần kinh, nhạy cảm quá mức trước các năng lượng tiêu cực xung quanh.',
        action: 'Giữ tâm trong sáng, thực hành lối sống tỉnh thức và truyền cảm hứng bằng chính cuộc đời mình.'
      },
      22: {
        theme: 'Giai đoạn kiến tạo di sản - Xây dựng hệ thống vĩ mô',
        guidance: 'Thời kỳ quyền năng kiến tạo bậc thầy: Biến những giấc mơ lớn thành hiện thực công trình vững chắc. Bạn có cơ hội xây dựng những mô hình phục vụ lợi ích lâu dài cho hàng triệu người.',
        opportunity: 'Để lại di sản trường tồn, tạo bước ngoặt phát triển mang tầm lịch sử cho cộng đồng/ngành nghề.',
        challenge: 'Khối lượng công việc khổng lồ, đòi hỏi sự phối hợp của cả trực giác lớn và kỷ luật thép.',
        action: 'Kiên định với đại nghiệp nhưng biết ủy quyền và xây dựng bộ máy cộng sự đáng tin cậy.'
      }
    },

    // 11. THÁCH THỨC (Challenges): Bài toán tiến hóa theo từng giai đoạn
    thuThach: {
      0: {
        name: 'Thử thách số 0: Thử thách của Tự Do Lựa Chọn & Trách Nhiệm Tâm Thức',
        lesson: 'Bạn không bị giới hạn bởi một thử thách cụ thể nào, nhưng điều đó đòi hỏi bạn phải có ý thức tự giác cực kỳ cao. Bạn được trao quyền tự do lựa chọn mọi con đường, và bài học là học cách chịu trách nhiệm 100% với lựa chọn của mình.'
      },
      1: {
        name: 'Thử thách số 1: Bài toán Độc lập & Bản lĩnh tự chủ',
        lesson: 'Học cách vượt qua sự tự ti, không dựa dẫm hay phụ thuộc vào ý kiến người khác; dũng cảm đứng lên bảo vệ chính kiến và tự chịu trách nhiệm với cuộc đời mình.'
      },
      2: {
        name: 'Thử thách số 2: Bài toán Thấu cảm & Kiên nhẫn hòa giải',
        lesson: 'Học cách làm chủ sự nhạy cảm cảm xúc, tránh tự ái hay giữ ấm ức trong lòng; rèn luyện nghệ thuật lắng nghe và hợp tác chân thành mà không đánh mất ranh giới cá nhân.'
      },
      3: {
        name: 'Thử thách số 3: Bài toán Biểu đạt & Tập trung nguồn lực',
        lesson: 'Học cách quản trị cảm xúc, tránh nói lời sát thương khi nóng giận; rèn thói quen tập trung hoàn thành trọn vẹn từng mục tiêu thay vì làm việc tùy hứng, đầu voi đuôi chuột.'
      },
      4: {
        name: 'Thử thách số 4: Bài toán Kỷ luật & Kiên định thực tế',
        lesson: 'Vượt qua tính lười biếng, cẩu thả hoặc ngược lại là sự bảo thủ cứng nhắc; học cách làm việc có kế hoạch, kiên nhẫn xây dựng từng bước và tôn trọng các quy chuẩn trật tự.'
      },
      5: {
        name: 'Thử thách số 5: Bài toán Tự do trong khuôn khổ & Quản trị cám dỗ',
        lesson: 'Học cách kiểm soát ham muốn tức thời, tránh bốc đồng chạy theo những thú vui ngắn hạn; hiểu rằng tự do chân chính chỉ có được khi có sự tự kỷ luật vững vàng.'
      },
      6: {
        name: 'Thử thách số 6: Bài toán Yêu thương không áp đặt & Chấp nhận sự bất toàn',
        lesson: 'Học cách buông bỏ sự kiểm soát, không áp đặt tiêu chuẩn của mình lên người thân; học cách tha thứ và yêu thương người khác vì chính con người thật của họ.'
      },
      7: {
        name: 'Thử thách số 7: Bài toán Vượt qua hoài nghi & Mở lòng đón nhận chân lý',
        lesson: 'Học cách vượt qua sự đa nghi, lạnh lùng và khép kín; kết nối trái tim với trí tuệ để tin tưởng vào dòng chảy cuộc sống thay vì chỉ dựa vào sự phân tích lý trí hạn hẹp.'
      },
      8: {
        name: 'Thử thách số 8: Bài toán Làm chủ vật chất & Đạo đức quyền lực',
        lesson: 'Học cách kiếm tiền và sử dụng quyền lực một cách chân chính, không để lòng tham hay sự thực dụng làm tha hóa nhân cách; cân bằng giữa đời sống vật chất và tinh thần.'
      }
    },

    // 12. NĂM CÁ NHÂN (Personal Year): Chủ đề năng lượng năm hiện tại
    namCaNhan: {
      1: {
        theme: 'Năm Khởi Đầu Mới & Gieo Hạt Tương Lai',
        guidance: 'Năm đầu tiên của chu kỳ 9 năm: Thời điểm vàng để bắt đầu các dự án mới, thay đổi công việc, thiết lập mục tiêu dài hạn và hành động độc lập với ý chí quyết đoán.',
        action: 'Dám gieo những hạt giống mới và chủ động nắm bắt cơ hội tiên phong.'
      },
      2: {
        theme: 'Năm Kiên Nhẫn, Hợp Tác & Dung Dưỡng Mối Quan Hệ',
        guidance: 'Năm của sự nuôi dưỡng hạt giống trong tĩnh lặng. Nhịp độ chậm lại để bạn học cách lắng nghe, đàm phán, hòa giải và củng cố các liên minh đồng hành.',
        action: 'Tập trung vào chất lượng các mối quan hệ và rèn luyện sự thấu cảm, kiên nhẫn.'
      },
      3: {
        theme: 'Năm Tỏa Sáng, Sáng Tạo & Mở Rộng Giao Tiếp',
        guidance: 'Hạt giống bắt đầu nảy mầm và trổ hoa. Năm của niềm vui, sự thăng hoa ý tưởng, mở rộng quan hệ xã hội và bộc lộ tài năng sáng tạo ra bên ngoài.',
        action: 'Quảng bá bản thân, học thêm kỹ năng mới và lan tỏa năng lượng tích cực.'
      },
      4: {
        theme: 'Năm Củng Cố Nền Tảng, Kỷ Luật & Quản Trị Chi Tiết',
        guidance: 'Năm của sự chăm chỉ làm cỏ, tỉa cành và xây tường rào bảo vệ. Cần tập trung vào việc quản lý tài chính, củng cố quy trình làm việc và chăm sóc sức khỏe thể chất.',
        action: 'Làm việc có kế hoạch bài bản, cắt giảm chi tiêu lãng phí và nâng cao thể lực.'
      },
      5: {
        theme: 'Năm Bứt Phá, Đổi Mới & Thích Ứng Linh Hoạt',
        guidance: 'Điểm bản lề của chu kỳ 9 năm: Năng lượng của sự tự do, dịch chuyển và xoay chuyển tình thế. Sẵn sàng đón nhận những bất ngờ và dũng cảm bước ra khỏi vùng an toàn.',
        action: 'Tận dụng các cơ hội đi xa, học hỏi cái mới nhưng giữ khoảng dừng 5 giây trước các quyết định bốc đồng.'
      },
      6: {
        theme: 'Năm Trách Nhiệm, Mái Ấm Gia Đình & Chăm Sóc Yêu Thương',
        guidance: 'Năm hướng về cội nguồn, chăm sóc gia đình, con cái và cải tạo không gian sống. Trách nhiệm sẽ gia tăng nhưng đồng thời mang lại sự gắn kết ấm áp.',
        action: 'Dành thời gian chất lượng cho người thân và trang hoàng lại tổ ấm bình yên.'
      },
      7: {
        theme: 'Năm Tĩnh Lặng, Học Tập Chuyên Sâu & Chiêm Nghiệm Bản Thân',
        guidance: 'Năm của việc quay về bên trong: Tạm dừng việc mở rộng quy mô bên ngoài để đào sâu nghiên cứu, củng cố nội lực tinh thần và đánh giá lại triết lý sống.',
        action: 'Đọc sách, thiền định, học tập chuyên môn và chăm sóc sức khỏe tâm thần.'
      },
      8: {
        theme: 'Năm Gặt Hái Thành Tựu, Tài Chính & Khẳng Định Quyền Lực',
        guidance: 'Mùa thu hoạch lớn của chu kỳ: Năng lượng tập trung vào kết quả kinh doanh, đàm phán tài chính, thăng tiến sự nghiệp và khẳng định năng lực điều hành thực tế.',
        action: 'Quyết đoán chốt hạ các thương vụ, tái đầu tư khôn ngoan và làm việc chính trực.'
      },
      9: {
        theme: 'Năm Hoàn Tất, Tổng Kết & Buông Bỏ Để Tái Sinh',
        guidance: 'Năm cuối cùng của chu kỳ: Thời điểm dọn dẹp những điều không còn phục vụ sự tiến hóa của bạn (mối quan hệ độc hại, thói quen xấu, dự án bế tắc) để chuẩn bị cho chu kỳ mới.',
        action: 'Tha thứ, bao dung, làm thiện nguyện và dọn sạch không gian sống cũng như tâm trí.'
      }
    },

    // 13. THÁNG CÁ NHÂN (Personal Month)
    thangCaNhan: {
      1: { theme: 'Khởi xướng việc mới, đưa ra quyết định độc lập và tăng tốc hành động.' },
      2: { theme: 'Lắng nghe, kết nối hòa ái, kiên nhẫn đàm phán và giải quyết mâu thuẫn.' },
      3: { theme: 'Sáng tạo, giao tiếp sôi nổi, gặp gỡ bạn bè và biểu đạt ý tưởng.' },
      4: { theme: 'Lập kế hoạch chi tiết, củng cố quy trình, tiết kiệm và rèn luyện kỷ luật.' },
      5: { theme: 'Linh hoạt thích ứng, đón nhận cơ hội mới, đi công tác hoặc đổi mới phương pháp.' },
      6: { theme: 'Chăm lo cho gia đình, giải quyết việc nhà, làm đẹp không gian và hỗ trợ đồng nghiệp.' },
      7: { theme: 'Tĩnh tâm nghiên cứu, kiểm tra lại dữ liệu, tránh đưa ra quyết định vội vàng.' },
      8: { theme: 'Tập trung vào hiệu quả tài chính, đàm phán hợp đồng và xử lý công việc quan trọng.' },
      9: { theme: 'Hoàn tất các việc tồn đọng, dọn dẹp hồ sơ, buông bỏ vướng bận và tổng kết tháng.' }
    },

    // 14. NGÀY CÁ NHÂN (Personal Day)
    ngayCaNhan: {
      1: { theme: 'Ngày của sự tự chủ: Hãy tự mình quyết định và giải quyết dứt điểm 1 việc quan trọng.' },
      2: { theme: 'Ngày của sự lắng nghe: Tránh tranh cãi, hãy kiên nhẫn cảm nhận và hỗ trợ người khác.' },
      3: { theme: 'Ngày của niềm vui: Hãy chia sẻ nụ cười, viết lách hoặc gửi lời động viên tới ai đó.' },
      4: { theme: 'Ngày của trật tự: Dọn dẹp bàn làm việc, kiểm tra số liệu và làm việc theo danh sách.' },
      5: { theme: 'Ngày của linh hoạt: Sẵn sàng đón nhận thay đổi bất ngờ với tâm thế cởi mở, vui vẻ.' },
      6: { theme: 'Ngày của yêu thương: Dành thời gian ăn tối cùng gia đình hoặc giúp đỡ người thân.' },
      7: { theme: 'Ngày của tĩnh lặng: Dành 15 phút một mình cuối ngày để viết nhật ký và suy ngẫm.' },
      8: { theme: 'Ngày của hiệu quả: Tập trung cao độ vào công việc kinh doanh và các quyết định tài chính.' },
      9: { theme: 'Ngày của bao dung: Tha thứ cho một sự việc không vừa ý và dọn sạch bàn làm việc.' }
    }
  };

  // ==========================================================================
  // IV. QUAN HỆ TƯƠNG TÁC GIỮA CÁC CHỈ SỐ (Interactions & Internal Conflicts)
  // ==========================================================================
  const ENERGY_PAIRS = [
    {
      id: '5-4',
      numbers: [5, 4],
      name: 'Tự do ↔ Kỷ luật',
      tagline: 'Sự giằng co giữa khao khát tự do bứt phá và nhu cầu kỷ luật, nền tảng trật tự.',
      manifestation: 'Bạn có thể thường xuyên trải qua cảm giác muốn bứt phá khỏi các khuôn khổ cứng nhắc nhưng lại nhận thấy rằng thiếu trật tự thì mọi ý tưởng sáng tạo dễ dang dở. Khi kỷ luật quá khắt khe, bạn cảm thấy ngột ngạt; nhưng khi tự do quá trớn, bạn dễ bị phân tán nguồn lực.',
      positive: 'Khi được tích hợp hài hòa, bạn sở hữu khả năng đổi mới sáng tạo phi thường nhưng vẫn có lộ trình thực thi bài bản, biến các ý tưởng đột phá thành sản phẩm thực tế.',
      shadow: 'Dễ dao động giữa hai thái cực: Lúc thì buông thả ngẫu hứng, lúc lại tự trách móc và ép mình vào kỷ luật sắt đá dẫn đến kiệt sức.',
      lesson: 'Kỷ luật không phải là ngục tù giam hãm tự do, mà là bệ phóng an toàn giúp tự do bay cao mà không bị mất phương hướng.',
      action: 'Thiết lập "Cấu trúc linh hoạt": Hãy lên khung giờ cố định cho các nhiệm vụ cốt lõi (2-3 tiếng/ngày), sau đó dành riêng một khoảng "thời gian tự do không lịch trình" để thỏa sức thử nghiệm cái mới.'
    },
    {
      id: '5-6',
      numbers: [5, 6],
      name: 'Tự do ↔ Trách nhiệm',
      tagline: 'Cân bằng giữa khao khát trải nghiệm cá nhân và nghĩa vụ chăm sóc, gánh vác trách nhiệm.',
      manifestation: 'Bạn có thể thường xuyên cảm thấy ray rứt giữa việc theo đuổi đam mê khám phá của bản thân với trách nhiệm chăm lo cho gia đình, tập thể hoặc những người phụ thuộc vào mình.',
      positive: 'Khả năng mang lại luồng sinh khí tươi mới, niềm vui và sự đổi mới ấm áp cho những người thân yêu mà không làm họ cảm thấy gò bó hay ngột ngạt.',
      shadow: 'Dễ cảm thấy có lỗi khi dành thời gian cho riêng mình, hoặc ngược lại, cảm thấy bức bối, ngột ngạt khi nghĩa vụ đè nặng lên đôi vai.',
      lesson: 'Yêu thương và trách nhiệm chân chính bắt đầu từ sự tự do và trọn vẹn của chính bạn. Bạn chỉ có thể nâng đỡ người khác tốt nhất khi chiếc cốc năng lượng của mình được đong đầy.',
      action: 'Thực hành thiết lập ranh giới lành mạnh: Thẳng thắn chia sẻ nhu cầu không gian riêng tư với người thân và học cách từ chối những việc vượt quá sức mình một cách nhẹ nhàng.'
    },
    {
      id: '22-4',
      numbers: [22, 4],
      name: 'Kiến tạo ↔ Hệ thống',
      tagline: 'Hiện thực hóa tầm nhìn vĩ mô thông qua quy trình, cấu trúc và kỷ luật thực thi bền vững.',
      manifestation: 'Bạn sở hữu tầm nhìn lớn mang tầm hệ thống nhưng có thể thường xuyên cảm thấy sốt ruột vì những chi tiết tiểu tiết thực tế đòi hỏi nhiều thời gian và sự kiên trì từng bước.',
      positive: 'Khả năng xây dựng những công trình, mô hình tổ chức hoặc giải pháp quy mô lớn có tính ứng dụng bền vững và trường tồn theo năm tháng.',
      shadow: 'Dễ rơi vào cái bẫy cầu toàn quá mức, tự tạo áp lực khủng khiếp lên bản thân và nhân viên/đồng nghiệp khi mọi thứ chưa hoàn hảo như kế hoạch ban đầu.',
      lesson: 'Một hệ thống vĩ đại được xây dựng từ những viên gạch nhỏ nhất. Hãy kiên nhẫn với tiến trình và trân trọng từng bước tiến khiêm tốn.',
      action: 'Chia nhỏ đại dự án thành các chu kỳ mục tiêu 30 ngày (sprint), đồng thời xây dựng quy trình ủy quyền từng phần thay vì ôm đồm mọi khâu kiểm soát.'
    },
    {
      id: '22-9',
      numbers: [22, 9],
      name: 'Kiến tạo ↔ Phụng sự',
      tagline: 'Sự kết hợp giữa tư duy xây dựng vĩ mô và lý tưởng nhân văn, phụng sự cộng đồng.',
      manifestation: 'Nội tâm bạn luôn thôi thúc tạo ra những giá trị to lớn cho xã hội, không thỏa mãn với những thành tựu vị kỷ cá nhân, nhưng đôi khi cảm thấy cô độc hoặc quá tải vì lý tưởng quá cao đẹp.',
      positive: 'Một nhà lãnh đạo kiến tạo đầy trắc ẩn, có năng lực biến các ước mơ nhân văn thành các tổ chức hoặc giải pháp thực tế có sức ảnh hưởng sâu rộng.',
      shadow: 'Dễ thất vọng, hụt hẫng khi thực tế cuộc sống hoặc con người không đáp ứng được tiêu chuẩn đạo đức và tầm nhìn lý tưởng của bạn.',
      lesson: 'Phụng sự bền vững đòi hỏi một nền tảng thực tế vững mạnh. Đừng biến lòng nhân ái thành sự hy sinh mù quáng làm tổn thương nguồn lực của chính mình.',
      action: 'Gắn mỗi mục tiêu thực tế hàng ngày với một ý nghĩa nhân văn cụ thể, đồng thời tự nhắc nhở rằng thay đổi thế giới bắt đầu từ việc làm tốt nhất góc nhỏ của mình hôm nay.'
    },
    {
      id: '7-5',
      numbers: [7, 5],
      name: 'Chiều sâu ↔ Biểu đạt & Trải nghiệm',
      tagline: 'Sự giao thoa giữa nhu cầu tĩnh lặng chiêm nghiệm nội tâm và khao khát kết nối, trải nghiệm đa dạng.',
      manifestation: 'Có lúc bạn muốn rút lui hoàn toàn vào thế giới riêng để nghiên cứu, suy ngẫm sâu sắc; nhưng chỉ một thời gian ngắn sau, bạn lại cảm thấy bồn chồn muốn hòa mình vào các hoạt động sôi nổi bên ngoài.',
      positive: 'Khả năng đúc kết những tri thức sâu sắc và truyền đạt lại cho cuộc đời một cách sinh động, cuốn hút và dễ hiểu.',
      shadow: 'Dễ bị chông chênh giữa trạng thái khép kín cô độc và trạng thái hưng phấn phân tán ngoài xã hội, khó duy trì nhịp sinh hoạt ổn định.',
      lesson: 'Học tập từ sách vở cần đi đôi với trải nghiệm thực tế; và trải nghiệm thực tế cần những khoảng dừng tĩnh lặng để chuyển hóa thành trí tuệ.',
      action: 'Tạo nhịp điệu sinh hoạt "Hít vào - Thở ra": Dành buổi sáng hoặc các ngày cố định trong tuần cho nghiên cứu sâu, và dành các buổi còn lại cho giao tiếp, kết nối và trải nghiệm thực tế.'
    },
    {
      id: '1-2',
      numbers: [1, 2],
      name: 'Độc lập ↔ Hợp tác',
      tagline: 'Cân bằng giữa bản lĩnh tiên phong tự chủ và nghệ thuật lắng nghe, đồng hành hòa ái.',
      manifestation: 'Bạn có thể muốn tự mình quyết định và hành động nhanh chóng vì không thích chờ đợi, nhưng đồng thời lại khao khát sự thấu hiểu, hòa hợp và gắn kết thân tình từ người khác.',
      positive: 'Một người dẫn đầu biết lắng nghe, tự tin nhưng không độc đoán, biết truyền cảm hứng và dung hòa tập thể.',
      shadow: 'Dễ căng thẳng khi phải thỏa hiệp, hoặc có xu hướng cô lập bản thân khi cảm thấy người khác không bắt kịp tốc độ của mình.',
      lesson: 'Đi nhanh hãy đi một mình, đi xa hãy đi cùng nhau. Sức mạnh thực sự của người dẫn đầu nằm ở việc nâng đỡ người khác cùng tỏa sáng.',
      action: 'Áp dụng nguyên tắc "Lắng nghe trước khi chỉ đạo": Trong mọi cuộc thảo luận, hãy để đối phương nói trọn vẹn quan điểm trước khi đưa ra kết luận hoặc chỉ thị.'
    },
    {
      id: '3-7',
      numbers: [3, 7],
      name: 'Biểu đạt ↔ Nội tâm',
      tagline: 'Sự đan xen giữa nhu cầu bộc lộ cảm xúc, sáng tạo và nhu cầu tĩnh tại, riêng tư đào sâu.',
      manifestation: 'Bề ngoài bạn có thể rất hóm hỉnh, hoạt ngôn và sáng tạo, nhưng sâu bên trong lại là một thế giới tư tưởng trầm mặc, khắt khe và kén chọn người thực sự hiểu mình.',
      positive: 'Khả năng truyền tải những triết lý, tư tưởng sâu sắc thành ngôn từ, nghệ thuật hoặc câu chuyện truyền cảm hứng lay động lòng người.',
      shadow: 'Dễ cảm thấy trống rỗng sau những cuộc vui náo nhiệt, hoặc rơi vào trạng thái hoài nghi, quá xét nét bản thân và người khác.',
      lesson: 'Biểu đạt chân thật là cầu nối đưa chiều sâu nội tâm ra ánh sáng. Hãy mở lòng chia sẻ những trăn trở chân thật nhất thay vì chỉ thể hiện sự hóm hỉnh bề mặt.',
      action: 'Duy trì thói quen viết nhật ký phản chiếu: Trước khi phát biểu hoặc xuất bản một ý tưởng, hãy viết ra 3 câu hỏi đào sâu về bản chất vấn đề.'
    },
    {
      id: '8-9',
      numbers: [8, 9],
      name: 'Thành tựu ↔ Phụng sự',
      tagline: 'Dung hòa giữa khát vọng thành công thực tế, tài chính và lý tưởng nhân ái, cho đi.',
      manifestation: 'Bạn vừa muốn khẳng định vị thế, nắm giữ nguồn lực vật chất vững mạnh, vừa mang trong lòng ước muốn đóng góp, nâng đỡ những mảnh đời yếu thế hơn.',
      positive: 'Người kiến tạo giá trị thực tế cao quý: Sử dụng tài chính và quyền lực như công cụ hữu hiệu để phụng sự cộng đồng và tạo phúc lợi lâu dài.',
      shadow: 'Dễ bị giằng xé giữa cảm giác ích kỷ khi tích lũy của cải với cảm giác bất an khi cho đi quá nhiều mà không quản trị dòng tiền.',
      lesson: 'Tạo ra thịnh vượng vật chất chính là cách tạo ra phương tiện mạnh mẽ nhất để phụng sự. Đạo đức và kinh tế không triệt tiêu mà bổ trợ cho nhau.',
      action: 'Trích một tỷ lệ cố định (ví dụ 5-10%) từ các nguồn thu nhập để đưa vào quỹ phụng sự/giáo dục/cho đi, biến việc thiện nguyện thành một chiến lược tài chính có kế hoạch.'
    },
    {
      id: '3-4',
      numbers: [3, 4],
      name: 'Ngẫu hứng ↔ Kỷ luật',
      tagline: 'Cân bằng giữa sự thăng hoa, bay bổng sáng tạo và trật tự, quy trình thực thi bài bản.',
      manifestation: 'Bạn có thể tràn trề ý tưởng độc đáo nhưng lại dễ nản lòng trước các thủ tục hành chính, bảng biểu hoặc quy trình lặp đi lặp lại.',
      positive: 'Khả năng biến những quy trình khô khan thành những trải nghiệm thú vị, vừa đảm bảo chất lượng vừa mang tính đổi mới linh hoạt.',
      shadow: 'Dễ chần chừ, bừa bộn hoặc làm việc tùy hứng khiến kế hoạch bị đổ bể; ngược lại nếu bị ép vào khuôn khổ quá mức thì mất hết cảm hứng.',
      lesson: 'Kỷ luật chính là khung tranh giữ cho bức vẽ sáng tạo không bị nhòe nét. Cấu trúc phục vụ sự sáng tạo, chứ không giết chết sáng tạo.',
      action: 'Gamify (Trò chơi hóa) các công việc lặp lại: Chia nhỏ nhiệm vụ nhàm chán thành các mốc tính giờ 25 phút (Pomodoro) và tự thưởng một phần thưởng nhỏ sau khi hoàn thành.'
    },
    {
      id: '6-9',
      numbers: [6, 9],
      name: 'Chăm sóc ↔ Phụng sự',
      tagline: 'Mở rộng tình yêu thương từ phạm vi gia đình, người thân ra cộng đồng xã hội rộng lớn.',
      manifestation: 'Trái tim bạn luôn đong đầy tình cảm và sẵn lòng giúp đỡ người khác, nhưng đôi khi bị kiệt sức vì mang vác cả nỗi buồn và trách nhiệm của thiên hạ.',
      positive: 'Một tâm hồn vị tha, ấm áp và bao dung, có khả năng chữa lành và mang lại cảm giác bình yên cho bất kỳ ai tiếp xúc.',
      shadow: 'Dễ rơi vào vai "người cứu rỗi" (Savior complex), can thiệp quá sâu vào bài học của người khác và bỏ quên việc chăm sóc chính mình.',
      lesson: 'Học cách buông bỏ sự kiểm soát và tôn trọng hành trình trải nghiệm của mỗi người. Bạn không cần phải cứu rỗi cả thế giới mới xứng đáng được yêu thương.',
      action: 'Quy tắc tự chăm sóc: Mỗi ngày dành ra ít nhất 30 phút chỉ làm những việc nuôi dưỡng thể chất và tâm hồn mình mà không phục vụ ai khác.'
    },
    {
      id: '1-9',
      numbers: [1, 9],
      name: 'Tự chủ cá nhân ↔ Lý tưởng cộng đồng',
      tagline: 'Hài hòa giữa khát vọng khẳng định bản lĩnh cá nhân và mục tiêu cống hiến vì đại cuộc.',
      manifestation: 'Bạn có cái tôi mạnh mẽ và muốn tự mình làm chủ mọi quyết định, nhưng đồng thời lại được dẫn dắt bởi một lý tưởng nhân văn bao quát.',
      positive: 'Một nhà tiên phong khai mở đường lối mới cho tập thể, dám đứng mũi chịu sào vì lợi ích chung.',
      shadow: 'Dễ rơi vào mâu thuẫn giữa việc muốn nổi bật cá nhân và áp lực phải làm tấm gương mẫu mực cho cộng đồng.',
      lesson: 'Vinh quang cá nhân chân chính là thành quả tự nhiên khi bạn cống hiến hết mình cho sự phát triển của người khác.',
      action: 'Định vị vai trò: Thay vì đặt câu hỏi "Tôi sẽ đạt được gì?", hãy tự hỏi "Tôi có thể mở ra con đường nào để mọi người cùng tiến bước?".'
    },
    {
      id: '8-2',
      numbers: [8, 2],
      name: 'Quyết đoán thực tế ↔ Nhạy cảm thấu cảm',
      tagline: 'Dung hòa giữa ý chí sắt đá, định hướng kết quả và sự mềm mại, lắng nghe tinh tế.',
      manifestation: 'Nội tâm bạn vừa có nhu cầu kiểm soát mạnh mẽ vừa có giác quan thứ sáu nhạy bén với cảm xúc của người khác, đôi khi tự phân vân giữa việc nên cứng rắn hay mềm mỏng.',
      positive: 'Một nhà thương thuyết tài ba, biết cương nhu đúng lúc, đạt được thỏa thuận đôi bên cùng có lợi (Win-Win).',
      shadow: 'Dễ bị stress nội tâm khi phải ra các quyết định cắt giảm hoặc kỷ luật vì sợ làm tổn thương người khác.',
      lesson: 'Lãnh đạo bằng sự chân thật và lòng nhân từ chính là đỉnh cao của quyền lực.',
      action: 'Kỹ thuật phản hồi "Sandwich": Khi cần đưa ra góp ý cứng rắn, hãy kẹp lời nhận xét mang tính xây dựng ở giữa hai lời công nhận chân thành.'
    },
    {
      id: '11-4',
      numbers: [11, 4],
      name: 'Trực giác phiêu lãng ↔ Thực tế vững chắc',
      tagline: 'Hạ cánh những ý tưởng linh cảm cao vút xuống mặt đất của tính khả thi và hành động thực tế.',
      manifestation: 'Bạn nhận được rất nhiều cảm hứng và trực giác nhạy bén nhưng thường lúng túng trong việc biến chúng thành một kế hoạch khả thi từng bước.',
      positive: 'Khả năng tiên tri và cảm nhận xu hướng trước thời đại, kết hợp với tính kỷ luật để tạo ra những đột phá có thật.',
      shadow: 'Dễ chìm đắm trong các ý tưởng trừu tượng, mơ mộng viển vông và né tránh trách nhiệm thực tế.',
      lesson: 'Cảm hứng là hạt giống, còn kỷ luật là mảnh đất. Hạt giống chỉ có thể đơm hoa kết trái khi được gieo vào lòng đất kiên nhẫn.',
      action: 'Quy tắc 24 giờ: Bất kỳ trực giác hoặc ý tưởng mới nào xuất hiện, hãy viết ngay 3 bước hành động cụ thể đầu tiên và thực hiện bước 1 trong vòng 24 giờ.'
    },
    {
      id: '11-2',
      numbers: [11, 2],
      name: 'Trực giác dẫn đường ↔ Hòa giải lắng nghe',
      tagline: 'Chuyển hóa độ nhạy cảm tâm lý thành sự thông thái kết nối và truyền cảm hứng.',
      manifestation: 'Bạn có khả năng đọc vị tâm lý người khác cực kỳ chính xác nhưng cũng rất dễ bị ảnh hưởng bởi năng lượng tiêu cực xung quanh.',
      positive: 'Khả năng thấu cảm siêu việt, đóng vai trò như chiếc cầu nối hòa giải và ngọn đuốc truyền cảm hứng ấm áp.',
      shadow: 'Dễ bị kiệt quệ cảm xúc (emotional burnout), lo âu và tự ti khi sống trong môi trường nhiều xung đột.',
      lesson: 'Học cách bảo vệ trường năng lượng của mình. Lắng nghe và thấu cảm không có nghĩa là phải hấp thụ mọi nỗi buồn của người khác.',
      action: 'Thanh lọc tâm trí: Dành 10 phút cuối ngày ngồi thiền hoặc thở sâu trong tĩnh lặng, hình dung việc buông xả mọi cảm xúc không thuộc về mình.'
    },
    {
      id: '8-4',
      numbers: [8, 4],
      name: 'Khát vọng quy mô ↔ Quản trị nền tảng',
      tagline: 'Xây dựng đế chế thịnh vượng vững chắc từ năng lực kiểm soát rủi ro và quản trị kỷ luật.',
      manifestation: 'Bạn luôn hướng tới các thành tựu lớn nhưng đôi khi bị giằng co giữa việc muốn mở rộng thần tốc và việc muốn thắt chặt an toàn kiểm soát.',
      positive: 'Năng lực điều hành doanh nghiệp hoặc quản trị tài chính kiệt xuất, biến các nguồn lực thành tài sản bền vững.',
      shadow: 'Quá chú trọng đến vật chất và công việc, biến cuộc sống thành chuỗi ngày áp lực không hồi kết.',
      lesson: 'Giá trị của sự thịnh vượng nằm ở sự tự do tâm trí chứ không nằm ở việc sở hữu bao nhiêu tài sản.',
      action: 'Thực hành "Ngày không bàn việc": Dành trọn vẹn 1 ngày cuối tuần hoàn toàn ngắt kết nối với báo cáo tài chính và công việc.'
    }
  ];

  // ==========================================================================
  // V. DIỄN GIẢI NỢ NGHIỆP & CHỈ SỐ THIẾU THEO HƯỚNG BÀI HỌC PHÁT TRIỂN
  // ==========================================================================
  const KARMIC_LESSONS = {
    13: {
      code: 13,
      title: 'Bài học Kỷ luật & Nền tảng kiên trì (13/4)',
      focus: 'Xây dựng tính kiên định, thói quen làm việc trật tự và hoàn thành mục tiêu đến cùng.',
      explanation: 'Con số 13 mang đến bài học về việc không tìm đường tắt hay nóng vội. Những thử thách thường đòi hỏi bạn phải làm việc chăm chỉ, tổ chức bài bản và chịu trách nhiệm với từng khâu nhỏ nhất thay vì ỷ lại hay nản lòng khi gặp chướng ngại lặp lại.',
      positive: 'Khi vượt qua, bạn trở thành người có nội lực phi thường, tạo dựng sự nghiệp vững như bàn thạch.',
      shadow: 'Dễ cảm thấy bất công, nản lòng thoái chí hoặc trốn tránh trách nhiệm bằng việc làm qua loa.',
      action: 'Thực hành "Cam kết đến cùng": Chọn ra 1 mục tiêu nhỏ mỗi tháng và hoàn thành nó trọn vẹn 100% không viện cớ.'
    },
    14: {
      code: 14,
      title: 'Bài học Tự do có chừng mực & Quản trị cám dỗ (14/5)',
      focus: 'Rèn luyện khả năng kiểm soát cảm xúc, cam kết lâu dài và tự do trong khuôn khổ lành mạnh.',
      explanation: 'Con số 14 nhắc nhở bài học về việc giữ vững phương hướng trước những cám dỗ nhất thời. Bạn cần học cách đón nhận sự thay đổi mà không đánh mất các cam kết dài hạn hoặc sa đà vào thói quen buông thả.',
      positive: 'Khi thấu hiểu, bạn đạt được sự tự do chân chính: Tự do nội tâm nhờ năng lực làm chủ ham muốn.',
      shadow: 'Dễ bốc đồng, thay đổi mục tiêu xoành xoạch hoặc tìm kiếm cảm giác hưng phấn tức thời để khỏa lấp sự trống trải.',
      action: 'Quy tắc "Trì hoãn 48 giờ": Trước khi quyết định từ bỏ một việc đang làm hoặc mua sắm theo cảm hứng, hãy chờ đúng 48 giờ trước khi hành động.'
    },
    16: {
      code: 16,
      title: 'Bài học Khiêm nhường & Tái sinh nhận thức (16/7)',
      focus: 'Buông bỏ cái tôi kiêu hãnh, xây dựng các mối quan hệ trên nền tảng chân thật và thức tỉnh tâm thức.',
      explanation: 'Con số 16 mang đến bài học sâu sắc về sự chân thật. Cuộc sống có thể tạo ra những biến động bất ngờ nhằm phá vỡ những ảo tưởng, vỏ bọc bề ngoài hoặc sự kiêu hãnh sai lầm, giúp bạn quay về với chiều sâu bản thể thực sự.',
      positive: 'Sau những lần chuyển hóa, bạn sở hữu sự thông thái uyên thâm, lòng khiêm nhường đích thực và khả năng nhìn thấu nhân tâm.',
      shadow: 'Xu hướng khép kín cay đắng, tự cô lập mình hoặc giữ cái tôi quá lớn để che giấu sự tổn thương.',
      action: 'Thực hành "Biết ơn & Cầu thị": Chủ động đón nhận phản hồi từ người khác mà không thanh minh, nhìn nhận lỗi sai như cơ hội quý giá để tiến hóa.'
    },
    19: {
      code: 19,
      title: 'Bài học Tự lực & Trách nhiệm chia sẻ (19/1)',
      focus: 'Cân bằng giữa độc lập tự chủ và tinh thần hợp tác, biết đón nhận sự giúp đỡ của cộng đồng.',
      explanation: 'Con số 19 rèn luyện cho bạn bài học về việc sử dụng quyền lực và sự tự lập. Tránh rơi vào trạng thái độc đoán, ích kỷ hoặc ngược lại là sợ hãi trách nhiệm; cần học cách đứng vững trên đôi chân mình đồng thời biết lắng nghe và chia sẻ.',
      positive: 'Một nhà lãnh đạo đầy nhân cách, tự chủ mạnh mẽ nhưng luôn sẵn lòng mở rộng vòng tay nâng đỡ người khác.',
      shadow: 'Xu hướng tự coi mình là trung tâm, khó chấp nhận ý kiến trái chiều hoặc ôm hết gánh nặng vì không tin ai.',
      action: 'Mở lòng đón nhận: Hãy tập nhờ cậy hoặc chia sẻ gánh nặng công việc với người khác ít nhất 1 lần mỗi tuần.'
    }
  };

  const MISSING_PRACTICES = {
    1: {
      number: 1,
      name: 'Năng lượng Tiên phong & Quyết đoán (Thiếu 1)',
      advice: 'Năng lượng số 1 là vùng bạn cần chủ động rèn luyện tính độc lập và khả năng tự quyết.',
      action: 'Mỗi ngày hãy tự mình đưa ra ít nhất 1 quyết định độc lập (từ việc nhỏ đến việc lớn) mà không cần hỏi xin ý kiến bất kỳ ai.'
    },
    2: {
      number: 2,
      name: 'Năng lượng Kết nối & Thấu cảm (Thiếu 2)',
      advice: 'Năng lượng số 2 là vùng bạn nên chú ý rèn luyện nghệ thuật lắng nghe và kiên nhẫn cảm nhận cảm xúc của đối phương.',
      action: 'Trong các cuộc trò chuyện, hãy lắng nghe đối phương nói xong 100%, ghi nhận cảm xúc của họ trước khi đưa ra ý kiến phản hồi.'
    },
    3: {
      number: 3,
      name: 'Năng lượng Biểu đạt & Bộc lộ cảm xúc (Thiếu 3)',
      advice: 'Năng lượng số 3 là vùng bạn cần cởi mở hơn trong việc diễn đạt suy nghĩ, cảm xúc chân thật ra bên ngoài.',
      action: 'Tập viết nhật ký hoặc chủ động chia sẻ một câu chuyện vui, một cảm xúc tích cực với người xung quanh mỗi ngày.'
    },
    4: {
      number: 4,
      name: 'Năng lượng Kỷ luật & Tổ chức nền tảng (Thiếu 4)',
      advice: 'Năng lượng số 4 là vùng cần rèn thói quen lập kế hoạch, sắp xếp đồ đạc ngăn nắp và thực hiện tuần tự từng bước.',
      action: 'Viết ra danh sách 3 việc quan trọng nhất cần hoàn thành vào mỗi tối trước khi đi ngủ và dọn dẹp bàn làm việc gọn gàng.'
    },
    5: {
      number: 5,
      name: 'Năng lượng Linh hoạt & Đón nhận đổi mới (Thiếu 5)',
      advice: 'Năng lượng số 5 là vùng cần mở lòng đón nhận những bất ngờ và dũng cảm bước ra khỏi vùng an toàn quen thuộc.',
      action: 'Mỗi tuần hãy thử làm một điều mới lạ: Đi một cung đường mới, thử một món ăn lạ hoặc tiếp cận một chủ đề trước đây chưa từng đọc.'
    },
    6: {
      number: 6,
      name: 'Năng lượng Trách nhiệm & Yêu thương có ranh giới (Thiếu 6)',
      advice: 'Năng lượng số 6 là vùng bạn nên trau dồi tình yêu thương gia đình, sự chăm sóc chu đáo nhưng có ranh giới lành mạnh.',
      action: 'Dành thời gian chất lượng (không điện thoại) để hỏi thăm và lắng nghe một người thân yêu mỗi ngày.'
    },
    7: {
      number: 7,
      name: 'Năng lượng Chiêm nghiệm & Đào sâu tri thức (Thiếu 7)',
      advice: 'Năng lượng số 7 là vùng bạn cần rèn thói quen tĩnh lặng, đọc sách và suy ngẫm sâu sắc về các bài học cuộc đời.',
      action: 'Dành ra 20 phút mỗi ngày trong không gian yên tĩnh để đọc sách chuyên môn hoặc thực hành quan sát hơi thở.'
    },
    8: {
      number: 8,
      name: 'Năng lượng Quản trị tài chính & Hiệu quả thực tế (Thiếu 8)',
      advice: 'Năng lượng số 8 là vùng bạn nên chủ động học hỏi về quản lý tiền bạc, đàm phán giá trị và định hướng kết quả rõ ràng.',
      action: 'Ghi chép chi tiêu chi tiết hàng tuần và tự tin đưa ra mức thù lao/giá trị tương xứng với công sức mình đóng góp.'
    },
    9: {
      number: 9,
      name: 'Năng lượng Bao dung & Tinh thần phụng sự (Thiếu 9)',
      advice: 'Năng lượng số 9 là vùng bạn nên rèn luyện lòng trắc ẩn, học cách buông xả những vướng bận và hướng tới đại cuộc.',
      action: 'Thực hiện một hành động tử tế hoặc giúp đỡ ai đó mỗi tuần mà hoàn toàn không mong cầu sự đền đáp hay ghi nhận.'
    }
  };

  // ==========================================================================
  // VI. HELPER CORE ENGINE & POSITION-AWARE INSIGHT GENERATOR
  // ==========================================================================
  function safeVal(val) {
    if (val === undefined || val === null) return 0;
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
  }

  // Tạo insight chuyên biệt cho một chỉ số tại vị trí cụ thể (Position-Aware Insight)
  function generatePositionInsight(posKey, num, context = {}) {
    const posProf = POSITION_PROFILES[posKey] || {
      key: posKey,
      name: posKey,
      role: 'Chỉ số thần số học',
      question: 'Chỉ số này mang lại bài học gì?'
    };

    const numProf = PROFILES[num] || PROFILES[1];
    const lensObj = (POSITION_FACETS[posKey] && POSITION_FACETS[posKey][num]) 
      ? POSITION_FACETS[posKey][num] 
      : null;

    let meaning = '';
    let positive = '';
    let shadow = '';
    let observation = '';
    let action = '';

    if (lensObj) {
      meaning = lensObj.meaning || '';
      positive = lensObj.positive || (numProf.strengths ? numProf.strengths[0] : '');
      shadow = lensObj.shadow || (numProf.shadows ? numProf.shadows[0] : '');
      observation = lensObj.observation || ('Quan sát cách năng lượng số ' + num + ' biểu hiện trong vai trò ' + posProf.role.toLowerCase() + '.');
      action = lensObj.action || (numProf.microAction || '');
    } else {
      // Fallback đa chiều dựa trên vai trò vị trí kết hợp năng lượng số
      meaning = 'Ở vị trí **' + posProf.name + '** (' + posProf.role + '), số **' + num + '** mang đến năng lượng ' + numProf.keyword.toLowerCase() + '. Điều này định hình cách bạn tiếp cận câu hỏi: "' + posProf.question + '".';
      positive = numProf.strengths ? numProf.strengths[0] : '';
      shadow = numProf.shadows ? numProf.shadows[0] : '';
      observation = 'Quan sát khi năng lượng số ' + num + ' bị đẩy lên thái quá hoặc rơi vào vùng bóng tối tại khía cạnh ' + posProf.name + '.';
      action = numProf.microAction || 'Thực hành nhận diện và tự điều chỉnh trong sinh hoạt hàng ngày.';
    }

    return {
      key: posKey,
      name: posProf.name,
      number: num,
      tier: posProf.tier || 'CORE',
      role: posProf.role,
      question: posProf.question,
      focus: posProf.focus || posProf.role,
      meaning: meaning,
      positive: positive,
      shadow: shadow,
      observation: observation,
      action: action
    };
  }

  // Tương tác Chặng + Thử thách (Stage + Challenge Interaction)
  function generateStageChallengeInteraction(stageVal, challengeVal, stageNum, extra = '') {
    const sProf = (POSITION_FACETS.chang && POSITION_FACETS.chang[stageVal]) 
      ? POSITION_FACETS.chang[stageVal] 
      : { theme: 'Chặng năng lượng số ' + stageVal, guidance: '' };
    
    const cProf = (POSITION_FACETS.thuThach && POSITION_FACETS.thuThach[challengeVal]) 
      ? POSITION_FACETS.thuThach[challengeVal] 
      : { name: 'Thử thách số ' + challengeVal, lesson: '' };

    let interactionInsight = '';
    if (stageVal === challengeVal && stageVal > 0) {
      interactionInsight = 'Đây là bài toán tiến hóa kép: Năng lượng đỉnh cao của Chặng (số ' + stageVal + ') đồng thời là bài học Thử thách cần vượt ngưỡng. Bạn vừa có cơ hội tỏa sáng nhất, vừa phải đối diện với bài tập tâm lý gắt gao nhất về chủ đề này.';
    } else if (stageVal === 5 && challengeVal === 2) {
      interactionInsight = 'Một giai đoạn đòi hỏi nhiều trải nghiệm, bứt phá và đổi mới (Chặng 5) nhưng đồng thời yêu cầu bạn phải học cách lắng nghe, kiên nhẫn và hòa hợp với cộng sự (Thử thách 2). Bài học là: Giữ vững tự do mà không làm tổn hại đến chất lượng các mối quan hệ.';
    } else if (stageVal === 1 && challengeVal === 4) {
      interactionInsight = 'Nhu cầu tiên phong, dẫn đầu và khởi xướng (Chặng 1) cần phải đi đôi với sự kiên nhẫn thiết lập quy trình, quản trị chi tiết và kỷ luật thực tế (Thử thách 4). Khởi xướng phải đi cùng hoàn thành.';
    } else if (stageVal === 8 && challengeVal === 3) {
      interactionInsight = 'Cơ hội phát triển tài chính và quyền lực (Chặng 8) đối diện với thử thách về khả năng biểu đạt, truyền cảm hứng và lạc quan (Thử thách 3). Thành tựu thực tế cần đi cùng với sự thấu cảm và truyền lửa.';
    } else if (stageVal === 22 && challengeVal === 4) {
      interactionInsight = 'Tầm nhìn kiến tạo vĩ mô (Chặng 22) được rèn luyện thông qua sự kiên định xây từng viên gạch kỷ luật và chuẩn mực thực tế (Thử thách 4). Đại sự bắt đầu từ tiểu tiết.';
    } else {
      interactionInsight = 'Bối cảnh ' + sProf.theme.toLowerCase() + ' đòi hỏi bạn phải đồng thời giải quyết ' + cProf.name.toLowerCase() + '. Sự kết hợp này rèn giũa cho bạn bản lĩnh dung hòa giữa cơ hội mở ra và ngưỡng cản tâm lý cần vượt qua.';
    }

    return {
      stageNum,
      stageVal,
      challengeVal,
      extra,
      title: 'Chặng ' + stageNum + ' (Số ' + stageVal + ')',
      reflection: 'Làm thế nào để tôi mở rộng trải nghiệm và tiến bước trong Chặng ' + stageVal + ' trong khi vẫn vượt qua thử thách số ' + challengeVal + '?',
      stageTheme: sProf.theme,
      stageGuidance: sProf.guidance,
      stageOpportunity: sProf.opportunity || '',
      stageAction: sProf.action || '',
      challengeName: cProf.name,
      challengeLesson: cProf.lesson,
      interactionInsight
    };
  }

  // Tương tác Năm cá nhân + Tháng cá nhân + Ngày cá nhân (Timeline Coaching)
  function generateTimelineCoaching(pyVal, pmVal, pdVal) {
    const yProf = (POSITION_FACETS.namCaNhan && POSITION_FACETS.namCaNhan[pyVal]) 
      ? POSITION_FACETS.namCaNhan[pyVal] 
      : { theme: 'Năm số ' + pyVal, guidance: '', action: '' };

    const mProf = (POSITION_FACETS.thangCaNhan && POSITION_FACETS.thangCaNhan[pmVal]) 
      ? POSITION_FACETS.thangCaNhan[pmVal] 
      : { theme: 'Tháng số ' + pmVal };

    const dProf = (POSITION_FACETS.ngayCaNhan && POSITION_FACETS.ngayCaNhan[pdVal]) 
      ? POSITION_FACETS.ngayCaNhan[pdVal] 
      : { theme: 'Ngày số ' + pdVal };

    // Tương tác Năm + Tháng
    let ymInteraction = '';
    if (pyVal === pmVal && pyVal > 0) {
      ymInteraction = 'Năng lượng kép số ' + pyVal + ': Tháng này khuếch đại tối đa chủ đề phát triển của cả năm (' + yProf.theme + '). Đây là tháng bản lề để bạn đưa ra những hành động mang tính quyết định.';
    } else if (pyVal === 5 && pmVal === 4) {
      ymInteraction = 'Trong một năm thiên về dịch chuyển và thay đổi linh hoạt (Năm 5), tháng này lại nhấn mạnh vào việc củng cố nền tảng, tổ chức trật tự và hoàn thiện các kế hoạch dang dở (Tháng 4). Đây là cơ hội vàng để đưa sự tự do vào khuôn khổ khả thi.';
    } else if (pyVal === 1 && pmVal === 9) {
      ymInteraction = 'Trong một năm khởi đầu và gieo hạt mới (Năm 1), tháng này đòi hỏi sự dọn dẹp, buông bỏ và hoàn tất những ràng buộc cũ (Tháng 9) để dọn đường cho chu kỳ bứt phá tiếp theo.';
    } else {
      ymInteraction = 'Chủ đề tháng (' + mProf.theme + ') đóng vai trò như bước đệm thực thi cụ thể trong bức tranh chiến lược dài hạn của năm (' + yProf.theme + ').';
    }

    // Tương tác Tháng + Ngày
    let mdInteraction = '';
    if (pmVal === pdVal && pmVal > 0) {
      mdInteraction = 'Hôm nay nhịp điệu của ngày cộng hưởng trọn vẹn với trọng tâm của tháng (năng lượng số ' + pmVal + '). Hãy dồn tâm sức cho mục tiêu cốt lõi.';
    } else if (pmVal === 4 && pdVal === 7) {
      mdInteraction = 'Hôm nay phù hợp với việc rà soát kỹ lưỡng, suy nghĩ thấu đáo và kiểm tra chất lượng (Ngày 7) để phục vụ cho mục tiêu xây dựng nền tảng vững chắc của tháng (Tháng 4).';
    } else {
      mdInteraction = 'Hôm nay là cơ hội vi mô để bạn thực hành ' + dProf.theme.toLowerCase() + ' nhằm phục vụ cho mục tiêu lớn hơn của tháng.';
    }

    // Tổng hợp toàn diện Timeline Insight
    const timelineInsight = 'Dòng chảy năng lượng hiện tại đang vận hành theo cấu trúc 3 tầng: **' + yProf.theme + '** định hướng chiến lược tổng thể; **' + mProf.theme + '** xác định trọng tâm hành động trong tháng; và **' + dProf.theme + '** chỉ dẫn nhịp điệu chánh niệm cho ngày hôm nay. Sự đồng điệu giữa ba tầng thời gian này giúp bạn không bị phân tán năng lượng mà luôn đi đúng nhịp điệu của sự tiến hóa.';

    return {
      year: {
        number: pyVal,
        theme: yProf.theme,
        question: (POSITION_PROFILES.namCaNhan && POSITION_PROFILES.namCaNhan.question) || 'Năm nay vũ trụ mời gọi tôi tập trung vào điều gì?',
        guidance: yProf.guidance,
        action: yProf.action
      },
      month: {
        number: pmVal,
        theme: mProf.theme,
        question: (POSITION_PROFILES.thangCaNhan && POSITION_PROFILES.thangCaNhan.question) || 'Tháng này tôi nên ưu tiên điều gì trong bối cảnh của năm?',
        guidance: mProf.theme,
        action: mProf.theme
      },
      day: {
        number: pdVal,
        theme: dProf.theme,
        question: (POSITION_PROFILES.ngayCaNhan && POSITION_PROFILES.ngayCaNhan.question) || 'Hôm nay tôi nên chú ý điều gì để đồng điệu năng lượng?',
        guidance: dProf.theme,
        action: dProf.theme
      },
      interactions: [ymInteraction, mdInteraction],
      ymInteraction,
      mdInteraction,
      timelineInsight
    };
  }

  // Tương tác Liên kết Đường đời - Sứ mệnh (Path-Mission Link)
  function generatePathMissionLinkInsight(ddVal, smVal, linkVal) {
    let insight = '';
    if (ddVal === smVal && ddVal > 0) {
      insight = 'Đường đời và Sứ mệnh cùng mang con số ' + ddVal + ': Bạn có sự nhất quán tuyệt đối giữa con đường rèn luyện cá nhân và giá trị đóng góp cho xã hội. Bài học bạn học cũng chính là món quà bạn trao đi. Thách thức là tránh cực đoan hóa khi năng lượng này rơi vào vùng bóng tối.';
    } else if ((ddVal === 5 && smVal === 9) || (ddVal === 9 && smVal === 5)) {
      insight = 'Con đường rèn luyện sự tự do trải nghiệm (số 5) kết hợp với hướng đóng góp nhân văn bao dung (số 9). Nhu cầu tự do khám phá của bạn chỉ thực sự tìm thấy ý nghĩa trọn vẹn khi được gắn liền với một mục tiêu phụng sự cuộc đời. Thách thức là không để sự phân tán làm suy yếu cam kết dài hạn.';
    } else if ((ddVal === 22 && smVal === 7) || (ddVal === 7 && smVal === 22)) {
      insight = 'Tầm nhìn kiến tạo hệ thống vĩ mô (số 22) được hỗ trợ bởi chiều sâu tri thức và sự sắc bén của trí tuệ chiêm nghiệm (số 7). Bạn có năng lực chuyển hóa các triết lý trừu tượng thành các công trình thực tế có giá trị trường tồn.';
    } else {
      insight = 'Chỉ số liên kết ' + linkVal + ' đóng vai trò như cây cầu nhịp cầu hóa giải khoảng cách giữa con đường tiến hóa cá nhân (số ' + ddVal + ') và phương thức đóng góp giá trị cho xã hội (số ' + smVal + '). Hãy chủ động phát huy năng lượng số ' + linkVal + ' để tạo ra sự ăn khớp hoàn hảo.';
    }
    return insight;
  }

  // Tương tác Liên kết Nhân cách - Linh hồn (Persona-Soul Link)
  function generatePersonaSoulLinkInsight(ncVal, lhVal, linkVal) {
    let insight = '';
    if (ncVal === lhVal && ncVal > 0) {
      insight = 'Nhân cách và Linh hồn cùng mang con số ' + ncVal + ': Sự chân thật tuyệt đối giữa bên trong và bên ngoài. Bạn không mang mặt nạ xã hội; người khác nhìn thấy bạn như thế nào thì nội tâm bạn chính là như vậy. Bạn sống thanh thản vì không tốn năng lượng đối phó.';
    } else if (ncVal === 5 && lhVal === 22) {
      insight = 'Bên ngoài bạn tạo ấn tượng là người phóng khoáng, linh hoạt và thích trải nghiệm (Nhân cách 5), nhưng sâu thẳm bên trong lại là một tâm hồn khao khát xây dựng những đại công trình hệ thống vĩ mô và bền vững (Linh hồn 22). Hãy chú ý thu hẹp khoảng cách giữa hình ảnh vui vẻ bên ngoài và khát vọng sâu sắc bên trong.';
    } else if (ncVal === 1 && lhVal === 2) {
      insight = 'Bên ngoài toát lên vẻ mạnh mẽ, độc lập và quyết đoán (Nhân cách 1), nhưng bên trong lại là một trái tim vô cùng nhạy cảm, khao khát sự thấu hiểu và ấm áp (Linh hồn 2). Hãy cho phép những người thực sự thân thiết được nhìn thấy sự mềm mại đáng quý bên trong bạn.';
    } else {
      insight = 'Chỉ số liên kết ' + linkVal + ' là chìa khóa giúp dung hòa giữa lớp vỏ bọc xã hội (Nhân cách ' + ncVal + ') và khát khao thầm kín của trái tim (Linh hồn ' + lhVal + '), tạo nên sự nhất quán và bình an nội tâm.';
    }
    return insight;
  }

  // ==========================================================================
  // VII. HÀM CHÍNH: GENERATE COACHING OBJECT HOÀN CHỈNH
  // ==========================================================================
  function generate(currentResult, options = {}) {
    if (!currentResult || typeof currentResult !== 'object') {
      throw new Error('NumerologyCoaching.generate: currentResult không hợp lệ.');
    }

    const data = currentResult;
    const isUnlocked = options.isUnlocked !== undefined ? !!options.isUnlocked : true;

    // 1. Phân tích 23 vị trí theo Position Profiles (Position Insights)
    const positionInsights = {};

    // Core indicators
    const coreKeys = ['duongDoi', 'suMenh', 'linhHon', 'nhanCach', 'truongThanh', 'ngaySinh', 'thaiDo', 'tuDuyLyTri', 'canBang', 'sucManhTiemThuc'];
    coreKeys.forEach(k => {
      const v = safeVal(data[k]);
      if (v > 0) {
        positionInsights[k] = generatePositionInsight(k, v, data);
      }
    });

    // Passion (Đam mê)
    if (Array.isArray(data.damMe) && data.damMe.length > 0) {
      positionInsights.damMe = {
        key: 'damMe',
        name: 'Đam mê',
        tier: 'CORE',
        role: POSITION_PROFILES.damMe.role,
        question: POSITION_PROFILES.damMe.question,
        numbers: data.damMe,
        meaning: 'Bạn sở hữu các con số đam mê nổi trội: ' + data.damMe.join(', ') + '. Đây là những lĩnh vực và hoạt động tự nhiên khơi dậy trạng thái say mê và hứng khởi mạnh mẽ nhất trong bạn.',
        action: 'Dành ít nhất 2 giờ mỗi tuần để tham gia vào các hoạt động liên quan đến các con số đam mê này để tái tạo năng lượng.'
      };
    }

    // Missing Numbers (Chỉ số thiếu)
    if (Array.isArray(data.chiSoThieu) && data.chiSoThieu.length > 0) {
      const missingList = data.chiSoThieu.map(n => MISSING_PRACTICES[n] || { number: n, name: 'Số ' + n, advice: '', action: '' });
      positionInsights.chiSoThieu = {
        key: 'chiSoThieu',
        name: 'Chỉ số thiếu',
        tier: 'DEVELOPMENT',
        role: POSITION_PROFILES.chiSoThieu.role,
        question: POSITION_PROFILES.chiSoThieu.question,
        numbers: data.chiSoThieu,
        missingList,
        meaning: 'Các con số ' + data.chiSoThieu.join(', ') + ' không xuất hiện trong tên gọi, báo hiệu những vùng năng lượng bạn cần chủ động rèn luyện và bổ khuyết trong hành trình trưởng thành.',
        action: 'Chọn 1 con số thiếu và thực hành bài tập rèn luyện tương ứng đều đặn trong 21 ngày.'
      };
    }

    // Links (Liên kết)
    const lkDD = safeVal(data.lkDuongDoiSuMenh);
    const ddVal = safeVal(data.duongDoi);
    const smVal = safeVal(data.suMenh);
    positionInsights.lkDuongDoiSuMenh = {
      key: 'lkDuongDoiSuMenh',
      name: 'Liên kết Đường đời – Sứ mệnh',
      tier: 'DEVELOPMENT',
      number: lkDD,
      role: POSITION_PROFILES.lkDuongDoiSuMenh.role,
      question: POSITION_PROFILES.lkDuongDoiSuMenh.question,
      meaning: generatePathMissionLinkInsight(ddVal, smVal, lkDD),
      action: 'Phát huy năng lượng cân bằng của số ' + lkDD + ' để gắn kết hành trình rèn luyện bản thân với mục tiêu cống hiến.'
    };

    const lkNC = safeVal(data.lkNhanCachLinhHon);
    const ncVal = safeVal(data.nhanCach);
    const lhVal = safeVal(data.linhHon);
    positionInsights.lkNhanCachLinhHon = {
      key: 'lkNhanCachLinhHon',
      name: 'Liên kết Nhân cách – Linh hồn',
      tier: 'DEVELOPMENT',
      number: lkNC,
      role: POSITION_PROFILES.lkNhanCachLinhHon.role,
      question: POSITION_PROFILES.lkNhanCachLinhHon.question,
      meaning: generatePersonaSoulLinkInsight(ncVal, lhVal, lkNC),
      action: 'Sử dụng năng lượng số ' + lkNC + ' để đưa con người chân thật bên trong ra biểu hiện tự nhiên ở bên ngoài.'
    };

    // Karmic Debt (Nợ nghiệp)
    const karmicDebt = [];
    if (Array.isArray(data.noNghiep) && data.noNghiep.length > 0) {
      data.noNghiep.forEach(code => {
        if (KARMIC_LESSONS[code]) {
          karmicDebt.push({
            ...KARMIC_LESSONS[code],
            number: code
          });
        }
      });
      positionInsights.noNghiep = {
        key: 'noNghiep',
        name: 'Nợ nghiệp',
        tier: 'DEVELOPMENT',
        role: POSITION_PROFILES.noNghiep.role,
        question: POSITION_PROFILES.noNghiep.question,
        items: karmicDebt,
        meaning: 'Hồ sơ của bạn mang các bài học phát triển tâm thức: ' + karmicDebt.map(k => k.title).join(', ') + '. Đây là những bài toán tiến hóa giúp bạn tôi luyện ý chí và đạt tới sự tự do đích thực.'
      };
    }

    // 4 Chặng & 4 Thử thách (Stages & Challenges)
    const cycles = [];
    const challengesByCycle = [];
    const changArr = Array.isArray(data.chang) ? data.chang : (Array.isArray(data.cycles) ? data.cycles : []);
    const thuThachArr = Array.isArray(data.thuThach) ? data.thuThach : (Array.isArray(data.thachThuc) ? data.thachThuc : (Array.isArray(data.challenges) ? data.challenges : []));

    for (let i = 0; i < 4; i++) {
      const cObj = changArr[i] || { num: i + 1, val: 0, age: 0, year: 0 };
      const ttObj = thuThachArr[i] || { num: i + 1, val: 0 };
      const extra = '(Tuổi ' + (cObj.age || '--') + ' • Năm ' + (cObj.year || '--') + ')';
      
      const stageInsight = generateStageChallengeInteraction(safeVal(cObj.val), safeVal(ttObj.val), i + 1, extra);
      cycles.push(stageInsight);
      
      const ttProf = (POSITION_FACETS.thuThach && POSITION_FACETS.thuThach[safeVal(ttObj.val)]) || { name: 'Thử thách ' + ttObj.val, lesson: '' };
      challengesByCycle.push({
        stage: i + 1,
        val: ttObj.val,
        name: ttProf.name,
        lesson: ttProf.lesson
      });

      positionInsights['chang' + (i + 1)] = {
        key: 'chang' + (i + 1),
        name: 'Chặng ' + (i + 1),
        tier: 'STAGE',
        number: cObj.val,
        extra,
        role: 'Chủ đề phát triển đỉnh cao Chặng ' + (i + 1),
        meaning: stageInsight.stageGuidance,
        action: stageInsight.stageAction
      };

      positionInsights['thuThach' + (i + 1)] = {
        key: 'thuThach' + (i + 1),
        name: 'Thử thách ' + (i + 1),
        tier: 'STAGE',
        number: ttObj.val,
        role: 'Bài toán tiến hóa Chặng ' + (i + 1),
        meaning: stageInsight.challengeLesson
      };
    }

    // 2. Timeline Coaching (Năm - Tháng - Ngày cá nhân)
    const chuKy = data.chuKy || {};
    const pyVal = safeVal(chuKy.namCaNhan || data.personalYear || data.namCaNhan || 0);
    const pmVal = safeVal(chuKy.thangCaNhan || data.personalMonth || data.thangCaNhan || 0);
    const pdVal = safeVal(chuKy.ngayCaNhan || data.personalDay || data.ngayCaNhan || 0);
    const timelineData = generateTimelineCoaching(pyVal, pmVal, pdVal);

    positionInsights.namCaNhan = {
      key: 'namCaNhan',
      name: 'Năm cá nhân',
      tier: 'TIME',
      number: pyVal,
      meaning: timelineData.year.guidance,
      action: timelineData.year.action
    };

    positionInsights.thangCaNhan = {
      key: 'thangCaNhan',
      name: 'Tháng cá nhân',
      tier: 'TIME',
      number: pmVal,
      meaning: timelineData.month.theme
    };

    positionInsights.ngayCaNhan = {
      key: 'ngayCaNhan',
      name: 'Ngày cá nhân',
      tier: 'TIME',
      number: pdVal,
      meaning: timelineData.day.theme
    };

    // 3. Quét Mâu Thuẫn Nội Tâm & Tổ Hợp Năng Lượng (Internal Conflicts & Themes)
    const coreList = [];
    const pushIf = (name, val) => {
      const v = safeVal(val);
      if (v > 0) coreList.push({ name, val: v });
    };
    pushIf('Đường đời', data.duongDoi);
    pushIf('Sứ mệnh', data.suMenh);
    pushIf('Linh hồn', data.linhHon);
    pushIf('Nhân cách', data.nhanCach);
    pushIf('Ngày sinh', data.ngaySinh);
    pushIf('Thái độ', data.thaiDo);
    pushIf('Trưởng thành', data.truongThanh);
    pushIf('Tư duy lý trí', data.tuDuyLyTri);
    pushIf('Cân bằng', data.canBang);

    const valuesSet = new Set(coreList.map(item => item.val));
    const valToSources = {};
    coreList.forEach(item => {
      if (!valToSources[item.val]) valToSources[item.val] = [];
      valToSources[item.val].push(item.name);
    });

    const detectedConflicts = [];
    ENERGY_PAIRS.forEach(pair => {
      const numA = pair.numbers[0];
      const numB = pair.numbers[1];
      if (valuesSet.has(numA) && valuesSet.has(numB)) {
        const sourcesA = (valToSources[numA] || []).join(', ');
        const sourcesB = (valToSources[numB] || []).join(', ');
        detectedConflicts.push({
          id: pair.id,
          name: pair.name,
          tagline: pair.tagline,
          numA,
          numB,
          sourceDesc: 'Xuất hiện giữa số ' + numA + ' (' + sourcesA + ') và số ' + numB + ' (' + sourcesB + ')',
          manifestation: pair.manifestation,
          positive: pair.positive,
          shadow: pair.shadow,
          lesson: pair.lesson,
          action: pair.action
        });
      }
    });

    // 4. Con số nổi trội (Dominant Numbers)
    const counts = {};
    coreList.forEach(item => {
      counts[item.val] = (counts[item.val] || 0) + 1;
    });
    const dominantNumbers = [];
    Object.keys(counts).forEach(k => {
      const num = parseInt(k, 10);
      const isCore = num === ddVal || num === smVal;
      if (counts[num] >= 2 || isCore) {
        dominantNumbers.push({
          number: num,
          score: counts[num],
          profile: PROFILES[num] || null,
          sources: valToSources[num] || []
        });
      }
    });
    dominantNumbers.sort((a, b) => b.score - a.score);

    // 5. Điểm mạnh và Thách thức tổng hợp
    const strengths = [];
    const challenges = [];
    const seenS = new Set();
    const seenC = new Set();
    ['duongDoi', 'suMenh', 'linhHon', 'nhanCach', 'truongThanh'].forEach(k => {
      const v = safeVal(data[k]);
      const prof = PROFILES[v];
      if (prof) {
        prof.strengths.forEach(s => {
          if (!seenS.has(s)) {
            seenS.add(s);
            strengths.push({ indicator: POSITION_PROFILES[k].name, number: v, content: s });
          }
        });
        prof.shadows.forEach(c => {
          if (!seenC.has(c)) {
            seenC.add(c);
            challenges.push({ indicator: POSITION_PROFILES[k].name, number: v, content: c });
          }
        });
      }
    });

    // 6. Định vị Archetype & Chân dung tổng thể
    const profDD = PROFILES[ddVal] || { archetype: 'Người Tìm Đường' };
    const profSM = PROFILES[smVal] || { archetype: 'Người Hành Động' };
    const profLH = PROFILES[lhVal] || { archetype: 'Tâm Hồn Chân Thật' };
    let archetype = '';
    let tagline = '';

    if (ddVal === 22 || smVal === 22 || lhVal === 22) {
      archetype = 'Kiến Trúc Sư Hệ Thống Mang Trái Tim Phụng Sự';
      tagline = 'Tầm nhìn vĩ mô kiến tạo di sản, kết hợp thực tế vững chắc và khát vọng cống hiến.';
    } else if (ddVal === 11 || smVal === 11 || lhVal === 11) {
      archetype = 'Ngọn Hải Đăng Khai Sáng & Truyền Cảm Hứng';
      tagline = 'Trực giác tinh tế dẫn đường, đánh thức nhận thức và kết nối yêu thương.';
    } else if (ddVal === 5 || smVal === 5) {
      archetype = 'Nhà Tiên Phong Đổi Mới & Thích Ứng Linh Hoạt';
      tagline = 'Tư duy phóng khoáng, dũng cảm khám phá các chân trời mới và xoay chuyển nghịch cảnh.';
    } else if (ddVal === 8 || smVal === 8) {
      archetype = 'Nhà Điều Hành Quyền Uy & Thành Tựu Vững Bền';
      tagline = 'Bản lĩnh thực chiến sắc bén, quản trị nguồn lực hướng tới hiệu suất tối ưu.';
    } else if (ddVal === 9 || smVal === 9) {
      archetype = 'Người Phụng Sự Nhân Văn & Khai Mở Tâm Thức';
      tagline = 'Lòng bao dung rộng lớn, sống vì lý tưởng phụng sự cộng đồng và trao đi giá trị.';
    } else if (ddVal === 7 || smVal === 7) {
      archetype = 'Nhà Tư Tưởng Trí Tuệ & Chiêm Nghiệm Chiều Sâu';
      tagline = 'Truy cầu chân lý sâu sắc, chuyển hóa tri thức và trải nghiệm thành sự thông thái.';
    } else {
      archetype = profDD.archetype + ' hướng tới ' + profSM.archetype;
      tagline = 'Hành trình phát huy nội lực số ' + ddVal + ' để hiện thực hóa sứ mệnh số ' + smVal + '.';
    }

    const nameStr = data.tenChuan || data.hoTen || 'Bạn';
    let overview = 'Bản đồ năng lượng của **' + nameStr + '** khắc họa chân dung một cá nhân sở hữu dòng năng lượng chủ đạo của **Đường đời ' + ddVal + '** (' + profDD.archetype + ') kết hợp với ngọn hải đăng định hướng từ **Sứ mệnh ' + smVal + '** (' + profSM.archetype + '). ';
    if (lhVal > 0) {
      overview += 'Sâu thẳm bên trong, động lực nội tâm thôi thúc mạnh mẽ nhất đến từ **Linh hồn ' + lhVal + '** (' + profLH.archetype + '), tạo nên một thế giới cảm xúc phong phú và khát khao sống trọn vẹn với giá trị chân thật. ';
    }
    if (detectedConflicts.length > 0) {
      const topConflict = detectedConflicts[0];
      overview += 'Điểm nhấn đáng chú ý nhất trong bức tranh tâm lý của bạn là sự tương tác sống động giữa các trường năng lượng, đặc biệt là chủ đề **"' + topConflict.name + '"**. Đây chính là chiếc chìa khóa vàng: Khi bạn học cách dung hòa hai mặt của đồng xu này, tiềm năng của bạn sẽ được kích hoạt tối đa.';
    } else {
      overview += 'Hành trình của bạn là sự tiến hóa liên tục giữa việc làm chủ tài năng thiên bẩm và chủ động rèn luyện những vùng năng lượng còn thiếu vắng để đạt tới trạng thái an lạc, tự do và thịnh vượng bền vững.';
    }

    // 7. Action Plan (Kế hoạch hành động)
    const actions = [];
    if (detectedConflicts.length > 0) {
      actions.push({ title: 'Cân bằng ' + detectedConflicts[0].name, content: detectedConflicts[0].action, type: 'balance' });
    }
    if (profDD.microAction) {
      actions.push({ title: 'Tối ưu nội lực Đường đời ' + ddVal, content: profDD.microAction, type: 'core' });
    }
    if (karmicDebt.length > 0) {
      actions.push({ title: 'Bài học tâm thức (' + karmicDebt[0].title + ')', content: karmicDebt[0].action, type: 'karma' });
    }
    if (positionInsights.chiSoThieu && positionInsights.chiSoThieu.missingList && positionInsights.chiSoThieu.missingList.length > 0) {
      actions.push({ title: 'Rèn luyện vùng bổ khuyết (' + positionInsights.chiSoThieu.missingList[0].name + ')', content: positionInsights.chiSoThieu.missingList[0].action, type: 'practice' });
    }
    if (timelineData.year && timelineData.year.action) {
      actions.push({ title: 'Chiến lược Năm cá nhân ' + pyVal, content: timelineData.year.action, type: 'timeline' });
    }

    // 8. Output Object hoàn chỉnh chuẩn Section XXXIX
    const coachingObject = {
      meta: {
        fullName: data.tenChuan || data.hoTen || '',
        birthDate: data.ngay + '/' + data.thang + '/' + data.nam,
        generatedAt: new Date().toISOString(),
        isUnlocked
      },
      profile: {
        archetype,
        tagline,
        summary: overview
      },
      core: {
        duongDoi: data.duongDoi,
        suMenh: data.suMenh,
        linhHon: data.linhHon,
        nhanCach: data.nhanCach,
        ngaySinh: data.ngaySinh,
        thaiDo: data.thaiDo,
        truongThanh: data.truongThanh,
        tuDuyLyTri: data.tuDuyLyTri,
        canBang: data.canBang
      },
      overview,
      positionInsights,
      dominantNumbers,
      themes: detectedConflicts,
      strengths: strengths.slice(0, 6),
      challenges: challenges.slice(0, 6),
      karmicDebt,
      missingNumbers: positionInsights.chiSoThieu ? positionInsights.chiSoThieu.missingList : [],
      actions,
      cycles,
      challengesByCycle,
      personalCycle: chuKy,
      personalYear: {
        number: pyVal,
        theme: timelineData.year.theme,
        question: timelineData.year.question,
        interpretation: timelineData.year,
        themes: [timelineData.year.theme],
        actions: timelineData.year.action ? [timelineData.year.action] : []
      },
      personalMonth: {
        number: pmVal,
        theme: timelineData.month.theme,
        question: timelineData.month.question,
        interpretation: timelineData.month,
        themes: [timelineData.month.theme],
        actions: timelineData.month.action ? [timelineData.month.action] : []
      },
      personalDay: {
        number: pdVal,
        theme: timelineData.day.theme,
        question: timelineData.day.question,
        interpretation: timelineData.day,
        themes: [timelineData.day.theme],
        actions: timelineData.day.action ? [timelineData.day.action] : []
      },
      timeline: timelineData,
      interactions: [
        ...detectedConflicts.map(c => ({
          type: 'conflict',
          id: c.id,
          name: c.name,
          title: c.name,
          sourceDesc: c.sourceDesc,
          insight: c.manifestation,
          action: c.action
        })),
        ...cycles.map(c => ({
          type: 'stage_challenge',
          stage: c.stageNum,
          title: 'Tương tác Chặng ' + c.stageNum + ' (' + c.stageVal + ') & Thử thách (' + c.challengeVal + ')',
          stageVal: c.stageVal,
          challengeVal: c.challengeVal,
          stageTheme: c.stageTheme,
          challengeLesson: c.challengeLesson,
          insight: c.interactionInsight,
          action: c.stageAction
        })),
        {
          type: 'timeline',
          title: 'Tương tác Dòng chảy Thời gian (Năm ' + pyVal + ' → Tháng ' + pmVal + ' → Ngày ' + pdVal + ')',
          ymInteraction: timelineData.ymInteraction,
          mdInteraction: timelineData.mdInteraction,
          insight: timelineData.timelineInsight
        },
        ...(positionInsights.lkDuongDoiSuMenh ? [{
          type: 'path_mission',
          title: 'Liên kết Đường đời & Sứ mệnh',
          number: positionInsights.lkDuongDoiSuMenh.number,
          insight: positionInsights.lkDuongDoiSuMenh.meaning,
          action: positionInsights.lkDuongDoiSuMenh.action
        }] : []),
        ...(positionInsights.lkNhanCachLinhHon ? [{
          type: 'persona_soul',
          title: 'Liên kết Nhân cách & Linh hồn',
          number: positionInsights.lkNhanCachLinhHon.number,
          insight: positionInsights.lkNhanCachLinhHon.meaning,
          action: positionInsights.lkNhanCachLinhHon.action
        }] : [])
      ],
      internalConflicts: detectedConflicts,
      developmentLessons: [
        ...karmicDebt.map(k => ({ type: 'karma', title: k.title, content: k.explanation, action: k.action })),
        ...(positionInsights.chiSoThieu ? positionInsights.chiSoThieu.missingList.map(m => ({ type: 'missing', title: m.name, content: m.advice, action: m.action })) : [])
      ]
    };

    return coachingObject;
  }

  // ==========================================================================
  // VIII. VALIDATION API (Kiểm Tra Chuẩn Đầu Ra)
  // ==========================================================================
  function validate(coaching) {
    const errors = [];
    if (!coaching || typeof coaching !== 'object') {
      return { valid: false, errors: ['Coaching object is null or not an object'] };
    }

    if (!coaching.meta || !coaching.meta.fullName) errors.push('Missing meta.fullName');
    if (!coaching.positionInsights) errors.push('Missing positionInsights');
    if (!Array.isArray(coaching.cycles) || coaching.cycles.length === 0) errors.push('Missing or empty cycles');
    if (!coaching.timeline || !coaching.timeline.timelineInsight) errors.push('Missing timeline insight');
    if (!Array.isArray(coaching.themes)) errors.push('Missing themes array');
    if (!Array.isArray(coaching.actions)) errors.push('Missing actions array');

    return {
      valid: errors.length === 0,
      errors,
      checks: {
        hasAllPositions: coaching.positionInsights && Object.keys(coaching.positionInsights).length >= 15,
        hasTimeline: !!(coaching.timeline && coaching.personalYear),
        hasConflicts: !!(coaching.internalConflicts && coaching.internalConflicts.length >= 0),
        hasActions: !!(coaching.actions && coaching.actions.length > 0)
      }
    };
  }

  // ==========================================================================
  // IX. RENDER HTML GIAO DIỆN (Semantic, Responsive & Chuẩn Thiết Kế Cosmic)
  // ==========================================================================
  function renderHTML(coaching) {
    if (!coaching || typeof coaching !== 'object') {
      return '<div class="coaching-error">Không có dữ liệu luận giải.</div>';
    }

    const { meta, profile, core, overview, positionInsights, themes, strengths, challenges, karmicDebt, missingNumbers, actions, cycles, timeline } = coaching;
    const isUnlocked = meta.isUnlocked !== false;

    // Helper render 1 card vị trí
    const renderPosCard = (key) => {
      const p = positionInsights[key];
      if (!p) return '';
      const isLocked = !isUnlocked && (p.tier === 'DEVELOPMENT' || (key !== 'duongDoi' && key !== 'suMenh' && key !== 'thaiDo'));
      
      return [
        '<div class="pos-insight-card ' + (isLocked ? 'pos-locked' : '') + '">',
        '  <div class="pos-head">',
        '    <span class="pos-role-badge">' + p.role + '</span>',
        '    <h4 class="pos-title">' + p.name + ': <span class="pos-num">' + (isLocked ? '🔒' : p.number) + '</span></h4>',
        '  </div>',
        '  <div class="pos-question"><em>"' + p.question + '"</em></div>',
        '  <div class="pos-body">',
        isLocked ? [
          '    <div class="pos-locked-text">🔒 Chỉ số này đang được khóa cho thành viên. Đăng nhập để mở khóa luận giải chi tiết.</div>'
        ].join('\n') : [
          '    <p class="pos-meaning">' + p.meaning + '</p>',
          p.positive ? '    <div class="pos-sub-point pos-pos"><strong>✨ Mặt tích cực:</strong> ' + p.positive + '</div>' : '',
          p.shadow ? '    <div class="pos-sub-point pos-shad"><strong>⚡ Vùng cần quan sát:</strong> ' + p.shadow + '</div>' : '',
          p.action ? '    <div class="pos-sub-point pos-act"><strong>🌱 Hành động gợi ý:</strong> ' + p.action + '</div>' : ''
        ].filter(Boolean).join('\n'),
        '  </div>',
        '</div>'
      ].join('\n');
    };

    let html = [
      '<div class="coaching-report">',
      '  <!-- HEADER HERO -->',
      '  <div class="coaching-hero">',
      '    <div class="coaching-badge">✨ POSITION-AWARE NUMEROLOGY COACHING ENGINE</div>',
      '    <h2 class="coaching-name">' + meta.fullName + '</h2>',
      '    <div class="coaching-meta-sub">Ngày sinh: <strong>' + meta.birthDate + '</strong> | Năm cá nhân: <strong>' + (timeline.year.number || 'N/A') + '</strong> (' + timeline.year.theme + ')</div>',
      '    ',
      '    <div class="coaching-archetype-box">',
      '      <div class="coaching-archetype-title">🧠 ' + profile.archetype + '</div>',
      '      <div class="coaching-archetype-tagline">' + profile.tagline + '</div>',
      '    </div>',
      '    <div class="coaching-pills-row">',
      '      <span class="coaching-pill">🧭 Đường đời: <strong>' + core.duongDoi + '</strong></span>',
      '      <span class="coaching-pill">🎯 Sứ mệnh: <strong>' + core.suMenh + '</strong></span>',
      '      <span class="coaching-pill">💖 Linh hồn: <strong>' + (isUnlocked ? core.linhHon : '🔒') + '</strong></span>',
      '      <span class="coaching-pill">🎭 Nhân cách: <strong>' + (isUnlocked ? core.nhanCach : '🔒') + '</strong></span>',
      '      <span class="coaching-pill">🌱 Trưởng thành: <strong>' + (isUnlocked ? core.truongThanh : '🔒') + '</strong></span>',
      '    </div>',
      '  </div>',
      !isUnlocked ? [
        '  <div class="coaching-locked-banner" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #f59e0b; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">',
        '    <div style="color: #92400e; font-size: 0.92rem; line-height: 1.5;">',
        '      <strong>🔒 Bản xem trước (Khách):</strong> Bạn đang xem bài luận dựa trên các chỉ số mở. Để mở khóa toàn bộ 23 chỉ số và nhận bài phân tích chuyên sâu chi tiết nhất, vui lòng đăng nhập hoặc kích hoạt tài khoản.',
        '    </div>',
        '    <button type="button" class="btn btn-primary btn-sm" onclick="closeCoachingModal(); openAuthModal(\'login\');" style="white-space: nowrap;">Đăng nhập / Kích hoạt</button>',
        '  </div>'
      ].join('\n') : '',
      '  <!-- 1. CHÂN DUNG TỔNG THỂ -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🧠</span>',
      '      <h3>1. Chân Dung Năng Lượng & Bản Thể Tự Nhiên</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      '      <p class="coaching-overview-text">' + overview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</p>',
      '    </div>',
      '  </section>',
      '  <!-- 2. CẤU TRÚC CỐT LÕI (CORE POSITION INSIGHTS - TẦNG 1) -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🧭</span>',
      '      <h3>2. Cấu Trúc Vị Trí Cốt Lõi (Core Position Insights)</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      '      <div class="pos-grid-two">',
      renderPosCard('duongDoi'),
      renderPosCard('suMenh'),
      renderPosCard('linhHon'),
      renderPosCard('nhanCach'),
      renderPosCard('truongThanh'),
      renderPosCard('ngaySinh'),
      renderPosCard('thaiDo'),
      renderPosCard('tuDuyLyTri'),
      renderPosCard('canBang'),
      renderPosCard('sucManhTiemThuc'),
      '      </div>',
      '    </div>',
      '  </section>',
      '  <!-- 3. MÂU THUẪN NỘI TÂM & TỔ HỢP NĂNG LƯỢNG -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🔎</span>',
      '      <h3>3. Mâu Thuẫn Nội Tâm & Tương Tác Năng Lượng (Internal Conflicts)</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      themes.length === 0 ? '      <p class="coaching-empty-note">Bản đồ của bạn sở hữu các dòng năng lượng có tính đồng nhất cao, ít xảy ra các xung đột nội tâm gay gắt giữa các cặp năng lượng đối lập.</p>' : themes.map((t, idx) => [
        '      <div class="coaching-conflict-card">',
        '        <div class="conflict-head">',
        '          <span class="conflict-index">#' + (idx + 1) + '</span>',
        '          <div class="conflict-title-wrap">',
        '            <h4 class="conflict-title">' + t.name + '</h4>',
        '            <div class="conflict-sources">' + t.sourceDesc + '</div>',
        '          </div>',
        '        </div>',
        '        <div class="conflict-tagline"><em>' + t.tagline + '</em></div>',
        '        <div class="conflict-grid">',
        '          <div class="conflict-col">',
        '            <div class="conflict-label">⚡ Biểu hiện có thể xảy ra:</div>',
        '            <div class="conflict-text">' + t.manifestation + '</div>',
        '          </div>',
        '          <div class="conflict-col">',
        '            <div class="conflict-label">✨ Mặt tích cực khi dung hòa:</div>',
        '            <div class="conflict-text">' + t.positive + '</div>',
        '          </div>',
        '        </div>',
        '        <div class="conflict-lesson-box">',
        '          <div class="conflict-label">🧩 Bài học chuyển hóa:</div>',
        '          <div class="conflict-text">' + t.lesson + '</div>',
        '        </div>',
        '        <div class="conflict-action-box">',
        '          <div class="conflict-label">🌱 Hành động rèn luyện đề xuất:</div>',
        '          <div class="conflict-text">' + t.action + '</div>',
        '        </div>',
        '      </div>'
      ].join('\n')).join('\n'),
      '    </div>',
      '  </section>',
      '  <!-- 4. ĐIỂM MẠNH & MẶT BÓNG -->',
      '  <div class="coaching-two-cols">',
      '    <section class="coaching-section col-half">',
      '      <div class="coaching-sec-header">',
      '        <span class="coaching-sec-icon">💪</span>',
      '        <h3>4. Điểm Mạnh Bẩm Sinh</h3>',
      '      </div>',
      '      <div class="coaching-sec-body">',
      '        <ul class="coaching-list strength-list">',
      strengths.map(s => '          <li><strong>[' + s.indicator + ' ' + s.number + ']</strong>: ' + s.content + '</li>').join('\n'),
      '        </ul>',
      '      </div>',
      '    </section>',
      '    <section class="coaching-section col-half">',
      '      <div class="coaching-sec-header">',
      '        <span class="coaching-sec-icon">⚡</span>',
      '        <h3>5. Vùng Cần Quan Sát (Mặt Bóng)</h3>',
      '      </div>',
      '      <div class="coaching-sec-body">',
      '        <ul class="coaching-list shadow-list">',
      challenges.map(c => '          <li><strong>[' + c.indicator + ' ' + c.number + ']</strong>: ' + c.content + '</li>').join('\n'),
      '        </ul>',
      '      </div>',
      '    </section>',
      '  </div>',
      '  <!-- 5. CHẶNG ĐỈNH CAO & THỬ THÁCH (TẦNG 3) -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🏔️</span>',
      '      <h3>6. Chặng Đỉnh Cao & Thử Thách Tiến Hóa (Life Stages Coaching)</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      '      <div class="stages-container">',
      cycles.map(c => [
        '        <div class="stage-card">',
        '          <div class="stage-head">',
        '            <div class="stage-badge">Chặng ' + c.stageNum + '</div>',
        '            <h4 class="stage-title">Đỉnh cao: <strong>Số ' + c.stageVal + '</strong> & Thử thách: <strong>Số ' + c.challengeVal + '</strong></h4>',
        '            <div class="stage-extra">' + c.extra + '</div>',
        '          </div>',
        '          <div class="stage-theme-text"><strong>🎯 Bối cảnh giai đoạn:</strong> ' + c.stageTheme + '</div>',
        '          <p class="stage-desc">' + c.stageGuidance + '</p>',
        '          <div class="stage-interaction-box">',
        '            <div class="stage-inter-label">🔄 Tương tác Chặng + Thử thách:</div>',
        '            <div class="stage-inter-text">' + c.interactionInsight + '</div>',
        '          </div>',
        '        </div>'
      ].join('\n')).join('\n'),
      '      </div>',
      '    </div>',
      '  </section>',
      '  <!-- 6. DÒNG CHẢY THỜI GIAN (NĂM - THÁNG - NGÀY & TIMELINE COACHING - TẦNG 4) -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🗓️</span>',
      '      <h3>7. Nhịp Phát Triển Hiện Tại (Timeline Coaching)</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      '      <div class="timeline-grid">',
      '        <div class="timeline-col">',
      '          <div class="time-badge">Năm cá nhân ' + timeline.year.number + '</div>',
      '          <h4>' + timeline.year.theme + '</h4>',
      '          <p>' + timeline.year.guidance + '</p>',
      '        </div>',
      '        <div class="timeline-col">',
      '          <div class="time-badge">Tháng cá nhân ' + timeline.month.number + '</div>',
      '          <h4>' + timeline.month.theme + '</h4>',
      '          <p>' + timeline.ymInteraction + '</p>',
      '        </div>',
      '        <div class="timeline-col">',
      '          <div class="time-badge">Ngày cá nhân ' + timeline.day.number + '</div>',
      '          <h4>' + timeline.day.theme + '</h4>',
      '          <p>' + timeline.mdInteraction + '</p>',
      '        </div>',
      '      </div>',
      '      <div class="timeline-summary-box">',
      '        <div class="time-sum-label">🧭 Lời khuyên định hướng dòng chảy thời gian:</div>',
      '        <div class="time-sum-text">' + timeline.timelineInsight + '</div>',
      '      </div>',
      '    </div>',
      '  </section>',
      (karmicDebt.length > 0 || missingNumbers.length > 0) ? [
        '  <!-- 7. BÀI HỌC TÂM THỨC (NỢ NGHIỆP & CHỈ SỐ THIẾU) -->',
        '  <section class="coaching-section">',
        '    <div class="coaching-sec-header">',
        '      <span class="coaching-sec-icon">🧩</span>',
        '      <h3>8. Bài Học Tâm Thức & Vùng Rèn Luyện (Development Lessons)</h3>',
        '    </div>',
        '    <div class="coaching-sec-body">',
        karmicDebt.length > 0 ? [
          '      <div class="karmic-block">',
          '        <h4 class="sub-sec-title">🌀 Bài học phát triển tâm thức (Karmic Lessons):</h4>',
          karmicDebt.map(k => [
            '        <div class="karmic-item">',
            '          <div class="karmic-item-head">',
            '            <span class="karmic-badge">Mã số ' + k.code + '</span>',
            '            <strong>' + k.title + '</strong>',
            '          </div>',
            '          <p class="karmic-desc">' + k.explanation + '</p>',
            '          <div class="karmic-action"><strong>🎯 Bài tập rèn luyện:</strong> ' + k.action + '</div>',
            '        </div>'
          ].join('\n')).join('\n'),
          '      </div>'
        ].join('\n') : '',
        missingNumbers.length > 0 ? [
          '      <div class="missing-block">',
          '        <h4 class="sub-sec-title">🌱 Vùng năng lượng cần chủ động bổ khuyết (Chỉ số thiếu):</h4>',
          '        <div class="missing-grid">',
          missingNumbers.map(m => [
            '          <div class="missing-card">',
            '            <div class="missing-card-head">',
            '              <span class="missing-num">Số ' + m.number + '</span>',
            '              <strong>' + m.name + '</strong>',
            '            </div>',
            '            <div class="missing-advice">' + m.advice + '</div>',
            '            <div class="missing-action"><strong>Hành động:</strong> ' + m.action + '</div>',
            '          </div>'
          ].join('\n')).join('\n'),
          '        </div>',
          '      </div>'
        ].join('\n') : '',
        '    </div>',
        '  </section>'
      ].join('\n') : '',
      '  <!-- 8. KẾ HOẠCH HÀNH ĐỘNG THỰC TẾ (ACTION PLAN) -->',
      '  <section class="coaching-section">',
      '    <div class="coaching-sec-header">',
      '      <span class="coaching-sec-icon">🌱</span>',
      '      <h3>9. Kế Hoạch Hành Động Đề Xuất (Action Plan)</h3>',
      '    </div>',
      '    <div class="coaching-sec-body">',
      '      <div class="actions-container">',
      actions.map((act, i) => [
        '        <div class="action-card">',
        '          <div class="action-check">✓</div>',
        '          <div class="action-content-wrap">',
        '            <div class="action-title">Bước ' + (i + 1) + ': ' + act.title + '</div>',
        '            <div class="action-text">' + act.content + '</div>',
        '          </div>',
        '        </div>'
      ].join('\n')).join('\n'),
      '      </div>',
      '    </div>',
      '  </section>',
      '  <!-- DISCLAIMER -->',
      '  <div class="coaching-disclaimer">',
      '    ⚖️ <strong>Tuyên bố tự nhận thức:</strong> Đây là diễn giải Thần số học theo hướng tự nhận thức và phát triển bản thân, không phải dự đoán chắc chắn về tương lai. Mỗi cá nhân luôn nắm giữ quyền tự quyết và sức mạnh chuyển hóa cuộc đời mình thông qua nhận thức và hành động hàng ngày.',
      '  </div>',
      '</div>'
    ].filter(Boolean).join('\n');

    return html;
  }

  // Export
  return {
    profiles: PROFILES,
    positionProfiles: POSITION_PROFILES,
    positionFacets: POSITION_FACETS,
    energyPairs: ENERGY_PAIRS,
    karmicLessons: KARMIC_LESSONS,
    missingPractices: MISSING_PRACTICES,
    generate,
    validate,
    renderHTML
  };
}));
