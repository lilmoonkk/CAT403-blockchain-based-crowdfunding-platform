const express = require('express')
const config = require('./config')
const userRouter = require('./router/user')
const projectRouter = require('./router/project')
const campaignRouter = require('./router/campaign')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json())
app.use('/user', userRouter)
app.use('/project', projectRouter)
app.use('/campaign', campaignRouter)

app.listen(config.server.port, () => {
  console.log(`Example app listening on port ${config.server.port}`)
})