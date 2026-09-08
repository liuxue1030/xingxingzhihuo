// 沪教版英语二年级上册 Unit 1 课堂检测卷（五感大冒险）
// 共26题，按原卷六大题顺序排列
const ENGLISH_EXAM_U1 = [
    // 一、看图选一选（每题4分，共20分）
    {
        section: '一、看图选一选（每题 4 分，共 20 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image1.png',
        question: '看一看图片，选择正确的英文句子。',
        options: ['A. I can see the flowers.', 'B. I can smell the flowers.', 'C. I can hear the flowers.'],
        answer: 'B. I can smell the flowers.'
    },
    {
        section: '一、看图选一选（每题 4 分，共 20 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image2.png',
        question: '看一看图片，选择正确的英文句子。',
        options: ['A. I can hear the birds.', 'B. I can see the birds.', 'C. I can taste the birds.'],
        answer: 'A. I can hear the birds.'
    },
    {
        section: '一、看图选一选（每题 4 分，共 20 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image3.png',
        question: '看一看图片，选择正确的英文句子。',
        options: ['A. I can see the rabbit.', 'B. I can smell the rabbit.', 'C. I can feel the rabbit.'],
        answer: 'C. I can feel the rabbit.'
    },
    {
        section: '一、看图选一选（每题 4 分，共 20 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image4.png',
        question: '看一看图片，选择正确的英文句子。',
        options: ['A. I can taste the lollipop.', 'B. I can see the lollipop.', 'C. I can hear the lollipop.'],
        answer: 'A. I can taste the lollipop.'
    },
    {
        section: '一、看图选一选（每题 4 分，共 20 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image5.png',
        question: '看一看图片，选择正确的英文句子。',
        options: ["A. It's soft.", "B. It's hard.", "C. It's thin."],
        answer: "B. It's hard."
    },

    // 二、连一连（每题3分，共15分）→ 改为选择正确中文意思
    {
        section: '二、连一连（每题 3 分，共 15 分）',
        type: 'engExamChoice',
        question: 'I can see a cat.',
        options: ['我能闻到花香。', '我能看见一只猫。', '我能听到一只猫叫。', '我能感受到风。'],
        answer: '我能看见一只猫。'
    },
    {
        section: '二、连一连（每题 3 分，共 15 分）',
        type: 'engExamChoice',
        question: 'I can hear a cat.',
        options: ['我能听见一只猫叫。', '我能看见一只猫。', '我能尝到苹果的味道。', '我能闻到花香。'],
        answer: '我能听见一只猫叫。'
    },
    {
        section: '二、连一连（每题 3 分，共 15 分）',
        type: 'engExamChoice',
        question: 'I can smell the flowers.',
        options: ['我能感受到风。', '我能闻到花香。', '我能尝到苹果的味道。', '我能看见一只猫。'],
        answer: '我能闻到花香。'
    },
    {
        section: '二、连一连（每题 3 分，共 15 分）',
        type: 'engExamChoice',
        question: 'I can taste the apples.',
        options: ['我能闻到花香。', '我能尝到苹果的味道。', '我能看见一只猫。', '我能听到一只猫叫。'],
        answer: '我能尝到苹果的味道。'
    },
    {
        section: '二、连一连（每题 3 分，共 15 分）',
        type: 'engExamChoice',
        question: 'I can feel the wind.',
        options: ['我能看见一只猫。', '我能听到一只猫叫。', '我能闻到花香。', '我能感受到风。'],
        answer: '我能感受到风。'
    },

    // 三、判断对错（每题3分，共15分）
    {
        section: '三、判断对错（每题 3 分，共 15 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image6.png',
        question: '看图，判断句子是否正确。',
        options: ['√ 正确', '× 错误'],
        answer: '√ 正确'
    },
    {
        section: '三、判断对错（每题 3 分，共 15 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image7.png',
        question: 'I can hear with my nose.',
        options: ['√ 正确', '× 错误'],
        answer: '× 错误'
    },
    {
        section: '三、判断对错（每题 3 分，共 15 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image1.png',
        question: 'I can smell with my nose.',
        options: ['√ 正确', '× 错误'],
        answer: '√ 正确'
    },
    {
        section: '三、判断对错（每题 3 分，共 15 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image5.png',
        question: 'The stone is soft.',
        options: ['√ 正确', '× 错误'],
        answer: '× 错误'
    },
    {
        section: '三、判断对错（每题 3 分，共 15 分）',
        type: 'engExamImg',
        image: 'images/english_exam/image8.png',
        question: 'I can taste with my tongue.',
        options: ['√ 正确', '× 错误'],
        answer: '√ 正确'
    },

    // 四、选词填空（每题3分，共15分）
    {
        section: '四、选词填空（每题 3 分，共 15 分）',
        type: 'engExamText',
        question: 'I can ____ the flowers with my nose.',
        answer: 'smell'
    },
    {
        section: '四、选词填空（每题 3 分，共 15 分）',
        type: 'engExamText',
        question: 'I can ____ the birds with my ears.',
        answer: 'hear'
    },
    {
        section: '四、选词填空（每题 3 分，共 15 分）',
        type: 'engExamText',
        question: 'I can ____ the rabbit with my hands.',
        answer: 'feel'
    },
    {
        section: '四、选词填空（每题 3 分，共 15 分）',
        type: 'engExamText',
        question: 'I can ____ the lollipop with my tongue.',
        answer: 'taste'
    },
    {
        section: '四、选词填空（每题 3 分，共 15 分）',
        type: 'engExamText',
        question: 'I can ____ a cat with my eyes.',
        answer: 'see'
    },

    // 五、情景选择（每题5分，共25分）
    {
        section: '五、情景选择（每题 5 分，共 25 分）',
        type: 'engExamChoice',
        question: '你想问朋友能看到什么，应该说：',
        options: ['A. What can you see?', 'B. What can you hear?', 'C. What can you smell?'],
        answer: 'A. What can you see?'
    },
    {
        section: '五、情景选择（每题 5 分，共 25 分）',
        type: 'engExamChoice',
        question: '你听到了小猫的叫声，你可以说：',
        options: ['A. I can see a kitten.', 'B. I can hear a kitten.', 'C. I can taste a kitten.'],
        answer: 'B. I can hear a kitten.'
    },
    {
        section: '五、情景选择（每题 5 分，共 25 分）',
        type: 'engExamChoice',
        question: '老师让你摸一个东西，你摸到它很软，可以说：',
        options: ["A. It's hard.", "B. It's soft.", "C. It's thin."],
        answer: "B. It's soft."
    },
    {
        section: '五、情景选择（每题 5 分，共 25 分）',
        type: 'engExamChoice',
        question: '朋友递给你一朵花让你闻，你说：',
        options: ['A. I can smell flowers.', 'B. I can see flowers.', 'C. I can hear flowers.'],
        answer: 'A. I can smell flowers.'
    },
    {
        section: '五、情景选择（每题 5 分，共 25 分）',
        type: 'engExamChoice',
        question: '你想表达“我能用手和手指触摸和感觉”，应该说：',
        options: ['A. I can see and hear with my eyes and ears.', 'B. I can touch and feel with my hands and fingers.', 'C. I can smell and taste with my nose and tongue.'],
        answer: 'B. I can touch and feel with my hands and fingers.'
    },

    // 六、排序题（共10分）
    {
        section: '六、排序题（共 10 分）',
        type: 'engExamChoice',
        question: '盲人摸象的故事中，四位盲人分别说了什么？请将句子序号按故事顺序排列。\n① No. It’s soft.  ② The elephant is hard.  ③ No. It’s thick.  ④ It’s thin.  ⑤ Come and feel my elephant.',
        options: [
            '⑤ → ① → ② → ③ → ④',
            '⑤ → ② → ① → ③ → ④',
            '⑤ → ② → ③ → ① → ④',
            '⑤ → ① → ③ → ② → ④'
        ],
        answer: '⑤ → ① → ② → ③ → ④'
    }
];

if (typeof window !== 'undefined') {
    window.ENGLISH_EXAM_U1 = ENGLISH_EXAM_U1;
}
