import express from 'express'
import { z } from 'zod'

import ReportService from './report/report.service'
import 'reflect-metadata'

const app = express()
const reportService = ReportService.getInstance()

app.use(express.json())

app.get('/get-report', async ({ query }, res) => {
  const schema = z.object({
    order: z.literal('ASC').or(z.literal('DESC')).optional(),
    year: z.preprocess(Number, z.number().optional()).optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
  })

  const parser = schema.safeParse(query)

  if (!parser.success) {
    return res.status(400).json({
      error: parser.error,
    })
  }
  const { order, year, startDate, endDate } = parser.data
  const date = startDate && endDate ? { startDate, endDate } : undefined
  try {
    const reference = await reportService.getReport(order, year, date)
    res.json(reference)
  } catch (_e) {
    res.status(500).json({
      error: 'something went wrong during the report fetching',
    })
  }
})

app.post('/generate-report', async (req, res) => {
  try {
    await reportService.generateReports()
    res.json({
      message: 'Reports generated successfully!',
    })
  } catch (_e) {
    res.status(500).json({
      error: 'something went wrong during the report generation',
    })
  }
})

app.listen(3000, () => console.log('🚀 Server ready at: http://localhost:3000'))
