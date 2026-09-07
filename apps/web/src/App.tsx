import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Question = {
  id: number
  text: string
  options: string[]
}

type QuestionResult = {
  questionId: number
  correct: boolean
  correctIndex: number
  selectedIndex: number
  explanation: string
}

type QuizResult = {
  score: number
  total: number
  results: QuestionResult[]
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

type Status = 'loading' | 'error' | 'playing' | 'submitting' | 'done'

function App() {
  const [status, setStatus] = useState<Status>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE}/quiz/questions`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Question[]) => {
        setQuestions(data)
        setStatus('playing')
      })
      .catch((err) => {
        setError(String(err))
        setStatus('error')
      })
  }, [])

  const answeredCount = Object.keys(answers).length
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0
  const resultsById = useMemo(
    () => new Map((result?.results ?? []).map((r) => [r.questionId, r])),
    [result],
  )

  const selectAnswer = (questionId: number, index: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }))
  }

  const submit = async () => {
    setStatus('submitting')
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          selectedIndex: answers[q.id] ?? -1,
        })),
      }
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: QuizResult = await res.json()
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(String(err))
      setStatus('error')
    }
  }

  const restart = () => {
    setAnswers({})
    setResult(null)
    setCurrent(0)
    setStatus('playing')
  }

  if (status === 'loading') {
    return (
      <main className="quiz-shell">
        <div className="quiz-card center">
          <div className="spinner" />
          <p>Đang tải câu hỏi…</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="quiz-shell">
        <div className="quiz-card center">
          <p className="error-text">⚠️ Đã xảy ra lỗi: {error}</p>
        </div>
      </main>
    )
  }

  if (status === 'done' && result) {
    const percent = Math.round((result.score / result.total) * 100)
    return (
      <main className="quiz-shell">
        <div className="quiz-card">
          <div className="score-hero">
            <div className="score-ring" style={{ '--percent': `${percent}%` } as React.CSSProperties}>
              <span>{percent}%</span>
            </div>
            <h1>Bạn đạt {result.score}/{result.total} câu</h1>
            <p className="subtitle">Quiz: Spec-Driven Development (SDD)</p>
          </div>

          <ol className="review-list">
            {questions.map((q) => {
              const r = resultsById.get(q.id)
              return (
                <li key={q.id} className={`review-item ${r?.correct ? 'is-correct' : 'is-incorrect'}`}>
                  <div className="review-header">
                    <span className="badge">{r?.correct ? '✔' : '✘'}</span>
                    <p className="question-text">{q.text}</p>
                  </div>
                  <p className="answer-line">
                    Bạn chọn:{' '}
                    <strong>
                      {r && r.selectedIndex >= 0 ? q.options[r.selectedIndex] : '(chưa trả lời)'}
                    </strong>
                  </p>
                  {!r?.correct && r && r.correctIndex >= 0 && (
                    <p className="answer-line">
                      Đáp án đúng: <strong>{q.options[r.correctIndex]}</strong>
                    </p>
                  )}
                  <p className="explanation">{r?.explanation}</p>
                </li>
              )
            })}
          </ol>

          <button type="button" className="btn-primary" onClick={restart}>
            🔄 Làm lại
          </button>
        </div>
      </main>
    )
  }

  const q = questions[current]

  return (
    <main className="quiz-shell">
      <div className="quiz-card">
        <header className="quiz-header">
          <h1>Quiz: Spec-Driven Development</h1>
          <p className="subtitle">Câu {current + 1} / {questions.length}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </header>

        {q && (
          <div className="question-card" key={q.id}>
            <p className="question-text">{q.text}</p>
            <ul className="options">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className={`option-btn ${answers[q.id] === idx ? 'selected' : ''}`}
                    onClick={() => selectAnswer(q.id, idx)}
                  >
                    <span className="option-letter">{OPTION_LABELS[idx]}</span>
                    <span>{opt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="nav-row">
          <button
            type="button"
            className="btn-ghost"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            ← Trước
          </button>

          <div className="dots">
            {questions.map((qq, idx) => (
              <button
                key={qq.id}
                type="button"
                className={`dot ${idx === current ? 'active' : ''} ${answers[qq.id] !== undefined ? 'filled' : ''}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Câu ${idx + 1}`}
              />
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button type="button" className="btn-primary" onClick={() => setCurrent((c) => c + 1)}>
              Tiếp →
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={status === 'submitting' || answeredCount !== questions.length}
              onClick={submit}
            >
              {status === 'submitting' ? 'Đang nộp…' : '✅ Nộp bài'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default App
