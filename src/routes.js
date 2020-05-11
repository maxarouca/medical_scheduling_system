import { Router } from 'express'

import UserController from './app/controllers/UserController'
import LoginController from './app/controllers/LoginController'
import ScheduleController from './app/controllers/ScheduleController'
// import TaxController from './app/controllers/TaxController'

import authMiddleware from './middlewares/auth'

const routes = new Router()

routes.get('/', (req, res) => {
  res.send('Medical Scheduling System API')
})

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.put('/users', authMiddleware, UserController.update)

routes.post('/login', LoginController.store)

routes.get('/schedules', authMiddleware, ScheduleController.index)
routes.get(
  '/schedules/interval',
  authMiddleware,
  ScheduleController.listByInterval
)
routes.post('/schedules', authMiddleware, ScheduleController.store)
routes.delete('/schedules/:id', authMiddleware, ScheduleController.destroy)

// routes.get('/tax', authMiddleware, TaxController.index)

export default routes
