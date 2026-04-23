const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const extractTopicsFromSyllabus = async (pdfText, subjectName, examScope) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `You are an expert academic advisor. Extract the MOST IMPORTANT study topics from this ${subjectName} syllabus.

PDF Text:
${pdfText.slice(0, 3000)}

Exam Scope: "${examScope}"

Rules:
- Extract maximum 20 most important topics within the exam scope
- Each topic must be specific and studyable
- Prioritize core concepts over minor details
- Ignore page numbers, headers, footers, college names
- Return ONLY a JSON array of strings, nothing else

Output ONLY the JSON array:`
      }
    ]
  })

  const text = completion.choices[0].message.content
  console.log('Groq extract response:', text)
  const jsonMatch = text.match(/\[[\s\S]*?\]/)
  if (!jsonMatch) return []
  return JSON.parse(jsonMatch[0])
}

const generateStudyPlan = async (subjects, examDate, hoursPerDay, mode) => {
  const daysRemaining = Math.ceil(
    (new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  // Limit topics to prevent token overflow
  const limitedSubjects = subjects.map(s => ({
    name: s.name,
    topics: s.topics.slice(0, 15)
  }))

  const subjectSummary = limitedSubjects.map(s =>
    `Subject: ${s.name}\nTopics: ${s.topics.join(', ')}`
  ).join('\n\n')

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 6000,
    messages: [
      {
        role: 'user',
        content: `You are an expert exam preparation coach. Create an efficient exam-focused study plan.

Student Profile:
- Days until exam: ${daysRemaining}
- Study hours per day: ${hoursPerDay} hours
- Mode: ${mode === 'first-time' ? 'First time learning' : 'Revision mode'}

Subjects & Topics:
${subjectSummary}

STRICT Rules:
1. Max ${Math.ceil(hoursPerDay / 2)} tasks per day
2. Each task duration: Easy=1hr, Medium=2hr, Hard=3hr
3. Total hours per day must NOT exceed ${hoursPerDay}
4. Mix subjects across days
5. Last 2 days = revision only
6. Return ONLY valid JSON array, no markdown, no backticks, no extra text

JSON format:
[{"day":1,"date":"Day 1","tasks":[{"subject":"name","topic":"name","duration":"2 hours","difficulty":"Medium","tip":"specific tip"}]}]`
      }
    ]
  })

  const text = completion.choices[0].message.content
  console.log('Groq plan preview:', text.slice(0, 300))

  // Clean response — remove markdown backticks if present
  const cleaned = text.replace(/```json|```/g, '').trim()
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Invalid AI response format')
  return JSON.parse(jsonMatch[0])
}

const analyzePYQ = async (pdfText, subjectName) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are an expert exam analyzer. Analyze these previous year question papers for ${subjectName} and identify the most important topics.

PYQ Text:
${pdfText.slice(0, 4000)}

Instructions:
1. Identify topics that appear most frequently across questions
2. Rate each topic's importance: Very High, High, Medium, Low
3. Give a frequency score 1-10 (how often it appears)
4. Give a specific reason why it's important
5. Return maximum 15 most important topics
6. Return ONLY valid JSON, no markdown, no backticks

JSON format:
{
  "topics": [
    {
      "topic": "topic name",
      "frequency": 8,
      "importance": "Very High",
      "reason": "Asked in 4 out of 5 years"
    }
  ],
  "summary": "2-3 line overall exam pattern summary"
}`
      }
    ]
  })

  const text = completion.choices[0].message.content
  console.log('PYQ analysis preview:', text.slice(0, 300))

  const cleaned = text.replace(/```json|```/g, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid AI response')
  return JSON.parse(jsonMatch[0])
}

const askDoubtBot = async (question, subject, conversationHistory) => {
  const messages = [
    {
      role: 'user',
      content: `You are an expert academic tutor helping a student prepare for exams. 
You specialize in explaining concepts clearly and concisely.
The student is asking about: ${subject || 'General academics'}

Rules:
- Give clear, exam-focused answers
- Use examples where helpful
- Keep answers concise but complete
- If it's a concept, explain it simply
- If it's a problem, solve it step by step
- End with a quick exam tip when relevant`
    },
    { role: 'assistant', content: 'I understand! I am your personal AI tutor. Ask me anything about your subjects and I will give you clear, exam-focused explanations.' },
    ...conversationHistory,
    { role: 'user', content: question }
  ]

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages
  })

  return completion.choices[0].message.content
}

module.exports = { extractTopicsFromSyllabus, generateStudyPlan, analyzePYQ, askDoubtBot }
