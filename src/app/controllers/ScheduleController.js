import * as Yup from 'yup'
import { resolve } from 'path'
import fs from 'fs'
import { uuid } from 'uuidv4'
import { parseISO } from 'date-fns'
import { format } from 'date-fns-tz'

import loadData from '../../util/loadData'

const file = resolve(__dirname, '..', '..', 'database', 'schedules.json')

class ScheduleController {
  async index(req, res) {
    const schedules = await (await loadData(file)).map((schedule) => {
      const day = parseISO(schedule.day)
      return {
        ...schedule,
        day: format(day, 'dd-MM-yyyy', { timeZone: 'America/Sao_Paulo' }),
      }
    })

    return res.json({ schedules })
  }

  async listByInterval(req, res) {
    const schedules = await loadData(file)

    const { startDate, endDate } = req.query

    const schedulesWithDateParsed = schedules.map((item) => {
      return {
        ...item,
        date: parseISO(item.day),
      }
    })

    const sortedSchedules = schedulesWithDateParsed.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA - dateB
    })

    const start = format(parseISO(startDate), 'dd/MM/yyyy', {
      timeZone: 'America/Sao_Paulo',
    })
    const end = format(parseISO(endDate), 'dd/MM/yyyy', {
      timeZone: 'America/Sao_Paulo',
    })

    const schedulesInterval = sortedSchedules
      .filter((item) => {
        const date = format(item.date, 'dd/MM/yyyy', {
          timeZone: 'America/Sao_Paulo',
        })

        return date >= start && date <= end
      })
      .map((schedule) => ({
        day: format(schedule.date, 'dd-MM-yyyy', {
          timeZone: 'America/Sao_Paulo',
        }),
        intervals: schedule.intervals,
      }))

    return res.json({ schedulesInterval })
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      day: Yup.date().nullable(),
      daily: Yup.bool().required(),
      weekly: Yup.bool().required(),
      weekDay: Yup.array(
        Yup.string().matches(
          /(all|sunday|monday|tuesday|wednesday|thursday|friday|saturday)/
        )
      ).nullable(),
      intervals: Yup.array().of(
        Yup.object().shape({
          start: Yup.string().required(),
          end: Yup.string().required(),
        })
      ),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message:
          'Falha na validação dos dados. Verifique se todos os campos foram corretamente preenchidos.',
      })
    }

    const { day, intervals, daily, weekly, weekDay } = req.body

    if (!day && !daily && !weekly) {
      return res.status(400).json({
        message:
          'Um agendamento precisa ter uma data, ou ser em base diária ou semanal.',
      })
    }

    if (day && (daily || weekly)) {
      return res.status(400).json({
        message:
          'Se o agendamento for para uma data específica, as opções "diariamente" ou "semanalmente" não devem ser escolhidas.',
      })
    }

    if (weekly && !weekDay) {
      return res.status(400).json({
        message:
          'Para um agendamento semanal, é necessário informar os dias da semana disponíveis.',
      })
    }

    if (!weekly && weekDay) {
      return res.status(400).json({
        message:
          'Só é permitida a escolha de um dia da semana para os agendamentos semanais.',
      })
    }

    const schedules = await loadData(file)

    const dayFormatted = day
      ? format(new Date(day), 'yyyy-MM-dd', { timeZone: 'America/Sao_Paulo' })
      : null

    const intervalsFormatted = intervals.map((item) => {
      return {
        start: format(parseISO(item.start), 'hh:mm', {
          timeZone: 'America/Sao_Paulo',
        }),
        end: format(parseISO(item.end), 'hh:mm', {
          timeZone: 'America/Sao_Paulo',
        }),
      }
    })

    const scheduleDateExists = schedules.find(
      (item) => item.day === dayFormatted
    )

    schedules.forEach((sched) => {
      if (dayFormatted === sched.day) {
        intervalsFormatted.map((item) => {
          if (sched.intervals.find((s) => s.start === item.start)) {
            return res.status(400).json({
              message: 'Já existe um agendamento feito nessa data e horário.',
            })
          }
        })
      }
    })

    if (scheduleDateExists) {
      return res.status(400).json({
        message: 'Já existe um agendamento feito nessa data e horário.',
      })
    }

    const schedule = {
      id: uuid(),
      day: dayFormatted,
      intervals: intervalsFormatted,
      daily,
      weekly,
      weekDay,
    }

    schedules.push({ ...schedule })

    await fs.writeFileSync(file, JSON.stringify(schedules), function(err) {
      if (err) throw err
    })

    return res.json({ schedule })
  }

  async destroy(req, res) {
    const { id } = req.params

    const schedules = await loadData(file)

    const scheduleIndex = schedules.findIndex((item) => item.id === id)

    if (scheduleIndex < 0) {
      return res.status(400).json({ message: 'Agendamento não encontrado.' })
    }

    schedules.splice(scheduleIndex, 1)

    await fs.writeFileSync(file, JSON.stringify(schedules), function(err) {
      if (err) throw err
    })

    return res.json({ schedules })
  }
}

export default new ScheduleController()
