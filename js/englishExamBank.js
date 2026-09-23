// 英语单元测试题库（由 9 份自编试卷整理，连线题/选词填空已转为选择题，判断题保留）
// 统一每题 10 分：首次答对 10 分，第二次答对 5 分（由测验引擎按 points 计算）
const ENGLISH_EXAM_BANK = [
    {
        "unit": "一U1",
        "type": "choice",
        "question": "What food do you like?",
        "options": [
            "I like red.",
            "I like tomatoes.",
            "I like blue."
        ],
        "answer": "I like tomatoes.",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "Do you like noodles?",
        "options": [
            "Yes, I like rice.",
            "Yes, I do. I like noodles.",
            "No, I like noodles."
        ],
        "answer": "Yes, I do. I like noodles.",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "What do you like to eat?",
        "options": [
            "I like carrots.",
            "I like blue.",
            "I like red."
        ],
        "answer": "I like carrots.",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "Do you like milk?",
        "options": [
            "Yes, I do. Milk is yummy.",
            "No, I like milk.",
            "I like juice."
        ],
        "answer": "Yes, I do. Milk is yummy.",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "What do you like to drink?",
        "options": [
            "I like bread.",
            "I like milk.",
            "I like rice."
        ],
        "answer": "I like milk.",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "找出不同类：rice / noodles / tomato / desk",
        "options": [
            "rice",
            "noodles",
            "tomato",
            "desk"
        ],
        "answer": "desk",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "找出不同类：bread / carrot / baozi / dog",
        "options": [
            "bread",
            "carrot",
            "baozi",
            "dog"
        ],
        "answer": "dog",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "找出不同类：milk / juice / water / apple",
        "options": [
            "milk",
            "juice",
            "water",
            "apple"
        ],
        "answer": "apple",
        "points": 10
    },
    {
        "unit": "一U1",
        "type": "choice",
        "question": "找出不同类：tomato / carrot / bread / mother",
        "options": [
            "tomato",
            "carrot",
            "bread",
            "mother"
        ],
        "answer": "mother",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "Little Tadpole can't find his ____.",
        "options": [
            "daddy",
            "mummy",
            "friend"
        ],
        "answer": "mummy",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "Little Tadpole's mummy has big ____.",
        "options": [
            "mouth",
            "eyes",
            "legs"
        ],
        "answer": "eyes",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "A frog has a ____ body.",
        "options": [
            "green",
            "red",
            "yellow"
        ],
        "answer": "green",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "A frog can ____, but a tortoise cannot.",
        "options": [
            "swim",
            "jump",
            "fly"
        ],
        "answer": "jump",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—Mummy! Mummy! —I am not your mummy. Your mummy has a big ____.",
        "options": [
            "tail",
            "mouth",
            "wing"
        ],
        "answer": "mouth",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "Little Tadpole has no tail. He is a ____.",
        "options": [
            "frog",
            "fish",
            "butterfly"
        ],
        "answer": "frog",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "I am in a cocoon. It is warm inside. I am a ____.",
        "options": [
            "tadpole",
            "caterpillar",
            "butterfly"
        ],
        "answer": "caterpillar",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "Little Tadpole says \"I am sorry\" because he ____.",
        "options": [
            "is happy",
            "finds his mummy",
            "calls the wrong mummy"
        ],
        "answer": "calls the wrong mummy",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—Hello, Little Tadpole. How are you? —____",
        "options": [
            "I am a frog.",
            "I am happy every day.",
            "I have a tail."
        ],
        "answer": "I am happy every day.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—What colour is the frog? —____",
        "options": [
            "It is green.",
            "It can jump.",
            "It is a frog."
        ],
        "answer": "It is green.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—Can a tortoise jump? —____",
        "options": [
            "Yes, it can.",
            "No, it cannot.",
            "It can swim."
        ],
        "answer": "No, it cannot.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—Who has a green body and big eyes? —____",
        "options": [
            "A duck.",
            "A frog.",
            "A goldfish."
        ],
        "answer": "A frog.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "—What does mummy frog say? —____",
        "options": [
            "I miss you.",
            "I do not like you.",
            "Go away."
        ],
        "answer": "I miss you.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你想告诉朋友“小蝌蚪找不到妈妈了”，应该说：",
        "options": [
            "Little Tadpole can't find his mummy.",
            "Little Tadpole is a frog.",
            "Little Tadpole can jump."
        ],
        "answer": "Little Tadpole can't find his mummy.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "金鱼对小蝌蚪说“你的妈妈有大嘴巴”，应该说：",
        "options": [
            "Your mummy has big eyes.",
            "Your mummy has a big mouth.",
            "Your mummy has a green body."
        ],
        "answer": "Your mummy has a big mouth.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你找到了妈妈，妈妈对你说“我想你了”，应该说：",
        "options": [
            "I am sorry.",
            "I miss you.",
            "I love you."
        ],
        "answer": "I miss you.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "小蝌蚪认错了妈妈，他对金鱼说什么？",
        "options": [
            "Thank you.",
            "I am sorry.",
            "I am happy."
        ],
        "answer": "I am sorry.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你想问同学“青蛙会飞吗？”，应该说：",
        "options": [
            "Can a frog fly?",
            "Can a frog jump?",
            "Is it a frog?"
        ],
        "answer": "Can a frog fly?",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你想告诉别人“蝴蝶的翅膀又大又漂亮”，应该说：",
        "options": [
            "The butterfly has big and beautiful wings.",
            "The butterfly can jump.",
            "The butterfly is small."
        ],
        "answer": "The butterfly has big and beautiful wings.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你在讲蝴蝶的生长过程，想说“我在茧里面”，应该说：",
        "options": [
            "I am in a cocoon.",
            "I am an egg.",
            "I am a caterpillar."
        ],
        "answer": "I am in a cocoon.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "choice",
        "question": "你想说“青蛙妈妈会抓苍蝇”，应该说：",
        "options": [
            "Mummy frog can fly.",
            "Mummy frog can catch flies.",
            "Mummy frog has a tail."
        ],
        "answer": "Mummy frog can catch flies.",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "tf",
        "question": "Little Tadpole's mummy is a duck.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "tf",
        "question": "A frog has a green body and big eyes.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "tf",
        "question": "A tortoise can jump.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "tf",
        "question": "A butterfly grows from an egg.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U6",
        "type": "tf",
        "question": "Little Tadpole says \"I am sorry\" to the goldfish and the tortoise.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Here you are. Thanks.” 的中文意思是？",
        "options": [
            "给你，谢谢。",
            "请关灯。",
            "请擦黑板。"
        ],
        "answer": "给你，谢谢。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Turn off the lights, please.” 的中文意思是？",
        "options": [
            "请开窗。",
            "请关灯。",
            "请擦黑板。"
        ],
        "answer": "请关灯。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Open the window, please.” 的中文意思是？",
        "options": [
            "请关窗。",
            "请开门。",
            "请开窗。"
        ],
        "answer": "请开窗。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Clean the blackboard, please.” 的中文意思是？",
        "options": [
            "请擦黑板。",
            "请关门。",
            "请收拾书包。"
        ],
        "answer": "请擦黑板。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Don’t draw on the blackboard, please.” 的中文意思是？",
        "options": [
            "请在黑板上画。",
            "请别在黑板上画。",
            "请擦桌子。"
        ],
        "answer": "请别在黑板上画。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Clean the desk.” 的中文意思是？",
        "options": [
            "擦黑板。",
            "擦桌子。",
            "关窗户。"
        ],
        "answer": "擦桌子。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Close the door.” 的中文意思是？",
        "options": [
            "开门。",
            "关门。",
            "关灯。"
        ],
        "answer": "关门。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "“Pack my schoolbag.” 的中文意思是？",
        "options": [
            "收拾书包。",
            "打开书包。",
            "背书包。"
        ],
        "answer": "收拾书包。",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "你想请同学坐下，应该说：",
        "options": [
            "Sit down, please.",
            "Close the door, please.",
            "Draw a picture, please."
        ],
        "answer": "Sit down, please.",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "你想向同学借橡皮，可以说：",
        "options": [
            "Here you are.",
            "Give me an eraser, please.",
            "Thanks."
        ],
        "answer": "Give me an eraser, please.",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "同学递给你橡皮，你接过之后应该说：",
        "options": [
            "You are welcome.",
            "Thanks.",
            "Don’t draw, please."
        ],
        "answer": "Thanks.",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "值日时，老师想让你擦黑板，会说：",
        "options": [
            "Clean the blackboard, please.",
            "Close the window, please.",
            "Turn off the lights, please."
        ],
        "answer": "Clean the blackboard, please.",
        "points": 10
    },
    {
        "unit": "一U2",
        "type": "choice",
        "question": "放学了，我们应该：",
        "options": [
            "Draw on the wall.",
            "Pack our schoolbags and close the door.",
            "Play in the classroom."
        ],
        "answer": "Pack our schoolbags and close the door.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "选出不同类：ride a bike / ride a scooter / rollerblade / park",
        "options": [
            "ride a bike",
            "ride a scooter",
            "rollerblade",
            "park"
        ],
        "answer": "park",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "选出不同类：play football / skateboard / swim / happy",
        "options": [
            "play football",
            "skateboard",
            "swim",
            "happy"
        ],
        "answer": "happy",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "选出不同类：I can run / I can fly a kite / I like apples / I can row a boat",
        "options": [
            "I can run",
            "I can fly a kite",
            "I like apples",
            "I can row a boat"
        ],
        "answer": "I like apples",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "选出不同类：father / mother / parents / ride a bike",
        "options": [
            "father",
            "mother",
            "parents",
            "ride a bike"
        ],
        "answer": "ride a bike",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "选出不同类：have a picnic / row a boat / fly a kite / yummy",
        "options": [
            "have a picnic",
            "row a boat",
            "fly a kite",
            "yummy"
        ],
        "answer": "yummy",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "—Can you swim? —____",
        "options": [
            "Yes, I can.",
            "No, I cannot swim.",
            "I like swimming."
        ],
        "answer": "Yes, I can.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "—What can you do? —____",
        "options": [
            "I can ride a bike.",
            "I like apples.",
            "Yes, I can."
        ],
        "answer": "I can ride a bike.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "—Can you rollerblade? —____",
        "options": [
            "Yes, I do.",
            "No, I cannot.",
            "I like rollerblading."
        ],
        "answer": "No, I cannot.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "—Who do you go to the park with? —____",
        "options": [
            "I go with my family.",
            "I go on Sunday.",
            "I play football."
        ],
        "answer": "I go with my family.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "—What do you do with your father? —____",
        "options": [
            "I fly a kite with him.",
            "Yes, I can.",
            "I like my father."
        ],
        "answer": "I fly a kite with him.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "你想问同学“你会踢足球吗？”，应该说：",
        "options": [
            "Do you like football?",
            "Can you play football?",
            "What is football?"
        ],
        "answer": "Can you play football?",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "同学问你“你会骑自行车吗？”，你会骑，应该说：",
        "options": [
            "Yes, I can.",
            "No, I cannot.",
            "I like riding a bike."
        ],
        "answer": "Yes, I can.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "你想告诉朋友“我会滑轮滑”，应该说：",
        "options": [
            "I can skateboard.",
            "I can rollerblade.",
            "I can ride a scooter."
        ],
        "answer": "I can rollerblade.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "你想告诉妈妈“我和爸爸一起放风筝”，应该说：",
        "options": [
            "I fly a kite with my father.",
            "I ride a bike with my father.",
            "I row a boat with my father."
        ],
        "answer": "I fly a kite with my father.",
        "points": 10
    },
    {
        "unit": "一U3",
        "type": "choice",
        "question": "你想说“周末我和家人去公园野餐”，应该说：",
        "options": [
            "I go to the park on weekend.",
            "I have a picnic with my family in the park.",
            "I play football with my friends."
        ],
        "answer": "I have a picnic with my family in the park.",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "Spring is green.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "Summer is cold.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "Winter is white.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "Autumn is yellow.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "It is hot. I can eat ice cream.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "It is cold. I can fly a kite.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "tf",
        "question": "I like autumn. I can see yellow leaves.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "Which season do you like?",
        "options": [
            "I like red.",
            "I like spring.",
            "I like run."
        ],
        "answer": "I like spring.",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "What colour is winter?",
        "options": [
            "It is white.",
            "It is hot.",
            "It is green."
        ],
        "answer": "It is white.",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "Can you swim in summer?",
        "options": [
            "Yes, it is cold.",
            "Yes, it is hot.",
            "No, it is winter."
        ],
        "answer": "Yes, it is hot.",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "选出不同类：spring / summer / hot / winter",
        "options": [
            "spring",
            "summer",
            "hot",
            "winter"
        ],
        "answer": "hot",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "选出不同类：warm / cool / cold / season",
        "options": [
            "warm",
            "cool",
            "cold",
            "season"
        ],
        "answer": "season",
        "points": 10
    },
    {
        "unit": "一U4",
        "type": "choice",
        "question": "选出不同类：hot / warm / cool / flower",
        "options": [
            "hot",
            "warm",
            "cool",
            "flower"
        ],
        "answer": "flower",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "I have a lemon. It is ____.",
        "options": [
            "red",
            "yellow",
            "green"
        ],
        "answer": "yellow",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "I have a watermelon. It is ____.",
        "options": [
            "red",
            "yellow",
            "green"
        ],
        "answer": "green",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "I have a peach. It is ____.",
        "options": [
            "pink",
            "yellow",
            "orange"
        ],
        "answer": "orange",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "I have an orange. It is ____.",
        "options": [
            "pink",
            "yellow",
            "orange"
        ],
        "answer": "orange",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—Do you like lemons? —No, I do not. They are ____.",
        "options": [
            "sweet",
            "sour",
            "juicy"
        ],
        "answer": "sour",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—Do you like pears? —Yes, I do. They are ____ and ____.",
        "options": [
            "sour / heavy",
            "sweet / juicy",
            "red / green"
        ],
        "answer": "sweet / juicy",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "They are red. They are sweet. They are on the tree. What are they?",
        "options": [
            "They are lemons.",
            "They are apples.",
            "They are watermelons."
        ],
        "answer": "They are apples.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "Strawberries grow on ____ plants.",
        "options": [
            "tall",
            "low",
            "big"
        ],
        "answer": "low",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—What do you have? —____",
        "options": [
            "I have a banana.",
            "I like bananas.",
            "It is yellow."
        ],
        "answer": "I have a banana.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—What colour is the lemon? —____",
        "options": [
            "It is sour.",
            "It is yellow.",
            "I have a lemon."
        ],
        "answer": "It is yellow.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—Do you like oranges? —____",
        "options": [
            "Yes, I do.",
            "I have an orange.",
            "It is orange."
        ],
        "answer": "Yes, I do.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—What are these? —____",
        "options": [
            "It is a pear.",
            "They are pears.",
            "I like pears."
        ],
        "answer": "They are pears.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—Does Dad like watermelons? —____",
        "options": [
            "Yes, he does.",
            "No, he does not.",
            "He likes apples."
        ],
        "answer": "No, he does not.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "—What fruit do you like? —____",
        "options": [
            "I like sweet fruit.",
            "I like red.",
            "I have a pear."
        ],
        "answer": "I like sweet fruit.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想告诉朋友“我有一个菠萝，它是黄色的”，应该说：",
        "options": [
            "I have a pineapple. It is yellow.",
            "I like pineapples. They are yellow.",
            "This is a pineapple. It is sweet."
        ],
        "answer": "I have a pineapple. It is yellow.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "妈妈问你“你喜欢柠檬吗？”，你不喜欢，应该说：",
        "options": [
            "Yes, I do.",
            "No, I do not. They are sour.",
            "I have a lemon."
        ],
        "answer": "No, I do not. They are sour.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想告诉朋友“西瓜很重”，应该说：",
        "options": [
            "The watermelon is sweet.",
            "The watermelon is heavy.",
            "The watermelon is green."
        ],
        "answer": "The watermelon is heavy.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想问对方“这些是什么？”，应该说：",
        "options": [
            "What are these?",
            "What are those?",
            "What is this?"
        ],
        "answer": "What are these?",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想告诉朋友“水果对我们有好处”，应该说：",
        "options": [
            "Fruit is good for us.",
            "I like fruit.",
            "Fruit is sweet."
        ],
        "answer": "Fruit is good for us.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "猜水果：它们是红色的，甜甜的，长在树上。你猜的是：",
        "options": [
            "They are strawberries.",
            "They are apples.",
            "They are peaches."
        ],
        "answer": "They are apples.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想问爸爸“你喜欢什么水果？”，应该说：",
        "options": [
            "What fruit do you like?",
            "Do you like fruit?",
            "What colour is the fruit?"
        ],
        "answer": "What fruit do you like?",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "你想告诉同学“我不喜欢吃西瓜”，应该说：",
        "options": [
            "I like watermelons.",
            "I do not like watermelons.",
            "Watermelons are sweet."
        ],
        "answer": "I do not like watermelons.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "What fruit does Mum like?",
        "options": [
            "Apples and bananas.",
            "Lemons and bananas.",
            "Peaches and oranges."
        ],
        "answer": "Apples and bananas.",
        "points": 10
    },
    {
        "unit": "一U5",
        "type": "choice",
        "question": "Who likes apples?",
        "options": [
            "Mum.",
            "Dad.",
            "Son."
        ],
        "answer": "Mum.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "What food do you like?",
        "options": [
            "I like red.",
            "I like noodles.",
            "I like run."
        ],
        "answer": "I like noodles.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "Do you like carrots?",
        "options": [
            "Yes, I do.",
            "No, I like.",
            "Yes, I like rice."
        ],
        "answer": "Yes, I do.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "Which season do you like?",
        "options": [
            "I like spring.",
            "I like hot.",
            "I like red."
        ],
        "answer": "I like spring.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想问妈妈“你喜欢什么食物？”，应该说：",
        "options": [
            "What food do you like?",
            "What season do you like?",
            "What colour do you like?"
        ],
        "answer": "What food do you like?",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你告诉朋友“我喜欢春天，因为春天很温暖”，应该说：",
        "options": [
            "I like summer. It is hot.",
            "I like winter. It is cold.",
            "I like spring. It is warm."
        ],
        "answer": "I like spring. It is warm.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想知道朋友会不会唱歌，可以问：",
        "options": [
            "Do you like singing?",
            "Can you sing?",
            "What can you sing?"
        ],
        "answer": "Can you sing?",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你看到一片红色的花，想说“它是红色的”，应该说：",
        "options": [
            "It is red.",
            "It is green.",
            "It is blue."
        ],
        "answer": "It is red.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想知道现在是什么季节，可以问：",
        "options": [
            "Which season do you like?",
            "What season is it?",
            "How is the weather?"
        ],
        "answer": "What season is it?",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想告诉朋友“我很喜欢胡萝卜”，应该说：",
        "options": [
            "I like carrots.",
            "I like tomatoes.",
            "I like noodles."
        ],
        "answer": "I like carrots.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你很喜欢吃面包，想告诉朋友，应该说：",
        "options": [
            "I like bread.",
            "I like rice.",
            "I like baozi."
        ],
        "answer": "I like bread.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你感觉很热，想吃冰淇淋，应该说：",
        "options": [
            "It is cold.",
            "It is warm.",
            "It is hot."
        ],
        "answer": "It is hot.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想告诉朋友“我会骑自行车”，应该说：",
        "options": [
            "I can play football.",
            "I can ride a bike.",
            "I like rice."
        ],
        "answer": "I can ride a bike.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想告诉朋友“我不喜欢面条”，应该说：",
        "options": [
            "I like noodles.",
            "I do not like noodles.",
            "No, I like noodles."
        ],
        "answer": "I do not like noodles.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想让同学把门打开，应该说：",
        "options": [
            "Close the window.",
            "Open the door.",
            "Clean the blackboard."
        ],
        "answer": "Open the door.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想告诉朋友“冬天很冷，我可以堆雪人”，应该说：",
        "options": [
            "It is hot. I can swim.",
            "It is cold. I can make a snowman.",
            "It is cool. I can fly a kite."
        ],
        "answer": "It is cold. I can make a snowman.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "你想知道朋友会不会踢足球，可以问：",
        "options": [
            "Do you like football?",
            "Can you play football?",
            "What is football?"
        ],
        "answer": "Can you play football?",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "—Do you like baozi? —____",
        "options": [
            "Yes, I like milk.",
            "No, I do not.",
            "I like run."
        ],
        "answer": "No, I do not.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "—What do we do in the classroom? —____",
        "options": [
            "I open the door.",
            "I fly a kite.",
            "I eat noodles."
        ],
        "answer": "I open the door.",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：noodles / rice / tomato / window",
        "options": [
            "noodles",
            "rice",
            "tomato",
            "window"
        ],
        "answer": "window",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：spring / summer / winter / desk",
        "options": [
            "spring",
            "summer",
            "winter",
            "desk"
        ],
        "answer": "desk",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：ride a bike / play football / blackboard / skateboard",
        "options": [
            "ride a bike",
            "play football",
            "blackboard",
            "skateboard"
        ],
        "answer": "blackboard",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：hot / warm / cold / door",
        "options": [
            "hot",
            "warm",
            "cold",
            "door"
        ],
        "answer": "door",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：carrot / bread / baozi / chair",
        "options": [
            "carrot",
            "bread",
            "baozi",
            "chair"
        ],
        "answer": "chair",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：autumn / cool / spring / winter",
        "options": [
            "autumn",
            "cool",
            "spring",
            "winter"
        ],
        "answer": "cool",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：run / jump / schoolbag / ride",
        "options": [
            "run",
            "jump",
            "schoolbag",
            "ride"
        ],
        "answer": "schoolbag",
        "points": 10
    },
    {
        "unit": "一下综合",
        "type": "choice",
        "question": "选出不同类：doll / ball / kite / rice",
        "options": [
            "doll",
            "ball",
            "kite",
            "rice"
        ],
        "answer": "rice",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "engExamImg",
        "image": "images/english_exam/image1.png",
        "question": "看图片，选择正确的英文句子。",
        "options": [
            "I can see the flowers.",
            "I can smell the flowers.",
            "I can hear the flowers."
        ],
        "answer": "I can smell the flowers.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "engExamImg",
        "image": "images/english_exam/image2.png",
        "question": "看图片，选择正确的英文句子。",
        "options": [
            "I can hear the birds.",
            "I can see the birds.",
            "I can taste the birds."
        ],
        "answer": "I can hear the birds.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "engExamImg",
        "image": "images/english_exam/image3.png",
        "question": "看图片，选择正确的英文句子。",
        "options": [
            "I can see the rabbit.",
            "I can smell the rabbit.",
            "I can feel the rabbit."
        ],
        "answer": "I can feel the rabbit.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "engExamImg",
        "image": "images/english_exam/image4.png",
        "question": "看图片，选择正确的英文句子。",
        "options": [
            "I can taste the lollipop.",
            "I can see the lollipop.",
            "I can hear the lollipop."
        ],
        "answer": "I can taste the lollipop.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "engExamImg",
        "image": "images/english_exam/image5.png",
        "question": "看图片，选择正确的英文句子。",
        "options": [
            "It is soft.",
            "It is hard.",
            "It is thin."
        ],
        "answer": "It is hard.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "“I can see a cat.” 的中文意思是？",
        "options": [
            "我能闻到花香。",
            "我能看见一只猫。",
            "我能听到一只猫叫。",
            "我能感受到风。"
        ],
        "answer": "我能看见一只猫。",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "“I can hear a cat.” 的中文意思是？",
        "options": [
            "我能闻到花香。",
            "我能看见一只猫。",
            "我能听到一只猫叫。",
            "我能感受到风。"
        ],
        "answer": "我能听到一只猫叫。",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "“I can smell the flowers.” 的中文意思是？",
        "options": [
            "我能闻到花香。",
            "我能看见一只猫。",
            "我能听到一只猫叫。",
            "我能感受到风。"
        ],
        "answer": "我能闻到花香。",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "“I can taste the apples.” 的中文意思是？",
        "options": [
            "我能闻到花香。",
            "我能看见一只猫。",
            "我能听到一只猫叫。",
            "我能尝到苹果的味道。"
        ],
        "answer": "我能尝到苹果的味道。",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "“I can feel the wind.” 的中文意思是？",
        "options": [
            "我能闻到花香。",
            "我能看见一只猫。",
            "我能感受到风。",
            "我能尝到苹果的味道。"
        ],
        "answer": "我能感受到风。",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "tf",
        "question": "I can see with my eyes.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "tf",
        "question": "I can hear with my nose.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "tf",
        "question": "I can smell with my nose.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "tf",
        "question": "The stone is soft.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "× 错误",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "tf",
        "question": "I can taste with my tongue.",
        "options": [
            "√ 正确",
            "× 错误"
        ],
        "answer": "√ 正确",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "I can ____ the flowers with my nose.",
        "options": [
            "see",
            "hear",
            "smell",
            "taste"
        ],
        "answer": "smell",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "I can ____ the birds with my ears.",
        "options": [
            "see",
            "hear",
            "smell",
            "taste"
        ],
        "answer": "hear",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "I can ____ the rabbit with my hands.",
        "options": [
            "see",
            "hear",
            "feel",
            "taste"
        ],
        "answer": "feel",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "I can ____ the lollipop with my tongue.",
        "options": [
            "see",
            "hear",
            "smell",
            "taste"
        ],
        "answer": "taste",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "I can ____ a cat with my eyes.",
        "options": [
            "see",
            "hear",
            "smell",
            "taste"
        ],
        "answer": "see",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "你想问朋友能看到什么，应该说：",
        "options": [
            "What can you see?",
            "What can you hear?",
            "What can you smell?"
        ],
        "answer": "What can you see?",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "你听到了小猫的叫声，你可以说：",
        "options": [
            "I can see a kitten.",
            "I can hear a kitten.",
            "I can taste a kitten."
        ],
        "answer": "I can hear a kitten.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "老师让你摸一个东西，你摸到它很软，可以说：",
        "options": [
            "It is hard.",
            "It is soft.",
            "It is thin."
        ],
        "answer": "It is soft.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "朋友递给你一朵花让你闻，你说：",
        "options": [
            "I can smell flowers.",
            "I can see flowers.",
            "I can hear flowers."
        ],
        "answer": "I can smell flowers.",
        "points": 10
    },
    {
        "unit": "二上U1",
        "type": "choice",
        "question": "你想表达“我能用手和手指触摸和感觉”，应该说：",
        "options": [
            "I can see and hear with my eyes and ears.",
            "I can touch and feel with my hands and fingers.",
            "I can smell and taste with my nose and tongue."
        ],
        "answer": "I can touch and feel with my hands and fingers.",
        "points": 10
    },
    {
        "unit": "一上",
        "type": "choice",
        "question": "What colour is the apple?",
        "options": [
            "It is an apple.",
            "It is red.",
            "I like apples."
        ],
        "answer": "It is red.",
        "points": 10
    }
];

if (typeof window !== 'undefined') { window.ENGLISH_EXAM_BANK = ENGLISH_EXAM_BANK; }
