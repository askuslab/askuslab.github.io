let currentQuestion = 0;
let answers = [];

const startContainer = document.getElementById('start-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');

// 기본 조언 데이터 추가
const defaultAdvice = {
    CP: {
        description: "비판적이고 엄격한 부모의 역할을 주로 사용합니다. 원칙과 규칙을 중시하며, 책임감이 강하고 완벽주의적 성향을 보입니다.",
        issues: "너무 엄격하면 유연성이 부족해지고, 타인과의 갈등이 생길 수 있습니다.",
        growth: [
            "완벽주의를 조금 완화하여 더 유연한 사고를 기르기",
            "타인의 관점을 이해하려는 노력하기",
            "긍정적인 피드백을 주는 습관 기르기"
        ],
        relationship: [
            "상대방의 감정을 먼저 공감하기",
            "지시보다는 제안하는 방식으로 소통하기",
            "칭찬과 격려를 적극적으로 활용하기"
        ],
        goals: [
            "단계별 목표 설정으로 압박감 줄이기",
            "성취 과정에서의 학습에 집중하기"
        ]
    },
    NP: {
        description: "양육적이고 지지적인 부모의 역할을 주로 사용합니다. 타인을 돌보고 보호하는 데 능하며, 공감 능력이 뛰어납니다.",
        issues: "너무 많이 돌보려다 보면 자신의 필요를 소홀히 할 수 있고, 의존성을 조장할 수 있습니다.",
        growth: [
            "자신의 필요와 욕구도 소중히 여기기",
            "적절한 경계선 설정하기",
            "자신의 성장에도 시간 투자하기"
        ],
        relationship: [
            "상호 존중하는 관계 만들기",
            "지지와 함께 성장을 독려하기",
            "건강한 의존 관계 형성하기"
        ],
        goals: [
            "자신의 목표도 우선순위에 두기",
            "균형 잡힌 삶의 방향 설정하기"
        ]
    },
    A: {
        description: "객관적이고 이성적인 성인의 역할을 주로 사용합니다. 논리적 사고와 분석 능력이 뛰어나며, 사실에 기반한 판단을 합니다.",
        issues: "감정적 표현이 부족하여 인간관계에서 차갑게 보일 수 있고, 직관적 판단이 부족할 수 있습니다.",
        growth: [
            "감정 인식과 표현 능력 개발하기",
            "직관과 창의성 활용하기",
            "감정적 지능 향상하기"
        ],
        relationship: [
            "감정적 소통의 중요성 인식하기",
            "공감과 이해를 바탕으로 한 관계 형성하기",
            "논리와 감정의 균형 찾기"
        ],
        goals: [
            "감정적 만족도도 목표에 포함하기",
            "창의적 문제 해결 능력 개발하기"
        ]
    },
    FC: {
        description: "자유롭고 창의적인 어린이의 역할을 주로 사용합니다. 호기심이 많고 즉흥적이며, 창의성과 재미를 추구합니다.",
        issues: "책임감이 부족할 수 있고, 일상적인 업무나 규칙을 따르는 데 어려움을 겪을 수 있습니다.",
        growth: [
            "책임감과 계획성 개발하기",
            "장기적 관점에서의 사고 기르기",
            "자기 통제력 향상하기"
        ],
        relationship: [
            "타인의 감정과 상황 고려하기",
            "약속과 책임의 중요성 인식하기",
            "즉흥성과 계획의 균형 찾기"
        ],
        goals: [
            "단계별 계획 수립과 실행하기",
            "창의성을 실용적으로 활용하기"
        ]
    },
    AC: {
        description: "순응적이고 적응적인 어린이의 역할을 주로 사용합니다. 타인의 기대에 맞추려고 노력하며, 갈등을 피하는 경향이 있습니다.",
        issues: "자신의 의견을 표현하지 못하고, 자기 주장이 부족하여 억압받는 느낌을 받을 수 있습니다.",
        growth: [
            "자신의 의견과 감정 표현하기",
            "자기 주장과 경계선 설정하기",
            "자신의 가치관 확립하기"
        ],
        relationship: [
            "건강한 갈등 해결 방법 배우기",
            "상호 존중하는 관계 형성하기",
            "자신의 필요도 소중히 여기기"
        ],
        goals: [
            "자신의 목표를 우선시하기",
            "자신감과 자존감 향상하기"
        ]
    }
};

// 시작 페이지에서 퀴즈 시작
function startQuiz() {
    startContainer.style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        questionContainer.innerHTML = `
            <h2>질문 ${currentQuestion + 1}</h2>
            <p>${question.text}</p>
            <button onclick="answerQuestion(3)">항상 그렇다</button>
            <button onclick="answerQuestion(2)">자주 그렇다</button>
            <button onclick="answerQuestion(1)">가끔 그렇다</button>
            <button onclick="answerQuestion(0)">전혀 그렇지 않다</button>
        `;
    } else {
        calculateResult();
    }
}

function answerQuestion(score) {
    answers.push({ question: currentQuestion, score: score });
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        calculateResult();
    }
}

