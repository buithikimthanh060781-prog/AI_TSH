/**
 * Dữ liệu ý nghĩa các chỉ số Thần số học Pythagoras & nội dung diễn giải chi tiết
 */

const TSH_DATA = {
  // Định nghĩa các chỉ số
  indicators: {
    duongDoi: {
      key: 'duongDoi',
      name: 'Đường đời',
      group: 'cotLoi',
      shortDesc: 'Con số chủ đạo quan trọng nhất, định hướng hành trình, năng lực bẩm sinh và bài học lớn nhất đời người.',
      isFree: true
    },
    suMenh: {
      key: 'suMenh',
      name: 'Sứ mệnh',
      group: 'cotLoi',
      shortDesc: 'Mục đích tối thượng linh hồn bạn cần hoàn thành, dấu ấn bạn để lại cho cuộc đời.',
      isFree: true
    },
    linhHon: {
      key: 'linhHon',
      name: 'Linh hồn',
      group: 'cotLoi',
      shortDesc: 'Khát khao thầm kín, động lực sâu thẳm thôi thúc bạn hành động và mang lại hạnh phúc thật sự.',
      isFree: false
    },
    nhanCach: {
      key: 'nhanCach',
      name: 'Nhân cách',
      group: 'cotLoi',
      shortDesc: 'Ấn tượng ban đầu, phong thái bên ngoài mà người khác nhìn nhận về bạn.',
      isFree: false
    },
    truongThanh: {
      key: 'truongThanh',
      name: 'Trưởng thành',
      group: 'cotLoi',
      shortDesc: 'Nguồn năng lượng trỗi dậy mạnh mẽ từ tuổi 35-40, mở ra bước ngoặt thành công vượt bậc.',
      isFree: false
    },
    ngaySinh: {
      key: 'ngaySinh',
      name: 'Ngày sinh',
      group: 'cotLoi',
      shortDesc: 'Tài năng đặc biệt, món quà tự nhiên được ban tặng ngay từ khi bạn cất tiếng khóc chào đời.',
      isFree: false
    },
    thaiDo: {
      key: 'thaiDo',
      name: 'Thái độ',
      group: 'boTro',
      shortDesc: 'Phản xạ tự nhiên và cách bạn đối diện khi đối mặt với tình huống bất ngờ hay khó khăn.',
      isFree: false
    },
    tuDuyLyTri: {
      key: 'tuDuyLyTri',
      name: 'Tư duy lý trí',
      group: 'boTro',
      shortDesc: 'Lăng kính tư duy, cách bộ não bạn phân tích, xử lý vấn đề và ra quyết định.',
      isFree: false
    },
    canBang: {
      key: 'canBang',
      name: 'Cân bằng',
      group: 'boTro',
      shortDesc: 'Điểm tựa tinh thần giúp bạn lấy lại bình tĩnh, sáng suốt mỗi khi mất thăng bằng.',
      isFree: false
    },
    damMe: {
      key: 'damMe',
      name: 'Đam mê',
      group: 'boTro',
      shortDesc: 'Sở thích, nguồn cảm hứng dồi dào khiến bạn say mê cống hiến quên thời gian.',
      isFree: false
    },
    chiSoThieu: {
      key: 'chiSoThieu',
      name: 'Chỉ số thiếu',
      group: 'dacBiet',
      shortDesc: 'Những khoảng trống năng lượng cần rèn luyện bồi đắp để bản thân trở nên trọn vẹn.',
      isFree: false
    },
    sucManhTiemThuc: {
      key: 'sucManhTiemThuc',
      name: 'Sức mạnh tiềm thức',
      group: 'dacBiet',
      shortDesc: 'Khả năng tự hồi phục tâm trí và sức mạnh nội tại trước những thử thách cuộc sống.',
      isFree: false
    },
    lkDuongDoiSuMenh: {
      key: 'lkDuongDoiSuMenh',
      name: 'Liên kết Đường đời - Sứ mệnh',
      group: 'boTro',
      shortDesc: 'Cây cầu nối giúp bạn dung hoà giữa con người hiện tại và lý tưởng cao đẹp cần đạt đến.',
      isFree: false
    },
    lkNhanCachLinhHon: {
      key: 'lkNhanCachLinhHon',
      name: 'Liên kết Nhân cách - Linh hồn',
      group: 'boTro',
      shortDesc: 'Chìa khoá thống nhất giữa nội tâm sâu kín và diện mạo thể hiện ra bên ngoài.',
      isFree: false
    },
    chang1: {
      key: 'chang1',
      name: 'Chặng 1 (Đỉnh cao 1)',
      group: 'dinhCao',
      shortDesc: 'Giai đoạn học hỏi, tích lũy nền tảng và khẳng định cái tôi ban đầu.',
      isFree: false
    },
    chang2: {
      key: 'chang2',
      name: 'Chặng 2 (Đỉnh cao 2)',
      group: 'dinhCao',
      shortDesc: 'Giai đoạn xây dựng thành tựu cá nhân, gia đình và sự nghiệp vững vàng.',
      isFree: false
    },
    chang3: {
      key: 'chang3',
      name: 'Chặng 3 (Đỉnh cao 3)',
      group: 'dinhCao',
      shortDesc: 'Giai đoạn thăng hoa chín muồi, lan toả ảnh hưởng và mở rộng quy mô.',
      isFree: false
    },
    chang4: {
      key: 'chang4',
      name: 'Chặng 4 (Đỉnh cao 4)',
      group: 'dinhCao',
      shortDesc: 'Giai đoạn đúc kết trí tuệ, cống hiến cho thế hệ mai sau và an vui nội tâm.',
      isFree: false
    },
    thuThach1: {
      key: 'thuThach1',
      name: 'Thử thách 1',
      group: 'thuThach',
      shortDesc: 'Bài thi lớn cần rèn luyện ở giai đoạn tuổi trẻ đầu đời.',
      isFree: false
    },
    thuThach2: {
      key: 'thuThach2',
      name: 'Thử thách 2',
      group: 'thuThach',
      shortDesc: 'Thử thách rèn dũa bản lĩnh khi bước vào giai đoạn lập thân.',
      isFree: false
    },
    thuThach3: {
      key: 'thuThach3',
      name: 'Thử thách 3',
      group: 'thuThach',
      shortDesc: 'Bài học trung niên đòi hỏi sự sáng suốt và kiên định.',
      isFree: false
    },
    thuThach4: {
      key: 'thuThach4',
      name: 'Thử thách 4',
      group: 'thuThach',
      shortDesc: 'Bài học cuộc đời để đạt đến trạng thái tự do tâm trí viên mãn.',
      isFree: false
    },
    noNghiep: {
      key: 'noNghiep',
      name: 'Nợ nghiệp (Karmic Debt)',
      group: 'dacBiet',
      shortDesc: 'Các bài học nghiệp quả từ quá khứ (13, 14, 16, 19) cần thức tỉnh và hoá giải.',
      isFree: false
    },
    namTheGioi: {
      key: 'namTheGioi',
      name: 'Năm thế giới (Universal Year)',
      group: 'cotLoi',
      shortDesc: 'Năng lượng rung động chủ đạo của toàn cầu trong năm. Cho biết xu hướng chuyển dịch và bài học chung của nhân loại.',
      isFree: true
    },
    namCaNhan: {
      key: 'namCaNhan',
      name: 'Năm cá nhân (Personal Year)',
      group: 'cotLoi',
      shortDesc: 'Vận trình riêng của bạn trong năm, được tạo nên từ sự tương tác giữa ngày tháng sinh và năng lượng Năm thế giới.',
      isFree: true
    },
    thangCaNhan: {
      key: 'thangCaNhan',
      name: 'Tháng cá nhân (Personal Month)',
      group: 'boTro',
      shortDesc: 'Nhịp điệu năng lượng từng tháng, giúp bạn định hướng thời điểm nên bứt phá hay củng cố.',
      isFree: true
    },
    ngayCaNhan: {
      key: 'ngayCaNhan',
      name: 'Ngày cá nhân (Personal Day)',
      group: 'boTro',
      shortDesc: 'Năng lượng vi mô trong ngày hôm nay, gợi ý xu hướng hành động phù hợp nhất.',
      isFree: true
    }
  },

  // Ý nghĩa chi tiết theo từng con số
  meanings: {
    1: {
      title: 'Số 1: Người Tiên Phong & Thủ Lĩnh',
      keywords: 'Độc lập, Tiên phong, Ý chí, Tự chủ, Sáng tạo, Trách nhiệm',
      summary: 'Mang năng lượng mặt trời rực rỡ, con số 1 tượng trưng cho sự khởi đầu, lòng can đảm và khát vọng dẫn đầu. Bạn sinh ra để tự mở lối đi riêng thay vì đi theo dấu chân người khác.',
      strengths: 'Ý chí kiên cường, tư duy độc lập sắc bén, không ngại thử thách mới, khả năng đưa ra quyết định nhanh chóng và dẫn dắt đội ngũ.',
      challenges: 'Dễ rơi vào bảo thủ, cái tôi quá lớn, độc đoán hoặc áp đặt ý kiến lên người khác khi không được kiềm chế.',
      advice: 'Hãy học cách lắng nghe, thấu cảm và trao quyền cho người đồng hành để sức mạnh lãnh đạo của bạn được ủng hộ tuyệt đối.'
    },
    2: {
      title: 'Số 2: Sứ Giả Hoà Bình & Kết Nối',
      keywords: 'Lắng nghe, Tinh tế, Hòa hợp, Trực giác, Ngoại giao, Kiên nhẫn',
      summary: 'Mang năng lượng mặt trăng dịu êm, con số 2 là biểu tượng của sự lắng nghe, gắn kết và thấu cảm. Bạn sở hữu trực giác tuyệt vời và tài năng hoá giải mọi mâu thuẫn.',
      strengths: 'Khả năng cảm nhận tâm lý người khác tinh tế, phong thái nhã nhặn, biết cách lắng nghe chân thành, kết nối mọi người thành một khối.',
      challenges: 'Dễ xúc động, quá nhạy cảm trước lời phán xét, đôi khi thiếu quyết đoán và có xu hướng phụ thuộc vào người khác.',
      advice: 'Hãy đặt ra ranh giới cá nhân lành mạnh và tin tưởng vào tiếng nói trực giác bên trong bạn.'
    },
    3: {
      title: 'Số 3: Ngọn Lửa Sáng Tạo & Truyền Cảm Hứng',
      keywords: 'Lạc quan, Sáng tạo, Ngôn từ, Hài hước, Tự biểu đạt, Nghệ thuật',
      summary: 'Số 3 là hiện thân của niềm vui sống, sức sáng tạo bất tận và tài năng diễn đạt ngôn từ lôi cuốn. Đi đến đâu, bạn cũng mang theo nguồn sinh khí tươi vui và tiếng cười.',
      strengths: 'Giao tiếp hoạt ngôn, tư duy thẩm mỹ cao, tinh thần lạc quan truyền cảm hứng, giải quyết vấn đề bằng những góc nhìn mới lạ.',
      challenges: 'Dễ mất tập trung, nhanh chán khi làm việc lặp lại, đôi khi nói quá nhiều hoặc nói lời thiếu cẩn trọng khi vui quá đà.',
      advice: 'Hãy tập trung năng lượng vào các dự án cụ thể và rèn luyện tính kỷ luật để biến những ý tưởng tuyệt vời thành sản phẩm hữu hình.'
    },
    4: {
      title: 'Số 4: Nền Móng Vững Chắc & Kỷ Luật',
      keywords: 'Thực tế, Quy chuẩn, Kỷ luật, Trung thực, Tỉ mỉ, Đáng tin cậy',
      summary: 'Số 4 tượng trưng cho hình vuông vững chắc, đất mẹ bao dung và tính trật tự. Bạn là điểm tựa kiên cố, người biến những ý tưởng trên giấy thành hiện thực vững bền qua sự tỉ mỉ.',
      strengths: 'Khả năng tổ chức xuất sắc, tư duy logic thực tế, tính kỷ luật cao độ, trung thực và luôn giữ trọn cam kết.',
      challenges: 'Có xu hướng cứng nhắc, ngại thay đổi, quá cầu toàn hoặc nhìn nhận sự việc qua lăng kính vật chất khô khan.',
      advice: 'Hãy mở rộng lòng đón nhận những góc nhìn mới và cho phép bản thân linh hoạt hơn trước những biến động cuộc sống.'
    },
    5: {
      title: 'Số 5: Cơn Gió Tự Do & Bứt Phá',
      keywords: 'Tự do, Trải nghiệm, Thích ứng, Phiêu lưu, Đa tài, Đột phá',
      summary: 'Đứng ở trung tâm của dãy số từ 1 đến 9, số 5 đại diện cho sự tự do, khát khao khám phá những chân trời mới và khả năng thích ứng linh hoạt kỳ diệu trước mọi môi trường.',
      strengths: 'Đầu óc nhạy bén, thích nghi cực nhanh, dũng cảm khám phá cái mới, tài ăn nói duyên dáng và nhiều tài lẻ phong phú.',
      challenges: 'Dễ bốc đồng, cả thèm chóng chán, sợ sự ràng buộc kỷ luật và có thể vướng vào thói quen quá nuông chiều bản thân.',
      advice: 'Tự do chân chính chỉ có được trên nền tảng của kỷ luật tự giác. Hãy chọn một hướng đi mũi nhọn để phát huy tối đa tài năng.'
    },
    6: {
      title: 'Số 6: Trái Tim Yêu Thương & Trách Nhiệm',
      keywords: 'Tình yêu, Gia đình, Chăm sóc, Lòng trắc ẩn, Cố vấn, Nghệ thuật',
      summary: 'Số 6 là biểu tượng của người mẹ, mái ấm gia đình và tình yêu thương vô điều kiện. Bạn sinh ra với thiên chức chăm sóc, chữa lành và tạo dựng không gian ấm áp, bình yên cho những người xung quanh.',
      strengths: 'Trái tim ấm áp giàu lòng vị tha, tinh thần trách nhiệm cao, khiếu thẩm mỹ tinh tế và tài năng tư vấn, trị liệu tâm hồn.',
      challenges: 'Dễ ôm đồm gánh nặng của người khác, can thiệp quá sâu vào cuộc đời người thân, dễ bị tổn thương nếu không được đáp lại.',
      advice: 'Hãy học cách yêu thương chính bản thân mình trước và cho phép người khác tự chịu trách nhiệm về bài học cuộc đời họ.'
    },
    7: {
      title: 'Số 7: Nhà Thông Thái & Triết Gia Nội Tâm',
      keywords: 'Trí tuệ, Chiêm nghiệm, Tâm linh, Phân tích, Độc lập, Chân lý',
      summary: 'Số 7 là con số của nhà bác học, triết gia và người tìm kiếm chân lý. Bạn có nhu cầu sâu sắc về sự tĩnh lặng để đào sâu bản chất của vạn vật và thế giới tâm linh.',
      strengths: 'Tư duy phân tích chiều sâu, trực giác tâm linh mạnh mẽ, khả năng tự học phi thường và không dễ bị dẫn dắt bởi trào lưu nhất thời.',
      challenges: 'Có xu hướng khép kín, cô lập bản thân, hoài nghi quá mức và gặp khó khăn trong việc bộc lộ cảm xúc với người khác.',
      advice: 'Hãy mở lòng kết nối với cuộc sống đời thường và chia sẻ nguồn tri thức sâu rộng của bạn để giúp đỡ cộng đồng.'
    },
    8: {
      title: 'Số 8: Biểu Tượng Quyền Lực & Thịnh Vượng',
      keywords: 'Điều hành, Tài chính, Quyền lực, Thực tế, Tầm nhìn lớn, Nhân quả',
      summary: 'Số 8 đại diện cho sự cân bằng giữa vật chất và tinh thần, biểu tượng của sự thịnh vượng, quyền uy và năng lực điều hành xuất sắc. Bạn có tầm nhìn chiến lược và khả năng hiện thực hoá tham vọng lớn.',
      strengths: 'Tư duy tài chính nhạy bén, bản lĩnh thương trường, khả năng quản trị con người và tầm nhìn bao quát vĩ mô.',
      challenges: 'Dễ bị cuốn vào vòng xoáy vật chất danh vọng, lạnh lùng, kiểm soát thái quá và bỏ quên đời sống cảm xúc.',
      advice: 'Hãy luôn ghi nhớ quy luật Nhân - Quả: tạo ra giá trị bền vững cho xã hội chính là chìa khoá vàng giữ cho dòng chảy thịnh vượng của bạn không bao giờ cạn.'
    },
    9: {
      title: 'Số 9: Tinh Thần Nhân Đạo & Hoàn Thiện',
      keywords: 'Bác ái, Cho đi, Nhân văn, Trí tuệ, Lý tưởng, Hoàn thành',
      summary: 'Là con số kết thúc của chu kỳ số đơn, số 9 chứa đựng tinh hoa của tất cả các con số trước đó. Bạn mang trái tim đại đồng, lý tưởng sống cao đẹp và tinh thần cống hiến vì nhân loại.',
      strengths: 'Tấm lòng nhân ái bao la, phong thái đĩnh đạc, khả năng truyền cảm hứng mạnh mẽ và tư duy toàn cầu.',
      challenges: 'Đôi khi quá lý tưởng hoá thực tế, khó tha thứ cho bản thân khi mắc lỗi, hay tiếc nuối quá khứ và khó buông bỏ.',
      advice: 'Hãy học cách buông bỏ những điều đã qua, chấp nhận sự không hoàn hảo của thế giới và kiên định với lý tưởng nhân văn của mình.'
    },
    11: {
      title: 'Số Bậc Thầy 11/2: Ngọn Hải Đăng Trực Giác & Soi Đường',
      keywords: 'Bậc thầy tâm linh, Trực giác tối cao, Nhạy cảm, Truyền cảm hứng, Sứ mệnh',
      summary: 'Số 11 là số Bậc thầy đầu tiên, kết hợp sự kiên định của số 1 và trực giác nhạy bén của số 2 ở tần số nhân đôi. Bạn được trao sứ mệnh thức tỉnh và dẫn dắt tâm hồn người khác hướng về ánh sáng.',
      strengths: 'Trực giác tâm linh nhạy bén phi thường, khả năng thấu suốt tương lai, năng lượng truyền cảm hứng lan toả mạnh mẽ.',
      challenges: 'Áp lực nội tâm rất lớn, dễ bị căng thẳng thần kinh vì cảm nhận quá nhiều luồng năng lượng từ môi trường xung quanh.',
      advice: 'Hãy thiền định, hòa mình vào thiên nhiên để giữ vững tâm an trước khi đảm nhận vai trò người soi đường cho tập thể.'
    },
    22: {
      title: 'Số Bậc Thầy 22/4: Kiến Trúc Sư Vĩ Đại Của Nhân Loại',
      keywords: 'Kiến tạo vĩ mô, Biến ước mơ thành hiện thực, Tầm nhìn thời đại, Vững chãi',
      summary: 'Số 22/4 được mệnh danh là con số quyền lực nhất trong Thần số học. Bạn có khả năng kết hợp lý tưởng vĩ đại của trực giác với năng lực thực thi kỷ luật đến mức phi thường.',
      strengths: 'Tầm nhìn thế kỷ, năng lực tổ chức những dự án quy mô toàn cầu, biến điều tưởng chừng không thể thành hiện thực vững bền.',
      challenges: 'Khối lượng công việc khổng lồ, áp lực thành công đè nặng và nỗi sợ không hoàn thành được kỳ vọng to lớn của bản thân.',
      advice: 'Hãy chia nhỏ tầm nhìn vĩ đại thành từng bước đi kiên định, xây dựng đội ngũ kế cận đồng lòng để cùng chia sẻ gánh nặng.'
    },
    33: {
      title: 'Số Bậc Thầy 33/6: Tình Thương Vô Điều Kiện & Bậc Thầy Chữa Lành',
      keywords: 'Trị liệu tâm hồn, Lòng trắc ẩn vũ trụ, Nâng tầm nhận thức, Phụng sự',
      summary: 'Số 33/6 là con số của tình yêu thương vũ trụ ở tầng bậc cao nhất. Bạn sinh ra để chữa lành những tổn thương tâm hồn của nhân loại và lan toả năng lượng bình an.',
      strengths: 'Lòng từ bi bao la, khả năng an ủi và chuyển hoá nỗi đau người khác thành sức mạnh, tấm gương sống đạo đức chuẩn mực.',
      challenges: 'Dễ hy sinh thân mình đến kiệt sức vì người khác, gánh vác bi kịch của cả cộng đồng lên vai.',
      advice: 'Bảo vệ nguồn năng lượng của chính mình là điều kiện tiên quyết để ngọn đèn chữa lành của bạn có thể soi sáng bền bỉ.'
    }
  },

  // Ý nghĩa các con số Nợ nghiệp
  karmicDebts: {
    13: {
      code: '13/4',
      title: 'Nợ nghiệp 13/4: Bài học về Kỷ luật & Kiên trì',
      desc: 'Dấu chỉ bạn cần nỗ lực gấp đôi người khác để đạt thành quả. Mọi con đường tắt đều dẫn đến đổ vỡ.',
      cure: 'Rèn luyện thói quen làm việc có kế hoạch, tỉ mỉ, kiên nhẫn và không bao giờ bỏ dở việc giữa chừng.'
    },
    14: {
      code: '14/5',
      title: 'Nợ nghiệp 14/5: Bài học về Tự do & Giới hạn',
      desc: 'Xu hướng dễ rơi vào cám dỗ, thiếu kiên định, thay đổi công việc liên tục làm ảnh hưởng đến người thân.',
      cure: 'Học cách kiểm soát ham muốn tức thời, đặt cam kết lâu dài và sử dụng sự tự do một cách có trách nhiệm.'
    },
    16: {
      code: '16/7',
      title: 'Nợ nghiệp 16/7: Bài học về Khiêm nhường & Tỉnh thức',
      desc: 'Thường trải qua những biến cố lớn trong sự nghiệp hoặc tình cảm để phá tan cái tôi kiêu ngạo.',
      cure: 'Sống chân thành, nuôi dưỡng lòng khiêm hạ, phát triển đời sống tinh thần và luôn tôn trọng người khác.'
    },
    19: {
      code: '19/1',
      title: 'Nợ nghiệp 19/1: Bài học về Lắng nghe & Vị tha',
      desc: 'Thường phải tự lực cánh sinh trong cô đơn, gánh vác mọi việc một mình do tính cách độc lập quá mức trong quá khứ.',
      cure: 'Biết mở lòng đón nhận sự giúp đỡ, biết ơn người khác và dùng tài năng để phụng sự lợi ích chung.'
    }
  },

  // Câu hỏi thường gặp FAQ
  faq: [
    {
      q: 'Thần số học Pythagoras là gì và hoạt động dựa trên nguyên lý nào?',
      a: 'Thần số học (Numerology) theo trường phái nhà toán học và triết gia cổ đại Pythagoras là môn khoa học nghiên cứu về sự tương tác giữa các tần số rung động của con số với tính cách, tiềm năng và các chu kỳ biến cố trong cuộc đời con người. Mỗi ký tự trong tên và ngày tháng năm sinh đều quy đổi ra các số có ý nghĩa rung động riêng biệt.'
    },
    {
      q: 'Tại sao cần nhập cả Tên và Ngày tháng năm sinh?',
      a: 'Ngày tháng năm sinh quyết định con số Đường đời và các Chặng biến cố thời gian (yếu tố thiên bẩm, định hướng). Họ tên quyết định các chỉ số Sứ mệnh, Linh hồn, Nhân cách (yếu tố nội tâm, năng lực biểu đạt). Sự kết hợp cả hai tạo nên bản đồ toàn diện 23 chỉ số cá nhân hoá độc bản cho riêng bạn.'
    },
    {
      q: 'Làm sao để mở khoá toàn bộ 23 chỉ số?',
      a: 'Bạn chỉ cần bấm nút "Đăng ký" bằng số điện thoại của mình (chỉ mất 15 giây). Sau khi Admin kích hoạt tài khoản, hệ thống sẽ mở khoá toàn bộ 23 chỉ số, bản đồ chi tiết và hỗ trợ xuất ảnh PNG, in PDF lưu lại trọn đời.'
    },
    {
      q: 'Các số Bậc thầy (11, 22, 33) có ý nghĩa gì đặc biệt?',
      a: 'Số 11, 22 và 33 là các số bậc thầy (Master Numbers), mang tần số năng lượng cao và tiềm năng vượt trội. Người sở hữu các số này thường có trực giác mạnh, sứ mệnh lớn lao nhưng cũng đối mặt với nhiều bài học thử thách hơn người bình thường.'
    },
    {
      q: 'Nợ nghiệp có phải là điều đáng sợ không?',
      a: 'Hoàn toàn không. Nợ nghiệp (13, 14, 16, 19) trong Thần số học giống như những môn học mà linh hồn bạn còn dang dở ở quá khứ. Nhận biết được Nợ nghiệp giúp bạn chủ động rèn luyện đúng phẩm chất cần thiết để chuyển hoá thành tựu rực rỡ.'
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.TSH_DATA = TSH_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TSH_DATA;
}
