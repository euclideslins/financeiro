import axios from 'axios'
import express from 'express'

const app = express()
app.use(express.json())

const MODEL = 'llama3.2'

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body
        const { data } = await axios.post('http://localhost:11434/api/chat', {
            model: MODEL,
            messages: [{ role: 'user', content: message }],
            stream: false
        })
        const answer = data?.message?.content ?? ''
        res.json({ reply: answer })
    } catch (err) {
        console.error(err?.response?.data || err.message)
        res.status(500).json({ error: 'Falha ao chamar LLM local' })
    }
})

app.post('/chat-stream', async (req, res) => {
    try {
        const { message } = req.body
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const resp = await axios.post(
            'http://localhost:11434/api/chat',
            {
                model: MODEL,
                messages: [{ role: 'user', content: message }],
                stream: true
            },
            { responseType: 'stream' }
        )

        resp.data.on('data', (chunk) => {
            res.write(`data: ${chunk.toString()}\n\n`)
        })
        resp.data.on('end', () => {
            res.write('data: [DONE]\n\n')
            res.end()
        })
    } catch (err) {
        console.error(err?.response?.data || err.message)
        res.status(500).end()
    }
})

app.listen(3001, () => {
    console.log('✅ LLM local on http://localhost:3001')
    console.log('POST /chat  | body: { "message": "Seu prompt" }')
    console.log('POST /chat-stream  | body: { "message": "Seu prompt" }')
})
