import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  {
    text: 'Trong Spec-Driven Development (SDD), điều gì là "nguồn sự thật" (source of truth) mà code phải phụ thuộc vào?',
    options: [
      'Bản đặc tả (specification)',
      'Lịch sử commit Git',
      'Ý kiến của lập trình viên giỏi nhất',
      'Tài liệu README',
    ],
    correctIndex: 0,
    explanation:
      'SDD dựa trên nguyên tắc: đặc tả (spec) là nguồn sự thật, code chỉ là kết quả phái sinh (downstream) từ spec.',
  },
  {
    text: 'Bốn bước chính của Spec-Driven Development là gì?',
    options: [
      'Design, Code, Test, Deploy',
      'Specify, Clarify, Plan, Tasks',
      'Analyze, Build, Ship, Monitor',
      'Plan, Do, Check, Act',
    ],
    correctIndex: 1,
    explanation: 'Bốn bước theo README hackathon: Specify → Clarify → Plan → Tasks.',
  },
  {
    text: 'Bước nào trong SDD hay bị bỏ qua nhất, dù nó mang lại giá trị lớn nhất?',
    options: ['Specify', 'Clarify', 'Plan', 'Tasks'],
    correctIndex: 1,
    explanation:
      'Clarify (làm rõ điểm mơ hồ) là bước hay bị bỏ qua nhất — giải quyết một điểm mơ hồ trong 30 giây tiết kiệm 30 phút sửa lỗi về sau.',
  },
  {
    text: 'EARS (Easy Approach to Requirements Syntax) dùng để làm gì?',
    options: [
      'Định dạng file cấu hình CI/CD',
      'Viết yêu cầu (requirement) theo cấu trúc rõ ràng, có thể kiểm thử được',
      'Đặt tên biến trong code',
      'Quản lý phiên bản API',
    ],
    correctIndex: 1,
    explanation:
      'EARS là chuẩn viết requirement: ví dụ "WHEN [sự kiện] THE SYSTEM SHALL [hành vi mong đợi]", giúp yêu cầu rõ ràng và kiểm thử được.',
  },
  {
    text: 'Trong quy trình Test-Driven Development (TDD) áp dụng cho SDD, thứ tự đúng là gì?',
    options: [
      'Viết code trước, viết test sau để xác nhận',
      'Viết test trước (Red), sau đó viết code để test pass (Green)',
      'Viết tài liệu trước, không cần test',
      'Viết test và code cùng lúc, không theo thứ tự',
    ],
    correctIndex: 1,
    explanation:
      'TDD: Red (test thất bại) rồi Green (code khiến test pass) — cho AI/agent một mục tiêu cụ thể để tự kiểm tra.',
  },
  {
    text: 'Tại sao nên dùng model AI mạnh nhất trong giai đoạn Plan, và model nhanh/rẻ hơn khi Implement?',
    options: [
      'Vì Plan quyết định toàn bộ hướng đi tiếp theo, còn Implement chỉ là "chuyển thể" (transcription) từ plan tốt',
      'Vì model mạnh không thể viết code',
      'Vì model rẻ không hỗ trợ Plan Mode',
      'Không có sự khác biệt, chỉ là thói quen',
    ],
    correctIndex: 0,
    explanation:
      'Planning chiếm ít token nhưng quyết định mọi thứ về sau; khi plan đã tốt, Implement gần như chỉ là việc chuyển thể sang code.',
  },
  {
    text: 'Mục đích chính của việc dùng một model AI thứ hai (khác model đã build) để review code là gì?',
    options: [
      'Để tiết kiệm chi phí token',
      'Vì model thứ nhất không biết cách review',
      'Vì một model tự review sản phẩm của chính nó thường lặp lại đúng điểm mù (blind spot) của nó',
      'Vì quy định bắt buộc phải dùng 2 model',
    ],
    correctIndex: 2,
    explanation:
      'Model tự review chính nó chia sẻ chung điểm mù: nó tự tin bỏ sót lại đúng lỗi đã gây ra sai lầm ban đầu. Cần model khác để phát hiện.',
  },
  {
    text: 'Trong hoạt động "Caveman Mode" (trả lời cộc lốc, tối giản), lợi ích thực tế ngoài sự hài hước là gì?',
    options: [
      'Giúp code chạy nhanh hơn',
      'Giảm chi phí trực tiếp vì output token (token đầu ra) là loại token tính phí đắt và bị giảm bớt',
      'Tăng độ chính xác của model',
      'Không có lợi ích thực tế nào',
    ],
    correctIndex: 1,
    explanation:
      'Vì tính phí theo token, và output token là loại đắt nhất, một câu trả lời ngắn gọn trực tiếp giảm chi phí.',
  },
  {
    text: 'Theo yêu cầu REQ-007 trong đặc tả activity-log, hệ thống KHÔNG được phép làm gì?',
    options: [
      'Ghi lại actor và action',
      'Tự đọc đồng hồ hệ thống (system clock) trực tiếp; thời gian phải được caller cung cấp',
      'Redact dữ liệu nhạy cảm',
      'Trả về kết quả rỗng khi không có match',
    ],
    correctIndex: 1,
    explanation:
      'REQ-007 yêu cầu thời gian phải được inject từ caller, không đọc trực tiếp đồng hồ hệ thống, để component có thể test được mà không cần chờ đợi thực tế.',
  },
  {
    text: '"Pit of success" trong ngữ cảnh TDD nghĩa là gì?',
    options: [
      'Một lỗi phổ biến cần tránh',
      'Thiết kế sao cho con đường đúng cũng là con đường dễ nhất, để một agent thiếu tập trung vẫn cho ra kết quả tốt',
      'Một giai đoạn trong vòng đời dự án',
      'Tên gọi khác của Clarify',
    ],
    correctIndex: 1,
    explanation:
      'Pit of success: làm cho con đường đúng trở thành con đường dễ đi nhất, để ngay cả khi làm việc thiếu tập trung vẫn đạt kết quả tốt.',
  },
];

async function main() {
  await prisma.question.deleteMany();
  for (const q of questions) {
    await prisma.question.create({
      data: {
        text: q.text,
        options: JSON.stringify(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      },
    });
  }
  console.log(`Seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