async function getGeminiAdvice(maxType, minType) {
    const API_KEY = 'AIzaSyAwWH15O5eCQXz908jTcPUkWuE_mYbgBfQ';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const prompt = `당신은 심리 상담가입니다. 교류분석(TA) 진단 결과를 바탕으로 조언을 해주세요. 
    다음은 각 에너지 유형에 대한 설명입니다:

    CP (Critical Parent): 비판적이고 엄격한 부모의 역할
    NP (Nurturing Parent): 양육적이고 지지적인 부모의 역할
    A (Adult): 객관적이고 이성적인 성인의 역할
    FC (Free Child): 자유롭고 창의적인 어린이의 역할
    AC (Adapted Child): 순응적이고 적응적인 어린이의 역할

    가장 높은 에너지 유형은 ${maxType}이고, 가장 낮은 에너지 유형은 ${minType}입니다. 
    다음 형식으로 응답해주세요:
    
    1. 가장 많이 사용하는 에너지 유형 (${maxType}) 설명:
    (설명을 여기에 작성)
    
    2. 가장 사용하지 않는 에너지라서 발생하는 이슈 (${minType}) 설명:
    (설명을 여기에 작성)
    
    3. 개인의 성장을 위한 조언:
    - (조언 1)
    - (조언 2)
    - (조언 3)
    
    4. 대인 관계 개선을 위한 조언:
    - (조언 1)
    - (조언 2)
    - (조언 3)
    
    5. 목표 설정과 성취:
    - (목표 설정 방법)
    - (성취 전략)
    
    각 섹션을 명확히 구분하고, 구체적이고 실행 가능한 조언을 제공해주세요. 별표(*) 사용을 피해주세요.`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 오류:', response.status, errorText);
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('API 응답 구조 오류:', data);
            throw new Error('API 응답 구조가 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('Gemini API 오류:', error);
        
        // API 오류 시 기본 조언 제공
        return getDefaultAdvice(maxType, minType);
    }
}

// 기본 조언 생성 함수
function getDefaultAdvice(maxType, minType) {
    const maxAdvice = defaultAdvice[maxType];
    const minAdvice = defaultAdvice[minType];
    
    return `1. 가장 많이 사용하는 에너지 유형 (${maxType}) 설명:
${maxAdvice.description}

2. 가장 사용하지 않는 에너지라서 발생하는 이슈 (${minType}) 설명:
${minAdvice.issues}

3. 개인의 성장을 위한 조언:
• ${maxAdvice.growth[0]}
• ${maxAdvice.growth[1]}
• ${maxAdvice.growth[2]}

4. 대인 관계 개선을 위한 조언:
• ${maxAdvice.relationship[0]}
• ${maxAdvice.relationship[1]}
• ${maxAdvice.relationship[2]}

5. 목표 설정과 성취:
• ${maxAdvice.goals[0]}
• ${maxAdvice.goals[1]}`;
}

// 텍스트 포맷팅 함수 추가
function formatAdviceText(text) {
    return text
        .replace(/\n\n/g, '</p><p>')  // 이중 줄바꿈을 새로운 단락으로
        .replace(/\n/g, '<br>')       // 단일 줄바꿈을 <br>로
        .replace(/\*\*/g, '')         // 별표 제거
        .replace(/\(|\)/g, '')        // 괄호 제거
        .replace(/1\./g, '<strong>1.</strong>')  // 번호 강조
        .replace(/2\./g, '<strong>2.</strong>')
        .replace(/3\./g, '<strong>3.</strong>')
        .replace(/4\./g, '<strong>4.</strong>')
        .replace(/5\./g, '<strong>5.</strong>')
        .replace(/- /g, '• ');        // 하이픈을 불릿으로
}

async function calculateResult() {
    const energyTypes = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
    
    answers.forEach((answer, index) => {
        energyTypes[questions[index].type] += answer.score;
    });

    const labels = Object.keys(energyTypes);
    const data = Object.values(energyTypes);

    const maxType = labels[data.indexOf(Math.max(...data))];
    const minType = labels[data.indexOf(Math.min(...data))];

    document.getElementById('quiz-container').style.display = 'none';
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <h2>진단 결과</h2>
        <p style="font-size: 21px;">가장 많이 사용하는 에너지는 ${maxType}이고, 가장 사용하지 않는 에너지는 ${minType}입니다.</p>
        <div style="height: 300px;">
            <canvas id="resultChart"></canvas>
        </div>
        <div id="advice">
            <div class="loading">분석 중입니다...</div>
        </div>
    `;

    const ctx = document.getElementById('resultChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(75, 192, 192)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...data) + 5,
                    ticks: {
                        font: {
                            size: 14,
                            family: "'Pretendard', sans-serif"
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 14,
                            family: "'Pretendard', sans-serif"
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                },
                point: {
                    radius: 6,
                    hitRadius: 10,
                    hoverRadius: 8
                }
            }
        }
    });

    try {
        const advice = await getGeminiAdvice(maxType, minType);
        const formattedAdvice = formatAdviceText(advice);
        document.getElementById('advice').innerHTML = `
            <h3>추가 분석 결과</h3>
            <div class="advice-content">
                <p>${formattedAdvice}</p>
            </div>
        `;
    } catch (error) {
        console.error('조언 생성 오류:', error);
        document.getElementById('advice').innerHTML = `
            <h3>추가 분석 결과</h3>
            <div class="advice-content">
                <p>분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
            </div>
        `;
    }
}

// 페이지 로드 시 시작 페이지 표시
document.addEventListener('DOMContentLoaded', function() {
    startContainer.style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    resultContainer.style.display = 'none';
});